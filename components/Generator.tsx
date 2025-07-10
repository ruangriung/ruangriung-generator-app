'use client';

import { useState, useEffect } from 'react';
import ControlPanel, { GeneratorSettings } from './ControlPanel'; // <-- Impor tipe data
import ImageDisplay from './ImageDisplay';
import ImageModal from './ImageModal';

type AspectRatioPreset = 'Kotak' | 'Portrait' | 'Lansekap';

export default function Generator() {
  const [settings, setSettings] = useState<GeneratorSettings>({
    prompt: 'The spiderman in the style of a 1980s comic book, vibrant colors, dynamic pose, detailed city background',
    model: 'flux',
    width: 1024,
    height: 1792,
    seed: Math.floor(Math.random() * 1000000),
    artStyle: '',
  });

  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modelList, setModelList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioPreset>('Portrait');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('https://image.pollinations.ai/models');
        if (!response.ok) throw new Error('Gagal mengambil daftar model');
        const models = await response.json();
        setModelList(models);
        if (models.length > 0 && settings.model === 'flux') {
            setSettings(prev => ({ ...prev, model: models[0] }));
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        setModelList(['flux', 'turbo', 'kontext']);
      }
    };
    fetchModels();
  }, []);

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

  const handleDownloadImage = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ruangriung-${Date.now()}.png`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal mengunduh gambar:", error);
      alert("Gagal mengunduh gambar. Silakan coba simpan manual.");
    }
  };

  return (
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
        onLoad={() => setIsLoading(false)}
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
  );
}