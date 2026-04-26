
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { prompt, model, ...params } = body;

        if (!prompt) {
            return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
        }

        const queryString = new URLSearchParams(params).toString();
        const baseUrl = 'https://gen.pollinations.ai/video';
        const finalUrl = `${baseUrl}/${encodeURIComponent(prompt)}?model=${model}&${queryString}`;

        const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
        const clientKey = request.headers.get('x-pollinations-key');
        const activeApiKey = clientKey || POLLINATIONS_API_KEY;



        const headers: HeadersInit = {};
        if (activeApiKey) {
            headers['Authorization'] = `Bearer ${activeApiKey}`;
        }

        const response = await fetch(finalUrl, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ message: `Pollinations API Error: ${response.statusText}`, error: errorText }, { status: response.status });
        }

        // === OPTIMIZATION: Redirect or Stream ===
        // If we don't have a server key, we could have redirected earlier, but pollinations video 
        // endpoint might not support CORS as well as images. However, streaming response.body
        // is much better than await response.blob() as it doesn't buffer in memory.

        return new NextResponse(response.body, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'video/mp4',
                'Cache-Control': 'no-store',
            },
            status: 200
        });

    } catch (error: any) {
        console.error('Error in Pollinations Video Proxy (POST):', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}
