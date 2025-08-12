'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';

interface Article {
    slug: string;
    title: string;
    date: string;
    author: string;
    summary: string;
    category: string;
    tags: string[];
    image?: string;
    content?: string;
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
            <div className="space-y-8">
                {currentPosts.map((article, index) => (
                    <Fragment key={article.slug}>
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <Link href={`/artikel/${article.slug}`} className="block">
                                    <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 hover:underline">{article.title}</h2>
                                </Link>
                                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 rounded-full px-3 py-1 whitespace-nowrap">{article.category}</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Oleh {article.author} - {new Date(article.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <Link href={`/artikel/${article.slug}`} className="block">
                                <p className="text-gray-700 dark:text-gray-300 mt-3">{article.summary}</p>
                            </Link>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {article.tags.map(tag => (
                                    <span key={tag} className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

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