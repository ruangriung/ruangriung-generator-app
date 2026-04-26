// app/layout.tsx
// Netlify Auto-deploy test trigger

import type { Metadata, Viewport } from 'next';
import './globals.css';
import AuthProvider from '@/components/AuthProvider';
import Footer from '@/components/Footer';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import CookieConsent from '@/components/CookieConsent';
import ThemeScript from '@/components/ThemeScript';
import JsonLd from '@/components/JsonLd';
import { ChatProvider } from '@/components/chatbot/ChatContext';
import RRAssistant from '@/components/RRAssistant';

export const metadata: Metadata = {
  metadataBase: new URL('https://ruangriung.my.id'),

  title: {
    default: "RuangRiung AI Generator - Kreativitas Tanpa Batas dengan AI",
    template: "%s | RuangRiung"
  },
  description: "Ruang Riung AI Generator adalah platform kreatif bertenaga AI untuk membuat gambar artistik, naskah video, dan audio berkualitas tinggi. Solusi cerdas untuk konten kreator modern.",
  keywords: ["AI generator", "ruangriung indonesia", "image generator", "video creator", "audio generator", "Next.js", "AI art", "text to image", "generator ai indonesia", "konten kreator", "Midjourney prompt", "Stable Diffusion prompt", "ChatGPT Indonesia"],
  authors: [
    {
      name: "Ayick",
      url: "https://ariftirtana.my.id",
    },
  ],
  creator: "Ayick",
  publisher: "RuangRiung",

  verification: {
    google: "3Mybm59m8--LyAZpVYIGHrVk1fSkYemj33bq5RBBdxA",
  },

  openGraph: {
    title: "RuangRiung AI Generator - Buat Gambar & Audio AI",
    description: "Platform AI all-in-one untuk konten kreator. Generate gambar artistik, naskah video, dan audio dalam hitungan detik.",
    type: "website",
    url: "https://ruangriung.my.id",
    siteName: "RuangRiung",
    images: [{
      url: "/assets/ruangriung.png",
      width: 1200,
      height: 630,
      alt: "RuangRiung AI Generator - Official Banner",
    }],
    locale: 'id_ID',
  },

  twitter: {
    card: 'summary_large_image',
    title: "RuangRiung AI Generator",
    description: "Platform AI kreatif untuk gambar, video, dan audio.",
    images: ['/assets/ruangriung.png'],
  },

  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/logo.webp", sizes: "32x32", type: "image/webp" },
    ],
    apple: "/logo.webp",
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
  const organizationSchema = {
    name: 'RuangRiung',
    url: 'https://ruangriung.my.id',
    logo: 'https://ruangriung.my.id/logo.webp',
    sameAs: [
      'https://ariftirtana.my.id',
    ],
  };

  const websiteSchema = {
    name: 'RuangRiung AI Generator',
    url: 'https://ruangriung.my.id',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://ruangriung.my.id/artikel?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.webp" />
      </head>
      <body className="bg-light-bg font-sans relative">
        {/* Optimized Fixed Background Layer */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,hsla(253,16%,95%,1)_0,transparent_50%),radial-gradient(at_50%_0%,hsla(225,39%,90%,1)_0,transparent_50%),radial-gradient(at_100%_0%,hsla(339,49%,90%,1)_0,transparent_50%)] dark:hidden" />
          <div className="absolute inset-0 hidden bg-[radial-gradient(at_0%_0%,hsla(253,16%,7%,1)_0,transparent_50%),radial-gradient(at_50%_0%,hsla(225,39%,10%,1)_0,transparent_50%),radial-gradient(at_100%_0%,hsla(339,49%,10%,1)_0,transparent_50%)] dark:block" />
        </div>
        <JsonLd type="Organization" data={organizationSchema} />
        <JsonLd type="WebSite" data={websiteSchema} />
        
        <ChatProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
          <Toaster />
          <CookieConsent />
          <RRAssistant />
        </ChatProvider>

        {/* Google AdSense Script */}
        <Script
          id="google-adsense-script"
          async
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6394253519537490"
        />

        {/* Google Analytics Script */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-7T365LMTJ7" />
        <Script
          id="google-analytics-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7T365LMTJ7');
            `,
          }}
        />

      </body>
    </html>
  );
}
