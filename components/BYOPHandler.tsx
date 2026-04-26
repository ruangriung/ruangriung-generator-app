'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Key, Unplug, ShieldCheck, Info, FlaskConical, Github } from 'lucide-react';

export default function BYOPHandler({ onKeyChange }: { onKeyChange?: () => void }) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Cek fragment URL untuk api_key setelah redirect dari Pollinations
    const hash = window.location.hash;
    if (hash.includes('api_key=')) {
      const params = new URLSearchParams(hash.slice(1));
      const key = params.get('api_key');
      if (key) {
        localStorage.setItem('pollinations_api_key', key);
        setApiKey(key);
        if (onKeyChange) onKeyChange();
        // Bersihkan URL fragment
        window.history.replaceState(null, '', window.location.pathname);
        toast.success('Berhasil terhubung ke Pollinations Pro!');
      }
    } else {
      // 2. Cek local storage jika sudah ada sebelumnya
      const storedKey = localStorage.getItem('pollinations_api_key');
      if (storedKey) {
        setApiKey(storedKey);
      }
    }
  }, [onKeyChange]);

  const handleConnect = () => {
    const params = new URLSearchParams({
      redirect_uri: window.location.origin + window.location.pathname,
      client_id: 'pk_hprMp1nmhXOvJE7H', 
      scope: 'usage keys',
      expiry: '30',
      budget: '10'
    });
    window.location.href = `https://enter.pollinations.ai/authorize?${params.toString()}`;
  };

  const handleDisconnect = () => {
    localStorage.removeItem('pollinations_api_key');
    setApiKey(null);
    if (onKeyChange) onKeyChange();
    toast.success('Koneksi Pollinations diputuskan.');
  };

  if (apiKey) {
    return (
      <div className="flex items-center gap-3 p-3 glass rounded-2xl border border-green-500/30 bg-green-500/5">
        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
          <ShieldCheck size={18} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">Pollinations Connected</p>
          <p className="text-xs font-mono text-slate-500 truncate w-32">sk_••••••••{apiKey.slice(-4)}</p>
        </div>
        <button 
          onClick={handleDisconnect}
          className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors rounded-lg"
          title="Putuskan Koneksi"
        >
          <Unplug size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative group/byop w-full">
      <button 
        onClick={handleConnect}
        className="flex items-center gap-3 p-3 glass rounded-2xl border-2 border-primary-500/30 bg-primary-500/5 hover:bg-primary-500/10 transition-all w-full text-left group"
      >
        <div className="h-8 w-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
          <Key size={18} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">Gunakan Pollen Sendiri (PRO)</p>
          <p className="text-[10px] text-slate-500 font-bold">Hubungkan akun Pollinations Anda</p>
        </div>
        <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-primary-500 transition-colors">
          <Info size={12} />
        </div>
      </button>

      {/* Tooltip Content */}
      <div className="absolute bottom-full left-0 mb-4 w-72 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl opacity-0 invisible group-hover/byop:opacity-100 group-hover/byop:visible transition-all duration-300 z-[250] border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-2 text-primary-400">
          <FlaskConical size={14} />
          <h4 className="text-xs font-black uppercase tracking-widest">Apa itu BYOP?</h4>
        </div>
        <p className="text-[10px] leading-relaxed text-slate-300 font-medium">
          <strong className="text-white font-black text-[11px] block mb-1 underline decoration-primary-500/50">Bring Your Own Pollen (BYOP)</strong>
          Gunakan API Key Pollinations Anda sendiri untuk membuka fitur eksklusif:
        </p>
        <ul className="mt-2 space-y-1.5">
          <li className="flex items-start gap-2 text-[10px] text-slate-300">
            <span className="text-primary-500 mt-0.5">•</span>
            <span>Model Elit & PAID: <b className="text-white">Flux Pro, OpenAI, Pruna, Grok Imagine, Wan Pro</b></span>
          </li>
          <li className="flex items-start gap-2 text-[10px] text-slate-300">
            <span className="text-primary-500 mt-0.5">•</span>
            <span>Membuka generator <b className="text-white">Video Pro: Veo 3.1, Wan 2.6, Seedance, Grok Video</b></span>
          </li>
          <li className="flex items-start gap-2 text-[10px] text-slate-300">
            <span className="text-primary-500 mt-0.5">•</span>
            <span>Model Gambar Unik: <b className="text-white">🍌NanoBanana, Nova Canvas, Seedream, Pruna</b></span>
          </li>
          <li className="flex items-start gap-2 text-[10px] text-slate-300">
            <span className="text-primary-500 mt-0.5">•</span>
            <span>Prioritas antrean & kecepatan maksimal</span>
          </li>
        </ul>
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-[9px] text-slate-400 italic font-medium flex items-center flex-wrap gap-1">
            <span>*Memerlukan saldo (pollen) di akun Pollinations.ai. Pastikan Anda login menggunakan</span>
            <span className="inline-flex items-center gap-0.5 text-slate-300">
              <Github size={10} />
              <b className="not-italic">GitHub</b>
            </span>
            <span>untuk mengakses model Pro.</span>
          </p>
        </div>
        <div className="absolute -bottom-2 left-8 w-4 h-4 bg-slate-900 rotate-45 border-r border-b border-white/10"></div>
      </div>
    </div>
  );
}
