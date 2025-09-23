const safeToISODate = (date: Date | null | undefined): string | null => {
  if (!date) {
    return null;
  }

  const time = date.getTime();

  if (Number.isNaN(time)) {
    return null;
  }

  return date.toISOString().split('T')[0];
};

export const coerceDateString = (value: unknown): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    return safeToISODate(value);
  }

  if (typeof value === 'number') {
    return coerceDateString(new Date(value));
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    const parsed = new Date(trimmed);

    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return safeToISODate(parsed);
  }

  return null;
};

export const resolveDateString = (
  value: unknown,
  ...fallbacks: (Date | null | undefined)[]
): string => {
  const normalized = coerceDateString(value);

  if (normalized) {
    return normalized;
  }

  for (const fallback of fallbacks) {
    const fallbackNormalized = coerceDateString(fallback);

    if (fallbackNormalized) {
      return fallbackNormalized;
    }
  }

  const now = new Date();
  return safeToISODate(now) ?? now.toISOString().split('T')[0];
};

export const formatDateForDisplay = (
  value: string | null | undefined,
  locale = 'id-ID',
  fallback = 'Tanggal tidak tersedia'
): string => {
  if (!value) {
    return fallback;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }

  return parsed.toLocaleDateString(locale);
};

export const toISODateString = (date: Date): string => {
  return resolveDateString(date);
};
