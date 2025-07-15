// components/AdBanner.tsx
'use client';

import { useEffect } from 'react';

// Tipe ini ditambahkan agar TypeScript tidak error saat mengakses window.adsbygoogle
declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown }[];
  }
}

interface AdBannerProps {
  className?: string;
  style?: React.CSSProperties;
  dataAdSlot: string; // Prop untuk ID slot iklan
  dataAdFormat?: string;
  dataFullWidthResponsive?: string;
}

export const AdBanner = ({ 
  className = '', 
  style = { display: 'block' }, 
  dataAdSlot, // ID slot dari AdSense
  dataAdFormat = 'auto',
  dataFullWidthResponsive = 'true'
}: AdBannerProps) => {
  
  useEffect(() => {
    // Fungsi ini akan mendorong iklan untuk dimuat setiap kali komponen ditampilkan
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  // Ganti dengan Publisher ID Anda
  const YOUR_AD_CLIENT_ID = "ca-pub-1439044724518446";

  return (
    <div className={`w-full text-center ${className}`}>
      {/* Komponen <ins> ini adalah unit iklan AdSense yang sebenarnya.
        Atributnya diisi secara dinamis dari props.
      */}
      <ins 
        className="adsbygoogle"
        style={style}
        data-ad-client={YOUR_AD_CLIENT_ID}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive}
      ></ins>
    </div>
  );
};

// Pastikan untuk mengekspor komponen jika Anda belum melakukannya
export default AdBanner;