// ruangriung/ruangriung-generator-app/app/api/delete-request/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer'; // TAMBAHKAN INI: Import nodemailer

export async function POST(request: Request) {
  try {
    const { email, slug, reason } = await request.json();

    // Validasi input sederhana
    if (!email || !slug || !reason) {
      return NextResponse.json({ message: 'Semua kolom wajib diisi.' }, { status: 400 });
    }

    // Konfigurasi transporter Nodemailer (menggunakan detail dari app/premium/api/send-email/route.ts)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Atau layanan SMTP lainnya
      auth: {
        user: process.env.NODEMAILER_EMAIL, // Email pengirim (Gmail Anda) dari .env
        pass: process.env.NODEMAILER_APP_PASSWORD, // App password Gmail Anda dari .env
      },
    });

    // Konfigurasi opsi email
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL, // Email pengirim
      to: 'ayicktigabelas@gmail.com', // Ganti dengan email admin yang akan menerima permintaan hapus
      subject: `Permintaan Hapus Prompt: ${slug}`,
      html: `
        <p><strong>Permintaan Hapus Prompt Baru Diterima!</strong></p>
        <p><strong>Dari Email:</strong> ${email}</p>
        <p><strong>Slug Prompt:</strong> ${slug}</p>
        <p><strong>Alasan:</strong><br/>${reason}</p>
        <br/>
        <p>Mohon tinjau prompt ini di database dan lakukan penghapusan secara manual jika sesuai.</p>
      `,
    };

    // Kirim email
    await transporter.sendMail(mailOptions);

    console.log('\n--- Permintaan Hapus Prompt Baru Diterima dan Email Terkirim ---');
    console.log(`Dari Email: ${email}`);
    console.log(`Slug Prompt: ${slug}`);
    console.log(`Alasan: ${reason}`);
    console.log('---------------------------------------------------------------\n');

    return NextResponse.json({ message: 'Permintaan hapus Anda telah terkirim ke admin!' }, { status: 200 });

  } catch (error: any) {
    console.error('Gagal mengirim permintaan hapus via email:', error);
    // Lebih detail untuk debugging internal
    return NextResponse.json({ message: 'Gagal mengirim permintaan hapus.', error: error.message }, { status: 500 });
  }
}