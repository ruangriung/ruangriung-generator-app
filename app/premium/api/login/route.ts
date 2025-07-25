// ruangriung/ruangriung-generator-app/app/premium/api/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json(); // Hanya ambil password
    // Catatan: PREMIUM_PASSWORD ini adalah kata sandi plaintext asli Anda
    // yang digunakan oleh sistem login premium lama.
    // Jika Anda ingin ini aman, Anda harus menerapkan hashing di sini juga.
    const protectedPassword = process.env.PREMIUM_PASSWORD; // Ini adalah variabel lingkungan asli Anda

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