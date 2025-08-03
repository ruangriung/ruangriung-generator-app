// app/storyteller/page.tsx
import StorytellerClient from '@/components/StorytellerClient';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthButton from '@/components/AuthButton';

export const metadata: Metadata = {
  title: 'Buat Cerita AI - RuangRiung AI Generator',
  description: 'Hasilkan cerita visual dengan lima gambar unik dan deskripsi teks menggunakan AI. Cukup masukkan ide cerita Anda dan biarkan AI yang menciptakan narasinya.',
  keywords: ['AI storytelling', 'AI story generator', 'gambar AI', 'teks AI', 'generasi cerita', 'RuangRiung AI'],
  openGraph: {
    title: 'Buat Cerita AI - RuangRiung AI Generator',
    description: 'Hasilkan cerita visual dengan lima gambar unik dan deskripsi teks menggunakan AI. Cukup masukkan ide cerita Anda dan biarkan AI yang menciptakan narasinya.',
    url: 'https://ruangriung.my.id/storyteller', // Ganti dengan URL aplikasi Anda
    siteName: 'RuangRiung AI Generator',
    images: [
      {
        url: 'https://ruangriung.my.id/v1/assets/logo.webp', // Ganti dengan gambar Open Graph Anda
        width: 1200,
        height: 630,
        alt: 'AI Storytelling',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buat Cerita AI - RuangRiung AI Generator',
    description: 'Hasilkan cerita visual dengan lima gambar unik dan deskripsi teks menggunakan AI. Cukup masukkan ide cerita Anda dan biarkan AI yang menciptakan narasinya.',
    images: ['https://ruangriung.my.id/twitter-image.png'], // Ganti dengan gambar Twitter Card Anda
  },
};

// Komponen halaman utama untuk rute /storyteller
export default async function StorytellerPage() {
  const session = await getServerSession(authOptions);

  // Jika pengguna belum login, tampilkan pesan akses terkunci dengan desain yang diperbaiki
  if (!session) {
    return (
      <div className="container mx-auto p-4 md:p-8 lg:p-12 flex flex-col items-center justify-center min-h-screen">
        {/* Container untuk tombol navigasi dan toggle tema di bagian atas */}
        <div className="mb-8 flex justify-between items-center w-full max-w-md">
          {/* Tombol Kembali ke Beranda */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors text-sm font-semibold"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </Link>

          {/* Tombol Dark Mode */}
          <ThemeToggle />
        </div>

        {/* Kotak Pesan Akses Terkunci dengan desain yang diperbaiki */}
        <div className="bg-light-bg dark:bg-dark-bg p-8 rounded-2xl shadow-neumorphic-card dark:shadow-dark-neumorphic-card text-center max-w-md w-full flex flex-col items-center gap-6 border border-solid border-gray-300 dark:border-gray-700"> {/* <-- Tambah border di sini */}
          <Lock size={64} className="text-purple-600 dark:text-purple-400 mb-2" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Akses Terkunci
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Halaman ini hanya dapat diakses oleh pengguna yang sudah login.
            Silakan login untuk melanjutkan.
          </p>
          <AuthButton />
        </div>
      </div>
    );
  }

  // Jika pengguna sudah login, render konten halaman Storyteller yang sebenarnya
  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12">
      {/* Container untuk tombol navigasi dan toggle tema */}
      <div className="mb-4 flex justify-between items-center">
        {/* Tombol Kembali ke Beranda */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors text-sm font-semibold"
          aria-label="Kembali ke Beranda"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Tombol Dark Mode */}
        <ThemeToggle />
      </div>

      {/* Header Utama Halaman */}
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8">
        Buat Cerita Visual dengan AI
      </h1>
      
      {/* Merender komponen sisi klien yang akan menangani seluruh logika interaktif */}
      <StorytellerClient />
    </div>
  );
}