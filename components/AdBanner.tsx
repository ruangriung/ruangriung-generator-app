'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ADSENSE_PUBLISHER_ID } from '@/lib/adsense';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const isProduction = process.env.NODE_ENV === 'production';

const defaultAdStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  minHeight: '120px',
};

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
  const [isInView, setIsInView] = useState(false);
  const [hasRequestedAd, setHasRequestedAd] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

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
    if (typeof window === 'undefined') {
      return;
    }

    const isReady = () => {
      const ads = window.adsbygoogle;
      return Array.isArray(ads) && typeof ads.push === 'function';
    };

    if (isReady()) {
      setScriptReady(true);
      return;
    }

    const interval = window.setInterval(() => {
      if (isReady()) {
        setScriptReady(true);
        window.clearInterval(interval);
      }
    }, 400);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setHasRequestedAd(false);
  }, [dataAdSlot]);

  useEffect(() => {
    if (!isInView || hasRequestedAd || !scriptReady) {
      return;
    }

    if (!ADSENSE_PUBLISHER_ID) {
      console.warn('AdSense tidak dimuat karena ID penayang tidak ditemukan.');
      return;
    }

    if (!dataAdSlot) {
      console.warn('AdSense tidak dimuat karena slot iklan belum ditentukan.');
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setHasRequestedAd(true);
    } catch (error) {
      console.error('Gagal memuat iklan AdSense:', error);
    }
  }, [isInView, hasRequestedAd, scriptReady, dataAdSlot]);

  if (!ADSENSE_PUBLISHER_ID) {
    return null;
  }

  const mergedStyle: CSSProperties = {
    ...defaultAdStyle,
    ...(style ?? {}),
  };

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
