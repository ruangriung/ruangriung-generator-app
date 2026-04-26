// Perhatikan .default di akhir baris ini
const withPWA = require('@ducanh2912/next-pwa').default;

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer, nextRuntime }) => {
    // Apply fallbacks for client-side and Edge runtime bundles
    if (!isServer || nextRuntime === 'edge') {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        nodemailer: false,
      };
    }
    return config;
  },
};


module.exports = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  exclude: [/\/v1\/.*$/],
})(nextConfig);