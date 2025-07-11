'use client';

import { History } from 'lucide-react';

// Definisikan tipe data untuk setiap item di riwayat
export interface HistoryItem {
  imageUrl: string;
  prompt: string;
  timestamp: number;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void; // Fungsi untuk menangani saat item riwayat diklik
  onClear: () => void; // Fungsi untuk menghapus riwayat
}

export default function HistoryPanel({ history, onSelect, onClear }: HistoryPanelProps) {
  if (history.length === 0) {
    return null; // Jangan tampilkan apa-apa jika riwayat kosong
  }

  return (
    <div className="w-full max-w-4xl mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
          <History className="text-purple-600" />
          Riwayat Generate
        </h2>
        <button 
          onClick={onClear} 
          className="text-sm text-red-500 hover:underline"
        >
          Hapus Riwayat
        </button>
      </div>
      <div className="p-4 bg-light-bg rounded-2xl shadow-neumorphic">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {history.map((item) => (
            <div 
              key={item.timestamp} 
              className="relative aspect-square group cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.prompt}
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center rounded-lg">
                <p className="text-white text-center text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.prompt.substring(0, 30)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}