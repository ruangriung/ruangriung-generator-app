import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const POLLINATIONS_BASE_URL = 'https://gen.pollinations.ai';

function getApiKey() {
  return process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
}

function buildAuthHeaders() {
  const apiKey = getApiKey();
  const headers: HeadersInit = {};

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

    const queryString = searchParams.toString();
    const finalUrl = `${POLLINATIONS_BASE_URL}/text/${encodeURIComponent(prompt)}?${queryString}`;

    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: buildAuthHeaders(),
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
    const body = await request.json();

    const model = body?.model || 'openai';
    const messages = Array.isArray(body?.messages)
      ? body.messages
      : body?.prompt
        ? [{ role: 'user', content: String(body.prompt) }]
        : [];

    if (!messages.length) {
      return NextResponse.json(
        { message: 'messages atau prompt wajib diisi untuk request POST.' },
        { status: 400 }
      );
    }

    const upstreamPayload: Record<string, unknown> = {
      model,
      messages,
    };

    if (typeof body?.temperature !== 'undefined') upstreamPayload.temperature = body.temperature;
    if (typeof body?.seed !== 'undefined') upstreamPayload.seed = body.seed;
    if (typeof body?.stream !== 'undefined') upstreamPayload.stream = body.stream;
    if (typeof body?.max_tokens !== 'undefined') upstreamPayload.max_tokens = body.max_tokens;
    if (body?.response_format) upstreamPayload.response_format = body.response_format;

    const response = await fetch(`${POLLINATIONS_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...buildAuthHeaders(),
      },
      body: JSON.stringify(upstreamPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { message: `Pollinations API Error: ${response.statusText}`, error: errorText },
        { status: response.status }
      );
    }

    const raw = await response.text();

    try {
      const parsed = JSON.parse(raw);
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

        return new NextResponse(textFromArray || raw, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          status: 200,
        });
      }
    } catch {
      // Upstream can still return plain text on some models/modes.
    }

    return new NextResponse(raw, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      status: 200,
    });
  } catch (error: any) {
    console.error('Error in Pollinations Text Proxy (POST):', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
