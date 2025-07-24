// app/prompt/author/[slug]/page.tsx
"use client";

import { useState, Fragment, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation'; // Import useParams
import { prompts, Prompt } from '@/lib/prompts';
import { getAuthor, Author } from '@/lib/authors/authors'; // Import getAuthor dan Author interface
import { ArrowLeft, ExternalLink, Copy, User, Home, Mail, Eye, Facebook, Instagram, Twitter, InstagramIcon, FacebookIcon, TwitterIcon, LinkedinIcon, MessageCircleHeartIcon, MessageCircleMore, GithubIcon, Music2, Youtube, Earth, AtSign, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdBanner } from '@/components/AdBanner'; // Import AdBannerimport { Facebook, Instagram } from 'lucide-react';
import Github from 'next-auth/providers/github';

export default function AuthorPromptsPage() {
    const params = useParams();
    const authorSlug = params.slug as string;

    const [author, setAuthor] = useState<Author | null>(null);
    const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const promptsPerPage = 9;
    const totalPages = Math.ceil(filteredPrompts.length / promptsPerPage);
    const indexOfLastPrompt = currentPage * promptsPerPage;
    const indexOfFirstPrompt = indexOfLastPrompt - promptsPerPage;
    const currentPrompts = filteredPrompts.slice(indexOfFirstPrompt, indexOfLastPrompt);

    // --- Pengaturan Iklan ---
    const AD_SLOT_ID_AUTHOR_GRID = "1122334455"; // GANTI DENGAN ID SLOT IKLAN ANDA
    const AD_INTERVAL_AUTHOR_GRID = 3; // Tampilkan iklan setelah setiap 3 prompt

    useEffect(() => {
        if (authorSlug) {
            const foundAuthor = getAuthor(authorSlug);
            setAuthor(foundAuthor || null);

            if (foundAuthor) {
                // Filter prompt berdasarkan nama penulis
                const filtered = prompts.filter(
                    (prompt) => prompt.author === foundAuthor.name || prompt.author === foundAuthor.aka
                );
                setFilteredPrompts(filtered);
                setCurrentPage(1); // Reset paginasi saat penulis berubah
            } else {
                setFilteredPrompts([]);
            }
        }
    }, [authorSlug]); // Jalankan ulang saat slug penulis berubah

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleCopyPrompt = async (promptContent: string) => {
        try {
            await navigator.clipboard.writeText(promptContent);
            toast.success("Prompt berhasil disalin!");
        } catch (err) {
            toast.error("Gagal menyalin prompt.");
            console.error("Failed to copy: ", err);
        }
    };

    if (!author) {
        return (
            <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8 flex items-center justify-center">
                <p className="text-gray-700 dark:text-gray-300">Memuat profil penulis atau penulis tidak ditemukan...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-light-bg dark:bg-dark-bg p-6 md:p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Prompt dari {author.name}</h1>

                    {/* Tombol Kembali ke Semua Prompt dan Beranda */}
                    <div className="mb-8 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/prompt"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
                        >
                            <ArrowLeft size={18} />
                            <span>Semua Prompt</span>
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all hover:bg-purple-700"
                        >
                            <Home size={18} />
                            <span>Beranda Utama</span>
                        </Link>
                    </div>

                    {/* Profil Penulis di Halaman Detailnya */}
                    <div className="mb-10 p-6 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-700 dark:to-gray-900 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <Image
                            src={author.imageUrl}
                            alt={`Profil ${author.name}`}
                            width={120}
                            height={120}
                            className="rounded-full border-4 border-purple-400 dark:border-purple-600 shadow-md"
                        />
                        <div>
                            <h2 className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 mb-2">
                                {author.name} {author.aka && <span className="text-gray-600 dark:text-gray-400 text-lg font-normal">({author.aka})</span>}
                            </h2>
                            <p className="text-gray-700 dark:text-gray-200 leading-relaxed max-w-lg mb-4">
                                {author.description}
                            </p>
                            {/* Semua link sosial berada dalam <div>, tidak ada <a> di dalam <Link> */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                {author.facebookUrl && (
                                    <a href={author.facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors text-sm">
                                        <FacebookIcon size={16} /> Facebook
                                    </a>
                                )}
                                {author.instagramUrl && (
                                    <a href={author.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-pink-600 text-white font-bold rounded-lg shadow-md hover:bg-pink-700 transition-colors text-sm">
                                        <Instagram size={16} /> Instagram
                                    </a>
                                )}
                                {author.twitterUrl && (
                                    <a href={author.twitterUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-400 text-white font-bold rounded-lg shadow-md hover:bg-blue-500 transition-colors text-sm">
                                        <Twitter size={16} /> X
                                    </a>
                                )}
                                {author.youtubeUrl && (
                                    <a href={author.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors text-sm">
                                        <Youtube size={16} /> YouTube
                                    </a>
                                )}
                                {author.websiteUrl && (
                                    <a href={author.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-800 text-white font-bold rounded-lg shadow-md hover:bg-gray-900 transition-colors text-sm">
                                        <Earth size={16} /> Website
                                    </a>
                                )}
                                {author.linkedinUrl && (
                                    <a href={author.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-700 text-white font-bold rounded-lg shadow-md hover:bg-blue-800 transition-colors text-sm">
                                        <LinkedinIcon size={16} /> LinkedIn
                                    </a>
                                )}
                                {author.threadsUrl && (
                                    <a href={author.threadsUrl} target="_blank" rel="noopener noreferrer"  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-black text-white font-bold rounded-lg shadow-md hover:bg-gray-800 transition-colors text-sm">
                                        <AtSign size={16} /> Threads
                                    </a>
                                )}
                                {author.tiktokUrl && (
                                    <a href={author.tiktokUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-black text-white font-bold rounded-lg shadow-md hover:bg-gray-800 transition-colors text-sm">
                                        <Music2 size={16} /> TikTok
                                    </a>
                                )}
                                {author.pinterestUrl && (
                                    <a href={author.pinterestUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors text-sm">
                                        <MessageCircleHeartIcon size={16} /> Pinterest
                                    </a>
                                )}
                                {author.githubUrl && (
                                    <a href={author.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-900 text-white font-bold rounded-lg shadow-md hover:bg-gray-800 transition-colors text-sm">
                                        <GithubIcon size={16} /> GitHub
                                    </a>
                                )}
                                {author.whatsAppUrl && (
                                    <a href={author.whatsAppUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors text-sm">
                                        <MessageCircleMore size={16} /> WhatsApp
                                    </a>
                                )}
                                 {author.email && (
                                   <a
                                     href={`mailto:${author.email}`}
                                      className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-800 text-white font-bold rounded-lg shadow-md hover:bg-gray-900 transition-colors text-sm"
                                      onClick={e => e.stopPropagation()}
                                        rel="noopener noreferrer">
                                        <Mail size={16} /> Email
                                        </a>
                                )}
                                {author.telegramUrl && (
                                    <a href={author.telegramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors text-sm">
                                        <Send size={16} /> Telegram
                                    </a>
                                )}
                                {author.location && (
                                    <span className="text-gray-500 dark:text-gray-400 text-sm"> {author.location}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Akhir Profil Penulis */}

                    <div className="mb-8 border-t-2 border-gray-300 dark:border-gray-700 pt-8">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">Prompt dari {author.name} ({filteredPrompts.length})</h2>
                        {filteredPrompts.length === 0 && (
                            <p className="text-center text-gray-600 dark:text-gray-400">Tidak ada prompt yang ditemukan dari penulis ini.</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentPrompts.map((prompt: Prompt, index: number) => (
                            <Fragment key={prompt.slug}>
                                <Link
                                    href={`/prompt/${prompt.slug}`}
                                    className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
                                >
                                    <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                                        <Image
                                            src={prompt.thumbnailUrl}
                                            alt={prompt.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className="transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2">{prompt.title}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
                                        <User size={14} /> Oleh {prompt.author}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Kategori: <span className="font-medium text-gray-700 dark:text-gray-300">{prompt.category}</span></p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Tools: <span className="font-medium text-gray-700 dark:text-gray-300">{prompt.toolsUsed.join(', ')}</span></p>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{prompt.shortDescription}</p>

                                    <div
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors cursor-pointer"
                                    >
                                        <Eye size={18} />
                                        <span>Lihat Detail Prompt</span>
                                    </div>
                                </Link>

                                {/* Slot Iklan di antara grid prompt */}
                                {(index + 1) % AD_INTERVAL_AUTHOR_GRID === 0 && index < currentPrompts.length - 1 && (
                                    <div className="my-6 col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center items-center">
                                        <AdBanner dataAdSlot={AD_SLOT_ID_AUTHOR_GRID} />
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
                </div>
            </div>
        </main>
    );
}