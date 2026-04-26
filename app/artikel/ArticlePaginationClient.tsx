'use client';

import { useState, Fragment, useMemo, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ArticleSearchForm from '@/components/ArticleSearchForm';
import GoogleAd from '@/components/GoogleAd';

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
        <div className="space-y-12">
            <div className="flex justify-center">
                <div className="w-full max-w-2xl glass-card p-2">
                    <ArticleSearchForm
                        className="w-full"
                        placeholder="Cari artikel menarik..."
                    />
                </div>
            </div>

            {/* Ads Placement */}
            <div className="w-full max-w-4xl mx-auto">
              <div className="glass-card p-6 overflow-hidden">
                <div className="text-center mb-4">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Advertisement</span>
                </div>
                <GoogleAd className="min-h-[100px]" />
              </div>
            </div>

            {filteredArticles.length === 0 ? (
                <div className="glass-card p-16 text-center animate-in fade-in zoom-in duration-500">
                    <div className="h-20 w-20 rounded-[2rem] bg-primary-500/10 flex items-center justify-center text-primary-500 mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Artikel Tidak Ditemukan</h2>
                    {rawSearchQuery ? (
                        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
                            Maaf, kami tidak menemukan hasil untuk <span className="text-primary-500 font-bold">"{rawSearchQuery}"</span>.
                        </p>
                    ) : (
                        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
                            Katalog artikel sedang dalam pemeliharaan.
                        </p>
                    )}
                </div>
            ) : (
                <>
                    <div ref={listContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentPosts.map(article => (
                            <Link 
                                key={article.slug}
                                href={`/artikel/${article.slug}`}
                                className="group glass-card flex flex-col overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10"
                            >
                                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                                    {article.image ? (
                                        <img 
                                            src={article.image} 
                                            alt={article.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-blue-500/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 2v6h6" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-primary-500/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                                            {article.category}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-6 flex flex-col flex-1">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-2 leading-tight mb-3">
                                        {highlightMatches(article.title, rawSearchQuery)}
                                    </h2>
                                    
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 flex-1">
                                        {highlightMatches(article.summary, rawSearchQuery)}
                                    </p>
                                    
                                    <div className="pt-6 border-t border-white/10 mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 text-xs font-black">
                                                {article.author[0]}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{article.author}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">
                                                    {new Date(article.date).toLocaleDateString('id-ID', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="h-8 w-8 rounded-full glass-button flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-all">
                                            <span className="text-lg font-black">→</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-16 flex items-center justify-center gap-6">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="h-12 px-6 glass-button text-sm font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed group"
                            >
                                <span className="transition-transform group-hover:-translate-x-1 inline-block mr-2">←</span>
                                Prev
                            </button>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Page</span>
                                <span className="h-10 w-10 rounded-xl bg-primary-500 flex items-center justify-center text-white font-black shadow-lg shadow-primary-500/20">
                                    {safeCurrentPage}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">of {totalPages}</span>
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="h-12 px-6 glass-button text-sm font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed group"
                            >
                                Next
                                <span className="transition-transform group-hover:translate-x-1 inline-block ml-2">→</span>
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}