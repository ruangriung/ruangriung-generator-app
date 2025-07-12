import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validasi input sederhana (opsional, bisa lebih kompleks)
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: 'Semua kolom wajib diisi.' }, { status: 400 });
    }

    // Konfigurasi transporter Nodemailer
    // Menggunakan SMTP Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_APP_PASSWORD,
      },
    });

    // Konfigurasi opsi email
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL, // Email pengirim (Gmail Anda)
      to: 'ayicktigabelas@gmail.com', // Ganti dengan email tujuan Anda (misal: email kontak Anda)
      subject: `Pesan dari Website: ${subject}`,
      html: `
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subjek:</strong> ${subject}</p>
        <p><strong>Pesan:</strong><br/>${message}</p>
      `,
    };

    // Kirim email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email berhasil dikirim!' }, { status: 200 });

  } catch (error: any) {
    console.error('Gagal mengirim email:', error);
    // Detail error untuk debugging internal, tidak untuk ditampilkan langsung ke klien
    return NextResponse.json({ message: 'Gagal mengirim email.', error: error.message }, { status: 500 });
  }
}