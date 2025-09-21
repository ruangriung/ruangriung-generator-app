'use client';

import { FormEvent, useEffect, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Search, X } from 'lucide-react';

interface ArticleSearchFormProps {
  targetPath?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1);
  }
  return path;
}

export default function ArticleSearchForm({
  targetPath = '/artikel',
  placeholder = 'Cari artikel, topik, atau tag...',
  className = '',
  autoFocus = false,
}: ArticleSearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const normalizedTargetPath = useMemo(() => normalizePath(targetPath), [targetPath]);
  const normalizedPathname = useMemo(() => normalizePath(pathname), [pathname]);
  const isOnTargetPath = normalizedPathname === normalizedTargetPath;

  const [query, setQuery] = useState(() => (isOnTargetPath ? searchParams.get('q') ?? '' : ''));

  useEffect(() => {
    if (isOnTargetPath) {
      setQuery(searchParams.get('q') ?? '');
    }
  }, [isOnTargetPath, searchParams]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    const params = new URLSearchParams();
    if (trimmedQuery) {
      params.set('q', trimmedQuery);
    }

    const queryString = params.toString();
    const destination = queryString ? `${normalizedTargetPath}?${queryString}` : normalizedTargetPath;
    startTransition(() => {
      router.push(destination);
    });
  };

  const handleClear = () => {
    setQuery('');
    startTransition(() => {
      router.push(normalizedTargetPath);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`group relative w-full rounded-2xl border border-gray-200 bg-white/80 p-4 shadow-sm transition-all hover:shadow-md focus-within:border-purple-500 focus-within:shadow-lg focus-within:ring-2 focus-within:ring-purple-200/80 dark:border-gray-700 dark:bg-gray-900/80 dark:shadow-black/20 ${className}`.trim()}
      role="search"
      aria-busy={isPending}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full flex-1">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-purple-500" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-gray-200 bg-white/90 py-3 pl-12 pr-12 text-base text-gray-900 shadow-inner transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-100 dark:focus:border-purple-400"
            autoFocus={autoFocus}
          />
          {isPending && (
            <Loader2
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-purple-500"
              aria-hidden="true"
            />
          )}
          {query && !isPending && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label="Bersihkan pencarian"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 dark:focus:ring-offset-gray-900 sm:w-auto"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              Memproses...
            </>
          ) : (
            <>
              <Search size={18} aria-hidden="true" />
              Cari
            </>
          )}
        </button>
      </div>
    </form>
  );
}
