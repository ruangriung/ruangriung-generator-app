// app/components/Footer.tsx
import Link from 'next/link';
import { Zap, Hexagon, Key, Palette, Sparkles, Cloud, Github, Brain, CloudLightning, Feather, Move, Server, Code, Package, ClipboardList, Brush, Star } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-200 dark:bg-gray-800 mt-16 py-8">
      <div className="max-w-6xl mx-auto px-4 text-sm text-gray-600 dark:text-gray-300">

        {/* Bagian Atas: Terima Kasih */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-center text-lg mb-4">Terima Kasih</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {/* Kategori: Services & Platforms */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="font-semibold text-gray-600 dark:text-gray-300 mt-2 mb-1">Services & Platforms</h4>
              <ul className="space-y-0.5">
                <li><a href="https://pollinations.ai/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><Sparkles size={14} className="mr-1 text-yellow-500" /> Pollinations.ai</a></li>
                <li><a href="https://about.google/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><Image src="/google-icon.svg" alt="Google" width={14} height={14} className="mr-1" /> Google</a></li>
                <li><a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><Cloud size={14} className="mr-1 text-gray-600 dark:text-gray-400" /> Vercel</a></li>
                <li><a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><CloudLightning size={14} className="mr-1 text-orange-500" /> Cloudflare</a></li>
                <li><a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><Github size={14} className="mr-1 text-gray-800 dark:text-gray-200" /> GitHub</a></li>
                <li><a href="https://openai.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><Brain size={14} className="mr-1 text-teal-500" /> OpenAI</a></li>
              </ul>
            </div>
            {/* Kategori: Frameworks & Libraries */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="font-semibold text-gray-600 dark:text-gray-300 mt-2 mb-1">Frameworks & Libraries</h4>
              <ul className="space-y-0.5">
                <li><a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><Zap size={14} className="mr-1 text-purple-500" /> Next.js</a></li>
                <li><a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><Hexagon size={14} className="mr-1 text-blue-500" /> React</a></li>
                <li><a href="https://next-auth.js.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><Key size={14} className="mr-1 text-orange-500" /> NextAuth.js</a></li>
                <li><a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><Palette size={14} className="mr-1 text-cyan-500" /> Tailwind CSS</a></li>
                <li><a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><Feather size={14} className="mr-1 text-pink-500" /> Lucide Icons</a></li>
                <li><a href="https://www.framer.com/motion/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><Move size={14} className="mr-1 text-green-500" /> Framer Motion</a></li>
              </ul>
            </div>
            {/* Kategori: Tooling & Language */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="font-semibold text-gray-600 dark:text-gray-300 mt-2 mb-1">Tooling & Language</h4>
              <ul className="space-y-0.5">
                <li><a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><Server size={14} className="mr-1 text-green-600" /> Node.js</a></li>
                <li><a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><Code size={14} className="mr-1 text-blue-500" /> TypeScript</a></li>
                <li><a href="https://pnpm.io/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><Package size={14} className="mr-1 text-orange-400" /> pnpm</a></li>
                <li><a href="https://eslint.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><ClipboardList size={14} className="mr-1 text-violet-500" /> ESLint</a></li>
                <li><a href="https://prettier.io/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline"><Brush size={14} className="mr-1 text-blue-400" /> Prettier</a></li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-300 dark:border-gray-600" />

        {/* Bagian Bawah: Informasi Aplikasi & Tautan Cepat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2">RuangRiung AI Generator</h3>
            <p className="mb-2">Transformasikan imajinasi Anda menjadi visual yang menakjubkan dengan AI.</p>
            <p>&copy; {currentYear} RuangRiung AI Generator - Developed with ❤️ by <a href="https://ariftirtana.my.id" target="_blank" rel="noopener noreferrer" className="hover:underline text-purple-600 dark:text-purple-400">Arif Tirtana</a></p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-2">Tautan Cepat</h3>
            <ul className="space-y-1">
              <li><Link href="https://www.ruangriung.my.id" className="hover:text-purple-600 dark:hover:text-purple-400"> Beranda</Link></li>
              <li><Link href="/tentang-kami" className="hover:text-purple-600 dark:hover:text-purple-400"> Tentang Kami</Link></li>
              <li><Link href="/ketentuan-layanan" className="hover:text-purple-600 dark:hover:text-purple-400">Ketentuan Layanan</Link></li>
              <li><Link href="/kebijakan-privasi" className="hover:text-purple-600 dark:hover:text-purple-400">Kebijakan Privasi</Link></li>
              <li><Link href="/penghapusan-data" className="hover:text-purple-600 dark:hover:text-purple-400">Prosedur Penghapusan Data</Link></li>
              <li><Link href="/kontak" className="hover:text-purple-600 dark:hover:text-purple-400">Kontak</Link></li>
              <li><Link href="/artikel" className="hover:text-purple-600 dark:hover:text-purple-400">Artikel</Link></li>
              <li><Link href="/battle-ignite-friendship" className="hover:text-purple-600 dark:hover:text-purple-400">Battle</Link></li>
            </ul>
          </div>
        </div>

        {/* --- PENAMBAHAN BARU: Kontainer Histats di Tengah --- */}
        <div className="flex justify-center mt-8">
            <div id="histats_counter"></div>
             <noscript>
                <a href="/" target="_blank">
                    <img src="//sstatic1.histats.com/0.gif?4944741&101" alt="" style={{border:0}} />
                </a>
            </noscript>
        </div>
        {/* --- AKHIR PENAMBAHAN --- */}
        
        {/* --- PERBAIKAN DI SINI --- */}
        <div className="mt-4 text-center">
          <Link 
            href="/v1/index.html" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm py-2 px-4 border border-gray-600 rounded-md hover:bg-purple-600 hover:border-purple-600"
          >
            <i className="fas fa-magic-wand-sparkles"></i>
            Versi UI V1
          </Link>
        </div>
        {/* --- AKHIR PERBAIKAN --- */}

      </div>
    </footer>
  );
}
