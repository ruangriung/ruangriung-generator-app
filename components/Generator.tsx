'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import React from 'react';
import ControlPanel, { GeneratorSettings } from './ControlPanel';
import ImageDisplay from './ImageDisplay';
import ImageModal from './ImageModal';
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
const FREE_IMAGE_MODELS = [
  'flux', 'nanobanana', 'seedream', 'gptimage', 'zimage', 
  'wan-image', 'qwen-image', 'grok-imagine', 'klein', 'p-image'
];
const PREMIUM_IMAGE_MODELS = [
  'nanobanana-pro', 'seedream-pro', 'wan-image-pro', 'grok-imagine-pro', 'nova-canvas'
];
const IMAGE_TO_IMAGE_MODELS = new Set(['nanobanana', 'seedream', 'kontext', 'upscale', 'edit']);

const isImageToImageModel = (modelName: string): boolean => {
  const normalized = modelName.toLowerCase();
  const i2iKeywords = ['nanobanana', 'seedream', 'kontext', 'upscale', 'edit', 'img2img', 'image-to-image'];
  return i2iKeywords.some(keyword => normalized.includes(keyword));
};

const MAX_REFERENCE_IMAGES = 4;
const createEmptyReferenceImages = () => [''];

const sanitizeStoredSettings = (data: unknown): Partial<GeneratorSettings> | null => {
  if (!data || typeof data !== 'object') return null;

  const raw = data as Record<string, unknown>;
  const sanitized: Partial<GeneratorSettings> = {};

  if (typeof raw.prompt === 'string') sanitized.prompt = raw.prompt;
  if (typeof raw.negativePrompt === 'string') sanitized.negativePrompt = raw.negativePrompt;
  if (typeof raw.model === 'string') sanitized.model = raw.model;
  if (typeof raw.cfg_scale === 'number' && Number.isFinite(raw.cfg_scale)) sanitized.cfg_scale = raw.cfg_scale;
  if (typeof raw.width === 'number' && Number.isFinite(raw.width)) sanitized.width = raw.width;
  if (typeof raw.height === 'number' && Number.isFinite(raw.height)) sanitized.height = raw.height;
  if (typeof raw.seed === 'number' && Number.isFinite(raw.seed)) sanitized.seed = raw.seed;
  if (typeof raw.artStyle === 'string') sanitized.artStyle = raw.artStyle;
  if (typeof raw.batchSize === 'number' && Number.isFinite(raw.batchSize)) sanitized.batchSize = raw.batchSize;

  if (typeof raw.imageQuality === 'string' && ['Standar', 'HD', 'Ultra'].includes(raw.imageQuality)) {
    sanitized.imageQuality = raw.imageQuality as GeneratorSettings['imageQuality'];
  }

  if (typeof raw.private === 'boolean') sanitized.private = raw.private;
  if (typeof raw.safe === 'boolean') sanitized.safe = raw.safe;
  if (typeof raw.transparent === 'boolean') sanitized.transparent = raw.transparent;

  if (typeof raw.nologo === 'boolean') sanitized.nologo = raw.nologo;

  if (Array.isArray(raw.inputImages)) {
    const cleanedImages = raw.inputImages
      .map(image => (typeof image === 'string' ? image.trim() : ''))
      .filter(Boolean)
      .slice(0, MAX_REFERENCE_IMAGES);
    sanitized.inputImages = cleanedImages.length > 0 ? cleanedImages : createEmptyReferenceImages();
  }

  return Object.keys(sanitized).length > 0 ? sanitized : null;
};

