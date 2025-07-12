// components/Generator.tsx
'use client';

import { useState, useEffect } from 'react';
import ControlPanel, { GeneratorSettings } from './ControlPanel';
import ImageDisplay from './ImageDisplay';
import ImageModal from './ImageModal';
import HistoryPanel, { HistoryItem } from './HistoryPanel';
import toast from 'react-hot-toast';

type AspectRatioPreset = 'Kotak' | 'Portrait' | 'Lansekap' | 'Custom';

export default function Generator() {
  const [settings, setSettings] = useState<GeneratorSettings>({
    prompt: 'Kastil fantasi di atas awan',
    model: 'flux',
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
            toast.error("Model sementara gagal dimuat dari API. Menggunakan model fallback.");
        }
      } catch (error) {
        console.error("Error mengambil model gambar:", error);
        toast.error("Model sementara gagal dimuat dari API. Menggunakan model fallback.");
        setModelList(['flux', 'turbo']);
      }
    };

    fetchImageModels();
  }, []);

  const addToHistory = (newItem: HistoryItem) => {
    setHistory(prev => [newItem, ...prev.filter(i => i.imageUrl !== newItem.imageUrl)].slice(0, 15));
  };

  const onAspectRatioChange = (preset: 'Kotak' | 'Portrait' | 'Lansekap') => {
    setAspectRatio(preset);
    switch (preset) {
      case 'Kotak':
        setSettings(prev => ({ ...prev, width: 1024, height: 1024 }));
        break;
      case 'Portrait':
        setSettings(prev => ({ ...prev, width: 1792, height: 1024 }));
        break;
      case 'Lansekap':
        setSettings(prev => ({ ...prev, width: 1024, height: 1792 }));
        break;
    }
  };

  const handleManualDimensionChange = (newWidth: number, newHeight: number) => {
    setSettings(prev => ({ ...prev, width: newWidth, height: newHeight }));

    if (newWidth === 1024 && newHeight === 1024) {
      setAspectRatio('Kotak');
    } else if (newWidth === 1792 && newHeight === 1024) {
      setAspectRatio('Portrait');
    } else if (newWidth === 1024 && newHeight === 1792) {
      setAspectRatio('Lansekap');
    } else {
      setAspectRatio('Custom');
    }
  };

  const handleGenerateImage = async () => {
    if (!settings.prompt) {
      toast.error('Prompt tidak boleh kosong!');
      return;
    }

    setIsLoading(true);
    setImageUrl('');

    // <--- PERBAIKAN: Beri tipe eksplisit Promise<string>
    const generatePromise = new Promise<string>(async (resolve, reject) => {
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
        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          throw new Error(`Gagal mengambil gambar dari API Pollinations: ${imageResponse.status} - ${errorText}`);
        }

        const contentType = imageResponse.headers.get('content-type');
        if (!contentType || !contentType.startsWith('image/')) {
          throw new Error('Respons API bukan gambar atau tipe konten tidak valid.');
        }
        
        setImageUrl(finalUrl); 
        addToHistory({ imageUrl: finalUrl, prompt: settings.prompt, timestamp: Date.now() });
        resolve('Gambar berhasil dibuat!');
      } catch (error: any) {
        reject(error.message);
      } finally {
        setIsLoading(false);
      }
    });

    toast.promise(generatePromise, {
      loading: 'Membuat gambar...',
      success: (message: string) => message,
      error: (message: string) => `Gagal membuat gambar: ${message}`,
    });
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
          toast.success("Gambar berhasil diunduh!");
      } catch (error) {
          toast.error("Gagal mengunduh gambar.");
      }
  };

  const handleSelectFromHistory = (item: HistoryItem) => {
    setImageUrl(item.imageUrl); 
    setSettings(prev => ({ ...prev, prompt: item.prompt }));
    toast.success("Gambar dimuat dari riwayat!");
  };
  
  const handleClearHistory = () => {
    if (window.confirm("Yakin ingin menghapus riwayat?")) {
      setHistory([]);
      toast.success("Riwayat berhasil dihapus!");
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
          onAspectRatioChange={onAspectRatioChange}
          onManualDimensionChange={handleManualDimensionChange}
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