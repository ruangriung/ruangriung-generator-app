// components/StorytellerClient.tsx
'use client';

import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import toast from 'react-hot-toast';
// Impor ikon Info di sini
import { Send, Download, Loader2, Sparkles, ZoomIn, Copy, Settings, X, Info } from 'lucide-react';
import Spinner from './Spinner';
import ImageModal from './ImageModal';
import Accordion from './Accordion';

// --- Konstanta API ---

// --- Daftar Prompt Acak ---
const DEFAULT_STORY_PROMPTS = [
  'A lone astronaut discovers an ancient alien ruin on a distant moon, revealing a lost civilization.',
  'In a fantastical city powered by dreams, a young artist struggles to find inspiration, only to discover it in the city\'s oldest, forgotten alleyways.',
  'A time-traveling detective chases a notorious phantom thief across different historical eras, from ancient Egypt to futuristic Tokyo.',
  'A mischievous sentient cloud decides to embark on a journey around the world, causing whimsical weather events wherever it goes.',
  'Deep in a bioluminescent forest, a tiny firefly sets out to find the legendary "Starlight Bloom" to save its fading community.',
  'A grumpy old wizard accidentally turns his cat into a dragon, and they must now learn to live together while dealing with the chaos.',
  'A group of toys comes to life in a forgotten attic, embarking on an adventure to find their way back to their original owner.',
  'In a world where memories can be physically collected, a memory hunter uncovers a conspiracy to erase significant historical events.',
  'A magical academy for sentient musical instruments prepares for its annual grand symphony, but a forgotten instrument threatens to disrupt the harmony.',
  'A futuristic chef creates dishes that can evoke specific emotions, leading to unexpected consequences in a society that has suppressed feelings.'
];

const getRandomStoryPrompt = () => {
  return DEFAULT_STORY_PROMPTS[Math.floor(Math.random() * DEFAULT_STORY_PROMPTS.length)];
};

// --- Tipe Data ---
interface StoryPart {
  imagePrompt: string;
  imageUrl: string;
  description: string;
}

type ImageModelType = string;
type TextModelType = string;

interface PollinationsOpenAIResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

interface GeminiApiResponse {
  text?: string;
}


