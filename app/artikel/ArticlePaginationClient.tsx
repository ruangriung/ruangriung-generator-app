'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';

interface Article {
    slug: string;
    title: string;
    date: string; // Tetap string di sini karena ini adalah tipe data dari lib/articles.ts
    author: string;
    summary: string;
}

interface ArticlePaginationClientProps {
    initialArticles: Article[];
    adSlotId: string;
}

export default function ArticlePaginationClient({ initialArticles, adSlotId }: ArticlePaginationClientProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;
    const totalPages = Math.ceil(initialArticles.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = initialArticles.slice(indexOfFirstPost, indexOfLastPost);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const AD_INTERVAL = 3; // Tampilkan iklan setelah setiap 3 artikel

    return (
        <>
            <div className="space-y-6">
                {currentPosts.map((article, index) => (
                    <Fragment key={article.slug}>
                        <Link
                            href={`/artikel/${article.slug}`}
                            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">{article.title}</h2>
                            {/* === PERBAIKAN DI SINI === */}
                            {/* Ubah objek Date menjadi string yang diformat sebelum ditampilkan */}
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Oleh {article.author} - {new Date(article.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            {/* ========================= */}
                            <p className="text-gray-700 dark:text-gray-300 mt-3">{article.summary}</p>
                        </Link>

                        {(index + 1) % AD_INTERVAL === 0 && (
                            <div className="my-6">
                                <AdBanner dataAdSlot={adSlotId} />
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>

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
        </>
    );
}