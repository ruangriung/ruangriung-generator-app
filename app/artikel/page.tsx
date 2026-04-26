import { Suspense } from 'react';
import { getAllArticles } from '@/lib/articles';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ArticlePaginationClient from './ArticlePaginationClient';
import ArticleSubmissionTrigger from '@/components/ArticleSubmissionTrigger';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Artikel & Panduan AI | RuangRiung',
  description: 'Temukan artikel terbaru, tips, dan panduan mendalam tentang penggunaan teknologi AI untuk meningkatkan produktivitas dan kreativitas Anda.',
  alternates: {
    canonical: 'https://ruangriung.my.id/artikel',
  },
};


export default function ArticleListPage() {
  const articles = getAllArticles();

  const breadcrumbSchema = {
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: 'https://ruangriung.my.id',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Artikel',
        item: 'https://ruangriung.my.id/artikel',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 pt-20 selection:bg-primary-500/30">
      <div className="container mx-auto px-4">
        <JsonLd type="BreadcrumbList" data={breadcrumbSchema} />
        
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
          <ArticleSubmissionTrigger className="w-full sm:w-auto" />
        </div>

        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full -z-10" />
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 mb-6">
            Inspirasi & Wawasan
          </span>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl leading-tight">
            Artikel <span className="text-primary-500">Terbaru</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
            Jelajahi panduan mendalam, tips produktivitas, dan berita terbaru seputar dunia AI.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card h-[400px] animate-pulse" />
              ))}
            </div>
          }
        >
          <ArticlePaginationClient initialArticles={articles} />
        </Suspense>
      </div>
    </div>
  );
}
