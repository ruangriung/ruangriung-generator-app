// components/LockedAccordion.tsx
'use client';

import { Lock } from 'lucide-react';
import AuthButton from './AuthButton';
import { ReactNode } from 'react';

interface LockedAccordionProps {
  title: ReactNode;
  className?: string;
}

export default function LockedAccordion({ title, className }: LockedAccordionProps) {
  return (
    <div className={`w-full group ${className || ''}`}>
      <div className="flex items-center justify-between p-3 bg-light-bg dark:bg-dark-bg rounded-lg cursor-not-allowed list-none shadow-neumorphic-button dark:shadow-dark-neumorphic-button transition-shadow opacity-60">
        <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-600" />
          {title}
        </div>
      </div>
      <div className="mt-2 p-4 text-center bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Fitur ini hanya tersedia untuk pengguna yang sudah login. Silakan masuk untuk melanjutkan.
        </p>
        <AuthButton />
      </div>
    </div>
  );
}