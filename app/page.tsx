// app/page.tsx
'use client';

import { Wand2, Sparkles, Download, X } from 'lucide-react';
import Tabs from '../components/Tabs';
import AuthButton from '@/components/AuthButton';
import ThemeToggle from '@/components/ThemeToggle';
import { useState, useEffect } from 'react';
import FAQ from '@/components/FAQ'; // Pastikan komponen FAQ diimpor
import { AdBanner } from '@/components/AdBanner'; // <-- IMPOR BARU

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Tangani event 'beforeinstallprompt' untuk PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true); // Tampilkan tombol instal
    };

    // Tangani event 'appinstalled' jika PWA sudah diinstal
    const handleAppInstalled = () => {
      setShowInstallButton(false); // Sembunyikan tombol setelah diinstal
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup listener saat komponen di-unmount
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
        console.log('User accepted the install prompt.');
        setShowInstallButton(false);
      } else {
        console.log('User dismissed the install prompt.');
      }
      setDeferredPrompt(null);
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
      
      {/* --- SLOT IKLAN 1 --- */}
      <div className="w-full max-w-4xl mb-8">
        <AdBanner type="banner" />
      </div>

      <div className="w-full max-w-4xl flex justify-between items-center mb-4">
        <AuthButton />
        <ThemeToggle />
      </div>
      
      <main className="w-full flex flex-col items-center">
        <Tabs />
      </main>

      <div className="w-full mt-16">
        <FAQ />
      </div>
    </div>
  );
}