'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { Product, Store } from '@/lib/umkm/types';
import Pagination from '@/components/Pagination';

const PRODUCTS_PER_PAGE = 4;

interface StoreShowcaseProps {
  store: Store;
}

export function StoreShowcase({ store }: StoreShowcaseProps) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const whatsappBase = useMemo(() => `https://wa.me/${store.whatsappNumber}`, [store.whatsappNumber]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(store.products.length / PRODUCTS_PER_PAGE));
  }, [store.products.length]);

  const startIndex = (currentProductPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = store.products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveProduct(null);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setActiveProduct(null);
    setCurrentProductPage(1);
  }, [store.id]);

  useEffect(() => {
    if (currentProductPage > totalPages) {
      setCurrentProductPage(totalPages);
      setActiveProduct(null);
    }
  }, [currentProductPage, totalPages]);

  return (
    <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <div className="overflow-hidden rounded-3xl">
          <Image
            src={store.heroImage}
            alt={store.name}
            width={960}
            height={540}
            className="h-64 w-full rounded-3xl object-cover shadow-xl"
            sizes="(min-width: 1024px) 60vw, 100vw"
            priority
          />
        </div>

        <section className="mt-8 space-y-4">
          <header className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {store.category}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{store.name}</h1>
            <p className="text-base text-slate-600">{store.location}</p>
          </header>

          <p className="text-base leading-relaxed text-slate-700">{store.description}</p>

          <ul className="grid gap-3 sm:grid-cols-2">
            {store.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow"
              >
                <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
                  ✔
                </span>
                {highlight}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="flex flex-col gap-8 rounded-3xl border border-slate-200 bg-slate-50/60 p-6 shadow-inner">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Hubungi {store.name}</h2>
          <p className="mt-1 text-sm text-slate-600">
            Siap membantu kebutuhan Anda melalui WhatsApp dengan balasan cepat.
          </p>
          <a
            href={`${whatsappBase}?text=${encodeURIComponent(`Halo ${store.name}! Saya tertarik dengan produk-produk Anda.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" className="h-5 w-5">
              <path
                fill="currentColor"
                d="M16.05 4A11.93 11.93 0 0 0 4 15.94a11.84 11.84 0 0 0 1.62 5.98L4 28l6.27-1.64a12.08 12.08 0 0 0 5.78 1.48h.01A12 12 0 0 0 16.05 4m5.56 17.23a2.61 2.61 0 0 1-1.79 1.23c-.48.07-1.1.13-1.79-.11c-.41-.13-.94-.3-1.63-.59c-2.87-1.23-4.73-4.12-4.87-4.31s-1.16-1.55-1.16-2.95s.74-2.08 1-2.37s.65-.36.87-.36h.62c.19 0 .47-.08.74.57c.28.66.95 2.29 1.03 2.45s.16.36.03.58s-.19.37-.37.57s-.38.44-.54.6s-.22.32-.1.52a8.93 8.93 0 0 0 1.66 2.14a7.57 7.57 0 0 0 2.4 1.45c.3.11.48.09.66-.05s.76-.88.96-1.18s.4-.25.66-.15s1.69.8 1.98.94s.48.22.55.34a2.39 2.39 0 0 1-.17 1.27"
              />
            </svg>
            Hubungi via WhatsApp
          </a>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">Produk Unggulan</h2>
          <p className="mt-1 text-sm text-slate-600">
            Klik foto produk untuk melihat tampilan penuh serta detail lengkapnya.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {paginatedProducts.map((product) => {
              const whatsappMessage = encodeURIComponent(
                `Halo ${store.name}! Saya tertarik dengan ${product.name} seharga ${product.price}. ${product.description} Mohon informasinya.`,
              );

              return (
                <article
                  key={product.name}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setActiveProduct(product)}
                    className="group relative block h-40 w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 1024px) 220px, (min-width: 640px) 45vw, 90vw"
                    />
                    <span className="sr-only">Perbesar foto {product.name}</span>
                  </button>
                  <div className="flex flex-1 flex-col gap-3 px-4 py-3 text-left">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
                      <span className="text-sm font-medium text-indigo-600">{product.price}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">{product.description}</p>
                    <div className="mt-auto flex flex-wrap gap-2">
                      <a
                        href={`${whatsappBase}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Hubungi ${store.name} untuk ${product.name} via WhatsApp`}
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
                        WhatsApp Toko
                      </a>
                      <Link
                        href={`/umkm`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        Lihat Toko Lain
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 ? (
            <Pagination
              currentPage={currentProductPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentProductPage(page);
                setActiveProduct(null);
              }}
            />
          ) : null}
        </div>
      </aside>

      {activeProduct ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-10"
          onClick={() => setActiveProduct(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveProduct(null)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <span className="sr-only">Tutup pratinjau</span>
              ×
            </button>
            <Image
              src={activeProduct.image}
              alt={activeProduct.name}
              width={1200}
              height={800}
              className="h-auto w-full object-cover"
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
            <div className="space-y-2 px-6 py-5">
              <h3 className="text-xl font-semibold text-slate-900">{activeProduct.name}</h3>
              <p className="text-sm font-medium text-indigo-600">{activeProduct.price}</p>
              <p className="text-sm leading-relaxed text-slate-600">{activeProduct.description}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
