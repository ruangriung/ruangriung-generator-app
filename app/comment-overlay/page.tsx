import CommentOverlayClient from './CommentOverlayClient';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export const metadata: Metadata = {
  metadataBase: new URL('https://ruangriung.my.id'),
  title: 'Comment Overlay Generator - RuangRiung',
  description: 'Buat bubble komentar yang dapat ditempelkan pada video dengan foto, teks, tanggal, dan warna kustom.',
  keywords: ['comment overlay', 'bubble komentar', 'generator komentar', 'ruangriung'],
  alternates: {
    canonical: '/comment-overlay',
  },
  openGraph: {
    title: 'Comment Overlay Generator - RuangRiung',
    description: 'Buat bubble komentar yang dapat ditempelkan pada video dengan foto, teks, tanggal, dan warna kustom.',
    url: 'https://ruangriung.my.id/comment-overlay',
    siteName: 'RuangRiung AI Generator',
    images: [
      {
        url: 'https://www.ruangriung.my.id/assets/ruangriung.png',
        width: 1200,
        height: 630,
        alt: 'RuangRiung Comment Overlay',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comment Overlay Generator - RuangRiung',
    description: 'Buat bubble komentar yang dapat ditempelkan pada video dengan foto, teks, tanggal, dan warna kustom.',
    images: ['https://www.ruangriung.my.id/assets/ruangriung.png'],
  },
};

export default function CommentOverlayPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-4 flex justify-between items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors text-sm font-semibold"
          aria-label="Kembali ke Beranda"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Beranda</span>
        </Link>
        <ThemeToggle />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">Generator Bubble Komentar</h1>
      <CommentOverlayClient />
    </div>
  );
}
