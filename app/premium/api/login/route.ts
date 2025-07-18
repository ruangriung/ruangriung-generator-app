import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const protectedPassword = process.env.PREMIUM_PASSWORD;

    if (!protectedPassword) {
      console.error("PREMIUM_PASSWORD tidak diatur di environment variables.");
      return NextResponse.json({ message: 'Kesalahan konfigurasi server.' }, { status: 500 });
    }

    if (password !== protectedPassword) {
      // Jika kata sandi salah, kirim respons error
      return NextResponse.json({ message: 'Kata sandi tidak valid' }, { status: 401 });
    }

    // --- PERBAIKAN UTAMA DI SINI ---
    // Kata sandi benar. Buat respons berhasil terlebih dahulu.
    const response = NextResponse.json({ message: 'Login berhasil' }, { status: 200 });

    // Kemudian, atur cookie pada respons tersebut sebelum dikirim.
    response.cookies.set({
      name: 'premium-auth',
      value: 'true',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/premium',
      maxAge: 60 * 60 * 24 * 30, // 30 hari
    });

    // Kembalikan respons yang sudah berisi cookie.
    return response;
    
  } catch (error) {
    console.error('API Login Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}