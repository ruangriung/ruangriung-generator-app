'use client';

import { Metadata } from 'next'; // Metadata di page.tsx client component tidak langsung diekspor, tapi ini ada untuk tipe saja
import { Mail, MessageSquare, Send } from 'lucide-react'; // Import Send icon
import { useState } from 'react';
import Accordion from '@/components/Accordion'; // Import Accordion

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatusMessage('Pesan Anda berhasil terkirim!');
        setFormData({ name: '', email: '', subject: '', message: '' }); // Bersihkan formulir
      } else {
        setStatusMessage(`Gagal mengirim pesan: ${data.message || 'Terjadi kesalahan.'}`);
      }
    } catch (error) {
      console.error('Error saat mengirim formulir:', error);
      setStatusMessage('Terjadi kesalahan jaringan atau server.');
    } finally {
      setIsSending(false);
    }
  };

  // Menggunakan style yang sudah konsisten dengan tema neumorphic
  const inputStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-gray-800 dark:text-gray-200";
  const textareaStyle = `${inputStyle} resize-none`;

  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8"> {/* <-- PERUBAHAN: Background theme */}
      <div className="max-w-4xl mx-auto bg-light-bg dark:bg-dark-bg p-6 md:p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic"> {/* <-- PERUBAHAN: Background & Shadow theme */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Kontak Kami</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Punya pertanyaan atau masukan? Jangan ragu untuk menghubungi kami melalui formulir di bawah ini atau opsi kontak langsung.</p> {/* <-- PERUBAHAN: Text color theme */}
        
        <div className="space-y-6">
          {/* Formulir Kontak */}
          <Accordion title={<h2 className="text-xl font-semibold flex items-center gap-2"><Send size={20}/>Kirim Pesan</h2>}>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2"> {/* Added pt-2 for spacing inside accordion */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Anda</label> {/* <-- PERUBAHAN: Text color theme */}
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nama Lengkap"
                  className={inputStyle}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Anda</label> {/* <-- PERUBAHAN: Text color theme */}
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alamat@example.com"
                  className={inputStyle}
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subjek</label> {/* <-- PERUBAHAN: Text color theme */}
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Perihal Pesan"
                  className={inputStyle}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pesan Anda</label> {/* <-- PERUBAHAN: Text color theme */}
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tulis pesan Anda di sini..."
                  className={textareaStyle}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSending}
                className="w-full px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed active:shadow-inner dark:active:shadow-dark-neumorphic-button-active" // <-- PERUBAHAN: Shadow theme
              >
                {isSending ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
              {statusMessage && (
                <p className={`mt-4 text-center ${statusMessage.includes('berhasil') ? 'text-green-600' : 'text-red-600'}`}>
                  {statusMessage}
                </p>
              )}
            </form>
          </Accordion>

          <hr className="my-6 border-gray-300 dark:border-gray-600" /> {/* <-- PERUBAHAN: Border theme */}

          {/* Bagian Email Langsung */}
          <Accordion title={<h2 className="text-xl font-semibold flex items-center gap-2"><Mail size={20}/>Email Langsung</h2>}>
            <div className="flex items-start gap-4 pt-2"> {/* Added pt-2 for spacing inside accordion */}
              <Mail className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <p className="text-gray-700 dark:text-gray-300">Untuk pertanyaan umum, kemitraan, atau dukungan teknis.</p> {/* <-- PERUBAHAN: Text color theme */}
                <a href="mailto:admin@ruangriung.my.id" className="text-purple-600 dark:text-purple-400 hover:underline"> {/* <-- PERUBAHAN: Link color theme */}
                  admin@ruangriung.my.id
                </a>
              </div>
            </div>
          </Accordion>

          
          <Accordion title={<h2 className="text-xl font-semibold flex items-center gap-2"><MessageSquare size={20}/>Media Sosial</h2>}>
            <div className="flex items-start gap-4 pt-2"> {/* Added pt-2 for spacing inside accordion */}
              <MessageSquare className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <p className="text-gray-700 dark:text-gray-300">Ikuti kami untuk mendapatkan pembaruan terbaru.</p> {/* <-- PERUBAHAN: Text color theme */}
                <a href="https://web.facebook.com/groups/1182261482811767/" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline"> {/* <-- PERUBAHAN: Link color theme */}
                  [RuangRiung Group]
                </a>
              </div>
            </div>
          </Accordion>

        </div>
      </div>
    </main>
  );
}