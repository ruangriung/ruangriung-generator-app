import Image from 'next/image';
import Link from 'next/link';

import { stores } from './data';

export default function UmkmPage() {
  return (
    <div className="bg-white pb-16 pt-12 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-700">
            Etalase UMKM
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Temukan UMKM Inspiratif dari Berbagai Penjuru Nusantara
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Jelajahi katalog UMKM pilihan kami. Ketuk salah satu toko untuk membuka halaman etalase lengkap
            berisi profil usaha, produk unggulan, dan akses langsung ke kontak mereka.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {stores.map((store) => (
            <Link
              key={store.id}
              href={`/umkm/${store.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                <Image
                  src={store.heroImage}
                  alt={store.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent" />
              </div>
              <div className="flex flex-1 flex-col justify-between px-4 py-3 text-left">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{store.category}</p>
                  <h2 className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">{store.name}</h2>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600 sm:text-sm">{store.tagline}</p>
                </div>
                <p className="mt-3 flex items-center gap-1 text-xs font-medium text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21c4.97-4.03 8-7.459 8-11a8 8 0 1 0-16 0c0 3.541 3.03 6.97 8 11z"
                    />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  {store.location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
