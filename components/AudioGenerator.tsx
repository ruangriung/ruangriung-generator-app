// components/AudioGenerator.tsx
'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Volume2 } from 'lucide-react';
import ButtonSpinner from './ButtonSpinner';
import toast from 'react-hot-toast'; // <--- Tambahkan ini

export default function AudioGenerator() {
  const [text, setText] = useState('Halo! Selamat datang di Ruang Riung AI Generator.');
  const [voices, setVoices] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch('https://text.pollinations.ai/models');
        const data = await response.json();
        const availableVoices = data?.['openai-audio']?.voices || [];
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
        } else {
          setVoices(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']);
        }
      } catch (error) {
        console.error("Gagal mengambil daftar suara:", error);
        setVoices(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']);
        toast.error("Gagal memuat daftar suara. Menggunakan suara fallback."); // <--- PERUBAHAN
      }
    };
    fetchVoices();
  }, []);

  const handleGenerateAudio = () => {
    if (!text) {
      toast.error('Teks tidak boleh kosong!'); // <--- PERUBAHAN
      return;
    }
    setIsLoading(true);
    setAudioUrl(null);

    const encodedText = encodeURIComponent(text);
    const params = new URLSearchParams({
      model: 'openai-audio',
      voice: selectedVoice,
      cb: Date.now().toString()
    });

    const finalUrl = `https://text.pollinations.ai/${encodedText}?${params.toString()}`;
    
    setAudioUrl(finalUrl);
    toast.success("Audio berhasil dibuat!"); // <--- PERUBAHAN
    // Kita set loading ke false setelah beberapa saat untuk memberi jeda visual,
    // karena pembuatan audio biasanya sangat cepat.
    setTimeout(() => setIsLoading(false), 300);
  };

  const inputStyle = "w-full p-3 bg-light-bg rounded-lg shadow-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow";
  const selectStyle = `${inputStyle} appearance-none`;

  return (
    <div className="w-full p-6 md:p-8 bg-light-bg rounded-2xl shadow-neumorphic">
      <div className="space-y-6">
        <div>
          <label htmlFor="audio-text" className="block text-sm font-medium text-gray-600 mb-2">Teks untuk Audio</label>
          <textarea
            id="audio-text"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Masukkan teks yang ingin Anda ubah menjadi suara..."
            className={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="voice-select" className="block text-sm font-medium text-gray-600 mb-2">Pilih Suara</label>
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className={selectStyle}
          >
            {voices.length > 0 ? (
              voices.map(voice => <option key={voice} value={voice}>{voice}</option>)
            ) : (
              <option>Memuat suara...</option>
            )}
          </select>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={handleGenerateAudio}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-150"
          >
            {isLoading ? <ButtonSpinner /> : <Volume2 className="w-5 h-5 mr-2" />}
            <span>Buat Audio</span>
          </button>
        </div>

        {audioUrl && (
          <div className="mt-6">
            <audio key={audioUrl} controls autoPlay className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              Browser Anda tidak mendukung elemen audio.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}