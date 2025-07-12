// components/Footer.tsx
import Link from 'next/link';
// Import ikon-ikon yang diperlukan dari lucide-react
import {
  Zap,        // Ikon untuk Next.js (melambangkan kecepatan)
  Hexagon,    // Ikon generik untuk React (sering dikaitkan dengan struktur komponen)
  Key,        // Ikon untuk NextAuth.js (melambangkan keamanan/otentikasi)
  Palette,    // Ikon untuk Tailwind CSS (melambangkan desain/palet warna)
  Sparkles,   // Ikon untuk Pollinations.ai (melambangkan AI/sihir)
  Cloud,      // Ikon untuk Vercel (melambangkan deployment/cloud)
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-200 mt-16 py-8">
      {/* Kontainer utama untuk tiga kolom, responsif */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-600">
        {/* Kolom 1: Informasi Aplikasi/Hak Cipta */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="font-bold text-gray-800 text-lg mb-2">RuangRiung AI Generator</h3>
          <p className="mb-2">Transformasikan imajinasi Anda menjadi visual yang menakjubkan dengan AI.</p>
          <p>&copy; {currentYear} RuangRiung. Semua Hak Dilindungi.</p>
        </div>

        {/* Kolom 2: Tautan Cepat */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="font-bold text-gray-800 text-lg mb-2">Tautan Cepat</h3>
          <ul className="space-y-1">
            <li><Link href="/" className="hover:text-purple-600"> Beranda</Link></li>
            <li><Link href="/ketentuan-layanan" className="hover:text-purple-600">Ketentuan Layanan</Link></li>
            <li><Link href="/kebijakan-privasi" className="hover:text-purple-600">Kebijakan Privasi</Link></li>
            <li><Link href="/penghapusan-data" className="hover:text-purple-600">Prosedur Penghapusan Data</Link></li>
            <li><Link href="/kontak" className="hover:text-purple-600">Kontak</Link></li>
          </ul>
        </div>

        {/* Kolom 3: Kredit Teknologi / Terima Kasih */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="font-bold text-gray-800 text-lg mb-2">Didukung Oleh</h3>
          <ul className="text-xs text-gray-500 space-y-1 md:space-y-0.5"> {/* Menggunakan ul untuk daftar, space-y untuk jarak vertikal */}
            <li>
              <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 hover:underline">
                <Zap size={14} className="mr-1 text-purple-500" /> Next.js
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 hover:underline">
                <Hexagon size={14} className="mr-1 text-blue-500" /> React
              </a>
            </li>
            <li>
              <a href="https://next-auth.js.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 hover:underline">
                <Key size={14} className="mr-1 text-orange-500" /> NextAuth.js
              </a>
            </li>
            <li>
              <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 hover:underline">
                <Palette size={14} className="mr-1 text-cyan-500" /> Tailwind CSS
              </a>
            </li>
            <li>
              <a href="https://pollinations.ai/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 hover:underline">
                <Sparkles size={14} className="mr-1 text-yellow-500" /> Pollinations.ai
              </a>
            </li>
            <li>
              <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 hover:underline">
                <Cloud size={14} className="mr-1 text-gray-600" /> Vercel
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}