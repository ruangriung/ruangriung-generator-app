const sanitizeUrl = (value?: string | null) => value?.trim() ?? '';

const DEFAULT_ARTICLE_SUBMISSION_URL =
  'mailto:admin@ruangriung.my.id?subject=Kirim%20Artikel%20untuk%20RuangRiung';

export const ARTICLE_SUBMISSION_URL = (() => {
  const envUrl = sanitizeUrl(process.env.NEXT_PUBLIC_ARTICLE_SUBMISSION_URL);
  return envUrl || DEFAULT_ARTICLE_SUBMISSION_URL;
})();
