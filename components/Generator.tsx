// components/Generator.tsx
'use client';

import { useState, useEffect } from 'react';
import ControlPanel, { GeneratorSettings } from './ControlPanel';
import ImageDisplay from './ImageDisplay';
import ImageModal from './ImageModal';
import ApiKeyModal from './ApiKeyModal'; 
import HistoryPanel, { HistoryItem } from './HistoryPanel';
import toast from 'react-hot-toast';

type AspectRatioPreset = 'Kotak' | 'Portrait' | 'Lansekap' | 'Custom';

export default function Generator() {
  const [settings, setSettings] = useState<GeneratorSettings>({
    prompt: 'Spiderman di ruangriung, digital art, fantasy, vibrant colors',
    model: 'flux',
    width: 1024,
    height: 1024,
    seed: Math.floor(Math.random() * 1000000),
    artStyle: '',
    batchSize: 1,
    imageQuality: 'Standar',
  });

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [modelRequiringKey, setModelRequiringKey] = useState<'DALL-E 3' | 'Leonardo' | ''>('');
  const [apiKeys, setApiKeys] = useState({
      dalle: '',
      leonardo: ''
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
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

    const fetchImageModels = async () => {
      try {
        const response = await fetch('https://image.pollinations.ai/models');
        if (!response.ok) throw new Error(`Gagal mengambil model: ${response.statusText}`);
        const data = await response.json();
        let fetchedModels: string[] = Array.isArray(data) ? data : ['flux', 'turbo'];
        setModelList([...new Set([...fetchedModels, 'DALL-E 3', 'Leonardo'])]);
      } catch (error) {
        console.error("Error mengambil model gambar:", error);
        setModelList(['flux', 'turbo', 'DALL-E 3', 'Leonardo']);
      }
    };
    fetchImageModels();
    
    const savedDalleKey = localStorage.getItem('dalle_api_key');
    const savedLeonardoKey = localStorage.getItem('leonardo_api_key');
    if (savedDalleKey) setApiKeys(prev => ({ ...prev, dalle: savedDalleKey }));
    if (savedLeonardoKey) setApiKeys(prev => ({ ...prev, leonardo: savedLeonardoKey }));

  }, []);

  useEffect(() => {
    if (isHistoryLoaded) {
      try {
        localStorage.setItem('ruangriung_history', JSON.stringify(history));
      } catch (error) { console.error("Gagal menyimpan riwayat:", error); }
    }
  }, [history, isHistoryLoaded]);

  const addToHistory = (newItem: HistoryItem) => {
    setHistory(prev => [newItem, ...prev.filter(i => i.imageUrl !== newItem.imageUrl)].slice(0, 15));
  };

  const onAspectRatioChange = (preset: 'Kotak' | 'Portrait' | 'Lansekap') => {
    setAspectRatio(preset);
    let newWidth = 1024, newHeight = 1024;
    if (preset === 'Portrait') { newWidth = 1024; newHeight = 1792; } 
    else if (preset === 'Lansekap') { newWidth = 1792; newHeight = 1024; }
    setSettings(prev => ({ ...prev, width: newWidth, height: newHeight, imageQuality: 'Standar' }));
  };

  const onManualDimensionChange = (newWidth: number, newHeight: number) => {
    setSettings(prev => ({ ...prev, width: newWidth, height: newHeight, imageQuality: 'Standar' }));
    if (newWidth === 1024 && newHeight === 1024) setAspectRatio('Kotak');
    else if (newWidth === 1024 && newHeight === 1792) setAspectRatio('Portrait');
    else if (newWidth === 1792 && newHeight === 1024) setAspectRatio('Lansekap');
    else setAspectRatio('Custom');
  };

  const onImageQualityChange = (quality: 'Standar' | 'HD' | 'Ultra') => {
    setSettings(prev => {
        let newWidth = prev.width, newHeight = prev.height;
        // ... (logika kualitas gambar tetap sama)
        return { ...prev, width: newWidth, height: newHeight, imageQuality: quality };
    });
  };
  
  const handleModelSelect = (model: string) => {
    if (model === 'DALL-E 3' || model === 'Leonardo') {
      setModelRequiringKey(model);
      setIsApiKeyModalOpen(true);
    } else {
      setSettings(prev => ({ ...prev, model }));
    }
  };

  const handleApiKeySubmit = (apiKey: string) => {
    if (modelRequiringKey === 'DALL-E 3') {
      setApiKeys(prev => ({ ...prev, dalle: apiKey }));
      localStorage.setItem('dalle_api_key', apiKey);
      setSettings(prev => ({ ...prev, model: 'DALL-E 3' }));
      toast.success('API Key DALL-E 3 disimpan!');
    } else if (modelRequiringKey === 'Leonardo') {
      setApiKeys(prev => ({ ...prev, leonardo: apiKey }));
      localStorage.setItem('leonardo_api_key', apiKey);
      setSettings(prev => ({ ...prev, model: 'Leonardo' }));
      toast.success('API Key Leonardo disimpan!');
    }
    setModelRequiringKey('');
  };

  const handleGenerateImage = async () => {
    if (!settings.prompt) {
      toast.error('Prompt tidak boleh kosong!');
      return;
    }

    setIsLoading(true);
    setImageUrls([]);
    const { model, prompt, width, height, seed, imageQuality, batchSize, artStyle } = settings;
    const fullPrompt = `${prompt}${artStyle}`;
    
    // Ini adalah placeholder. Implementasi nyata memerlukan panggilan API yang sesuai.
    const generatePromises = Array(batchSize).fill(0).map(async (_, i) => {
      const newSeed = seed + i;
      let finalUrl = '';
      try {
        if (model === 'DALL-E 3') {
          if (!apiKeys.dalle) throw new Error('API Key DALL-E 3 dibutuhkan.');
          finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?model=dalle3&width=${width}&height=${height}&seed=${newSeed}`;
          // Di dunia nyata: fetch ke 'https://api.openai.com/v1/images/generations' dengan API key
        } else if (model === 'Leonardo') {
          if (!apiKeys.leonardo) throw new Error('API Key Leonardo dibutuhkan.');
          finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?model=leonardo&width=${width}&height=${height}&seed=${newSeed}`;
          // Di dunia nyata: fetch ke API Leonardo dengan API Key
        } else {
          const params = new URLSearchParams({ model, width: width.toString(), height: height.toString(), seed: newSeed.toString(), nologo: 'true', enhance: imageQuality !== 'Standar' ? 'true' : 'false' });
          finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?${params.toString()}`;
        }
        
        // Asumsi semua model mengembalikan URL gambar
        const response = await fetch(finalUrl);
        if (!response.ok) throw new Error(`Gagal membuat gambar #${i + 1}`);
        return response.url;

      } catch (error: any) {
        toast.error(error.message || `Gagal membuat gambar #${i + 1}`);
        setSettings(prev => ({...prev, model: 'flux'})); // Fallback
        return null;
      }
    });

    const generatedUrls = (await Promise.all(generatePromises)).filter((url): url is string => url !== null);
    
    if(generatedUrls.length > 0) {
        setImageUrls(generatedUrls);
        generatedUrls.forEach(url => addToHistory({ imageUrl: url, prompt: settings.prompt, timestamp: Date.now() }));
        toast.success(`Berhasil membuat ${generatedUrls.length} gambar!`);
    } else {
        toast.error("Tidak ada gambar yang berhasil dibuat.");
    }

    setIsLoading(false);
  };

  const handleDownloadImage = async () => {
      // ... (logika download tetap sama)
  };

  const handleSelectFromHistory = (item: HistoryItem) => {
    setImageUrls([item.imageUrl]);
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
          onManualDimensionChange={onManualDimensionChange}
          onImageQualityChange={onImageQualityChange}
          onModelSelect={handleModelSelect}
        />
        <ImageDisplay
          isLoading={isLoading}
          imageUrls={imageUrls}
          prompt={settings.prompt}
          onZoomClick={() => setIsModalOpen(true)}
          onDownloadClick={handleDownloadImage}
          onVariationsClick={handleGenerateImage}
        />
        <ImageModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageUrl={imageUrls[0] || ''}
        />
      </div>

      <ApiKeyModal 
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSubmit={handleApiKeySubmit}
        modelName={modelRequiringKey}
      />

      <HistoryPanel 
        history={history}
        onSelect={handleSelectFromHistory}
        onClear={handleClearHistory}
      />
    </>
  );
}