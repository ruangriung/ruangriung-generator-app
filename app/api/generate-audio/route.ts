import { NextResponse } from 'next/server';
import { request } from 'undici';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text');
    const voice = searchParams.get('voice');

    if (!text || !voice) {
      return NextResponse.json({ message: 'Teks dan suara wajib diisi sebagai parameter URL.' }, { status: 400 });
    }

    const POLLINATIONS_API_KEY = process.env.POLLINATIONS_API_KEY || process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;

    if (!POLLINATIONS_API_KEY) {
      return NextResponse.json({ message: 'Pollinations AI Token tidak ditemukan di server.' }, { status: 500 });
    }

    const queryParams = new URLSearchParams({
      voice: voice,
      response_format: 'mp3',
      model: 'tts-1', // Default model for tts
    });

    const pollinatorsApiUrl = `https://gen.pollinations.ai/audio/${encodeURIComponent(text)}?${queryParams.toString()}`;

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${POLLINATIONS_API_KEY}`,
    };

    const { statusCode, body } = await request(pollinatorsApiUrl, {
      method: 'GET',
      headers,
    });

    if (statusCode !== 200) {
      const errorText = await body.text();
      console.error('Error dari Pollinations.ai:', errorText);
      return NextResponse.json(
        { message: `Gagal membuat audio: ${errorText}` },
        { status: statusCode }
      );
    }

    // Mengambil buffer dari response undici
    const arrayBuffer = await body.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="audio-${Date.now()}.mp3"`,
      },
      status: 200,
    });

  } catch (error: any) {
    console.error('Kesalahan internal di API generate-audio:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan internal pada server.', error: error.message }, { status: 500 });
  }
}