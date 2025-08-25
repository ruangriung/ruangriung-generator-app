import CommentOverlayClient from './CommentOverlayClient';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Video, MessageSquare, Palette } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import Image from 'next/image';

export const metadata: Metadata = {
  metadataBase: new URL('https://ruangriung.my.id'),
  title: 'Generator Bubble Komentar Kustom - RuangRiung',
  description: 'Ubah teks komentar menjadi gambar overlay yang menarik untuk video atau konten Anda. Cepat, mudah, dan gratis.',
  keywords: ['comment overlay', 'bubble komentar', 'generator komentar', 'ruangriung', 'konten kreator'],
  alternates: {
    canonical: '/comment-overlay',
  },
  openGraph: {
    title: 'Generator Bubble Komentar Kustom - RuangRiung',
    description: 'Ubah teks komentar menjadi gambar overlay yang menarik untuk video atau konten Anda. Cepat, mudah, dan gratis.',
    url: 'https://ruangriung.my.id/comment-overlay',
    siteName: 'RuangRiung AI Generator',
    images: [
      {
        url: 'https://www.ruangriung.my.id/assets/ruangriung.png',
        width: 1200,
        height: 630,
        alt: 'RuangRiung Comment Overlay',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generator Bubble Komentar Kustom - RuangRiung',
    description: 'Ubah teks komentar menjadi gambar overlay yang menarik untuk video atau konten Anda. Cepat, mudah, dan gratis.',
    images: ['https://www.ruangriung.my.id/assets/contoh-komentar.webp'],
  },
};

export default function CommentOverlayPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Header Tombol */}
      <div className="mb-6 flex justify-between items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors text-xs font-semibold"
          aria-label="Kembali ke Beranda"
        >
          <ArrowLeft size={14} />
          <span>Kembali</span>
        </Link>
        <div className="scale-90 transform">
          <ThemeToggle />
        </div>
      </div>

      {/* Header Halaman */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
          Kustomisasi Bubble Komentar
        </h1>
        <p className="mt-2 text-md text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Ubah teks biasa menjadi gambar komentar menarik untuk kebutuhan konten Anda.
        </p>
        <hr className="mt-6 w-48 mx-auto border-black dark:border-gray-700" />
      </div>
      
      <CommentOverlayClient />

      {/* Deskripsi & Contoh Kegunaan */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Apa Kegunaan Tools Ini?
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Tools ini dirancang untuk membantu para <strong>Konten kreator, Social Media manager</strong> atau<strong> Digital Marketing</strong>, atau siapa saja yang ingin memvisualisasikan komentar dalam format gambar. Gambar yang dihasilkan memiliki latar belakang transparan (format PNG), sehingga sangat mudah ditempelkan di atas video, gambar, atau desain lainnya.
        </p>
        
        <div className="mt-8 max-w-2xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <Image 
            src="/assets/contoh-komentar.webp" // Ganti dengan path gambar Anda di folder /public
            alt="Contoh penggunaan bubble komentar di video"
            width={1024}
            height={1024}
            className="rounded-md shadow-lg"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <Video className="w-10 h-10 text-purple-600" />
            <h3 className="mt-4 font-semibold">Video Konten</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tampilkan komentar pilihan dari audiens Anda langsung di dalam video YouTube, TikTok, atau Reels.</p>
          </div>
          <div className="flex flex-col items-center">
            <MessageSquare className="w-10 h-10 text-purple-600" />
            <h3 className="mt-4 font-semibold">Media Sosial</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Buat postingan testimoni atau Q&A yang menarik secara visual untuk feed Instagram atau Facebook.</p>
          </div>
          <div className="flex flex-col items-center">
            <Palette className="w-10 h-10 text-purple-600" />
            <h3 className="mt-4 font-semibold">Desain Grafis</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Integrasikan bubble komentar sebagai elemen dekoratif dalam poster, infografis, atau materi promosi lainnya.</p>
          </div>
        </div>
      </div>
    </div>
  );
}