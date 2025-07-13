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
    prompt: 'Spiderman di ruangriung, digital art, fantasy, vibrant colors',
    model: 'flux',
    width: 1024,
    height: 1024,
    seed: Math.floor(Math.random() * 1000000),
    artStyle: '',
    batchSize: 1,
    imageQuality: 'Standar',
  });

  // PERUBAHAN: imageUrl menjadi imageUrls (array)
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
    let newWidth = 1024;
    let newHeight = 1024;
    if (preset === 'Portrait') {
      newWidth = 1024; newHeight = 1792;
    } else if (preset === 'Lansekap') {
      newWidth = 1792; newHeight = 1024;
    }

    setSettings(prev => ({
        ...prev,
        width: newWidth,
        height: newHeight,
        imageQuality: 'Standar',
    }));
  };

  const onManualDimensionChange = (newWidth: number, newHeight: number) => {
    setSettings(prev => ({ ...prev, width: newWidth, height: newHeight, imageQuality: 'Standar' }));
    if (newWidth === 1024 && newHeight === 1024) {
      setAspectRatio('Kotak');
    } else if (newWidth === 1024 && newHeight === 1792) {
      setAspectRatio('Portrait');
    } else if (newWidth === 1792 && newHeight === 1024) {
      setAspectRatio('Lansekap');
    } else {
      setAspectRatio('Custom');
    }
  };

  const onImageQualityChange = (quality: 'Standar' | 'HD' | 'Ultra') => {
      setSettings(prev => {
          let newWidth = prev.width;
          let newHeight = prev.height;

          if (quality === 'Standar') {
              switch (aspectRatio) {
                  case 'Kotak': newWidth = 1024; newHeight = 1024; break;
                  case 'Portrait': newWidth = 1024; newHeight = 1792; break;
                  case 'Lansekap': newWidth = 1792; newHeight = 1024; break;
                  default:
                      newWidth = 1024; newHeight = 1024; break;
              }
          } else if (quality === 'HD') {
              switch (aspectRatio) {
                  case 'Kotak': newWidth = 1536; newHeight = 1536; break;
                  case 'Portrait': newWidth = 1536; newHeight = 2688; break;
                  case 'Lansekap': newWidth = 2688; newHeight = 1536; break;
                  default:
                      newWidth = Math.min(Math.round(prev.width * 1.5 / 64) * 64, 3584);
                      newHeight = Math.min(Math.round(prev.height * 1.5 / 64) * 64, 3584);
                      break;
              }
          } else if (quality === 'Ultra') {
              switch (aspectRatio) {
                  case 'Kotak': newWidth = 2048; newHeight = 2048; break;
                  case 'Portrait': newWidth = 2048; newHeight = 3584; break;
                  case 'Lansekap': newWidth = 3584; newHeight = 2048; break;
                  default:
                      newWidth = Math.min(Math.round(prev.width * 2.0 / 64) * 64, 3584);
                      newHeight = Math.min(Math.round(prev.height * 2.0 / 64) * 64, 3584);
                      break;
              }
          }

          if (newWidth === 1024 && newHeight === 1024) setAspectRatio('Kotak');
          else if (newWidth === 1024 && newHeight === 1792) setAspectRatio('Portrait');
          else if (newWidth === 1792 && newHeight === 1024) setAspectRatio('Lansekap');
          else setAspectRatio('Custom');

          return {
              ...prev,
              width: newWidth,
              height: newHeight,
              imageQuality: quality,
          };
      });
  };

  const handleGenerateImage = async () => {
    if (!settings.prompt) {
      toast.error('Prompt tidak boleh kosong!');
      return;
    }

    setIsLoading(true);
    setImageUrls([]); // PERUBAHAN: Bersihkan array URL gambar sebelumnya

    // PERUBAHAN: Array untuk menyimpan URL gambar yang dihasilkan
    const generatedUrls: string[] = [];
    const generatePromises: Promise<void>[] = [];

    const enhanceFlag = settings.imageQuality === 'Standar' ? 'false' : 'true';

    for (let i = 0; i < settings.batchSize; i++) {
        const newSeed = Math.floor(Math.random() * 1000000000); // Gunakan seed unik untuk setiap gambar
        
        const currentPrompt = `${settings.prompt}${settings.artStyle}`;
        const encodedPrompt = encodeURIComponent(currentPrompt);
        
        const params = new URLSearchParams({
            model: settings.model,
            width: settings.width.toString(),
            height: settings.height.toString(),
            seed: newSeed.toString(),
            nologo: 'true',
            enhance: enhanceFlag,
            safe: 'false',
            referrer: 'ruangriung.my.id',
            cb: Date.now().toString() + i // Tambahkan indeks untuk keunikan cachebuster
        });
        const finalUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;

        // Tambahkan promise ke array
        generatePromises.push(
            (async () => {
                try {
                    const imageResponse = await fetch(finalUrl); 
                    if (!imageResponse.ok) {
                        const errorText = await imageResponse.text();
                        throw new Error(`Gagal mengambil gambar dari API Pollinations: ${imageResponse.status} - ${errorText}`);
                    }

                    const contentType = imageResponse.headers.get('content-type');
                    if (!contentType || !contentType.startsWith('image/')) {
                        throw new Error('Respons API bukan gambar atau tipe konten tidak valid.');
                    }
                    
                    generatedUrls.push(finalUrl); // Simpan URL yang berhasil
                    addToHistory({ imageUrl: finalUrl, prompt: settings.prompt, timestamp: Date.now() });
                } catch (error: any) {
                    toast.error(`Gagal membuat gambar #${i + 1}: ${error.message}`);
                    console.error(`Error generating image #${i + 1}:`, error);
                }
            })()
        );
    }

    const generationProcessPromise = Promise.all(generatePromises)
        .then(() => {
            setImageUrls(generatedUrls); // Set semua URL yang berhasil ke state
            if (generatedUrls.length > 0) {
                return `Berhasil membuat ${generatedUrls.length} gambar!`;
            } else {
                throw new Error("Tidak ada gambar yang berhasil dibuat.");
            }
        })
        .catch((error) => {
            // Error handling untuk Promise.all akan menangkap error dari individual fetches
            // namun toast error sudah ditangani di dalam loop.
            // Ini akan menangani jika Promise.all itu sendiri gagal atau tidak ada gambar.
            throw new Error(error.message || "Terjadi kesalahan saat membuat gambar.");
        })
        .finally(() => {
            setIsLoading(false);
        });

    toast.promise(generationProcessPromise, {
      loading: `Membuat ${settings.batchSize} gambar...`,
      success: (message: string) => message,
      error: (message: string) => `Gagal membuat gambar: ${message}`,
    });
  };

  const handleDownloadImage = async () => {
      if (imageUrls.length === 0) return; // PERUBAHAN: Cek array
      try {
          // Download all images
          for (const url of imageUrls) {
              const a = document.createElement('a');
              a.href = url; 
              // Gunakan prompt dan timestamp untuk nama file yang unik dan deskriptif
              const filename = `${settings.prompt.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.png`;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              a.remove();
          }
          toast.success(`Berhasil mengunduh ${imageUrls.length} gambar!`); // PERUBAHAN: Pesan untuk banyak gambar
      } catch (error) {
          toast.error("Gagal mengunduh gambar.");
      }
  };

  const handleSelectFromHistory = (item: HistoryItem) => {
    // Saat memilih dari riwayat, hanya satu gambar yang dimuat ke ImageDisplay utama
    setImageUrls([item.imageUrl]); // PERUBAHAN: Set array dengan satu item
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
        />
        <ImageDisplay
          isLoading={isLoading}
          imageUrls={imageUrls} // PERUBAHAN: Meneruskan array URL gambar
          prompt={settings.prompt}
          onZoomClick={() => setIsModalOpen(true)} // Akan tetap membuka modal untuk gambar utama/pertama jika perlu
          onDownloadClick={handleDownloadImage}
          onVariationsClick={handleGenerateImage}
        />
        {/* ImageModal masih akan menampilkan satu gambar, mungkin perlu modifikasi lebih lanjut untuk batch */}
        <ImageModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imageUrl={imageUrls[0] || ''} // Menampilkan gambar pertama dari batch di modal
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