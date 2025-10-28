'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  ChevronDown,
  Facebook,
  Globe,
  Search,
  Send,
  Sparkles,
  Users,
} from 'lucide-react';
import { creators, type Creator } from './creators';
import { socialPlatforms } from './social-platforms';
import GoogleAd from '@/components/GoogleAd';

type SubmissionBenefit = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const submissionBenefits: SubmissionBenefit[] = [
  {
    title: 'Personal branding tampil resmi',
    description:
      'Cerita, keunikan, dan nilai yang Anda bawa akan dikemas rapi di landing page RuangRiung sebagai kartu nama digital yang mudah dibagikan.',
    icon: Sparkles,
  },
  {
    title: 'Konten Facebook Pro mendapat sorotan',
    description:
      'Kami menyorot unggahan terbaik Anda agar audiens global memahami gaya dan konsistensi yang dibangun di komunitas.',
    icon: Facebook,
  },
  {
    title: 'Peluang kolaborasi terbuka',
    description:
      'Brand, komunitas, dan kreator lain dapat menilai kecocokan kerja sama hanya dari satu halaman profil komprehensif.',
    icon: Globe,
  },
];

const ITEMS_PER_PAGE = 6;

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
};

const highlightText = (text: string, tokens: string[]) => {
  if (!tokens.length) {
    return text;
  }

  const pattern = tokens.map(escapeRegExp).join('|');

  if (!pattern) {
    return text;
  }

  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const isMatch = tokens.some(
      (token) => token && part.toLowerCase() === token,
    );

    if (isMatch) {
      return (
        <mark
          key={`${part}-${index}`}
          className="rounded bg-yellow-200 px-1 py-0.5 text-gray-900 dark:bg-yellow-500/30 dark:text-yellow-100"
        >
          {part}
        </mark>
      );
    }

    return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
  });
};

const doesCreatorMatchTokens = (creator: Creator, tokens: string[]) => {
  if (!tokens.length) {
    return true;
  }

  const searchable = [
    creator.name,
    creator.role,
    creator.description,
    creator.bio,
    creator.location,
    creator.availability,
    creator.specialties.join(' '),
    creator.highlights.join(' '),
    creator.portfolio
      .map((item) => `${item.title} ${item.description}`)
      .join(' '),
    Object.values(creator.socials)
      .filter(Boolean)
      .join(' '),
  ]
    .join(' ')
    .toLowerCase();

  return tokens.every((token) => searchable.includes(token));
};

