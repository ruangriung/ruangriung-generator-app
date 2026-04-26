import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Extend duration for LLM response

const POLLINATIONS_BASE_URL = 'https://gen.pollinations.ai';

function getApiKey() {
  return process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
}

function buildAuthHeaders(request?: Request) {
  const serverApiKey = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
  
  // Support BYOP: Check client headers
  const clientKey = request?.headers.get('x-pollinations-key') || 
                    request?.headers.get('Authorization')?.replace('Bearer ', '');
  
  const apiKey = clientKey || serverApiKey;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get('prompt')?.trim();

    if (!prompt) {
      return NextResponse.json({ message: 'Prompt/Text is required' }, { status: 400 });
    }

    // Support BYOP: Check client headers
    const clientKey = request?.headers.get('x-pollinations-key') || 
                      request?.headers.get('Authorization')?.replace('Bearer ', '');
    const serverKey = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
    const apiKey = clientKey || serverKey;

    const baseUrl = apiKey ? 'https://gen.pollinations.ai' : 'https://text.pollinations.ai';

    // Forwarding additional query params to Pollinations (e.g., model, seed)
    const pollParams = new URLSearchParams(searchParams);
    const finalUrl = `${baseUrl}/text/${encodeURIComponent(prompt)}?${pollParams.toString()}`;

    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: buildAuthHeaders(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { message: `Pollinations API Error: ${response.statusText}`, error: errorText },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('Content-Type') || 'text/plain; charset=utf-8';
    const data = await response.text();

    return new NextResponse(data, {
      headers: { 'Content-Type': contentType },
      status: 200,
    });
  } catch (error: any) {
    console.error('Error in Pollinations Text Proxy (GET):', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Body is empty or not JSON, default to empty object
    }

    const model = body?.model || 'openai';
    const messages = Array.isArray(body?.messages)
      ? body.messages
      : body?.prompt
        ? [{ role: 'user', content: String(body.prompt) }]
        : [];

    if (!messages.length) {
      return NextResponse.json(
        {
          error: {
            message: 'messages atau prompt wajib diisi untuk request POST.',
            type: 'invalid_request_error',
            param: 'messages',
            code: null
          }
        },
        { status: 400 }
      );
    }

    const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
    
    // Support BYOP: Check client headers
    const clientKey = request?.headers.get('x-pollinations-key') || 
                      request?.headers.get('Authorization')?.replace('Bearer ', '');
    
    const apiKey = clientKey || POLLINATIONS_API_KEY;

    // Use gen.pollinations.ai for Pro (with key), otherwise use text.pollinations.ai
    const baseUrl = apiKey ? 'https://gen.pollinations.ai' : 'https://text.pollinations.ai';

    const upstreamPayload: Record<string, unknown> = {
      model,
      messages,
    };

    // Forward all OpenAI-compatible parameters
    if (typeof body?.temperature !== 'undefined') upstreamPayload.temperature = body.temperature;
    if (typeof body?.seed !== 'undefined') upstreamPayload.seed = body.seed;
    if (typeof body?.stream !== 'undefined') upstreamPayload.stream = body.stream;
    if (typeof body?.max_tokens !== 'undefined') upstreamPayload.max_tokens = body.max_tokens;
    if (body?.response_format) upstreamPayload.response_format = body.response_format;
    if (typeof body?.json !== 'undefined') upstreamPayload.json = body.json;

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: buildAuthHeaders(request),
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

    // === OPTIMIZATION: Streaming Support ===
    // If the client requested a stream, pipe it directly from upstream
    if (body?.stream === true) {
      return new NextResponse(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
        status: 200,
      });
    }

    // For non-streaming, we can still pipe the body for efficiency
    // but the current UI might expect a plain string. 
    // Let's keep the existing logic but optimized.
    const raw = await response.text();

    try {
      const parsed = JSON.parse(raw);
      
      if (body?.return_full_response === true) {
        return NextResponse.json(parsed);
      }

      const content = parsed?.choices?.[0]?.message?.content;

      if (typeof content === 'string') {
        return new NextResponse(content, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          status: 200,
        });
      }

      return new NextResponse(JSON.stringify(parsed), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch {
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
