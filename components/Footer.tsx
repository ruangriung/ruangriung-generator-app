// components/Footer.tsx
import Link from 'next/link';
// Import ikon-ikon yang diperlukan dari lucide-react
import {
  Zap,        // Ikon untuk Next.js (melambangkan kecepatan)
  Hexagon,    // Ikon generik untuk React (sering dikaitkan dengan struktur komponen)
  Key,        // Ikon untuk NextAuth.js (melambangkan keamanan/otentikasi)
  Palette,    // Ikon untuk Tailwind CSS (melambangkan desain/palet warna)
  Sparkles,   // Ikon untuk Pollinations.ai dan sebagai ikon umum AI
  Cloud,      // Ikon untuk Vercel (melambangkan deployment/cloud)
  Github,     // Ikon untuk GitHub
  Brain,      // Ikon untuk OpenAI (representasi AI)
  CloudLightning, // Ikon untuk Cloudflare (representasi jaringan/kecepatan)
  Feather,    // Ikon untuk Lucide Icons (representasi ikon/bulu)
  Move,       // Ikon untuk Framer Motion (representasi gerakan)
  Server,     // Ikon untuk Node.js
  Code,       // Ikon untuk TypeScript (representasi kode/bahasa)
  Package,    // Ikon untuk pnpm (representasi paket)
  ClipboardList, // Ikon untuk ESLint (representasi daftar aturan/audit)
  Brush,      // Ikon untuk Prettier (representasi pemformatan/brush)
} from 'lucide-react';
import Image from 'next/image'; // Import Image from next/image for Google icon

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-200 dark:bg-gray-800 mt-16 py-8">
      <div className="max-w-6xl mx-auto px-4 text-sm text-gray-600 dark:text-gray-300"> {/* Container utama footer */}

        {/* Bagian Atas: Terima Kasih (dengan 3 kolom kategori) */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-center text-lg mb-4">Terima Kasih</h3> {/* PERUBAHAN TEKS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4"> {/* Grid untuk 3 kolom kategori */}
            
            {/* Kategori: Services & Platforms */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="font-semibold text-gray-600 dark:text-gray-300 mt-2 mb-1">Services & Platforms</h4>
              <ul className="space-y-0.5">
                <li>
                  <a href="https://pollinations.ai/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <Sparkles size={14} className="mr-1 text-yellow-500" /> Pollinations.ai
                  </a>
                </li>
                <li>
                  <a href="https://about.google/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <Image src="/google-icon.svg" alt="Google" width={14} height={14} className="mr-1 text-blue-500" /> Google
                  </a>
                </li>
                <li>
                  <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <Cloud size={14} className="mr-1 text-gray-600 dark:text-gray-400" /> Vercel
                  </a>
                </li>
                <li>
                  <a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <CloudLightning size={14} className="mr-1 text-orange-500" /> Cloudflare
                  </a>
                </li>
                <li>
                  <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <Github size={14} className="mr-1 text-gray-800 dark:text-gray-200" /> GitHub
                  </a>
                </li>
                 <li>
                  <a href="https://openai.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <Brain size={14} className="mr-1 text-teal-500" /> OpenAI
                  </a>
                </li>
              </ul>
            </div>

            {/* Kategori: Frameworks & Libraries */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="font-semibold text-gray-600 dark:text-gray-300 mt-2 mb-1">Frameworks & Libraries</h4>
              <ul className="space-y-0.5">
                <li>
                  <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <Zap size={14} className="mr-1 text-purple-500" /> Next.js
                  </a>
                </li>
                <li>
                  <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <Hexagon size={14} className="mr-1 text-blue-500" /> React
                  </a>
                </li>
                <li>
                  <a href="https://next-auth.js.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <Key size={14} className="mr-1 text-orange-500" /> NextAuth.js
                  </a>
                </li>
                <li>
                  <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <Palette size={14} className="mr-1 text-cyan-500" /> Tailwind CSS
                  </a>
                </li>
                <li>
                  <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <Feather size={14} className="mr-1 text-pink-500" /> Lucide Icons
                  </a>
                </li>
                 <li>
                  <a href="https://www.framer.com/motion/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <Move size={14} className="mr-1 text-green-500" /> Framer Motion
                  </a>
                </li>
              </ul>
            </div>

            {/* Kategori: Tooling & Language */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="font-semibold text-gray-600 dark:text-gray-300 mt-2 mb-1">Tooling & Language</h4>
              <ul className="space-y-0.5">
                <li>
                  <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <Server size={14} className="mr-1 text-green-600" /> Node.js
                  </a>
                </li>
                <li>
                  <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <Code size={14} className="mr-1 text-blue-500" /> TypeScript
                  </a>
                </li>
                <li>
                  <a href="https://pnpm.io/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <Package size={14} className="mr-1 text-orange-400" /> pnpm
                  </a>
                </li>
                <li>
                  <a href="https://eslint.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <ClipboardList size={14} className="mr-1 text-violet-500" /> ESLint
                  </a>
                </li>
                <li>
                  <a href="https://prettier.io/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                    <Brush size={14} className="mr-1 text-blue-400" /> Prettier
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-300 dark:border-gray-600" /> {/* Separator */}

        {/* Bagian Bawah: Informasi Aplikasi & Tautan Cepat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* New grid for bottom sections */}
          {/* RuangRiung AI Generator (Dipindahkan ke bawah) */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2">RuangRiung AI Generator</h3>
            <p className="mb-2">Transformasikan imajinasi Anda menjadi visual yang menakjubkan dengan AI.</p>
            <p>&copy; {currentYear} RuangRiung AI Generator - Developed with ❤️ by <a href="https://ariftirtana.my.id" target="_blank" rel="noopener noreferrer" className="hover:underline text-purple-600 dark:text-purple-400">Arif Tirtana</a></p>
          </div>

          {/* Tautan Cepat (Dipindahkan ke bawah) */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2">Tautan Cepat</h3>
            <ul className="space-y-1">
              <li><Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400"> Beranda</Link></li>
              <li><Link href="/ketentuan-layanan" className="hover:text-purple-600 dark:hover:text-purple-400">Ketentuan Layanan</Link></li>
              <li><Link href="/kebijakan-privasi" className="hover:text-purple-600 dark:hover:text-purple-400">Kebijakan Privasi</Link></li>
              <li><Link href="/penghapusan-data" className="hover:text-purple-600 dark:hover:text-purple-400">Prosedur Penghapusan Data</Link></li>
              <li><Link href="/kontak" className="hover:text-purple-600 dark:hover:text-purple-400">Kontak</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}