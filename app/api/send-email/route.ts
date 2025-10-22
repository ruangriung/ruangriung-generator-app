import { NextResponse } from 'next/server';
import {
  createEmailTransporter,
  getDefaultNotificationEmail,
  sanitizeEmailAddresses,
  sanitizeSenderAddress,
  sanitizeString,
} from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = sanitizeString(body.name);
    const email = sanitizeString(body.email);
    const subject = sanitizeString(body.subject);
    const message = sanitizeString(body.message);

    // Validasi input sederhana (opsional, bisa lebih kompleks)
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: 'Semua kolom wajib diisi.' }, { status: 400 });
    }

    let transporter;
    let nodemailerUser;

    try {
      const emailTransport = createEmailTransporter();
      transporter = emailTransport.transporter;
      nodemailerUser = emailTransport.nodemailerUser;
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
      getDefaultNotificationEmail(),
      nodemailerUser,
    ]);

    if (recipients.length === 0) {
      console.error('Tidak ada alamat email penerima yang valid untuk API send-email.');
      return NextResponse.json(
        { message: 'Konfigurasi email penerima belum lengkap di server.' },
        { status: 500 },
      );
    }

    // Konfigurasi opsi email
    const replyToAddress = sanitizeSenderAddress(email, email);

    const mailOptions = {
      from: senderAddress,
      to: recipients.join(', '),
      replyTo: replyToAddress,
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