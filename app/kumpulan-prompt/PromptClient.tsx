
'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Prompt } from '../../lib/prompts';
import Link from 'next/link';
import PromptSubmissionTrigger from '../../components/PromptSubmissionTrigger';
import Pagination from '../../components/Pagination';

import { ArrowLeft, Filter, Search, XCircle, ChevronDown, Sparkles } from 'lucide-react';
import { usePromptSuggestions } from './usePromptSuggestions';
import GoogleAd from '@/components/GoogleAd';

const PROMPTS_PER_PAGE = 9;

const sortPrompts = (items: Prompt[]) =>
  items.slice().sort((a, b) => Number(b.id) - Number(a.id));

const escapeRegExp = (value: string) =>
  value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\$&');

const highlightMatches = (text: string, term: string) => {
  if (!term.trim()) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
  const parts = text.split(regex);
  const lowerTerm = term.toLowerCase();

  return parts.map((part, index) =>
    part.toLowerCase() === lowerTerm ? (
      <mark key={`${part}-${index}`} className="bg-yellow-200 dark:bg-yellow-500/40">
        {part}
      </mark>
    ) : (
      <Fragment key={`${part}-${index}`}>{part}</Fragment>
    ),
  );
};

interface PromptClientProps {
  prompts: Prompt[];
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  basePath?: string;
  showSubmissionTrigger?: boolean;
}

