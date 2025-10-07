import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PromptSubmissionPageClient from './PromptSubmissionPageClient';

const PAGE_URL = 'https://ruangriung.my.id/kumpulan-prompt/kirim';
const SOCIAL_IMAGE_URL = 'https://ruangriung.my.id/og-image/og-image-rr.png';

export const metadata: Metadata = {
  title: 'Kirim Prompt AI Kreatif Anda - RuangRiung Generator',
  description:
    'Bagikan prompt AI terbaik Anda untuk Midjourney, Stable Diffusion, ChatGPT, dan generator kreatif lainnya. Kirim prompt dan bantu komunitas RuangRiung menemukan inspirasi baru.',
  keywords: [
    'kirim prompt AI',
    'submit prompt Midjourney',
    'unggah prompt Stable Diffusion',
    'bagikan prompt ChatGPT',
    'komunitas prompt kreatif',
    'ruangriung prompt submission',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Kirim Prompt AI Kreatif Anda - RuangRiung Generator',
    description:
      'Isi formulir untuk mengirim prompt AI Anda dan bantu komunitas RuangRiung mendapatkan inspirasi baru untuk berbagai model AI.',
    url: PAGE_URL,
    siteName: 'RuangRiung AI Generator',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: SOCIAL_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'Formulir pengiriman prompt AI RuangRiung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kirim Prompt AI Kreatif Anda - RuangRiung Generator',
    description:
      'Kirim prompt AI terbaik Anda ke RuangRiung dan bantu pengguna lain menemukan ide kreatif baru.',
    images: [SOCIAL_IMAGE_URL],
  },
};

export default function PromptSubmissionPage() {
  return (
    <div className="bg-gradient-to-b from-sky-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="mx-auto max-w-3xl px-4 pt-12 pb-10 sm:px-6 lg:px-8">
        <Link
          href="/kumpulan-prompt"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Kumpulan Prompt
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-50 sm:text-4xl">
          Bagikan Prompt Kreatif Anda
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Isi formulir di bawah ini untuk mengirim prompt AI terbaik Anda. Prompt yang berhasil dikirim akan
          otomatis muncul di halaman kumpulan prompt dengan format front matter yang sama seperti prompt lainnya.
        </p>
      </div>
      <PromptSubmissionPageClient />
    </div>
  );
}
