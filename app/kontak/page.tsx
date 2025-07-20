'use client';

import { Mail, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch('/api/contact', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // Kirim data form saja
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Pesan Anda berhasil terkirim!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(`Gagal mengirim pesan: ${data.message || 'Terjadi kesalahan.'}`);
      }
    } catch (error) {
      console.error('Error saat mengirim formulir:', error);
      toast.error('Terjadi kesalahan jaringan atau server.');
    } finally {
      setIsSending(false);
    }
  };

  const inputStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-gray-800 dark:text-gray-200";
  const textareaStyle = `${inputStyle} resize-none`;

  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-light-bg dark:bg-dark-bg p-6 md:p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Kontak Kami</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Punya pertanyaan atau masukan? Jangan ragu untuk menghubungi kami melalui formulir di bawah ini atau email langsung.</p>
        
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Anda</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Nama Lengkap" className={inputStyle} required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Anda</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="alamat@example.com" className={inputStyle} required />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subjek</label>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Perihal Pesan" className={inputStyle} required />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pesan Anda</label>
              <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} placeholder="Tulis pesan Anda di sini..." className={textareaStyle} required />
            </div>
            
            <button
              type="submit"
              disabled={isSending}
              className="w-full px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
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