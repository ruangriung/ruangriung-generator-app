// components/Generator.tsx
'use client';

import { useState, useEffect } from 'react';
import ControlPanel, { GeneratorSettings } from './ControlPanel';
import ImageDisplay from './ImageDisplay';
import ImageModal from './ImageModal';
import HistoryPanel, { HistoryItem } from './HistoryPanel';

type AspectRatioPreset = 'Kotak' | 'Portrait' | 'Lansekap';

export default function Generator() {
  const [settings, setSettings] = useState<GeneratorSettings>({
    prompt: 'Kastil fantasi di atas awan',
    model: 'flux', // Default model
    width: 1024,
    height: 1024,
    seed: Math.floor(Math.random() * 1000000),
    artStyle: '',
    batchSize: 1,
  });

  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modelList, setModelList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioPreset>('Kotak');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  // Efek untuk memuat dan menyimpan riwayat
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('ruangriung_history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (error) { console.error("Gagal memuat riwayat:", error); }
    finally { setIsHistoryLoaded(true); }
  }, []);

  useEffect(() => {
    if (isHistoryLoaded) {
      try {
        localStorage.setItem('ruangriung_history', JSON.stringify(history));
      } catch (error) { console.error("Gagal menyimpan riwayat:", error); }
    }
  }, [history, isHistoryLoaded]);

  // Efek untuk mengambil daftar model dari Pollinations.ai
  useEffect(() => {
    const fetchImageModels = async () => {
      try {
        const response = await fetch('https://image.pollinations.ai/models');
        if (!response.ok) {
          throw new Error(`Gagal mengambil model: ${response.statusText}`);
        }
        const data = await response.json();
        let fetchedModels: string[] = [];

        if (Array.isArray(data)) {
          fetchedModels = data;
        } else if (data && typeof data === 'object' && Array.isArray(data.models)) {
          fetchedModels = data.models;
        } else if (data && typeof data === 'object' && Array.isArray(data.image)) {
            fetchedModels = data.image; 
        } else {
          console.warn("Struktur data model tidak terduga:", data);
          fetchedModels = ['flux', 'turbo'];
        }

        if (fetchedModels.length > 0) {
          setModelList(fetchedModels);
          if (!fetchedModels.includes(settings.model)) {
            setSettings(prev => ({ ...prev, model: fetchedModels[0] }));
          }
        } else {
            setModelList(['flux', 'turbo']);
            alert("Model sementara gagal dimuat dari API. Menggunakan model fallback.");
        }
      } catch (error) {
        console.error("Error mengambil model gambar:", error);
        alert("Model sementara gagal dimuat dari API. Menggunakan model fallback.");
        setModelList(['flux', 'turbo']);
      }
    };

    fetchImageModels();
  }, []);

  const addToHistory = (newItem: HistoryItem) => {
    setHistory(prev => [newItem, ...prev.filter(i => i.imageUrl !== newItem.imageUrl)].slice(0, 15));
  };

  const handleGenerateImage = async () => {
    if (!settings.prompt) {
      alert('Prompt tidak boleh kosong!');
      return;
    }

    setIsLoading(true);
    setImageUrl('');

    try {
      const newSeed = Math.floor(Math.random() * 1000000);
      const currentSettings = { ...settings, seed: newSeed };
      setSettings(currentSettings);
      
      const fullPrompt = `${currentSettings.prompt}${currentSettings.artStyle}`;
      const encodedPrompt = encodeURIComponent(fullPrompt);
      
      const params = new URLSearchParams({
        model: currentSettings.model,
        width: currentSettings.width.toString(),
        height: currentSettings.height.toString(),
        seed: currentSettings.seed.toString(),
        nologo: 'true',
        enhance: 'true',
        safe: 'false',
        referrer: 'ruangriung.my.id',
        cb: Date.now().toString()
      });
      const finalUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;
      
      // Tetap lakukan fetch untuk menunggu respons dari API
      // Ini juga memungkinkan penanganan error jika API tidak mengembalikan gambar yang valid
      const imageResponse = await fetch(finalUrl); 
      if (!imageResponse.ok) {
        // Jika respons tidak OK, kita bisa mencoba untuk membaca body sebagai teks error
        const errorText = await imageResponse.text();
        throw new Error(`Gagal mengambil gambar dari API Pollinations: ${imageResponse.status} - ${errorText}`);
      }

      // Pastikan respons adalah gambar. Jika tidak, bisa jadi error dari API (meskipun status OK)
      const contentType = imageResponse.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('Respons API bukan gambar atau tipe konten tidak valid.');
      }
      
      // Jika berhasil, setel imageUrl ke URL permanen dan tambahkan ke riwayat
      setImageUrl(finalUrl); 
      addToHistory({ imageUrl: finalUrl, prompt: settings.prompt, timestamp: Date.now() });

    } catch (error: any) {
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = async () => {
      if (!imageUrl) return;
      try {
          const a = document.createElement('a');
          a.href = imageUrl; 
          a.download = `${settings.prompt.substring(0, 30)}_${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          a.remove();
      } catch (error) {
          alert("Gagal mengunduh gambar.");
      }
  };

  const handleSelectFromHistory = (item: HistoryItem) => {
    setImageUrl(item.imageUrl); 
    setSettings(prev => ({ ...prev, prompt: item.prompt }));
  };
  
  const handleClearHistory = () => {
    if (window.confirm("Yakin ingin menghapus riwayat?")) {
      setHistory([]);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col items-center">
        <ControlPanel 
          settings={settings}
          setSettings={setSettings}
          onGenerate={handleGenerateImage}
          isLoading={isLoading}
          models={modelList}
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
        />
        <ImageDisplay
          isLoading={isLoading}
          imageUrl={imageUrl} 
          prompt={settings.prompt}
          onZoomClick={() => setIsModalOpen(true)}
          onDownloadClick={handleDownloadImage}
          onVariationsClick={handleGenerateImage}
        />
        <ImageModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageUrl={imageUrl} 
        />
      </div>

      <HistoryPanel 
        history={history}
        onSelect={handleSelectFromHistory}
        onClear={handleClearHistory}
      />
    </>
  );
}