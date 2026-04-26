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
  const [historyCount, setHistoryCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const history = localStorage.getItem('ruangriung_history');
    if (history) {
      setHistoryCount(JSON.parse(history).length);
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

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-8 space-y-6">
            <h3 className="text-xl font-black">Informasi Berlangganan</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-500/5 border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold">Status Akun</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-black uppercase ${isPremium ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-500'}`}>
                    {isPremium ? 'Active PRO' : 'Basic'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {isPremium 
                    ? 'Anda terhubung menggunakan kunci API Pollinations pribadi. Penggunaan tidak dibatasi oleh kuota aplikasi ini.' 
                    : 'Anda menggunakan kuota bersama. Hubungkan akun Pollinations untuk mengakses model premium.'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 space-y-6">
            <h3 className="text-xl font-black flex items-center gap-2">
              <ShieldCheck className="text-primary-500" />
              Apa itu BYOP (Pollen)?
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong>BYOP (Bring Your Own Pollen)</strong> memungkinkan Anda menggunakan akun <span className="text-primary-500 font-bold">Pollinations.ai</span> pribadi untuk mengakses model AI terbaik tanpa batas dari aplikasi ini.
              </p>
              <ul className="space-y-2">
                {[
                  'Akses Model Premium (Flux Pro, OpenAI, dll)',
                  'Tanpa biaya tambahan dari RuangRiung',
                  'Kontrol penuh atas penggunaan Anda sendiri',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Zap size={12} className="text-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
