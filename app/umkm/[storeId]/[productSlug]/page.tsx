import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  getProductBySlug,
  slugifyProductName,
  stores,
} from '../../data';

interface PageProps {
  params: {
    storeId: string;
    productSlug: string;
  };
}

export function generateStaticParams() {
  return stores.flatMap((store) =>
    store.products.map((product) => ({
      storeId: store.id,
      productSlug: slugifyProductName(product.name),
    })),
  );
}

export function generateMetadata({ params }: PageProps): Metadata {
  const { store, product } = getProductBySlug(params.storeId, params.productSlug);

  if (!store || !product) {
    return {
      title: 'Produk UMKM tidak ditemukan | Ruang Riung',
      description: 'Produk yang Anda cari tidak tersedia dalam katalog UMKM Ruang Riung.',
    };
  }

  const title = `${product.name} • ${store.name} | Etalase UMKM Ruang Riung`;
  const description = `${product.description} Temukan detail lengkap produk unggulan dari ${store.name}.`;

  const ogImage = product.image;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://ruangriung.com/umkm/${store.id}/${params.productSlug}`,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: product.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  const { store, product } = getProductBySlug(params.storeId, params.productSlug);

  if (!store || !product) {
    notFound();
  }

  const whatsappMessage = encodeURIComponent(
    `Halo ${store.name}! Saya tertarik dengan ${product.name} seharga ${product.price}. ${product.description} Mohon informasinya.`,
  );
  const whatsappHref = `https://wa.me/${store.whatsappNumber}?text=${whatsappMessage}`;
  const otherProducts = store.products.filter((item) => item !== product);

  return (
    <div className="bg-white pb-16 pt-12 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/umkm" className="transition hover:text-slate-900">
            UMKM
          </Link>
          <span aria-hidden="true">/</span>
          <span className="transition text-slate-900">{store.name}</span>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-slate-900">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[3fr,2fr]">
          <div className="space-y-8">
            <div className="overflow-hidden rounded-3xl bg-slate-100">
              <Image
                src={product.image}
                alt={product.name}
                width={960}
                height={640}
                className="h-full w-full object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
            </div>

            <section className="space-y-4">
              <header className="space-y-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                  {store.category}
                </span>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{product.name}</h1>
                <p className="text-lg font-semibold text-indigo-600">{product.price}</p>
              </header>

              <p className="text-base leading-relaxed text-slate-700">{product.description}</p>
            </section>

            {otherProducts.length > 0 ? (
              <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Produk Lain dari {store.name}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Jelajahi pilihan produk lain dari toko ini untuk melengkapi kebutuhan Anda.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {otherProducts.map((item) => {
                    const itemSlug = slugifyProductName(item.name);
                    const itemHref = `/umkm/${store.id}/${itemSlug}`;

                    return (
                      <Link
                        key={item.name}
                        href={itemHref}
                        className="group flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition duration-300 group-hover:scale-105"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                          <p className="text-xs text-indigo-600">{item.price}</p>
                        </div>
                        <span className="text-sm font-medium text-indigo-600">Detail</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Tentang {store.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{store.description}</p>

              <dl className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    📍
                  </span>
                  <div>
                    <dt className="font-semibold text-slate-900">Lokasi</dt>
                    <dd>{store.location}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    ✨
                  </span>
                  <div>
                    <dt className="font-semibold text-slate-900">Keunggulan</dt>
                    <dd>
                      <ul className="mt-1 space-y-2">
                        {store.highlights.map((highlight) => (
                          <li key={highlight} className="flex items-start gap-2 text-sm">
                            <span aria-hidden="true">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </div>
              </dl>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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

            <div className="rounded-3xl bg-slate-900 p-6 text-white">
              <h3 className="text-lg font-semibold">Butuh rekomendasi?</h3>
              <p className="mt-2 text-sm text-slate-200">
                Tim Ruang Riung siap membantu menghubungkan Anda dengan produk UMKM lain yang relevan dengan kebutuhan bisnis.
              </p>
              <Link
                href="/kontak"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-200"
              >
                Hubungi Tim Kami
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
