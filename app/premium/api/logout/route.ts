import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Buat respons berhasil terlebih dahulu
    const response = NextResponse.json({ message: 'Logout berhasil' }, { status: 200 });

    // Hapus cookie dengan mengatur maxAge ke 0 atau -1
    response.cookies.set({
      name: 'premium-auth',
      value: '', // Kosongkan nilainya
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: -1, // Atur masa lalu agar cookie langsung dihapus
    });

    return response;
    
  } catch (error) {
    console.error('API Logout Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}