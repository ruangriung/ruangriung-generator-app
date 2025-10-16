export type AnalyticsEventPayload = Record<string, unknown> | undefined;

type WindowWithGtag = Window & {
  gtag?: (...args: unknown[]) => void;
};

const isDevelopment = process.env.NODE_ENV !== 'production';

export const trackAnalyticsEvent = (eventName: string, payload?: Record<string, unknown>) => {
  if (typeof window === 'undefined') {
    return;
  }

  const { gtag } = window as WindowWithGtag;

  if (typeof gtag !== 'function') {
    if (isDevelopment) {
      console.debug('[analytics] gtag unavailable, skipped event', eventName, payload);
    }
    return;
  }

  gtag('event', eventName, payload ?? {});
};

export const BUILD_APP_EVENT_CATEGORY = 'build_app_prompts';
