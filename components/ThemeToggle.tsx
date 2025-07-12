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
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme('system');
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem('theme', theme);

    const applyTheme = () => {
      if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', systemPrefersDark);
      } else {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    });
  };

  const renderIcon = () => {
    if (!mounted) {
      return <Sun size={20} className="text-yellow-500" />;
    }

    if (theme === 'system') {
      return <Monitor size={20} className="text-gray-500 dark:text-gray-400" />; // <--- PERUBAHAN: dark:text-gray-400
    } else if (theme === 'light') {
      return <Sun size={20} className="text-yellow-500" />;
    } else {
      return <Moon size={20} className="text-blue-500" />;
    }
  };

  // <--- PERUBAHAN: Tambahkan dark:bg-dark-bg, dark:shadow-dark-neumorphic-button, dark:active:shadow-dark-neumorphic-inset, dark:text-gray-300, dark:hover:text-purple-500
  const buttonStyle = `p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-500 transition-all`;

  return (
    <button
      onClick={toggleTheme}
      className={buttonStyle}
      aria-label="Toggle theme"
    >
      {renderIcon()}
    </button>
  );
}