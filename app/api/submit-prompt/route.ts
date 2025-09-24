
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { revalidatePath } from 'next/cache';
import { createPrompt } from '@/lib/prompts';

const sanitizeString = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

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

const createTransportOptions = (
  user: string,
  pass: string,
): SMTPTransport.Options => {
  const configuredService = sanitizeString(process.env.NODEMAILER_SERVICE);

  if (configuredService) {
    return {
      service: configuredService,
      auth: {
        user,
        pass,
      },
    } satisfies SMTPTransport.Options;
  }

  const host = sanitizeString(process.env.NODEMAILER_SMTP_HOST) || 'smtp.gmail.com';
  const port = process.env.NODEMAILER_SMTP_PORT
    ? Number(process.env.NODEMAILER_SMTP_PORT)
    : 465;
  const secure = process.env.NODEMAILER_SMTP_SECURE
    ? process.env.NODEMAILER_SMTP_SECURE === 'true'
    : true;

  return {
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  } satisfies SMTPTransport.Options;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const author = sanitizeString(body.author);
    const email = sanitizeString(body.email);
    const facebook = sanitizeOptionalString(body.facebook);
    const image = sanitizeOptionalString(body.image);
    const link = sanitizeOptionalString(body.link);
    const title = sanitizeString(body.title);
    const promptContent = sanitizeString(body.promptContent);
    const tool = sanitizeString(body.tool);
    const tags = ensureStringArray(body.tags);
    const token = sanitizeString(body.token);

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

    const prompt = await createPrompt({
      author,
      email,
      facebook,
      image,
      link,
      title,
      promptContent,
      tool,
      tags,
    });

    const nodemailerUser = sanitizeString(process.env.NODEMAILER_EMAIL);
    const nodemailerPass = sanitizeString(process.env.NODEMAILER_APP_PASSWORD);

    if (!nodemailerUser || !nodemailerPass) {
      console.error('NODEMAILER_EMAIL atau NODEMAILER_APP_PASSWORD belum diatur.');
      return NextResponse.json(
        { message: 'Layanan email belum dikonfigurasi dengan benar.' },
        { status: 500 },
      );
    }

    const transportOptions = createTransportOptions(nodemailerUser, nodemailerPass);
    const transporter = nodemailer.createTransport(transportOptions);

    const senderAddress = sanitizeString(process.env.NODEMAILER_FROM) || nodemailerUser;
    const recipientAddress =
      sanitizeString(process.env.PROMPT_SUBMISSION_RECIPIENT) ||
      sanitizeString(process.env.CONTACT_EMAIL_RECIPIENT) ||
      nodemailerUser;

    const safeTags = tags.map(tag => escapeHtml(tag));
    const formattedTags = safeTags.length > 0 ? safeTags.join(', ') : '-';

    const mailOptions = {
      from: senderAddress,
      to: recipientAddress,
      subject: `Submission Prompt Baru: ${escapeHtml(title)}`,
      html: `
        <h2>Submission Prompt Baru</h2>
        <p><strong>Nama Pengirim:</strong> ${escapeHtml(author)}</p>
        <p><strong>Email Pengirim:</strong> ${escapeHtml(email)}</p>
        <p><strong>Link Facebook:</strong> ${formatOptionalValue(facebook)}</p>
        <p><strong>Link:</strong> ${formatOptionalValue(link)}</p>
        <p><strong>Link Gambar:</strong> ${formatOptionalValue(image)}</p>
        <p><strong>Judul Prompt:</strong> ${escapeHtml(title)}</p>
        <p><strong>Tool:</strong> ${escapeHtml(tool)}</p>
        <p><strong>Tags:</strong> ${formattedTags}</p>
        <p><strong>Slug:</strong> ${escapeHtml(prompt.slug)}</p>
        <p><strong>Isi Prompt:</strong></p>
        <pre>${escapeHtml(promptContent)}</pre>
      `,
    };

    await transporter.sendMail(mailOptions);

    revalidatePath('/kumpulan-prompt');
    revalidatePath(`/kumpulan-prompt/${prompt.slug}`);

    return NextResponse.json({ message: 'Prompt berhasil dikirim!', prompt }, { status: 200 });

  } catch (error: any) {
    console.error('Gagal mengirim email:', error);
    return NextResponse.json({ message: 'Gagal mengirim email.', error: error.message }, { status: 500 });
  }
}
