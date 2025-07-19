// app/premium/page.tsx
'use client';

import { Wand2, Rss, Facebook } from 'lucide-react';
import Link from 'next/link';
import Tabs from '@/components/Tabs';
import AuthButton from '@/components/AuthButton';
import ThemeToggle from '@/components/ThemeToggle';
import FAQ from '@/components/FAQ';
import PremiumLogoutButton from '@/components/PremiumLogoutButton'; // <-- Tombol khusus premium

export default function PremiumPage() {
  // Karena ini halaman premium, kita tidak menampilkan banner instalasi atau promosi.
  // Fungsionalitas `deferredPrompt` dan banner dihilangkan untuk pengalaman yang lebih bersih.

  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-8">

      {/* Header Halaman Premium */}
      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">
            <Wand2 className="text-purple-600 inline-block align-middle h-8 w-8 sm:h-10 sm:w-10 -mt-1 mr-1" />
            <span className="align-middle">RuangRiung AI Generator</span>
            <span className="ml-2 text-lg align-middle font-semibold text-yellow-500">[PREMIUM]</span>
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Nikmati pengalaman bebas iklan dan fitur eksklusif
        </p>
      </header>
      
      {/* Tombol Ajakan (bisa dipertahankan atau dihilangkan sesuai selera) */}
      <div className="w-full max-w-4xl mb-8 flex flex-wrap justify-center gap-4">
        <Link href="/artikel" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all">
          <Rss size={18} />
          <span>Baca Tips & Trik</span>
        </Link>
        <a href="https://www.facebook.com/groups/1182261482811767/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
          <Facebook size={18} />
          <span>Gabung Grup</span>
        </a>
      </div>
      
       {/* === KONTROL UTAMA PENGGUNA (TATA LETAK BARU) === */}
      <div className="w-full max-w-4xl flex flex-col items-center mb-4 gap-3">
        {/* Baris Pertama: Tombol Login dan Toggle */}
        <div className="w-full flex justify-between items-center gap-4">
          <AuthButton />
          <ThemeToggle />
        </div>
        {/* Baris Kedua: Tombol Logout Premium Lebar Penuh */}
        <PremiumLogoutButton />
      </div>
      
      {/* Fungsionalitas Inti: Generator */}
      <main className="w-full flex flex-col items-center">
        <Tabs />
      </main>
      
      {/* Bagian FAQ */}
      <div className="w-full mt-16">
        <FAQ />
      </div>

      {/* Footer akan otomatis ditambahkan oleh RootLayout, tetapi tidak akan ganda
          karena kita sudah punya app/premium/layout.tsx */}
    </div>
  );
}