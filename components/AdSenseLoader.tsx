'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { ADSENSE_PUBLISHER_ID } from '@/lib/adsense';

const CONSENT_STORAGE_KEY = 'cookie_consent';

type ConsentEvent = CustomEvent<boolean>;

export default function AdSenseLoader() {
  const [shouldLoadScript, setShouldLoadScript] = useState(false);

  useEffect(() => {
    if (!ADSENSE_PUBLISHER_ID) {
      return;
    }

    const updateConsent = () => {
      try {
        const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
        setShouldLoadScript(stored === 'true');
      } catch (error) {
        console.warn('Tidak dapat membaca status persetujuan cookie:', error);
        setShouldLoadScript(false);
      }
    };

    updateConsent();

    const handleConsentChange = (event: Event) => {
      const consentEvent = event as ConsentEvent;
      if (typeof consentEvent.detail === 'boolean') {
        setShouldLoadScript(consentEvent.detail);
      } else {
        updateConsent();
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === CONSENT_STORAGE_KEY) {
        updateConsent();
      }
    };

    window.addEventListener('cookie_consent_change', handleConsentChange as EventListener);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('cookie_consent_change', handleConsentChange as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  if (!ADSENSE_PUBLISHER_ID || !shouldLoadScript) {
    return null;
  }

  return (
    <Script
      id="adsbygoogle-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
