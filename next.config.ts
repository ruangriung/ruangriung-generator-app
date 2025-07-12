import type { NextConfig } from 'next'

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
}

export default nextConfig