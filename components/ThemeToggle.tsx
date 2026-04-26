'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'default' | 'umkm';
}

export default function ThemeToggle({ variant = 'default' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', systemPrefersDark);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);


  if (!mounted) {
    return <div className="h-[52px] w-full glass rounded-2xl animate-pulse"></div>;
  }

  const getButtonStyle = (buttonTheme: 'light' | 'dark' | 'system') => {
    const isActive = theme === buttonTheme;
    const baseStyles =
      'flex-1 flex justify-center items-center py-2.5 rounded-xl transition-all duration-300 mx-0.5 focus-visible:outline-none relative';

    if (isActive) {
      return `${baseStyles} text-primary-500 dark:text-primary-400 scale-[1.3] drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]`;
    }

    return `${baseStyles} text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 hover:scale-110`;
  };

  return (
    <div className="w-full flex items-center p-1.5 glass rounded-2xl border border-white/20 dark:border-white/10 shadow-xl min-h-[52px]">
      <button onClick={() => setTheme('light')} className={getButtonStyle('light')} aria-label="Set Light Theme">
        <Sun size={18} className={theme === 'light' ? 'animate-spin-slow' : ''} />
      </button>
      <button onClick={() => setTheme('dark')} className={getButtonStyle('dark')} aria-label="Set Dark Theme">
        <Moon size={18} className={theme === 'dark' ? 'animate-bounce-slow' : ''} />
      </button>
      <button onClick={() => setTheme('system')} className={getButtonStyle('system')} aria-label="Set System Theme">
        <Laptop size={18} />
      </button>
    </div>
  );
}