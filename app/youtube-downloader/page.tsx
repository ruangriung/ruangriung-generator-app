import type { Metadata } from 'next';
import {
  AlertTriangle,
  Clock,
  Download,
  FileAudio2,
  FileVideo2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import YouTubeDownloaderForm from './YouTubeDownloaderForm';

export const metadata: Metadata = {
  title: 'YouTube Downloader Gratis - Simpan Video & Audio | RuangRiung AI',
  description:
    'Gunakan alat YouTube downloader dari RuangRiung untuk menyiapkan unduhan video atau audio favorit Anda secara etis. Tempel tautan, pilih format, dan integrasikan dengan backend Anda.',
  alternates: {
    canonical: 'https://ruangriung.my.id/youtube-downloader',
  },
  openGraph: {
    title: 'YouTube Downloader Gratis - Simpan Video & Audio',
    description:
      'Buat alur unduhan video dan audio YouTube sendiri dengan template antarmuka dari RuangRiung AI. Lengkap dengan panduan integrasi dan tips legal.',
    url: 'https://ruangriung.my.id/youtube-downloader',
  },
};

const features = [
  {
    title: 'Alur unduhan siap pakai',
    description:
      'Formulir responsif yang memvalidasi URL dan menyiapkan status unduhan sehingga Anda tinggal menghubungkannya dengan API backend.',
    icon: Download,
  },
  {
    title: 'Format video & audio',
    description:
      'Dukung kebutuhan pengunjung dengan opsi MP4 maupun MP3, lengkap dengan pemilihan kualitas yang mudah diubah.',
    icon: FileVideo2,
  },
  {
    title: 'Panduan integrasi',
    description:
      'Dapatkan contoh alur kerja dan struktur endpoint agar implementasi server-side tetap aman, terukur, dan mematuhi aturan.',
    icon: ShieldCheck,
  },
];

const steps = [
  {
    title: '1. Tempel tautan YouTube',
    description:
      'Salin URL dari youtube.com atau youtu.be lalu tempelkan pada kolom yang tersedia. Sistem akan melakukan validasi awal.',
  },
  {
    title: '2. Pilih format & kualitas',
    description:
      'Tentukan apakah Anda ingin menyimpan video (MP4) atau audio (MP3), kemudian pilih kualitas yang sesuai dengan kebutuhan Anda.',
  },
  {
    title: '3. Hubungkan ke backend',
    description:
      'Gunakan fetch/axios untuk memanggil layanan server-side seperti yt-dlp. Pastikan Anda hanya mengunduh konten yang sah secara hukum.',
  },
];

const faqs = [
  {
    question: 'Apakah tombol unduh di halaman ini benar-benar mengambil video?',
    answer:
      'Belum. Tombol unduh bersifat simulasi sehingga Anda bebas menghubungkannya ke API internal yang sudah memproses video dengan aman.',
  },
  {
    question: 'Bagaimana cara menyiapkan backend unduhan yang legal?',
    answer:
      'Gunakan pustaka seperti yt-dlp di server Anda sendiri dan batasi akses hanya untuk konten berlisensi atau milik Anda. Sertakan autentikasi dan pembatasan kuota.',
  },
  {
    question: 'Apakah ada batasan penggunaan?',
    answer:
      'Pengguna wajib mematuhi Ketentuan Layanan YouTube, undang-undang hak cipta, dan peraturan setempat. Jangan bagikan video tanpa izin pemiliknya.',
  },
];

export default function YouTubeDownloaderPage() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-purple-100 via-white to-white py-16 dark:from-gray-950 dark:via-gray-950 dark:to-black">
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-purple-200/70 via-transparent to-transparent blur-3xl dark:from-purple-900/40" />
      <div className="container mx-auto flex max-w-6xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700 shadow-sm dark:bg-purple-500/20 dark:text-purple-200">
            <Sparkles className="h-4 w-4" />
            Alat produktivitas konten
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-gray-100">
            YouTube Downloader etis untuk kreator dan pemasar
          </h1>
          <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
            Bangun pengalaman unduh video yang cepat dan konsisten tanpa melanggar ketentuan platform. Antarmuka ini menghadirkan
            validasi URL, pilihan format, serta status proses sehingga Anda dapat fokus ke logika server-side.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <YouTubeDownloaderForm />
          <div className="flex flex-col gap-5 rounded-2xl bg-white/70 p-6 shadow-xl ring-1 ring-purple-100 backdrop-blur dark:bg-gray-900/60 dark:ring-purple-500/30">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Mengapa template ini?</h2>
            <ul className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-300">
              {features.map(({ title, description, icon: Icon }) => (
                <li key={title} className="flex gap-3 rounded-xl bg-white/80 p-3 shadow-inner dark:bg-gray-950/40">
                  <span className="mt-1 rounded-full bg-purple-100 p-2 text-purple-600 shadow-sm dark:bg-purple-500/20 dark:text-purple-200">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="rounded-xl border border-purple-200 bg-purple-50/80 p-4 text-xs text-purple-700 shadow-inner dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-100">
              <p className="font-semibold">Tips integrasi cepat</p>
              <p className="mt-1">
                Gunakan endpoint POST <code className="rounded bg-purple-100 px-1 py-0.5 text-[10px] font-mono text-purple-700 dark:bg-purple-500/20 dark:text-purple-100">/api/youtube/download</code>
                {' '}untuk menerima URL, format, dan kualitas. Backend dapat memproses unduhan memakai worker queue agar tidak membebani server utama.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          {steps.map(({ title, description }) => (
            <div key={title} className="flex flex-col gap-3 rounded-2xl border border-purple-100 bg-white/70 p-6 shadow-lg dark:border-purple-500/30 dark:bg-gray-900/60">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{description}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 rounded-3xl bg-gray-900/90 px-6 py-10 text-gray-100 shadow-2xl dark:bg-black/60 sm:px-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold">Batasan penggunaan & kepatuhan</h2>
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
          </div>
          <div className="grid gap-5 text-sm sm:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-4 shadow-inner">
              <h3 className="flex items-center gap-2 font-semibold text-white">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Hormati hak cipta
              </h3>
              <p className="mt-2 text-gray-300">
                Unduh hanya konten yang Anda miliki atau sudah mendapat izin tertulis. Pelanggaran hak cipta dapat berujung sanksi hukum.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 shadow-inner">
              <h3 className="flex items-center gap-2 font-semibold text-white">
                <Clock className="h-4 w-4 text-sky-300" />
                Simpan log aktivitas
              </h3>
              <p className="mt-2 text-gray-300">
                Catat setiap permintaan unduhan, termasuk siapa pengguna dan kapan permintaan dibuat, untuk menjaga transparansi.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 shadow-inner">
              <h3 className="flex items-center gap-2 font-semibold text-white">
                <FileAudio2 className="h-4 w-4 text-pink-300" />
                Filter format otomatis
              </h3>
              <p className="mt-2 text-gray-300">
                Tawarkan hanya format yang benar-benar Anda dukung agar pengalaman pengguna tetap lancar dan aman.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white/80 p-8 shadow-2xl ring-1 ring-purple-100 backdrop-blur dark:bg-gray-900/80 dark:ring-purple-500/30">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Pertanyaan umum</h2>
          <div className="mt-6 space-y-4">
            {faqs.map(({ question, answer }) => (
              <div key={question} className="rounded-2xl border border-purple-100 bg-white/70 p-4 shadow-sm dark:border-purple-500/30 dark:bg-gray-950/40">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{question}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
