// components/Generator.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
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
    height: 1792,
    seed: Math.floor(Math.random() * 1000000), // Inisialisasi awal dengan seed acak
    artStyle: '',
    batchSize: 1,
    imageQuality: 'Ultra',
    private: false,
    safe: false,
    transparent: false,
    inputImage: '',
  });

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [modelRequiringKey, setModelRequiringKey] = useState<'DALL-E 3' | 'Leonardo' | ''>('');
  const [apiKeys, setApiKeys] = useState({ dalle: '', leonardo: '' });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modelList, setModelList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioPreset>('Portrait');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  const imageDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // --- PERUBAHAN: Memuat prompt yang belum disimpan dari localStorage ---
      const unsavedPrompt = localStorage.getItem('ruangriung_unsaved_prompt');
      if (unsavedPrompt) {
        // Hanya muat jika prompt saat ini masih default atau kosong
        if (settings.prompt === 'Spiderman di ruangriung, digital art, fantasy, vibrant colors' || settings.prompt === '') {
          setSettings(prev => ({ ...prev, prompt: unsavedPrompt }));
        }
      }
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
        setModelList(['flux', 'turbo', 'gptimage', 'kontext', 'DALL-E 3', 'Leonardo']);
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

  // --- PERUBAHAN: Menyimpan prompt ke localStorage setiap kali berubah ---
  useEffect(() => {
    // Jangan simpan prompt default saat pertama kali render
    if (settings.prompt !== 'Spiderman di ruangriung, digital art, fantasy, vibrant colors') {
      try {
        if (settings.prompt) {
          localStorage.setItem('ruangriung_unsaved_prompt', settings.prompt);
        } else {
          // Jika prompt dikosongkan oleh pengguna, hapus dari storage
          localStorage.removeItem('ruangriung_unsaved_prompt');
        }
      } catch (error) {
        console.error("Gagal menyimpan prompt ke localStorage:", error);
      }
    }
  }, [settings.prompt]);

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
    setSettings(prev => ({ ...prev, imageQuality: quality }));
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

  const handleGenerate = async (isVariation = false) => {
    if (!settings.prompt) {
      toast.error('Prompt tidak boleh kosong!');
      return;
    }

    setIsLoading(true);
    setImageUrls([]);
    
    setTimeout(() => {
        imageDisplayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    // --- PERUBAHAN UTAMA DI SINI ---
    // Selalu hasilkan seed baru yang acak untuk setiap generasi baru
    const newRandomSeed = Math.floor(Math.random() * 1000000);
    // Perbarui state `settings` dengan seed baru ini
    setSettings(prev => ({...prev, seed: newRandomSeed}));
    
    // Gunakan newRandomSeed untuk generasi saat ini
    let currentSeed = newRandomSeed; 
    
    // Jika ini adalah variasi ATAU jika model yang dipilih adalah 'gptimage',
    // buat seed baru yang acak. (Logika ini kini menjadi opsional atau bisa disesuaikan lebih lanjut
    // jika Anda ingin seed yang sangat spesifik untuk variasi, namun untuk "generate baru"
    // seed acak sudah cukup.)
    // if (isVariation || settings.model === 'gptimage') {
    //   currentSeed = Math.floor(Math.random() * 1000000);
    //   setSettings(prev => ({...prev, seed: currentSeed}));
    // }
    // --- AKHIR PERUBAHAN ---

    const { model, prompt, width, height, imageQuality, batchSize, artStyle, private: isPrivate, safe, transparent, inputImage } = settings;
    const fullPrompt = `${prompt}${artStyle}`;
    
    const generatePromises = Array(batchSize).fill(0).map(async (_, i) => {
      // Gunakan currentSeed + i untuk batching, memastikan setiap gambar dalam batch memiliki seed berbeda
      const batchSeed = currentSeed + i; 
      let finalUrl = '';
      try {
        const params = new URLSearchParams({
          model, width: width.toString(), height: height.toString(), seed: batchSeed.toString(),
          enhance: imageQuality !== 'Standar' ? 'true' : 'false', nologo: 'true', referrer: 'ruangriung.my.id'
        });
        if (isPrivate) params.append('private', 'true');
        if (safe) params.append('safe', 'true');
        if (transparent && model === 'gptimage') params.append('transparent', 'true');
        if (inputImage && (model === 'kontext' || model === 'gptimage')) params.append('image', inputImage);
        
        finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?${params.toString()}`;
        
        const response = await fetch(finalUrl);
        if (!response.ok) throw new Error(`Gagal membuat gambar #${i + 1}`);
        return response.url;

      } catch (error: any) {
        toast.error(error.message || `Gagal membuat gambar #${i + 1}`);
        setSettings(prev => ({...prev, model: 'flux'}));
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
  
  return (
    <>
      <div className="w-full flex flex-col items-center">
        <ControlPanel 
          settings={settings}
          setSettings={setSettings}
          onGenerate={() => handleGenerate(false)}
          isLoading={isLoading}
          models={modelList}
          aspectRatio={aspectRatio}
          onAspectRatioChange={onAspectRatioChange}
          onManualDimensionChange={onManualDimensionChange}
          onImageQualityChange={onImageQualityChange}
          onModelSelect={handleModelSelect}
        />
        <ImageDisplay
          ref={imageDisplayRef}
          isLoading={isLoading}
          imageUrls={imageUrls}
          prompt={settings.prompt}
          onZoomClick={() => setIsModalOpen(true)}
          onVariationsClick={() => handleGenerate(true)}
        />
        <ImageModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageUrl={imageUrls.length > 0 ? imageUrls[0] : ''}
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
        onSelect={(item) => {
          setImageUrls([item.imageUrl]);
          setSettings(prev => ({ ...prev, prompt: item.prompt }));
          toast.success("Gambar dimuat dari riwayat!");
        }}
        onClear={() => {
          if (window.confirm("Yakin ingin menghapus riwayat?")) {
            setHistory([]);
            toast.success("Riwayat berhasil dihapus!");
          }
        }}
      />
    </>
  );
}