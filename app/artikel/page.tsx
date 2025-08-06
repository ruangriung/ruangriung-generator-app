import { getAllArticles } from '@/lib/articles';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ArticlePaginationClient from './ArticlePaginationClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artikel - RuangRiung',
  description: 'Kumpulan artikel, tips, dan tutorial seputar teknologi AI generatif, seni digital, dan pengembangan kreativitas.',
  alternates: {
    canonical: 'https://ruangriung.my.id/artikel',
  },
  openGraph: {
    title: 'Artikel - RuangRiung',
    description: 'Kumpulan artikel, tips, dan tutorial seputar teknologi AI generatif, seni digital, dan pengembangan kreativitas.',
    url: 'https://ruangriung.my.id/artikel',
    type: 'website',
    images: [
      {
        url: 'https://ruangriung.my.id/assets/ruangriung.png',
        width: 1200,
        height: 630,
        alt: 'Artikel RuangRiung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artikel - RuangRiung',
    description: 'Kumpulan artikel, tips, dan tutorial seputar teknologi AI generatif, seni digital, dan pengembangan kreativitas.',
    images: ['https://ruangriung.my.id/assets/ruangriung.png'],
  },
};

export default function DaftarArtikelPage() {
    const allArticles = getAllArticles();
    const AD_SLOT_ID_ARTIKEL = "6897039624";

    return (
        <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-light-bg dark:bg-dark-bg p-6 md:p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Artikel Terbaru</h1>

                    <div className="mb-8 flex justify-center">
                        <Link href="/" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all">
                            <ArrowLeft size={18} />
                            <span>Kembali ke Beranda</span>
                        </Link>
                    </div>

                    <ArticlePaginationClient initialArticles={allArticles} adSlotId={AD_SLOT_ID_ARTIKEL} />
                </div>
            </div>
        </main>
    );
}