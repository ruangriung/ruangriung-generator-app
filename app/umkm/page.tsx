'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { slugifyProductName, stores } from './data';

export default function UmkmPage() {
  const [selectedStoreId, setSelectedStoreId] = useState<string>(stores[0]?.id ?? '');

  const selectedStore = useMemo(
    () => stores.find((store) => store.id === selectedStoreId) ?? stores[0],
    [selectedStoreId],
  );

  return (
    <div className="bg-white pb-16 pt-12 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
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
          Kembali ke Beranda
        </Link>

        <div className="mb-12 text-center">
          <span className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-700">
            Etalase UMKM
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Temukan UMKM Inspiratif dari Berbagai Penjuru Nusantara
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Jelajahi katalog UMKM pilihan kami. Klik salah satu toko pada grid untuk melihat
            detail produk unggulan, deskripsi, dan layanan yang mereka tawarkan.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {stores.map((store) => {
            const isActive = store.id === selectedStore?.id;

            return (
              <button
                key={store.id}
                type="button"
                onClick={() => setSelectedStoreId(store.id)}
                className={`group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                  isActive
                    ? 'border-indigo-500 shadow-lg shadow-indigo-100'
                    : 'border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60'
                }`}
                aria-pressed={isActive}
              >
                <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={store.heroImage}
                    alt={store.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
                    priority={store.id === stores[0].id}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent" />
                </div>
                <div className="flex flex-1 flex-col justify-between px-4 py-3 text-left">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                      {store.category}
                    </p>
                    <h2 className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">
                      {store.name}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600 sm:text-sm">
                      {store.tagline}
                    </p>
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
              </button>
            );
          })}
        </div>

        {selectedStore ? (
          <section
            aria-labelledby="store-detail-title"
            className="mt-14 rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-inner"
          >
            <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <h2
                  id="store-detail-title"
                  className="text-2xl font-semibold text-slate-900 sm:text-3xl"
                >
                  {selectedStore.name}
                </h2>
                <p className="mt-2 text-sm font-medium uppercase tracking-wide text-indigo-600">
                  {selectedStore.category}
                </p>
                <p className="mt-4 text-base leading-relaxed text-slate-700">
                  {selectedStore.description}
                </p>

                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {selectedStore.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-2 rounded-xl bg-white px-4 py-3 text-sm text-slate-700 shadow"
                    >
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
                        ✔
                      </span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-6">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src={selectedStore.heroImage}
                    alt={selectedStore.name}
                    width={960}
                    height={512}
                    className="h-64 w-full rounded-2xl object-cover shadow-lg"
                    sizes="(min-width: 1024px) 480px, 100vw"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Produk Unggulan</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Ketuk salah satu produk untuk membuka halaman detail lengkap dengan foto, deskripsi, dan tombol pemesanan.
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {selectedStore.products.map((product) => {
                      const whatsappMessage = encodeURIComponent(
                        `Halo ${selectedStore.name}! Saya tertarik dengan ${product.name} seharga ${product.price}. ${product.description} Mohon informasinya.`,
                      );
                      const whatsappHref = `https://wa.me/${selectedStore.whatsappNumber}?text=${whatsappMessage}`;

                      const productSlug = slugifyProductName(product.name);
                      const detailHref = `/umkm/${selectedStore.id}/${productSlug}`;

                      return (
                        <article
                          key={product.name}
                          className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                          <Link
                            href={detailHref}
                            className="group relative block h-40 w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                          >
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(min-width: 1024px) 220px, (min-width: 640px) 45vw, 90vw"
                            />
                            <span className="sr-only">Lihat detail {product.name}</span>
                          </Link>
                          <div className="flex flex-1 flex-col gap-3 px-4 py-3 text-left">
                            <div className="flex flex-col gap-1">
                              <Link
                                href={detailHref}
                                className="text-base font-semibold text-slate-900 transition hover:text-indigo-600"
                              >
                                {product.name}
                              </Link>
                              <span className="text-sm font-medium text-indigo-600">{product.price}</span>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-600">
                              {product.description}
                            </p>
                            <div className="mt-auto flex flex-wrap gap-2">
                              <Link
                                href={detailHref}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                              >
                                Detail Produk
                              </Link>
                              <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Hubungi ${selectedStore.name} untuk ${product.name} via WhatsApp`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 32 32"
                                  aria-hidden="true"
                                  className="h-4 w-4"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M16.05 4A11.93 11.93 0 0 0 4 15.94a11.84 11.84 0 0 0 1.62 5.98L4 28l6.27-1.64a12.08 12.08 0 0 0 5.78 1.48h.01A12 12 0 0 0 16.05 4m5.56 17.23a2.61 2.61 0 0 1-1.79 1.23c-.48.07-1.1.13-1.79-.11c-.41-.13-.94-.3-1.63-.59c-2.87-1.23-4.73-4.12-4.87-4.31s-1.16-1.55-1.16-2.95s.74-2.08 1-2.37s.65-.36.87-.36h.62c.19 0 .47-.08.74.57c.28.66.95 2.29 1.03 2.45s.16.36.03.58s-.19.37-.37.57s-.38.44-.54.6s-.22.32-.1.52a8.93 8.93 0 0 0 1.66 2.14a7.57 7.57 0 0 0 2.4 1.45c.3.11.48.09.66-.05s.76-.88.96-1.18s.4-.25.66-.15s1.69.8 1.98.94s.48.22.55.34a2.39 2.39 0 0 1-.17 1.27"
                                  />
                                </svg>
                                Hubungi via WhatsApp
                              </a>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>

    </div>
  );
}
