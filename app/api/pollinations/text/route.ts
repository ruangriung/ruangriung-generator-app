import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const POLLINATIONS_API_URL = 'https://gen.pollinations.ai/v1/chat/completions';

function getApiKey() {
  return process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
}

function buildAuthHeaders() {
  const apiKey = getApiKey();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Normalize input: accept both messages array and prompt string
    const model = body?.model || 'openai';
    let messages = body?.messages;

    if (!messages && body?.prompt) {
      messages = [{ role: 'user', content: String(body.prompt) }];
    }

    if (!Array.isArray(messages) || !messages.length) {
      return NextResponse.json(
        { 
          error: {
            message: 'messages atau prompt wajib diisi untuk request POST.',
            type: 'invalid_request_error',
            param: 'messages',
            code: 'missing_argument'
          }
        },
        { status: 400 }
      );
    }

    // Validate and normalize messages
    const normalizedMessages = messages.map((msg: any) => ({
      role: msg.role || 'user',
      content: typeof msg.content === 'string' 
        ? msg.content 
        : Array.isArray(msg.content) 
          ? msg.content.map((c: any) => 
              typeof c === 'string' 
                ? { type: 'text', text: c } 
                : c
            )
          : String(msg.content)
    }));

    // Build payload dengan parameter standar Pollinations API
    const upstreamPayload: Record<string, any> = {
      model,
      messages: normalizedMessages,
    };

    // Tambahkan parameter opsional sesuai standar API
    if (typeof body?.temperature !== 'undefined') {
      upstreamPayload.temperature = Math.max(0, Math.min(2, Number(body.temperature)));
    }
    if (typeof body?.top_p !== 'undefined') {
      upstreamPayload.top_p = Math.max(0, Math.min(1, Number(body.top_p)));
    }
    if (typeof body?.top_k !== 'undefined') {
      upstreamPayload.top_k = Math.max(1, Number(body.top_k));
    }
    if (typeof body?.max_tokens !== 'undefined') {
      upstreamPayload.max_tokens = Math.max(1, Number(body.max_tokens));
    }
    if (typeof body?.frequency_penalty !== 'undefined') {
      upstreamPayload.frequency_penalty = Math.max(-2, Math.min(2, Number(body.frequency_penalty)));
    }
    if (typeof body?.presence_penalty !== 'undefined') {
      upstreamPayload.presence_penalty = Math.max(-2, Math.min(2, Number(body.presence_penalty)));
    }
    if (typeof body?.seed !== 'undefined') {
      upstreamPayload.seed = Number(body.seed);
    }
    if (typeof body?.stream !== 'undefined') {
      upstreamPayload.stream = Boolean(body.stream);
    }
    if (body?.response_format) {
      upstreamPayload.response_format = body.response_format;
    }
    if (body?.tools) {
      upstreamPayload.tools = body.tools;
    }
    if (body?.tool_choice) {
      upstreamPayload.tool_choice = body.tool_choice;
    }

    const response = await fetch(POLLINATIONS_API_URL, {
      method: 'POST',
      headers: buildAuthHeaders(),
      body: JSON.stringify(upstreamPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        errorJson = { message: errorText };
      }
      
      return NextResponse.json(
        { 
          error: errorJson.error || {
            message: `Pollinations API Error: ${response.statusText}`,
            type: 'api_error',
            code: response.status
          }
        },
        { status: response.status }
      );
    }

    const raw = await response.text();

    try {
      const parsed = JSON.parse(raw);
      
      // Return full response structure
      if (body?.return_full_response === true) {
        return NextResponse.json(parsed);
      }

      // Extract dan return hanya content
      const content = parsed?.choices?.[0]?.message?.content;

      if (typeof content === 'string') {
        return new NextResponse(content, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          status: 200,
        });
      }

      if (Array.isArray(content)) {
        const textFromArray = content
          .map((item: any) => (typeof item?.text === 'string' ? item.text : ''))
          .join('')
          .trim();

        return new NextResponse(textFromArray || JSON.stringify(parsed), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          status: 200,
        });
      }

      return new NextResponse(JSON.stringify(parsed), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch {
      // Return raw response if parsing fails
      return new NextResponse(raw, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        status: 200,
      });
    }
  } catch (error: any) {
    console.error('Error in Pollinations Text Proxy (POST):', error);
    return NextResponse.json(
      { 
        error: {
          message: 'Internal Server Error',
          type: 'internal_error',
          param: null,
          code: 'internal_error'
        },
        details: error.message 
      },
      { status: 500 }
    );
  }
}
