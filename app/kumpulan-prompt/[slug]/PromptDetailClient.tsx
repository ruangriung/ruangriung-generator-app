'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import CopyButton from '@/components/CopyButton';
import PromptSubmissionTrigger from '@/components/PromptSubmissionTrigger';
import { Prompt } from '@/lib/prompts';

const sortPrompts = (items: Prompt[]) =>
  items.slice().sort((a, b) => Number(b.id) - Number(a.id));

interface PromptDetailClientProps {
  prompt: Prompt;
  prompts: Prompt[];
  collectionHref?: string;
  collectionLabel?: string;
  detailBasePath?: string;
  homeHref?: string;
  homeLabel?: string;
}

export default function PromptDetailClient({
  prompt,
  prompts,
  collectionHref = '/kumpulan-prompt',
  collectionLabel = 'Kembali ke Kumpulan Prompt',
  detailBasePath = '/kumpulan-prompt',
  homeHref = '/',
  homeLabel = 'Kembali ke Beranda',
}: PromptDetailClientProps) {
  const currentPrompt = prompt;
  const [promptCollection, setPromptCollection] = useState(() => sortPrompts(prompts));
  const [shareFeedback, setShareFeedback] = useState<'idle' | 'success' | 'error'>('idle');
  const [shareMessage, setShareMessage] = useState('');
  const shareTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const relatedPrompts = useMemo(() => {
    return promptCollection
      .filter(related => {
        if (related.slug === currentPrompt.slug) {
          return false;
        }

        if (!related.tags.length || !currentPrompt.tags.length) {
          return false;
        }

        return related.tags.some(tag => currentPrompt.tags.includes(tag));
      })
      .slice(0, 4);
  }, [promptCollection, currentPrompt]);

  const featuredPrompts = useMemo(
    () => promptCollection.filter(item => item.slug !== currentPrompt.slug).slice(0, 3),
    [promptCollection, currentPrompt.slug],
  );

  const recommendedTags = useMemo(() => {
    const tagCount = new Map<string, number>();

    promptCollection.forEach(item => {
      item.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
      });
    });

    return Array.from(tagCount.entries())
      .sort((a, b) => {
        if (a[1] !== b[1]) {
          return b[1] - a[1];
        }

        return a[0].localeCompare(b[0], 'id');
      })
      .slice(0, 6)
      .map(([tag, count]) => ({ tag, count }));
  }, [promptCollection]);

  const recommendedTools = useMemo(() => {
    const toolCount = new Map<string, number>();

    promptCollection.forEach(item => {
      if (item.tool) {
        toolCount.set(item.tool, (toolCount.get(item.tool) ?? 0) + 1);
      }
    });

    return Array.from(toolCount.entries())
      .sort((a, b) => {
        if (a[1] !== b[1]) {
          return b[1] - a[1];
        }

        return a[0].localeCompare(b[0], 'id');
      })
      .slice(0, 4)
      .map(([tool, count]) => ({ tool, count }));
  }, [promptCollection]);

  const createPromptPreview = useCallback((value: string, limit = 160) => {
    const normalized = value.replace(/\s+/g, ' ').trim();

    if (normalized.length <= limit) {
      return normalized;
    }

    return `${normalized.slice(0, limit).trim()}…`;
  }, []);

  const buildCollectionLink = useCallback((type: 'tag' | 'tool', value: string) => {
    const params = new URLSearchParams();
    params.set(type, value);
    return `${collectionHref}?${params.toString()}`;
  }, [collectionHref]);

  const hasRecommendations =
    featuredPrompts.length > 0 || recommendedTags.length > 0 || recommendedTools.length > 0;

  const handlePromptCreated = (createdPrompt: Prompt) => {
    setPromptCollection(previous => {
      const filtered = previous.filter(item => item.slug !== createdPrompt.slug);
      return sortPrompts([createdPrompt, ...filtered]);
    });
  };

  useEffect(() => {
    return () => {
      if (shareTimeoutRef.current) {
        clearTimeout(shareTimeoutRef.current);
      }
    };
  }, []);

  const handleSharePrompt = async () => {
    if (shareTimeoutRef.current) {
      clearTimeout(shareTimeoutRef.current);
      shareTimeoutRef.current = null;
    }

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    try {
      if (navigator.share) {
        await navigator.share({
          title: currentPrompt.title,
          text: `Lihat prompt "${currentPrompt.title}" di RuangRiung`,
          url: shareUrl,
        });
        setShareFeedback('success');
        setShareMessage('Tautan prompt berhasil dibagikan.');
      } else if (navigator.clipboard && shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        setShareFeedback('success');
        setShareMessage('Tautan prompt disalin ke clipboard.');
      } else {
        setShareFeedback('error');
        setShareMessage('Peramban tidak mendukung fitur berbagi otomatis.');
        return;
      }
    } catch (error) {
      console.error('Gagal membagikan prompt:', error);
      setShareFeedback('error');
      setShareMessage('Gagal membagikan tautan prompt. Silakan coba lagi.');
    }

    shareTimeoutRef.current = window.setTimeout(() => {
      setShareFeedback('idle');
      setShareMessage('');
    }, 2500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-center">
        <Link
          href={collectionHref}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
        >
          <ArrowLeft size={18} />
          <span>{collectionLabel}</span>
        </Link>
        <Link
          href={homeHref}
          className="ml-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
        >
          <ArrowLeft size={18} />
          <span>{homeLabel}</span>
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        {currentPrompt.image && (
          <div className="mb-8">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Link Gambar:</p>
            <a
              href={currentPrompt.image}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {currentPrompt.image}
            </a>
          </div>
        )}
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{currentPrompt.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          By{' '}
          {currentPrompt.link ? (
            <a
              href={currentPrompt.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {currentPrompt.author}
            </a>
          ) : currentPrompt.facebook ? (
            <a
              href={currentPrompt.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {currentPrompt.author}
            </a>
          ) : (
            currentPrompt.author
          )}
        </p>
        {(currentPrompt.link || currentPrompt.facebook) && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            {currentPrompt.link && (
              <a
                href={currentPrompt.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Website
              </a>
            )}
            {currentPrompt.facebook && (
              <a
                href={currentPrompt.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Facebook
              </a>
            )}
          </div>
        )}
        <p className="text-md text-gray-500 dark:text-gray-400 mb-2">
          Tanggal: {new Date(currentPrompt.date).toLocaleDateString('id-ID')}
        </p>
        <p className="text-md text-gray-500 dark:text-gray-400 mb-6">Tool: {currentPrompt.tool}</p>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <PromptSubmissionTrigger
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300 shadow-lg"
              onSuccess={handlePromptCreated}
            />
          </div>
          <div className="flex w-full flex-col items-end gap-2 sm:w-auto">
            <div className="flex w-full justify-end gap-2 sm:w-auto">
              <button
                type="button"
                onClick={handleSharePrompt}
                className="inline-flex items-center rounded bg-blue-600 px-3 py-1 text-sm font-semibold text-white shadow transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <Share2 size={16} />
                <span className="ml-2">Bagikan</span>
              </button>
              <CopyButton text={currentPrompt.promptContent} />
            </div>
            {shareMessage ? (
              <p
                role="status"
                aria-live="polite"
                className={`text-xs ${
                  shareFeedback === 'success'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {shareMessage}
              </p>
            ) : null}
          </div>
        </div>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{currentPrompt.promptContent}</ReactMarkdown>
        </div>

        {relatedPrompts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Prompt Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPrompts.map(relatedPrompt => (
                <Link
                  key={relatedPrompt.slug}
                  href={`${detailBasePath}/${relatedPrompt.slug}`}
                  className="block h-full"
                >
                  <div className="h-full p-5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 dark:bg-gray-900 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {relatedPrompt.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Oleh{' '}
                      {relatedPrompt.link ? (
                        <a
                          href={relatedPrompt.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {relatedPrompt.author}
                        </a>
                      ) : relatedPrompt.facebook ? (
                        <a
                          href={relatedPrompt.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {relatedPrompt.author}
                        </a>
                      ) : (
                        relatedPrompt.author
                      )}
                    </p>
                    {(relatedPrompt.link || relatedPrompt.facebook) && (
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        {relatedPrompt.link && (
                          <a
                            href={relatedPrompt.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Website
                          </a>
                        )}
                        {relatedPrompt.facebook && (
                          <a
                            href={relatedPrompt.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Facebook
                          </a>
                        )}
                      </div>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Tool:{' '}
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {relatedPrompt.tool}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {relatedPrompt.promptContent.length > 120
                        ? `${relatedPrompt.promptContent.slice(0, 120)}...`
                        : relatedPrompt.promptContent}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {relatedPrompt.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {relatedPrompt.tags.length > 3 && (
                        <span className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">
                          +{relatedPrompt.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          {currentPrompt.tags.map(tag => (
            <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {tag}
            </span>
          ))}
        </div>

        {hasRecommendations && (
          <div className="mt-12 space-y-12">
            {featuredPrompts.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Prompt Pilihan Minggu Ini</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Dipilih otomatis dari kiriman terbaru yang banyak diminati komunitas.
                    </p>
                  </div>
                  <Link
                    href={collectionHref}
                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:text-blue-400"
                  >
                    Lihat semua prompt
                  </Link>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {featuredPrompts.map(featured => (
                    <Link
                      key={featured.slug}
                      href={`${detailBasePath}/${featured.slug}`}
                      className="group flex h-full flex-col justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-blue-200 hover:bg-white hover:shadow-md dark:border-gray-800 dark:bg-gray-800/60 dark:hover:border-blue-700 dark:hover:bg-gray-800"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{featured.tool}</span>
                          <span>{new Date(featured.date).toLocaleDateString('id-ID')}</span>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-300">
                          {featured.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-4 dark:text-gray-300">
                          {createPromptPreview(featured.promptContent)}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {featured.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(recommendedTags.length > 0 || recommendedTools.length > 0) && (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 shadow-sm dark:border-blue-900/40 dark:bg-blue-900/20 lg:col-span-2">
                  <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Rekomendasi Tag Populer</h2>
                  <p className="mt-1 text-sm text-blue-900/70 dark:text-blue-100/70">
                    Pilih salah satu tag berikut untuk langsung mengeksplorasi koleksi prompt favorit komunitas.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {recommendedTags.map(({ tag, count }) => (
                      <Link
                        key={tag}
                        href={buildCollectionLink('tag', tag)}
                        className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-800 shadow-sm transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-blue-900/60 dark:text-blue-100 dark:hover:bg-blue-900"
                      >
                        <span>#{tag}</span>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                          {count}
                        </span>
                      </Link>
                    ))}
                    {recommendedTags.length === 0 && (
                      <p className="text-sm text-blue-900/70 dark:text-blue-100/70">
                        Tag akan muncul secara otomatis ketika prompt baru ditambahkan.
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Shortcut Alat Favorit</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Gunakan pintasan ini untuk melihat kumpulan prompt unggulan berdasarkan alat populer.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {recommendedTools.map(({ tool, count }) => (
                        <Link
                          key={tool}
                          href={buildCollectionLink('tool', tool)}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          <span>{tool}</span>
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                            {count}
                          </span>
                        </Link>
                      ))}
                      {recommendedTools.length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Alat populer akan muncul setelah data tersedia.</p>
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg border border-dashed border-gray-200 p-4 dark:border-gray-700">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Tips eksplorasi</p>
                    <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <li>• Kombinasikan pencarian dan filter untuk menemukan variasi prompt yang lebih spesifik.</li>
                      <li>• Simpan prompt favorit melalui tombol bagikan agar mudah dibuka kembali.</li>
                      <li>• Jelajahi prompt serupa melalui rekomendasi tag atau alat di halaman ini.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
