import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FacebookIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

const FacebookProAnalyzerClient = dynamic(() => import('./FacebookProAnalyzerClient'), {
  ssr: false,
  loading: () => (
    <div className="mt-10 rounded-2xl bg-light-bg p-6 shadow-neumorphic-card dark:bg-dark-bg dark:shadow-dark-neumorphic-card">
      <p className="text-center text-lg font-semibold text-gray-700 dark:text-gray-200">
        Menyiapkan kanvas analitik InsightRanker...
      </p>
    </div>
  ),
});

export const metadata: Metadata = {
  title: 'InsightRanker untuk Facebook Pro - Analitik Kualitas Konten',
  description:
    'Gunakan InsightRanker untuk menilai kreativitas, relevansi, dan daya tarik emosional konten profesional Facebook Anda dengan API Pollinations.ai.',
  keywords: [
    'InsightRanker',
    'analisis konten Facebook',
    'Pollinations AI',
    'evaluasi konten profesional',
    'engagement predictor',
  ],
  openGraph: {
    title: 'InsightRanker — Mesin Pengendus Kualitas Konten Facebook Pro',
    description:
      'Dashboard analitik futuristik untuk membaca kreativitas, relevansi, dan daya tarik emosional konten Facebook profesional.',
    url: 'https://ruangriung.my.id/facebook-pro-insight',
    siteName: 'RuangRiung AI Generator',
    images: [
      {
        url: 'https://www.ruangriung.my.id/assets/ruangriung.png',
        width: 1200,
        height: 630,
        alt: 'InsightRanker Dashboard',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InsightRanker — Mesin Pengendus Kualitas Konten',
    description:
      'Analisis mendalam konten Facebook profesional dengan dukungan model Pollinations.ai yang dinamis.',
    images: ['https://www.ruangriung.my.id/assets/ruangriung.png'],
  },
};

export default function FacebookProInsightPage() {
  return (
    <div className="container mx-auto px-4 py-10 md:px-8 lg:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-light-bg px-4 py-2 text-sm font-semibold text-gray-700 shadow-neumorphic-button transition-colors hover:text-purple-600 dark:bg-dark-bg dark:text-gray-200 dark:shadow-dark-neumorphic-button"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-400/10 dark:text-blue-200">
          <FacebookIcon className="h-4 w-4" />
          Mode Profesional Facebook
        </div>
      </div>

      <header className="mt-10 space-y-4 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-purple-500">InsightRanker</p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 md:text-5xl">
          Mesin Pengendus Kualitas Konten Facebook Pro
        </h1>
        <p className="mx-auto max-w-3xl text-base text-gray-600 dark:text-gray-300 md:text-lg">
          Analisis menyeluruh terhadap kreativitas, relevansi, daya tarik emosional, dan keaslian konten profesional Facebook.
          InsightRanker memanfaatkan API <span className="font-semibold text-purple-600 dark:text-purple-400">text.pollinations.ai</span>
          untuk mengaktifkan analitik heuristik visual, pemahaman semantik, dan prediksi engagement secara real-time.
        </p>
      </header>

      <FacebookProAnalyzerClient />
    </div>
  );
}
