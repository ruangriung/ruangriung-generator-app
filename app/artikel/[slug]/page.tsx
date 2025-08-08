import { getArticleBySlug, getArticleSlugs } from '@/lib/articles';import ReactMarkdown from 'react-markdown';import rehypeHighlight from 'rehype-highlight';import Link from 'next/link';import { ArrowLeft } from 'lucide-react';import { Metadata } from 'next';import { notFound } from 'next/navigation';import AdBanner from '@/components/AdBanner';export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {  const article = getArticleBySlug(params.slug);  if (!article) {    return {};  }  const fullUrl = `https://ruangriung.my.id/artikel/${article.slug}`;  return {    title: `${article.title} - RuangRiung`,    description: article.summary,    keywords: article.title.split(' ').join(', '),    alternates: {      canonical: fullUrl,    },    openGraph: {      title: article.title,      description: article.summary,      url: fullUrl,      type: 'article',      publishedTime: new Date(article.date).toISOString(),      authors: [article.author],      images: [        {          url: 'https://ruangriung.my.id/assets/ruangriung.png',          width: 1200,          height: 630,          alt: article.title,        },      ],    },    twitter: {      card: 'summary_large_image',      title: article.title,      description: article.summary,      images: ['https://ruangriung.my.id/assets/ruangriung.png'],    },  };}export async function generateStaticParams() {  const slugs = getArticleSlugs();  return slugs.map((slug) => ({ slug }));}export default async function ArticlePage({ params }: { params: { slug: string } }) {
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
      <Link href="/artikel" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft className="mr-2" size={20} />
        Kembali ke Artikel
      </Link>
      <h1 className="text-4xl font-bold mb-4 text-center">{article.title}</h1>
      <p className="text-gray-600 text-center mb-6">By {article.author} on {new Date(article.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {article.content}
        </ReactMarkdown>
      </div>
      <div className="my-8">
        <AdBanner dataAdSlot="7992484013" />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}