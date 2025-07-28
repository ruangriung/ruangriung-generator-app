// app/artikel/[slug]/page.tsx
'use client'; 
    
import { articles } from '@/lib/articles';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Article } from '@/lib/articles';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
// === LANGKAH 1: Impor komponen AdBanner ===
import AdBanner from '@/components/AdBanner';

export default function ArtikelDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (params.slug) {
      const foundArticle = articles.find((a) => a.slug === String(params.slug));
      if (foundArticle) {
        setArticle(foundArticle);
      } else {
        notFound();
      }
    }
  }, [params.slug]);

  if (!article) {
    return <div className="text-center p-10">Memuat artikel...</div>;
  }

  // === LANGKAH 2: Logika untuk membelah konten artikel ===
  // Memecah konten berdasarkan tag penutup paragraf </p> untuk menemukan titik tengah
  const paragraphs = article.content.split('</p>');
  const middleIndex = Math.floor(paragraphs.length / 2);

  // Menggabungkan kembali paragraf sebelum dan sesudah titik tengah
  const contentBeforeAd = paragraphs.slice(0, middleIndex).join('</p>') + '</p>';
  const contentAfterAd = paragraphs.slice(middleIndex).join('</p>');
  // =======================================================

  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <article className="bg-light-bg dark:bg-dark-bg p-6 md:p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-3">
            {article.title}
          </h1>
          <p className="text-md text-gray-600 dark:text-gray-400 mb-6">
            Oleh {article.author} | Diterbitkan pada {article.date}
          </p>
          
          <hr className="my-6 border-gray-300 dark:border-gray-600"/>

          {/* === LANGKAH 3: Tampilkan konten yang sudah dibelah dan sisipkan iklan === */}
          <div
            className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: contentBeforeAd }}
          />

          {/* Pastikan ada setidaknya beberapa paragraf sebelum menampilkan iklan */}
          {paragraphs.length > 2 && (
            <div className="my-8 flex justify-center">
              <AdBanner dataAdSlot="5961316189" /> 
            </div>
          )}

          <div
            className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: contentAfterAd }}
          />
          {/* ======================================================================== */}

          <hr className="my-8 border-gray-300 dark:border-gray-600"/>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/artikel" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all">
              <ArrowLeft size={18} />
              <span>Semua Artikel</span>
            </Link>
            <Link href="/" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all">
              <Home size={18} />
              <span>Beranda</span>
            </Link>
          </div>
          
        </article>
      </div>
    </main>
  );
}