import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { StoreShowcase } from '../_components/StoreShowcase';
import { getStoreById, getStores } from '@/lib/umkm';

interface PageProps {
  params: {
    storeId: string;
  };
}

export async function generateStaticParams() {
  const stores = await getStores();
  return stores.map((store) => ({ storeId: store.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const store = await getStoreById(params.storeId);

  if (!store) {
    return {
      title: 'UMKM tidak ditemukan | Ruang Riung',
      description: 'Toko UMKM yang Anda cari tidak tersedia dalam katalog Ruang Riung.',
    };
  }

  const title = `${store.name} • Etalase UMKM Ruang Riung`;
  const description = `${store.description} Temukan produk unggulan, keunikan layanan, dan hubungi langsung ${store.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://www.ruangriung.id/umkm/${store.id}`,
      images: store.heroImage ? [{ url: store.heroImage, width: 1200, height: 630, alt: store.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: store.heroImage ? [store.heroImage] : undefined,
    },
  };
}

export default async function StoreDetailPage({ params }: PageProps) {
  const store = await getStoreById(params.storeId);

  if (!store) {
    notFound();
  }

  return (
    <div className="bg-white pb-20 pt-12 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/umkm"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Kembali ke daftar UMKM
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75 12 4.5l9 5.25M4.5 10.5v9.75h15V10.5" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>

        <StoreShowcase store={store} />
      </div>
    </div>
  );
}
