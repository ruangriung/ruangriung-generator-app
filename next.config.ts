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
    ],
  },
}

export default nextConfig