// components/ThemeToggle.tsx
'use client';

import { useState, useEffect } from 'react';
import { Monitor, Sun, Moon } from 'lucide-react';

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
    return null;
  }

  const getButtonStyle = (buttonTheme: 'light' | 'dark' | 'system') => {
    const isActive = theme === buttonTheme;
    return `p-2 rounded-lg transition-all duration-200 mx-0.5 ${
      isActive
        ? 'bg-purple-600 text-white shadow-neumorphic-button dark:shadow-dark-neumorphic-button'
        : 'bg-light-bg dark:bg-dark-bg text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500'
    }`;
  };

  return (
    <div className="flex items-center p-2 bg-light-bg dark:bg-dark-bg rounded-xl shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset"> {/* Padding diubah di sini */}
      <button onClick={() => setTheme('light')} className={getButtonStyle('light')} aria-label="Set Light Theme">
        <Sun size={18} />
      </button>
      <button onClick={() => setTheme('dark')} className={getButtonStyle('dark')} aria-label="Set Dark Theme">
        <Moon size={18} />
      </button>
      <button onClick={() => setTheme('system')} className={getButtonStyle('system')} aria-label="Set System Theme">
        <Monitor size={18} />
      </button>
    </div>
  );
}