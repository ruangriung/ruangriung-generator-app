"use client";

import dynamic from 'next/dynamic';
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpDown, MapPin, Sparkles, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import type { Store } from '@/lib/umkm/types';
import Pagination from '@/components/Pagination';
import ThemeToggle from '@/components/ThemeToggle';

const ALL_CATEGORY_VALUE = 'Semua kategori';
const STORES_PER_PAGE = 10;
const MAX_PRODUCTS = 5;
const ALL_LOCATION_VALUE = 'Semua lokasi';
const DEFAULT_SORT_OPTION = 'featured' as const;

type SortOption = typeof DEFAULT_SORT_OPTION | 'name-asc' | 'name-desc' | 'location-asc';

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: DEFAULT_SORT_OPTION, label: 'Kurasi unggulan' },
  { value: 'name-asc', label: 'Nama A – Z' },
  { value: 'name-desc', label: 'Nama Z – A' },
  { value: 'location-asc', label: 'Lokasi A – Z' },
];

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
  const [selectedLocation, setSelectedLocation] = useState(ALL_LOCATION_VALUE);
  const [sortOption, setSortOption] = useState<SortOption>(DEFAULT_SORT_OPTION);
  const [currentStorePage, setCurrentStorePage] = useState(1);
  const storeListRef = useRef<HTMLDivElement | null>(null);

  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(initialStores.map((store) => store.location)))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'id-ID', { sensitivity: 'base' }));
  }, [initialStores]);

  const totalStores = initialStores.length;
  const totalCategories = categories.length;
  const totalLocations = uniqueLocations.length;

  const numberFormatter = useMemo(() => new Intl.NumberFormat('id-ID'), []);

  const heroStats = useMemo(
    () => [
      {
        label: 'UMKM aktif',
        value: numberFormatter.format(totalStores),
        description: 'Produk UMKM terpopuler yang paling dicari komunitas',
      },
      {
        label: 'Kategori pilihan',
        value: numberFormatter.format(totalCategories),
        description: 'Mulai dari kuliner, fesyen, hingga jasa kreatif',
      },
      {
        label: 'Kota & kabupaten',
        value: numberFormatter.format(totalLocations),
        description: 'Jejaring pelaku usaha lokal di seluruh nusantara',
      },
    ],
    [numberFormatter, totalCategories, totalLocations, totalStores],
  );

  const curatedTestimonial = useMemo(
    () => ({
      quote:
        '“Listing RuangRiung membantu kami ditemukan komunitas baru. Cerita yang mereka susun membuat calon pelanggan merasa dekat dengan usaha kami.”',
      author: 'Riana, Pendiri Kopi Searah',
      role: 'UMKM kuliner binaan sejak 2023',
    }),
    [],
  );

  const processedStores = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = initialStores.filter((store) => {
      const matchCategory =
        selectedCategory === ALL_CATEGORY_VALUE || store.category === selectedCategory;
      const matchLocation =
        selectedLocation === ALL_LOCATION_VALUE || store.location === selectedLocation;

      if (!normalizedSearch) {
        return matchCategory && matchLocation;
      }

      const haystack = [store.name, store.tagline, store.location, store.category]
        .join(' ')
        .toLowerCase();

      return matchCategory && matchLocation && haystack.includes(normalizedSearch);
    });

    const sorted = [...filtered].sort((first, second) => {
      switch (sortOption) {
        case 'name-asc':
          return first.name.localeCompare(second.name, 'id-ID', { sensitivity: 'base' });
        case 'name-desc':
          return second.name.localeCompare(first.name, 'id-ID', { sensitivity: 'base' });
        case 'location-asc':
          return first.location.localeCompare(second.location, 'id-ID', { sensitivity: 'base' });
        case 'featured':
        default:
          return first.category.localeCompare(second.category, 'id-ID', { sensitivity: 'base' });
      }
    });

    return sorted;
  }, [initialStores, searchTerm, selectedCategory, selectedLocation, sortOption]);

  const totalStorePages = useMemo(() => {
    if (processedStores.length === 0) {
      return 1;
    }

    return Math.ceil(processedStores.length / STORES_PER_PAGE);
  }, [processedStores.length]);

  const paginatedStores = useMemo(() => {
    const startIndex = (currentStorePage - 1) * STORES_PER_PAGE;

    return processedStores.slice(startIndex, startIndex + STORES_PER_PAGE);
  }, [currentStorePage, processedStores]);

  useEffect(() => {
    setCurrentStorePage(1);
  }, [searchTerm, selectedCategory, selectedLocation, sortOption]);

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 pt-20 text-slate-900 dark:text-slate-100 selection:bg-primary-500/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-6">
          <Link
            href="/"
            className="group flex items-center gap-3 px-6 py-3 glass-button rounded-full text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Beranda
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle variant="umkm" />
          </div>
        </div>
        <section className="mb-20 glass-card p-8 sm:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -ml-48 -mb-48" />
          
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 mb-6">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Etalase UMKM Indonesia
            </span>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl leading-[1.1]">
              Gerbang <span className="text-primary-500">Inspirasi</span> Ekonomi Lokal
            </h1>
            <p className="mt-8 text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
              Jelajahi kurasi UMKM terbaik dari seluruh Nusantara. Temukan kisah unik, produk berkualitas, dan jalin kolaborasi langsung.
            </p>
          </div>

          <div className="relative z-10 mt-16 grid gap-6 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="glass-inset p-8 text-left group hover:bg-white/10 transition-colors"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 mb-2">
                  {stat.label}
                </p>
                <p className="text-4xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                <p className="mt-4 text-xs font-bold text-slate-400 leading-relaxed">{stat.description}</p>
              </div>
            ))}
          </div>

          <figure className="relative z-10 mt-12 glass p-8 text-left border-l-4 border-l-primary-500">
            <blockquote className="text-lg italic font-medium text-slate-700 dark:text-slate-200">
              {curatedTestimonial.quote}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-black">
                {curatedTestimonial.author[0]}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">{curatedTestimonial.author}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{curatedTestimonial.role}</p>
              </div>
            </figcaption>
          </figure>
        </section>

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

        <section className="mb-12 glass-card p-6 grid gap-6 sm:grid-cols-4 items-end">
          <label className="flex flex-col gap-3 sm:col-span-2">
            <span className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Pencarian Pintar</span>
            <div className="relative group">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Cari kopi, batik, kuliner..."
                className="w-full h-12 rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-4 pl-12 text-sm font-bold text-slate-900 dark:text-white focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all"
              />
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" aria-hidden="true" />
            </div>
          </label>

          <label className="flex flex-col gap-3">
            <span className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Kategori</span>
            <div className="relative group">
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="w-full h-12 rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-4 text-sm font-bold text-slate-900 dark:text-white appearance-none cursor-pointer focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all"
              >
                <option value={ALL_CATEGORY_VALUE} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Semua kategori</option>
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {category}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-hover:text-primary-500 transition-colors" aria-hidden="true" />
            </div>
          </label>

          <label className="flex flex-col gap-3">
            <span className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Urutkan</span>
            <div className="relative group">
              <select
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value as SortOption)}
                className="w-full h-12 rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-4 text-sm font-bold text-slate-900 dark:text-white appearance-none cursor-pointer focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {option.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-hover:text-primary-500 transition-colors" aria-hidden="true" />
            </div>
          </label>
        </section>

        <div ref={storeListRef}>
          {processedStores.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {paginatedStores.map((store) => {
                const featuredProduct = store.products[0];

                return (
                  <Link
                    key={store.id}
                    href={`/umkm/${store.id}`}
                    className="group glass-card flex h-full flex-col overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={store.heroImage}
                        alt={store.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 95vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60" />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-primary-500/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                        {store.category}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-6 text-left">
                      <h2 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-1">
                        {store.name}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                        {store.tagline}
                      </p>
                      
                      <div className="mt-auto pt-6 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <MapPin size={12} className="text-primary-500" />
                          {store.location}
                        </div>
                        <div className="h-8 w-8 rounded-full glass-button flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all">
                          <span className="text-lg font-black">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
              <p className="text-base font-semibold text-slate-800 dark:text-slate-100">Hmm, belum ada hasil yang cocok.</p>
              <p className="mt-2 text-sm">
                Coba ubah kata kunci pencarian, pilih kategori atau lokasi lain, atau kirimkan UMKM rekomendasi Anda melalui formulir pengajuan.
              </p>
              <button
                type="button"
                onClick={openFormModal}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2 text-xs font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-indigo-900/50 dark:bg-slate-950 dark:text-indigo-200 dark:hover:bg-slate-900"
              >
                Ajukan UMKM sekarang
              </button>
            </div>
          )}
        </div>

        {processedStores.length > STORES_PER_PAGE ? (
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
              Daftarkan UMKM Anda Sekarang
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Estimasi peninjauan 3–5 hari kerja. Kami akan mengonfirmasi melalui email atau WhatsApp.
            </p>
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
                    Lengkapi informasi berikut agar tim kami dapat meninjau dan menampilkan UMKM Anda di Ruang Riung.
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

    </div>
  );
}
