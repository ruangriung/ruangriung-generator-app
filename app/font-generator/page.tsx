import type { Metadata } from 'next';
import FontGeneratorClient from './FontGeneratorClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://ruangriung.my.id'),
  title: 'Font Generator .TTF Kustom | RuangRiung',
  description:
    'Rancang font kustom dan unduh file .ttf langsung dari browser Anda. Atur ketebalan, lebar, serif, hingga x-height untuk menghasilkan typeface unik yang siap dipakai di brand dan produk digital.',
  keywords:
    'font generator ttf, pembuat font online, desain tipografi, ruangriung font generator, buat font sendiri, font editor indonesia',
  alternates: {
    canonical: '/font-generator',
  },
  openGraph: {
    title: 'Font Generator .TTF Kustom | RuangRiung',
    description:
      'Bangun font .ttf Anda sendiri dengan kontrol penuh atas bentuk, kemiringan, serif, dan karakter yang tersedia.',
    url: 'https://ruangriung.my.id/font-generator',
    siteName: 'RuangRiung AI Generator',
    images: [
      {
        url: '/og-image/og-image-font-generator.png',
        width: 1200,
        height: 630,
        alt: 'RuangRiung Font Generator AI',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Font Generator .TTF Kustom | RuangRiung',
    description:
      'Atur parameter tipografi dan hasilkan file font .ttf siap pakai untuk identitas visual, UI, dan materi komunikasi.',
    images: ['/og-image/og-image-font-generator.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function FontGeneratorPage() {
  return <FontGeneratorClient />;
}
