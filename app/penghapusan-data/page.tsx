'use client';

import { Mail, MessageSquare, Send, ArrowLeft } from 'lucide-react'; // Import icons
import { useState } from 'react';
import Link from 'next/link';
import Accordion from '@/components/Accordion'; // Import Accordion

export default function DataRemovalPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Request Data Deletion',
    message: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatusMessage('');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatusMessage('Pesan Anda berhasil terkirim!');
        setFormData({ name: '', email: '', subject: 'Request Data Deletion', message: '' });
      } else {
        setStatusMessage('Terjadi kesalahan saat mengirim pesan.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('Kesalahan jaringan.');
    } finally {
      setIsSending(false);
    }
  };

  const inputStyle = "w-full p-4 rounded-xl glass-inset border-0 focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium outline-none";

  return (
    <main className="min-h-screen mesh-gradient py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="glass-card p-10 text-center space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-red-500/10 text-red-500 mb-2">
            <MessageSquare size={32} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Penghapusan Data
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Prosedur Keamanan Privasi Anda
          </p>
        </div>

        <div className="glass-card p-10 space-y-10">
          <section className="space-y-4">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-sm">1</span>
              Kebijakan Penghapusan
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Anda berhak meminta penghapusan permanen atas semua data pribadi yang kami simpan. Proses ini akan menghapus akun, riwayat prompt, dan semua preferensi Anda dari server kami.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-sm">2</span>
              Kirim Permintaan
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputStyle} placeholder="John Doe"/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Registered</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputStyle} placeholder="john@example.com"/>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Reason (Optional)</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  className={`${inputStyle} min-h-[120px] resize-none`} 
                  placeholder="Tell us why you want to delete your data..."
                />
              </div>
              <button
                type="submit"
                disabled={isSending}
                className="w-full glass-button py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
              >
                {isSending ? 'Sending Request...' : 'Confirm Data Deletion'}
              </button>
              {statusMessage && (
                <p className={`text-center text-[10px] font-black uppercase tracking-widest ${statusMessage.includes('berhasil') ? 'text-green-500' : 'text-red-500'}`}>
                  {statusMessage}
                </p>
              )}
            </form>
          </section>
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
