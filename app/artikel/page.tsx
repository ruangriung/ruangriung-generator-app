
import { getAllArticles } from '@/lib/articles';
import { ARTICLE_BOTTOM_AD_SLOT, ARTICLE_LIST_AD_SLOT } from '@/lib/adsense';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ArticlePaginationClient from './ArticlePaginationClient';

export default function ArticleListPage() {
  const articles = getAllArticles();
  const adSlotIds = [ARTICLE_LIST_AD_SLOT, ARTICLE_BOTTOM_AD_SLOT].filter(
    (slot): slot is string => Boolean(slot),
  );

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
      <ArticlePaginationClient initialArticles={articles} adSlotIds={adSlotIds} />
    </div>
  );
}
