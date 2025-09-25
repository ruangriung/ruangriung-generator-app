import type { Metadata } from 'next';

import { UmkmDirectory } from './_components/UmkmDirectory';
import { getStores } from '@/lib/umkm';

const title = 'Etalase UMKM Inspiratif | Ruang Riung';
const description =
  'Jelajahi UMKM pilihan Ruang Riung lengkap dengan detail produk, foto, dan kontak WhatsApp untuk langsung terhubung dengan pelaku usaha lokal.';
const pageUrl = 'https://www.ruangriung.id/umkm';
const ogImage = 'https://www.ruangriung.id/og-image/og-umkm.jpg';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'UMKM',
    'usaha mikro kecil menengah',
    'produk lokal',
    'bisnis Indonesia',
    'katalog UMKM',
    'Ruang Riung',
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: 'website',
    siteName: 'Ruang Riung',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Etalase UMKM Ruang Riung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage],
  },
};

export default async function UmkmPage() {
  const stores = await getStores();
  const categories = Array.from(new Set(stores.map((store) => store.category))).sort((a, b) =>
    a.localeCompare(b, 'id-ID', { sensitivity: 'base' }),
  );

  return <UmkmDirectory stores={stores} categories={categories} />;
}
