import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Ambil password DAN token dari request body
    const { password, token } = await request.json();

    // 2. Verifikasi token Turnstile
    const turnstileSecretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    if (!turnstileSecretKey) {
      console.error("CLOUDFLARE_TURNSTILE_SECRET_KEY tidak diatur.");
      return NextResponse.json({ message: 'Kesalahan konfigurasi server.' }, { status: 500 });
    }

    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v2/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(turnstileSecretKey)}&response=${encodeURIComponent(token)}`,
    });

    const turnstileData = await turnstileResponse.json();

    if (!turnstileData.success) {
      console.warn('Verifikasi Turnstile gagal:', turnstileData['error-codes']);
      return NextResponse.json({ message: 'Verifikasi keamanan gagal. Silakan coba lagi.' }, { status: 401 });
    }
    // --- Akhir dari Verifikasi Turnstile ---


    // 3. Jika Turnstile berhasil, lanjutkan cek password (logika yang sudah ada)
    const protectedPassword = process.env.PREMIUM_PASSWORD;
    if (!protectedPassword) {
      console.error("PREMIUM_PASSWORD tidak diatur di environment variables.");
      return NextResponse.json({ message: 'Kesalahan konfigurasi server.' }, { status: 500 });
    }

    if (password !== protectedPassword) {
      return NextResponse.json({ message: 'Kata sandi tidak valid' }, { status: 401 });
    }

    const response = NextResponse.json({ message: 'Login berhasil' }, { status: 200 });

    response.cookies.set({
      name: 'premium-auth',
      value: 'true',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/premium',
      maxAge: 60 * 60 * 24 * 30, // 30 hari
    });

    return response;
    
  } catch (error) {
    console.error('API Login Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}