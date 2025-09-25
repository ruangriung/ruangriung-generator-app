'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import AdBanner from '@/components/AdBanner';
import CopyButton from '@/components/CopyButton';
import PromptSubmissionTrigger from '@/components/PromptSubmissionTrigger';
import { Prompt } from '@/lib/prompts';

const sortPrompts = (items: Prompt[]) =>
  items.slice().sort((a, b) => Number(b.id) - Number(a.id));

interface PromptDetailClientProps {
  prompt: Prompt;
  prompts: Prompt[];
}

export default function PromptDetailClient({ prompt, prompts }: PromptDetailClientProps) {
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
          href="/kumpulan-prompt"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
        >
          <ArrowLeft size={18} />
          <span>Kembali ke Kumpulan Prompt</span>
        </Link>
        <Link
          href="/"
          className="ml-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
        >
          <ArrowLeft size={18} />
          <span>Kembali ke Beranda</span>
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
          {currentPrompt.link || currentPrompt.facebook ? (
            <a
              href={currentPrompt.link || currentPrompt.facebook}
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
                  href={`/kumpulan-prompt/${relatedPrompt.slug}`}
                  className="block h-full"
                >
                  <div className="h-full p-5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 dark:bg-gray-900 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {relatedPrompt.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Oleh{' '}
                      {relatedPrompt.link || relatedPrompt.facebook ? (
                        <a
                          href={relatedPrompt.link || relatedPrompt.facebook}
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

        <div className="my-8">
          <AdBanner dataAdSlot="5961316189" />
        </div>

        <div className="mt-8">
          {currentPrompt.tags.map(tag => (
            <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
