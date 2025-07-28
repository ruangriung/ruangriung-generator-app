// app/premium/artikel/[slug]/page.tsx
// Hapus "use client"; dari sini. Ini harus menjadi Server Component.

import React from 'react';
import { getAllArticles } from '@/lib/articles/utils'; // Import server-side utility
import { notFound } from 'next/navigation'; // Untuk menampilkan halaman 404
import AdBanner from '@/components/AdBanner'; 
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// generateStaticParams akan memberitahu Next.js slug mana saja yang harus di-pre-render pada waktu build.
export async function generateStaticParams() {
  const articles = await getAllArticles(); 
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Komponen halaman detail artikel
export default async function PremiumArticleDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const articles = await getAllArticles();
  const article = articles.find((art) => art.slug === slug);

  if (!article) {
    notFound(); 
  }

  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg text-gray-800 dark:text-gray-200 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col items-center">
          <Link href="/premium/artikel" className="flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600 mb-8">
            <ArrowLeft className="mr-2" size={20} /> Kembali ke Daftar Artikel Premium
          </Link>

          {/* Anda bisa menggunakan AdBanner yang berbeda atau tidak sama sekali untuk bagian premium */}
          <div className="w-full mb-8">
            <AdBanner dataAdSlot="8254616654" /> 
          </div>

          <article className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-lg p-8 w-full">
            <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-primary-light dark:text-primary-dark">
              {article.title}
            </h1>
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
              Dipublikasikan pada: {article.publishedDate}
              {article.lastUpdatedDate && ` | Diperbarui: ${article.lastUpdatedDate}`}
              {article.authorSlug && ` | Penulis: ${article.authorSlug}`}
            </div>

            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
            />

            <div 
              className="prose dark:prose-invert max-w-none" 
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />
          </article>
        </div>
      </div>
    </main>
  );
}