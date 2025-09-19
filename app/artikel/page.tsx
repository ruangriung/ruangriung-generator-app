
import { getAllArticles } from '@/lib/articles';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ArticlePaginationClient from './ArticlePaginationClient';

const DEFAULT_AD_SLOT_ID = '7992484013';

export default function ArticleListPage() {
  const articles = getAllArticles();
  const adSlotId =
    process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT_ID_3 || DEFAULT_AD_SLOT_ID;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
        >
          <ArrowLeft size={18} />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">Artikel</h1>
      <ArticlePaginationClient initialArticles={articles} adSlotId={adSlotId} />
    </div>
  );
}
