// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import Footer from '@/components/Footer';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import CookieConsent from '@/components/CookieConsent';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ruangriung.my.id'),
  title: "RuangRiung AI Generator - Buat Gambar, Video, Audio dengan Teknologi AI Canggih",
  description: "Ruang Riung AI Generator adalah aplikasi Next.js modern yang memungkinkan Anda membuat gambar, ide video, dan audio menggunakan AI. Didukung oleh NextAuth.js (Google & Facebook Login), Tailwind CSS, dan Pollinations.ai API dan DALLE-3 untuk generasi gambar, serta ElevenLabs API untuk audio. Aplikasi ini dirancang untuk memberikan pengalaman pengguna yang cepat dan responsif dengan performa tinggi",
  keywords: "AI generator, image generator, video creator, audio generator, Next.js, React, NextAuth.js, Google login, Facebook login, Pollinations.ai, Tailwind CSS, Vercel, Ruang Riung, AI art, text to image, text to audio, AI video prompt, aplikasi gambar AI, aplikasi video AI, aplikasi audio AI, teknologi AI, generasi gambar AI, generasi video AI, generasi audio AI, aplikasi Next.js, aplikasi React, aplikasi modern, aplikasi web, aplikasi AI, aplikasi generasi konten, aplikasi kreatif, aplikasi inovatif, aplikasi produktivitas, aplikasi teknologi, aplikasi berbasis AI, aplikasi generasi konten AI, aplikasi generasi gambar AI, aplikasi generasi video AI, aplikasi generasi audio AI, aplikasi AI modern, aplikasi AI canggih, aplikasi AI produktif, aplikasi AI kreatif, aplikasi AI inovatif, aplikasi AI generatif, aplikasi AI generasi konten, aplikasi AI generasi gambar, aplikasi AI generasi video, aplikasi AI generasi audio, aplikasi AI berbasis web, aplikasi AI berbasis React, aplikasi AI berbasis Next.js, aplikasi AI berbasis Tailwind CSS, aplikasi AI berbasis Pollinations.ai, aplikasi AI berbasis ElevenLabs, aplikasi AI berbasis Vercel, aplikasi AI berbasis cloud, aplikasi AI berbasis OpenAI, aplikasi AI berbasis OpenAI API, aplikasi AI berbasis OpenAI SDK",
  authors: [
    {
      name: "Ayick",
      url: "https://ariftirtana.my.id",
    },
  ],
  creator: "Ayick",
  publisher: "Ayick",

  verification: {
    google: "3Mybm59m8--LyAZpVYIGHrVk1fSkYemj33bq5RBBdxA",
  },
  
  openGraph: {
    title: "RuangRiung AI Image Generator - Create Stunning Digital Art",
    description: "Transform text into beautiful AI-generated artwork in various styles including photography, anime, digital painting and more.",
    type: "website",
    url: "https://ruangriung.my.id",
    images: [{
      url: "https://www.ruangriung.my.id/assets/ruangriung.png",
      alt: "RuangRiung AI Image Generator Banner",
    }],
  },

  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#6c5ce7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* --- LETAKKAN SKRIP ADSENSE ANDA DI SINI --- */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1439044724518446"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.className} bg-light-bg`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
        <Toaster />
        <CookieConsent />

        {/* Google Analytics Script sudah dioptimalkan */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-PWFT2SQWNZ" />
        <Script
          id="google-analytics-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PWFT2SQWNZ');
            `,
          }}
        />
      </body>
    </html>
  );
}