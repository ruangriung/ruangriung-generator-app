// app/kontak/page.tsx

'use client';

import { Mail, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Turnstile } from '@marsidev/react-turnstile';

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSending, setIsSending] = useState(false);
  const [token, setToken] = useState('');

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
        // Token akan di-reset otomatis saat Turnstile widget dirender ulang,
        // tapi kita juga bisa membersihkannya secara manual jika perlu
        setToken('');
      } else {
        toast.error(`Gagal mengirim pesan: ${data.message || 'Terjadi kesalahan.'}`);
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
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">Hubungi Kami</h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Punya pertanyaan, saran, atau butuh bantuan? Kami siap mendengarkan.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ...semua input Anda (name, email, subject, message)... */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama</label>
              <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subjek</label>
              <input type="text" name="subject" id="subject" required value={formData.subject} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pesan</label>
              <textarea name="message" id="message" rows={5} required value={formData.message} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"></textarea>
            </div>
            
            <div className="flex justify-center items-center py-4">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
                onSuccess={(token) => setToken(token)}
              />
            </div>
            
            <button
              type="submit"
              // ---- PERUBAHAN DI SINI ----
              // Tombol akan nonaktif jika sedang mengirim ATAU jika token kosong
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
          <div className="flex items-start gap-4">
            <MessageSquare className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Media Sosial</h2>
              <p className="text-gray-700 dark:text-gray-300">Ikuti kami untuk mendapatkan pembaruan terbaru.</p>
              <a href="https://web.facebook.com/groups/1182261482811767/" className="text-purple-600 dark:text-purple-400 hover:underline">[RuangRiung Group]</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}