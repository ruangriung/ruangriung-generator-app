
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { author, email, facebook, link, title, promptContent, tool, tags, token } = await request.json();

    if (!author || !email || !title || !promptContent || !tool || !token) {
      return NextResponse.json(
        { message: 'Semua kolom, termasuk verifikasi, harus diisi.' },
        { status: 400 }
      );
    }

    const turnstileSecretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    if (!turnstileSecretKey) {
      console.error('CLOUDFLARE_TURNSTILE_SECRET_KEY tidak diatur.');
      return NextResponse.json({ message: 'Kesalahan konfigurasi server.' }, { status: 500 });
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: turnstileSecretKey,
        response: token,
        remoteip: request.headers.get('x-forwarded-for'),
      }),
    });

    const turnstileData = await response.json();
    if (!turnstileData.success) {
      console.error('Verifikasi Turnstile Gagal:', turnstileData['error-codes']);
      return NextResponse.json(
        { message: 'Verifikasi keamanan gagal. Silakan coba lagi.' },
        { status: 401 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: 'ayicktigabelas@gmail.com',
      subject: `Submission Prompt Baru: ${title}`,
      html: `
        <h2>Submission Prompt Baru</h2>
        <p><strong>Nama Pengirim:</strong> ${author}</p>
        <p><strong>Email Pengirim:</strong> ${email}</p>
        <p><strong>Link Facebook:</strong> ${facebook || '-'}</p>
        <p><strong>Link:</strong> ${link || '-'}</p>
        <p><strong>Judul Prompt:</strong> ${title}</p>
        <p><strong>Tool:</strong> ${tool}</p>
        <p><strong>Tags:</strong> ${tags.join(', ')}</p>
        <p><strong>Isi Prompt:</strong></p>
        <pre>${promptContent}</pre>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Prompt berhasil dikirim!' }, { status: 200 });

  } catch (error: any) {
    console.error('Gagal mengirim email:', error);
    return NextResponse.json({ message: 'Gagal mengirim email.', error: error.message }, { status: 500 });
  }
}
