import type { Metadata } from 'next';
import KeywordGeneratorClient from './KeywordGeneratorClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://ruangriung.my.id'),
  title: 'Generator Kata Kunci Unik untuk Prompt Gambar | RuangRiung',
  description:
    'Bangun 20 kata kunci antik yang belum pernah ada setiap kali Anda bereksperimen dengan prompt gambar AI. Cocok untuk eksplorasi gaya visual baru dan penulisan deskripsi karya.',
  keywords:
    'generator kata kunci unik, kata kunci antik, prompt gambar AI, eksperimen prompt, ruangriung unique art name, generator pollinations',
  alternates: {
    canonical: '/UniqueArtName',
  },
  openGraph: {
    title: 'Unique Art Name Prompt Lab - Generator Kata Kunci Antik',
    description:
      'Uji coba prompt gambar AI dengan 20 kata kunci eksperimental lengkap bersama deskripsi singkat yang mudah disalin.',
    url: 'https://ruangriung.my.id/UniqueArtName',
    siteName: 'RuangRiung AI Generator',
    images: [
      {
        url: '/og-image/og-image-unique-keyword.png',
        width: 1200,
        height: 630,
        alt: 'Pratinjau generator kata kunci unik RuangRiung',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generator Kata Kunci Unik untuk Prompt Gambar | RuangRiung',
    description:
      'Eksplorasi kata kunci antik yang membantu merancang prompt gambar AI yang segar dan eksperimental.',
    images: ['/og-image/og-image-unique-keyword.png'],
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

export default function UniqueArtNamePage() {
  return <KeywordGeneratorClient />;
}
