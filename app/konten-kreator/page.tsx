'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  Facebook,
  Globe,
  Instagram,
  MessageCircle,
  Search,
  Sparkles,
  Twitter,
  Users,
  Youtube,
} from 'lucide-react';

type SocialLinks = {
  facebook?: string;
  youtube?: string;
  instagram?: string;
  threads?: string;
  x?: string;
  website?: string;
};

type Creator = {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  specialties: string[];
  socials: SocialLinks;
};

type SocialKey = keyof SocialLinks;

type SocialPlatform = {
  key: SocialKey;
  label: string;
  icon: LucideIcon;
};

const socialPlatforms: SocialPlatform[] = [
  { key: 'facebook', label: 'Facebook', icon: Facebook },
  { key: 'youtube', label: 'YouTube', icon: Youtube },
  { key: 'instagram', label: 'Instagram', icon: Instagram },
  { key: 'threads', label: 'Threads', icon: MessageCircle },
  { key: 'x', label: 'X (d/h Twitter)', icon: Twitter },
  { key: 'website', label: 'Website', icon: Globe },
];

const creators: Creator[] = [
  {
    name: 'Koko Ajeeb',
    role: 'Admin - Founder & CEO',
    description:
      'Visioner di balik RuangRiung yang memastikan generator AI kami ramah digunakan oleh semua anggota komunitas.',
    imageUrl: '/author/img/koko-ajeeb.jpg',
    specialties: ['Strategi Komunitas', 'Eksperimen AI', 'Konten Edukatif'],
    socials: {
      facebook: 'https://web.facebook.com/koko.ajeeb',
      website: 'https://www.ruangriung.my.id',
    },
  },
  {
    name: 'Xenopath',
    role: 'Admin',
    description:
      'Kurator visual yang rajin berbagi preset dan referensi gaya sehingga ide liar komunitas bisa diwujudkan jadi gambar.',
    imageUrl: '/author/img/xenopath.jpg',
    specialties: ['Kurasi Prompt', 'Eksperimen Visual', 'Mentor Komunitas'],
    socials: {
      facebook: 'https://web.facebook.com/xenopati',
    },
  },
  {
    name: 'Yogi Arfianto',
    role: 'Admin',
    description:
      'Menjaga percakapan komunitas tetap hangat sambil merangkum tips teknis agar tiap kreator cepat menemukan gaya uniknya.',
    imageUrl: '/author/img/yogi-profil.jpg',
    specialties: ['Moderasi Komunitas', 'Tutorial Cepat', 'Eksperimen Gaya'],
    socials: {
      facebook: 'https://web.facebook.com/yogee.krib',
    },
  },
  {
    name: 'Famii',
    role: 'Admin',
    description:
      'Storyteller yang senang memadukan narasi dan visual; karyanya sering jadi inspirasi kolaborasi lintas kreator.',
    imageUrl: '/author/img/famii.jpg',
    specialties: ['Storytelling', 'Kolaborasi', 'Eksperimen Karakter'],
    socials: {
      facebook: 'https://web.facebook.com/nengayu.hong',
    },
  },
  {
    name: 'Dery Lau',
    role: 'Admin',
    description:
      'Berbagi tips editing dan workflow sehingga anggota baru cepat percaya diri menyelesaikan proyek visual mereka.',
    imageUrl: '/author/img/dery-lau.jpg',
    specialties: ['Workflow Kreatif', 'Eksperimen Lighting', 'Pendampingan'],
    socials: {
      facebook: 'https://web.facebook.com/dery.megana',
    },
  },
  {
    name: 'Paijem Ardian Arip',
    role: 'Admin',
    description:
      'Selalu hadir memberi semangat serta menghidupkan sesi live sharing agar komunitas terasa dekat tanpa jarak.',
    imageUrl: '/author/img/paijem.jpg',
    specialties: ['Live Sharing', 'Engagement Komunitas', 'Curator Event'],
    socials: {
      facebook: 'https://web.facebook.com/ardian.arip.2025',
    },
  },
  {
    name: 'Mahidara Ratri',
    role: 'Admin',
    description:
      'Meracik panduan teknis bertahap yang membuat pembelajaran AI generator jadi lebih mudah diikuti oleh siapa saja.',
    imageUrl: '/author/img/mahidara.jpg',
    specialties: ['Panduan Teknis', 'Eksperimen Model', 'Pembelajaran'],
    socials: {
      facebook: 'https://web.facebook.com/ruth.andanasari',
    },
  },
  {
    name: 'Nadifa Family',
    role: 'Admin',
    description:
      'Mengkurasi highlight karya komunitas dan menghadirkannya kembali sebagai inspirasi segar di kanal sosial RuangRiung.',
    imageUrl: '/author/img/nadifa.jpg',
    specialties: ['Kurasi Konten', 'Media Sosial', 'Highlight Komunitas'],
    socials: {
      facebook: 'https://web.facebook.com/nadifa.familly',
    },
  },
  {
    name: 'Nurul Sholehah Eka',
    role: 'Admin',
    description:
      'Penulis tutorial yang telaten mendokumentasikan langkah demi langkah agar semua orang bisa mencoba hal baru setiap hari.',
    imageUrl: '/author/img/uul.jpg',
    specialties: ['Penulisan Tutorial', 'Eksperimen Harian', 'Dukungan Anggota'],
    socials: {
      facebook: 'https://web.facebook.com/uul.aja',
    },
  },
  {
    name: 'Arif Tirtana',
    role: 'Kontributor & Tukang Hore',
    description:
      'Sumber energi positif yang tak segan memberi apresiasi dan membantu kreator lain menemukan keunikan karyanya.',
    imageUrl: '/author/img/arif.jpg',
    specialties: ['Apresiasi Karya', 'Eksplorasi Ide', 'Kolaborasi'],
    socials: {
      facebook: 'https://web.facebook.com/ayicktigabelas',
    },
  },
  {
    name: 'Hus',
    role: 'Admin',
    description:
      'Mengulas fitur baru dan memberikan umpan balik cepat agar pengembangan alat RuangRiung tetap relevan untuk kreator.',
    imageUrl: '/author/img/hus.jpg',
    specialties: ['Umpan Balik Produk', 'Eksperimen Fitur', 'Review Cepat'],
    socials: {
      facebook: 'https://web.facebook.com/janseengan',
    },
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
    creator.specialties.join(' '),
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
            Kreator RuangRiung yang Menghidupkan Komunitas
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Kenali wajah di balik karya-karya inspiratif RuangRiung. Mereka adalah para admin dan kontributor yang rajin berbagi eksperimen, tips, dan semangat kolaborasi di berbagai kanal digital.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/konten-kreator/kirim-profil"
              className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <Sparkles className="h-4 w-4" />
              Ajukan Profil Anda
            </Link>
            <Link
              href="/tentang-kami"
              className="inline-flex items-center gap-2 rounded-full border border-purple-300 px-6 py-3 text-sm font-semibold text-purple-700 transition hover:border-purple-400 hover:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-purple-700 dark:text-purple-200 dark:hover:border-purple-500 dark:hover:text-purple-100"
            >
              Pelajari Tentang Kami
            </Link>
          </div>
        </div>

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
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {paginatedCreators.map((creator) => (
              <article
                key={creator.name}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-lg shadow-purple-100/50 transition-transform hover:-translate-y-1 hover:shadow-purple-200/80 dark:border-purple-900 dark:bg-gray-900/60 dark:shadow-black/40"
              >
                <div className="h-1 w-full bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 dark:from-purple-700 dark:via-fuchsia-700 dark:to-blue-700" />
                <div className="flex flex-col gap-6 p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-purple-100 bg-purple-50 shadow-inner dark:border-purple-900 dark:bg-purple-900/40">
                      <Image
                        src={creator.imageUrl}
                        alt={`Foto profil ${creator.name}`}
                        fill
                        sizes="96px"
                        className="object-cover"
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

                  {creator.socials.facebook && (
                    <a
                      href={creator.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex w-max items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition hover:from-purple-600 hover:to-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      <Users className="h-4 w-4" />
                      Lihat Profil Facebook
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {hasResults && totalPages > 1 && (
          <nav
            className="mt-12 flex flex-wrap items-center justify-center gap-2"
            aria-label="Navigasi halaman kreator"
          >
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
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
                  onClick={() => setCurrentPage(pageNumber)}
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
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center rounded-full border border-purple-200 px-4 py-2 text-sm font-medium text-purple-700 transition hover:border-purple-300 hover:text-purple-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-purple-800 dark:text-purple-200 dark:hover:border-purple-600"
            >
              Selanjutnya
            </button>
          </nav>
        )}

        <section className="mt-16">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-100 via-white to-blue-100 p-10 text-center shadow-xl dark:border-purple-900 dark:from-purple-950 dark:via-gray-950 dark:to-blue-950">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-purple-200 dark:bg-gray-900 dark:shadow-black/30">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Tampilkan Profil Anda</h2>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
              Ingin profil lengkap Anda hadir di halaman ini? Kirimkan informasi media sosial, karya unggulan, dan cerita singkat tentang perjalanan kreatif Anda.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/konten-kreator/kirim-profil"
                className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <Sparkles className="h-4 w-4" />
                Ajukan Profil Anda
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
