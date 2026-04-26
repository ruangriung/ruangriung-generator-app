import type { Metadata } from 'next';
import KontakClient from './KontakClient';

export const metadata: Metadata = {
  title: 'Hubungi Kami | RuangRiung',
  description: 'Punya pertanyaan atau butuh bantuan? Hubungi tim RuangRiung melalui formulir kontak kami. Kami siap mendengarkan masukan dan pertanyaan Anda.',
  keywords: ['kontak ruangriung', 'hubungi kami', 'support ruangriung', 'bantuan AI'],
  alternates: {
    canonical: 'https://ruangriung.my.id/kontak',
  },
  openGraph: {
    title: 'Hubungi Kami | RuangRiung',
    description: 'Punya pertanyaan atau butuh bantuan? Hubungi tim RuangRiung melalui formulir kontak kami.',
    url: 'https://ruangriung.my.id/kontak',
    siteName: 'RuangRiung',
    images: [
      {
        url: 'https://ruangriung.my.id/og-image/og-image-rr.png',
        width: 1200,
        height: 630,
        alt: 'Hubungi Kami RuangRiung',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hubungi Kami | RuangRiung',
    description: 'Hubungi tim RuangRiung melalui formulir kontak kami.',
    images: ['https://ruangriung.my.id/og-image/og-image-rr.png'],
  },
};

export default function KontakPage() {
  return <KontakClient />;
}
