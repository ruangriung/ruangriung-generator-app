"use client";

import dynamic from 'next/dynamic';
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, HeartHandshake, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { Store } from '@/lib/umkm/types';
import Pagination from '@/components/Pagination';
import ThemeToggle from '@/components/ThemeToggle';

const ALL_CATEGORY_VALUE = 'Semua kategori';
const STORES_PER_PAGE = 10;
const MAX_PRODUCTS = 5;

const DynamicTurnstile = dynamic(() => import('@/components/TurnstileWidget'), {
  ssr: false,
});

type ProductFormData = {
  name: string;
  price: string;
  description: string;
  image: string;
};

type SubmissionProduct = {
  name: string;
  price: string;
  description: string;
  image?: string;
};

type SubmissionResponse = {
  ownerName: string;
  email: string;
  whatsapp?: string;
  businessName: string;
  businessCategory?: string;
  categorySelection?: string;
  location?: string;
  description: string;
  productHighlights?: string;
  imageLinks?: string;
  additionalInfo?: string;
  products: SubmissionProduct[];
};

type SubmissionPreview = SubmissionResponse & { slug: string };

type FormState = {
  ownerName: string;
  email: string;
  whatsapp: string;
  businessName: string;
  businessCategory: string;
  customBusinessCategory: string;
  location: string;
  description: string;
  productHighlights: string;
  imageLinks: string;
  additionalInfo: string;
  products: ProductFormData[];
};

const slugify = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const generateUniqueSlug = (name: string, existingSlugs: Set<string>) => {
  const baseSlug = slugify(name) || 'umkm';

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let index = 2;
  let candidate = `${baseSlug}-${index}`;

  while (existingSlugs.has(candidate)) {
    index += 1;
    candidate = `${baseSlug}-${index}`;
  }

  return candidate;
};

const createEmptyProduct = (): ProductFormData => ({
  name: '',
  price: '',
  description: '',
  image: '',
});

const createInitialFormState = (): FormState => ({
  ownerName: '',
  email: '',
  whatsapp: '',
  businessName: '',
  businessCategory: '',
  customBusinessCategory: '',
  location: '',
  description: '',
  productHighlights: '',
  imageLinks: '',
  additionalInfo: '',
  products: [createEmptyProduct()],
});

interface UmkmDirectoryProps {
  stores: Store[];
  categories: string[];
}

