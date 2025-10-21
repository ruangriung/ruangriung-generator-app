
'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Prompt } from '../../lib/prompts';
import Link from 'next/link';
import PromptSubmissionTrigger from '../../components/PromptSubmissionTrigger';
import Pagination from '../../components/Pagination';
import { ArrowLeft, Filter, Search, XCircle } from 'lucide-react';
import { usePromptSuggestions } from './usePromptSuggestions';

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
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-center">
        <Link
          href={effectiveBackHref}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
        >
          <ArrowLeft size={18} />
          <span>{effectiveBackLabel}</span>
        </Link>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">{effectiveTitle}</h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{effectiveDescription}</p>
        {showSubmissionTrigger && (
          <PromptSubmissionTrigger
            className="mt-6 px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300 shadow-lg"
            onSuccess={handlePromptCreated}
          />
        )}
      </div>

      <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              <Filter className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Temukan Prompt yang Tepat</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gunakan pencarian, filter tag, dan alat untuk mempersempit pilihan Anda.
              </p>
            </div>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 rounded-full border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <XCircle className="h-4 w-4" />
              Atur Ulang
            </button>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="md:col-span-2 lg:col-span-2">
            <label htmlFor="prompt-search" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Kata Kunci
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                id="prompt-search"
                type="text"
                placeholder="Cari judul, penulis, atau isi prompt..."
                value={searchTerm}
                onChange={e => handleSearchChange(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/40"
              />
              {shouldShowSuggestions && (
                <ul className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
                  {suggestions.map(suggestion => (
                    <li key={`${suggestion.type}-${suggestion.value}`} className="border-b border-gray-100 last:border-0 dark:border-gray-700">
                      <button
                        type="button"
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                        onMouseDown={event => {
                          event.preventDefault();
                          handleSuggestionSelect(suggestion.value);
                        }}
                      >
                        <div className="font-medium text-gray-800 dark:text-gray-100">
                          {highlightMatches(suggestion.value, searchTerm)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {suggestion.type === 'title' ? 'Judul' : 'Penulis'} • {suggestion.occurrences} kecocokan
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="prompt-tag" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Tag
            </label>
            <select
              id="prompt-tag"
              value={selectedTag}
              onChange={e => applyTagFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/40"
            >
              <option value="">Semua Tag</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="prompt-tool" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Alat
            </label>
            <select
              id="prompt-tool"
              value={selectedTool}
              onChange={e => applyToolFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/40"
            >
              <option value="">Semua Alat</option>
              {allTools.map(tool => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div ref={promptListRef} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedPrompts.map((prompt: Prompt) => (
          <div
            key={prompt.id}
            className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700"
          >
            <Link href={`${effectiveBasePath}/${prompt.slug}`} className="flex-1">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {highlightMatches(prompt.title, searchTerm)}
              </h5>
              <p className="font-normal text-gray-500 dark:text-gray-400">
                Oleh{' '}
                {prompt.link ? (
                  <a
                    href={prompt.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {highlightMatches(prompt.author, searchTerm)}
                  </a>
                ) : prompt.facebook ? (
                  <a
                    href={prompt.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {highlightMatches(prompt.author, searchTerm)}
                  </a>
                ) : (
                  <>{highlightMatches(prompt.author, searchTerm)}</>
                )}
              </p>
              {(prompt.link || prompt.facebook) && (
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                  {prompt.link && (
                    <a
                      href={prompt.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Website
                    </a>
                  )}
                  {prompt.facebook && (
                    <a
                      href={prompt.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Facebook
                    </a>
                  )}
                </div>
              )}
              <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                Tanggal: {new Date(prompt.date).toLocaleDateString('id-ID')}
              </p>
              <p className="mb-4 font-normal text-gray-600 dark:text-gray-300">
                Tool: <strong>{highlightMatches(prompt.tool, searchTerm)}</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}


      {(featuredPrompts.length > 0 || recommendedTags.length > 0 || recommendedTools.length > 0) && (
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
                <button
                  type="button"
                  onClick={() => {
                    hasInteractedWithPaginationRef.current = true;
                    setCurrentPage(1);
                    scrollToPromptListTop();
                  }}
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:text-blue-400"
                >
                  Lihat semua prompt
                </button>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {featuredPrompts.map(prompt => (
                  <Link
                    key={prompt.id}
                    href={`${effectiveBasePath}/${prompt.slug}`}
                    className="group flex h-full flex-col justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-blue-200 hover:bg-white hover:shadow-md dark:border-gray-800 dark:bg-gray-800/60 dark:hover:border-blue-700 dark:hover:bg-gray-800"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{prompt.tool}</span>
                        <span>{new Date(prompt.date).toLocaleDateString('id-ID')}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-300">
                        {highlightMatches(prompt.title, searchTerm)}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-4 dark:text-gray-300">
                        {highlightMatches(createPromptPreview(prompt.promptContent), searchTerm)}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {prompt.tags.map(tag => (
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
                  Pilih salah satu tag berikut untuk langsung memfilter daftar prompt dan menemukan inspirasi yang sedang ramai digunakan.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {recommendedTags.map(({ tag, count }) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => applyTagFilter(tag)}
                      className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-800 shadow-sm transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-blue-700 dark:bg-blue-900/60 dark:text-blue-100 dark:hover:bg-blue-900"
                    >
                      <span>#{tag}</span>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                        {count}
                      </span>
                    </button>
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
                    Klik untuk melihat koleksi prompt terbaik berdasarkan alat populer pilihan komunitas.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {recommendedTools.map(({ tool, count }) => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => applyToolFilter(tool)}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <span>{tool}</span>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                          {count}
                        </span>
                      </button>
                    ))}
                    {recommendedTools.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">Alat populer akan muncul setelah data tersedia.</p>
                    )}
                  </div>
                </div>
                <div className="rounded-lg border border-dashed border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Tips eksplorasi</p>
                  <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>• Kombinasikan pencarian kata kunci dengan filter tag untuk hasil yang lebih presisi.</li>
                    <li>• Manfaatkan panel saran otomatis ketika mengetik untuk menemukan judul atau kreator serupa.</li>
                    <li>• Buka halaman detail prompt untuk menyalin instruksi lengkap dan pelajari variasi outputnya.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
