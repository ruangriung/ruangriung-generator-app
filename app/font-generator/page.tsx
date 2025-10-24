import type { Metadata } from 'next';
import FontGeneratorClient from './FontGeneratorClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://ruangriung.my.id'),
  title: 'Font Generator AI untuk Branding & Konten | RuangRiung',
  description:
    'Buat paket tipografi siap pakai untuk brand, konten sosial, dan proyek kreatif Anda. Pilih model dari text.pollinations.ai, jelaskan karakter brand, dan dapatkan rekomendasi font lengkap dengan pairing dan CSS.',
  keywords:
    'font generator AI, rekomendasi font, tipografi brand, text.pollinations.ai font, generator font Indonesia, ruangriung font generator',
  alternates: {
    canonical: '/font-generator',
  },
  openGraph: {
    title: 'Font Generator AI untuk Branding & Konten | RuangRiung',
    description:
      'Susun kombinasi tipografi profesional dengan bantuan AI. Dapatkan rekomendasi font, pasangan, dan snippet CSS dalam hitungan detik.',
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
    title: 'Font Generator AI untuk Branding & Konten | RuangRiung',
    description:
      'Jelaskan brand Anda, pilih model dari text.pollinations.ai, dan AI kami akan menyiapkan rekomendasi font lengkap dengan pairing serta tips penggunaan.',
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
