// components/LockedAccordion.tsx
'use client';

import { Lock, ChevronRight } from 'lucide-react';
import AuthButton from './AuthButton';
import { ReactNode } from 'react';

interface LockedAccordionProps {
  title: ReactNode;
  className?: string;
}

export default function LockedAccordion({ title, className }: LockedAccordionProps) {
  return (
    // Menggunakan elemen <details> untuk fungsionalitas buka/tutup bawaan
    <details className={`w-full group ${className || ''}`}>
      {/* <summary> adalah bagian yang selalu terlihat dan bisa diklik */}
      <summary className="flex items-center justify-between p-3 bg-light-bg dark:bg-dark-bg rounded-lg cursor-pointer list-none shadow-neumorphic-button dark:shadow-dark-neumorphic-button transition-shadow opacity-60 hover:opacity-100">
        <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-600" />
          {title}
        </div>
        {/* Ikon panah yang akan berputar saat dibuka */}
        <ChevronRight className="w-5 h-5 text-purple-600 transition-transform duration-300 group-open:rotate-90" />
      </summary>
      
      {/* Konten ini hanya akan muncul setelah <summary> diklik */}
      <div className="mt-2 p-4 text-center bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Fitur ini hanya tersedia untuk pengguna yang sudah login. Silakan masuk untuk melanjutkan.
        </p>
        <AuthButton />
      </div>
    </details>
  );
}