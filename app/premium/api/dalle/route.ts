// ruangriung/ruangriung-generator-app/ruangriung-generator-app-3a68b1c6536b7de1915cdc5d286c7ce19bf9481e/app/api/dalle/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ message: 'API key OpenAI tidak ditemukan.' }, { status: 400 });
    }
    if (!prompt) {
      return NextResponse.json({ message: 'Prompt tidak boleh kosong.' }, { status: 400 });
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024", // Ukuran default untuk DALL-E 3
        quality: "standard"
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('DALL-E API Error:', errorData);
        return NextResponse.json({ message: `Error dari DALL-E API: ${errorData.error.message}` }, { status: response.status });
    }

    const data = await response.json();
    const imageUrl = data.data[0]?.url;

    if (!imageUrl) {
        return NextResponse.json({ message: 'Gagal mendapatkan URL gambar dari DALL-E.' }, { status: 500 });
    }

    return NextResponse.json({ imageUrl });

  } catch (error: any) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan internal pada server.', error: error.message }, { status: 500 });
  }
}