// --- Komponen StorytellerClient ---
const StorytellerClient = memo(() => {
  const [mainPrompt, setMainPrompt] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [generatedStoryParts, setGeneratedStoryParts] = useState<StoryPart[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingRandomPrompt, setIsGeneratingRandomPrompt] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  // --- State untuk indikator kemajuan granular ---
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  // Total langkah: 1 (generate prompts) + 5 (generate images) + 5 (generate descriptions)
  const totalSteps = 1 + 5 + 5;

  // --- State Pengaturan Lanjutan ---
  const [imageModel, setImageModel] = useState<ImageModelType>('flux');
  const [textModel, setTextModel] = useState<TextModelType>('openai');
  const [imageWidth, setImageWidth] = useState(1024);
  const [imageHeight, setImageHeight] = useState(1024);
  const [imageSeed, setImageSeed] = useState(Math.floor(Math.random() * 1000000));
  const [imageQuality, setImageQuality] = useState<'standard' | 'hd'>('standard');

  // --- State untuk Model Dinamis ---
  const [availableImageModels, setAvailableImageModels] = useState<ImageModelType[]>(['flux']);
  const [availableTextModels, setAvailableTextModels] = useState<TextModelType[]>(['openai']);

  // --- State untuk Modal Zoom Gambar ---
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  const resultsRef = useRef<HTMLDivElement>(null);

  // --- Hooks Efek ---
  useEffect(() => {
    // --- Muat Model AI Secara Dinamis ---
    const fetchModels = async () => {
      try {
        // Fetch Image Models
        const imgResponse = await fetch('/api/pollinations/models/image');
        let imgModelsList = ['flux'];
        if (imgResponse.ok) {
          const imgData = await imgResponse.json();
          if (Array.isArray(imgData)) {
            imgModelsList = [...new Set(['flux', ...imgData.map((m: any) => typeof m === 'string' ? m : m.id || m.name)])];
          }
        }
        setAvailableImageModels(imgModelsList as any);

        // Fetch Text Models
        const textResponse = await fetch('/api/pollinations/models/text');
        let textModelsList = ['openai'];
        if (textResponse.ok) {
          const textData = await textResponse.json();
          if (Array.isArray(textData)) {
            textModelsList = [...new Set([...textData.map((m: any) => m.id || m.name)])];
          }
        }
        if (textModelsList.length > 0) {
          setAvailableTextModels(textModelsList as any);
          if (!textModelsList.includes(textModel as any)) {
            setTextModel(textModelsList[0] as any); // fallback selection
          }
        }

      } catch (error) {
        console.error("Error fetching dynamic models:", error);
        setAvailableImageModels(['flux']); 
        setAvailableTextModels(['openai', 'mistral']);
      }
    };
    fetchModels();
  }, []);

  // --- Fungsi Handle Generate Story ---
  const handleGenerateStory = useCallback(async () => {
    // Validasi dasar
    if (!mainPrompt) { toast.error('Ide cerita tidak boleh kosong!'); return; }

    setIsLoading(true);
    setCurrentStep(0); // Reset langkah
    setProgressMessage('Memulai pembuatan cerita...'); // Pesan awal
    const generationToastId = toast.loading("AI RuangRIung Sedang Berpikir...");
    setGeneratedStoryParts([]);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      // --- Step 1: Minta AI Teks untuk membuat 5 prompt gambar dari ide cerita utama ---
      setProgressMessage('AI sedang menyusun ide-ide adegan...');
      setCurrentStep(1);
      const promptInstructionForImages = `Berdasarkan ide cerita berikut: '${mainPrompt}', buatlah 5 deskripsi prompt gambar yang sangat kreatif, sinematik, dan detail secara visual. Setiap prompt harus menggambarkan satu adegan penting yang berurutan untuk membentuk sebuah cerita visual yang utuh. Sertakan detail tentang gaya seni, pencahayaan, suasana, dan komposisi. Berikan dalam format daftar berpoin (1-5). Jangan sertakan teks penjelasan lainnya, cukup daftar prompt saja.`;

      let imagePromptsText = '';
      
      const imagePromptsResponse = await fetch('/api/pollinations/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: textModel,
          prompt: promptInstructionForImages,
          temperature: 0.8,
        }),
      });
      
      if (!imagePromptsResponse.ok) throw new Error(`Gagal membuat prompt gambar.`);
      
      imagePromptsText = await imagePromptsResponse.text();

      const rawImagePrompts = imagePromptsText.split(/\n[\*-]?\s*\d*\.?\s*/).filter((p: string) => p.trim() !== '');
      if (rawImagePrompts.length === 0) throw new Error('AI tidak dapat menghasilkan prompt gambar yang valid.');

      // --- Step 2: Hasilkan gambar dan deskripsinya secara paralel for setiap prompt ---
      const storyPromises = rawImagePrompts.slice(0, 5).map(async (imgPrompt: string, index: number) => {
        setProgressMessage(`Adegan ${index + 1}...`);
        
        const imageParams = new URLSearchParams({
          prompt: imgPrompt,
          model: imageModel,
          width: imageWidth.toString(),
          height: imageHeight.toString(),
          seed: (imageSeed + index).toString(),
          nologo: 'true',
          referrer: 'ruangriung.my.id'
        });

        const imageResponse = await fetch(`/api/pollinations/image?${imageParams.toString()}`);
        if (!imageResponse.ok) throw new Error(`Gagal membuat gambar #${index + 1}`);
        const finalImageUrl = imageResponse.url;

        const promptInstructionForDescription = `Buatkan narasi pendek (sekitar 60-100 kata) untuk adegan: '${imgPrompt}'.`;

        const descriptionResponse = await fetch('/api/pollinations/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: textModel,
            prompt: promptInstructionForDescription,
            temperature: 0.7,
          }),
        });

        const descriptionText = descriptionResponse.ok ? await descriptionResponse.text() : 'Deskripsi tidak tersedia.';

        return { imagePrompt: imgPrompt, imageUrl: finalImageUrl, description: descriptionText };
      });

      const results = await Promise.all(storyPromises);
      setGeneratedStoryParts(results.filter(part => part.imageUrl));
      toast.success(`Berhasil!`, { id: generationToastId });

    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: generationToastId });
    } finally {
      setIsLoading(false);
      setProgressMessage('');
      setCurrentStep(0);
    }
  }, [mainPrompt, textModel, imageModel, imageWidth, imageHeight, imageSeed]);

  // --- Fungsi Handle Random Prompt ---
  const handleRandomPrompt = useCallback(async () => {
    if (isGeneratingRandomPrompt || isLoading || isGeneratingTitle) return;

    setIsGeneratingRandomPrompt(true);
    const randomPromptToastId = toast.loading("AI RuangRIung Sedang Berpikir...");
    setMainPrompt('');
    setStoryTitle('');
    setGeneratedStoryParts([]);

    try {
      const promptInstruction = `Hasilkan satu ide cerita yang sangat kreatif, unik, dan penuh imajinasi (sekitar 100-150 kata). Ide ini akan digunakan untuk membuat cerita visual 5 adegan. Pastikan ceritanya memiliki konflik yang menarik dan nuansa visual yang kuat. Berikan hanya ide ceritanya saja. Timestamp:${Date.now()}`;

      const response = await fetch('/api/pollinations/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: textModel,
          prompt: promptInstruction,
          temperature: 0.95,
        }),
      });

      if (!response.ok) throw new Error(`Gagal membuat ide acak.`);

      const generatedPromptText = await response.text();
      setMainPrompt(generatedPromptText);
      toast.success("Ide cerita acak berhasil dimuat!", { id: randomPromptToastId });
    } catch (error: any) {
      console.error("Gagal menghasilkan ide acak:", error);
      toast.error(`Gagal menghasilkan ide acak: ${error.message}`, { id: randomPromptToastId });
      setMainPrompt("Gagal memuat ide cerita acak. Silakan coba lagi.");
    } finally {
      setIsGeneratingRandomPrompt(false);
    }
  }, [isGeneratingRandomPrompt, isLoading, isGeneratingTitle, textModel]);

  // --- Fungsi untuk membuat Judul Cerita dengan AI ---
  const handleGenerateTitle = useCallback(async () => {
    if (isGeneratingTitle || isLoading || isGeneratingRandomPrompt || !mainPrompt) return;

    setIsGeneratingTitle(true);
    const titleToastId = toast.loading("AI RuangRIung Sedang Berpikir...");
    setStoryTitle('');

    try {
      const promptInstruction = `Berdasarkan ide cerita berikut, buatlah judul yang puitis dan menarik (maksimal 7 kata). Berikan hanya judulnya saja tanpa tanda kutip:\n\n'${mainPrompt}' Timestamp:${Date.now()}`;
      
      const response = await fetch('/api/pollinations/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: textModel,
          prompt: promptInstruction,
          temperature: 0.8,
        }),
      });

      if (!response.ok) throw new Error(`Gagal membuat judul.`);

      const generatedTitleText = await response.text();
      setStoryTitle(generatedTitleText.replace(/"/g, ''));
      toast.success("Judul berhasil dibuat!", { id: titleToastId });

    } catch (error: any) {
      console.error("Gagal menghasilkan judul:", error);
      toast.error(`Gagal menghasilkan judul: ${error.message}`, { id: titleToastId });
      setStoryTitle("Gagal memuat judul.");
    } finally {
      setIsGeneratingTitle(false);
    }
  }, [isGeneratingTitle, isLoading, isGeneratingRandomPrompt, mainPrompt, textModel]);


  const handleCopyDescription = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Deskripsi disalin!");
  };

  const handleOpenImageModal = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleDownloadStory = () => {
    if (generatedStoryParts.length === 0) {
      toast.error('Tidak ada cerita untuk diunduh.');
      return;
    }

    let storyTextContent = `# ${storyTitle || 'Cerita Visual AI'}\n\n`;
    storyTextContent += `**Ide Cerita Utama:** ${mainPrompt}\n\n`;

    generatedStoryParts.forEach((part, index) => {
      storyTextContent += `---\n\n`;
      storyTextContent += `## Adegan ${index + 1}\n\n`;
      storyTextContent += `*Prompt Gambar:* \`${part.imagePrompt}\`\n\n`;
      storyTextContent += `${part.description}\n\n`;
      storyTextContent += `![Gambar Adegan ${index + 1}](${part.imageUrl})\n\n`;
    });

    const textBlob = new Blob([storyTextContent], { type: 'text/markdown' });
    const textUrl = URL.createObjectURL(textBlob);
    const textLink = document.createElement('a');
    textLink.href = textUrl;
    textLink.download = `${(storyTitle || 'cerita_visual_ai').replace(/\s/g, '_')}.md`;
    document.body.appendChild(textLink);
    textLink.click();
    document.body.removeChild(textLink);
    URL.revokeObjectURL(textUrl);

    generatedStoryParts.forEach((part, index) => {
      if (part.imageUrl) {
        const imageLink = document.createElement('a');
        imageLink.href = part.imageUrl;
        imageLink.download = `${(storyTitle || 'gambar').replace(/\s/g, '_')}_adegan_${index + 1}.png`;
        document.body.appendChild(imageLink);
        imageLink.click();
        document.body.removeChild(imageLink);
      }
    });

    toast.success('Cerita dan gambar mulai diunduh!');
  };

  // --- Gaya Umum ---
  const inputFieldStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-gray-800 dark:text-gray-200";
  const selectStyle = `${inputFieldStyle} appearance-none`;


  return (
    <div className="flex flex-col gap-8">
      {/* Bagian Input untuk Ide Cerita */}
      <div className="bg-light-bg dark:bg-dark-bg p-6 rounded-2xl shadow-neumorphic-card dark:shadow-dark-neumorphic-card">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Ide Cerita Anda</h2>

        {/* Judul Cerita */}
        <label htmlFor="story-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Judul Cerita (Opsional):
        </label>
        <div className="relative mb-4">
          <input
            id="story-title"
            type="text"
            placeholder={isGeneratingTitle ? "AI sedang membuat judul..." : "Masukkan judul cerita Anda..."}
            className={`${inputFieldStyle} pr-12`}
            value={storyTitle}
            onChange={(e) => setStoryTitle(e.target.value)}
            disabled={isLoading || isGeneratingRandomPrompt || isGeneratingTitle}
          />
          <button
            onClick={handleGenerateTitle}
            disabled={isLoading || isGeneratingRandomPrompt || isGeneratingTitle || !mainPrompt}
            className="absolute top-2 right-2 p-2 bg-light-bg dark:bg-dark-bg rounded-full shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-all"
            title="Buat Judul dengan AI"
            aria-label="Buat Judul Cerita dengan AI"
          >
            {isGeneratingTitle ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
          </button>
        </div>

        {/* Ide Cerita Utama */}
        <label htmlFor="main-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Ide Cerita Utama:
        </label>
        <div className="relative mb-6">
          <textarea
            id="main-prompt"
            className={`${inputFieldStyle} min-h-[180px] resize-y pr-20`}
            placeholder={isGeneratingRandomPrompt ? "AI sedang membuat ide cerita..." : "Tekan tombol 'Ide Acak' atau masukkan ide Anda sendiri di sini..."}
            value={mainPrompt}
            onChange={(e) => setMainPrompt(e.target.value)}
            disabled={isLoading || isGeneratingRandomPrompt || isGeneratingTitle}
          ></textarea>
          {mainPrompt && (
            <button
              onClick={() => setMainPrompt('')}
              disabled={isLoading || isGeneratingRandomPrompt || isGeneratingTitle}
              className="absolute top-2 right-10 p-2 bg-light-bg dark:bg-dark-bg rounded-full shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset text-gray-700 dark:text-gray-300 hover:text-red-600 transition-all"
              title="Hapus Teks"
              aria-label="Hapus Teks"
            >
              <X size={20} />
            </button>
          )}
          <button
            onClick={handleRandomPrompt}
            disabled={isLoading || isGeneratingRandomPrompt || isGeneratingTitle}
            className="absolute top-2 right-2 p-2 bg-light-bg dark:bg-dark-bg rounded-full shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-all"
            title="Dapatkan Ide Acak"
            aria-label="Dapatkan Ide Cerita Acak"
          >
            {isGeneratingRandomPrompt ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
          </button>
        </div>

        {/* --- Pengaturan Lanjutan --- */}
        <Accordion title={<div className="flex items-center gap-2"><Settings className="text-purple-600" />Pengaturan Lanjutan</div>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pilihan Model Teks */}
            <div>
              <label htmlFor="text-model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Model AI Teks:
              </label>
              <select
                id="text-model"
                value={textModel}
                onChange={(e) => setTextModel(e.target.value as TextModelType)}
                className={selectStyle}
              >
                {availableTextModels.map(model => (
                  <option key={model} value={model}>
                    {model === 'openai' ? 'OpenAI' : model}
                  </option>
                ))}
              </select>
            </div>

            {/* Pilihan Model AI Gambar */}
            <div>
              <label htmlFor="image-model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Model AI Gambar:
              </label>
              <select
                id="image-model"
                value={imageModel}
                onChange={(e) => {
                  setImageModel(e.target.value as ImageModelType);
                }}
                className={selectStyle}
              >
                {availableImageModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            {/* Kualitas Gambar (hanya untuk DALL-E 3) */}


            {/* Lebar Gambar (untuk Flux/Leonardo) */}
            {(imageModel === 'flux') && (
              <div>
                <label htmlFor="image-width" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lebar Gambar (px):
                  <span className="ml-1 cursor-help" title="Lebar gambar dalam piksel. Sesuaikan untuk rasio aspek atau ukuran tertentu.">
                    <Info size={14} className="inline-block text-gray-500 dark:text-gray-400" />
                  </span>
                </label>
                <input
                  id="image-width"
                  type="number"
                  min="256" max="2048" step="64"
                  value={imageWidth}
                  onChange={(e) => setImageWidth(parseInt(e.target.value) || 0)}
                  className={inputFieldStyle}
                />
              </div>
            )}

            {/* Tinggi Gambar (untuk Flux/Leonardo) */}
            {(imageModel === 'flux') && (
              <div>
                <label htmlFor="image-height" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tinggi Gambar (px):
                  <span className="ml-1 cursor-help" title="Tinggi gambar dalam piksel. Sesuaikan untuk rasio aspek atau ukuran tertentu.">
                    <Info size={14} className="inline-block text-gray-500 dark:text-gray-400" />
                  </span>
                </label>
                <input
                  id="image-height"
                  type="number"
                  min="256" max="2048" step="64"
                  value={imageHeight}
                  onChange={(e) => setImageHeight(parseInt(e.target.value) || 0)}
                  className={inputFieldStyle}
                />
              </div>
            )}

            {/* Seed Gambar */}
            <div className="md:col-span-2">
              <label htmlFor="image-seed" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Seed Gambar:
                <span className="ml-1 cursor-help" title="Seed mempengaruhi keunikan dan konsistensi gambar yang dihasilkan. Gunakan angka yang sama untuk hasil yang mirip; ubah untuk variasi baru.">
                  <Info size={14} className="inline-block text-gray-500 dark:text-gray-400" />
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  id="image-seed"
                  type="number"
                  value={imageSeed}
                  onChange={(e) => setImageSeed(parseInt(e.target.value) || 0)}
                  className={`${inputFieldStyle} flex-grow`}
                  title="Seed mempengaruhi keunikan gambar yang dihasilkan. Gunakan angka yang sama untuk hasil yang mirip."
                />
                <button
                  onClick={() => setImageSeed(Math.floor(Math.random() * 1000000))}
                  className="p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-all"
                  title="Acak Seed"
                  aria-label="Acak Seed Gambar"
                >
                  <Sparkles size={20} />
                </button>
              </div>
            </div>
          </div>
        </Accordion>

        <button
          onClick={handleGenerateStory}
          disabled={isLoading || isGeneratingRandomPrompt || isGeneratingTitle || !mainPrompt}
          className="mt-6 w-full py-3 px-6 rounded-xl text-white font-semibold flex items-center justify-center transition-all duration-300
                     bg-purple-600 hover:bg-purple-700 shadow-neumorphic-button dark:shadow-dark-neumorphic-button
                     active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" /> Membangun Cerita...
            </>
          ) : (
            <>
              <Send size={20} className="mr-2" /> Buat Cerita
            </>
          )}
        </button>
      </div>

      {/* Bagian Tampilan Hasil Cerita */}
      <div ref={resultsRef} className="bg-light-bg dark:bg-dark-bg p-6 rounded-2xl shadow-neumorphic-card dark:shadow-dark-neumorphic-card">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Hasil Cerita Visual</h2>
        {isLoading && generatedStoryParts.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500 dark:text-gray-400">
            <Spinner />
            <p className="mt-4 text-center">{progressMessage || "AI RuangRIung Sedang Berpikir..."}</p>
            {currentStep > 0 && (
              <p className="text-sm text-center">Langkah {currentStep} dari {totalSteps} selesai.</p>
            )}
            <p className="text-sm text-center">Proses ini mungkin memakan waktu beberapa saat karena AI akan menghasilkan 5 gambar dan teks.</p>
          </div>
        )}

        {!isLoading && generatedStoryParts.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 min-h-[100px] flex items-center justify-center">
            <p>Cerita visual yang Anda hasilkan akan muncul di sini.</p>
          </div>
        )}

        {generatedStoryParts.length > 0 && (
          <>
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">{storyTitle || 'Cerita Visual AI'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedStoryParts.map((part, index) => (
                <div key={index} className="bg-light-bg-secondary dark:bg-dark-bg-secondary p-4 rounded-xl shadow-neumorphic-inset dark:shadow-neumorphic-inset flex flex-col">
                  <h4 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-200 text-center">Adegan {index + 1}</h4>
                  {part.imageUrl ? (
                    <img
                      src={part.imageUrl}
                      alt={`Adegan ${index + 1}`}
                      className="w-full h-auto rounded-lg mb-4 object-contain max-h-64 cursor-pointer"
                      onClick={() => handleOpenImageModal(part.imageUrl)}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center text-gray-500">
                      Gambar tidak tersedia
                    </div>
                  )}
                  <p className="text-sm text-gray-700 dark:text-gray-300 text-center mb-2">
                    **Prompt:** "{part.imagePrompt}"
                  </p>
                  <div className="relative w-full mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Deskripsi:
                    </label>
                    <textarea
                      readOnly
                      value={part.description}
                      className={`${inputFieldStyle} min-h-[80px] resize-y pr-10`}
                    ></textarea>
                    <button
                      onClick={() => handleCopyDescription(part.description)}
                      className="absolute top-8 right-2 p-1.5 text-gray-500 hover:text-green-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title="Salin Deskripsi"
                      aria-label="Salin Deskripsi Adegan"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleDownloadStory}
              className="mt-8 w-full py-3 px-6 rounded-xl text-white font-semibold flex items-center justify-center transition-all duration-300
                         bg-blue-600 hover:bg-blue-700 shadow-neumorphic-button dark:shadow-dark-neumorphic-button
                         active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset"
            >
              <Download size={20} className="mr-2" /> Unduh Cerita
            </button>
          </>
        )}
      </div>

      {/* Modal untuk Zoom Gambar */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={modalImageUrl}
      />

    </div>
  );
});

StorytellerClient.displayName = 'StorytellerClient';

export default StorytellerClient;