const determineAspectRatio = (width: number, height: number): AspectRatioPreset => {
  if (width === 1024 && height === 1024) return 'Kotak';
  if (width === 1024 && height === 1792) return 'Portrait';
  if (width === 1792 && height === 1024) return 'Lansekap';
  return 'Custom';
};

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
      nologo: true,
      inputImages: createEmptyReferenceImages(),
    };
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modelList, setModelList] = useState<string[]>(() => mergeUniqueModels(DEFAULT_BASE_MODELS, PREMIUM_IMAGE_MODELS));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioPreset>('Portrait');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  const imageDisplayRef = useRef<HTMLDivElement>(null);
  const initialDefaultPromptRef = useRef(settings.prompt);

  // Memoized handlers for performance
  const handleModelSelect = useCallback((model: string) => {
    setSettings(prev => ({
      ...prev,
      model,
      ...(IMAGE_TO_IMAGE_MODELS.has(model.toLowerCase()) ? {} : { inputImages: createEmptyReferenceImages() }),
    }));
  }, []);

  const onAspectRatioChange = useCallback((preset: 'Kotak' | 'Portrait' | 'Lansekap') => {
    setAspectRatio(preset);
    let newWidth = 1024, newHeight = 1024;
    if (preset === 'Portrait') { newWidth = 1024; newHeight = 1792; }
    else if (preset === 'Lansekap') { newWidth = 1792; newHeight = 1024; }
    setSettings(prev => ({ ...prev, width: newWidth, height: newHeight, imageQuality: 'Standar' }));
  }, []);

  const onManualDimensionChange = useCallback((newWidth: number, newHeight: number) => {
    setSettings(prev => ({ ...prev, width: newWidth, height: newHeight, imageQuality: 'Standar' }));
    if (newWidth === 1024 && newHeight === 1024) setAspectRatio('Kotak');
    else if (newWidth === 1024 && newHeight === 1792) setAspectRatio('Portrait');
    else if (newWidth === 1792 && newHeight === 1024) setAspectRatio('Lansekap');
    else setAspectRatio('Custom');
  }, []);

  const onImageQualityChange = useCallback((quality: 'Standar' | 'HD' | 'Ultra') => {
    setSettings(prev => ({ ...prev, imageQuality: quality }));
  }, []);

  const addToHistory = useCallback((newItem: HistoryItem) => {
    setHistory(prev => [newItem, ...prev.filter(i => i.imageUrl !== newItem.imageUrl)].slice(0, 15));
  }, []);

  const [byopKeyVersion, setByopKeyVersion] = useState(0);

  useEffect(() => {
    let hasStoredSettings = false;
    try {
      const storedSettings = localStorage.getItem('ruangriung_generator_settings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        const sanitizedSettings = sanitizeStoredSettings(parsedSettings);
        if (sanitizedSettings) {
          hasStoredSettings = true;
          setSettings(prev => {
            const nextSettings = { ...prev, ...sanitizedSettings };
            setAspectRatio(determineAspectRatio(nextSettings.width, nextSettings.height));
            return nextSettings;
          });
        }
      }
      if (!hasStoredSettings) {
        const unsavedPrompt = localStorage.getItem('ruangriung_unsaved_prompt');
        if (unsavedPrompt) {
          setSettings(prev => {
            if (prev.prompt === initialDefaultPromptRef.current || prev.prompt === '') {
              return { ...prev, prompt: unsavedPrompt };
            }
            return prev;
          });
        }
      }
      const savedHistory = localStorage.getItem('ruangriung_history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (error) { console.error("Gagal memuat pengaturan atau riwayat:", error); }
    finally { setIsHistoryLoaded(true); }
  }, []);

  useEffect(() => {
    const fetchImageModels = async () => {
      try {
        const byopKey = localStorage.getItem('pollinations_api_key');
        const headers: Record<string, string> = {};
        if (byopKey) {
          headers['Authorization'] = `Bearer ${byopKey}`;
          headers['x-pollinations-key'] = byopKey;
        }

        const response = await fetch('/api/pollinations/models/image', { headers });
        if (!response.ok) throw new Error(`Gagal mengambil model: ${response.statusText}`);
        const data = await response.json();
        const apiModels = extractModelNames(data);
        
        // Filter out video models from image endpoint
        const fetchedModels = apiModels.filter(m => 
          !m.toLowerCase().includes('video') && 
          !m.toLowerCase().includes('mp4')
        );

        // Dynamic model list building
        let finalModels: string[];
        if (byopKey) {
          // If BYOP is active, show everything from API + our known premium models
          finalModels = mergeUniqueModels(FREE_IMAGE_MODELS, PREMIUM_IMAGE_MODELS, fetchedModels);
        } else {
          // If NOT BYOP, only show free models
          finalModels = mergeUniqueModels(FREE_IMAGE_MODELS, fetchedModels.filter(m => !m.toLowerCase().includes('-pro')));
        }

        setModelList(finalModels);

        // Only revert model if the CURRENTLY SELECTED model is absolutely invalid for the current mode
        setSettings(prev => {
          const isCurrentModelValid = finalModels.some(m => m.toLowerCase() === prev.model.toLowerCase());
          if (isCurrentModelValid) return prev;
          
          // Only fallback if current model is not in the list at all
          const fallbackModel = finalModels.includes('flux') ? 'flux' : (finalModels[0] || 'flux');
          const shouldClearInput = !isImageToImageModel(fallbackModel);
          return {
            ...prev,
            model: fallbackModel,
            ...(shouldClearInput ? { inputImages: createEmptyReferenceImages() } : {}),
          };
        });
      } catch (error) {
        console.error("Error mengambil model gambar:", error);
        // Fallback to basic list if API fails
        const byopKey = localStorage.getItem('pollinations_api_key');
        setModelList(byopKey ? mergeUniqueModels(FREE_IMAGE_MODELS, PREMIUM_IMAGE_MODELS) : FREE_IMAGE_MODELS);
      }
    };
    fetchImageModels();
  }, [byopKeyVersion]);

  useEffect(() => {
    try {
      // Exclude heavy data like inputImages from localStorage to prevent QuotaExceededError
      const { inputImages, ...safeSettings } = settings;
      localStorage.setItem('ruangriung_generator_settings', JSON.stringify(safeSettings));
    } catch (error) {
      console.error("Gagal menyimpan pengaturan generator:", error);
    }
  }, [settings]);

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

  const handleGenerate = async (isVariation = false, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!settings.prompt) {
      toast.error('Prompt tidak boleh kosong!');
      return;
    }

    setIsLoading(true);
    setImageUrls([]);

    setTimeout(() => {
      imageDisplayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    // Logic for seed: If -1 (auto) or it's a variation request, generate new seed.
    // Otherwise use the fixed seed provided in settings.
    const shouldRandomize = settings.seed === -1 || isVariation;
    const currentSeed = shouldRandomize 
      ? Math.floor(Math.random() * 1000000) 
      : (typeof settings.seed === 'number' ? settings.seed : parseInt(settings.seed) || 0);

    if (shouldRandomize) {
      setSettings(prev => ({ ...prev, seed: currentSeed }));
    }

    const { model, prompt, negativePrompt, width, height, imageQuality, batchSize, artStyle, private: isPrivate, safe, transparent, nologo, inputImages = [], cfg_scale } = settings;
    const fullPrompt = `${prompt}${artStyle}`;

    const generatePromises = Array(batchSize).fill(0).map(async (_, i) => {
      const batchSeed = currentSeed + i;
      try {
        const referenceImages = inputImages
          .filter(url => typeof url === 'string' && url.trim().length > 0)
          .slice(0, MAX_REFERENCE_IMAGES);

        const usePost = referenceImages.length > 0;
        const byopKey = localStorage.getItem('pollinations_api_key');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (byopKey) headers['Authorization'] = `Bearer ${byopKey}`;

        // === OPTIMIZATION: Direct Client Fetch Fallback ===
        // If we have a BYOP Key or we are in development and the proxy fails, 
        // we can try to fetch directly from Pollinations to avoid local server bottlenecks.
        
        const t = Date.now();
        // Map our quality levels to API quality levels
        const qualityMap: Record<string, string> = {
          'Standar': 'medium',
          'HD': 'high',
          'Ultra': 'hd'
        };
        const apiQuality = qualityMap[imageQuality] || 'medium';
        const modelLower = model.toLowerCase();

        const pollParams = new URLSearchParams({
          model, width: width.toString(), height: height.toString(), 
          enhance: imageQuality !== 'Standar' ? 'true' : 'false', 
          referrer: 'ruangriung.my.id',
          t: t.toString()
        });

        // Most models in Pollinations support seed
        pollParams.append('seed', batchSeed.toString());

        // Negative prompt is supported by flux and many other stable diffusion based models
        if (negativePrompt) {
          pollParams.append('negative_prompt', negativePrompt);
        }

        // Parameters only for gptimage
        if (modelLower.includes('gptimage') || modelLower.includes('gpt-image')) {
          pollParams.append('quality', apiQuality);
          if (transparent) pollParams.append('transparent', 'true');
        }

        // Handle Video models (veo, seedance, wan)
        const isVideo = ['veo', 'seedance', 'wan', 'nova-reel', 'p-video'].some(m => modelLower.includes(m));
        if (isVideo) {
          // aspectRatio handled by width/height ratio if not set, but we can be explicit
          const ratio = width > height ? '16:9' : '9:16';
          pollParams.append('aspectRatio', ratio);
          // Default duration 5s if not specified
          pollParams.append('duration', '5');
          pollParams.append('audio', 'true');
        }

        if (safe) pollParams.append('safe', 'true');
        if (nologo) pollParams.append('nologo', 'true');

        let imageUrl: string | null = null;

        try {
          if (usePost) {
            // Convert params to object for POST body
            const postBody: any = Object.fromEntries(pollParams.entries());
            postBody.prompt = fullPrompt;
            if (referenceImages[0]) postBody.image = referenceImages[0];

            const response = await fetch('/api/pollinations/image', {
              method: 'POST',
              headers,
              body: JSON.stringify(postBody),
            });

            if (!response.ok) throw new Error(`Proxy Error: ${response.status}`);
            const blob = await response.blob();
            imageUrl = URL.createObjectURL(blob);
          } else {
            // For GET (Text-to-Image), we use pollinations proxy with cache buster
            const proxyUrl = `/api/pollinations/image?prompt=${encodeURIComponent(fullPrompt)}&${pollParams.toString()}`;
            
            // For direct URL, we MUST include the key in query if available
            const directParams = new URLSearchParams(pollParams);
            if (byopKey) directParams.append('key', byopKey);
            const directUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(fullPrompt)}?${directParams.toString()}`;

            console.log(`[Generator] Generating with model: ${model}, params: ${pollParams.toString()}`);

            // Try proxy first
            try {
              const response = await fetch(proxyUrl, { headers, signal: AbortSignal.timeout(90000) });
              if (response.ok) {
                const blob = await response.blob();
                imageUrl = URL.createObjectURL(blob);
              } else {
                throw new Error(`Proxy status: ${response.status}`);
              }
            } catch (proxyError: any) {
              // Only attempt direct fetch if we have a personal key (BYOP)
              if (byopKey) {
                console.warn('Proxy failed, attempting direct fetch:', proxyError);
                const directResponse = await fetch(directUrl, { signal: AbortSignal.timeout(90000) });
                if (!directResponse.ok) throw new Error(`Direct Fetch Error: ${directResponse.status}`);
                const blob = await directResponse.blob();
                imageUrl = URL.createObjectURL(blob);
              } else {
                throw new Error(`Gagal (Proxy): ${proxyError.message}`);
              }
            }
          }
        } catch (fetchError: any) {
          throw new Error(`Gagal memproses gambar #${i + 1}: ${fetchError.message}`);
        }

        return imageUrl;

      } catch (error: any) {
        toast.error(error.message || `Gagal membuat gambar #${i + 1}`);
        handleModelSelect('flux');
        return null;
      }
    });

    const generatedUrls = (await Promise.all(generatePromises)).filter((url): url is string => url !== null);

    if (generatedUrls.length > 0) {
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
      nologo: true, // Reset ke default
      inputImages: createEmptyReferenceImages(), // Kosongkan input image
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
          onByopChange={() => setByopKeyVersion(v => v + 1)}
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