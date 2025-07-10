// components/Accordion.tsx
'use client';

import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface AccordionProps {
  title: ReactNode; // Izinkan judul berupa JSX (untuk ikon)
  children: ReactNode;
}

export default function Accordion({ title, children }: AccordionProps) {
  return (
    <details className="w-full group">
      <summary className="flex items-center justify-between p-3 bg-light-bg rounded-lg cursor-pointer list-none shadow-neumorphic-button">
        <div className="font-medium text-gray-700">{title}</div>
        <ChevronRight className="w-5 h-5 text-purple-600 transition-transform duration-300 group-open:rotate-90" />
      </summary>
      <div className="mt-2 p-4">
        {children}
      </div>
    </details>
  );
}