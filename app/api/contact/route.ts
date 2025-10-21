// app/api/contact/route.ts

import { NextResponse } from 'next/server';
import {
  createEmailTransporter,
  sanitizeEmail,
  sanitizeEmailAddresses,
  sanitizeSenderAddress,
  sanitizeString,
} from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = sanitizeString(body.name);
    const email = sanitizeEmail(body.email);
    const subject = sanitizeString(body.subject);
    const message = sanitizeString(body.message);
    const token = sanitizeString(body.token);

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
    let transporter: Awaited<ReturnType<typeof createEmailTransporter>>['transporter'];
    let nodemailerUser: string;
    let previewResolver:
      | Awaited<ReturnType<typeof createEmailTransporter>>['getTestMessageUrl']
      | undefined;

    try {
      const emailTransport = await createEmailTransporter();
      transporter = emailTransport.transporter;
      nodemailerUser = emailTransport.nodemailerUser;
      previewResolver = emailTransport.getTestMessageUrl;
    } catch (error) {
      console.error('Konfigurasi Nodemailer belum lengkap:', error);
      return NextResponse.json(
        { message: 'Konfigurasi email server belum lengkap. Silakan hubungi administrator.' },
        { status: 500 },
      );
    }

    const senderAddress = sanitizeSenderAddress(`"${name}" <${nodemailerUser}>`, nodemailerUser);
    const recipients = sanitizeEmailAddresses([
      process.env.CONTACT_EMAIL_RECIPIENT,
      nodemailerUser,
    ]);

    if (recipients.length === 0) {
      console.error('Tidak ada alamat email penerima yang valid untuk formulir kontak.');
      return NextResponse.json(
        { message: 'Konfigurasi email penerima belum diatur dengan benar.' },
        { status: 500 },
      );
    }

    const info = await transporter.sendMail({
      from: senderAddress,
      to: recipients.join(', '),
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

    const previewUrl = previewResolver?.(info);
    if (typeof previewUrl === 'string' && previewUrl.length > 0) {
      console.info('Preview email formulir kontak tersedia di:', previewUrl);
    }

    return NextResponse.json({ message: 'Pesan Anda telah berhasil dikirim!' }, { status: 200 });

  } catch (error) {
    console.error('Terjadi kesalahan di API contact:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}