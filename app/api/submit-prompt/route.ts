
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createPrompt } from '@/lib/prompts';
import {
  createEmailTransporter,
  getDefaultNotificationEmail,
  sanitizeEmail,
  sanitizeEmailAddresses,
  sanitizeSenderAddress,
  sanitizeString,
} from '@/lib/email';

const sanitizeOptionalString = (value: unknown): string | undefined => {
  const sanitized = sanitizeString(value);
  return sanitized.length > 0 ? sanitized : undefined;
};

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

const formatOptionalValue = (value: string | undefined) =>
  value && value.length > 0 ? escapeHtml(value) : '-';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const author = sanitizeString(body.author);
    const email = sanitizeEmail(body.email);
    const facebook = sanitizeOptionalString(body.facebook);
    const image = sanitizeOptionalString(body.image);
    const link = sanitizeOptionalString(body.link);
    const title = sanitizeString(body.title);
    const promptContent = sanitizeString(body.promptContent);
    const tool = sanitizeString(body.tool);
    const tags = ensureStringArray(body.tags);
    const token = sanitizeString(body.token);
    const date = sanitizeOptionalString(body.date);

    if (!author || !email || !title || !promptContent || !tool || !token) {
      return NextResponse.json(
        { message: 'Semua kolom wajib diisi dengan benar, termasuk email dan verifikasi keamanan.' },
        { status: 400 }
      );
    }

    const skipEmail =
      typeof body.skipEmail === 'string'
        ? body.skipEmail.toLowerCase() === 'true'
        : Boolean(body.skipEmail);

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

    const { prompt, persisted } = await createPrompt({
      author,
      email,
      facebook,
      image,
      link,
      title,
      promptContent,
      tool,
      tags,
      date,
    });

    if (!skipEmail) {
      let transporter;
      let nodemailerUser;

      try {
        const emailTransport = createEmailTransporter();
        transporter = emailTransport.transporter;
        nodemailerUser = emailTransport.nodemailerUser;
      } catch (error) {
        console.error('NODEMAILER_EMAIL atau NODEMAILER_APP_PASSWORD belum diatur.');
        return NextResponse.json(
          { message: 'Layanan email belum dikonfigurasi dengan benar.' },
          { status: 500 },
        );
      }

      const senderAddress = sanitizeSenderAddress(process.env.NODEMAILER_FROM, nodemailerUser);
      const recipientAddresses = sanitizeEmailAddresses([
        process.env.PROMPT_SUBMISSION_RECIPIENT,
        process.env.CONTACT_EMAIL_RECIPIENT,
        getDefaultNotificationEmail(),
        nodemailerUser,
      ]);

      if (recipientAddresses.length === 0) {
        console.error('Tidak ada alamat email penerima yang valid untuk notifikasi prompt.');
        return NextResponse.json(
          { message: 'Layanan email belum dikonfigurasi dengan benar.' },
          { status: 500 },
        );
      }

      const safeTags = tags.map(tag => escapeHtml(tag));
      const formattedTags = safeTags.length > 0 ? safeTags.join(', ') : '-';
      const formattedDate = formatOptionalValue(date);
      const plainTags = tags.length > 0 ? tags.join(', ') : '-';
      const mailOptions = {
        from: senderAddress,
        to: recipientAddresses.join(', '),
        replyTo: email,
        subject: `Submission Prompt Baru: ${escapeHtml(title)}`,
        text:
          `Submission Prompt Baru\n\n` +
          `Nama Pengirim: ${author}\n` +
          `Email Pengirim: ${email}\n` +
          `Link Facebook: ${facebook ?? '-'}\n` +
          `Link: ${link ?? '-'}\n` +
          `Link Gambar: ${image ?? '-'}\n` +
          `Tanggal Publikasi: ${date ?? '-'}\n` +
          `Judul Prompt: ${title}\n` +
          `Tool: ${tool}\n` +
          `Tags: ${plainTags}\n` +
          `Slug: ${prompt.slug}\n\n` +
          `Isi Prompt:\n${promptContent}`,
        html: `
          <h2>Submission Prompt Baru</h2>
          <p><strong>Nama Pengirim:</strong> ${escapeHtml(author)}</p>
          <p><strong>Email Pengirim:</strong> ${escapeHtml(email)}</p>
          <p><strong>Link Facebook:</strong> ${formatOptionalValue(facebook)}</p>
          <p><strong>Link:</strong> ${formatOptionalValue(link)}</p>
          <p><strong>Link Gambar:</strong> ${formatOptionalValue(image)}</p>
          <p><strong>Tanggal Publikasi:</strong> ${formattedDate}</p>
          <p><strong>Judul Prompt:</strong> ${escapeHtml(title)}</p>
          <p><strong>Tool:</strong> ${escapeHtml(tool)}</p>
          <p><strong>Tags:</strong> ${formattedTags}</p>
          <p><strong>Slug:</strong> ${escapeHtml(prompt.slug)}</p>
          <p><strong>Isi Prompt:</strong></p>
          <pre>${escapeHtml(promptContent)}</pre>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    if (persisted) {
      revalidatePath('/kumpulan-prompt');
      revalidatePath(`/kumpulan-prompt/${prompt.slug}`);
    }

    const successMessage = persisted
      ? skipEmail
        ? 'Prompt berhasil dikirim dan langsung ditayangkan di katalog.'
        : 'Prompt berhasil dikirim!'
      : 'Prompt berhasil dikirim, namun diperlukan peninjauan manual sebelum dipublikasikan.';

    return NextResponse.json(
      { message: successMessage, prompt, persisted },
      { status: 200 },
    );

  } catch (error: any) {
    console.error('Gagal memproses pengiriman prompt:', error);
    return NextResponse.json(
      { message: 'Gagal memproses pengiriman prompt.', error: error.message },
      { status: 500 },
    );
  }
}
