import IdCardGeneratorClient from './IdCardGeneratorClient';
import { Metadata } from 'next';

// --- METADATA SEO YANG DIOPTIMALKAN ---
export const metadata: Metadata = {
  // Menetapkan URL dasar untuk semua URL relatif di metadata
  metadataBase: new URL('https://ruangriung.my.id'),

  title: 'ID Card Generator - Buat Kartu Mahasiswa Kustom | RuangRiung',
  description: 'Buat dan kustomisasi kartu tanda mahasiswa (KTM) secara online dan gratis. Tambahkan foto, logo, QR code, dan unduh desain Anda dengan mudah menggunakan ID Card Generator dari RuangRiung.',
  keywords: 'id card generator, buat kartu mahasiswa, generator ktm, desain id card online, aplikasi pembuat kartu, custom id card, ruangriung',
  
  // Menentukan URL kanonis untuk menghindari duplikasi konten di mata SEO
  alternates: {
    canonical: '/id-card-generator',
  },

  // Metadata untuk Open Graph (Facebook, WhatsApp, dll.)
  openGraph: {
    title: 'ID Card Generator Kustom - Mudah & Gratis | RuangRiung',
    description: 'Rancang dan unduh kartu tanda mahasiswa Anda sendiri. Kustomisasi penuh dengan foto, logo, QR code, dan template desain.',
    url: 'https://ruangriung.my.id/id-card-generator',
    siteName: 'RuangRiung AI Generator',
    images: [
      {
        url: 'https://www.ruangriung.my.id/assets/ruangriung.png', // Gambar preview saat dibagikan
        width: 1200,
        height: 630,
        alt: 'Pratinjau ID Card Generator RuangRiung',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },

  // Metadata untuk Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'ID Card Generator Kustom - Mudah & Gratis | RuangRiung',
    description: 'Rancang dan unduh kartu tanda mahasiswa Anda sendiri. Kustomisasi penuh dengan foto, logo, QR code, dan template desain.',
    images: ['https://www.ruangriung.my.id/assets/ruangriung.png'], // Gambar preview di Twitter
  },
};

export default function IdCardGeneratorPage() {
  return <IdCardGeneratorClient />;
}