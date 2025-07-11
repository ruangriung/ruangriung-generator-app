'use client';

import { useState, useEffect } from 'react';
import ControlPanel, { GeneratorSettings } from './ControlPanel';
import ImageDisplay from './ImageDisplay';
import ImageModal from './ImageModal';
import HistoryPanel, { HistoryItem } from './HistoryPanel'; // Impor komponen dan tipe data baru

type AspectRatioPreset = 'Kotak' | 'Portrait' | 'Lansekap';

export default function Generator() {
  const [settings, setSettings] = useState<GeneratorSettings>({
    prompt: 'Kastil fantasi di atas awan',
    model: 'flux',
    width: 1024,
    height: 1024,
    seed: Math.floor(Math.random() * 1000000),
    artStyle: '',
  });

  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modelList, setModelList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioPreset>('Kotak');
  
  // State baru untuk menyimpan riwayat
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Efek untuk memuat riwayat dari localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('ruangriung_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Gagal memuat riwayat dari localStorage:", error);
    }
  }, []);

  // Efek untuk menyimpan riwayat ke localStorage setiap kali ada perubahan
  useEffect(() => {
    try {
      localStorage.setItem('ruangriung_history', JSON.stringify(history));
    } catch (error) {
      console.error("Gagal menyimpan riwayat ke localStorage:", error);
    }
  }, [history]);

  // Efek untuk fetchModels dan aspectRatio tetap sama
  useEffect(() => { /* ... (kode fetchModels tidak berubah) ... */ }, []);
  useEffect(() => { /* ... (kode aspectRatio tidak berubah) ... */ }, [aspectRatio]);

  // Fungsi untuk menambahkan item baru ke riwayat
  const addToHistory = (newItem: HistoryItem) => {
    setHistory(prevHistory => {
      // Hindari duplikasi gambar yang sama persis
      if (prevHistory.some(item => item.imageUrl === newItem.imageUrl)) {
        return prevHistory;
      }
      // Tambahkan item baru di awal array dan batasi jumlah riwayat (misal: 15)
      const newHistory = [newItem, ...prevHistory].slice(0, 15);
      return newHistory;
    });
  };

  const handleGenerateImage = () => {
    if (!settings.prompt) {
      alert('Prompt tidak boleh kosong!');
      return;
    }
    setIsLoading(true);
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
    setImageUrl(finalUrl);
  };

  const handleDownloadImage = async () => { /* ... (kode download tidak berubah) ... */ };

  // Fungsi untuk menangani saat item riwayat dipilih
  const handleSelectFromHistory = (item: HistoryItem) => {
    setImageUrl(item.imageUrl);
    // Kita bisa juga mengembalikan prompt ke textarea jika diinginkan
    setSettings(prev => ({ ...prev, prompt: item.prompt }));
  };

  // Fungsi untuk menghapus riwayat
  const handleClearHistory = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua riwayat?")) {
      setHistory([]);
    }
  };

  return (
    // Kita bungkus semuanya dengan Fragment <> agar bisa merender HistoryPanel
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
          onLoad={() => {
            setIsLoading(false);
            // Tambahkan ke riwayat setelah gambar berhasil dimuat
            addToHistory({ imageUrl, prompt: settings.prompt, timestamp: Date.now() });
          }}
          onError={() => {
            setIsLoading(false);
            alert('Gagal memuat gambar. API mungkin sibuk atau parameter tidak valid.');
          }}
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

      {/* Tampilkan panel riwayat di bawah komponen Generator */}
      <HistoryPanel 
        history={history}
        onSelect={handleSelectFromHistory}
        onClear={handleClearHistory}
      />
    </>
  );
}