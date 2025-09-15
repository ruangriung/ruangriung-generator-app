'use client';

import { useMemo } from 'react';
import { Prompt } from '../../lib/prompts';

export type SuggestionType = 'title' | 'author';

export interface PromptSuggestion {
  type: SuggestionType;
  value: string;
  occurrences: number;
  matchIndex: number;
}

const normalizeKey = (value: string) => value.toLowerCase().trim();

export function usePromptSuggestions(
  prompts: Prompt[],
  searchTerm: string,
  maxSuggestions = 6,
): PromptSuggestion[] {
  return useMemo(() => {
    const trimmedTerm = searchTerm.trim();
    if (!trimmedTerm) {
      return [];
    }

    const lowerTerm = trimmedTerm.toLowerCase();
    const suggestionMap = new Map<string, PromptSuggestion>();

    const registerSuggestion = (type: SuggestionType, value: string, matchIndex: number) => {
      const key = `${type}-${normalizeKey(value)}`;
      const existing = suggestionMap.get(key);

      if (existing) {
        existing.occurrences += 1;
        existing.matchIndex = Math.min(existing.matchIndex, matchIndex);
      } else {
        suggestionMap.set(key, {
          type,
          value,
          occurrences: 1,
          matchIndex,
        });
      }
    };

    prompts.forEach(prompt => {
      const titleLower = prompt.title.toLowerCase();
      const authorLower = prompt.author.toLowerCase();

      if (titleLower.includes(lowerTerm)) {
        registerSuggestion('title', prompt.title, titleLower.indexOf(lowerTerm));
      }

      if (authorLower.includes(lowerTerm)) {
        registerSuggestion('author', prompt.author, authorLower.indexOf(lowerTerm));
      }
    });

    return Array.from(suggestionMap.values())
      .sort((a, b) => {
        if (a.matchIndex !== b.matchIndex) {
          return a.matchIndex - b.matchIndex;
        }

        if (a.occurrences !== b.occurrences) {
          return b.occurrences - a.occurrences;
        }

        return a.value.localeCompare(b.value, 'id');
      })
      .slice(0, maxSuggestions);
  }, [prompts, searchTerm, maxSuggestions]);
}
