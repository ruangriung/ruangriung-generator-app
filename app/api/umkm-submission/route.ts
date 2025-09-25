import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const REQUIRED_FIELDS = ['ownerName', 'email', 'businessName', 'description'] as const;

type SubmissionPayload = {
  ownerName: string;
  email: string;
  whatsapp?: string;
  businessName: string;
  businessCategory?: string;
  location?: string;
  description: string;
  productHighlights?: string;
  imageLinks?: string;
  additionalInfo?: string;
};

const sanitize = (value: string | undefined | null) =>
  typeof value === 'string' ? value.trim() : '';

export async function POST(request: Request) {
  try {
    const rawPayload = (await request.json()) as Partial<SubmissionPayload> | undefined;

    if (!rawPayload) {
      return NextResponse.json({ message: 'Tidak ada data yang diterima.' }, { status: 400 });
    }

    const submission: SubmissionPayload = {
      ownerName: sanitize(rawPayload.ownerName),
      email: sanitize(rawPayload.email),
      whatsapp: sanitize(rawPayload.whatsapp),
      businessName: sanitize(rawPayload.businessName),
      businessCategory: sanitize(rawPayload.businessCategory),
      location: sanitize(rawPayload.location),
      description: sanitize(rawPayload.description),
      productHighlights: sanitize(rawPayload.productHighlights),
      imageLinks: sanitize(rawPayload.imageLinks),
      additionalInfo: sanitize(rawPayload.additionalInfo),
    };

    const missingFields = REQUIRED_FIELDS.filter((field) => !submission[field] || submission[field]?.length === 0);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message:
            'Mohon lengkapi nama penanggung jawab, email, nama usaha, dan deskripsi sebelum mengirimkan formulir.',
        },
        { status: 400 },
      );
    }

    const nodemailerUser = sanitize(process.env.NODEMAILER_EMAIL);
    const nodemailerPass = sanitize(process.env.NODEMAILER_APP_PASSWORD);

    if (!nodemailerUser || !nodemailerPass) {
      console.error('Konfigurasi email belum lengkap.');
      return NextResponse.json({ message: 'Konfigurasi email belum lengkap di server.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: nodemailerUser,
        pass: nodemailerPass,
      },
    });

    const recipient = sanitize(process.env.UMKM_SUBMISSION_RECIPIENT) || nodemailerUser;

    const messageLines = [
      `<p><strong>Nama Penanggung Jawab:</strong> ${submission.ownerName}</p>`,
      `<p><strong>Email:</strong> ${submission.email}</p>`,
      submission.whatsapp ? `<p><strong>WhatsApp:</strong> ${submission.whatsapp}</p>` : '',
      `<p><strong>Nama UMKM:</strong> ${submission.businessName}</p>`,
      submission.businessCategory ? `<p><strong>Kategori:</strong> ${submission.businessCategory}</p>` : '',
      submission.location ? `<p><strong>Domisili:</strong> ${submission.location}</p>` : '',
      `<p><strong>Deskripsi:</strong><br>${submission.description.replace(/\n/g, '<br>')}</p>`,
      submission.productHighlights
        ? `<p><strong>Sorotan Produk/Jasa:</strong><br>${submission.productHighlights.replace(/\n/g, '<br>')}</p>`
        : '',
      submission.imageLinks
        ? `<p><strong>Tautan Gambar/Katalog:</strong><br><a href="${submission.imageLinks}" target="_blank" rel="noopener noreferrer">${submission.imageLinks}</a></p>`
        : '',
      submission.additionalInfo
        ? `<p><strong>Informasi Tambahan:</strong><br>${submission.additionalInfo.replace(/\n/g, '<br>')}</p>`
        : '',
    ].filter(Boolean);

    await transporter.sendMail({
      from: `Katalog UMKM <${nodemailerUser}>`,
      to: recipient,
      replyTo: `${submission.ownerName} <${submission.email}>`,
      subject: `Pengajuan UMKM Baru: ${submission.businessName}`,
      html: `
        <h2>Pengajuan UMKM Baru</h2>
        ${messageLines.join('\n')}
      `,
    });

    return NextResponse.json(
      {
        message: 'Terima kasih! Data UMKM Anda sudah kami terima. Tim kami akan segera menindaklanjuti.',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Terjadi kesalahan saat memproses pengajuan UMKM:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan di server saat mengirimkan pengajuan. Silakan coba lagi nanti.' },
      { status: 500 },
    );
  }
}
