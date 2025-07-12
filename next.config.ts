import type { NextConfig } from 'next'
import withPWA from 'next-pwa'

const nextConfig: NextConfig = {
  // Tambahkan konfigurasi ini
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
        { // Tambahkan pola ini untuk avatar Facebook
        protocol: 'https',
        hostname: 'platform-lookaside.fbsbx.com',
        port: '',
        pathname: '/**',
        },
    ],
  },
  // Anda bisa menambahkan konfigurasi i18n di sini jika ada, misalnya:
  // i18n: {
  //   locales: ['en', 'id'],
  //   defaultLocale: 'en',
  // },
}

const pwaConfig = withPWA({
  dest: 'public', // Direktori output untuk service worker dan file terkait
  register: true, // Daftarkan service worker secara otomatis
  skipWaiting: true, // Pastikan service worker baru segera mengambil alih
  disable: process.env.NODE_ENV === 'development', // Nonaktifkan PWA di mode development
});

// Perbaiki baris ekspor dengan melakukan type assertion (casting) ke 'any'
export default pwaConfig(nextConfig as any);