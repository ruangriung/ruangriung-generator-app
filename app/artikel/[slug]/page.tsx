import { Suspense } from 'react';
import { type Article, getArticleBySlug, getArticleSlugs, getRelatedArticles } from '@/lib/articles';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleSubmissionTrigger from '@/components/ArticleSubmissionTrigger';
import ArticleSearchForm from '@/components/ArticleSearchForm';
import GoogleAd from '@/components/GoogleAd';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article: Article | undefined = getArticleBySlug(params.slug);
  if (!article) {
    return {};
  }
  const fullUrl = `https://ruangriung.my.id/artikel/${article.slug}`;
  return {
    title: `${article.title} - RuangRiung`,
    description: article.summary,
    keywords: article.title.split(' ').join(', '),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      url: fullUrl,
      type: 'article',
      publishedTime: new Date(article.date).toISOString(),
      authors: [article.author],
      images: [
        {
          url: 'https://ruangriung.my.id/assets/ruangriung.png',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: ['https://ruangriung.my.id/assets/ruangriung.png'],
    },
  };
}

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article: Article | undefined = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  // === PERBAIKAN DI SINI ===
  // Variabel relatedArticles didefinisikan di dalam komponen
  const relatedArticles = getRelatedArticles(params.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    image: 'https://ruangriung.my.id/assets/ruangriung.png',
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'RuangRiung',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ruangriung.my.id/assets/ruangriung.png',
      },
    },
    datePublished: new Date(article.date).toISOString(),
    dateModified: new Date(article.date).toISOString(),
    description: article.summary,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ruangriung.my.id/artikel/${article.slug}`,
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/artikel" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2" size={20} />
          Kembali ke Artikel
        </Link>
        <ArticleSubmissionTrigger className="w-full sm:w-auto" />
      </div>
      <div className="mb-8 flex justify-center">
        <Suspense
          fallback={
            <div className="h-12 w-full max-w-3xl animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          }
        >
          <ArticleSearchForm
            targetPath="/artikel"
            placeholder="Cari artikel lain di RuangRiung..."
            className="w-full max-w-3xl"
          />
        </Suspense>
      </div>
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
        {article.title}
      </h1>
      <div className="my-6 flex justify-center">
        <GoogleAd className="w-full max-w-3xl" />
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-2">
        Oleh {article.author} pada {new Date(article.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <div className="flex justify-center items-center flex-wrap gap-4 mb-6">
        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 rounded-full px-3 py-1">{article.category}</span>
        <div className="flex flex-wrap justify-center gap-2">
            {article.tags.map(tag => (
                <span key={tag} className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1">
                    #{tag}
                </span>
            ))}
        </div>
      </div>
      <p className="text-lg text-center text-gray-700 dark:text-gray-300 border-l-4 border-gray-500 pl-4 mb-8 italic">
        {article.summary}
      </p>
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="mb-6 w-full h-64 object-cover rounded-lg"
          loading="lazy"
          width={1200}
          height={630}
          style={{ maxWidth: '100%', height: 'auto' }}
          decoding="async"
          fetchPriority="high"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      )}
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
        >
          {article.content}
        </ReactMarkdown>
      </div>

      {relatedArticles.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
            Artikel Terkait
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedArticles.map(relatedArticle => (
              <Link key={relatedArticle.slug} href={`/artikel/${relatedArticle.slug}`} className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{relatedArticle.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{relatedArticle.summary}</p>
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Baca Selengkapnya &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}