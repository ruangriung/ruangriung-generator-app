'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, LayoutGrid, Rss, Mail, Menu, X, Building2, LayoutDashboard, ChevronDown, ImageIcon, Video, Music, Film, BookOpen, QrCode, MessageSquare, HelpCircle } from 'lucide-react';
import AuthButton from './AuthButton';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ onOpenHelp }: { onOpenHelp: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      if (navRef.current && !navRef.current.contains(targetNode)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent background scroll and hide floating elements when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    return () => document.body.classList.remove('mobile-menu-open');
  }, [isMobileMenuOpen]);

  return (
    <nav 
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 px-4 py-4 ${
        isScrolled ? 'top-2' : 'top-0'
      }`}
    >
      <div 
        className={`max-w-7xl mx-auto glass rounded-[2rem] border border-white/20 dark:border-white/10 transition-all duration-500 ${
          isScrolled ? 'shadow-2xl shadow-primary-500/10 py-2 px-4' : 'py-3 px-6'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-full bg-slate-200/50 dark:bg-white/10 flex items-center justify-center shadow-lg shadow-primary-500/10 group-hover:scale-110 transition-transform overflow-hidden border border-white/20 backdrop-blur-sm">
              <Image src="/logo.webp" alt="RuangRiung Logo" width={28} height={28} className="object-contain" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white block sm:block">
              Ruang<span className="gradient-text">Riung</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-500/10 transition-all"
            >
              <LayoutDashboard size={16} className="text-primary-500" />
              <span>Dashboard</span>
            </Link>

            {/* Dropdown: Tools Kreatif */}
            <div className="relative group px-1">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-500/10 transition-all">
                <Sparkles size={16} className="text-primary-500" />
                <span>Tools Kreatif</span>
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              <div className="absolute top-full left-0 pt-2 w-64 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-[110]">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2 grid grid-cols-1 gap-1">
                  {[
                    { label: 'StoryTeller AI', href: '/storyteller', icon: BookOpen, desc: 'Buat cerita naratif' },
                    { label: 'Tema Unik', href: '/UniqueArtName', icon: Sparkles, desc: 'Nama seni unik' },
                    { label: 'ID CARD Gen', href: '/id-card-generator', icon: QrCode, desc: 'Kartu identitas otomatis' },
                    { label: 'Bubble Komentar', href: '/comment-overlay', icon: MessageSquare, desc: 'Overlay komentar live' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary-500/10 transition-all group/item"
                    >
                      <div className="h-8 w-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500 group-hover/item:scale-110 transition-transform">
                        <link.icon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white">{link.label}</p>
                        <p className="text-[10px] text-slate-500 font-bold leading-tight">{link.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Dropdown: Eksplorasi */}
            <div className="relative group px-1">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-500/10 transition-all">
                <LayoutGrid size={16} className="text-primary-500" />
                <span>Eksplorasi</span>
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              <div className="absolute top-full left-0 pt-2 w-56 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-[110]">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2">
                  {[
                    { label: 'Prompt Library', href: '/kumpulan-prompt', icon: Sparkles, desc: 'Inspirasi prompt kreatif' },
                    { label: 'Artikel & Berita', href: '/artikel', icon: Rss, desc: 'Update info terbaru' },
                    { label: 'Direktori UMKM', href: '/umkm', icon: Building2, desc: 'Dukungan bisnis lokal' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary-500/10 transition-all group/item"
                    >
                      <div className="h-8 w-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500 group-hover/item:scale-110 transition-transform">
                        <link.icon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white">{link.label}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{link.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Dropdown: Bantuan */}
            <div className="relative group px-1">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-500/10 transition-all relative">
                <HelpCircle size={16} className="text-primary-500" />
                <span>Bantuan</span>
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-primary-500 text-[8px] text-white items-center justify-center font-black">!</span>
                </span>
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              <div className="absolute top-full right-0 pt-2 w-64 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-[110]">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2">
                  <Link
                    href="/kontak"
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary-500/10 transition-all group/item"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500 group-hover/item:scale-110 transition-transform">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">Hubungi Kami</p>
                      <p className="text-[10px] text-slate-500 font-bold">Bantuan & kerjasama</p>
                    </div>
                  </Link>

                  <div className="h-px bg-slate-200 dark:bg-slate-800 my-1 mx-2" />

                  <button
                    onClick={onOpenHelp}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary-500/10 transition-all w-full text-left group/item"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500 group-hover/item:scale-110 transition-transform">
                      <HelpCircle size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">Panduan Penggunaan</p>
                      <p className="text-[10px] text-slate-500 font-bold">Tutorial cara pakai</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <AuthButton />
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
              <ThemeToggle />
            </div>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden h-10 w-10 flex items-center justify-center rounded-xl glass text-slate-900 dark:text-white"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden transition-all duration-500 ease-in-out ${
            isMobileMenuOpen ? 'max-h-[80vh] opacity-100 py-6 border-t border-white/10 mt-4 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="flex flex-col gap-2 px-2 pb-24">
             {[
              { label: 'StoryTeller AI', href: '/storyteller', icon: BookOpen },
              { label: 'ID CARD Gen', href: '/id-card-generator', icon: QrCode },
              { label: 'Bubble Komentar', href: '/comment-overlay', icon: MessageSquare },
              { label: 'Prompt Library', href: '/kumpulan-prompt', icon: Sparkles },
              { label: 'Artikel & Berita', href: '/artikel', icon: Rss },
              { label: 'Dashboard Akun', href: '/dashboard', icon: LayoutDashboard },
              { label: 'Hubungi Kami', href: '/kontak', icon: Mail },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/10 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 font-bold transition-colors"
              >
                <link.icon size={20} className="text-primary-500" />
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { onOpenHelp(); setIsMobileMenuOpen(false); }}
              className="flex items-center justify-between px-4 py-3 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 font-bold transition-all"
            >
              <div className="flex items-center gap-4">
                <HelpCircle size={20} />
                <span>Panduan Penggunaan</span>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-primary-500 text-white text-[10px] font-black animate-pulse">NEW V2</span>
            </button>
            <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-white/10 px-2">
              <AuthButton />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
