'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import AuthButton from '@/components/AuthButton';
import BYOPHandler from '@/components/BYOPHandler';
import { LayoutDashboard, History, Sparkles, CreditCard, ShieldCheck, Zap, ArrowLeft, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState<any[]>([]);
  const [historyCount, setHistoryCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('ruangriung_history');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setHistory(parsed);
      setHistoryCount(parsed.length);
    }
    setIsPremium(!!localStorage.getItem('pollinations_api_key'));
  }, []);

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-sm font-bold text-slate-500 animate-pulse">Menyiapkan Dashboard...</p>
      </div>
    </div>
  );

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="glass-card max-w-md w-full text-center space-y-8 p-10 border border-white/20 dark:border-white/5 shadow-2xl">
          <div className="h-20 w-20 bg-primary-500/10 rounded-3xl flex items-center justify-center mx-auto">
            <ShieldCheck size={40} className="text-primary-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black dark:text-white tracking-tight">Akses Terbatas</h1>
            <p className="text-slate-500 font-medium">Silakan masuk untuk melihat statistik dan mengelola akun Pro Anda.</p>
          </div>
          <div className="pt-4 flex justify-center">
            <AuthButton />
          </div>
          <Link href="/" className="inline-block text-sm font-bold text-primary-500 hover:underline">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 bg-slate-50 dark:bg-[#020617]">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumbs & Navigation */}
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-primary-500/10 text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-all font-bold text-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Generator
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Home size={12} />
            <span>Beranda</span>
            <span>/</span>
            <span className="text-primary-500">Dashboard</span>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 glass p-8 rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-2xl shadow-primary-500/5">
          <div className="relative">
            {session?.user?.image ? (
              <Image 
                src={session.user.image} 
                alt="Profile" 
                width={100} 
                height={100} 
                className="rounded-full border-4 border-primary-500/20"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-black text-3xl">
                {session?.user?.name?.[0] || 'U'}
              </div>
            )}
            {isPremium && (
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-2 rounded-full shadow-lg">
                <Zap size={16} fill="currentColor" />
              </div>
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Halo, {session?.user?.name}!</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">{isPremium ? 'PRO USER' : 'FREE USER'}</p>
            <p className="text-slate-400 text-sm mt-2">{session?.user?.email}</p>
          </div>
          <div className="w-full md:w-auto">
             <BYOPHandler />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Gambar', value: historyCount, icon: History, color: 'text-primary-500' },
            { label: 'Kuota Bulan Ini', value: 'Unlimited', icon: Sparkles, color: 'text-green-500' },
            { label: 'Model Tersedia', value: '30+', icon: LayoutDashboard, color: 'text-blue-500' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-black dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Section - Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Creations Gallery - Large Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-[50px] rounded-full -mr-16 -mt-16" />
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <Sparkles className="text-primary-500" />
                  Kreasi Terkini
                </h3>
                <Link href="/" className="text-xs font-bold text-primary-500 hover:underline uppercase tracking-widest">
                  Buat Baru
                </Link>
              </div>

              {history.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {history.slice(0, 6).map((item, i) => (
                    <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50">
                      <Image 
                        src={item.imageUrl} 
                        alt={item.prompt} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                        <p className="text-[10px] text-white font-medium line-clamp-2 leading-relaxed">
                          {item.prompt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center space-y-4 border-2 border-dashed border-white/5 rounded-3xl">
                  <div className="h-16 w-16 bg-slate-500/5 rounded-full flex items-center justify-center mx-auto text-slate-500">
                    <History size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-500">Belum ada riwayat kreasi.</p>
                  <Link href="/" className="inline-block px-6 py-2 rounded-xl bg-primary-500 text-white text-xs font-black uppercase">
                    Mulai Sekarang
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Access Tools */}
            <div className="glass-card p-8 space-y-6">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Zap className="text-amber-500" />
                Alat Peluncur Cepat
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'AI Storyteller', desc: 'Ubah ide jadi visual & narasi', path: '/storyteller', icon: Sparkles, color: 'bg-purple-500/10 text-purple-500' },
                  { name: 'Konten Kreator', desc: 'Riset & buat konten viral', path: '/konten-kreator', icon: Zap, color: 'bg-blue-500/10 text-blue-500' },
                  { name: 'ID Card Gen', desc: 'ID Card akademik instan', path: '/id-card-generator', icon: CreditCard, color: 'bg-green-500/10 text-green-500' },
                  { name: 'Visual Hub UMKM', desc: 'Asset visual untuk bisnis', path: '/umkm', icon: LayoutDashboard, color: 'bg-amber-500/10 text-amber-500' },
                ].map((tool, i) => (
                  <Link 
                    key={i} 
                    href={tool.path}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary-500/30 hover:bg-primary-500/5 transition-all group"
                  >
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${tool.color}`}>
                      <tool.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black group-hover:text-primary-500 transition-colors">{tool.name}</p>
                      <p className="text-[10px] font-bold text-slate-500">{tool.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info - Small Column */}
          <div className="space-y-8">
            <div className="glass-card p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[50px] rounded-full -mr-16 -mt-16" />
              <h3 className="text-xl font-black">Berlangganan</h3>
              <div className="p-5 rounded-2xl bg-slate-500/5 border border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Status Akun</span>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase ${isPremium ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-slate-500/10 text-slate-500'}`}>
                    {isPremium ? 'Active PRO' : 'Basic Member'}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${isPremium ? 'w-full bg-green-500' : 'w-1/4 bg-primary-500'} rounded-full`} />
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  {isPremium 
                    ? 'Selamat! Anda memiliki akses tanpa batas melalui kunci API Pollinations pribadi.' 
                    : 'Anda saat ini menggunakan akses gratis dengan fitur terbatas.'}
                </p>
                {!isPremium && (
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/25">
                    Upgrade ke Pro
                  </button>
                )}
              </div>
            </div>

            <div className="glass-card p-8 space-y-6">
              <h3 className="text-xl font-black flex items-center gap-2">
                <ShieldCheck className="text-primary-500" />
                Info BYOP
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                <strong>BYOP (Bring Your Own Pollen)</strong> menghubungkan akun <span className="text-primary-500 font-bold">Pollinations.ai</span> Anda untuk akses model premium tanpa batas.
              </p>
              <div className="space-y-2">
                {[
                  'Akses Flux Pro & OpenAI',
                  'Kecepatan Tinggi',
                  'Tanpa Watermark',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Creative Inspiration */}
            <div className="glass-card p-8 space-y-6 relative overflow-hidden bg-gradient-to-br from-primary-500/5 to-transparent">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Sparkles size={20} className="text-primary-500" />
                Inspirasi Kreatif
              </h3>
              <div className="space-y-4">
                {[
                  'Cyberpunk Bali city at night with neon lights',
                  'Ancient Javanese temple in a floating sky island',
                  'Futuristic Borobudur with holographic technology',
                  'Traditional Indonesian market in Studio Ghibli style',
                ].map((prompt, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-medium text-slate-500 hover:text-primary-500 cursor-pointer transition-colors">
                    "{prompt}"
                  </div>
                ))}
                <button className="w-full text-[10px] font-black uppercase text-primary-500 hover:underline">
                  Lihat Semua Ide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
