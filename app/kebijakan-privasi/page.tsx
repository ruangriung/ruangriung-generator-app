// app/kebijakan-privasi/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Accordion from '@/components/Accordion'; // Import Accordion component
import { Lock, Sparkles, Cloud, Globe, Github, Brain, CloudLightning, Zap, Hexagon, Key, Palette, Feather, Move, Server, Code, Package, ClipboardList, Brush } from 'lucide-react'; // Import icons
import Image from 'next/image'; // Import Image for external icons

export const metadata: Metadata = {
  title: 'Kebijakan Privasi - RuangRiung Generator',
};

export default function KebijakanPrivasiPage() {
  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8"> {/* <-- PERUBAHAN: Background theme */}
      <div className="max-w-4xl mx-auto bg-light-bg dark:bg-dark-bg p-6 md:p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic"> {/* <-- PERUBAHAN: Background & Shadow theme */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Kebijakan Privasi</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Terakhir diperbarui: 11 Juli 2025</p>

        <div className="space-y-6 text-gray-700 dark:text-gray-300"> {/* <-- PERUBAHAN: Text color theme */}
          
          {/* Section 1: Informasi yang Kami Kumpulkan */}
          <Accordion title={<h2 className="text-xl font-semibold">1. Informasi yang Kami Kumpulkan</h2>}>
            <p>Kami mengumpulkan beberapa jenis informasi untuk berbagai tujuan guna menyediakan dan meningkatkan Layanan kami kepada Anda.</p>
            <h3 className="text-lg font-semibold mt-4 mb-2">Data Pribadi</h3>
            <p>
              Saat menggunakan Layanan kami, terutama saat login dengan Google, kami dapat meminta Anda untuk memberikan kami informasi pengenal pribadi tertentu. Informasi ini meliputi:
            </p>
            <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
              <li>Alamat Email (dari akun Google Anda)</li>
              <li>Nama Lengkap (dari akun Google Anda)</li>
              <li>URL Gambar Profil (dari akun Google Anda)</li>
            </ul>
          </Accordion>

          {/* Section 2: Bagaimana Kami Menggunakan Informasi Anda */}
          <Accordion title={<h2 className="text-xl font-semibold">2. Bagaimana Kami Menggunakan Informasi Anda</h2>}>
            <p>Ruang Riung menggunakan data yang dikumpulkan untuk berbagai tujuan:</p>
            <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
              <li>Untuk menyediakan dan memelihara Layanan kami.</li>
              <li>Untuk mengelola Akun Anda dan memberikan Anda akses ke fitur-fitur yang memerlukan otentikasi.</li>
              <li>Untuk menghubungi Anda terkait pembaruan atau informasi layanan.</li>
              <li>Untuk analisis internal guna meningkatkan pengalaman pengguna dan fungsionalitas aplikasi.</li> {/* Tambahan */}
            </ul>
          </Accordion>

          {/* Section 3: Penyedia Layanan Pihak Ketiga (Diperluas) */}
          <Accordion title={<h2 className="text-xl font-semibold">3. Penyedia Layanan Pihak Ketiga</h2>}>
            <p>Kami menggunakan layanan pihak ketiga untuk memfasilitasi Layanan kami ("Penyedia Layanan"), untuk menyediakan Layanan atas nama kami, atau untuk membantu kami menganalisis bagaimana Layanan kami digunakan.</p>
             
            <h4 className="font-semibold text-gray-600 dark:text-gray-300 mt-4 mb-1">Services & Platforms</h4>
            <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
              <li>
                <a href="https://accounts.google.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                  <Image src="/google-icon.svg" alt="Google" width={14} height={14} className="mr-1" /> Google Authentication
                </a>: Untuk proses login dan manajemen pengguna.
              </li>
              <li>
                <a href="https://pollinations.ai/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                  <Sparkles size={14} className="mr-1 text-yellow-500" /> Pollinations.ai
                </a>: Untuk memproses permintaan pembuatan gambar, video, dan audio berbasis AI.
              </li>
              <li>
                <a href="https://vercel.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                  <Cloud size={14} className="mr-1 text-gray-600 dark:text-gray-400" /> Vercel
                </a>: Untuk hosting dan deployment aplikasi.
              </li>
              <li>
                <a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                  <CloudLightning size={14} className="mr-1 text-orange-500" /> Cloudflare
                </a>: Untuk layanan CDN dan keamanan web.
              </li>
              <li>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                  <Github size={14} className="mr-1 text-gray-800 dark:text-gray-200" /> GitHub
                </a>: Untuk manajemen kode sumber dan kolaborasi.
              </li>
              <li>
                <a href="https://openai.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-purple-600 dark:hover:text-purple-400 hover:underline">
                  <Brain size={14} className="mr-1 text-teal-500" /> OpenAI
                </a>: Model AI generatif utama (misal: GPT) untuk pemrosesan teks.
              </li>
            </ul>
             <p className="mt-2 text-sm italic">
                Kami berkomitmen untuk memilih penyedia layanan pihak ketiga yang menjunjung tinggi standar privasi dan keamanan data yang tinggi. Kami menyarankan Anda untuk meninjau kebijakan privasi mereka secara terpisah.
            </p>
          </Accordion>

          {/* Section 4: Keamanan Data */}
          <Accordion title={<h2 className="text-xl font-semibold">4. Keamanan Data</h2>}>
            <p>
              Keamanan data Anda penting bagi kami, tetapi ingatlah bahwa tidak ada metode transmisi melalui Internet, atau metode penyimpanan elektronik yang 100% aman. Meskipun kami berusaha untuk menggunakan cara yang dapat diterima secara komersial untuk melindungi Data Pribadi Anda, kami tidak dapat menjamin keamanan mutlaknya.
            </p>
            <p className="mt-2">
              Kami menerapkan langkah-langkah keamanan fisik, elektronik, dan manajerial untuk menjaga informasi yang kami kumpulkan. Akses ke data pribadi dibatasi hanya untuk personel yang berwenang yang memiliki kebutuhan bisnis yang sah untuk mengaksesnya.
            </p>
          </Accordion>

          {/* Section 5: Hak Anda */}
          <Accordion title={<h2 className="text-xl font-semibold">5. Hak Anda</h2>}>
            <p>
              Anda berhak untuk mengakses, memperbarui, atau meminta penghapusan informasi pribadi Anda. Silakan lihat halaman <Link href="/penghapusan-data" className="text-purple-600 dark:text-purple-400 hover:underline">Prosedur Penghapusan Data</Link> kami untuk instruksi lebih lanjut mengenai penghapusan data.
            </p>
            <p className="mt-2">
                Anda juga berhak untuk menarik persetujuan Anda kapan saja, jika pemrosesan data Anda didasarkan pada persetujuan.
            </p>
          </Accordion>

          {/* Section 6: Perubahan pada Kebijakan Privasi Ini */}
          <Accordion title={<h2 className="text-xl font-semibold">6. Perubahan pada Kebijakan Privasi Ini</h2>}>
            <p>
                Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke waktu. Kami akan memberitahukan Anda tentang perubahan apa pun dengan memposting Kebijakan Privasi yang baru di halaman ini. Anda disarankan untuk meninjau Kebijakan Privasi ini secara berkala untuk setiap perubahan. Perubahan pada Kebijakan Privasi ini berlaku efektif ketika diposting di halaman ini.
            </p>
          </Accordion>

          {/* Section 7: Kontak */}
          <Accordion title={<h2 className="text-xl font-semibold">7. Kontak</h2>}>
            <p>
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui halaman <Link href="/kontak" className="text-purple-600 dark:text-purple-400 hover:underline">Kontak</Link> kami.
            </p>
            <p className="mt-2">
                Anda juga dapat mengirimkan email langsung ke: <a href="mailto:admin@ruangriung.my.id" className="text-purple-600 dark:text-purple-400 hover:underline">admin@ruangriung.my.id</a>
            </p>
          </Accordion>

        </div>

        {/* Tombol Kembali ke Beranda */}
        <div className="mt-8 text-center">
          <Link href="https://www.ruangriung.my.id" className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300 dark:bg-purple-700 dark:hover:bg-purple-800">
            Kembali ke Beranda
          </Link>
        </div>

      </div>
    </main>
  );
}
