'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { ADSENSE_PUBLISHER_ID } from '@/lib/adsense';

export default function AdSenseLoader() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!Array.isArray(window.adsbygoogle)) {
      window.adsbygoogle = [];
    }
  }, []);

  if (!ADSENSE_PUBLISHER_ID) {
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
