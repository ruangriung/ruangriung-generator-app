'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ADSENSE_PUBLISHER_ID } from '@/lib/adsense';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const CONSENT_STORAGE_KEY = 'cookie_consent';
const isProduction = process.env.NODE_ENV === 'production';

type ConsentEvent = CustomEvent<boolean>;

interface AdBannerProps {
  className?: string;
  style?: CSSProperties;
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: string;
}

export const AdBanner = ({
  className = '',
  style = { display: 'block' },
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = 'true',
}: AdBannerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasRequestedAd, setHasRequestedAd] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updateConsentFromStorage = () => {
      try {
        const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
        setHasConsent(stored === 'true');
      } catch (error) {
        console.warn('Tidak dapat membaca status persetujuan cookie:', error);
        setHasConsent(false);
      }
    };

    updateConsentFromStorage();

    const handleConsentChange = (event: Event) => {
      const consentEvent = event as ConsentEvent;
      if (typeof consentEvent.detail === 'boolean') {
        setHasConsent(consentEvent.detail);
      } else {
        updateConsentFromStorage();
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === CONSENT_STORAGE_KEY) {
        updateConsentFromStorage();
      }
    };

    window.addEventListener('cookie_consent_change', handleConsentChange as EventListener);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('cookie_consent_change', handleConsentChange as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!hasConsent) {
      setIsInView(false);
      setHasRequestedAd(false);
      setScriptReady(false);
      return;
    }

    const element = containerRef.current;
    if (!element) {
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
        threshold: 0.01,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasConsent]);

  useEffect(() => {
    if (!hasConsent || typeof window === 'undefined') {
      setScriptReady(false);
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
    }, 500);

    return () => {
      window.clearInterval(interval);
    };
  }, [hasConsent]);

  useEffect(() => {
    if (!hasConsent || !isInView || hasRequestedAd || !scriptReady) {
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
  }, [hasConsent, isInView, hasRequestedAd, scriptReady, dataAdSlot]);

  if (!ADSENSE_PUBLISHER_ID) {
    return null;
  }

  return (
    <div ref={containerRef} className={`w-full text-center ${className}`}>
      {hasConsent ? (
        <ins
          className="adsbygoogle"
          style={style}
          data-ad-client={ADSENSE_PUBLISHER_ID}
          data-ad-slot={dataAdSlot}
          data-ad-format={dataAdFormat}
          data-full-width-responsive={dataFullWidthResponsive}
          data-adtest={isProduction ? undefined : 'on'}
        />
      ) : (
        <div
          className="mx-auto flex min-h-[90px] w-full max-w-xl items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
          role="note"
        >
          Iklan akan tampil setelah Anda memberikan persetujuan cookie.
        </div>
      )}
    </div>
  );
};

export default AdBanner;
