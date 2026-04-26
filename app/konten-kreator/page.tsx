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
// import GoogleAd from '@/components/GoogleAd'; // DISABLED - Google Ads disabled temporarily


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
    <main className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-slate-50 dark:bg-[#030712] -z-20" />
      <div className="fixed inset-0 bg-mesh-gradient opacity-40 dark:opacity-20 -z-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-10 flex justify-center">
            <Link
              href="/"
              className="glass-button px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-slate-600 dark:text-slate-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </div>

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary-500/10 text-primary-500 border border-primary-500/20 mb-8">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Direktori Konten Kreator</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-8">
            Bersama Kreator,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-fuchsia-500">Untuk Masa Depan.</span>
          </h1>

          <div className="glass-card p-8 mb-12 text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
             <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Halaman ini dirancang untuk memperkenalkan dan memperkuat personal branding para Konten kreator di seluruh dunia sekaligus menonjolkan konten Facebook pro Anda semakin dikenal dunia. Jelajahi direktori ini untuk bertemu rekan seperjalanan yang siap berkolaborasi, membuka peluang baru, dan saling mengangkat karya terbaik.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/konten-kreator/kirim-profil"
              className="w-full sm:w-auto h-16 px-10 rounded-2xl bg-primary-500 text-white text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary-500/25"
            >
              <Sparkles className="h-4 w-4" />
              Submit Profil Anda
            </Link>
            <Link
              href="/tentang-kami"
              className="w-full sm:w-auto h-16 px-10 rounded-2xl glass-button text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Pelajari Tentang Kami
            </Link>
          </div>
        </div>

        <section className="mt-24 max-w-5xl mx-auto">
          <div className="glass-card p-10 sm:p-14 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full -ml-32 -mb-32" />
            
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight uppercase">
                Mengapa harus <span className="text-primary-500">Submit Profil</span> Anda?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold mb-10 leading-relaxed">
                Submission ke halaman ini membuka akses eksposur dan peluang baru bagi personal brand Anda.
              </p>
            </div>

            <div className="grid gap-4">
              {submissionBenefits.map((benefit, index) => {
                const isOpen = activeBenefitIndex === index;
                return (
                  <div
                    key={benefit.title}
                    className={`glass-card overflow-hidden transition-all duration-500 ${isOpen ? 'ring-1 ring-primary-500/30' : ''}`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleBenefit(index)}
                      className="flex w-full items-center gap-6 px-8 py-6 text-left transition-colors hover:bg-white/5"
                    >
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${isOpen ? 'bg-primary-500 text-white' : 'bg-slate-500/10 text-slate-500'}`}>
                        <benefit.icon size={24} />
                      </div>
                      <span className="flex-1 text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                        {benefit.title}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? '-rotate-180 text-primary-500' : ''}`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="px-8 pb-8 pl-[88px] text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                        {benefit.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-24 space-y-8" id="directory">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between bg-slate-950/5 dark:bg-black/20 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-500 h-5 w-5" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari talenta kreatif..."
                className="w-full h-14 glass-inset pl-16 pr-6 rounded-2xl text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 px-4 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="px-4 py-2 rounded-xl bg-primary-500/10 text-primary-500 border border-primary-500/10">
                {totalCreators} Kreator Terdaftar
              </span>
              <span className="text-slate-400">
                {hasResults
                  ? `Menampilkan ${rangeStart}-${rangeEnd} dari ${filteredCount}`
                  : 'Tidak ada hasil'}
              </span>
              {searchTokens.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-red-500 hover:underline transition-all"
                >
                  Bersihkan
                </button>
              )}
            </div>
          </div>

          {!hasResults && (
            <div className="glass-card p-20 text-center border-dashed border-2 border-white/5">
              <div className="h-16 w-16 rounded-full bg-slate-500/5 flex items-center justify-center text-slate-400 mx-auto mb-6">
                <Search size={32} />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Kreator tidak ditemukan. Coba kata kunci lain.
              </p>
            </div>
          )}
        </section>

        {hasResults && (
          <div ref={resultsRef} className="mt-12 space-y-16 scroll-mt-32">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {paginatedCreators.map((creator) => (
                <article
                  key={creator.slug}
                  className="glass-card group flex flex-col h-full overflow-hidden transition-all duration-500 hover:scale-[1.01] hover:ring-1 hover:ring-primary-500/30"
                >
                  <div className="h-1.5 w-full bg-gradient-to-r from-primary-500 via-fuchsia-500 to-blue-500 opacity-30 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="p-8 sm:p-10 flex flex-col h-full">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8 text-center sm:text-left">
                      <div className="relative h-28 w-28 shrink-0">
                        <div className="absolute inset-0 bg-primary-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                        <div className="relative h-full w-full rounded-full border-4 border-white/20 overflow-hidden bg-slate-900 shadow-2xl">
                          <Image
                            src={creator.imageUrl}
                            alt={creator.name}
                            fill
                            sizes="112px"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2 group-hover:text-white transition-colors">
                          {highlightText(creator.name, searchTokens)}
                        </h2>
                        <div className="inline-block px-3 py-1 rounded-lg bg-primary-500/10 text-primary-500 text-[10px] font-black uppercase tracking-[0.15em] mb-4">
                          {highlightText(creator.role, searchTokens)}
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                          {highlightText(creator.description, searchTokens)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {creator.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1.5 rounded-xl bg-slate-500/5 border border-white/5 text-[9px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 group-hover:border-primary-500/20 group-hover:bg-primary-500/5 transition-all"
                        >
                          {highlightText(specialty, searchTokens)}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
                      <div className="flex flex-wrap items-center gap-3">
                        {socialPlatforms.map((platform) => {
                          const url = creator.socials[platform.key];
                          const Icon = platform.icon;
                          if (!url) return null;
                          return (
                            <a
                              key={platform.key}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-10 w-10 flex items-center justify-center glass-button rounded-xl text-slate-400 transition-all"
                              title={platform.label}
                            >
                              <Icon size={18} />
                            </a>
                          );
                        })}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          href={`/konten-kreator/profil/${creator.slug}`}
                          className="flex-1 h-12 rounded-xl bg-primary-500 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-all"
                        >
                          <Sparkles size={14} /> Profil Lengkap
                        </Link>
                        {creator.socials.facebook && (
                          <a
                            href={creator.socials.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 h-12 rounded-xl glass-button text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                          >
                            <Facebook size={14} /> Facebook Pro
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-3 pt-10">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="h-12 px-6 glass-button rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                >
                  Prev
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    const isActive = pageNumber === currentPage;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handleSelectPage(pageNumber)}
                        className={`h-12 w-12 rounded-xl text-[10px] font-black transition-all ${
                          isActive
                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                            : 'glass-button text-slate-400 hover:text-white'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="h-12 px-6 glass-button rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30"
                >
                  Next
                </button>
              </nav>
            )}
          </div>
        )}

        <section className="mt-32">
          <div className="glass-card p-12 sm:p-20 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-fuchsia-500/10 opacity-50" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-500/20 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="h-16 w-16 rounded-3xl bg-primary-500 text-white flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary-500/25">
                <Users size={32} />
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight uppercase">
                Tampilkan Profil Anda
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium mb-12 leading-relaxed">
                Siap membuat personal branding Anda lebih mudah diingat? Kirimkan informasi media sosial, karya unggulan, serta pesan inti brand agar kami dapat menampilkan profil yang solid dan profesional.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  href="/konten-kreator/kirim-profil"
                  className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-primary-500 text-white text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-primary-500/25 hover:scale-105 active:scale-95 transition-all"
                >
                  <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  Mulai Submission
                </Link>
                <Link
                  href="/tentang-kami"
                  className="w-full sm:w-auto h-16 px-12 rounded-2xl glass-button text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all"
                >
                  Pelajari Tentang Kami
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
