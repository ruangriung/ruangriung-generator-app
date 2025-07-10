'use client';

import { useState } from 'react';
import ControlPanel, { GeneratorSettings } from '../components/ControlPanel';
import ImageDisplay from '../components/ImageDisplay';

export default function Home() {
  // State untuk semua pengaturan, disimpan dalam satu objek
  const [settings, setSettings] = useState<GeneratorSettings>({
    prompt: 'Kastil fantasi di atas awan',
    model: 'stable-diffusion-xl',
    width: 1024,
    height: 1024,
    seed: Math.floor(Math.random() * 100000), // Seed acak setiap kali
    artStyle: '',
  });

  // State terpisah untuk URL gambar dan status loading
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateImage = () => {
    if (!settings.prompt) {
      alert('Prompt tidak boleh kosong!');
      return;
    }

    setIsLoading(true);
    // setImageUrl(''); // Dihapus agar gambar lama tetap ada saat loading

    // Gabungkan prompt utama dengan gaya seni
    const fullPrompt = `${settings.prompt}${settings.artStyle}`;
    const encodedPrompt = encodeURIComponent(fullPrompt);
    
    // Siapkan parameter dari state
    const params = new URLSearchParams({
      model: settings.model,
      width: settings.width.toString(),
      height: settings.height.toString(),
      seed: settings.seed.toString(),
      nologo: 'true',
      enhance: 'true',
      safe: 'false',
      referrer: 'ruangriung.my.id',
    });

    const finalUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;
    
    // Langsung set URL, komponen ImageDisplay akan menanganinya
    setImageUrl(finalUrl);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-gray-200">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-700">Ruang Riung AI Generator</h1>
        <p className="text-gray-500 mt-2">Wujudkan imajinasi Anda menjadi gambar</p>
      </header>
      
      <ControlPanel 
        settings={settings}
        setSettings={setSettings}
        onGenerate={handleGenerateImage}
        isLoading={isLoading}
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
      />
    </main>
  );
}