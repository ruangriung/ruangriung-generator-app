import {
  createEmailTransporter,
  sanitizeEmailAddresses,
  sanitizeSenderAddress,
  sanitizeString,
} from '../lib/email';

const TARGET_EMAIL = 'ayicktigabelas@gmail.com';

async function main() {
  if (!process.env.NODEMAILER_USE_ETHEREAL) {
    process.env.NODEMAILER_USE_ETHEREAL = 'true';
  }

  const { transporter, nodemailerUser, getTestMessageUrl, testAccount } = await createEmailTransporter();

  const senderAddress = sanitizeSenderAddress(
    sanitizeString(process.env.NODEMAILER_FROM) || `"RuangRiung" <${nodemailerUser}>`,
    nodemailerUser,
  );

  const recipients = sanitizeEmailAddresses([
    TARGET_EMAIL,
    nodemailerUser,
  ]);

  if (recipients.length === 0) {
    throw new Error('Tidak ada penerima yang valid untuk pengujian.');
  }

  const info = await transporter.sendMail({
    from: senderAddress,
    to: recipients.join(', '),
    subject: 'Tes Pengiriman Notifikasi Prompt',
    text: 'Ini adalah email percobaan untuk memastikan konfigurasi pengiriman notifikasi prompt bekerja dengan benar.',
    html: `
      <h2>Pengujian Pengiriman Email Prompt</h2>
      <p>Email ini dikirim sebagai bagian dari pengujian otomatis.</p>
      <p>Jika Anda membaca ini di inbox Ethereal, silakan gunakan tautan preview di bawah.</p>
    `,
  });

  const previewUrl = getTestMessageUrl?.(info);

  console.log('Email percobaan berhasil dikirim.');
  console.log('Pengirim:', senderAddress);
  console.log('Penerima:', recipients.join(', '));

  if (testAccount?.web) {
    console.log('Kotak masuk Ethereal:', testAccount.web);
  }

  if (previewUrl) {
    console.log('Preview URL:', previewUrl);
  }
}

main().catch(error => {
  console.error('Gagal menjalankan pengujian email:', error);
  process.exitCode = 1;
});
