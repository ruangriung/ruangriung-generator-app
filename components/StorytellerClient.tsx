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
  const inputFieldStyle = "w-full p-4 rounded-2xl border border-white/10 bg-slate-950/5 dark:bg-black/20 text-sm font-bold text-slate-900 dark:text-white focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-slate-400";
  const selectStyle = `${inputFieldStyle} appearance-none cursor-pointer`;


  return (
    <div className="flex flex-col gap-10">
      {/* Bagian Input untuk Ide Cerita */}
      <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[80px] rounded-full -mr-32 -mt-32" />
        
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500">
            <Sparkles size={20} />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Kanvas Imajinasi</h2>
        </div>

        <div className="grid gap-8">
          {/* Judul Cerita */}
          <div className="space-y-3">
            <label htmlFor="story-title" className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Judul Cerita <span className="text-slate-400 font-bold lowercase">(opsional)</span>
            </label>
            <div className="relative group">
              <input
                id="story-title"
                type="text"
                placeholder={isGeneratingTitle ? "AI sedang merangkai kata..." : "Beri judul mahakarya Anda..."}
                className={`${inputFieldStyle} pr-14`}
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                disabled={isLoading || isGeneratingRandomPrompt || isGeneratingTitle}
              />
              <button
                onClick={handleGenerateTitle}
                disabled={isLoading || isGeneratingRandomPrompt || isGeneratingTitle || !mainPrompt}
                className="absolute top-2 right-2 h-10 w-10 flex items-center justify-center glass-button rounded-xl text-primary-500 hover:bg-primary-500 hover:text-white transition-all disabled:opacity-30"
                title="Buat Judul dengan AI"
              >
                {isGeneratingTitle ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              </button>
            </div>
          </div>

          {/* Ide Cerita Utama */}
          <div className="space-y-3">
            <label htmlFor="main-prompt" className="px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Inti Cerita
            </label>
            <div className="relative group">
              <textarea
                id="main-prompt"
                className={`${inputFieldStyle} min-h-[200px] resize-none pr-14 pt-4 leading-relaxed`}
                placeholder={isGeneratingRandomPrompt ? "AI sedang menggali inspirasi..." : "Tuliskan premis atau ide cerita Anda di sini..."}
                value={mainPrompt}
                onChange={(e) => setMainPrompt(e.target.value)}
                disabled={isLoading || isGeneratingRandomPrompt || isGeneratingTitle}
              ></textarea>
              
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                <button
                  onClick={handleRandomPrompt}
                  disabled={isLoading || isGeneratingRandomPrompt || isGeneratingTitle}
                  className="h-10 w-10 flex items-center justify-center glass-button rounded-xl text-primary-500 hover:bg-primary-500 hover:text-white transition-all disabled:opacity-30"
                  title="Dapatkan Ide Acak"
                >
                  {isGeneratingRandomPrompt ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                </button>
                
                {mainPrompt && (
                  <button
                    onClick={() => setMainPrompt('')}
                    disabled={isLoading || isGeneratingRandomPrompt || isGeneratingTitle}
                    className="h-10 w-10 flex items-center justify-center glass-button rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    title="Hapus Teks"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- Pengaturan Lanjutan --- */}
        <div className="mt-10">
          <Accordion title={
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-500">
                <Settings size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Laboratorium AI</span>
            </div>
          }>
            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pilihan Model Teks */}
              <div className="space-y-3">
                <label className="px-1 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Model Narasi</label>
                <div className="relative group">
                  <select
                    id="text-model"
                    value={textModel}
                    onChange={(e) => setTextModel(e.target.value as TextModelType)}
                    className={selectStyle}
                  >
                    {availableTextModels.map(model => (
                      <option key={model} value={model} className="bg-slate-900 text-white">
                        {model === 'openai' ? 'OpenAI GPT-4' : model}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-500 transition-colors">
                    <Info size={16} />
                  </div>
                </div>
              </div>

              {/* Pilihan Model AI Gambar */}
              <div className="space-y-3">
                <label className="px-1 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Model Visual</label>
                <div className="relative group">
                  <select
                    id="image-model"
                    value={imageModel}
                    onChange={(e) => setImageModel(e.target.value as ImageModelType)}
                    className={selectStyle}
                  >
                    {availableImageModels.map(model => (
                      <option key={model} value={model} className="bg-slate-900 text-white">{model.toUpperCase()}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-500 transition-colors">
                    <Info size={16} />
                  </div>
                </div>
              </div>

              {/* Dimensi & Seed */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="px-1 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Lebar (px)</label>
                  <input
                    type="number"
                    min="256" max="2048" step="64"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(parseInt(e.target.value) || 0)}
                    className={inputFieldStyle}
                  />
                </div>
                <div className="space-y-3">
                  <label className="px-1 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Tinggi (px)</label>
                  <input
                    type="number"
                    min="256" max="2048" step="64"
                    value={imageHeight}
                    onChange={(e) => setImageHeight(parseInt(e.target.value) || 0)}
                    className={inputFieldStyle}
                  />
                </div>
                <div className="space-y-3">
                  <label className="px-1 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Seed Kristal</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={imageSeed}
                      onChange={(e) => setImageSeed(parseInt(e.target.value) || 0)}
                      className="w-full p-4 rounded-2xl border border-white/10 bg-slate-950/5 dark:bg-black/20 text-sm font-bold text-slate-900 dark:text-white focus:border-primary-500/50 transition-all"
                    />
                    <button
                      onClick={() => setImageSeed(Math.floor(Math.random() * 1000000))}
                      className="h-12 w-12 flex items-center justify-center glass-button rounded-2xl text-primary-500"
                    >
                      <Sparkles size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Accordion>
        </div>

        <button
          onClick={handleGenerateStory}
          disabled={isLoading || isGeneratingRandomPrompt || isGeneratingTitle || !mainPrompt}
          className="mt-12 w-full h-16 rounded-2xl bg-primary-500 text-white text-sm font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-primary-500/25 disabled:opacity-30"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Merajut Narasi...
            </>
          ) : (
            <>
              <Send size={20} /> Jalankan Generator
            </>
          )}
        </button>
      </div>

      {/* Bagian Tampilan Hasil Cerita */}
      <div ref={resultsRef} className="space-y-10">
        {isLoading && generatedStoryParts.length === 0 && (
          <div className="glass-card p-20 flex flex-col items-center justify-center text-center">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-primary-500/20 blur-2xl rounded-full animate-pulse" />
              <Spinner />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Menenun Imajinasi</h3>
            <p className="text-primary-500 font-bold mb-2 animate-pulse">{progressMessage || "AI RuangRIung Sedang Berpikir..."}</p>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1.5 w-32 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 transition-all duration-500" 
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase">{currentStep} / {totalSteps}</span>
            </div>
            <p className="text-xs font-bold text-slate-400 max-w-sm leading-relaxed">
              Harap bersabar, kami sedang menciptakan 5 mahakarya visual dan narasi teks yang selaras.
            </p>
          </div>
        )}

        {!isLoading && generatedStoryParts.length === 0 && (
          <div className="glass-card p-16 text-center border-dashed border-2 border-white/5">
            <div className="h-16 w-16 rounded-full bg-slate-500/5 flex items-center justify-center text-slate-400 mx-auto mb-6">
              <Info size={32} />
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Ruang Kosong Menanti Cerita Anda</p>
          </div>
        )}

        {generatedStoryParts.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="flex flex-col items-center mb-12">
              <div className="h-px w-24 bg-primary-500/30 mb-8" />
              <h3 className="text-3xl sm:text-5xl font-black text-center text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl px-4">
                {storyTitle || 'Cerita Visual AI'}
              </h3>
              <div className="h-px w-24 bg-primary-500/30 mt-8" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {generatedStoryParts.map((part, index) => (
                <div key={index} className="glass-card group overflow-hidden flex flex-col h-full border-white/5">
                  <div className="relative h-[400px] w-full overflow-hidden">
                    <img
                      src={part.imageUrl}
                      alt={`Adegan ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent opacity-80" />
                    
                    <div className="absolute top-6 left-6 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-primary-500/80 backdrop-blur-md flex items-center justify-center text-white text-lg font-black shadow-lg">
                        {index + 1}
                      </div>
                      <span className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white">
                        Adegan
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleOpenImageModal(part.imageUrl)}
                      className="absolute bottom-6 right-6 h-12 w-12 glass-button rounded-2xl flex items-center justify-center text-white hover:bg-primary-500 transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0"
                    >
                      <ZoomIn size={20} />
                    </button>
                  </div>
                  
                  <div className="p-8 sm:p-10 flex flex-col flex-1">
                    <div className="mb-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 mb-3">Prompt Visual</p>
                      <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
                        "{part.imagePrompt}"
                      </p>
                    </div>
                    
                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Narasi</p>
                          <button
                            onClick={() => handleCopyDescription(part.description)}
                            className="h-8 w-8 flex items-center justify-center glass-button rounded-xl text-slate-400 transition-colors"
                            title="Salin Narasi"
                          >
                            <Copy size={14} />
                          </button>
                      </div>
                      <div className="glass-inset p-6 text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                        {part.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20 flex justify-center">
              <button
                onClick={handleDownloadStory}
                className="group h-16 px-12 glass-button rounded-2xl text-sm font-black uppercase tracking-[0.2em] text-primary-500 flex items-center gap-4 hover:bg-primary-500 hover:text-white transition-all shadow-xl hover:shadow-primary-500/20"
              >
                <Download size={20} className="transition-transform group-hover:translate-y-1" /> 
                Simpan Seluruh Cerita
              </button>
            </div>
          </div>
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