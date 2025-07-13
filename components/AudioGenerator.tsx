// components/AudioGenerator.tsx
'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Volume2, ChevronDown } from 'lucide-react'; // Import ChevronDown
import ButtonSpinner from './ButtonSpinner';
import toast from 'react-hot-toast';

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
        toast.error("Gagal memuat daftar suara. Menggunakan suara fallback.");
      }
    };
    fetchVoices();
  }, []);

  const handleGenerateAudio = () => {
    if (!text) {
      toast.error('Teks tidak boleh kosong!');
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
    toast.success("Audio berhasil dibuat!");
    setTimeout(() => setIsLoading(false), 300);
  };

  // <--- PERUBAHAN: inputStyle dan selectStyle sekarang juga punya dark variant
  const inputStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-gray-800 dark:text-gray-200";
  const selectStyle = `${inputStyle} appearance-none`;

  return (
    // <--- PERUBAHAN: Tambahkan dark:bg-dark-bg dan dark:shadow-dark-neumorphic
    <div className="w-full p-6 md:p-8 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
      <div className="space-y-6">
        <div>
          <label htmlFor="audio-text" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Teks untuk Audio</label> {/* <--- PERUBAHAN: text-gray-600 dark:text-gray-300 */}
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
          <label htmlFor="voice-select" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Pilih Suara</label> {/* <--- PERUBAHAN: text-gray-600 dark:text-gray-300 */}
          <div className="relative"> {/* <-- PERUBAHAN: Tambahkan div relative */}
            <select
              id="voice-select"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className={selectStyle}
            >
              {voices.length > 0 ? (
                voices.map(voice => (
                  // <--- PERUBAHAN: option style
                  <option key={voice} value={voice} className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    {voice}
                  </option>
                ))
              ) : (
                // <--- PERUBAHAN: option style
                <option className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Memuat suara...</option>
              )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-300 pointer-events-none" /> {/* <-- PERUBAHAN: Ikon Chevron */}
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={handleGenerateAudio}
            disabled={isLoading}
            // <--- PERUBAHAN: Tambahkan dark:active:shadow-dark-neumorphic-button-active
            className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner dark:active:shadow-dark-neumorphic-button-active disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-150"
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