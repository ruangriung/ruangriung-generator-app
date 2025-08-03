// app/api/generate-audio/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) { // Ubah dari POST menjadi GET
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text'); // Ambil teks dari parameter URL
    const voice = searchParams.get('voice'); // Ambil suara dari parameter URL

    if (!text || !voice) {
      return NextResponse.json({ message: 'Teks dan suara wajib diisi sebagai parameter URL.' }, { status: 400 });
    }

    const POLLINATIONS_TOKEN = process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN; // Tetap gunakan ini seperti yang Anda inginkan

    if (!POLLINATIONS_TOKEN) {
      return NextResponse.json({ message: 'Pollinations AI Token tidak ditemukan di server.' }, { status: 500 });
    }

    // === PERUBAHAN PENTING DI SINI ===
    // Buat URL GET untuk Pollinations.ai Text-to-Speech
    const pollinatorsApiUrl = `https://text.pollinations.ai/${encodeURIComponent(text)}?model=openai-audio&voice=${voice}&referrer=ruangriung.my.id`;
    // ================================

    // Kirim permintaan GET ke Pollinations.ai dari backend
    const response = await fetch(pollinatorsApiUrl, {
      method: 'GET', // Metode GET
      // Header Authorization tidak diperlukan untuk endpoint GET ini (biasanya berbasis referrer)
      // Namun, jika token diperlukan untuk kuota, bisa ditambahkan sebagai query param 'token'
      // Sesuai dokumentasi, endpoint GET untuk TTS tidak secara eksplisit menyebut Authorization header.
      // Jika Anda memiliki tier yang lebih tinggi, Anda mungkin perlu menambahkan `&token=${POLLINATIONS_TOKEN}` ke URL.
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error dari Pollinations.ai (melalui proxy GET):', errorText);
      try {
        const errorJson = JSON.parse(errorText); // Coba parse error sebagai JSON
        return NextResponse.json({ message: `Gagal membuat audio dari AI: ${errorJson.error || errorText}` }, { status: response.status });
      } catch {
        return NextResponse.json({ message: `Gagal membuat audio dari AI: ${response.statusText} - ${errorText}` }, { status: response.status });
      }
    }

    const audioBlob = await response.blob();

    return new NextResponse(audioBlob, {
      headers: {
        'Content-Type': 'audio/mpeg', // Pastikan tipe konten adalah audio/mpeg
        'Content-Disposition': `attachment; filename="audio-${Date.now()}.mp3"`,
      },
      status: 200,
    });

  } catch (error: any) {
    console.error('Kesalahan internal di API generate-audio:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan internal pada server.', error: error.message }, { status: 500 });
  }
}