// components/Generator.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import ControlPanel, { GeneratorSettings } from './ControlPanel';
import ImageDisplay from './ImageDisplay';
import ImageModal from './ImageModal';
import ApiKeyModal from './ApiKeyModal';
import HistoryPanel, { HistoryItem } from './HistoryPanel';
import toast from 'react-hot-toast';
import { artStyles, ArtStyleCategory, ArtStyleOption } from '@/lib/artStyles'; // Import artStyles

type AspectRatioPreset = 'Kotak' | 'Portrait' | 'Lansekap' | 'Custom';

const DEFAULT_PROMPTS = [
  'A majestic dragon in a fantasy forest, cinematic lighting, digital painting',
  'Cyberpunk city at night, neon reflections on wet streets, rain, photorealistic, 8k',
  'A cute robot exploring Mars, Pixar style, vibrant colors, clear skies',
  'Underwater alien landscape, bioluminescent plants, glowing fish, surreal, deep sea photography',
  'An astronaut playing guitar on the moon, retro sci-fi art, vintage poster style',
  'A magical library with floating books, intricate details, warm lighting, concept art',
  'A serene Japanese garden with cherry blossoms, traditional ukiyo-e style, peaceful atmosphere',
  'Victorian detective solving a mystery in a foggy London alley, oil painting, dramatic lighting',
  'Floating islands with waterfalls in the sky, high fantasy, epic scale, digital art'
];

const getRandomDefaultPrompt = () => {
  return DEFAULT_PROMPTS[Math.floor(Math.random() * DEFAULT_PROMPTS.length)];
};

const extractModelNames = (rawData: unknown): string[] => {
  if (!Array.isArray(rawData)) return [];

  return rawData
    .map(item => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object') {
        if ('name' in item && typeof (item as { name?: unknown }).name === 'string') {
          return (item as { name: string }).name;
        }
        if ('model' in item && typeof (item as { model?: unknown }).model === 'string') {
          return (item as { model: string }).model;
        }
      }
      return '';
    })
    .filter((name): name is string => typeof name === 'string' && name.trim().length > 0);
};

const mergeUniqueModels = (...modelGroups: string[][]): string[] => {
  const uniqueModels = new Map<string, string>();

  modelGroups.flat().forEach(model => {
    const trimmed = model.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    if (!uniqueModels.has(key)) {
      uniqueModels.set(key, trimmed);
    }
  });

  return Array.from(uniqueModels.values());
};

const DEFAULT_BASE_MODELS = ['flux'];
const PREMIUM_MODELS = ['DALL-E 3', 'Leonardo'];

