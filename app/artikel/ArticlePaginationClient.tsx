'use client';

import { useState, Fragment, useMemo, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ArticleSearchForm from '@/components/ArticleSearchForm';

const escapeRegExp = (value: string) => value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\$&');

const highlightMatches = (text: string, term: string): ReactNode => {
    const normalizedTerm = term.trim();

    if (!normalizedTerm) {
        return text;
    }

    const lowerTerm = normalizedTerm.toLowerCase();
    const regex = new RegExp(`(${escapeRegExp(normalizedTerm)})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
        part.toLowerCase() === lowerTerm ? (
            <mark
                key={`${index}-${part}`}
                className="rounded bg-yellow-200 px-1 py-0 text-gray-900 dark:bg-yellow-500/40"
            >
                {part}
            </mark>
        ) : (
            <Fragment key={`${index}-${part}`}>{part}</Fragment>
        ),
    );
};

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
}

export default function ArticlePaginationClient({ initialArticles }: ArticlePaginationClientProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;
    const searchParams = useSearchParams();
    const listContainerRef = useRef<HTMLDivElement | null>(null);
    const hasInteractedWithPaginationRef = useRef(false);

    const scrollToArticleListTop = useCallback(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const element = listContainerRef.current;

        if (!element) {
            return;
        }

        window.requestAnimationFrame(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }, []);

    const rawSearchQuery = (searchParams.get('q') ?? '').trim();
    const normalizedSearchQuery = rawSearchQuery.toLowerCase();

    const filteredArticles = useMemo(
        () =>
            initialArticles.filter(article => {
                if (!normalizedSearchQuery) {
                    return true;
                }

                const haystack = [
                    article.title,
                    article.summary,
                    article.author,
                    article.category,
                    ...article.tags,
                ]
                    .join(' ')
                    .toLowerCase();

                return haystack.includes(normalizedSearchQuery);
            }),
        [initialArticles, normalizedSearchQuery],
    );

    const totalPages = filteredArticles.length === 0 ? 0 : Math.ceil(filteredArticles.length / postsPerPage);
    const safeCurrentPage = totalPages === 0 ? 1 : Math.min(currentPage, totalPages);
    const indexOfLastPost = totalPages === 0 ? 0 : safeCurrentPage * postsPerPage;
    const indexOfFirstPost = totalPages === 0 ? 0 : indexOfLastPost - postsPerPage;
    const currentPosts = filteredArticles.slice(indexOfFirstPost, indexOfLastPost);

    useEffect(() => {
        setCurrentPage(1);

        if (hasInteractedWithPaginationRef.current) {
            scrollToArticleListTop();
        }
    }, [normalizedSearchQuery, scrollToArticleListTop]);

    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);

            if (hasInteractedWithPaginationRef.current) {
                scrollToArticleListTop();
            }
        }

        if (totalPages === 0 && currentPage !== 1) {
            setCurrentPage(1);

            if (hasInteractedWithPaginationRef.current) {
                scrollToArticleListTop();
            }
        }
    }, [currentPage, totalPages, scrollToArticleListTop]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            hasInteractedWithPaginationRef.current = true;
            setCurrentPage(currentPage + 1);
            scrollToArticleListTop();
        }
    };
    const handlePrevPage = () => {
        if (currentPage > 1) {
            hasInteractedWithPaginationRef.current = true;
            setCurrentPage(currentPage - 1);
            scrollToArticleListTop();
        }
    };

    return (
        <>
            <div className="mb-8 flex justify-center">
                <ArticleSearchForm
                    className="w-full max-w-4xl backdrop-blur"
                    placeholder="Cari judul, ringkasan, atau tag artikel..."
                />
            </div>

            {filteredArticles.length === 0 ? (
                <div className="rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Tidak ada artikel ditemukan</h2>
                    {rawSearchQuery ? (
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Kami tidak menemukan artikel yang cocok untuk{' '}
                            <mark className="rounded bg-yellow-200 px-1 py-0 font-semibold text-purple-700 dark:bg-yellow-500/40 dark:text-purple-200">
                                "{rawSearchQuery}"
                            </mark>
                            . Coba gunakan kata kunci lain.
                        </p>
                    ) : (
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Saat ini belum ada artikel yang tersedia.
                        </p>
                    )}
                </div>
            ) : (
                <>
                    <div ref={listContainerRef} className="space-y-8">
                        {currentPosts.map(article => (
                            <Fragment key={article.slug}>
                                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-2">
                                        <Link href={`/artikel/${article.slug}`} className="block">
                                            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 hover:underline">
                                                {highlightMatches(article.title, rawSearchQuery)}
                                            </h2>
                                        </Link>
                                        <span className="whitespace-nowrap rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
                                            {highlightMatches(article.category, rawSearchQuery)}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Oleh{' '}
                                        <span className="font-medium text-gray-700 dark:text-gray-200">
                                            {highlightMatches(article.author, rawSearchQuery)}
                                        </span>{' '}
                                        -
                                        {' '}
                                        {new Date(article.date).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <Link href={`/artikel/${article.slug}`} className="block">
                                        <p className="mt-3 text-gray-700 dark:text-gray-300">
                                            {highlightMatches(article.summary, rawSearchQuery)}
                                        </p>
                                    </Link>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {article.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                            >
                                                {highlightMatches(`#${tag}`, rawSearchQuery)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                    </Fragment>
                        ))}
                    </div>

                    {totalPages > 0 && (
                        <div className="mt-12 flex items-center justify-between">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button disabled:cursor-not-allowed disabled:opacity-50 active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset"
                            >
                                Sebelumnya
                            </button>
                            <span className="text-gray-700 dark:text-gray-300">
                                Halaman {safeCurrentPage} dari {totalPages}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button disabled:cursor-not-allowed disabled:opacity-50 active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}