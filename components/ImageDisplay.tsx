// components/ImageDisplay.tsx
'use client';

import Spinner from './Spinner';

interface ImageDisplayProps {
  isLoading: boolean;
  imageUrl: string;
  prompt: string;
  onLoad: () => void;
  onError: () => void;
  onZoomClick: () => void;
}

export default function ImageDisplay({ isLoading, imageUrl, prompt, onLoad, onError, onZoomClick }: ImageDisplayProps) {
  // Variabel untuk menentukan apakah gambar sudah ada dan selesai dimuat
  const isImageReady = !isLoading && imageUrl;

  return (
    <div className="w-full max-w-2xl mt-8">
      <div className="relative aspect-square w-full bg-light-bg rounded-2xl shadow-neumorphic-inset p-4 flex items-center justify-center">

        {/* Gambar Utama (hanya dirender jika ada URL) */}
        {imageUrl && (
          <img
            // 'key' akan memaksa React untuk membuat ulang elemen <img> setiap kali URL berubah.
            // Ini adalah kunci untuk memastikan event 'onLoad' selalu terpicu dengan andal!
            key={imageUrl} 
            src={imageUrl}
            alt={prompt}
            className={`w-full h-full object-contain rounded-lg transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
            onLoad={onLoad} // Panggil fungsi onLoad dari parent saat gambar selesai dimuat
            onError={onError}
          />
        )}

        {/* Tombol Zoom (muncul jika gambar sudah siap) */}
        {isImageReady && (
          <button 
            onClick={onZoomClick}
            className="absolute top-3 right-3 p-2 bg-black bg-opacity-40 rounded-full text-white hover:bg-opacity-60 transition-colors"
            aria-label="Perbesar gambar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}

        {/* Placeholder Awal (muncul jika tidak ada gambar dan tidak sedang loading) */}
        {!imageUrl && !isLoading && (
          <div className="text-center text-gray-500">
            <p>Gambar Anda akan muncul di sini.</p>
            <p className="text-sm">Atur parameter di atas dan klik "Buat Gambar".</p>
          </div>
        )}

        {/* Lapisan Loading dengan Spinner (muncul hanya saat loading) */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-40 rounded-xl">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}