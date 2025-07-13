// components/AudioGenerator.tsx
'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Volume2, Play, Pause } from 'lucide-react';
import ButtonSpinner from './ButtonSpinner';
import toast from 'react-hot-toast';

export default function AudioGenerator() {
  const [text, setText] = useState('Halo! Selamat datang di Ruang Riung AI Generator.');
  const [voices, setVoices] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch('https://text.pollinations.ai/models');
        const data = await response.json();
        const availableVoices = data?.['openai-audio']?.voices || [];
        setVoices(availableVoices.length > 0 ? availableVoices : ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']);
      } catch (error) {
        console.error("Gagal mengambil daftar suara:", error);
        setVoices(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']);
      }
    };
    fetchVoices();
    
    return () => {
        if(audioPreview) {
            audioPreview.pause();
            setAudioPreview(null);
        }
    }
  }, [audioPreview]);

  const handlePreviewVoice = (e: React.MouseEvent, voice: string) => {
    e.stopPropagation(); 
    
    if (previewingVoice === voice) {
        if(audioPreview) audioPreview.pause();
        setPreviewingVoice(null);
        return;
    }
    
    if(audioPreview) audioPreview.pause();

    setPreviewingVoice(voice);
    const sampleText = encodeURIComponent("This is a preview of the selected voice.");
    const previewUrl = `https://text.pollinations.ai/${sampleText}?model=openai-audio&voice=${voice}&cb=${Date.now()}`;
    
    const audio = new Audio(previewUrl);
    setAudioPreview(audio);
    
    audio.play().catch(err => {
        toast.error("Gagal memutar pratinjau.");
        setPreviewingVoice(null);
    });

    audio.onended = () => {
        setPreviewingVoice(null);
    };
  };

  const handleGenerateAudio = () => {
    if (!text) {
      toast.error('Teks tidak boleh kosong!');
      return;
    }
    setIsLoading(true);
    setAudioUrl(null);
    if(audioPreview) audioPreview.pause();
    setPreviewingVoice(null);

    const encodedText = encodeURIComponent(text);
    const params = new URLSearchParams({ model: 'openai-audio', voice: selectedVoice });
    const finalUrl = `https://text.pollinations.ai/${encodedText}?${params.toString()}`;
    
    setAudioUrl(finalUrl);
    toast.success("Audio berhasil dibuat!");
    setIsLoading(false);
  };

  const inputStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-gray-800 dark:text-gray-200";
  
  return (
    <div className="w-full p-6 md:p-8 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
      <div className="space-y-6">
        <div>
          <label htmlFor="audio-text" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Teks untuk Audio</label>
          <textarea id="audio-text" rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="Masukkan teks yang ingin Anda ubah menjadi suara..." className={inputStyle} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Pilih Suara (Klik ikon Play untuk pratinjau)</label>
          <div className="space-y-2">
            {voices.map(voice => {
              const isActive = selectedVoice === voice;
              return (
                <div 
                  key={voice}
                  onClick={() => setSelectedVoice(voice)}
                  // --- PERBAIKAN UTAMA: Gaya tombol aktif diubah menjadi lebih tegas dan tanpa shadow ---
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 
                    ${isActive 
                      ? 'bg-purple-600 text-white' // Gaya aktif yang baru: solid, tanpa shadow
                      : 'bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 shadow-neumorphic-button dark:shadow-dark-neumorphic-button hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset'
                    }`
                  }
                >
                  <span className="font-semibold capitalize">{voice}</span>
                  <button
                    onClick={(e) => handlePreviewVoice(e, voice)}
                    className={`p-2 rounded-full transition-colors 
                      ${isActive 
                        ? 'hover:bg-purple-500' // Gaya hover saat aktif
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700' // Gaya hover saat tidak aktif
                      }`
                    }
                    title={`Pratinjau suara ${voice}`}
                    disabled={previewingVoice !== null && previewingVoice !== voice}
                  >
                    {previewingVoice === voice ? (
                      <Pause size={18} />
                    ) : (
                      <Play size={18} />
                    )}
                  </button>
                </div>
              )
            })}
             {voices.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400">Memuat suara...</p>}
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={handleGenerateAudio}
            disabled={isLoading || previewingVoice !== null}
            className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner dark:active:shadow-dark-neumorphic-button-active disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-150"
          >
            {isLoading ? <ButtonSpinner /> : <Volume2 className="w-5 h-5 mr-2" />}
            <span>Buat Audio</span>
          </button>
        </div>

        {audioUrl && (
          <div className="mt-6">
            <h3 className="text-center font-semibold mb-2 text-gray-700 dark:text-gray-200">Hasil Audio</h3>
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