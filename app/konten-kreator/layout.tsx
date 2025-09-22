import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const title = 'Direktori Konten Kreator RuangRiung - Publish Personal Branding anda atau Kenal Admin & Kontributor RuangRiung';
const description =
  'Halaman ini dirancang untuk memperkenalkan dan memperkuat personal branding para Konten kreator di seluruh dunia sekaligus menonjolkan konten Facebook pro Anda semakin dikenal dunia. Jelajahi direktori ini untuk bertemu rekan seperjalanan yang siap berkolaborasi, membuka peluang baru, dan saling mengangkat karya terbaik';
const url = 'https://ruangriung.my.id/konten-kreator';
const imageUrl = 'https://ruangriung.my.id/og-image/og-image-rr.png';
const imageAlt = 'Banner Direktori Konten Kreator RuangRiung';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'RuangRiung',
    'konten kreator',
    'komunitas kreator',
    'admin ruangriung',
    'kontributor ruangriung',
    'publish personal branding',
  ],
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    siteName: 'RuangRiung',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: imageUrl,
        alt: imageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [
      {
        url: imageUrl,
        alt: imageAlt,
      },
    ],
  },
  other: {
    'twitter:image:alt': imageAlt,
  },
};

export default function KontenKreatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
