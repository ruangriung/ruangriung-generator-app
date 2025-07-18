'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';

export default function ThemeToggle() {
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
    // --- PERUBAHAN DI SINI ---
    // Menambahkan flex-1 agar tombol melebar dan justify-center untuk menengahkan ikon
    return `flex-1 flex justify-center items-center p-3 rounded-lg transition-all duration-200 mx-0.5 ${
      isActive
        ? 'bg-purple-600 text-white shadow-neumorphic-button dark:shadow-dark-neumorphic-button'
        : 'bg-light-bg dark:bg-dark-bg text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500'
    }`;
  };

  return (
    // --- PERUBAHAN DI SINI ---
    // Menambahkan w-full agar container mengambil lebar penuh
    <div className="w-full flex items-center p-1 bg-light-bg dark:bg-dark-bg rounded-xl shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset min-h-[52px]">
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