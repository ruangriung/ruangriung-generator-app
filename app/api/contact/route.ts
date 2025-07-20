// app/api/contact/route.ts

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer'; // Pastikan nodemailer sudah terinstal

export async function POST(request: Request) {
  try {
    const { name, email, subject, message, token } = await request.json();

    if (!name || !email || !subject || !message || !token) {
      return NextResponse.json({ message: 'Semua kolom, termasuk verifikasi, harus diisi.' }, { status: 400 });
    }

    const turnstileSecretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    if (!turnstileSecretKey) {
      console.error("CLOUDFLARE_TURNSTILE_SECRET_KEY tidak diatur.");
      return NextResponse.json({ message: 'Kesalahan konfigurasi server.' }, { status: 500 });
    }
    
    // Perbaikan: Mengirim payload sebagai JSON, bukan form-urlencoded
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: turnstileSecretKey,
        response: token,
        remoteip: request.headers.get('x-forwarded-for'), // Header IP dari Vercel/Netlify
      }),
    });

    const turnstileData = await response.json();

    if (!turnstileData.success) {
      // Log error dari Cloudflare untuk debugging
      console.error("Verifikasi Turnstile Gagal:", turnstileData['error-codes']);
      return NextResponse.json({ message: 'Verifikasi keamanan gagal. Silakan coba lagi.' }, { status: 401 });
    }

    // Jika verifikasi Turnstile berhasil, lanjutkan mengirim email
    // Konfigurasi Gmail (gunakan app password, bukan password biasa)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL, // alamat Gmail dari env Vercel
        pass: process.env.NODEMAILER_APP_PASSWORD, // app password Gmail dari env Vercel
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.NODEMAILER_EMAIL}>`,
      to: process.env.CONTACT_EMAIL_RECIPIENT || process.env.NODEMAILER_EMAIL, // fallback ke user jika tidak diisi
      replyTo: email,
      subject: `Kontak: ${subject}`,
      html: `
        <h3>Pesan baru dari Formulir Kontak</h3>
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subjek:</strong> ${subject}</p>
        <p><strong>Pesan:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json({ message: 'Pesan Anda telah berhasil dikirim!' }, { status: 200 });

  } catch (error) {
    console.error('Terjadi kesalahan di API contact:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}