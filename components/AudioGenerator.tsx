// components/AudioGenerator.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Volume2, Play, Pause, Download } from 'lucide-react'; // Impor ikon Download
import ButtonSpinner from './ButtonSpinner';
import toast from 'react-hot-toast';

export default function AudioGenerator() {
  const [text, setText] = useState('Halo! Selamat datang di Ruang Riung AI Generator.');
  const [voices, setVoices] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // State untuk proses unduh
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

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
        if(audioPreviewRef.current) {
            audioPreviewRef.current.pause();
            audioPreviewRef.current = null;
        }
    }
  }, []);

  const handlePreviewVoice = (e: React.MouseEvent, voice: string) => {
    e.stopPropagation();
    if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
    }
    if (previewingVoice === voice) {
        setPreviewingVoice(null);
        return;
    }
    setPreviewingVoice(voice);
    const sampleText = encodeURIComponent("This is a preview of the selected voice.");
    const previewUrl = `https://text.pollinations.ai/${sampleText}?model=openai-audio&voice=${voice}&cb=${Date.now()}`;
    const audio = new Audio(previewUrl);
    audioPreviewRef.current = audio;
    audio.play().catch(() => toast.error("Gagal memutar pratinjau."));
    audio.onended = () => setPreviewingVoice(null);
    audio.onerror = () => {
        toast.error("Gagal memuat pratinjau audio.");
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
    if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        setPreviewingVoice(null);
    }
    const encodedText = encodeURIComponent(text);
    const params = new URLSearchParams({ model: 'openai-audio', voice: selectedVoice });
    const finalUrl = `https://text.pollinations.ai/${encodedText}?${params.toString()}`;
    setAudioUrl(finalUrl);
    toast.success("URL Audio berhasil dibuat! Memuat audio...");
    setIsLoading(false);
  };

  // --- FUNGSI BARU UNTUK MENGUNDUH AUDIO ---
  const handleDownload = async () => {
    if (!audioUrl) return;
    setIsDownloading(true);
    toast.loading("Mempersiapkan unduhan...");
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `ruangriung-audio-${Date.now()}.mp3`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadLink.href); // Membersihkan memori
      toast.dismiss();
      toast.success("Audio berhasil diunduh!");
    } catch (error) {
      toast.dismiss();
      toast.error("Gagal mengunduh audio.");
      console.error("Error downloading audio:", error);
    } finally {
      setIsDownloading(false);
    }
  };
  // --- AKHIR FUNGSI BARU ---

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
                <div key={voice} onClick={() => setSelectedVoice(voice)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${isActive ? 'bg-purple-600 text-white' : 'bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 shadow-neumorphic-button dark:shadow-dark-neumorphic-button hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset'}`}>
                  <span className="font-semibold capitalize">{voice}</span>
                  <button onClick={(e) => handlePreviewVoice(e, voice)}
                    className={`p-2 rounded-full transition-colors ${isActive ? 'hover:bg-purple-500' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    title={`Pratinjau suara ${voice}`} disabled={isLoading}>
                    {previewingVoice === voice ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                </div>
              )
            })}
             {voices.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400">Memuat suara...</p>}
          </div>
        </div>
        <div className="text-center pt-4">
          <button onClick={handleGenerateAudio} disabled={isLoading}
            className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner dark:active:shadow-dark-neumorphic-button-active disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-150">
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
            {/* --- PENAMBAHAN TOMBOL UNDUH --- */}
            <div className="text-center mt-4">
              <button onClick={handleDownload} disabled={isDownloading}
                className="inline-flex items-center justify-center px-6 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all duration-150 disabled:opacity-50">
                {isDownloading ? <ButtonSpinner /> : <Download className="w-4 h-4 mr-2" />}
                <span>Unduh Audio</span>
              </button>
            </div>
            {/* --- AKHIR PENAMBAHAN --- */}
          </div>
        )}
      </div>
    </div>
  );
}