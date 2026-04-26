// app/components/Footer.tsx
import Link from 'next/link';
import { Zap, Hexagon, Key, Palette, Sparkles, Cloud, Github, Brain, CloudLightning, Feather, Move, Server, Code, Package, ClipboardList, Brush, Star, Heart, Facebook } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-32 border-t border-white/5 bg-slate-50/50 dark:bg-[#030712]/50 backdrop-blur-xl px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-20">
          {/* Brand Column */}
          <div className="space-y-8 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-200/50 dark:bg-white/10 flex items-center justify-center shadow-xl shadow-primary-500/10 overflow-hidden border border-white/20 backdrop-blur-sm shrink-0">
                <img src="/logo.webp" alt="RuangRiung Logo" className="h-8 w-8 object-contain" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Ruang<span className="text-primary-500">Riung</span>
              </h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed text-sm uppercase tracking-wider">
              Transformasikan imajinasi Anda menjadi visual menakjubkan dengan platform AI tercanggih di Indonesia.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/ruangriung" className="h-12 w-12 rounded-full glass-button">
                <Github size={20} />
              </a>
              <a href="https://facebook.com/groups/ruangriung" className="h-12 w-12 rounded-full glass-button">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="lg:col-span-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Infrastructure</h3>
            <ul className="space-y-5">
              {[
                { label: 'Pollinations.ai', href: 'https://pollinations.ai/', icon: Sparkles, color: 'text-yellow-500' },
                { label: 'Vercel Edge', href: 'https://vercel.com/', icon: Cloud, color: 'text-blue-500' },
                { label: 'OpenAI API', href: 'https://openai.com/', icon: Brain, color: 'text-teal-500' },
                { label: 'Lucide Icons', href: 'https://lucide.dev/', icon: Feather, color: 'text-pink-500' },
              ].map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-all group">
                    <div className="h-10 w-10 rounded-xl bg-slate-500/5 flex items-center justify-center group-hover:bg-primary-500/10 transition-colors">
                      <link.icon size={18} className={`${link.color} transition-transform group-hover:scale-110`} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Creative Tools */}
          <div className="lg:col-span-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Alat Kreatif</h3>
            <ul className="space-y-5">
              {[
                { label: 'Keyword Generator', href: '/UniqueArtName' },
                { label: 'Storyteller AI', href: '/storyteller' },
                { label: 'UMKM Directory', href: '/umkm' },
                { label: 'ID Card Generator', href: '/id-card-generator' },
                { label: 'Kumpulan Prompt', href: '/kumpulan-prompt' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Navigasi</h3>
            <ul className="space-y-5">
              {[
                { label: 'Tentang Kami', href: '/tentang-kami' },
                { label: 'Ketentuan Layanan', href: '/ketentuan-layanan' },
                { label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
                { label: 'Kontak Support', href: '/kontak' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-primary-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* System Info */}
          <div className="lg:col-span-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Engine Status</h3>
            <div className="space-y-4 relative">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-3">
                <span className="text-slate-500">Status</span>
                <span className="flex items-center gap-2 text-green-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest pt-1">
                <span className="text-slate-500">Engine</span>
                <span className="text-primary-500">v3.0.0-glass</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
            &copy; {currentYear} RuangRiung. Crafted with <Heart className="inline-block text-primary-500 h-3 w-3 animate-pulse" /> by <a href="https://ariftirtana.my.id" className="text-primary-500 hover:underline">Arif Tirtana</a>
          </p>
          
          <div className="flex items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div id="histats_counter"></div>
            <noscript>
              <a href="/" target="_blank">
                <img src="//sstatic1.histats.com/0.gif?4944741&101" alt="" style={{border:0}} />
              </a>
            </noscript>
          </div>
        </div>
      </div>
    </footer>
  );
}
