'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Copy, MapPin, Sparkles } from 'lucide-react';

import type { Product, Store } from '@/lib/umkm/types';
import Pagination from '@/components/Pagination';

const PRODUCTS_PER_PAGE = 4;
const IMAGE_BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMyNTM2NjgiLz48L3N2Zz4=';

const getHighlightSymbol = (text: string) => {
  const normalized = text.toLowerCase();

  if (normalized.includes('organik') || normalized.includes('herbal') || normalized.includes('alami')) {
    return '🌿';
  }

  if (normalized.includes('kopi') || normalized.includes('roast') || normalized.includes('cafe')) {
    return '☕️';
  }

  if (normalized.includes('batik') || normalized.includes('tenun') || normalized.includes('kain')) {
    return '🧵';
  }

  if (normalized.includes('digital') || normalized.includes('teknologi') || normalized.includes('online')) {
    return '💻';
  }

  if (normalized.includes('kerajinan') || normalized.includes('handmade') || normalized.includes('craft')) {
    return '👐';
  }

  return '✨';
};

interface StoreShowcaseProps {
  store: Store;
}

export function StoreShowcase({ store }: StoreShowcaseProps) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [hasCopiedWhatsapp, setHasCopiedWhatsapp] = useState(false);
  const whatsappCopyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    return () => {
      if (whatsappCopyTimeoutRef.current) {
        clearTimeout(whatsappCopyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentProductPage > totalPages) {
      setCurrentProductPage(totalPages);
      setActiveProduct(null);
    }
  }, [currentProductPage, totalPages]);

  const handleCopyWhatsapp = async () => {
    try {
      await navigator.clipboard.writeText(store.whatsappNumber);
      setHasCopiedWhatsapp(true);

      if (whatsappCopyTimeoutRef.current) {
        clearTimeout(whatsappCopyTimeoutRef.current);
      }

      whatsappCopyTimeoutRef.current = setTimeout(() => {
        setHasCopiedWhatsapp(false);
        whatsappCopyTimeoutRef.current = null;
      }, 2000);
    } catch (error) {
      console.error('Gagal menyalin nomor WhatsApp:', error);
    }
  };

  return (
    <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <figure className="overflow-hidden rounded-3xl shadow-xl">
          <div className="relative aspect-[16/9] w-full sm:aspect-[5/2]">
            <Image
              src={store.heroImage}
              alt={store.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 60vw, 100vw"
              priority
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_PLACEHOLDER}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-900/20 to-transparent" />
          </div>
          <figcaption className="flex flex-col gap-3 border-t border-white/20 bg-slate-900/70 px-6 py-4 text-left text-slate-100 backdrop-blur dark:border-slate-700/60 dark:bg-slate-950/60">
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-200">{store.category}</span>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm sm:text-base">
              <span className="font-semibold text-white sm:text-lg">{store.name}</span>
              <span className="inline-flex items-center gap-1 text-indigo-100">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {store.location}
              </span>
            </div>
            {store.tagline ? (
              <span className="inline-flex items-center gap-2 text-sm text-slate-200">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {store.tagline}
              </span>
            ) : null}
          </figcaption>
        </figure>

        <section className="mt-8 space-y-4">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">{store.name}</h1>
            <p className="text-base text-slate-600 dark:text-slate-300 sm:text-lg">
              Berbasis di {store.location} dan melayani pelanggan melalui WhatsApp serta pemesanan langsung.
            </p>
          </header>

          <p className="break-words text-base leading-relaxed text-slate-700 dark:text-slate-200 sm:text-lg">
            {store.description}
          </p>

          <ul className="grid gap-3 sm:grid-cols-2">
            {store.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow sm:text-base dark:bg-slate-900 dark:text-slate-200"
              >
                <span className="mt-0.5 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-base">
                  <span aria-hidden="true">{getHighlightSymbol(highlight)}</span>
                  <span className="sr-only">Sorotan produk</span>
                </span>
                <span className="break-words">{highlight}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="flex flex-col gap-8 rounded-3xl border border-slate-200 bg-slate-50/60 p-6 shadow-inner dark:border-slate-700 dark:bg-slate-900/60">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Hubungi {store.name}</h2>
          <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Siap membantu kebutuhan Anda melalui WhatsApp dengan balasan cepat.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={`${whatsappBase}?text=${encodeURIComponent(`Halo ${store.name}! Saya tertarik dengan produk-produk Anda.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" className="h-5 w-5">
                <path
                  fill="currentColor"
                  d="M16.05 4A11.93 11.93 0 0 0 4 15.94a11.84 11.84 0 0 0 1.62 5.98L4 28l6.27-1.64a12.08 12.08 0 0 0 5.78 1.48h.01A12 12 0 0 0 16.05 4m5.56 17.23a2.61 2.61 0 0 1-1.79 1.23c-.48.07-1.1.13-1.79-.11c-.41-.13-.94-.3-1.63-.59c-2.87-1.23-4.73-4.12-4.87-4.31s-1.16-1.55-1.16-2.95s.74-2.08 1-2.37s.65-.36.87-.36h.62c.19 0 .47-.08.74.57c.28.66.95 2.29 1.03 2.45s.16.36.03.58s-.19.37-.37.57s-.38.44-.54.6s-.22.32-.1.52a8.93 8.93 0 0 0 1.66 2.14a7.57 7.57 0 0 0 2.4 1.45c.3.11.48.09.66-.05s.76-.88.96-1.18s.4-.25.66-.15s1.69.8 1.98.94s.48.22.55.34a2.39 2.39 0 0 1-.17 1.27"
                />
              </svg>
              Hubungi via WhatsApp
            </a>
            <button
              type="button"
              onClick={handleCopyWhatsapp}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/60 dark:focus-visible:ring-offset-slate-950"
            >
              {hasCopiedWhatsapp ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Nomor tersalin
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  Salin nomor WA
                </>
              )}
            </button>
          </div>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {store.whatsappNumber}
          </p>
          <div aria-live="polite" className="sr-only">
            {hasCopiedWhatsapp ? 'Nomor WhatsApp berhasil disalin.' : ''}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Produk Unggulan</h2>
          <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300 sm:text-base">
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
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                >
                  <button
                    type="button"
                    onClick={() => setActiveProduct(product)}
                    className="group relative block h-40 w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 1024px) 220px, (min-width: 640px) 45vw, 90vw"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_PLACEHOLDER}
                    />
                    <span className="sr-only">Perbesar foto {product.name}</span>
                  </button>
                  <div className="flex flex-1 flex-col gap-3 px-4 py-3 text-left">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">{product.name}</h3>
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300 sm:text-base">{product.price}</span>
                    </div>
                    <p className="break-words text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                      {product.description}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-2">
                      <a
                        href={`${whatsappBase}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Hubungi ${store.name} untuk ${product.name} via WhatsApp`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
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
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800/60 dark:focus-visible:ring-offset-slate-950"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-10 sm:py-16"
          onClick={() => setActiveProduct(null)}
        >
          <div
            className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/20 max-h-[90vh] sm:max-h-[85vh] dark:bg-slate-950"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveProduct(null)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-slate-900/90 dark:text-slate-200"
            >
              <span className="sr-only">Tutup pratinjau</span>
              ×
            </button>
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
              <Image
                src={activeProduct.image}
                alt={activeProduct.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_PLACEHOLDER}
                priority
              />
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5 text-left sm:px-8 sm:py-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 sm:text-2xl">{activeProduct.name}</h3>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300 sm:text-base">{activeProduct.price}</p>
              <p className="break-words text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                {activeProduct.description}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
