// app/kontak/page.tsx

'use client';

import { Mail, MessageSquare, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AdBanner } from '@/components/AdBanner';

const DynamicTurnstile = dynamic(
  () => import('@/components/TurnstileWidget'),
  {
    ssr: false,
    loading: () => (
      <div className="w-[300px] h-[65px] bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
    ),
  }
);

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSending, setIsSending] = useState(false);
  const [token, setToken] = useState('');
  
  const inputStyle = "mt-1 block w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-gray-800 dark:text-gray-200";
  const textareaStyle = `${inputStyle} resize-vertical`;

  const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="mb-8 flex justify-center">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <ArrowLeft size={18} />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">Hubungi Kami</h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Punya pertanyaan, saran, atau butuh bantuan? Kami siap mendengarkan.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama</label>
              <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className={inputStyle}/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className={inputStyle}/>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subjek</label>
              <input type="text" name="subject" id="subject" required value={formData.subject} onChange={handleChange} className={inputStyle}/>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pesan</label>
              <textarea name="message" id="message" rows={5} required value={formData.message} onChange={handleChange} className={textareaStyle}></textarea>
            </div>
            
            <div className="flex justify-center items-center py-4">
              <DynamicTurnstile onSuccess={setToken} />
            </div>

            <button
              type="submit"
              disabled={isSending || !token}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-400 disabled:cursor-not-allowed"
            >
              {isSending ? 'Mengirim...' : 'Kirim Pesan'}
            </button>
          </form>

          <hr className="my-6 border-gray-300 dark:border-gray-600" />

          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Email Langsung</h2>
              <p className="text-gray-700 dark:text-gray-300">Untuk pertanyaan umum, kemitraan, atau dukungan teknis.</p>
              <a href="mailto:admin@ruangriung.my.id" className="text-purple-600 dark:text-purple-400 hover:underline">admin@ruangriung.my.id</a>
            </div>
          </div>
          <div className="flex items-start gap-4 mt-4">
            <MessageSquare className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Media Sosial</h2>
              <p className="text-gray-700 dark:text-gray-300">Ikuti kami untuk update terbaru.</p>
              <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">Kunjungi Profil Kami</a>
            </div>
          </div>
          
          <div className="w-full my-6 flex justify-center">
            <AdBanner dataAdSlot="6897039624" />
          </div>

        </div>
      </div>
    </main>
  );
}