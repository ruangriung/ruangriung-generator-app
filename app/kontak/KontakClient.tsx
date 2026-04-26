'use client';

import { Mail, MessageSquare, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DynamicTurnstile = dynamic(
  () => import('@/components/TurnstileWidget'),
  {
    ssr: false,
    loading: () => (
      <div className="w-[300px] h-[65px] bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
    ),
  }
);

export default function KontakClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSending, setIsSending] = useState(false);
  const [token, setToken] = useState('');
  
  const inputStyle = "w-full p-4 rounded-xl glass-inset border-0 focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium outline-none";
  const textareaStyle = `${inputStyle} min-h-[150px] resize-none`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Silakan selesaikan verifikasi keamanan.');
      return;
    }
    setIsSending(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, token }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Pesan Anda berhasil terkirim!');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setToken('');
      } else {
        toast.error(`Gagal: ${data.message || 'Terjadi kesalahan.'}`);
      }
    } catch (error) {
      console.error('Error saat mengirim formulir:', error);
      toast.error('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen mesh-gradient py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="glass-card p-10 text-center space-y-6">
          <div className="inline-flex p-4 rounded-2xl bg-primary-500/10 text-primary-500">
            <Mail size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Hubungi Kami
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Punya pertanyaan atau butuh bantuan? Kami siap mendengarkan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-8 space-y-6">
              <h3 className="text-lg font-black uppercase tracking-tight">Direct Info</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</p>
                  <a href="mailto:admin@ruangriung.my.id" className="text-sm font-bold text-primary-500 hover:underline block truncate">
                    admin@ruangriung.my.id
                  </a>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Community Hub</p>
                  <a href="https://web.facebook.com/groups/1182261482811767/" target="_blank" className="text-sm font-bold text-primary-500 hover:underline block">
                    RuangRiung Group
                  </a>
                </div>
              </div>
            </div>
            <div className="glass-card p-8 bg-primary-500/5 border-primary-500/20">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "Setiap masukan Anda adalah energi bagi kami untuk terus berinovasi dan membangun ekosistem kreatif yang lebih baik."
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-card p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Name</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputStyle} placeholder="John Doe"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputStyle} placeholder="john@example.com"/>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                  <input type="text" name="subject" required value={formData.subject} onChange={handleChange} className={inputStyle} placeholder="How can we help?"/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                  <textarea name="message" required value={formData.message} onChange={handleChange} className={textareaStyle} placeholder="Tell us more..."/>
                </div>
                <div className="flex justify-center py-4">
                  <DynamicTurnstile onSuccess={setToken} />
                </div>
                <button
                  type="submit"
                  disabled={isSending || !token}
                  className="w-full glass-button py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>

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
