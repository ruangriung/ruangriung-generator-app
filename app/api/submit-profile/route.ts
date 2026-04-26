import { NextResponse } from 'next/server';
import {
  createEmailTransporter,
  getDefaultNotificationEmail,
  sanitizeEmailAddresses,
  sanitizeSenderAddress,
  sanitizeString,
} from '@/lib/email';

type ProfileSubmission = {
  name: string;
  role: string;
  description: string;
  brandTagline: string;
  audience: string;
  contentPillars: string;
  brandValues: string;
  customFieldOne: string;
  customFieldTwo: string;
  customFieldThree: string;
  facebook: string;
  youtube: string;
  instagram: string;
  threads: string;
  x: string;
  website: string;
  portfolio: string;
  contactEmail: string;
  contactWhatsapp: string;
  highlight: string;
};

const fieldLabels: Record<keyof ProfileSubmission, string> = {
  name: 'Nama lengkap',
  role: 'Peran atau spesialisasi',
  description: 'Deskripsi singkat',
  brandTagline: 'Tagline personal branding',
  audience: 'Audiens utama',
  contentPillars: 'Pilar konten utama',
  brandValues: 'Nilai atau pesan utama personal brand',
  customFieldOne: 'Kolom tambahan 1',
  customFieldTwo: 'Kolom tambahan 2',
  customFieldThree: 'Kolom tambahan 3',
  facebook: 'Profil Facebook',
  youtube: 'Channel YouTube',
  instagram: 'Profil Instagram',
  threads: 'Profil Threads',
  x: 'Profil X (d/h Twitter)',
  website: 'Website atau blog',
  portfolio: 'Tautan karya unggulan',
  contactEmail: 'Email yang bisa dihubungi',
  contactWhatsapp: 'Kontak WhatsApp',
  highlight: 'Sorotan pencapaian',
};

const requiredFields: (keyof ProfileSubmission)[] = [
  'name',
  'description',
  'facebook',
  'contactEmail',
];

const socials: Array<{ key: keyof ProfileSubmission; label: string }> = [
  { key: 'facebook', label: fieldLabels.facebook },
  { key: 'youtube', label: fieldLabels.youtube },
  { key: 'instagram', label: fieldLabels.instagram },
  { key: 'threads', label: fieldLabels.threads },
  { key: 'x', label: fieldLabels.x },
  { key: 'website', label: fieldLabels.website },
];

const sanitize = (value: unknown): string => sanitizeString(value);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatValue = (value: string) => (value ? escapeHtml(value) : '-');

const createListItem = (label: string, value: string) =>
  `<li><strong>${label}:</strong> ${formatValue(value)}</li>`;

const createPreSection = (label: string, value: string) =>
  `<h3>${label}</h3><pre>${value ? escapeHtml(value) : '-'}</pre>`;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const token = sanitize(body.token);
    const submission: ProfileSubmission = {
      name: sanitize(body.name),
      role: sanitize(body.role),
      description: sanitize(body.description),
      brandTagline: sanitize(body.brandTagline),
      audience: sanitize(body.audience),
      contentPillars: sanitize(body.contentPillars),
      brandValues: sanitize(body.brandValues),
      customFieldOne: sanitize(body.customFieldOne),
      customFieldTwo: sanitize(body.customFieldTwo),
      customFieldThree: sanitize(body.customFieldThree),
      facebook: sanitize(body.facebook),
      youtube: sanitize(body.youtube),
      instagram: sanitize(body.instagram),
      threads: sanitize(body.threads),
      x: sanitize(body.x),
      website: sanitize(body.website),
      portfolio: sanitize(body.portfolio),
      contactEmail: sanitize(body.contactEmail),
      contactWhatsapp: sanitize(body.contactWhatsapp),
      highlight: sanitize(body.highlight),
    };

    const missingFields = requiredFields.filter(field => !submission[field]);
    if (missingFields.length > 0) {
      const readableMissing = missingFields.map(field => fieldLabels[field]).join(', ');
      return NextResponse.json(
        { message: `Lengkapi terlebih dahulu: ${readableMissing}.` },
        { status: 400 },
      );
    }

    const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (!emailPattern.test(submission.contactEmail)) {
      return NextResponse.json(
        { message: 'Pastikan email kontak ditulis dengan format yang benar.' },
        { status: 400 },
      );
    }

    if (!token) {
      return NextResponse.json(
        { message: 'Verifikasi keamanan diperlukan sebelum mengirim pengajuan.' },
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
        response: token,
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
      console.error('Konfigurasi email belum lengkap untuk submission profil.', error);
      return NextResponse.json(
        { message: 'Konfigurasi email belum lengkap di server.' },
        { status: 500 },
      );
    }

    const senderAddress = sanitizeSenderAddress(process.env.NODEMAILER_FROM, nodemailerUser);
    const recipients = sanitizeEmailAddresses([
      process.env.CREATOR_PROFILE_RECIPIENT,
      process.env.CONTACT_EMAIL_RECIPIENT,
      getDefaultNotificationEmail(),
      nodemailerUser,
    ]);

    if (recipients.length === 0) {
      console.error('Tidak ada alamat email penerima yang valid untuk submission profil.');
      return NextResponse.json(
        { message: 'Konfigurasi email penerima belum lengkap di server.' },
        { status: 500 },
      );
    }

    const socialsSection = socials
      .map(({ key, label }) => createListItem(label, submission[key]))
      .join('');

    const html = `
      <h2>Pengajuan Profil Konten Kreator</h2>
      <p>Ada pengajuan profil baru yang dikirim melalui ruangriung.my.id.</p>
      <h3>Informasi Utama</h3>
      <ul>
        ${createListItem(fieldLabels.name, submission.name)}
        ${createListItem(fieldLabels.role, submission.role)}
        ${createListItem(fieldLabels.brandTagline, submission.brandTagline)}
        ${createListItem(fieldLabels.audience, submission.audience)}
      </ul>
      ${createPreSection(fieldLabels.description, submission.description)}
      ${createPreSection(fieldLabels.contentPillars, submission.contentPillars)}
      ${createPreSection(fieldLabels.brandValues, submission.brandValues)}
      <h3>Jejak Digital</h3>
      <ul>
        ${socialsSection}
      </ul>
      <h3>Informasi Tambahan</h3>
      <ul>
        ${createListItem(fieldLabels.portfolio, submission.portfolio)}
        ${createListItem(fieldLabels.customFieldOne, submission.customFieldOne)}
        ${createListItem(fieldLabels.customFieldTwo, submission.customFieldTwo)}
        ${createListItem(fieldLabels.customFieldThree, submission.customFieldThree)}
      </ul>
      ${createPreSection(fieldLabels.highlight, submission.highlight)}
      <h3>Kontak</h3>
      <ul>
        ${createListItem(fieldLabels.contactEmail, submission.contactEmail)}
        ${createListItem(fieldLabels.contactWhatsapp, submission.contactWhatsapp)}
      </ul>
    `;

    const replyToAddress = sanitizeSenderAddress(submission.contactEmail, submission.contactEmail);

    await transporter.sendMail({
      from: senderAddress,
      to: recipients.join(', '),
      replyTo: replyToAddress,
      subject: `Pengajuan Profil Konten Kreator - ${submission.name}`,
      html,
    });

    return NextResponse.json(
      { message: 'Profil Anda berhasil dikirim! Tim RuangRiung akan meninjaunya.' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Gagal memproses submission profil kreator:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'Gagal mengirim pengajuan profil.', error: message },
      { status: 500 },
    );
  }
}
