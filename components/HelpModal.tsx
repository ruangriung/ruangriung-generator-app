'use client';

import { memo } from 'react';
import { X, RefreshCw, Wand2, Sparkles, MessageSquare, Megaphone, Download, AppWindow, EarthIcon, BookOpen, QrCode, Key, CheckCircle } from 'lucide-react';
import { useUI } from '@/context/UIContext';

const HelpModal = memo(() => {
  const { isHelpOpen, closeHelp } = useUI();
  
  if (!isHelpOpen) return null;
  
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      onClick={closeHelp}
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
            onClick={closeHelp}
            aria-label="Tutup panduan"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-10">
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
                  <div className="flex gap-3 text-xs text-slate-600 dark:text-slate-400">
                    <Sparkles size={14} className="text-primary-500 shrink-0" />
                    <span><b>UI Glassmorphism:</b> Desain premium, modern, dan transparan.</span>
                  </div>
                  <div className="flex gap-3 text-xs text-slate-600 dark:text-slate-400">
                    <Wand2 size={14} className="text-primary-500 shrink-0" />
                    <span><b>Alat AI All-in-One:</b> Satu tempat untuk gambar, video, dan audio.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500">
                <Sparkles size={16} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
                Cara Menggunakan RuangRiung
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-primary-500 font-black text-[10px] uppercase">
                  <Wand2 size={14} /> Generator Gambar
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Pilih model AI, ketik prompt deskripsi gambar Anda, dan klik "Buat Gambar". Gunakan model HD atau Ultra untuk kualitas maksimal.
                </p>
              </div>
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-primary-500 font-black text-[10px] uppercase">
                  <MessageSquare size={14} /> RR Chatbot
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Asisten AI kami dapat membantu Anda membuat deskripsi prompt, menerjemahkan, atau sekadar berdiskusi tentang ide kreatif Anda.
                </p>
              </div>
            </div>
          </section>

          <section className="p-8 rounded-[2rem] bg-gradient-to-br from-primary-600 to-indigo-600 text-white space-y-4">
            <h3 className="text-xl font-black uppercase tracking-tight">Butuh Bantuan Lebih?</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Jika Anda menemukan kendala atau ingin memberikan masukan, jangan ragu untuk menghubungi kami melalui halaman kontak atau bergabung di grup komunitas kami.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <a href="/kontak" className="px-6 py-3 bg-white text-primary-600 rounded-full text-xs font-black uppercase hover:scale-105 transition-all">Kontak Kami</a>
              <a href="https://facebook.com/groups/ruangriung" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/10 text-white rounded-full text-xs font-black uppercase border border-white/20 hover:bg-white/20 transition-all">Facebook Group</a>
            </div>
          </section>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/5 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            RuangRiung AI Generator &copy; 2026 • Versi 2.0.0 Stable
          </p>
        </div>
      </div>
    </div>
  );
});

HelpModal.displayName = 'HelpModal';

export default HelpModal;
