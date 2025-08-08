
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { author, email, title, promptContent, tool, tags } = await request.json();

    if (!author || !email || !title || !promptContent || !tool) {
      return NextResponse.json({ message: 'Semua kolom wajib diisi.' }, { status: 400 });
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
