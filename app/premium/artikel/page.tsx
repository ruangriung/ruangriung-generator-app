// app/premium/artikel/page.tsx
"use client"; 

import { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdBanner from '@/components/AdBanner'; // Gunakan AdBanner dari komponen utama
import { Article } from '@/lib/articles'; // Import Article interface

export default function PremiumArtikelPage() {
    const [articles, setArticles] = useState<Article[]>([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null); 

    useEffect(() => {
        async function fetchArticles() {
            try {
                setLoading(true);
                setError(null); 

                // Ini akan mengambil semua artikel dari API utama
                const response = await fetch('/api/articles'); 
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data: Article[] = await response.json();
                setArticles(data); 
            } catch (err: any) {
                setError(err.message);
                console.error("Gagal mengambil artikel premium:", err);
            } finally {
                setLoading(false); 
            }
        }

        fetchArticles();
    }, []); 

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6; // Sesuaikan jika ingin lebih banyak/sedikit per halaman
    
    const totalPages = articles.length > 0 ? Math.ceil(articles.length / postsPerPage) : 1;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = articles.slice(indexOfFirstPost, indexOfLastPost);

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    if (loading) {
        return <div className="text-center p-8">Memuat artikel premium...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">Error saat memuat artikel premium: {error}</div>;
    }
    
    const displayArticles = currentPosts; 

    return (
        <main className="min-h-screen bg-light-bg dark:bg-dark-bg text-gray-800 dark:text-gray-200 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center">
                    <Link href="/premium" className="flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600 mb-8">
                        <ArrowLeft className="mr-2" size={20} /> Kembali ke Premium
                    </Link>

                    {/* Anda bisa menggunakan AdBanner yang berbeda atau tidak sama sekali untuk bagian premium */}
                    <div className="w-full mb-8">
                        <AdBanner dataAdSlot="5961316189" /> 
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-600">
                        Artikel Premium
                    </h1>

                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                        {displayArticles.map((article) => (
                            <Fragment key={article.slug}>
                                <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300">
                                    {/* Link ke halaman detail artikel premium */}
                                    <Link href={`/premium/artikel/${article.slug}`}>
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-6">
                                            <h2 className="text-2xl font-bold mb-2 text-primary-light dark:text-primary-dark">
                                                {article.title}
                                            </h2>
                                            <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                                                {article.description}
                                            </p>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Dipublikasikan: {article.publishedDate}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </Fragment>
                        ))}
                    </section>

                    <div className="flex justify-between items-center mt-12 w-full max-w-6xl">
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
                            className="px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button disabled:opacity-50 disabled:cursor-not-allowed active:shadow-neumorphic-inset dark:active:shadow-neumorphic-inset"
                        >
                            Selanjutnya
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}