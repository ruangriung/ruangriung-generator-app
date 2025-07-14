// components/AudioGenerator.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Volume2, Play, Pause, Download } from 'lucide-react';
import ButtonSpinner from './ButtonSpinner';
import toast from 'react-hot-toast';

export default function AudioGenerator() {
  const [text, setText] = useState('Halo! Selamat datang di Ruang Riung AI Generator.');
  const [voices, setVoices] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
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
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
    };
  }, []);

  // Membuat URL dengan parameter yang benar (termasuk referrer dan token jika ada)
  const createApiUrl = (prompt: string, voice: string) => {
    const baseUrl = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;
    const params = new URLSearchParams({
      model: 'openai-audio',
      voice: voice,
      referrer: 'ruangriung.my.id'
    });
    // Token ditambahkan melalui header, jadi tidak perlu di URL GET
    return `${baseUrl}?${params.toString()}`;
  };

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
    const sampleText = "This is a preview of the selected voice.";
    const previewUrl = createApiUrl(sampleText, voice); // Menggunakan fungsi helper

    const audio = new Audio(previewUrl);
    audioPreviewRef.current = audio;
    audio.play().catch(() => toast.error("Gagal memutar pratinjau."));
    audio.onended = () => setPreviewingVoice(null);
    audio.onerror = () => {
      toast.error("Gagal memuat pratinjau audio.");
      setPreviewingVoice(null);
    };
  };

  const handleGenerateAudio = async () => {
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

    try {
      // Menggunakan metode POST agar bisa mengirim Authorization header dengan aman
      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Menambahkan Token sebagai Bearer
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN}`
        },
        body: JSON.stringify({
          model: 'openai-audio',
          messages: [{ role: 'user', content: text }],
          voice: selectedVoice,
          private: true, // Sesuai anjuran untuk menggunakan parameter private jika memungkinkan
          referrer: 'ruangriung.my.id'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal membuat audio: ${response.statusText} - ${errorText}`);
      }
      
      // Karena API ini mengembalikan file audio langsung, kita proses sebagai blob
      const audioBlob = await response.blob();
      const newAudioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(newAudioUrl);
      toast.success("Audio berhasil dibuat!");

    } catch (error: any) {
      console.error("Gagal membuat audio:", error);
      toast.error(error.message || "Gagal membuat audio. Cek konsol untuk detail.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!audioUrl) return;
    setIsDownloading(true);
    toast.loading("Mempersiapkan unduhan...");
    try {
      // Tidak perlu fetch ulang karena audioUrl sudah merupakan blob URL
      const downloadLink = document.createElement('a');
      downloadLink.href = audioUrl;
      downloadLink.download = `ruangriung-audio-${Date.now()}.mp3`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      // Tidak perlu revoke ObjectURL jika masih digunakan oleh <audio>
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
            <div className="text-center mt-4">
              <button onClick={handleDownload} disabled={isDownloading}
                className="inline-flex items-center justify-center px-6 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all duration-150 disabled:opacity-50">
                {isDownloading ? <ButtonSpinner /> : <Download className="w-4 h-4 mr-2" />}
                <span>Unduh Audio</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}