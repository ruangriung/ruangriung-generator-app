
import { getAllArticles } from '@/lib/articles';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ArticleListPage() {
  const articles = getAllArticles();

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
      <h1 className="text-4xl font-bold mb-8 text-center">Artikel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <Link key={article.slug} href={`/artikel/${article.slug}`}>
            <div className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{article.title}</h5>
              <p className="font-normal text-gray-500 dark:text-gray-400 text-sm mb-2">Oleh: {article.author} - {new Date(article.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="font-normal text-gray-700 dark:text-gray-400">{article.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
