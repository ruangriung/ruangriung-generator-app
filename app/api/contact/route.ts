// app/api/contact/route.ts

import { NextResponse, NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) { // Gunakan NextRequest
  try {
    const { name, email, subject, message, token } = await request.json(); // 'token' adalah token Turnstile

    if (!name || !email || !subject || !message || !token) {
      return NextResponse.json({ message: 'Semua kolom, termasuk verifikasi keamanan, harus diisi.' }, { status: 400 });
    }

    const turnstileSecretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    if (!turnstileSecretKey) {
      console.error("CLOUDFLARE_TURNSTILE_SECRET_KEY tidak diatur.");
      return NextResponse.json({ message: 'Kesalahan konfigurasi server: Kunci rahasia Turnstile hilang.' }, { status: 500 });
    }

    // --- PERBAIKAN: Dapatkan IP pengguna tanpa request.ip ---
    const ip = request.headers.get('x-forwarded-for') || ''; // Dapatkan IP pengguna
    // --- PERBAIKAN: Mengirim payload sebagai form-urlencoded seperti rekomendasi Cloudflare ---
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: turnstileSecretKey,
        response: token, // token dari klien
        remoteip: ip, // Header IP dari Vercel/Netlify
      }).toString(),
    });

    const turnstileData = await response.json();
    
    if (!turnstileData.success) {
      console.error("Verifikasi Turnstile Gagal:", turnstileData['error-codes']);
      return NextResponse.json({ message: 'Verifikasi keamanan gagal. Silakan coba lagi.' }, { status: 403 }); // Mengubah status menjadi 403
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `\"${name}\" <${process.env.NODEMAILER_EMAIL}>`,
      to: process.env.CONTACT_EMAIL_RECIPIENT || process.env.NODEMAILER_EMAIL,
      replyTo: email,
      subject: `Kontak: ${subject}`,
      html: `
        <h3>Pesan baru dari Formulir Kontak</h3>
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subjek:</strong> ${subject}</p>
        <p><strong>Pesan:</strong></p>
        <p>${message.replace(/\\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json({ message: 'Pesan Anda telah berhasil dikirim!' }, { status: 200 });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server saat memproses permintaan Anda.' }, { status: 500 });
  }
}