import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Ambil data formulir DAN token dari request
    const { name, email, message, token } = await request.json();

    // Pastikan semua data ada
    if (!name || !email || !message || !token) {
      return NextResponse.json({ message: 'Semua kolom harus diisi.' }, { status: 400 });
    }

    // 2. Verifikasi token Turnstile (logika yang sama seperti login premium)
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
      return NextResponse.json({ message: 'Verifikasi keamanan gagal. Silakan coba lagi.' }, { status: 401 });
    }
    // --- Akhir dari Verifikasi Turnstile ---


    // 3. Jika Turnstile berhasil, proses pesan kontak Anda
    // TODO: Ganti bagian ini dengan logika pengiriman email Anda (misalnya menggunakan Nodemailer, Resend, dll.)
    console.log('Pesan Diterima (setelah verifikasi berhasil):');
    console.log({ name, email, message });
    // Simulasi pengiriman email berhasil
    

    return NextResponse.json({ message: 'Pesan Anda telah berhasil dikirim!' }, { status: 200 });
    
  } catch (error) {
    console.error('API Kontak Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}