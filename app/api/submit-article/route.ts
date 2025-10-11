import { NextResponse } from 'next/server';
import {
  createEmailTransporter,
  sanitizeEmailAddresses,
  sanitizeSenderAddress,
} from '@/lib/email';

const ensureStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map(item => (typeof item === 'string' ? item.trim() : ''))
      .filter((item): item is string => item.length > 0);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  return [];
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      author,
      email,
      title,
      summary = '',
      content,
      category = '',
      tags = [],
      references = '',
      token,
    } = body;

    const normalizedAuthor = typeof author === 'string' ? author.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.trim() : '';
    const normalizedTitle = typeof title === 'string' ? title.trim() : '';
    const normalizedContent = typeof content === 'string' ? content.trim() : '';
    const normalizedToken = typeof token === 'string' ? token.trim() : '';

    if (!normalizedAuthor || !normalizedEmail || !normalizedTitle || !normalizedContent || !normalizedToken) {
      return NextResponse.json(
        { message: 'Semua kolom wajib, termasuk verifikasi, harus diisi.' },
        { status: 400 },
      );
    }

    const turnstileSecretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
    if (!turnstileSecretKey) {
      console.error('CLOUDFLARE_TURNSTILE_SECRET_KEY tidak diatur.');
      return NextResponse.json({ message: 'Kesalahan konfigurasi server.' }, { status: 500 });
    }

    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: turnstileSecretKey,
        response: normalizedToken,
        remoteip: request.headers.get('x-forwarded-for'),
      }),
    });

    const verificationData = await verificationResponse.json();

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
      console.error('Konfigurasi email belum lengkap untuk submission artikel.', error);
      return NextResponse.json(
        { message: 'Konfigurasi email belum lengkap di server.' },
        { status: 500 },
      );
    }

    const normalizedSummary = typeof summary === 'string' ? summary : '';
    const normalizedCategory = typeof category === 'string' ? category : '';
    const normalizedReferences = typeof references === 'string' ? references : '';
    const normalizedTags = ensureStringArray(tags);

    const html = `
      <h2>Submission Artikel Baru</h2>
      <p><strong>Nama Pengirim:</strong> ${escapeHtml(normalizedAuthor)}</p>
      <p><strong>Email Pengirim:</strong> ${escapeHtml(normalizedEmail)}</p>
      <p><strong>Judul Artikel:</strong> ${escapeHtml(normalizedTitle)}</p>
      <p><strong>Kategori:</strong> ${normalizedCategory ? escapeHtml(normalizedCategory) : '-'}</p>
      <p><strong>Tags:</strong> ${normalizedTags.length > 0 ? escapeHtml(normalizedTags.join(', ')) : '-'}</p>
      <p><strong>Ringkasan:</strong></p>
      <pre>${escapeHtml(normalizedSummary || '-')}</pre>
      <p><strong>Isi Artikel:</strong></p>
      <pre>${escapeHtml(normalizedContent)}</pre>
      <p><strong>Referensi / Catatan:</strong></p>
      <pre>${escapeHtml(normalizedReferences || '-')}</pre>
    `;

    const senderAddress = sanitizeSenderAddress(process.env.NODEMAILER_FROM, nodemailerUser);
    const recipients = sanitizeEmailAddresses([
      process.env.ARTICLE_SUBMISSION_RECIPIENT,
      process.env.CONTACT_EMAIL_RECIPIENT,
      nodemailerUser,
      'ayicktigabelas@gmail.com',
    ]);

    if (recipients.length === 0) {
      console.error('Tidak ada alamat email penerima yang valid untuk submission artikel.');
      return NextResponse.json(
        { message: 'Konfigurasi email penerima belum lengkap di server.' },
        { status: 500 },
      );
    }

    const mailOptions = {
      from: senderAddress,
      to: recipients.join(', '),
      subject: `Submission Artikel Baru: ${normalizedTitle}`,
      html,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Artikel berhasil dikirim!' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Gagal memproses submission artikel:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Gagal mengirim artikel.', error: message }, { status: 500 });
  }
}
