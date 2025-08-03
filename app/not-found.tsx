import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300">
      <div className="text-center">
        <h1 className="text-6xl sm:text-8xl font-bold text-purple-600 dark:text-purple-400 mb-4">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-lg mb-8">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-colors"
        >
          <Home size={20} />
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
