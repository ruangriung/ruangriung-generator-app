'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface GoogleAdProps {
  className?: string;
}

export default function GoogleAd({ className }: GoogleAdProps) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense initialization error', error);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6394253519537490"
        data-ad-slot="1809562266"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
