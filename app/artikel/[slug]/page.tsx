import { Suspense } from 'react';
import { type Article, getArticleBySlug, getArticleSlugs, getRelatedArticles } from '@/lib/articles';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import ArticleSubmissionTrigger from '@/components/ArticleSubmissionTrigger';
import ArticleSearchForm from '@/components/ArticleSearchForm';
import GoogleAd from '@/components/GoogleAd';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article: Article | undefined = getArticleBySlug(slug);
  if (!article) {
    return {};
  }
  const fullUrl = `https://ruangriung.my.id/artikel/${article.slug}`;
  return {
    title: `${article.title} - RuangRiung`,
    description: article.summary,
    keywords: `${article.title.split(' ').join(', ')}, ${article.tags.join(', ')}`,
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
          url: article.image || 'https://ruangriung.my.id/assets/ruangriung.png',
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
      images: [article.image || 'https://ruangriung.my.id/assets/ruangriung.png'],
    },
  };
}

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article: Article | undefined = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Variabel relatedArticles didefinisikan di dalam komponen
  const relatedArticles = getRelatedArticles(slug);

  const articleSchema = {
    headline: article.title,
    image: article.image || 'https://ruangriung.my.id/assets/ruangriung.png',
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'RuangRiung',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ruangriung.my.id/logo.webp',
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
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `https://ruangriung.my.id/artikel/${article.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-slate-50 dark:bg-[#030712] -z-20" />
      <div className="fixed inset-0 bg-mesh-gradient opacity-40 dark:opacity-20 -z-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <JsonLd type="Article" data={articleSchema} />
        <JsonLd type="BreadcrumbList" data={breadcrumbSchema} />
        
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Top Actions */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link 
              href="/artikel" 
              className="glass-button px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-slate-600 dark:text-slate-400 w-max"
            >
              <ArrowLeft size={16} />
              Kembali ke Artikel
            </Link>
            <ArticleSubmissionTrigger className="w-full sm:w-auto" />
          </div>

          {/* Search Header */}
          <div className="glass-card !p-6">
            <Suspense
              fallback={
                <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
              }
            >
              <ArticleSearchForm
                targetPath="/artikel"
                placeholder="Cari wawasan lain di RuangRiung..."
                className="w-full"
              />
            </Suspense>
          </div>

          {/* Article Content */}
          <article className="glass-card overflow-hidden">
            {/* Hero Section */}
            <div className="p-8 sm:p-12 text-center space-y-6 border-b border-white/5 bg-slate-500/5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary-500/10 text-primary-500 text-[10px] font-black uppercase tracking-[0.2em]">
                {article.category}
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-[1.1]">
                {article.title}
              </h1>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500">
                <span>Oleh {article.author}</span>
                <span className="hidden sm:block h-1 w-1 rounded-full bg-slate-300" />
                <span>{new Date(article.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                {article.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-black uppercase tracking-wider text-slate-400 border border-slate-400/20 px-3 py-1 rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-8 sm:p-12 space-y-10">
              <div className="p-6 rounded-2xl bg-primary-500/5 border-l-4 border-primary-500 italic text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                {article.summary}
              </div>

              {article.image && (
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* In-Article Ad */}
              <div className="glass-inset p-6 rounded-3xl overflow-hidden">
                <div className="text-center mb-4">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Advertisement</span>
                </div>
                <GoogleAd className="min-h-[100px]" />
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none 
                prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
                prose-p:text-lg prose-p:font-medium prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300
                prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900 dark:prose-strong:text-white
                prose-img:rounded-3xl prose-img:shadow-xl
                prose-code:bg-slate-500/10 prose-code:p-1 prose-code:rounded-lg prose-code:font-bold
                prose-pre:bg-[#030712] prose-pre:rounded-3xl prose-pre:border prose-pre:border-white/5">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {article.content}
                </ReactMarkdown>
              </div>
            </div>
          </article>

          {/* Post-Article Ad */}
          <div className="glass-card p-8 overflow-hidden">
            <div className="text-center mb-4">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Advertisement</span>
            </div>
            <GoogleAd className="min-h-[100px]" />
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="space-y-10 pt-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Artikel Terkait</h2>
                <div className="h-1.5 w-24 bg-primary-500 mx-auto rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.map(relatedArticle => (
                  <Link 
                    key={relatedArticle.slug} 
                    href={`/artikel/${relatedArticle.slug}`} 
                    className="glass-card p-8 group hover:border-primary-500/30 transition-all flex flex-col"
                  >
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight group-hover:text-white transition-colors">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 line-clamp-3 flex-1">
                      {relatedArticle.summary}
                    </p>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 flex items-center gap-2">
                      Baca Selengkapnya <span className="text-lg">&rarr;</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
