// app/components/Generator.tsx
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
  const [modelList, setModelList] = useState<string[]>([]); // State untuk daftar model
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
          // Jika gagal mengambil model dari API, lempar error
          throw new Error(`Gagal mengambil model: ${response.statusText}`);
        }
        const data = await response.json();
        let fetchedModels: string[] = [];

        // Asumsi struktur respons: bisa berupa array string langsung,
        // atau objek dengan kunci 'models' yang berisi array string,
        // atau objek dengan kunci 'image' yang berisi array string.
        if (Array.isArray(data)) {
          fetchedModels = data;
        } else if (data && typeof data === 'object' && Array.isArray(data.models)) {
          fetchedModels = data.models;
        } else if (data && typeof data === 'object' && Array.isArray(data.image)) {
            fetchedModels = data.image; 
        } else {
          console.warn("Struktur data model tidak terduga:", data);
          // Fallback jika struktur tidak sesuai, gunakan model default 'flux' dan 'turbo'
          fetchedModels = ['flux', 'turbo'];
        }

        if (fetchedModels.length > 0) {
          setModelList(fetchedModels);
          // Atur model default ke yang pertama dari daftar yang diambil, jika model saat ini tidak ada
          if (!fetchedModels.includes(settings.model)) {
            setSettings(prev => ({ ...prev, model: fetchedModels[0] }));
          }
        } else {
            // Jika API mengembalikan daftar kosong, gunakan daftar default 'flux' dan 'turbo'
            setModelList(['flux', 'turbo']);
            alert("Model sementara gagal dimuat dari API. Menggunakan model fallback.");
        }
      } catch (error) {
        console.error("Error mengambil model gambar:", error);
        // Notifikasi ke pengguna jika gagal memuat model dari API
        alert("Model sementara gagal dimuat dari API. Menggunakan model fallback.");
        // Daftar model fallback jika terjadi error pengambilan
        setModelList(['flux', 'turbo']);
      }
    };

    fetchImageModels();
  }, []); // Array dependensi kosong berarti efek ini hanya berjalan sekali saat mount

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
      
      const imageResponse = await fetch(finalUrl);
      if (!imageResponse.ok) throw new Error('Gagal mengambil gambar dari API Pollinations.');

      const imageBlob = await imageResponse.blob();
      const objectURL = URL.createObjectURL(imageBlob);

      setImageUrl(objectURL);
      addToHistory({ imageUrl: objectURL, prompt: settings.prompt, timestamp: Date.now() });

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
          models={modelList} // Meneruskan daftar model yang sudah diambil
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