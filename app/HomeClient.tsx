'use client'; // Tandai sebagai Client Component

import {
  Wand2,
  Sparkles,
  Download,
  X,
  Rss,
  Facebook,
  Mail,
  LayoutGrid,
  Building2,
  EarthIcon,
  BookOpen,
  QrCode,
  ChevronDown,
  MessageSquare,
  Megaphone,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import Tabs from '../components/Tabs';
import AuthButton from '@/components/AuthButton';
import ThemeToggle from '@/components/ThemeToggle';
import { useState, useEffect, useRef } from 'react';
import FAQ from '@/components/FAQ';
import { AdBanner } from '@/components/AdBanner';
import Link from 'next/link';
import PromptSubmissionTrigger from '@/components/PromptSubmissionTrigger';

interface HomeClientProps {
  latestArticle: {
    slug: string;
    title: string;
    date: string;
    author: string;
    summary: string;
  };
}

export default function HomeClient({ latestArticle }: HomeClientProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Efek untuk PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsHelpOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Efek untuk menutup dropdown menu saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
            setIsToolsMenuOpen(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallButton(false);
      }
    }
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      {showBanner && (
        <div className="w-full max-w-4xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-3 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row items-center justify-center gap-3 relative">
          <p className="text-sm sm:text-base font-semibold flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-300" />
            Jelajahi kreativitas tanpa batas dengan AI!
          </p>
          {showInstallButton && (
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-600 font-bold rounded-lg shadow-md hover:bg-gray-100 transition-colors text-sm"
            >
              <Download size={16} /> Install App
            </button>
          )}
          <button
            onClick={handleCloseBanner}
            className="absolute top-2 right-2 p-1 text-white hover:text-gray-200"
            aria-label="Close banner"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="relative flex items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">
            <Wand2 className="text-purple-600 inline-block align-middle h-8 w-8 sm:h-10 sm:w-10 -mt-1 mr-1" />
            <span className="align-middle">RuangRiung AI Generator</span>
          </h1>
          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-3 py-1 text-sm font-semibold text-purple-700 shadow-sm transition hover:bg-white dark:border-purple-700/60 dark:bg-gray-900/80 dark:text-purple-300"
            aria-label="Panduan penggunaan RuangRiung AI"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Bantuan</span>
          </button>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Transform your imagination into stunning visuals with AI
        </p>
      </header>

      <div className="w-full max-w-4xl mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <Link
          href="/kumpulan-prompt"
          className="flex items-center justify-center text-center gap-2 px-4 py-3 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
        >
          <LayoutGrid size={18} />
          <span>Prompt AI</span>
        </Link>
        <Link href="/artikel" className="flex items-center justify-center text-center gap-2 px-4 py-3 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all">
          <Rss size={18} />
          <span>Artikel</span>
        </Link>
        <Link
          href="/umkm"
          className="flex items-center justify-center text-center gap-2 px-4 py-3 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
        >
          <Building2 size={18} />
          <span>UMKM</span>
        </Link>
        <a href="https://www.facebook.com/groups/1182261482811767/?ref=share&mibextid=lOuIew" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-blue-700 transition-colors">
          <Facebook size={18} />
          <span>Gabung Grup</span>
        </a>
        <Link href="/kontak" className="flex items-center justify-center text-center gap-2 px-4 py-3 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all">
          <Mail size={18} />
          <span>Email Kami</span>
        </Link>
      </div>

      <div className="w-full max-w-4xl mb-6">
        <Link
          href="/konten-kreator"
          className="group w-full inline-flex items-center justify-between gap-4 px-6 py-5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold shadow-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
        >
          <div className="flex items-center gap-4">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Megaphone className="h-6 w-6 animate-pulse transition-transform group-hover:scale-110" />
              <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-yellow-300" aria-hidden />
            </span>
            <div className="text-left">
              <p className="text-lg sm:text-xl leading-tight">Build Your Personal Brand Here</p>
              <p className="text-sm sm:text-base font-normal text-white/80">
                Masuk ke etalase konten kreator kami dan dapatkan eksposur lebih untuk karya terbaikmu.
              </p>
            </div>
          </div>
          <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="w-full max-w-4xl mb-4 flex flex-col sm:flex-row gap-4">
        <PromptSubmissionTrigger
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset hover:bg-blue-700 transition-colors"
          label={
            <>
              <Sparkles size={18} className="text-yellow-300" />
              <span>Submit Prompt</span>
            </>
          }
        />
        <Link
          href="/UniqueArtName"
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset hover:bg-purple-700 transition-colors"
        >
          <Sparkles size={18} className="text-yellow-300" />
          <span>Tema Unik</span>
        </Link>
      </div>

      <div className="w-full max-w-4xl mb-4">
        <Link
          href={`/artikel/${latestArticle.slug}`}
          className="w-full inline-flex items-center justify-between gap-2 px-5 py-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset group transition-transform duration-200 hover:scale-[1.02]"
        >
          <p className="text-sm truncate">
            <span className="font-bold text-purple-600 dark:text-purple-400 mr-2">ARTIKEL TERBARU:</span>
            <span className="text-gray-700 dark:text-gray-300 group-hover:underline">{latestArticle.title}</span>
          </p>
          <Rss size={18} className="text-orange-500" />
        </Link>
      </div>

      {/* Area Tombol Fitur Utama */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        {/* Tombol Tutorial */}
        <a
          href="https://dery-ai.my.id/ruang-riung-tutorial/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-200 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset hover:text-purple-600 transition-colors"
        >
          <EarthIcon size={18} />
          <span>Tutorial</span>
        </a>

        {/* Dropdown Fitur Lainnya */}
        <div className="relative flex-1 w-full" ref={toolsMenuRef}>
            <button
                onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset hover:bg-purple-700 transition-colors"
            >
                <LayoutGrid size={18} />
                <span>Fitur Lainnya</span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isToolsMenuOpen && (
                <div className="absolute top-full mt-2 w-full bg-gray-700 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10">
                    <ul className="py-2">
                        <li>
                            <Link
                                href="/storyteller"
                                className="w-full flex items-center gap-3 px-4 py-2 text-gray-100 dark:text-gray-100 hover:bg-purple-700 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => setIsToolsMenuOpen(false)}
                            >
                                <BookOpen size={18} />
                                <span>StoryTeller AI</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/id-card-generator"
                                className="w-full flex items-center gap-3 px-4 py-2 text-gray-100 dark:text-gray-100 hover:bg-purple-700 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => setIsToolsMenuOpen(false)}
                            >
                                <QrCode size={18} />
                                <span>ID CARD Generator</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/comment-overlay"
                                className="w-full flex items-center gap-3 px-4 py-2 text-gray-100 dark:text-gray-100 hover:bg-purple-700 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => setIsToolsMenuOpen(false)}
                            >
                                <MessageSquare size={18} />
                                <span>Bubble Komentar</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
      </div>
      
      <div className="w-full max-w-4xl mb-4">
        <AdBanner dataAdSlot="6897039624" />
      </div>

      <div className="w-full max-w-4xl flex flex-col gap-4 mb-4">
        <AuthButton />
        <ThemeToggle />
      </div>

      <main className="w-full flex flex-col items-center">
        <Tabs />
      </main>

      <div className="w-full max-w-4xl mt-16">
        <AdBanner dataAdSlot="5961316189" />
      </div>

      <div className="w-full mt-16">
        <FAQ />
      </div>

      {isHelpOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-modal-title"
          onClick={() => setIsHelpOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="help-modal-title"
                  className="text-xl font-bold text-gray-900 dark:text-gray-100"
                >
                  Panduan Menggunakan RuangRiung AI Generator
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Ikuti petunjuk berikut untuk memaksimalkan setiap fitur di halaman utama kami.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full bg-gray-100 p-1 text-gray-500 transition hover:text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-white"
                onClick={() => setIsHelpOpen(false)}
                aria-label="Tutup panduan"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-6 text-left text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              <section>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Navigasi Cepat</h3>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-semibold">Prompt AI</span> membuka koleksi prompt siap pakai untuk berbagai platform kreatif.
                  </li>
                  <li>
                    <span className="font-semibold">Artikel</span> berisi tulisan terbaru tentang tren dan tips pemanfaatan AI.
                  </li>
                  <li>
                    <span className="font-semibold">Gabung Grup</span> mengarahkan Anda ke komunitas Facebook RuangRiung untuk berbagi ide dan hasil karya.
                  </li>
                  <li>
                    <span className="font-semibold">Email Kami</span> memudahkan Anda mengirim pertanyaan atau saran langsung ke tim.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Fitur Utama</h3>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-semibold">Submit Prompt</span> memungkinkan Anda mengajukan prompt buatan sendiri agar dapat ditinjau dan dibagikan ke pengguna lain.
                  </li>
                  <li>
                    <span className="font-semibold">Tema Unik</span> membantu menghasilkan nama tema kreatif untuk karya atau koleksi konten Anda.
                  </li>
                  <li>
                    <span className="font-semibold">Tutorial</span> mengarahkan ke panduan lengkap penggunaan generator dari awal hingga mahir.
                  </li>
                  <li>
                    <span className="font-semibold">Fitur Lainnya</span> membuka menu tambahan seperti <em>StoryTeller AI</em>, <em>ID Card Generator</em>, dan <em>Bubble Komentar</em> untuk memperkaya kebutuhan branding Anda.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Generator &amp; Personalisasi</h3>
                <p className="mt-2">
                  Bagian tab generator di tengah halaman berisi berbagai alat AI (misalnya chatbot, video, audio, dan generator gambar). Pilih tab yang sesuai, isi prompt utama, lengkapi kolom <em>negative prompt</em> bila perlu, lalu tekan tombol <span className="font-semibold">Buat Gambar</span> untuk memperoleh hasil instan.
                </p>
                <p className="mt-2">
                  Gunakan tombol <span className="font-semibold">Masuk/Daftar</span> untuk mengakses fitur premium seperti pengaturan lanjutan, asisten prompt, dan penyimpanan riwayat. Tombol <span className="font-semibold">Tema Gelap/Terang</span> menyesuaikan tampilan halaman agar nyaman di mata.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Tombol Aksi Prompt</h3>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-semibold">Acak Prompt</span> meminta AI menyusun ide unik berdasarkan tema acak sehingga Anda selalu memiliki inspirasi baru.
                  </li>
                  <li>
                    <span className="font-semibold">Surprise Me!</span> mengacak seluruh pengaturan (model, gaya, rasio, kualitas, hingga seed) untuk mengeksplorasi kombinasi tak terduga. Cukup tekan <span className="font-semibold">Buat Gambar</span> setelahnya untuk melihat hasilnya.
                  </li>
                  <li>
                    <span className="font-semibold">Sempurnakan</span> memoles prompt yang sudah ada agar lebih detail dan siap dipakai menghasilkan visual berkualitas.
                  </li>
                  <li>
                    <span className="font-semibold">JSON</span> mengubah prompt menjadi struktur data terformat yang berguna untuk dokumentasi atau integrasi dengan workflow lain.
                  </li>
                  <li>
                    <span className="font-semibold">Simpan</span> menyimpan prompt favorit Anda ke dalam daftar riwayat sehingga dapat dipakai ulang kapan saja.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Pengaturan &amp; Asisten</h3>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>
                    <span className="font-semibold">Pengaturan Lanjutan</span> (tersedia setelah login) membuka kontrol tambahan seperti memilih model, rasio, kualitas gambar, CFG, hingga mode privat/safe.
                  </li>
                  <li>
                    Preset <span className="font-semibold">Negative Prompt</span> membantu menghapus kualitas buruk, anatomi salah, atau watermark dari hasil gambar.
                  </li>
                  <li>
                    Asisten terintegrasi seperti <span className="font-semibold">Prompt Assistant</span>, <span className="font-semibold">Translation Assistant</span>, dan <span className="font-semibold">Image Analysis Assistant</span> siap memberikan saran, menerjemahkan ide, atau menganalisis referensi visual.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Tips Tambahan</h3>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>Manfaatkan banner atas untuk memasang aplikasi RuangRiung AI pada perangkat Anda dan akses generator secara cepat.</li>
                  <li>Baca artikel terbaru melalui kartu sorotan agar selalu mendapatkan inspirasi konten terkini.</li>
                  <li>Jika mengalami kendala, klik tombol ini kapan saja untuk kembali melihat panduan.</li>
                </ul>
              </section>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-purple-700"
                onClick={() => setIsHelpOpen(false)}
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
