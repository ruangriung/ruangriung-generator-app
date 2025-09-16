'use client';

import { useState, useEffect } from 'react';
import { Cookie, Check, X } from 'lucide-react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Cek localStorage hanya di sisi klien setelah komponen ter-mount
    try {
      const consent = localStorage.getItem('cookie_consent');
      // Hanya tampilkan banner jika belum ada pilihan yang disimpan
      if (consent === null) {
        setShowConsent(true);
      }
    } catch (error) {
      console.error("Tidak dapat mengakses localStorage:", error);
    }
  }, []);

  const handleConsent = (consent: boolean) => {
    try {
      localStorage.setItem('cookie_consent', String(consent));
      setShowConsent(false);
    } catch (error) {
      console.error("Tidak dapat menyimpan ke localStorage:", error);
    }
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-5 left-5 z-50 max-w-md p-6 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic transition-transform duration-500 ease-in-out transform ${
        showConsent ? 'translate-x-0' : '-translate-x-[150%]'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
            <Cookie className="h-6 w-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Persetujuan Cookie</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Kami menggunakan cookie untuk menyimpan preferensi Anda seperti riwayat chat dan tema. Penolakan cookie tidak akan menghentikan penayangan iklan, namun data preferensi Anda mungkin tidak tersimpan.
          </p>
        </div>
      </div>
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => handleConsent(true)}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-colors"
        >
          <Check size={18} className="mr-2" /> Setuju
        </button>
        <button
          onClick={() => handleConsent(false)}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
        >
          <X size={18} className="mr-2" /> Tolak
        </button>
      </div>
    </div>
  );
}
