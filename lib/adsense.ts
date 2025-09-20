export const DEFAULT_ADSENSE_PUBLISHER_ID = 'ca-pub-1439044724518446';

export const ADSENSE_PUBLISHER_ID =
  process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? DEFAULT_ADSENSE_PUBLISHER_ID;

const sanitizeAdUnit = (value?: string | null) => value?.trim() ?? '';

const resolveAdSlotId = (
  ...candidates: Array<string | undefined | null>
): string => {
  for (const candidate of candidates) {
    const sanitized = sanitizeAdUnit(candidate);
    if (sanitized) {
      return sanitized;
    }
  }

  return '';
};

const DEFAULT_PRIMARY_AD_SLOT = '6897039624';
const DEFAULT_SECONDARY_AD_SLOT = '5961316189';
const DEFAULT_TERTIARY_AD_SLOT = '7992484013';

export const ARTICLE_LIST_AD_SLOT = resolveAdSlotId(
  process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT_ARTICLE_LIST,
  process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT_ID_3,
  DEFAULT_PRIMARY_AD_SLOT,
);

export const ARTICLE_INLINE_AD_SLOT = resolveAdSlotId(
  process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT_ARTICLE_INLINE,
  ARTICLE_LIST_AD_SLOT,
  DEFAULT_TERTIARY_AD_SLOT,
  DEFAULT_PRIMARY_AD_SLOT,
);

export const ARTICLE_BOTTOM_AD_SLOT = resolveAdSlotId(
  process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT_ARTICLE_BOTTOM,
  DEFAULT_SECONDARY_AD_SLOT,
  DEFAULT_PRIMARY_AD_SLOT,
);

export const PROMPT_TOP_AD_SLOT = resolveAdSlotId(
  process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT_PROMPT_TOP,
  ARTICLE_LIST_AD_SLOT,
  DEFAULT_PRIMARY_AD_SLOT,
);

export const PROMPT_BOTTOM_AD_SLOT = resolveAdSlotId(
  process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT_PROMPT_BOTTOM,
  DEFAULT_SECONDARY_AD_SLOT,
  DEFAULT_PRIMARY_AD_SLOT,
);

