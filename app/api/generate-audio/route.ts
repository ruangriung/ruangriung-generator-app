import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text');
    const voice = searchParams.get('voice');

    if (!text || !voice) {
      return NextResponse.json({ message: 'Teks dan suara wajib diisi sebagai parameter URL.' }, { status: 400 });
    }

    const serverKey = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
    const clientKey = req.headers.get('x-pollinations-key');
    const activeApiKey = clientKey || serverKey;

    const queryParams = new URLSearchParams({
      voice: voice,
      response_format: 'mp3',
      model: 'tts-1', // Default model for tts
    });

    const pollinatorsApiUrl = `https://gen.pollinations.ai/audio/${encodeURIComponent(text)}?${queryParams.toString()}`;

    const headers: Record<string, string> = {
      'Referer': 'https://ruangriung.my.id',
    };

    if (activeApiKey) {
      headers['Authorization'] = `Bearer ${activeApiKey}`;
    }

    // Gunakan fetch global (bawaan Node 18+ / Vercel)
    const response = await fetch(pollinatorsApiUrl, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error dari Pollinations.ai:', response.status, errorText);
      return NextResponse.json(
        { message: `Gagal membuat audio: ${response.status}`, error: errorText },
        { status: response.status }
      );
    }

    // === OPTIMIZATION: Redirect or Stream ===
    // If the request can be handled without server secrets (BYOP), we should redirect.
    // However, this API currently relies on the server-side POLLINATIONS_API_KEY.
    // We will still switch to STREAMING to save memory and bandwidth.

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="audio-${Date.now()}.mp3"`,
        'Cache-Control': 'public, max-age=3600',
      },
      status: 200,
    });

  } catch (error: any) {
    console.error('Kesalahan internal di API generate-audio:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan internal pada server.', error: error.message }, { status: 500 });
  }
}
