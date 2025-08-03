import { getArticleBySlug, getArticleSlugs } from '@/lib/articles';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>; // Mengharapkan 'params' adalah sebuah Promise
}

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: PageProps) {
  const resolvedParams = await params;
  const article = await getArticleBySlug(resolvedParams.slug);

  if (!article) {
    // Handle 404 or redirect (optional: bisa diarahkan ke halaman 404 custom)
    return (
      <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center text-gray-700 dark:text-gray-300">
          <h1 className="text-3xl font-bold mb-4">Artikel tidak ditemukan.</h1>
          <Link href="/artikel" className="inline-flex items-center justify-center gap-2 py-2 px-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors">
            <ArrowLeft size={18} /> Kembali ke Daftar Artikel
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-light-bg dark:bg-dark-bg p-6 md:p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
        {/* Tombol Kembali ke Daftar Artikel */}
        <div className="mb-8 flex justify-center">
          <Link
            href="/artikel" // Link kembali ke daftar artikel
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
          >
            <ArrowLeft size={18} />
            <span>Kembali ke Artikel</span>
          </Link>
        </div>

        {/* Header Artikel */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
          {article.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
          Oleh {article.author} - {new Date(article.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* Konten Artikel dengan styling prose */}
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Tombol Kembali ke Daftar Artikel di bagian bawah (opsional, bisa dihapus jika tidak mau dobel) */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/artikel"
            className="inline-flex items-center justify-center gap-2 py-2 px-4 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
          >
            <ArrowLeft size={18} />
            <span>Kembali ke Artikel</span>
          </Link>
        </div>
      </div>
    </main>
  );
}