import type { Metadata } from 'next';
import VideoCreator from '@/components/VideoCreator';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Video Prompt Generator | RuangRiung',
  description: 'Hasilkan prompt video profesional untuk Sora, Runway, Kling, dan Pika. Atur sinematografi, gaya visual, dan efek khusus dengan mudah.',
  keywords: ['video prompt AI', 'Sora generator', 'Runway Gen-3', 'Pika Labs', 'Kling AI Indonesia', 'sinematografi AI'],
  alternates: {
    canonical: 'https://ruangriung.my.id/video-prompt',
  },
  openGraph: {
    title: 'AI Video Prompt Generator | RuangRiung',
    description: 'Hasilkan prompt video profesional untuk Sora, Runway, Kling, dan Pika.',
    url: 'https://ruangriung.my.id/video-prompt',
    siteName: 'RuangRiung',
    images: [
      {
        url: 'https://ruangriung.my.id/og-image/og-image-rr.png',
        width: 1200,
        height: 630,
        alt: 'AI Video Prompt Generator RuangRiung',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Video Prompt Generator | RuangRiung',
    description: 'Hasilkan prompt video profesional untuk Sora, Runway, Kling, dan Pika.',
    images: ['https://ruangriung.my.id/og-image/og-image-rr.png'],
  },
};

export default function VideoPromptPage() {
  return (
    <main className="min-h-screen mesh-gradient py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="glass-card p-8 flex items-center justify-between">
          <Link 
            href="/" 
            className="group flex items-center gap-3 px-6 py-3 glass-button rounded-full text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-400"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Beranda
          </Link>
          <h1 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white hidden md:block">
            AI Video Prompt
          </h1>
        </div>

        <VideoCreator />
      </div>
    </main>
  );
}