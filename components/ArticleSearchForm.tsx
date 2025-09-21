'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

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
    router.push(destination);
  };

  const handleClear = () => {
    setQuery('');
    router.push(normalizedTargetPath);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full flex-col items-center gap-3 sm:flex-row sm:items-stretch ${className}`.trim()}
      role="search"
    >
      <div className="relative w-full sm:flex-1">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-10 text-gray-900 shadow-sm transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-purple-400"
          autoFocus={autoFocus}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            aria-label="Bersihkan pencarian"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 sm:w-auto"
      >
        Cari
      </button>
    </form>
  );
}
