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
      <summary className="flex items-center justify-between p-4 bg-slate-950/5 dark:bg-white/5 rounded-2xl cursor-pointer list-none border border-black/5 dark:border-white/5 hover:bg-slate-950/10 dark:hover:bg-white/10 transition-colors">
        <div className="font-bold text-slate-700 dark:text-slate-200">{title}</div>
        <ChevronRight className="w-5 h-5 text-primary-500 transition-transform duration-300 group-open:rotate-90" />
      </summary>
      <div className="mt-2 p-1"> 
        {children}
      </div>
    </details>
  );
}