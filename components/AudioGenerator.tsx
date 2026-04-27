// components/AudioGenerator.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, Volume2, Play, Pause, Download } from 'lucide-react';
import ButtonSpinner from './ButtonSpinner';
import toast from 'react-hot-toast';

export default function AudioGenerator() {
  const [text, setText] = useState('Halo! Selamat datang di Ruang Riung AI Generator.');
  const [voices, setVoices] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [previewingVoice, setPreviewingVoice] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchVoices = async () => {
      try {
        const response = await fetch('https://text.pollinations.ai/models', {
          signal: controller.signal
        });
        const data = await response.json();
        const availableVoices = data?.['openai-audio']?.voices || [];
        setVoices(availableVoices.length > 0 ? availableVoices : ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error("Gagal mengambil daftar suara:", error);
        setVoices(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']);
      }
    };
    fetchVoices();

    return () => {
      controller.abort();
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
    };
  }, []);

  const handlePreviewVoice = (e: React.MouseEvent, voice: string) => {
    e.stopPropagation();
    
    // Stop existing preview
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current = null;
    }

    // Toggle off if same voice
    if (previewingVoice === voice) {
      setPreviewingVoice(null);
      return;
    }

    setPreviewingVoice(voice);
    const sampleText = "Ini adalah pratinjau dari suara yang dipilih. Ruang Riung AI Generator.";
    
    const params = new URLSearchParams({
      text: sampleText,
      voice: voice
    });
    const previewUrl = `/api/generate-audio?${params.toString()}`;

    const headers: Record<string, string> = {};
    const apiKey = localStorage.getItem('pollinations_api_key');
    if (apiKey) {
        headers['x-pollinations-key'] = apiKey;
    }

    const audio = new Audio();
    
    const fetchPreview = async () => {
        try {
            const res = await fetch(previewUrl, { headers });
            if (!res.ok) throw new Error();
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            audio.src = url;
            audioPreviewRef.current = audio;
            audio.play().catch((err: any) => {
                console.error("Playback error:", err);
                toast.error("Gagal memutar pratinjau.");
                setPreviewingVoice(null);
            });
            audio.onended = () => setPreviewingVoice(null);
        } catch (e) {
            toast.error("Gagal memuat pratinjau audio.");
            setPreviewingVoice(null);
        }
    };
    fetchPreview();
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
      const apiKey = localStorage.getItem('pollinations_api_key');
      const headers: Record<string, string> = {
          'Content-Type': 'application/json',
      };
      if (apiKey) {
          headers['x-pollinations-key'] = apiKey;
      }

      const params = new URLSearchParams({
          text: text,
          voice: selectedVoice
      });
      const response = await fetch(`/api/generate-audio?${params.toString()}`, {
        method: 'GET',
        headers: headers,
      });
      // ================================

      if (!response.ok) {
        const errorText = await response.text(); // Baca respons error sebagai teks
        // Coba parse sebagai JSON jika mungkin, jika tidak, gunakan teks mentah
        try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.message || `Gagal membuat audio: ${response.statusText}`);
        } catch {
            throw new Error(`Gagal membuat audio: ${response.statusText} - ${errorText}`);
        }
      }
      
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
      const downloadLink = document.createElement('a');
      downloadLink.href = audioUrl;
      downloadLink.download = `ruangriung-audio-${Date.now()}.mp3`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
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

  const inputStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-2 border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 dark:text-gray-200";

  return (
    <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[80px] rounded-full -mr-32 -mt-32" />
      
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
          <Volume2 size={20} />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Audio AI</h2>
      </div>
      <p className="text-xs font-bold text-slate-400 mb-8 uppercase tracking-widest">Ubah teks menjadi suara manusia yang natural dan emosional.</p>

      <div className="space-y-8">
        {/* Input Teks */}
        <div className="space-y-3">
          <label className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Teks Narasi
          </label>
          <textarea
            className="w-full p-6 bg-slate-50 dark:bg-black/40 backdrop-blur-md rounded-3xl border-2 border-slate-200 dark:border-white/10 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all text-slate-800 dark:text-slate-100 font-medium h-32 resize-none shadow-inner leading-relaxed"
            placeholder="Tuliskan teks yang ingin diubah menjadi suara..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Pilihan Suara */}
        <div className="space-y-3">
          <label className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Pilih Karakter Suara
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {voices.map((voice) => (
              <button
                key={voice}
                onClick={() => setSelectedVoice(voice)}
                className={`group relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  selectedVoice === voice
                    ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20'
                    : 'glass border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-primary-500/30'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">{voice}</span>
                <button
                  onClick={(e) => handlePreviewVoice(e, voice)}
                  className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                    selectedVoice === voice 
                    ? 'bg-white/20 text-white hover:bg-white/40' 
                    : 'bg-primary-500/10 text-primary-500 hover:bg-primary-500 hover:text-white'
                  }`}
                  title="Pratinjau Suara"
                >
                  {previewingVoice === voice ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
                </button>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerateAudio}
          disabled={isLoading || !text}
          className="w-full h-16 rounded-2xl bg-primary-500 text-white text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-primary-500/25 disabled:opacity-30"
        >
          {isLoading ? (
            <>
              <ButtonSpinner /> Menghasilkan Audio...
            </>
          ) : (
            <>
              <Sparkles size={20} /> Mulai Generate
            </>
          )}
        </button>

        {audioUrl && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass-inset p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6">
              <audio controls className="flex-1 h-10 accent-primary-500" src={audioUrl}>
                Browser Anda tidak mendukung elemen audio.
              </audio>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="h-12 px-6 glass-button rounded-xl text-primary-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary-500 hover:text-white transition-all shadow-lg"
              >
                {isDownloading ? <ButtonSpinner /> : <Download size={16} />}
                Unduh MP3
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}