export default function Generator() {
  const [settings, setSettings] = useState<GeneratorSettings>(() => {
    const initialPrompt = getRandomDefaultPrompt();
    return {
      prompt: initialPrompt,
      negativePrompt: '',
      model: 'flux',
      cfg_scale: 7,
      width: 1024,
      height: 1792,
      seed: Math.floor(Math.random() * 1000000),
      artStyle: '',
      batchSize: 1,
      imageQuality: 'Ultra',
      private: false,
      safe: false,
      transparent: false,
      inputImage: '',
    };
  });

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [modelRequiringKey, setModelRequiringKey] = useState<'DALL-E 3' | 'Leonardo' | ''>('');
  const [apiKeys, setApiKeys] = useState({ dalle: '', leonardo: '' });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modelList, setModelList] = useState<string[]>(() => mergeUniqueModels(DEFAULT_BASE_MODELS, PREMIUM_MODELS));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioPreset>('Portrait');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  const imageDisplayRef = useRef<HTMLDivElement>(null);
  const initialDefaultPromptRef = useRef(settings.prompt);

  useEffect(() => {
    try {
      const unsavedPrompt = localStorage.getItem('ruangriung_unsaved_prompt');
      if (unsavedPrompt) {
        if (settings.prompt === initialDefaultPromptRef.current || settings.prompt === '') {
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
        const fetchedModels = extractModelNames(data);
        const combinedModels = fetchedModels.length
          ? mergeUniqueModels(fetchedModels, PREMIUM_MODELS)
          : mergeUniqueModels(DEFAULT_BASE_MODELS, PREMIUM_MODELS);

        setModelList(combinedModels);

        if (fetchedModels.length) {
          const normalizedModels = new Set(combinedModels.map(model => model.toLowerCase()));
          setSettings(prev => {
            if (normalizedModels.has(prev.model.toLowerCase())) return prev;
            const fallbackModel = fetchedModels[0] ?? DEFAULT_BASE_MODELS[0];
            return fallbackModel ? { ...prev, model: fallbackModel } : prev;
          });
        }
      } catch (error) {
        console.error("Error mengambil model gambar:", error);
        setModelList(mergeUniqueModels(DEFAULT_BASE_MODELS, PREMIUM_MODELS));
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

  useEffect(() => {
    if (settings.prompt !== initialDefaultPromptRef.current) {
      try {
        if (settings.prompt) {
          localStorage.setItem('ruangriung_unsaved_prompt', settings.prompt);
        } else {
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

    const newRandomSeed = Math.floor(Math.random() * 1000000);
    setSettings(prev => ({...prev, seed: newRandomSeed}));
    let currentSeed = newRandomSeed;

    const { model, prompt, negativePrompt, width, height, imageQuality, batchSize, artStyle, private: isPrivate, safe, transparent, inputImage, cfg_scale } = settings;
    const fullPrompt = `${prompt}${artStyle}`;

    const generatePromises = Array(batchSize).fill(0).map(async (_, i) => {
      const batchSeed = currentSeed + i;
      let finalUrl = '';
      try {
        const params = new URLSearchParams({
          model, width: width.toString(), height: height.toString(), seed: batchSeed.toString(),
          enhance: imageQuality !== 'Standar' ? 'true' : 'false', nologo: 'true', referrer: 'ruangriung.my.id',
          guidance_scale: cfg_scale.toString(),
        });
        if (negativePrompt) params.append('negative_prompt', negativePrompt);
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

  // === PERUBAHAN BARU: Fungsi handleSurpriseMe ===
  const handleSurpriseMe = () => {
    if (modelList.length === 0) {
        toast.error("Model AI belum dimuat. Coba lagi sebentar.");
        return;
    }

    const randomPrompt = getRandomDefaultPrompt(); // Gunakan salah satu prompt default acak
    const randomModel = modelList[Math.floor(Math.random() * modelList.length)];
    const randomCfgScale = Math.floor(Math.random() * (15 - 5 + 1)) + 5; // CFG antara 5-15
    const randomSeed = Math.floor(Math.random() * 1000000);

    const aspectRatios = ['Kotak', 'Portrait', 'Lansekap'];
    const randomAspectRatioPreset = aspectRatios[Math.floor(Math.random() * aspectRatios.length)] as AspectRatioPreset;
    let newWidth = 1024, newHeight = 1024;
    if (randomAspectRatioPreset === 'Portrait') { newWidth = 1024; newHeight = 1792; }
    else if (randomAspectRatioPreset === 'Lansekap') { newWidth = 1792; newHeight = 1024; }

    const imageQualities = ['Standar', 'HD', 'Ultra'];
    const randomImageQuality = imageQualities[Math.floor(Math.random() * imageQualities.length)] as 'Standar' | 'HD' | 'Ultra';

    // Ambil gaya seni acak dari kategori artStyles
    const allArtStyles: ArtStyleOption[] = artStyles.flatMap((category: ArtStyleCategory) => category.options);
    const randomArtStyleOption = allArtStyles[Math.floor(Math.random() * allArtStyles.length)];
    const randomArtStyle = randomArtStyleOption ? randomArtStyleOption.value : '';

    setSettings(prev => ({
      ...prev,
      prompt: randomPrompt,
      negativePrompt: '', // Kosongkan negative prompt
      model: randomModel,
      cfg_scale: randomCfgScale,
      width: newWidth,
      height: newHeight,
      seed: randomSeed,
      artStyle: randomArtStyle,
      imageQuality: randomImageQuality,
      batchSize: 1, // Untuk surprise, biasanya 1 gambar saja dulu
      private: false, // Reset ke default
      safe: false, // Reset ke default
      transparent: false, // Reset ke default
      inputImage: '', // Kosongkan input image
    }));
    setAspectRatio(randomAspectRatioPreset);
    toast.success("Pengaturan diacak! Tekan 'Buat Gambar' untuk melihat hasilnya.");
  };
  // =========================================================

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
          onSurpriseMe={handleSurpriseMe} // Tambahkan fungsi surprise me
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