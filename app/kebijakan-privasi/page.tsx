// app/kebijakan-privasi/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Accordion from '@/components/Accordion'; // Import Accordion component
import { Lock, Sparkles, Cloud, Globe, Github, Brain, CloudLightning, Zap, ArrowLeft } from 'lucide-react'; // Import icons
import Image from 'next/image'; // Import Image for external icons

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - RuangRiung Generator',
};

export default function KebijakanPrivasiPage() {
  return (
    <main className="min-h-screen mesh-gradient py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="glass-card p-10 text-center space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-primary-500/10 text-primary-500 mb-2">
            <Lock size={32} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Kebijakan Privasi
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Terakhir diperbarui: 11 Juli 2025
          </p>
        </div>

        <div className="glass-card p-10 space-y-8">
          <div className="prose prose-premium dark:prose-invert max-w-none">
            <div className="space-y-12">
              <section className="space-y-4">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-sm">1</span>
                  Informasi yang Kami Kumpulkan
                </h2>
                <p>Kami mengumpulkan beberapa jenis informasi untuk berbagai tujuan guna menyediakan dan meningkatkan Layanan kami kepada Anda.</p>
                <div className="glass-inset p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest">Data Pribadi</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Saat menggunakan Layanan kami, terutama saat login dengan Google, kami dapat meminta Anda untuk memberikan kami informasi pengenal pribadi tertentu. Informasi ini meliputi:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['Alamat Email', 'Nama Lengkap', 'URL Gambar Profil'].map((item) => (
                      <li key={item} className="glass-button p-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-sm">2</span>
                  Bagaimana Kami Menggunakan Informasi
                </h2>
                <ul className="grid gap-4">
                  {[
                    'Menyediakan dan memelihara Layanan kami.',
                    'Mengelola Akun dan akses fitur otentikasi.',
                    'Menghubungi Anda terkait pembaruan layanan.',
                    'Analisis internal untuk pengalaman pengguna.'
                  ].map((text, i) => (
                    <li key={i} className="flex gap-4 p-4 rounded-xl glass-inset text-sm">
                      <Zap size={16} className="text-primary-500 shrink-0 mt-1" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-6">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-sm">3</span>
                  Penyedia Layanan Pihak Ketiga
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Google Auth', icon: <Image src="/google-icon.svg" alt="G" width={14} height={14} />, url: 'https://accounts.google.com/' },
                    { name: 'Pollinations.ai', icon: <Sparkles size={14} />, url: 'https://pollinations.ai/' },
                    { name: 'Vercel Hosting', icon: <Cloud size={14} />, url: 'https://vercel.com/' },
                    { name: 'Cloudflare', icon: <CloudLightning size={14} />, url: 'https://www.cloudflare.com/' },
                    { name: 'GitHub', icon: <Github size={14} />, url: 'https://github.com/' },
                    { name: 'OpenAI', icon: <Brain size={14} />, url: 'https://openai.com/' }
                  ].map((item) => (
                    <a 
                      key={item.name} 
                      href={item.url} 
                      target="_blank" 
                      className="flex items-center gap-4 p-4 rounded-xl glass-button group"
                    >
                      <div className="p-2 rounded-lg bg-slate-500/10 group-hover:bg-primary-500/20 transition-colors">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                    </a>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-sm">4</span>
                  Keamanan Data
                </h2>
                <div className="p-6 rounded-2xl bg-primary-500/5 border border-primary-500/10">
                  <p className="text-sm">
                    Kami berusaha untuk menggunakan cara yang dapat diterima secara komersial untuk melindungi Data Pribadi Anda, meskipun tidak ada metode transmisi melalui Internet yang 100% aman.
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-500/10">
                <div className="space-y-4">
                  <h3 className="text-lg font-black uppercase tracking-tight">Hak Anda</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Anda berhak untuk mengakses, memperbarui, atau meminta penghapusan informasi pribadi Anda melalui Prosedur Penghapusan Data.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-black uppercase tracking-tight">Kontak Kami</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Ada pertanyaan? Hubungi tim admin kami di <a href="mailto:admin@ruangriung.my.id" className="text-primary-500 font-bold hover:underline">admin@ruangriung.my.id</a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center pt-8">
          <Link 
            href="/" 
            className="glass-button px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
