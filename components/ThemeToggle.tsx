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
    return <div className="h-[52px] w-full bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset animate-pulse"></div>;
  }

  const getButtonStyle = (buttonTheme: 'light' | 'dark' | 'system') => {
    const isActive = theme === buttonTheme;
    const baseStyles =
      'flex-1 flex justify-center items-center p-3 rounded-lg transition-all duration-200 mx-0.5 focus-visible:outline-none';

    if (variant === 'umkm') {
      return `${baseStyles} focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 ${
        isActive
          ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500'
          : 'bg-transparent text-slate-500 hover:bg-indigo-50/80 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-indigo-400'
      }`;
    }

    return `${baseStyles} ${
      isActive
        ? 'bg-purple-600 text-white shadow-neumorphic-button dark:shadow-dark-neumorphic-button'
        : 'bg-light-bg dark:bg-dark-bg text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500'
    }`;
  };

  return (
    <div
      className={`w-full flex items-center p-1 rounded-xl min-h-[52px] ${
        variant === 'umkm'
          ? 'border border-slate-200 bg-white/90 shadow-sm shadow-slate-200/60 backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-slate-900/40'
          : 'bg-light-bg dark:bg-dark-bg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset'
      }`}
    >
      <button onClick={() => setTheme('light')} className={getButtonStyle('light')} aria-label="Set Light Theme">
        <Sun size={20} />
      </button>
      <button onClick={() => setTheme('dark')} className={getButtonStyle('dark')} aria-label="Set Dark Theme">
        <Moon size={20} />
      </button>
      <button onClick={() => setTheme('system')} className={getButtonStyle('system')} aria-label="Set System Theme">
        <Laptop size={20} />
      </button>
    </div>
  );
}