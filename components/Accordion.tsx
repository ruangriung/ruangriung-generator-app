// components/Accordion.tsx
'use client';

import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Accordion({ title, children, className }: AccordionProps) {
  return (
    <details className={`w-full group ${className || ''}`}>
      {/* <--- PERUBAHAN: Tambahkan dark:bg-dark-bg dan dark:shadow-dark-neumorphic-button, dark:text-gray-300 */}
      <summary className="flex items-center justify-between p-3 bg-light-bg dark:bg-dark-bg rounded-lg cursor-pointer list-none shadow-neumorphic-button dark:shadow-dark-neumorphic-button">
        <div className="font-medium text-gray-700 dark:text-gray-300">{title}</div>
        <ChevronRight className="w-5 h-5 text-purple-600 transition-transform duration-300 group-open:rotate-90" />
      </summary>
      {/* <--- PERUBAHAN: Tambahkan dark:border-gray-600 untuk border jika ada, dan pastikan konten di dalamnya tidak ada neumorphic langsung */}
      <div className="mt-2 p-3"> 
        {children}
      </div>
    </details>
  );
}