export default function KontenKreatorPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeBenefitIndex, setActiveBenefitIndex] = useState<number | null>(0);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const searchTokens = useMemo(() => {
    const tokens = searchQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return Array.from(new Set(tokens));
  }, [searchQuery]);

  const filteredCreators = useMemo(() => {
    if (!searchTokens.length) {
      return creators;
    }

    return creators.filter((creator) =>
      doesCreatorMatchTokens(creator, searchTokens),
    );
  }, [searchTokens]);

  const totalPages = Math.max(1, Math.ceil(filteredCreators.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedCreators = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCreators.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCreators, currentPage]);

  const totalCreators = creators.length;
  const filteredCount = filteredCreators.length;
  const hasResults = filteredCount > 0;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const rangeStart = hasResults ? startIndex + 1 : 0;
  const rangeEnd = hasResults
    ? Math.min(startIndex + ITEMS_PER_PAGE, filteredCount)
    : 0;

  const scrollToResults = () => {
    if (!resultsRef.current) {
      return;
    }

    resultsRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handlePreviousPage = () => {
    if (currentPage === 1) {
      return;
    }

    setCurrentPage(currentPage - 1);
    scrollToResults();
  };

  const handleNextPage = () => {
    if (currentPage === totalPages) {
      return;
    }

    setCurrentPage(currentPage + 1);
    scrollToResults();
  };

  const handleSelectPage = (pageNumber: number) => {
    if (pageNumber === currentPage) {
      return;
    }

    setCurrentPage(pageNumber);
    scrollToResults();
  };

  const toggleBenefit = (index: number) => {
    setActiveBenefitIndex((previous) => (previous === index ? null : index));
  };

  return (
    <main className="min-h-screen bg-gray-50 py-16 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-5 py-2 text-sm font-semibold text-purple-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-purple-50 dark:border-purple-800 dark:bg-gray-900 dark:text-purple-200 dark:hover:bg-purple-900/60"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-700 shadow-sm dark:bg-purple-900/40 dark:text-purple-200">
            <Sparkles className="h-4 w-4" />
            Direktori Konten Kreator
          </span>
          <h1 className="mt-6 text-4xl font-bold text-gray-900 dark:text-gray-100">
            Bersama Kreator, Untuk Kreator, Oleh Kreator.
          </h1>
          <div className="my-6 flex justify-center">
            <GoogleAd className="w-full max-w-4xl" />
          </div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Halaman ini dirancang untuk memperkenalkan dan memperkuat personal branding para Konten kreator di seluruh dunia sekaligus menonjolkan konten Facebook pro Anda semakin dikenal dunia. Jelajahi direktori ini untuk bertemu rekan seperjalanan yang siap berkolaborasi, membuka peluang baru, dan saling mengangkat karya terbaik.
          </p>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Submit profil membantu tim menampilkan cerita, nilai, dan karya Anda secara terkurasi sehingga komunitas maupun brand dapat memahami keahlian Anda dalam sekejap.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/konten-kreator/kirim-profil"
              className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <Sparkles className="h-4 w-4" />
              Submit Profil Anda
            </Link>
            <Link
              href="/tentang-kami"
              className="inline-flex items-center gap-2 rounded-full border border-purple-300 px-6 py-3 text-sm font-semibold text-purple-700 transition hover:border-purple-400 hover:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-purple-700 dark:text-purple-200 dark:hover:border-purple-500 dark:hover:text-purple-100"
            >
              Pelajari Tentang Kami
            </Link>
          </div>
        </div>

        <section className="mt-12">
          <div className="mx-auto max-w-4xl rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8 text-left shadow-xl dark:border-purple-900 dark:from-purple-950 dark:via-gray-950 dark:to-blue-950">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Mengapa harus Submit Profil Anda dan apa keuntungannya?
            </h2>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
              Submission ke halaman ini membuka akses eksposur dan peluang baru bagi personal brand Anda.
            </p>
            <div className="mt-6 space-y-3">
              {submissionBenefits.map((benefit, index) => {
                const isOpen = activeBenefitIndex === index;
                const buttonId = `benefit-trigger-${index}`;
                const panelId = `benefit-panel-${index}`;

                return (
                  <div
                    key={benefit.title}
                    className="overflow-hidden rounded-2xl border border-purple-200/70 bg-white/80 shadow-sm transition dark:border-purple-800 dark:bg-gray-900/60"
                  >
                    <button
                      type="button"
                      id={buttonId}
                      aria-controls={panelId}
                      aria-expanded={isOpen}
                      onClick={() => toggleBenefit(index)}
                      className="flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-purple-50/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-100 dark:hover:bg-purple-900/30 dark:focus-visible:ring-offset-gray-950"
                    >
                      <benefit.icon className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                      <span className="flex-1 text-base font-semibold text-gray-900 dark:text-gray-100">
                        {benefit.title}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-purple-500 transition-transform duration-200 dark:text-purple-300 ${isOpen ? '-rotate-180' : ''}`}
                      />
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      aria-hidden={!isOpen}
                      className={`px-6 pb-6 text-sm text-gray-600 transition-all duration-200 ease-out dark:text-gray-300 ${isOpen ? 'block' : 'hidden'}`}
                    >
                      {benefit.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-400 dark:text-purple-500" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari kreator, peran, atau keahlian..."
                aria-label="Cari kreator"
                className="w-full rounded-full border border-purple-200 bg-white/90 px-12 py-3 text-sm font-medium text-gray-900 shadow-sm transition hover:border-purple-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-purple-800 dark:bg-gray-900/80 dark:text-gray-100"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium text-purple-700 dark:text-purple-300">
                Total {totalCreators} profil kreator
              </span>
              <span>
                {hasResults
                  ? `Menampilkan ${rangeStart}-${rangeEnd} dari ${filteredCount} profil yang cocok`
                  : 'Tidak ada profil yang cocok dengan pencarian Anda'}
              </span>
              {searchTokens.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-2 rounded-full border border-purple-200 px-4 py-2 text-xs font-semibold text-purple-700 transition hover:border-purple-300 hover:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-purple-800 dark:text-purple-200 dark:hover:border-purple-600"
                >
                  Bersihkan pencarian
                </button>
              )}
            </div>
          </div>

          {!hasResults && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-purple-200 bg-white/70 px-6 py-12 text-center shadow-inner dark:border-purple-900 dark:bg-gray-900/60">
              <Search className="h-8 w-8 text-purple-500 dark:text-purple-300" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Coba gunakan kata kunci lain atau telusuri profil kreator kami dari halaman Tentang Kami.
              </p>
            </div>
          )}
        </section>

        {hasResults && (
          <div ref={resultsRef} className="mt-8 space-y-12 scroll-mt-24">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {paginatedCreators.map((creator) => (
                <article
                  key={creator.slug}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-lg shadow-purple-100/50 transition-transform hover:-translate-y-1 hover:shadow-purple-200/80 dark:border-purple-900 dark:bg-gray-900/60 dark:shadow-black/40"
                >
                  <div className="h-1 w-full bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 dark:from-purple-700 dark:via-fuchsia-700 dark:to-blue-700" />
                  <div className="flex flex-col gap-6 p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-purple-100 bg-purple-50 shadow-inner dark:border-purple-900 dark:bg-purple-900/40">
                        <Image
                          src={creator.imageUrl}
                          alt={`Foto profil ${creator.name}`}
                          fill
                          sizes="96px"
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                          {highlightText(creator.name, searchTokens)}
                        </h2>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-300">
                          {highlightText(creator.role, searchTokens)}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                          {highlightText(creator.description, searchTokens)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {creator.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/60 dark:text-purple-200"
                        >
                          {highlightText(specialty, searchTokens)}
                        </span>
                      ))}
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Jejak Digital
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {socialPlatforms.map((platform) => {
                          const url = creator.socials[platform.key];
                          const Icon = platform.icon;

                          if (url) {
                            return (
                              <a
                                key={platform.key}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 transition hover:border-purple-300 hover:bg-purple-100 hover:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-purple-800 dark:bg-purple-900/40 dark:text-purple-200 dark:hover:border-purple-700 dark:hover:bg-purple-900/60 dark:hover:text-purple-100"
                              >
                                <Icon className="h-4 w-4" />
                                {platform.label}
                              </a>
                            );
                          }

                          return (
                            <span
                              key={platform.key}
                              aria-disabled="true"
                              className="inline-flex items-center gap-2 rounded-full border border-dashed border-gray-300 bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-400 dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-500"
                            >
                              <Icon className="h-4 w-4" />
                              {platform.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <Link
                        href={`/konten-kreator/profil/${creator.slug}`}
                        className="inline-flex w-max items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        Lihat Profil Lengkap
                      </Link>
                      {creator.socials.facebook && (
                        <a
                          href={creator.socials.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-max items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition hover:from-purple-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        >
                          <Users className="h-4 w-4" />
                          Lihat Profil Facebook
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                className="flex flex-wrap items-center justify-center gap-2"
                aria-label="Navigasi halaman kreator"
              >
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="inline-flex items-center rounded-full border border-purple-200 px-4 py-2 text-sm font-medium text-purple-700 transition hover:border-purple-300 hover:text-purple-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-purple-800 dark:text-purple-200 dark:hover:border-purple-600"
                >
                  Sebelumnya
                </button>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  const isActive = pageNumber === currentPage;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => handleSelectPage(pageNumber)}
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                        isActive
                          ? 'border-purple-500 bg-purple-600 text-white shadow-lg shadow-purple-500/30 dark:border-purple-500 dark:bg-purple-600 dark:text-white'
                          : 'border-purple-200 bg-white text-purple-700 hover:border-purple-300 hover:text-purple-800 dark:border-purple-800 dark:bg-gray-900 dark:text-purple-200 dark:hover:border-purple-600'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center rounded-full border border-purple-200 px-4 py-2 text-sm font-medium text-purple-700 transition hover:border-purple-300 hover:text-purple-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-purple-800 dark:text-purple-200 dark:hover:border-purple-600"
                >
                  Selanjutnya
                </button>
              </nav>
            )}
          </div>
        )}

        <section className="mt-16">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-100 via-white to-blue-100 p-10 text-center shadow-xl dark:border-purple-900 dark:from-purple-950 dark:via-gray-950 dark:to-blue-950">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-purple-200 dark:bg-gray-900 dark:shadow-black/30">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Tampilkan Profil Anda</h2>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
              Siap membuat personal branding Anda lebih mudah diingat? Kirimkan informasi media sosial, karya unggulan, serta pesan inti brand agar kami dapat menampilkan profil yang solid dan profesional.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/konten-kreator/kirim-profil"
                className="group inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <Send
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-1"
                  aria-hidden
                />
                Submit Profil Anda
              </Link>
              <Link
                href="/tentang-kami"
                className="inline-flex items-center gap-2 rounded-full border border-purple-300 px-6 py-3 text-sm font-semibold text-purple-700 transition hover:border-purple-400 hover:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-purple-700 dark:text-purple-200 dark:hover:border-purple-500 dark:hover:text-purple-100"
              >
                Pelajari Tentang Kami
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
