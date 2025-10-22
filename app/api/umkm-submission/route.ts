import { NextResponse } from 'next/server';
import {
  createEmailTransporter,
  getDefaultNotificationEmail,
  sanitizeEmailAddresses,
  sanitizeSenderAddress,
  sanitizeString,
} from '@/lib/email';

const REQUIRED_FIELDS = ['ownerName', 'email', 'businessName', 'description'] as const;

type SubmissionProduct = {
  name: string;
  price: string;
  description: string;
  image?: string;
};

type SubmissionPayload = {
  ownerName: string;
  email: string;
  whatsapp?: string;
  businessName: string;
  businessCategory?: string;
  categorySelection?: string;
  location?: string;
  description: string;
  productHighlights?: string;
  imageLinks?: string;
  additionalInfo?: string;
  products: SubmissionProduct[];
};

const sanitize = (value: string | undefined | null) => sanitizeString(value);

const sanitizeProducts = (value: unknown): SubmissionProduct[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return undefined;
      }

      const record = entry as Record<string, unknown>;
      const name = sanitize(record.name as string);
      const price = sanitize(record.price as string);
      const description = sanitize(record.description as string);
      const image = sanitize(record.image as string);

      if (!name || !price || !description) {
        return undefined;
      }

      return {
        name,
        price,
        description,
        image: image || undefined,
      } satisfies SubmissionProduct;
    })
    .filter((product): product is SubmissionProduct => Boolean(product));
};

export async function POST(request: Request) {
  try {
    const rawPayload = (await request.json()) as (Partial<SubmissionPayload> & { token?: string }) | undefined;

    if (!rawPayload) {
      return NextResponse.json({ message: 'Tidak ada data yang diterima.' }, { status: 400 });
    }

    const token = sanitize(rawPayload.token);

    const submission: SubmissionPayload = {
      ownerName: sanitize(rawPayload.ownerName),
      email: sanitize(rawPayload.email),
      whatsapp: sanitize(rawPayload.whatsapp),
      businessName: sanitize(rawPayload.businessName),
      businessCategory: sanitize(rawPayload.businessCategory),
      categorySelection: sanitize(rawPayload.categorySelection),
      location: sanitize(rawPayload.location),
      description: sanitize(rawPayload.description),
      productHighlights: sanitize(rawPayload.productHighlights),
      imageLinks: sanitize(rawPayload.imageLinks),
      additionalInfo: sanitize(rawPayload.additionalInfo),
      products: sanitizeProducts(rawPayload.products),
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

    if (!token) {
      return NextResponse.json(
        { message: 'Verifikasi keamanan diperlukan sebelum mengirim pengajuan.' },
        { status: 400 },
      );
    }

    const turnstileSecretKey = sanitize(process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY);

    if (!turnstileSecretKey) {
      console.error('CLOUDFLARE_TURNSTILE_SECRET_KEY tidak diatur.');
      return NextResponse.json({ message: 'Konfigurasi keamanan belum lengkap di server.' }, { status: 500 });
    }

    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: turnstileSecretKey,
        response: token,
        remoteip: request.headers.get('x-forwarded-for'),
      }),
    });

    const verificationData = (await verificationResponse.json()) as { success: boolean; ['error-codes']?: string[] };

    if (!verificationData.success) {
      console.error('Verifikasi Turnstile Gagal:', verificationData['error-codes']);
      return NextResponse.json(
        { message: 'Verifikasi keamanan gagal. Silakan coba lagi.' },
        { status: 401 },
      );
    }

    let transporter;
    let nodemailerUser;

    try {
      const emailTransport = createEmailTransporter();
      transporter = emailTransport.transporter;
      nodemailerUser = emailTransport.nodemailerUser;
    } catch (error) {
      console.error('Konfigurasi email belum lengkap.', error);
      return NextResponse.json(
        { message: 'Konfigurasi email belum lengkap di server.' },
        { status: 500 },
      );
    }

    const senderAddress = sanitizeSenderAddress(process.env.NODEMAILER_FROM, nodemailerUser);
    const recipients = sanitizeEmailAddresses([
      process.env.UMKM_SUBMISSION_RECIPIENT,
      process.env.CONTACT_EMAIL_RECIPIENT,
      getDefaultNotificationEmail(),
      nodemailerUser,
    ]);

    if (recipients.length === 0) {
      console.error('Tidak ada alamat email penerima yang valid untuk pengajuan UMKM.');
      return NextResponse.json(
        { message: 'Konfigurasi email penerima belum lengkap di server.' },
        { status: 500 },
      );
    }

    const categorySummary = (() => {
      const finalCategory = submission.businessCategory;
      const selection = submission.categorySelection;

      if (finalCategory && selection && finalCategory !== selection) {
        return `<p><strong>Kategori:</strong> ${finalCategory} <span style="color:#64748b;">(pilihan awal: ${selection})</span></p>`;
      }

      if (finalCategory) {
        return `<p><strong>Kategori:</strong> ${finalCategory}</p>`;
      }

      if (selection) {
        return `<p><strong>Pilihan kategori:</strong> ${selection}</p>`;
      }

      return '';
    })();

    const productLines = submission.products.length
      ? [
          '<h3>Produk Unggulan</h3>',
          '<ul>',
          ...submission.products.map(
            (product) =>
              `<li><strong>${product.name}</strong> — ${product.price}<br>${product.description.replace(/\n/g, '<br>')}${
                product.image
                  ? `<br>Gambar: <a href="${product.image}" target="_blank" rel="noopener noreferrer">${product.image}</a>`
                  : ''
              }</li>`,
          ),
          '</ul>',
        ]
      : [];

    const messageLines = [
      `<p><strong>Nama Penanggung Jawab:</strong> ${submission.ownerName}</p>`,
      `<p><strong>Email:</strong> ${submission.email}</p>`,
      submission.whatsapp ? `<p><strong>WhatsApp:</strong> ${submission.whatsapp}</p>` : '',
      `<p><strong>Nama UMKM:</strong> ${submission.businessName}</p>`,
      categorySummary,
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
      ...productLines,
    ].filter(Boolean);

    const replyToCandidates = sanitizeEmailAddresses([
      `${submission.ownerName} <${submission.email}>`,
    ]);
    const replyToAddress = replyToCandidates[0];

    await transporter.sendMail({
      from: senderAddress,
      to: recipients.join(', '),
      ...(replyToAddress ? { replyTo: replyToAddress } : {}),
      subject: `Pengajuan UMKM Baru: ${submission.businessName}`,
      html: `
        <h2>Pengajuan UMKM Baru</h2>
        ${messageLines.join('\n')}
      `,
    });

    return NextResponse.json({
      message: 'Terima kasih! Data UMKM Anda sudah kami terima. Tim kami akan segera menindaklanjuti.',
      submission,
    });
  } catch (error) {
    console.error('Terjadi kesalahan saat memproses pengajuan UMKM:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan di server saat mengirimkan pengajuan. Silakan coba lagi nanti.' },
      { status: 500 },
    );
  }
}
