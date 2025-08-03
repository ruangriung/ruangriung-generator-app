// app/artikel/page.tsx

import { getAllArticles } from '@/lib/articles';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdBanner from '@/components/AdBanner';

import ArticlePaginationClient from './ArticlePaginationClient';

// Fungsi untuk mengurutkan artikel (dijalankan di server)
const sortArticles = (articles: any[]) => {
    return [...articles].sort((a, b) => {
        // === PERBAIKAN DI SINI ===
        // Sederhanakan fungsi convertDate karena Date constructor dapat langsung memparsing 'YYYY-MM-DD'
        const convertDate = (dateStr: string) => {
            return new Date(dateStr);
        };
        // =========================
        
        return convertDate(b.date).getTime() - convertDate(a.date).getTime();
    });
};

export default async function DaftarArtikelPage() {
    const allArticles = getAllArticles();
    const sortedArticles = sortArticles(allArticles);

    const AD_SLOT_ID_ARTIKEL = "6897039624"; // ID slot iklan Anda

    return (
        <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-light-bg dark:bg-dark-bg p-6 md:p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Artikel Terbaru</h1>

                    <div className="mb-8 flex justify-center">
                        <Link href="/" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all">
                            <ArrowLeft size={18} />
                            <span>Kembali ke Beranda</span>
                        </Link>
                    </div>

                    <ArticlePaginationClient initialArticles={sortedArticles} adSlotId={AD_SLOT_ID_ARTIKEL} />
                </div>
            </div>
        </main>
    );
}