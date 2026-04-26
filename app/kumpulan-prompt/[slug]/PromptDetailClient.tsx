'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Share2, Clock, Calendar, User as UserIcon } from 'lucide-react';
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
  const shareTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);

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
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-slate-50 dark:bg-[#030712] -z-20" />
      <div className="fixed inset-0 bg-mesh-gradient opacity-40 dark:opacity-20 -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        <Link
          href={collectionHref}
          className="glass-button px-5 md:px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 text-slate-600 dark:text-slate-400 shadow-md border-2 border-primary-500/10 hover:border-primary-500/30"
        >
          <ArrowLeft size={16} />
          <span>{collectionLabel}</span>
        </Link>
        <Link
          href={homeHref}
          className="glass-button px-5 md:px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 text-slate-600 dark:text-slate-400 shadow-md border-2 border-primary-500/10 hover:border-primary-500/30"
        >
          <ArrowLeft size={16} />
          <span>{homeLabel}</span>
        </Link>
      </div>
          <div className="glass-card p-10 md:p-16 space-y-12">
            <div className="space-y-8 border-b border-white/5 pb-10 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <span className="px-4 py-1.5 rounded-xl bg-primary-500/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">
                      {currentPrompt.tool}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      <Calendar size={12} />
                      <span suppressHydrationWarning>
                        {(() => {
                          try {
                            const date = new Date(currentPrompt.date);
                            return isNaN(date.getTime()) 
                              ? 'Baru saja' 
                              : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                          } catch (e) {
                            return 'Baru saja';
                          }
                        })()}
                      </span>
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">
                    {currentPrompt.title}
                  </h1>
                </div>

                <div className="flex flex-col items-center md:items-end gap-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Curated By</p>
                  <div className="flex items-center gap-4">
                    {currentPrompt.link || currentPrompt.facebook ? (
                      <a
                        href={currentPrompt.link || currentPrompt.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 glass-button px-5 py-2.5 rounded-2xl hover:bg-primary-500/10 transition-all"
                      >
                        <div className="h-8 w-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-black text-xs">
                          {currentPrompt.author.charAt(0)}
                        </div>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-200 group-hover:text-white transition-colors">
                          {currentPrompt.author}
                        </span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 font-black text-xs">
                          {currentPrompt.author.charAt(0)}
                        </div>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                          {currentPrompt.author}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {currentPrompt.image && (
                <div className="relative group mt-8">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative aspect-video md:aspect-[21/9] w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl glass">
                    <Image 
                      src={currentPrompt.image} 
                      alt={currentPrompt.title} 
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1280px) 100vw, 1280px"
                      priority
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 p-4 md:p-6 rounded-3xl glass-inset border-2 border-primary-500/5 shadow-inner">
              <PromptSubmissionTrigger
                className="glass-button !bg-primary-500/10 hover:!bg-primary-500 !text-primary-500 hover:!text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-500/20 transition-all active:scale-95 text-center flex-1 md:flex-none border-2 border-primary-500/20 hover:border-primary-500"
                onSuccess={handlePromptCreated}
              />
              
              <div className="flex items-center justify-center gap-3 md:gap-4">
                <button
                  type="button"
                  onClick={handleSharePrompt}
                  className="flex-1 md:flex-none glass-button px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 text-slate-600 dark:text-slate-400 border-2 border-primary-500/10 hover:border-primary-500/30 shadow-md"
                >
                  <Share2 size={16} />
                  Share
                </button>
                <CopyButton text={currentPrompt.promptContent} />
              </div>
            </div>

            {/* Share Feedback Toast */}
            {shareMessage && (
              <div className="flex justify-center">
                <p className={`px-6 py-3 rounded-xl glass-card text-xs font-black uppercase tracking-widest ${shareFeedback === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {shareMessage}
                </p>
              </div>
            )}

            {/* Content Section */}
            <div className="prose prose-lg dark:prose-invert max-w-none prose-slate prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tight prose-strong:text-primary-500 prose-code:text-primary-400 prose-code:bg-primary-500/5 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{currentPrompt.promptContent}</ReactMarkdown>
            </div>

            {/* Related Content */}
            {relatedPrompts.length > 0 && (
              <div className="space-y-8 pt-10 border-t border-white/5">
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <div className="h-2 w-2 rounded-full bg-primary-500" />
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Related Prompts</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  {relatedPrompts.map(relatedPrompt => (
                    <Link key={relatedPrompt.slug} href={`${detailBasePath}/${relatedPrompt.slug}`}>
                      <div className="glass-card h-full p-6 md:p-8 space-y-4 hover:translate-y-[-4px] transition-all duration-500 border-white/5 hover:border-primary-500/30">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase tracking-widest text-primary-500">{relatedPrompt.tool}</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                            {new Date(relatedPrompt.date).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase leading-tight group-hover:text-white transition-colors">
                           {relatedPrompt.title}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 italic line-clamp-3">
                          &quot;{createPromptPreview(relatedPrompt.promptContent, 120)}&quot;
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Section */}
            <div className="pt-10 border-t border-white/5 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Classified Under</p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {currentPrompt.tags.map(tag => (
                  <Link
                    key={tag}
                    href={buildCollectionLink('tag', tag)}
                    className="px-5 py-2 rounded-xl glass-button text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Recommendations */}
          {hasRecommendations && (
            <div className="space-y-8 md:space-y-12">
              {featuredPrompts.length > 0 && (
                <div className="space-y-6 md:space-y-8">
                  <div className="glass-card p-6 md:p-10 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
                          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Trending Now</h2>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Other Community Favorites</p>
                      </div>
                      <Link
                        href={collectionHref}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 hover:tracking-[0.3em] transition-all flex items-center gap-2"
                      >
                        Browse All <ArrowLeft size={14} className="rotate-180" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:gap-6 md:grid-cols-3">
                    {featuredPrompts.map(featured => (
                      <Link
                        key={featured.slug}
                        href={`${detailBasePath}/${featured.slug}`}
                        className="glass-inset p-5 md:p-6 rounded-2xl group hover:bg-primary-500/5 transition-all"
                      >
                        <div className="space-y-4">
                          <span className="text-[9px] font-black uppercase tracking-widest text-primary-500">{featured.tool}</span>
                          <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase leading-tight group-hover:text-white transition-colors">
                            {featured.title}
                          </h3>
                          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                            &quot;{createPromptPreview(featured.promptContent, 80)}&quot;
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {(recommendedTags.length > 0 || recommendedTools.length > 0) && (
                <div className="grid gap-6 lg:grid-cols-3">
                  {recommendedTags.length > 0 && (
                    <div className="glass-card p-6 md:p-10 lg:col-span-2 space-y-6 md:space-y-8">
                      <div className="space-y-2">
                        <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Popular Clusters</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Explore by Category</p>
                      </div>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {recommendedTags.map(({ tag, count }) => (
                          <Link
                            key={tag}
                            href={buildCollectionLink('tag', tag)}
                            className="glass-button px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all"
                          >
                            <span>#{tag}</span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-500/10 text-[9px]">{count}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {recommendedTools.length > 0 && (
                    <div className="glass-card p-6 md:p-10 space-y-6 md:space-y-8">
                      <div className="space-y-2">
                        <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Tool Shortcuts</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Access</p>
                      </div>
                      <div className="space-y-3">
                        {recommendedTools.map(({ tool, count }) => (
                          <Link
                            key={tool}
                            href={buildCollectionLink('tool', tool)}
                            className="w-full flex items-center justify-between p-4 rounded-xl glass-inset group hover:bg-primary-500/5 transition-all border border-transparent hover:border-primary-500/20"
                          >
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">
                              {tool}
                            </span>
                            <span className="px-2 py-0.5 rounded-md glass-button text-[9px] font-black text-slate-400">
                              {count}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