export function UmkmDirectory({ stores: initialStores, categories }: UmkmDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY_VALUE);
  const [currentStorePage, setCurrentStorePage] = useState(1);
  const storeListRef = useRef<HTMLDivElement | null>(null);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [hasCopiedDonation, setHasCopiedDonation] = useState(false);
  const donationCopyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredStores = useMemo(() => {
    return initialStores.filter((store) => {
      const matchCategory =
        selectedCategory === ALL_CATEGORY_VALUE || store.category === selectedCategory;
      const normalizedSearch = searchTerm.trim().toLowerCase();

      if (!normalizedSearch) {
        return matchCategory;
      }

      const haystack = [store.name, store.tagline, store.location, store.category]
        .join(' ')
        .toLowerCase();

      return matchCategory && haystack.includes(normalizedSearch);
    });
  }, [initialStores, searchTerm, selectedCategory]);

  const totalStorePages = useMemo(() => {
    if (filteredStores.length === 0) {
      return 1;
    }

    return Math.ceil(filteredStores.length / STORES_PER_PAGE);
  }, [filteredStores.length]);

  const paginatedStores = useMemo(() => {
    const startIndex = (currentStorePage - 1) * STORES_PER_PAGE;

    return filteredStores.slice(startIndex, startIndex + STORES_PER_PAGE);
  }, [currentStorePage, filteredStores]);

  useEffect(() => {
    setCurrentStorePage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    if (currentStorePage > totalStorePages) {
      setCurrentStorePage(totalStorePages);
    }
  }, [currentStorePage, totalStorePages]);

  const handleStorePageChange = (page: number) => {
    setCurrentStorePage(page);

    if (storeListRef.current) {
      storeListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCopyDonation = async () => {
    try {
      await navigator.clipboard.writeText('081-330-763-633');
      setHasCopiedDonation(true);

      if (donationCopyTimeoutRef.current) {
        clearTimeout(donationCopyTimeoutRef.current);
      }

      donationCopyTimeoutRef.current = setTimeout(() => {
        setHasCopiedDonation(false);
        donationCopyTimeoutRef.current = null;
      }, 2000);
    } catch (error) {
      console.error('Gagal menyalin nomor donasi:', error);
    }
  };

  const isDonationFeatureEnabled = false;

  const donationToggleLabel = isDonationOpen
    ? 'Sembunyikan informasi dukungan etalase UMKM'
    : 'Tampilkan informasi dukungan etalase UMKM';

  const [formData, setFormData] = useState<FormState>(() => createInitialFormState());
  const [recentSubmissions, setRecentSubmissions] = useState<SubmissionPreview[]>([]);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileKey, setTurnstileKey] = useState(0);

  const openFormModal = () => {
    setFormStatus('idle');
    setFormMessage('');
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setTurnstileToken('');
    setTurnstileKey((previous) => previous + 1);
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeFormModal();
    }
  };

  useEffect(() => {
    if (!isFormModalOpen) {
      document.body.style.overflow = '';
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFormModalOpen(false);
        setTurnstileToken('');
        setTurnstileKey((previous) => previous + 1);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFormModalOpen]);

  useEffect(() => {
    return () => {
      if (donationCopyTimeoutRef.current) {
        clearTimeout(donationCopyTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === 'businessCategory') {
      setFormData((prev) => ({
        ...prev,
        businessCategory: value,
        customBusinessCategory: value === 'Kategori lainnya' ? prev.customBusinessCategory : '',
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index: number, field: keyof ProductFormData, value: string) => {
    setFormData((prev) => {
      const nextProducts = prev.products.map((product, productIndex) => {
        if (productIndex !== index) {
          return product;
        }

        return {
          ...product,
          [field]: value,
        } satisfies ProductFormData;
      });

      return {
        ...prev,
        products: nextProducts,
      } satisfies FormState;
    });
  };

  const addProductField = () => {
    setFormData((prev) => {
      if (prev.products.length >= MAX_PRODUCTS) {
        return prev;
      }

      return {
        ...prev,
        products: [...prev.products, createEmptyProduct()],
      } satisfies FormState;
    });
  };

  const removeProductField = (index: number) => {
    setFormData((prev) => {
      if (prev.products.length <= 1) {
        return prev;
      }

      const nextProducts = prev.products.filter((_, productIndex) => productIndex !== index);

      return {
        ...prev,
        products: nextProducts.length > 0 ? nextProducts : [createEmptyProduct()],
      } satisfies FormState;
    });
  };

  const resetForm = () => {
    setFormData(createInitialFormState());
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const selectedCategory = formData.businessCategory;
    const customCategory = formData.customBusinessCategory.trim();

    if (!formData.ownerName || !formData.email || !formData.businessName || !formData.description) {
      setFormStatus('error');
      setFormMessage('Mohon lengkapi minimal nama penanggung jawab, email, nama usaha, dan deskripsi.');
      return;
    }

    if (selectedCategory === 'Kategori lainnya' && !customCategory) {
      setFormStatus('error');
      setFormMessage('Tuliskan kategori usaha Anda pada kolom yang tersedia.');
      return;
    }

    if (!turnstileToken) {
      setFormStatus('error');
      setFormMessage('Mohon selesaikan verifikasi keamanan sebelum mengirim.');
      return;
    }

    try {
      setFormStatus('loading');
      setFormMessage('');

      const finalCategory =
        selectedCategory === 'Kategori lainnya' ? customCategory : selectedCategory.trim();
      const preparedProducts = formData.products
        .map((product) => ({
          name: product.name.trim(),
          price: product.price.trim(),
          description: product.description.trim(),
          image: product.image.trim(),
        }))
        .filter((product) => product.name && product.price && product.description);

      if (preparedProducts.length === 0) {
        setFormStatus('error');
        setFormMessage('Mohon cantumkan minimal satu produk lengkap dengan harga.');
        return;
      }

      const response = await fetch('/api/umkm-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerName: formData.ownerName,
          email: formData.email,
          whatsapp: formData.whatsapp,
          businessName: formData.businessName,
          businessCategory: finalCategory,
          categorySelection: selectedCategory,
          location: formData.location,
          description: formData.description,
          productHighlights: formData.productHighlights,
          imageLinks: formData.imageLinks,
          additionalInfo: formData.additionalInfo,
          products: preparedProducts,
          token: turnstileToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Gagal mengirimkan data.');
      }

      setFormStatus('success');
      setFormMessage(result?.message || 'Pengajuan berhasil dikirim. Kami akan segera meninjau data Anda.');
      const submission: SubmissionResponse | undefined = result?.submission;

      if (submission) {
        setRecentSubmissions((previous) => {
          const usedSlugs = new Set([
            ...initialStores.map((store) => store.id),
            ...previous.map((entry) => entry.slug),
          ]);

          const preview: SubmissionPreview = {
            ...submission,
            slug: generateUniqueSlug(submission.businessName, usedSlugs),
            products: Array.isArray(submission.products) ? submission.products : [],
          };

          return [preview, ...previous].slice(0, 3);
        });
      }

      resetForm();
      setTurnstileToken('');
      setTurnstileKey((previous) => previous + 1);
    } catch (error) {
      console.error(error);
      setFormStatus('error');
      setFormMessage(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat mengirimkan formulir. Silakan coba lagi nanti.',
      );
    }
  };

  const canAddMoreProducts = formData.products.length < MAX_PRODUCTS;

  return (
    <div className="bg-white pb-16 pt-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/60"
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

          <div className="w-full sm:w-auto sm:min-w-[220px]">
            <ThemeToggle variant="umkm" />
          </div>
        </div>
        <div className="mb-12 text-center">
          <span className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200">
            Etalase UMKM
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Temukan UMKM Inspiratif dari Berbagai Penjuru Nusantara
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Jelajahi katalog UMKM pilihan kami. Ketuk salah satu toko untuk membuka halaman etalase lengkap
            berisi profil usaha, produk unggulan, dan akses langsung ke kontak mereka.
          </p>
        </div>

        {recentSubmissions.length > 0 ? (
          <section className="mb-10 rounded-3xl border border-indigo-200/80 bg-white/80 p-6 shadow-sm shadow-indigo-100/60 dark:border-indigo-900/40 dark:bg-slate-900/60 dark:shadow-slate-900/30 sm:p-8">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 sm:text-xl">Pengajuan Terbaru</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Ringkasan data yang baru saja dikirimkan melalui formulir. Gunakan sebagai referensi sebelum dipublikasikan.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
                Preview internal
              </span>
            </header>

            <div className="mt-6 grid gap-6">
              {recentSubmissions.map((submission, index) => {
                const categoryLabel =
                  submission.businessCategory || submission.categorySelection || 'Kategori belum diisi';
                const contactDetails = [submission.ownerName, submission.email, submission.whatsapp]
                  .filter((detail): detail is string => Boolean(detail && detail.length > 0))
                  .join(' • ');

                return (
                  <article
                    key={`${submission.slug}-${index}`}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950/60"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                          {submission.businessName}
                        </h3>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
                          Slug saran: {submission.slug}
                        </p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
                        {categoryLabel}
                      </span>
                    </div>
                    {submission.location ? (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Domisili: {submission.location}</p>
                    ) : null}
                    <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      {submission.description}
                    </p>
                    {submission.productHighlights ? (
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">Sorotan:</span>{' '}
                        {submission.productHighlights}
                      </p>
                    ) : null}
                    {submission.products.length > 0 ? (
                      <div className="mt-5">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Produk yang diajukan</h4>
                        <ul className="mt-3 space-y-3">
                          {submission.products.map((product, productIndex) => (
                            <li
                              key={`${submission.slug}-${productIndex}-${product.name}`}
                              className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm dark:border-slate-700 dark:bg-slate-900/60"
                            >
                              <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{product.name}</span>
                                <span className="text-indigo-600 dark:text-indigo-300">{product.price}</span>
                              </div>
                              <p className="mt-2 whitespace-pre-line text-slate-600 dark:text-slate-300">
                                {product.description}
                              </p>
                              {product.image ? (
                                <a
                                  href={product.image}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
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
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10v11h11" />
                                  </svg>
                                  Lihat tautan gambar
                                </a>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">Kontak Utama</p>
                        <p className="mt-1 break-words">{contactDetails}</p>
                      </div>
                      {submission.imageLinks ? (
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">Tautan Gambar/Katalog</p>
                          <a
                            href={submission.imageLinks}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex break-all text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                          >
                            {submission.imageLinks}
                          </a>
                        </div>
                      ) : null}
                      {submission.additionalInfo ? (
                        <div className="sm:col-span-2">
                          <p className="font-semibold text-slate-800 dark:text-slate-100">Informasi Tambahan</p>
                          <p className="mt-1 whitespace-pre-line">{submission.additionalInfo}</p>
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        <div className="mb-10 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-900/60 dark:shadow-slate-900/40 sm:grid-cols-3 sm:items-end">
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Cari toko atau kata kunci</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Misal: kopi, batik, Yogyakarta"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Filter kategori</span>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value={ALL_CATEGORY_VALUE}>Semua kategori</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div ref={storeListRef}>
          {filteredStores.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {paginatedStores.map((store) => (
              <Link
                key={store.id}
                href={`/umkm/${store.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-700 dark:bg-slate-900 dark:hover:shadow-slate-900/60 dark:focus-visible:ring-offset-slate-950"
              >
                <div className="relative h-32 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
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
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">{store.category}</p>
                    <h2 className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100 sm:text-base">{store.name}</h2>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300 sm:text-sm">{store.tagline}</p>
                  </div>
                  <p className="mt-3 flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
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
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
              <p className="text-base font-semibold text-slate-800 dark:text-slate-100">Hmm, belum ada hasil yang cocok.</p>
              <p className="mt-2 text-sm">
                Coba ubah kata kunci pencarian atau pilih kategori lain untuk menemukan UMKM yang Anda butuhkan.
              </p>
            </div>
          )}
        </div>

        {filteredStores.length > STORES_PER_PAGE ? (
          <Pagination
            currentPage={currentStorePage}
            totalPages={totalStorePages}
            onPageChange={handleStorePageChange}
          />
        ) : (
          null
        )}

        <section className="mt-16 rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-8 shadow-sm shadow-indigo-100/70 dark:border-slate-700 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:shadow-slate-900/40 sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
              Daftarkan UMKM Anda ke dalam Katalog Kami
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
              Ceritakan lebih jauh tentang usaha Anda melalui formulir di bawah ini. Tim kami akan meninjau setiap
              pengajuan dan menghubungi Anda kembali melalui email atau WhatsApp.
            </p>
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-700 dark:border-amber-400/40 dark:bg-amber-900/20 dark:text-amber-200">
              <strong className="font-semibold">Catatan gambar:</strong> cantumkan tautan drive, folder, atau marketplace
              yang berisi foto produk Anda. Kami tidak menerima unggahan file langsung agar tetap ringan bagi penyimpanan.
            </p>
          </div>

          <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-4 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-base">
              Tekan tombol di bawah ini untuk membuka formulir pengajuan. Anda dapat menggulir isi formulir secara nyaman,
              termasuk saat diakses melalui ponsel.
            </p>
            <button
              type="button"
              onClick={openFormModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/40 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-2 focus:ring-offset-indigo-100 dark:focus:ring-offset-slate-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Buka Formulir Pengajuan
            </button>
          </div>
        </section>
        {isFormModalOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-10"
            role="presentation"
            onClick={handleBackdropClick}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="umkm-submission-title"
              className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 dark:border-slate-700 dark:bg-slate-950"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeFormModal}
                className="absolute right-4 top-4 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus:ring-offset-slate-900"
                aria-label="Tutup formulir UMKM"
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="max-h-[min(90vh,48rem)] overflow-y-auto px-6 py-10 sm:px-10">
                <div className="mx-auto max-w-2xl text-left">
                  <h2 id="umkm-submission-title" className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
                    Formulir Pengajuan UMKM
                  </h2>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
                    Lengkapi informasi berikut agar tim kurasi kami dapat memproses dan menampilkan UMKM Anda di Ruang Riung.
                    Semua kolom dapat digulir dan tetap nyaman dibaca, termasuk pada layar ponsel.
                  </p>
                </div>

                <form className="mx-auto mt-8 grid max-w-2xl gap-6" onSubmit={handleSubmit}>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-left">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Nama penanggung jawab</span>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-left">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email aktif</span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-left">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Nomor WhatsApp</span>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="Contoh: 6281234567890"
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-left">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Nama UMKM</span>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </label>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-left">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Kategori utama</span>
                      <select
                        name="businessCategory"
                        value={formData.businessCategory}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                      >
                        <option value="">Pilih kategori</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                        <option value="Kategori lainnya">Kategori lainnya</option>
                      </select>
                    </label>
                    {formData.businessCategory === 'Kategori lainnya' && (
                      <label className="flex flex-col gap-2 text-left sm:col-span-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Tuliskan kategori usaha</span>
                        <input
                          type="text"
                          name="customBusinessCategory"
                          value={formData.customBusinessCategory}
                          onChange={handleInputChange}
                          required
                          placeholder="Contoh: Kuliner sehat, Jasa desain interior, dsb."
                          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                        />
                      </label>
                    )}
                    <label className="flex flex-col gap-2 text-left">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Domisili usaha</span>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Kota/Kabupaten, Provinsi"
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-2 text-left">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Deskripsi singkat usaha</span>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-left">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Sorotan produk/jasa</span>
                    <textarea
                      name="productHighlights"
                      value={formData.productHighlights}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Ceritakan produk unggulan atau layanan utama"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </label>

                  <div className="flex flex-col gap-4 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Produk unggulan yang ingin ditampilkan
                      </span>
                      <button
                        type="button"
                        onClick={addProductField}
                        disabled={!canAddMoreProducts}
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900/40"
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
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah produk
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Tulis minimal satu produk lengkap dengan nama, harga, dan deskripsi. Tautan gambar bersifat opsional.
                    </p>
                    <div className="space-y-5">
                      {formData.products.map((product, index) => (
                        <div
                          key={`product-${index}`}
                          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                              Produk {index + 1}
                            </h3>
                            {formData.products.length > 1 ? (
                              <button
                                type="button"
                                onClick={() => removeProductField(index)}
                                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-400/60 dark:text-rose-300 dark:hover:bg-rose-950/40"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  className="h-3.5 w-3.5"
                                  aria-hidden="true"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                                Hapus
                              </button>
                            ) : null}
                          </div>
                          <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <label className="flex flex-col gap-2 text-left">
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Nama produk</span>
                              <input
                                type="text"
                                value={product.name}
                                onChange={(event) => handleProductChange(index, 'name', event.target.value)}
                                placeholder="Contoh: Paket Nasi Bakar Spesial"
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                              />
                            </label>
                            <label className="flex flex-col gap-2 text-left">
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Harga</span>
                              <input
                                type="text"
                                value={product.price}
                                onChange={(event) => handleProductChange(index, 'price', event.target.value)}
                                placeholder="Contoh: Rp28.000 / porsi"
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                              />
                            </label>
                          </div>
                          <label className="mt-4 flex flex-col gap-2 text-left">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Deskripsi produk</span>
                            <textarea
                              value={product.description}
                              onChange={(event) => handleProductChange(index, 'description', event.target.value)}
                              rows={3}
                              placeholder="Ceritakan keunikan, bahan utama, atau manfaat produk"
                              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                            />
                          </label>
                          <label className="mt-4 flex flex-col gap-2 text-left">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Tautan gambar produk (opsional)</span>
                            <input
                              type="url"
                              value={product.image}
                              onChange={(event) => handleProductChange(index, 'image', event.target.value)}
                              placeholder="https://..."
                              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <label className="flex flex-col gap-2 text-left">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Tautan gambar atau katalog</span>
                    <input
                      type="url"
                      name="imageLinks"
                      value={formData.imageLinks}
                      onChange={handleInputChange}
                      placeholder="Contoh: https://drive.google.com/your-folder"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-left">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Informasi tambahan</span>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Berikan informasi tambahan seperti promo, jam operasional, dsb."
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </label>

                  <div className="flex flex-col gap-4 text-left">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      <p className="font-medium text-slate-700 dark:text-slate-200">Verifikasi keamanan</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Centang captcha Cloudflare Turnstile di bawah ini sebelum mengirimkan formulir.
                      </p>
                      <div className="mt-4">
                        <DynamicTurnstile
                          key={turnstileKey}
                          onSuccess={(token) => setTurnstileToken(token)}
                          options={{ theme: 'auto' }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === 'loading'}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/40 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:ring-offset-2 focus:ring-offset-indigo-100 dark:focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {formStatus === 'loading' ? (
                        <>
                          <svg
                            className="h-4 w-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                          </svg>
                          Mengirim...
                        </>
                      ) : (
                        'Kirim Pengajuan'
                      )}
                    </button>
                    {formStatus !== 'idle' ? (
                      <p
                        className={`text-sm ${
                          formStatus === 'success' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {formMessage}
                      </p>
                    ) : null}
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {isDonationFeatureEnabled ? (
        <>
          <button
            type="button"
            onClick={() => setIsDonationOpen((previous) => !previous)}
            className="fixed right-4 z-50 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-600/40 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 sm:right-6"
            style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
            aria-expanded={isDonationOpen}
            aria-controls="umkm-donation-card"
            aria-pressed={isDonationOpen}
            aria-label={donationToggleLabel}
            title={donationToggleLabel}
          >
            <HeartHandshake className="h-5 w-5" />
            <span className="hidden sm:inline">Dukung Etalase</span>
            <span className="sr-only">Dukung Etalase UMKM</span>
          </button>

          {isDonationOpen ? (
            <div
              id="umkm-donation-card"
              className="fixed right-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-indigo-200 bg-white p-5 text-left shadow-2xl dark:border-indigo-900/40 dark:bg-slate-950 sm:right-6 sm:w-[calc(100%-3rem)]"
              style={{ bottom: 'calc(6.5rem + env(safe-area-inset-bottom, 0px))' }}
              role="complementary"
              aria-label="Informasi dukungan Etalase UMKM"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-300">Dukung Etalase UMKM</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    Bantu RuangRiung menjaga keberlanjutan etalase UMKM dengan donasi sukarela. Kirimkan dukungan melalui e-wallet ke nomor
                    <span className="font-semibold text-slate-900 dark:text-slate-100"> 081-330-763-633</span> atas nama
                    <span className="font-semibold text-slate-900 dark:text-slate-100"> Arif Tirtana</span>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDonationOpen(false)}
                  className="rounded-full bg-indigo-50 p-1 text-indigo-600 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-200 dark:hover:bg-indigo-900/60"
                  aria-label="Tutup informasi donasi"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-indigo-50 p-3 text-sm text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
                  <div>
                    <p className="font-semibold">Nomor E-Wallet</p>
                    <p className="font-mono text-base">081-330-763-633</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyDonation}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    {hasCopiedDonation ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Disalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="rounded-xl bg-indigo-50 p-3 text-xs leading-relaxed text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
                  Dukungan Anda membantu kami terus menampilkan UMKM inspiratif, melakukan kurasi, dan memperluas jangkauan usaha lokal.
                  Terima kasih telah menjadi bagian dari perjalanan ini!
                </p>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
