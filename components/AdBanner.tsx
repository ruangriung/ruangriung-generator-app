'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ADSENSE_PUBLISHER_ID } from '@/lib/adsense';

type AdsByGoogle = unknown[] & {
  push: (params: Record<string, unknown>) => number;
};

declare global {
  interface Window {
    adsbygoogle?: AdsByGoogle;
  }
}

const isProduction = process.env.NODE_ENV === 'production';

const defaultAdStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  minHeight: '120px',
};

const MAX_SCRIPT_CHECKS = 20;
const MAX_AD_REQUESTS = 3;
const SCRIPT_CHECK_DELAY = 500;
const AD_RETRY_DELAY = 4000;
const AD_ERROR_RETRY_DELAY = 1500;

interface AdBannerProps {
  className?: string;
  style?: CSSProperties;
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: string;
}

export const AdBanner = ({
  className = '',
  style,
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = 'true',
}: AdBannerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const adRef = useRef<HTMLInsElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const element = containerRef.current;
    if (!element) {
      setIsInView(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      {
        rootMargin: '200px',
        threshold: 0.1,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const adElement = adRef.current;
    if (!adElement) {
      return;
    }

    adElement.innerHTML = '';
    adElement.removeAttribute('data-adsbygoogle-status');
  }, [dataAdSlot]);

  useEffect(() => {
    if (typeof window === 'undefined' || !ADSENSE_PUBLISHER_ID) {
      return;
    }

    if (!dataAdSlot) {
      console.warn('AdSense tidak dimuat karena slot iklan belum ditentukan.');
      return;
    }

    if (!isInView) {
      return;
    }

    if (!window.adsbygoogle) {
      window.adsbygoogle = [] as AdsByGoogle;
    }

    const timeoutIds: number[] = [];
    let cancelled = false;
    let scriptChecks = 0;
    let adRequests = 0;

    const schedule = (callback: () => void, delay: number) => {
      const id = window.setTimeout(callback, delay);
      timeoutIds.push(id);
    };

    const resetAdElement = () => {
      const element = adRef.current;
      if (!element) {
        return;
      }

      element.innerHTML = '';
      element.removeAttribute('data-adsbygoogle-status');
      element.setAttribute('data-ad-slot', dataAdSlot);

      if (dataAdFormat) {
        element.setAttribute('data-ad-format', dataAdFormat);
      } else {
        element.removeAttribute('data-ad-format');
      }

      if (dataFullWidthResponsive) {
        element.setAttribute('data-full-width-responsive', dataFullWidthResponsive);
      } else {
        element.removeAttribute('data-full-width-responsive');
      }
    };

    const requestAd = (ads: AdsByGoogle) => {
      if (cancelled || adRequests >= MAX_AD_REQUESTS) {
        return;
      }

      const element = adRef.current;
      if (!element) {
        return;
      }

      resetAdElement();

      try {
        adRequests += 1;
        ads.push({});

        schedule(() => {
          if (cancelled) {
            return;
          }

          const status = element.dataset.adsbygoogleStatus;
          if ((!status || status === 'unfilled') && adRequests < MAX_AD_REQUESTS) {
            requestAd(ads);
          }
        }, AD_RETRY_DELAY);
      } catch (error) {
        console.error('Gagal memuat iklan AdSense:', error);
        schedule(() => {
          if (!cancelled) {
            requestAd(ads);
          }
        }, AD_ERROR_RETRY_DELAY);
      }
    };

    const ensureScriptReady = () => {
      if (cancelled) {
        return;
      }

      const ads = window.adsbygoogle;
      if (!ads || typeof ads.push !== 'function') {
        if (scriptChecks >= MAX_SCRIPT_CHECKS) {
          console.warn('Skrip AdSense belum siap setelah beberapa percobaan.');
          return;
        }

        scriptChecks += 1;
        schedule(ensureScriptReady, SCRIPT_CHECK_DELAY);
        return;
      }

      requestAd(ads);
    };

    ensureScriptReady();

    return () => {
      cancelled = true;
      timeoutIds.forEach((id) => {
        window.clearTimeout(id);
      });
    };
  }, [dataAdFormat, dataAdSlot, dataFullWidthResponsive, isInView]);

  const mergedStyle = useMemo(
    () => ({
      ...defaultAdStyle,
      ...(style ?? {}),
    }),
    [style],
  );

  if (!ADSENSE_PUBLISHER_ID) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`w-full ${className}`}
      role="region"
      aria-label="Unit iklan yang dilindungi dari klik tidak sengaja"
    >
      <div className="mx-auto max-w-xl rounded-3xl border border-gray-200/70 bg-white/70 p-4 text-left shadow-lg shadow-slate-900/5 transition-colors dark:border-gray-700/60 dark:bg-slate-900/70 dark:shadow-black/40 sm:max-w-2xl">
        <div className="rounded-2xl border border-dashed border-slate-200/80 bg-white/80 p-4 dark:border-slate-700/60 dark:bg-slate-950/40">
          <ins
            ref={adRef}
            className="adsbygoogle block w-full"
            style={mergedStyle}
            data-ad-client={ADSENSE_PUBLISHER_ID}
            data-ad-slot={dataAdSlot}
            data-ad-format={dataAdFormat}
            data-full-width-responsive={dataFullWidthResponsive}
            data-adtest={isProduction ? undefined : 'on'}
          />
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
