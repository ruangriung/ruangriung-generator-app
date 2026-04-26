'use client'; // Tandai sebagai Client Component

import {
  Wand2,
  Sparkles,
  Download,
  X,
  Rss,
  Facebook,
  Mail,
  LayoutGrid,
  Building2,
  EarthIcon,
  BookOpen,
  QrCode,
  ChevronDown,
  MessageSquare,
  Megaphone,
  ArrowRight,
  HelpCircle,
  RefreshCw,
  Image as ImageIcon,
  AppWindow,
  Key,
  CheckCircle,
  Github,
} from 'lucide-react';
import Tabs from '../components/Tabs';
import AuthButton from '@/components/AuthButton';
import ThemeToggle from '@/components/ThemeToggle';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import FAQ from '@/components/FAQ';
import Link from 'next/link';
import PromptSubmissionTrigger from '@/components/PromptSubmissionTrigger';
// import GoogleAd from '@/components/GoogleAd'; // DISABLED - Google Ads disabled temporarily


interface HomeClientProps {
  latestArticle: {
    slug: string;
    title: string;
    date: string;
    author: string;
    summary: string;
  };
}



const HomeClient = memo(({ latestArticle }: HomeClientProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  // Efek untuk PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsToolsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleToolsMenu = useCallback(() => setIsToolsMenuOpen(prev => !prev), []);
  const handleCloseBanner = useCallback(() => setShowBanner(false), []);

  // Efek untuk menutup dropdown menu saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;

      if (toolsMenuRef.current && !toolsMenuRef.current.contains(targetNode)) {
        setIsToolsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleInstallClick = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallButton(false);
      }
    }
  }, [deferredPrompt]);

  return (
    <div className="flex min-h-screen flex-col items-center px-4 pt-32 pb-8 sm:px-8">

      
      {showBanner && (
        <div className="w-full max-w-5xl bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 text-white p-4 rounded-2xl shadow-xl shadow-primary-500/20 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 relative animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              <Sparkles size={20} className="text-yellow-300 animate-pulse" />
            </span>
            <p className="text-sm sm:text-base font-bold tracking-tight">
              Jelajahi kreativitas tanpa batas dengan RuangRiung AI!
            </p>
          </div>
          <div className="flex items-center gap-4">
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="inline-flex items-center gap-2 px-6 py-2 bg-white text-primary-600 font-bold rounded-xl shadow-lg hover:scale-105 transition-all text-sm"
              >
                <Download size={16} /> Install App
              </button>
            )}
            <button
              onClick={handleCloseBanner}
              className="p-1 text-white/70 hover:text-white transition-colors"
              aria-label="Close banner"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      <header className="w-full max-w-5xl mb-16 relative">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 animate-bounce-slow">
            <Sparkles size={14} /> AI Powered Platform
          </div>
          <div className="relative">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-slate-950 dark:text-white leading-[0.9]">
              RUANG<br /><span className="gradient-text">RIUNG</span>
              <span className="block text-[0.25em] tracking-[0.3em] uppercase text-primary-500/60 mt-4 font-black">AI Generator</span>
            </h1>
            <div className="absolute -right-12 top-0 animate-float opacity-30 hidden md:block">
              <Wand2 size={80} className="text-primary-500 rotate-12" />
            </div>
          </div>
          <h2 className="text-slate-500 dark:text-slate-400 text-lg sm:text-2xl max-w-2xl font-semibold leading-relaxed">
            Transformasikan imajinasi Anda menjadi kenyataan. Hub All-in-One untuk <span className="text-primary-500 font-black">AI Creative Generation</span> di Indonesia.
          </h2>
        </div>
      </header>



      {/* Community & CTA Area */}
      <div className="w-full max-w-5xl mb-12 grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
        <a
          href="https://www.facebook.com/groups/1182261482811767/?ref=share&mibextid=lOuIew"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 rounded-2xl bg-[#0866FF] text-white shadow-lg shadow-blue-500/10 hover:scale-[1.02] active:scale-95 transition-all group"
        >
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-white/20 group-hover:rotate-12 transition-transform">
              <Facebook size={18} className="md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-xs md:text-base font-black">Komunitas</p>
              <p className="text-[9px] md:text-xs font-medium text-white/80">40k+ Kreator</p>
            </div>
          </div>
          <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
        </a>

        <PromptSubmissionTrigger
          className="w-full"
          label={
            <div className="flex w-full items-center justify-between p-4 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg hover:scale-[1.02] active:scale-95 transition-all group border border-white/10 dark:border-slate-200">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-primary-500/20 text-primary-500">
                  <Sparkles size={18} className="md:w-5 md:h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs md:text-base font-black">Submit</p>
                  <p className="text-[9px] md:text-xs font-medium opacity-80">Prompt AI</p>
                </div>
              </div>
              <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          }
        />
      </div>

      <div className="w-full max-w-5xl mb-12">
        <Link
          href={`/artikel/${latestArticle.slug}`}
          className="glass-card flex items-center justify-between gap-6 hover:border-orange-500/30 group p-4 sm:p-6"
        >
          <div className="flex items-center gap-4 overflow-hidden">
            <span className="shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-orange-500/10 text-orange-500">
              <Rss size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-orange-500 mb-0.5">Berita Terbaru</p>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-primary-500 transition-colors">
                {latestArticle.title}
              </h2>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors">
            Baca Selengkapnya
            <ArrowRight size={14} />
          </div>
        </Link>
      </div>

      {/* Main Feature Tabs Section */}
      <main className="w-full flex flex-col items-center mb-24">
        <div className="w-full max-w-5xl mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 px-2">
          <div className="text-left">
            <h2 className="text-4xl font-black text-slate-950 dark:text-white">Eksplorasi Fitur</h2>
            <p className="text-slate-500 font-semibold mt-1">Pilih tool yang Anda butuhkan untuk memulai kreasi.</p>
          </div>
        </div>
        <Tabs />
      </main>

      {/* Personalized Brand CTA */}
      <div className="w-full max-w-2xl mb-24 px-4 sm:px-0">
        <Link
          href="/konten-kreator"
          className="relative group block overflow-hidden rounded-3xl p-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-xl shadow-purple-500/10"
        >
          <div className="relative bg-slate-950 rounded-[1.4rem] p-5 md:p-6 transition-colors duration-500 group-hover:bg-transparent">
            <div className="flex flex-col sm:flex-row items-center gap-5 md:gap-8 relative z-10">
              <div className="relative shrink-0">
                <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 group-hover:scale-110 transition-transform duration-500">
                  <Megaphone className="h-6 w-6 text-white animate-pulse" />
                </div>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-lg md:text-xl font-black text-white mb-1 tracking-tight">
                <span className="text-yellow-300"> Build</span>  Your Personal <span className="text-yellow-300">Brand</span>
                </h3>
                <p className="text-[11px] md:text-xs font-medium text-white/60 max-w-md leading-relaxed">
                  Masuk ke etalase <span className="text-yellow-300"> konten kreator </span>kami dan berikan eksposur terbaik untuk karya Anda.
                </p>
              </div>
              
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 group-hover:translate-x-2 transition-all duration-500 shrink-0">
                <ArrowRight size={20} />
              </div>
            </div>
            
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
          </div>
        </Link>
      </div>

      <div className="w-full max-w-5xl mt-8">
        <FAQ />
      </div>
    </div>
  );
});

HomeClient.displayName = 'HomeClient';

export default HomeClient;
