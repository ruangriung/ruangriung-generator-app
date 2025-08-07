import { getArticleBySlug, getArticleSlugs } from '@/lib/articles';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AdBanner from '@/components/AdBanner';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

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

export default async function ArticlePage({ params }: PageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

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
        url: 'https://ruangriung.my.id/logo.png',
      },
    },
    datePublished: new Date(article.date).toISOString(),
    description: article.summary,
  };

  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto bg-light-bg dark:bg-dark-bg p-6 md:p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
        <div className="mb-8 flex justify-center">
          <Link
            href="/artikel"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
          >
            <ArrowLeft size={18} />
            <span>Kembali ke Artikel</span>
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
          {article.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
          Oleh {article.author} - {new Date(article.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          {(() => {
            const paragraphs = article.content.split(/\n\n/);
            const contentBeforeAd = paragraphs.slice(0, 3).join('\n\n');
            const contentAfterAd = paragraphs.slice(3).join('\n\n');

            return (
              <>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {contentBeforeAd}
                </ReactMarkdown>
                {paragraphs.length > 3 && <AdBanner dataAdSlot="5961316189" />}
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {contentAfterAd}
                </ReactMarkdown>
              </>
            );
          })()}
        </div>

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