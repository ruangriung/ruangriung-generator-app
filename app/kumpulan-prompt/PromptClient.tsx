
'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Prompt } from '../../lib/prompts';
import Link from 'next/link';
import PromptSubmissionTrigger from '../../components/PromptSubmissionTrigger';
import Pagination from '../../components/Pagination';
import AdBanner from '../../components/AdBanner';
import { PROMPT_BOTTOM_AD_SLOT, PROMPT_TOP_AD_SLOT } from '../../lib/adsense';
import { ArrowLeft } from 'lucide-react';
import { usePromptSuggestions } from './usePromptSuggestions';
import { formatDateForDisplay } from '@/lib/date';

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
}

export default function PromptClient({ prompts }: PromptClientProps) {
  const [promptList, setPromptList] = useState(() => sortPrompts(prompts));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promptListRef = useRef<HTMLDivElement | null>(null);
  const hasInteractedWithPaginationRef = useRef(false);
  const topAdSlot = PROMPT_TOP_AD_SLOT;
  const bottomAdSlot = PROMPT_BOTTOM_AD_SLOT;

  useEffect(() => {
    setPromptList(sortPrompts(prompts));
  }, [prompts]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    promptList.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [promptList]);

  const suggestions = usePromptSuggestions(promptList, searchTerm);

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
  }, [searchTerm, selectedTag, scrollToPromptListTop]);

  useEffect(() => () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
  }, []);

  const upsertPrompt = useCallback((nextPrompt: Prompt) => {
    setPromptList(previous => {
      const filtered = previous.filter(prompt => prompt.slug !== nextPrompt.slug);
      return sortPrompts([nextPrompt, ...filtered]);
    });
  }, []);

  const handlePromptCreated = useCallback(
    (nextPrompt: Prompt) => {
      upsertPrompt(nextPrompt);
      setCurrentPage(1);
      hasInteractedWithPaginationRef.current = true;
      scrollToPromptListTop();
    },
    [scrollToPromptListTop, upsertPrompt],
  );

  const handlePromptUpdated = useCallback(
    (nextPrompt: Prompt) => {
      upsertPrompt(nextPrompt);
    },
    [upsertPrompt],
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

      return matchesSearch && matchesTag;
    });
  }, [searchTerm, selectedTag, promptList]);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
        >
          <ArrowLeft size={18} />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">Kumpulan Prompt</h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Jelajahi, gunakan, dan bagikan prompt kreatif untuk berbagai model AI.</p>
        <PromptSubmissionTrigger
          className="mt-6 px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300 shadow-lg"
          onSuccess={handlePromptCreated}
        />
      </div>

      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Cari berdasarkan judul, penulis, atau isi..."
              value={searchTerm}
              onChange={e => handleSearchChange(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="flex-grow w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
            {shouldShowSuggestions && (
              <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                {suggestions.map(suggestion => (
                  <li key={`${suggestion.type}-${suggestion.value}`} className="border-b border-gray-100 last:border-0 dark:border-gray-700">
                    <button
                      type="button"
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
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
          <select
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value)}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Semua Tag</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {topAdSlot && (
        <div className="my-8">
          <AdBanner key="prompt-top-ad" dataAdSlot={topAdSlot} />
        </div>
      )}

      <div ref={promptListRef} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedPrompts.map((prompt: Prompt) => (
          <div
            key={prompt.id}
            className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700"
          >
            <Link href={`/kumpulan-prompt/${prompt.slug}`} className="flex-1">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {highlightMatches(prompt.title, searchTerm)}
              </h5>
              <p className="font-normal text-gray-500 dark:text-gray-400">
                Oleh{' '}
                {prompt.link || prompt.facebook ? (
                  <a
                    href={prompt.link || prompt.facebook}
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
              <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                Tanggal: {formatDateForDisplay(prompt.date)}
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
            <div className="mt-4 flex justify-end">
              <PromptSubmissionTrigger
                mode="edit"
                prompt={prompt}
                onSuccess={handlePromptUpdated}
                label="Edit Prompt"
                className="rounded-md border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-blue-400 dark:text-blue-200 dark:hover:bg-blue-900/30"
              />
            </div>
          </div>
        ))}
      </div>

      {bottomAdSlot && (
        <div className="my-8">
          <AdBanner
            key={`prompt-bottom-ad-${currentPage}`}
            dataAdSlot={bottomAdSlot}
          />
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

    </div>
  );
}
