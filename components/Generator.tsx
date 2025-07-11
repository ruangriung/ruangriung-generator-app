'use client';

import { useState, useEffect } from 'react';
import ControlPanel, { GeneratorSettings } from './ControlPanel';
import ImageDisplay from './ImageDisplay';
import ImageModal from './ImageModal';
import HistoryPanel, { HistoryItem } from './HistoryPanel';
import { useSession } from 'next-auth/react';

type AspectRatioPreset = 'Kotak' | 'Portrait' | 'Lansekap';

export default function Generator() {
  const { status } = useSession();
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

  // Efek untuk memuat riwayat dari localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('ruangriung_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Gagal memuat riwayat dari localStorage:", error);
    } finally {
      // Tandai bahwa proses memuat sudah selesai
      setIsHistoryLoaded(true);
    }
  }, []);

  // Efek untuk menyimpan riwayat ke localStorage setiap kali ada perubahan
  useEffect(() => {
    // Hanya simpan jika riwayat sudah dimuat dari localStorage
    if (isHistoryLoaded) {
      try {
        localStorage.setItem('ruangriung_history', JSON.stringify(history));
      } catch (error) {
        console.error("Gagal menyimpan riwayat ke localStorage:", error);
      }
    }
  }, [history, isHistoryLoaded]);

  const addToHistory = (newItem: HistoryItem) => {
    setHistory(prevHistory => {
      if (prevHistory.some(item => item.imageUrl === newItem.imageUrl)) {
        return prevHistory;
      }
      return [newItem, ...prevHistory].slice(0, 15);
    });
  };

  const deductCoin = async (amount: number) => {
    if (status !== 'authenticated') {
      console.log("Mode tamu, tidak ada pengurangan koin di server.");
      // Anda bisa menambahkan logika state untuk tamu di sini jika perlu
      return;
    }
    try {
      const response = await fetch('/api/coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Gagal mengurangi koin.');
      }
      console.log(`PENGURANGAN BERHASIL: ${amount} koin dikurangi. Sisa: ${data.coins}`);
    } catch (error: any) {
      alert(`Terjadi masalah saat mengurangi koin: ${error.message}`);
    }
  };

  const handleGenerateImage = async () => {
    if (!settings.prompt) {
      alert('Prompt tidak boleh kosong!');
      return;
    }
  
    const cost = settings.batchSize;
  
    if (status === 'authenticated') {
      try {
        const res = await fetch('/api/coins');
        const data = await res.json();
        if (data.coins < cost) {
          alert(`Maaf, koin Anda tidak cukup. Anda butuh ${cost}, tetapi hanya memiliki ${data.coins}.`);
          return;
        }
      } catch (error) {
        alert("Gagal memeriksa saldo koin. Silakan coba lagi.");
        return;
      }
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
      if (!imageResponse.ok) {
        throw new Error('Gagal mengambil gambar dari API.');
      }
  
      const imageBlob = await imageResponse.blob();
      const objectURL = URL.createObjectURL(imageBlob);
  
      setImageUrl(objectURL);
      addToHistory({ imageUrl: objectURL, prompt: settings.prompt, timestamp: Date.now() });
      await deductCoin(cost);
  
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
          console.error("Gagal mengunduh gambar:", error);
          alert("Gagal mengunduh gambar. Silakan coba lagi.");
      }
  };

  const handleSelectFromHistory = (item: HistoryItem) => {
    setImageUrl(item.imageUrl);
    setSettings(prev => ({ ...prev, prompt: item.prompt }));
  };

  const handleClearHistory = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua riwayat?")) {
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