export default function PromptClient({
  prompts,
  title,
  description,
  backHref,
  backLabel,
  basePath,
  showSubmissionTrigger = true,
}: PromptClientProps) {
  const [promptList, setPromptList] = useState(() => sortPrompts(prompts));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedTool, setSelectedTool] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const blurTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);
  const promptListRef = useRef<HTMLDivElement | null>(null);
  const hasInteractedWithPaginationRef = useRef(false);
  const effectiveTitle = title ?? 'Kumpulan Prompt';
  const effectiveDescription = description ??
    'Jelajahi, gunakan, dan bagikan prompt kreatif untuk berbagai model AI.';
  const effectiveBackHref = backHref ?? '/';
  const effectiveBackLabel = backLabel ?? 'Kembali ke Beranda';
  const effectiveBasePath = basePath ?? '/kumpulan-prompt';

  useEffect(() => {
    setPromptList(sortPrompts(prompts));
  }, [prompts]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    promptList.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort((a, b) => a.localeCompare(b, 'id'));
  }, [promptList]);

  const allTools = useMemo(() => {
    const tools = new Set<string>();
    promptList.forEach(p => {
      if (p.tool) {
        tools.add(p.tool);
      }
    });
    return Array.from(tools).sort((a, b) => a.localeCompare(b, 'id'));
  }, [promptList]);

  const recommendedTags = useMemo(() => {
    const tagCount = new Map<string, number>();

    promptList.forEach(prompt => {
      prompt.tags.forEach(tag => {
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
  }, [promptList]);

  const recommendedTools = useMemo(() => {
    const toolCount = new Map<string, number>();

    promptList.forEach(prompt => {
      if (prompt.tool) {
        toolCount.set(prompt.tool, (toolCount.get(prompt.tool) ?? 0) + 1);
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
  }, [promptList]);

  const featuredPrompts = useMemo(() => promptList.slice(0, 3), [promptList]);

  const createPromptPreview = useCallback((value: string, limit = 160) => {
    const normalized = value.replace(/\s+/g, ' ').trim();

    if (normalized.length <= limit) {
      return normalized;
    }

    return `${normalized.slice(0, limit).trim()}…`;
  }, []);

  const suggestions = usePromptSuggestions(promptList, searchTerm);

  const hasActiveFilters = useMemo(
    () => Boolean(searchTerm.trim() || selectedTag || selectedTool),
    [searchTerm, selectedTag, selectedTool],
  );

  const scrollToPromptListTop = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const element = promptListRef.current;

    if (!element) {
      return;
    }

    window.requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  useEffect(() => {
    setCurrentPage(1);

    if (hasInteractedWithPaginationRef.current) {
      scrollToPromptListTop();
    }
  }, [searchTerm, selectedTag, selectedTool, scrollToPromptListTop]);

  useEffect(() => () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
  }, []);

  const handlePromptCreated = useCallback(
    (nextPrompt: Prompt) => {
      setPromptList(previous => {
        const filtered = previous.filter(prompt => prompt.slug !== nextPrompt.slug);
        return sortPrompts([nextPrompt, ...filtered]);
      });
      setCurrentPage(1);
      hasInteractedWithPaginationRef.current = true;
      scrollToPromptListTop();
    },
    [scrollToPromptListTop],
  );

  const filteredPrompts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return promptList.filter(prompt => {
      const matchesSearch = normalizedSearch
        ? prompt.title.toLowerCase().includes(normalizedSearch) ||
          prompt.author.toLowerCase().includes(normalizedSearch) ||
          prompt.promptContent.toLowerCase().includes(normalizedSearch)
        : true;

      const matchesTag = selectedTag ? prompt.tags.includes(selectedTag) : true;
      const matchesTool = selectedTool ? prompt.tool === selectedTool : true;

      return matchesSearch && matchesTag && matchesTool;
    });
  }, [searchTerm, selectedTag, selectedTool, promptList]);

  const paginatedPrompts = useMemo(() => {
    const startIndex = (currentPage - 1) * PROMPTS_PER_PAGE;
    return filteredPrompts.slice(startIndex, startIndex + PROMPTS_PER_PAGE);
  }, [currentPage, filteredPrompts]);

  const totalPages = Math.ceil(filteredPrompts.length / PROMPTS_PER_PAGE);
  const shouldShowSuggestions = showSuggestions && suggestions.length > 0;

  const handleInputFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }

    if (searchTerm.trim()) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setShowSuggestions(false);
    }, 120);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(!!value.trim());
  };

  const handleSuggestionSelect = (value: string) => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }

    setSearchTerm(value);
    setShowSuggestions(false);
  };

  const handlePageChange = (page: number) => {
    hasInteractedWithPaginationRef.current = true;
    setCurrentPage(page);
    scrollToPromptListTop();
  };

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedTag('');
    setSelectedTool('');
    setShowSuggestions(false);
    hasInteractedWithPaginationRef.current = true;
    setCurrentPage(1);
    scrollToPromptListTop();
  }, [scrollToPromptListTop]);

  const applyTagFilter = useCallback(
    (value: string) => {
      setSelectedTag(current => {
        const nextValue = current === value ? '' : value;

        if (current !== nextValue) {
          hasInteractedWithPaginationRef.current = true;
          setCurrentPage(1);
          scrollToPromptListTop();
        }

        return nextValue;
      });
    },
    [scrollToPromptListTop],
  );

  const applyToolFilter = useCallback(
    (value: string) => {
      setSelectedTool(current => {
        const nextValue = current === value ? '' : value;

        if (current !== nextValue) {
          hasInteractedWithPaginationRef.current = true;
          setCurrentPage(1);
          scrollToPromptListTop();
        }

        return nextValue;
      });
    },
    [scrollToPromptListTop],
  );

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-slate-50 dark:bg-[#030712] -z-20" />
      <div className="fixed inset-0 bg-mesh-gradient opacity-40 dark:opacity-20 -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <Link
              href={effectiveBackHref}
              className="glass-button px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 text-slate-600 dark:text-slate-400"
            >
              <ArrowLeft size={16} />
              <span>{effectiveBackLabel}</span>
            </Link>
            {showSubmissionTrigger && (
              <PromptSubmissionTrigger
                className="glass-button !bg-primary-500/10 hover:!bg-primary-500 !text-primary-500 hover:!text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-500/20 transition-all active:scale-95"
                onSuccess={handlePromptCreated}
              />
            )}
          </div>

          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-tight">
              {effectiveTitle.split(' ').map((word, i) => i === effectiveTitle.split(' ').length - 1 ? <span key={i} className="text-primary-500">{word}</span> : word + ' ')}
            </h1>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 max-w-3xl mx-auto">
              {effectiveDescription}
            </p>
          </div>

          {/* Search & Filters */}
          <div className="glass-card p-6 md:p-10 space-y-6 md:space-y-8 shadow-xl relative z-[50]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 pb-6 border-b border-slate-200/10 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                  <Filter size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Precision Search</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Temukan Prompt yang Sempurna</p>
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="glass-button px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-2"
                >
                  <XCircle size={14} />
                  Reset Filter
                </button>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="md:col-span-2 lg:col-span-2 space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kata Kunci</label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Cari judul, penulis, atau isi prompt..."
                    value={searchTerm}
                    onChange={e => handleSearchChange(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="w-full h-14 pl-12 pr-4 rounded-2xl glass-inset bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                  />
                  {shouldShowSuggestions && (
                    <div className="absolute left-0 right-0 top-full mt-3 z-[100] overflow-hidden rounded-2xl glass-card border border-white/10 shadow-2xl">
                      {suggestions.map(suggestion => (
                        <button
                          key={`${suggestion.type}-${suggestion.value}`}
                          type="button"
                          className="w-full px-6 py-4 text-left border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group"
                          onMouseDown={event => {
                            event.preventDefault();
                            handleSuggestionSelect(suggestion.value);
                          }}
                        >
                          <div className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-white transition-colors">
                            {highlightMatches(suggestion.value, searchTerm)}
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white/70 mt-1">
                            {suggestion.type === 'title' ? 'Judul' : 'Penulis'} • {suggestion.occurrences} matches
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kategori Tag</label>
                <div className="relative">
                  <select
                    value={selectedTag}
                    onChange={e => applyTagFilter(e.target.value)}
                    className="w-full h-14 px-5 pr-12 rounded-2xl glass-inset bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary-500/50 transition-all appearance-none border-2 border-transparent focus:border-primary-500/30"
                  >
                    <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Semua Tag</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{tag}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Model AI</label>
                <div className="relative">
                  <select
                    value={selectedTool}
                    onChange={e => applyToolFilter(e.target.value)}
                    className="w-full h-14 px-5 pr-12 rounded-2xl glass-inset bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary-500/50 transition-all appearance-none border-2 border-transparent focus:border-primary-500/30"
                  >
                    <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Semua Alat</option>
                    {allTools.map(tool => (
                      <option key={tool} value={tool} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{tool}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Prompt Grid */}
          <div ref={promptListRef} className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {paginatedPrompts.map((prompt: Prompt) => (
              <div key={prompt.id} className="group relative">
                <Link href={`${effectiveBasePath}/${prompt.slug}`} className="block h-full group">
                  <div className="glass-card h-full p-6 md:p-8 flex flex-col space-y-6 hover:translate-y-[-4px] transition-all duration-500 border-2 border-transparent hover:border-primary-500/30 shadow-lg hover:shadow-primary-500/10">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">
                          {prompt.tool}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          {new Date(prompt.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight uppercase group-hover:text-primary-500 transition-colors">
                        {highlightMatches(prompt.title, searchTerm)}
                      </h3>

                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Oleh{' '}
                        <span className="font-black text-slate-700 dark:text-slate-300">
                          {highlightMatches(prompt.author, searchTerm)}
                        </span>
                      </p>

                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 italic leading-relaxed">
                        &quot;{createPromptPreview(prompt.promptContent, 120)}&quot;
                      </p>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex flex-wrap gap-2">
                      {prompt.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-lg glass-inset bg-slate-500/5 text-[9px] font-black uppercase tracking-widest text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                      {prompt.tags.length > 3 && (
                        <span className="text-[9px] font-black text-slate-400 self-center">
                          +{prompt.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPrompts.length === 0 && (
            <div className="glass-card p-20 text-center space-y-6">
              <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto text-slate-400">
                <Search size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Tidak Ditemukan</h3>
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">Coba gunakan kata kunci atau filter lain</p>
              </div>
              <button onClick={handleResetFilters} className="glass-button px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-primary-500">
                Lihat Semua Prompt
              </button>
            </div>
          )}

          {/* Ads Placement */}
          <div className="pt-8">
            <div className="glass-card p-6 overflow-hidden">
              <div className="text-center mb-4">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Advertisement</span>
              </div>
              <GoogleAd className="min-h-[100px]" />
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* Sidebar-like Bottom Sections */}
          {(featuredPrompts.length > 0 || recommendedTags.length > 0 || recommendedTools.length > 0) && (
            <div className="space-y-12">
              {featuredPrompts.length > 0 && (
                <div className="glass-card p-10 space-y-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
                        <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Trending Now</h2>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Prompt Pilihan Komunitas Minggu Ini</p>
                    </div>
                    <button
                      onClick={() => {
                        handleResetFilters();
                      }}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 hover:tracking-[0.3em] transition-all flex items-center gap-2"
                    >
                      Explore Library <ArrowLeft size={14} className="rotate-180" />
                    </button>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    {featuredPrompts.map(prompt => (
                      <Link
                        key={prompt.id}
                        href={`${effectiveBasePath}/${prompt.slug}`}
                        className="glass-inset p-6 rounded-2xl group hover:bg-primary-500/5 transition-all"
                      >
                        <div className="space-y-4">
                          <span className="text-[9px] font-black uppercase tracking-widest text-primary-500">{prompt.tool}</span>
                          <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase leading-tight group-hover:text-primary-500">
                            {prompt.title}
                          </h3>
                          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-3 italic">
                            &quot;{createPromptPreview(prompt.promptContent, 80)}&quot;
                          </p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {prompt.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[8px] font-black uppercase text-slate-400">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {(recommendedTags.length > 0 || recommendedTools.length > 0) && (
                <div className="grid gap-10 lg:grid-cols-3">
                  <div className="glass-card p-10 lg:col-span-2 space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Popular Clusters</h2>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jelajahi Berdasarkan Tag Populer</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {recommendedTags.map(({ tag, count }) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => applyTagFilter(tag)}
                          className={`glass-button px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${selectedTag === tag ? 'bg-primary-500 !text-white' : 'text-slate-600 dark:text-slate-300'}`}
                        >
                          <span>#{tag}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] ${selectedTag === tag ? 'bg-white/20' : 'bg-slate-500/10'}`}>{count}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-10 space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Tool Shortcuts</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Filter By Engine</p>
                    </div>
                    <div className="space-y-3">
                      {recommendedTools.map(({ tool, count }) => (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => applyToolFilter(tool)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl glass-inset group hover:bg-primary-500/5 transition-all ${selectedTool === tool ? '!bg-primary-500/10 border-primary-500/30' : ''}`}
                        >
                          <span className={`text-[10px] font-black uppercase tracking-widest ${selectedTool === tool ? 'text-primary-500' : 'text-slate-600 dark:text-slate-300'}`}>
                            {tool}
                          </span>
                          <span className="px-2 py-0.5 rounded-md glass-button text-[9px] font-black text-slate-400">
                            {count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
