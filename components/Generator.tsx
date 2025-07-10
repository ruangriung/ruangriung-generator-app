'use client';

import { useState, useEffect } from 'react';
import ControlPanel, { GeneratorSettings } from './ControlPanel';
import ImageDisplay from './ImageDisplay';
import ImageModal from './ImageModal';

// Tipe untuk preset aspek rasio
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

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('https://image.pollinations.ai/models');
        if (!response.ok) throw new Error('Gagal mengambil daftar model');
        const models = await response.json();
        setModelList(models);
        if (models.length > 0 && !settings.model) {
            setSettings(prev => ({ ...prev, model: models[0] }));
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        setModelList(['flux', 'dall-e-3', 'stable-diffusion-xl']);
      }
    };
    fetchModels();
  }, []);

  // Efek untuk mengubah ukuran berdasarkan preset aspek rasio
  useEffect(() => {
    const presetSettings = {
      'Kotak': { width: 1024, height: 1024 },
      'Portrait': { width: 1024, height: 1792 },
      'Lansekap': { width: 1792, height: 1024 },
    };
    const { width, height } = presetSettings[aspectRatio];
    setSettings(prev => ({ ...prev, width, height }));
  }, [aspectRatio]);

  const handleGenerateImage = () => {
    if (!settings.prompt) {
      alert('Prompt tidak boleh kosong!');
      return;
    }
    setIsLoading(true);
    const newSeed = Math.floor(Math.random() * 1000000);
    setSettings(prev => ({ ...prev, seed: newSeed }));
    
    const fullPrompt = `${settings.prompt}${settings.artStyle}`;
    const encodedPrompt = encodeURIComponent(fullPrompt);
    
    const params = new URLSearchParams({
      model: settings.model,
      width: settings.width.toString(),
      height: settings.height.toString(),
      seed: newSeed.toString(),
      nologo: 'true',
      enhance: 'true',
      safe: 'false',
      referrer: 'ruangriung.my.id',
      cb: Date.now().toString()
    });
    const finalUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;
    setImageUrl(finalUrl);
  };

  return (
    <>
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
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          alert('Gagal memuat gambar. API mungkin sibuk atau parameter tidak valid.');
        }}
        onZoomClick={() => setIsModalOpen(true)}
      />
      <ImageModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={imageUrl}
      />
    </>
  );
}