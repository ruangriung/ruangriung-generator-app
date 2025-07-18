// next.config.ts
import type { NextConfig } from 'next';

// Impor dari paket PWA yang baru
import withPWAInit from '@ducanh2912/next-pwa';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Tidak ada konfigurasi 'zones' sama sekali.
  // Struktur folder app/premium sudah cukup.
};

// Cara baru untuk menginisialisasi PWA
const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
});

export default withPWA(nextConfig);