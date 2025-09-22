import type { Metadata } from 'next';
import KeywordGeneratorClient from './KeywordGeneratorClient';

export const metadata: Metadata = {
  metadataBase: new URL('https://ruangriung.my.id'),
  title: 'Generator tema unik untuk  Gambar AI| RuangRiung',
  description:
    'Eksplorasi tema AI untuk pemula — dapatkan 20 tema visual eksperimental yang belum pernah terpikirkan sebelumnya, sempurna untuk memperkuat prompt AI Anda.',
  keywords:
    'generator tema AI, kata kunci unik, kata kunci antik, prompt gambar AI, tema AI, eksperimen prompt, ruangriung unique art name, generator unik',
  alternates: {
    canonical: '/UniqueArtName',
  },
  openGraph: {
    title: 'Unique Art Name Theme AI - Tema Unik untuk Gambar AI',
    description:
      'Eksplorasi tema AI untuk pemula — dapatkan 20 tema visual eksperimental yang belum pernah terpikirkan sebelumnya, sempurna untuk memperkuat prompt AI Anda.',
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
