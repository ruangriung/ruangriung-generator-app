import { Metadata } from 'next';
import { Mail, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kontak Kami - Ruang Riung',
};

export default function KontakPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Kontak Kami</h1>
        <p className="text-gray-600 mb-8">Punya pertanyaan atau masukan? Jangan ragu untuk menghubungi kami melalui salah satu saluran di bawah ini.</p>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Email</h2>
              <p className="text-gray-700">Untuk pertanyaan umum, kemitraan, atau dukungan teknis.</p>
              <a href="mailto:kontak@ruangriung.my.id" className="text-purple-600 hover:underline">
                kontak@ruangriung.my.id
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MessageSquare className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Media Sosial</h2>
              <p className="text-gray-700">Ikuti kami untuk mendapatkan pembaruan terbaru.</p>
              <a href="#" className="text-purple-600 hover:underline">
                [Nama Media Sosial Anda]
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}