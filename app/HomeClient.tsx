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
import Navbar from '@/components/Navbar';
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

const HelpModal = memo(({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-[2.5rem] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-white/20 dark:border-primary-500/10 p-6 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-300"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="space-y-1">
            <h2
              id="help-modal-title"
              className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase"
            >
              Panduan <span className="text-primary-500">RuangRiung AI</span>
            </h2>
            <div className="h-1 w-20 bg-primary-500 rounded-full" />
          </div>
          <button
            type="button"
            className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 transition-all hover:bg-red-500 hover:text-white hover:rotate-90"
            onClick={onClose}
            aria-label="Tutup panduan"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-10">
          {/* Section: Apa yang Baru (Evolusi V2) */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                <RefreshCw size={16} className="animate-spin-slow" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                Evolusi RuangRiung V2 (Apa yang Baru?)
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="glass-card p-6 bg-gradient-to-br from-orange-500/5 to-primary-500/5 border-orange-500/20">
                <p className="text-[11px] md:text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Selamat datang di era baru RuangRiung! Kami telah merombak total antarmuka untuk pengalaman yang lebih cepat, profesional, dan bertenaga AI:
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                      <Sparkles size={10} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Tabbed Workspace</p>
                      <p className="text-[9px] text-slate-500">Semua tools dalam satu panel rapi.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                      <Sparkles size={10} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">RR Agent Assistant</p>
                      <p className="text-[9px] text-slate-500">Bantuan cerdas di setiap langkah.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
                      <Sparkles size={10} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">BYOP (Advanced)</p>
                      <p className="text-[9px] text-slate-500">Akses model premium tanpa batas.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-5 w-5 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                      <Sparkles size={10} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Ultra Responsive</p>
                      <p className="text-[9px] text-slate-500">Nyaman di HP maupun Tablet.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Fitur Lanjutan (BYOP) */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
              <Key size={14} className="text-primary-500" />
              Fitur Lanjutan (BYOP)
            </h3>
            <div className="glass-inset p-5 rounded-3xl space-y-4">
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                <strong>Bring Your Own Provider (BYOP)</strong> memungkinkan Anda memasukkan API Key pribadi (misalnya dari OpenAI atau Pollinations) untuk mendapatkan performa maksimal.
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <CheckCircle size={12} className="text-green-500" />
                  <span>Kunci API disimpan aman secara lokal di browser Anda.</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <CheckCircle size={12} className="text-green-500" />
                  <span>Akses model elit & PAID: <b className="text-slate-700 dark:text-slate-300">Grok Imagine, Pruna, Wan Pro, OpenAI.</b></span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <CheckCircle size={12} className="text-green-500" />
                  <span>Membuka 🍌NanoBanana, Video Pro (Veo 3.1, Wan), & Nova Canvas.</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <CheckCircle size={12} className="text-green-500" />
                  <span>Buka melalui tombol [Pengaturan Lanjutan] di panel generator.</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-slate-400 italic mt-2 border-t border-slate-100 dark:border-white/5 pt-2">
                  <Github size={10} />
                  <span>Wajib login menggunakan akun GitHub di Pollinations.ai</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Navigasi */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
              <LayoutGrid size={14} className="text-primary-500" />
              Navigasi Pusat
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Sparkles, label: 'Prompt Library', desc: 'Galeri inspirasi prompt AI' },
                { icon: Building2, label: 'Direktori UMKM', desc: 'Dukung bisnis lokal kita' },
                { icon: Rss, label: 'Artikel & Tips', desc: 'Wawasan dunia AI terbaru' },
                { icon: BookOpen, label: 'StoryTeller', desc: 'Narasi visual bertenaga AI' },
              ].map((item, idx) => (
                <div key={idx} className="glass-inset p-4 rounded-2xl flex items-start gap-3 hover:bg-primary-500/5 transition-colors cursor-default">
                  <div className="h-8 w-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
                    <item.icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase leading-none mb-1">{item.label}</p>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Fitur AI */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
              <Wand2 size={14} className="text-accent-500" />
              Alat Generasi AI
            </h3>
            <div className="space-y-3">
              <div className="glass-card !bg-primary-500/5 p-5 border-l-4 border-primary-500">
                <div className="flex items-center gap-3 mb-2">
                  <ImageIcon size={18} className="text-primary-500" />
                  <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">Text to Image</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Ubah deskripsi teks menjadi gambar artistik. Anda bisa memilih berbagai model AI (Flux, DALL-E, Pollinations) dan menerapkan gaya seni (Cyberpunk, Anime, Realistik) secara instan.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="glass-card p-5">
                   <div className="flex items-center gap-3 mb-2">
                    <RefreshCw size={16} className="text-accent-500" />
                    <h4 className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">Video & Audio</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    Generate video singkat dari prompt atau ubah teks menjadi audio narasi berkualitas tinggi.
                  </p>
                </div>
                <div className="glass-card p-5 bg-gradient-to-br from-primary-500/10 to-transparent">
                   <div className="flex items-center gap-3 mb-2">
                    <RefreshCw size={16} className="text-primary-500" />
                    <h4 className="text-xs font-black uppercase tracking-tight text-slate-900 dark:text-white">Submit Prompt</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    Punya prompt yang keren? Bagikan ke komunitas RuangRiung dan jadilah inspirasi bagi kreator lain.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: BYOP & Advanced */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
              <RefreshCw size={14} className="text-blue-500" />
              Advanced & BYOP
            </h3>
            <div className="glass-card p-6 border-dashed border-2 border-primary-500/20 bg-slate-500/5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-500/20">
                  <RefreshCw size={20} className="animate-spin-slow" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white mb-2">Bring Your Own Provider (BYOP)</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-4">
                    Gunakan kunci API pribadi Anda (seperti OpenAI, Gemini, atau Groq) untuk mendapatkan kontrol penuh atas biaya dan performa. Kunci disimpan secara aman di perangkat lokal Anda.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary-500/10 text-primary-500 text-[10px] font-black uppercase tracking-widest">
                    Cek di Pengaturan Lanjut
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            type="button"
            className="glass-button w-full sm:w-auto px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-primary-500 hover:bg-primary-500 hover:text-white transition-all shadow-xl shadow-primary-500/10"
            onClick={onClose}
          >
            Paham, Mari Mulai!
          </button>
          <a
            href="/kontak"
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-500 transition-colors"
          >
            Butuh Bantuan Lain?
          </a>
        </div>
      </div>
    </div>
  );
});

HelpModal.displayName = 'HelpModal';

const HomeClient = memo(({ latestArticle }: HomeClientProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

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
        setIsHelpOpen(false);
        setIsToolsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleToolsMenu = useCallback(() => setIsToolsMenuOpen(prev => !prev), []);
  const openHelp = useCallback(() => setIsHelpOpen(true), []);
  const closeHelp = useCallback(() => setIsHelpOpen(false), []);
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
      <Navbar onOpenHelp={openHelp} />
      
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

      <HelpModal
        isOpen={isHelpOpen}
        onClose={closeHelp}
      />
    </div>
  );
});

HomeClient.displayName = 'HomeClient';

export default HomeClient;
