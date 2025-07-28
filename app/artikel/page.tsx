// app/artikel/page.tsx
"use client";

import { useState, Fragment } from 'react'; // Impor Fragment
import Link from 'next/link';
import { articles } from '@/lib/articles';
import { ArrowLeft } from 'lucide-react';
import AdBanner from '@/components/AdBanner'; // Impor komponen AdBanner Anda

// Fungsi untuk mengurutkan artikel (opsional tapi praktik yang baik)
const sortedArticles = [...articles].sort((a, b) => {
    const convertDate = (dateStr: string) => {
        const parts = dateStr.split(' ');
        const day = parts[0];
        const month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].indexOf(parts[1]);
        const year = parts[2];
        return new Date(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    };
    return convertDate(b.date).getTime() - convertDate(a.date).getTime();
});

export default function DaftarArtikelPage() {
    // --- Logika Paginasi (Tetap Sama) ---
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;
    const totalPages = Math.ceil(sortedArticles.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = sortedArticles.slice(indexOfFirstPost, indexOfLastPost);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    // --- Akhir Logika Paginasi ---

    // --- PENGATURAN IKLAN ---
    const AD_SLOT_ID_ARTIKEL = "6897039624"; // GANTI DENGAN ID SLOT IKLAN ANDA
    const AD_INTERVAL = 3; // Tampilkan iklan setelah setiap 3 artikel

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

                    <div className="space-y-6">
                        {currentPosts.map((article, index) => (
                            // Gunakan Fragment agar bisa merender artikel dan iklan dalam satu loop
                            <Fragment key={article.slug}>
                                <Link
                                    href={`/artikel/${article.slug}`}
                                    className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">{article.title}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Oleh {article.author} - {article.date}</p>
                                    <p className="text-gray-700 dark:text-gray-300 mt-3">{article.summary}</p>
                                </Link>

                                {/* === LOGIKA UNTUK MENAMPILKAN IKLAN === */}
                                {/* Iklan akan muncul setelah artikel ke-3, ke-6, dst. */}
                                {(index + 1) % AD_INTERVAL === 0 && (
                                    <div className="my-6"> {/* Wrapper untuk memberi jarak */}
                                        <AdBanner dataAdSlot={AD_SLOT_ID_ARTIKEL} />
                                    </div>
                                )}
                            </Fragment>
                        ))}
                    </div>

                    {/* --- Tombol Paginasi (Tetap Sama) --- */}
                    <div className="flex justify-between items-center mt-12">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button disabled:opacity-50 disabled:cursor-not-allowed active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset"
                        >
                            Sebelumnya
                        </button>
                        <span className="text-gray-700 dark:text-gray-300">
                            Halaman {currentPage} dari {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button disabled:opacity-50 disabled:cursor-not-allowed active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset"
                        >
                            Selanjutnya
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}