'use client';

import { Wand2, Sparkles, Download, X, Rss, Crown, Facebook, Star, Mail, LayoutGrid, EarthIcon } from 'lucide-react';
import Tabs from '../components/Tabs';
import AuthButton from '@/components/AuthButton';
import ThemeToggle from '@/components/ThemeToggle';
import { useState, useEffect } from 'react';
import FAQ from '@/components/FAQ';
import { AdBanner } from '@/components/AdBanner';
import Link from 'next/link';

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallButton(false);
      }
    }
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      {showBanner && (
        <div className="w-full max-w-4xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-3 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row items-center justify-center gap-3 relative">
          <p className="text-sm sm:text-base font-semibold flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-300" />
            Jelajahi kreativitas tanpa batas dengan AI!
          </p>
          {showInstallButton && (
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-600 font-bold rounded-lg shadow-md hover:bg-gray-100 transition-colors text-sm"
            >
              <Download size={16} /> Install App
            </button>
          )}
          <button
            onClick={handleCloseBanner}
            className="absolute top-2 right-2 p-1 text-white hover:text-gray-200"
            aria-label="Close banner"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">
            <Wand2 className="text-purple-600 inline-block align-middle h-8 w-8 sm:h-10 sm:w-10 -mt-1 mr-1" />
            <span className="align-middle">RuangRiung AI Generator</span>
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Transform your imagination into stunning visuals with AI
        </p>
      </header>
      
      <div className="w-full max-w-4xl mb-8 flex flex-wrap justify-center gap-4">
        <Link href="#" 
          // Ubah class untuk menyamakan dengan tombol Tutorial
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all relative"
        >
          <LayoutGrid size={18} />
          <span>Koleksi Prompt AI</span>
          {/* Teks "Segera Hadir" disamakan dengan tombol Tutorial */}
          <span className="absolute top-0 right-1 text-[0.6rem] text-white font-normal opacity-80 bg-red-700 px-1 rounded">Segera Hadir</span>
        </Link>
        <Link href="/artikel" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all">
          <Rss size={18} />
          <span>Baca Tips & Trik</span>
        </Link>
        <a href="https://www.facebook.com/groups/1182261482811767/?ref=share&mibextid=lOuIew" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
          <Facebook size={18} />
          <span>Gabung Grup</span>
        </a>
        <Link href="/kontak" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all">
          <Mail size={18} />
          <span>Email Kami</span>
        </Link>
      </div>
       {/* TOMBOL BARU DERY-LAU.MY.ID DITEMPATKAN DI SINI */}
       <div className="w-full max-w-4xl mb-8">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gray-800 text-white font-bold rounded-lg shadow-lg hover:bg-gray-950 transition-colors active:shadow-inner relative"
        >
          <EarthIcon size={18} />
          <span>Tutorial</span>
          {/* Teks "Segera Hadir" sebagai overlay atau posisi absolut */}
          <span className="absolute top-1 right-2 text-[0.6rem] text-white font-normal opacity-80 bg-red-700 px-1 rounded">Segera Hadir</span>
        </a>
      </div>
      {/* AKHIR TOMBOL BARU */}
      <div className="w-full max-w-4xl mb-4">
        <AdBanner dataAdSlot="6897039624" />
      </div>

       {/* === TOMBOL PREMIUM SEMENTARA DINONAKTIFKAN DENGAN KOMENTAR === */}
      {/* <div className="w-full max-w-4xl mb-8">
          <Link 
              href="/premium" 
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition-colors active:shadow-inner"
          >
            <Crown size={18} />
            <span>Go Premium (Ad-Free)</span>
          </Link>
        </div> */}
      
      {/* ============================================================= */}

      {/* === PERUBAHAN TATA LETAK DI SINI === */}
      <div className="w-full max-w-4xl flex flex-col gap-4 mb-4">
        <AuthButton />
        <ThemeToggle />
      </div>
      {/* ==================================== */}
      
      <main className="w-full flex flex-col items-center">
        <Tabs />
      </main>
      <div className="w-full max-w-4xl mt-16">
        <AdBanner dataAdSlot="5961316189" />
      </div>

      <div className="w-full mt-16">
        <FAQ />
      </div>
    </div>
  );
}