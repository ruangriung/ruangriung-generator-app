
'use client';

import { useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type PaginationItem = number | 'dots';

const SIBLING_COUNT = 1;

const range = (start: number, end: number) => {
  if (end < start) {
    return [] as number[];
  }

  const length = end - start + 1;
  return Array.from({ length }, (_, index) => start + index);
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const paginationItems = useMemo<PaginationItem[]>(() => {
    if (totalPages <= 1) {
      return [1];
    }

    const totalNumbers = SIBLING_COUNT * 2 + 5;

    if (totalPages <= totalNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - SIBLING_COUNT, 2);
    const rightSiblingIndex = Math.min(currentPage + SIBLING_COUNT, totalPages - 1);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const items: PaginationItem[] = [1];

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = SIBLING_COUNT * 2 + 3;
      const leftRange = range(2, leftItemCount + 1);
      items.push(...leftRange, 'dots');
    } else if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = SIBLING_COUNT * 2 + 3;
      const rightRange = range(totalPages - rightItemCount, totalPages - 1);
      items.push('dots', ...rightRange);
    } else if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      items.push('dots', ...middleRange, 'dots');
    } else {
      items.push(...range(2, totalPages - 1));
    }

    items.push(totalPages);

    return items;
  }, [currentPage, totalPages]);

  return (
    <nav className="flex justify-center mt-12">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
          >
            Previous
          </button>
        </li>
        {paginationItems.map((item, index) => (
          <li key={typeof item === 'number' ? `page-${item}` : `dots-${index}`}>
            {typeof item === 'number' ? (
              <button
                onClick={() => onPageChange(item)}
                className={`px-3 py-2 leading-tight ${
                  currentPage === item
                    ? 'text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
              >
                {item}
              </button>
            ) : (
              <span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                ...
              </span>
            )}
          </li>
        ))}
        <li>
          <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
