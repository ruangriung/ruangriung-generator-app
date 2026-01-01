
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();
        const prompt = searchParams.get('prompt'); // Using 'prompt' as the text content from our client

        if (!prompt) {
            return NextResponse.json({ message: 'Prompt/Text is required' }, { status: 400 });
        }

        // User example: request('https://gen.pollinations.ai/text/Write a haiku...?model=openai&...')
        const baseUrl = 'https://gen.pollinations.ai/text';
        const finalUrl = `${baseUrl}/${encodeURIComponent(prompt)}?${queryString}`;

        const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;

        const headers: HeadersInit = {};
        if (POLLINATIONS_API_KEY) {
            headers['Authorization'] = `Bearer ${POLLINATIONS_API_KEY}`;
        }

        const response = await fetch(finalUrl, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ message: `Pollinations API Error: ${response.statusText}`, error: errorText }, { status: response.status });
        }

        // Text API usually returns raw text or JSON depending on 'json' param.
        // The user example shows `const { statusCode, body } = await request(...)` which implies it might be text or JSON.
        // If we assume it returns text by default unless json=true.
        // Let's just forward the content type.

        const contentType = response.headers.get('Content-Type');
        const data = await response.text();

        return new NextResponse(data, {
            headers: {
                'Content-Type': contentType || 'text/plain',
            },
            status: 200
        });

    } catch (error: any) {
        console.error('Error in Pollinations Text Proxy:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

// Support POST as well if the client prefers sending JSON body
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { messages, model, json, seed, temperature } = body;

        // Construct prompt from messages if it's a chat format, or just take the content
        // Pollinations 'text' endpoint usually takes the prompt in the URL for GET.
        // But for POST, the user might expect standard OpenAI format or similar?
        // The user request shows GET examples mostly, but PromptAssistant uses POST to openai.
        // Wait, the user specifically said: "dan untuk text diganti dengan ini ... request('https://gen.pollinations.ai/text/...')"
        // This is a GET request structure (or simple request url).

        // However, `PromptAssistant.tsx` currently does:
        // fetch('https://text.pollinations.ai/openai', { method: 'POST', body: ... })
        // We should support that flow but redirected to gen.pollinations.ai

        // Let's assume for POST we handle it slightly differently or validly mapping to the new API.
        // If the new API is strictly `https://gen.pollinations.ai/text/PROMPT?...` it looks like a GET-centric API.
        // If we want to support POST from client, we need to map it to this GET structure or see if `gen.pollinations.ai` supports POST.

        // Assuming we rely on the user's provided example which is GET.
        // We will stick to GET for the proxy implementation in this file to match the user's "text" example.
        // But `PromptAssistant` sends POST. We will have to update `PromptAssistant` to use GET or update this to handle POST -> GET conversion.

        // Let's implement POST here that converts to the GET url structure for Pollinations
        // OR acts as a proxy if Pollinations supports POST. 
        // Given the user example `request('https://gen.pollinations.ai/text/Write a haiku...?...)` it's strongly suggesting GET.

        // So for the POST handler:
        let prompt = "";
        if (messages && Array.isArray(messages)) {
            prompt = messages.map((m: any) => {
                if (typeof m.content === 'string') return m.content;
                if (Array.isArray(m.content)) {
                    return m.content.map((c: any) => c.text || '').join(' ');
                }
                return '';
            }).join('\n');
        } else if (body.prompt) {
            prompt = body.prompt;
        }

        const params = new URLSearchParams({
            model: model || 'openai',
            seed: (seed || Math.floor(Math.random() * 1000000)).toString(),
            json: json ? 'true' : 'false',
        });
        if (temperature) params.append('temperature', temperature.toString());

        const baseUrl = 'https://gen.pollinations.ai/text';
        const finalUrl = `${baseUrl}/${encodeURIComponent(prompt)}?${params.toString()}`;

        const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
        const headers: HeadersInit = {};
        if (POLLINATIONS_API_KEY) {
            headers['Authorization'] = `Bearer ${POLLINATIONS_API_KEY}`;
        }

        const response = await fetch(finalUrl, {
            method: 'GET', // sending as GET to the upstream
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ message: `Pollinations API Error: ${response.statusText}`, error: errorText }, { status: response.status });
        }

        const responseData = await response.text();

        // If the client expects OpenAI format response (choices[0].message.content), we might need to mock it
        // because `gen.pollinations.ai/text` likely returns raw text.
        // `PromptAssistant.tsx` expects: `result.choices[0].message.content`

        // Let's verify what the text endpoint returns. 
        // If it returns raw text, we wrap it to match OpenAI format so we don't have to rewrite too much logic in client,
        // OR we rewrite client to expect raw text. Rewriting client is cleaner.

        return new NextResponse(responseData, { headers: { 'Content-Type': 'text/plain' } });

    } catch (error: any) {
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
