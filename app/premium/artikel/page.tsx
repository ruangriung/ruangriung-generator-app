// app/artikel/page.tsx
'use client'; 

import Link from 'next/link';
import { articles } from '@/lib/articles';
import { ArrowLeft } from 'lucide-react'; // Impor ikon

export default function DaftarArtikelPage() {
  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-light-bg dark:bg-dark-bg p-6 md:p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Artikel Terbaru</h1>
            
            {/* === TOMBOL KEMBALI DITAMBAHKAN DI SINI === */}
            <div className="mb-8 flex justify-center">
              <Link href="/" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all">
                <ArrowLeft size={18} />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
            {/* ======================================= */}

            <div className="space-y-6">
            {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/artikel/${article.slug}`}
                  className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">{article.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Oleh {article.author} - {article.date}</p>
                  <p className="text-gray-700 dark:text-gray-300 mt-3">{article.summary}</p>
                </Link>
            ))}
            </div>
        </div>
      </div>
    </main>
  );
}