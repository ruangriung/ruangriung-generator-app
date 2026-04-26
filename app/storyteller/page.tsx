// app/storyteller/page.tsx
import StorytellerClient from '@/components/StorytellerClient';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AuthButton from '@/components/AuthButton';

export const metadata: Metadata = {
  title: 'Buat Cerita AI - RuangRiung AI Generator',
  description: 'Hasilkan cerita visual dengan lima gambar unik dan deskripsi teks menggunakan AI. Cukup masukkan ide cerita Anda dan biarkan AI yang menciptakan narasinya.',
  keywords: ['AI storytelling', 'AI story generator', 'gambar AI', 'teks AI', 'generasi cerita', 'RuangRiung AI'],
  openGraph: {
    title: 'Buat Cerita AI - RuangRiung AI Generator',
    description: 'Hasilkan cerita visual dengan lima gambar unik dan deskripsi teks menggunakan AI. Cukup masukkan ide cerita Anda dan biarkan AI yang menciptakan narasinya.',
    url: 'https://ruangriung.my.id/storyteller', // Ganti dengan URL aplikasi Anda
    siteName: 'RuangRiung AI Generator',
    images: [
      {
        url: 'https://ruangriung.my.id/logo.png',
        width: 1200,
        height: 630,
        alt: 'AI Storytelling',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buat Cerita AI - RuangRiung AI Generator',
    description: 'Hasilkan cerita visual dengan lima gambar unik dan deskripsi teks menggunakan AI. Cukup masukkan ide cerita Anda dan biarkan AI yang menciptakan narasinya.',
    images: ['https://ruangriung.my.id/og-image/og-image-rr.png'],
  },
};

// Komponen halaman utama untuk rute /storyteller
export default async function StorytellerPage() {
  const session = await getServerSession(authOptions);

  // Jika pengguna belum login, tampilkan pesan akses terkunci dengan desain yang diperbaiki
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-primary-500/30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-12 flex justify-center">
            <Link
              href="/"
              className="group flex items-center gap-3 px-6 py-3 glass-button rounded-full text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Beranda
            </Link>
          </div>

          <div className="glass-card p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-[50px] rounded-full -mr-16 -mt-16" />
            
            <div className="h-24 w-24 rounded-[2.5rem] bg-primary-500/10 flex items-center justify-center text-primary-500 mx-auto mb-8 shadow-inner">
              <Lock size={40} className="drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" />
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              Akses <span className="text-primary-500">Terbatas</span>
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
              Halaman ini eksklusif untuk anggota. Silakan masuk untuk mulai menciptakan keajaiban cerita visual Anda.
            </p>
            
            <div className="space-y-4">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const softwareSchema = {
    name: 'RuangRiung AI Storyteller',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
    },
    description: 'Hasilkan cerita visual dengan lima gambar unik dan deskripsi teks menggunakan AI.',
  };

  const breadcrumbSchema = {
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: 'https://ruangriung.my.id',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'AI Storyteller',
        item: 'https://ruangriung.my.id/storyteller',
      },
    ],
  };

  // Jika pengguna sudah login, render konten halaman Storyteller yang sebenarnya
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 pt-20 selection:bg-primary-500/30">
      <div className="container mx-auto px-4 md:px-8">
        <JsonLd type="SoftwareApplication" data={softwareSchema} />
        <JsonLd type="BreadcrumbList" data={breadcrumbSchema} />
        
        <div className="mb-12 flex items-center justify-between gap-6">
          <Link
            href="/"
            className="group flex items-center gap-3 px-6 py-3 glass-button rounded-full text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Beranda
          </Link>
          <ThemeToggle />
        </div>

        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full -z-10" />
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 mb-6">
            Visual Storytelling
          </span>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl leading-tight">
            Cerita Visual <span className="text-primary-500">Ajaib</span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Biarkan AI merajut imajinasi Anda menjadi narasi visual yang memukau dalam lima babak unik.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <StorytellerClient />
        </div>
      </div>
    </div>
  );
}