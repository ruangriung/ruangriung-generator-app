// components/ControlPanel.tsx
'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useSession } from 'next-auth/react';
import AdvancedSettings from './AdvancedSettings';
import ButtonSpinner from './ButtonSpinner';
import { Sparkles, X, Expand, Shuffle, Save, Wand2, Cpu, ArrowLeftRight, ArrowUpDown, Sprout, Settings, Image as ImageIcon, ChevronDown, Languages, Megaphone, Braces, FlaskConical } from 'lucide-react';
import TextareaModal from './TextareaModal';
import Accordion from './Accordion';
import PromptAssistant from './PromptAssistant';
import TranslationAssistant from './TranslationAssistant';
import ImageAnalysisAssistant from './ImageAnalysisAssistant';
import LockedAccordion from './LockedAccordion';
import toast from 'react-hot-toast';
import { artStyles, ArtStyleCategory, ArtStyleOption } from '@/lib/artStyles';


export interface GeneratorSettings {
  prompt: string;
  negativePrompt: string;
  model: string;
  cfg_scale: number;
  width: number;
  height: number;
  seed: number;
  artStyle: string;
  batchSize: number;
  imageQuality: 'Standar' | 'HD' | 'Ultra';
  private: boolean;
  safe: boolean;
  transparent: boolean;
  inputImage: string;
}

interface ControlPanelProps {
  settings: GeneratorSettings;
  setSettings: Dispatch<SetStateAction<GeneratorSettings>>;
  onGenerate: () => void;
  isLoading: boolean;
  models: string[];
  aspectRatio: 'Kotak' | 'Portrait' | 'Lansekap' | 'Custom';
  onAspectRatioChange: (preset: 'Kotak' | 'Portrait' | 'Lansekap') => void;
  onManualDimensionChange: (width: number, height: number) => void;
  onImageQualityChange: (quality: 'Standar' | 'HD' | 'Ultra') => void;
  onModelSelect: (model: string) => void;
  onSurpriseMe: () => void;
}

export default function ControlPanel({ settings, setSettings, onGenerate, isLoading, models, aspectRatio, onAspectRatioChange, onManualDimensionChange, onImageQualityChange, onModelSelect, onSurpriseMe }: ControlPanelProps) {
  const { status } = useSession();
  const [editingField, setEditingField] = useState<null | 'prompt' | 'negativePrompt'>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);
  const [isGeneratingJson, setIsGeneratingJson] = useState(false);

  useEffect(() => {
    try {
      const storedPrompts = localStorage.getItem('ruangriung_saved_prompts');
      if (storedPrompts) {
        setSavedPrompts(JSON.parse(storedPrompts));
      }
    } catch (error) {
      console.error("Gagal memuat prompt tersimpan:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ruangriung_saved_prompts', JSON.stringify(savedPrompts));
    } catch (error) {
      console.error("Gagal menyimpan prompt:", error);
    }
  }, [savedPrompts]);

  const handleClearPrompt = () => {
    setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: '' }));
  };

  const handleClearNegativePrompt = () => {
    setSettings((prev: GeneratorSettings) => ({ ...prev, negativePrompt: '' }));
  };

  const callPromptApi = async (promptForApi: string, temperature = 0.5) => {
    const urlWithToken = `https://text.pollinations.ai/openai?token=${process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN}`;

    try {
      const response = await fetch(urlWithToken, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai',
          messages: [{ role: 'user', content: promptForApi }],
          temperature: temperature,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API merespons dengan status ${response.status}. Isi: ${errorBody}`);
      }

      const result = await response.json();
      const aiContent = result?.choices?.[0]?.message?.content ?? '';
      const trimmedContent = aiContent.trim();

      let cleanedContent = trimmedContent;
      if (trimmedContent.length >= 2) {
        const firstChar = trimmedContent[0];
        const lastChar = trimmedContent[trimmedContent.length - 1];
        if ((firstChar === '"' || firstChar === '\'') && lastChar === firstChar) {
          cleanedContent = trimmedContent.slice(1, -1).trim();
        }
      }

      return cleanedContent || trimmedContent;
    } catch (error: any) {
      console.error("Gagal memanggil API prompt:", error);
      toast.error(`Terjadi kesalahan saat berkomunikasi dengan AI: ${error.message}`);
      throw error;
    }
  };

  const mergePromptWithEnhancement = (originalPrompt: string, enhancedPrompt: string) => {
    const trimmedOriginal = originalPrompt.trim();
    const trimmedEnhanced = enhancedPrompt.trim();

    if (!trimmedOriginal) {
      return trimmedEnhanced;
    }

    if (!trimmedEnhanced) {
      return trimmedOriginal;
    }

    const normalizedOriginal = trimmedOriginal.toLowerCase();
    const normalizedEnhanced = trimmedEnhanced.toLowerCase();

    if (normalizedEnhanced.includes(normalizedOriginal)) {
      return trimmedEnhanced;
    }

    if (normalizedOriginal.includes(normalizedEnhanced)) {
      return trimmedOriginal;
    }

    return `${trimmedOriginal}\n\n${trimmedEnhanced}`;
  };

  const handleRandomPrompt = async () => {
    setIsRandomizing(true);

    const randomThemes = [
        'science fiction', 'spiderman', 'sports', 'surreal', 'vintage', 'wild nature', 'fantasy', 'photography', 'caricature', 'digital art', 'steampunk', 'cyberpunk', 'retro-futuristic', 'abstract', 'minimalist', 'cosmic horror', 'fairy tale', 'dystopian', 'utopian', 'mythology', 'ancient', 'modern', 'post-apocalyptic', 'galaxy war', 'classical painting', 'pop art', 'street art', 'traditional art', 'contemporary art', 'conceptual art', 'installation art', 'sculpture', 'textile art', 'ceramic art', 'graphic art', 'collage art', 'mixed media', '3D art', 'VR art', 'AR art', 'AI art', 'generative art', 'participatory art', 'art', 'graffiti', 'mural art', 'wall painting', 'fine art', 'modern sculpture', 'classical sculpture', 'abstract sculpture', 'figurative sculpture', 'installation sculpture', 'kinetic sculpture', 'interactive sculpture', 'digital sculpture'
    ];

    const selectedTheme = randomThemes[Math.floor(Math.random() * randomThemes.length)];

    const randomPromptInstruction = `
        You are a conceptual artist who provides unexpected ideas.
        Give me ONE truly random image prompt idea, with a touch of the "${selectedTheme}" theme.
        Combine two or more unusual concepts.
        Make it visually descriptive, concise, and DO NOT use quotation marks in your response.
    `;

    const randomPromptPromise = callPromptApi(randomPromptInstruction, 0.10).then((newPrompt) => {
      setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: newPrompt }));
      return newPrompt;
    });

    toast.promise(
      randomPromptPromise,
      {
        loading: 'Finding a random prompt idea...',
        success: 'Random prompt created successfully!',
        error: 'Failed to create a random prompt.',
      }
    );

    randomPromptPromise.finally(() => setIsRandomizing(false));
  };

  const handleEnhancePrompt = async () => {
    if (!settings.prompt) {
      toast.error("Write a prompt first to enhance it!");
      return;
    }
    setIsEnhancing(true);
    const originalPrompt = settings.prompt;

    const enhancePromise = callPromptApi(
      `Enhance and add more visual details to the following image prompt, but keep it concise: "${settings.prompt}". Do not use or remove quotation marks in your response.`
    ).then((enhancedPrompt) => {
      const mergedPrompt = mergePromptWithEnhancement(originalPrompt, enhancedPrompt);
      setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: mergedPrompt }));
      return mergedPrompt;
    });

    toast.promise(
      enhancePromise,
      {
        loading: 'Enhancing prompt...',
        success: 'Prompt enhanced successfully!',
        error: 'Failed to enhance prompt.',
      }
    );

    enhancePromise
      .catch(() => {
        setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: originalPrompt }));
      })
      .finally(() => setIsEnhancing(false));
  };

  const handleSavePrompt = () => {
    if (!settings.prompt) {
      toast.error("Tidak ada prompt untuk disimpan!");
      return;
    }
    setIsSaving(true);
    try {
      setSavedPrompts((prev: string[]) => {
        const updatedPrompts = new Set([settings.prompt, ...prev]);
        return Array.from(updatedPrompts).slice(0, 50);
      });
      toast.success("Prompt berhasil disimpan!");
    } catch (error) {
      toast.error("Gagal menyimpan prompt.");
      console.error("Error saving prompt:", error);
    } finally {
      setTimeout(() => setIsSaving(false), 1500);
    }
  };

  const handleSelectSavedPrompt = (prompt: string) => {
    setSettings((prev: GeneratorSettings) => ({ ...prev, prompt }));
    toast.success("Prompt dimuat dari riwayat!");
  };

  const handleDeleteSavedPrompt = (promptToDelete: string) => {
    if (window.confirm("Yakin ingin menghapus prompt ini?")) {
      setSavedPrompts((prev: string[]) => prev.filter(p => p !== promptToDelete));
      toast.success("Prompt berhasil dihapus!");
    }
  };

  const handleClearAllSavedPrompts = () => {
    if (window.confirm("Yakin ingin menghapus semua prompt yang disimpan?")) {
      setSavedPrompts([]);
      toast.success("Semua prompt tersimpan berhasil dihapus!");
    }
  };

  const addNegativePreset = (preset: 'kualitas' | 'anatomi' | 'teks' | 'cacat') => {
    const presetMap = {
      kualitas: ['low quality', 'blurry', 'jpeg artifacts', 'worst quality', 'lowres'],
      anatomi: ['deformed', 'disfigured', 'bad anatomy', 'extra limbs', 'missing fingers', 'bad hands', 'malformed limbs'],
      teks: ['text', 'watermark', 'signature', 'username', 'logo', 'UI', 'user interface'],
      cacat: ['duplicate', 'cloned face', 'cropped', 'out of frame', 'tiling', 'grid', 'mutilated']
    };

    const presetsToAdd = presetMap[preset];

    setSettings(prev => {
      const currentNegatives = prev.negativePrompt
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const newNegatives = new Set([...currentNegatives, ...presetsToAdd]);

      return {
        ...prev,
        negativePrompt: Array.from(newNegatives).join(', ')
      };
    });
    toast.success(`Preset negatif "${preset}" ditambahkan!`);
  };

  const handleGenerateJsonPrompt = async () => {
    if (!settings.prompt) {
      toast.error("Tulis prompt utama terlebih dahulu untuk menghasilkan JSON!");
      return;
    }
    setIsGeneratingJson(true);
    const jsonInstruction = `
      Based on the following prompt: "${settings.prompt}", generate a concise JSON object.
      The JSON should describe key elements, themes, or attributes extracted from the prompt, suitable for data processing or further analysis.
      For example, if the prompt is "A serene forest with magical creatures under a starry night", the JSON could be:
      {"setting": "serene forest", "elements": ["magical creatures", "starry night"], "mood": "fantasy"}
      Please ensure the output is valid JSON and nothing else.
    `;
    const jsonPromptPromise = callPromptApi(jsonInstruction, 0.2).then((newPrompt) => {
      setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: newPrompt }));
      return newPrompt;
    });

    toast.promise(
      jsonPromptPromise,
      {
        loading: 'Generating JSON from prompt...',
        success: 'JSON generated successfully!',
        error: 'Failed to generate JSON.',
      }
    );

    jsonPromptPromise.finally(() => setIsGeneratingJson(false));
  };


  const featureButtonStyle = "flex-1 inline-flex items-center justify-center gap-x-2 px-3 py-2 bg-light-bg dark:bg-dark-bg text-gray-600 dark:text-gray-300 font-semibold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <>
      <div className="w-full p-6 md:p-8 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">

        {status === 'authenticated' ? (
          <details className="w-full group mb-6">
            <summary className="flex items-center justify-between p-4 bg-light-bg dark:bg-dark-bg rounded-lg cursor-pointer list-none shadow-neumorphic-button dark:shadow-dark-neumorphic-button transition-shadow">
              <div className="flex items-center gap-x-2">
                <Settings className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Pengaturan Lanjutan
                </span>
              </div>
              <ChevronDown className="w-5 h-5 text-purple-600 transition-transform duration-300 group-open:rotate-90" />
            </summary>
            <AdvancedSettings
              settings={settings}
              setSettings={setSettings}
              models={models}
              aspectRatio={aspectRatio}
              onAspectRatioChange={onAspectRatioChange}
              onManualDimensionChange={onManualDimensionChange}
              onImageQualityChange={onImageQualityChange}
              onModelSelect={onModelSelect}
              className="mt-0 pt-0"
            />
          </details>
        ) : (
          <LockedAccordion
            title="Pengaturan Lanjutan"
            className="mb-6"
          />
        )}


        {/* Textarea Prompt Utama */}
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Describe your imagination</label>
          <div className="relative w-full">
            <textarea
              id="prompt"
              className="w-full p-3 pr-20 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 resize-y h-[150px] text-gray-800 dark:text-gray-200"
              value={settings.prompt}
              onChange={(e) => setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: e.target.value }))}
              placeholder="Ketikkan imajinasimu atau gunakan tombol bantuan di bawah..."
            />
            <div className="absolute top-2 right-2 flex gap-x-1">
              {settings.prompt && (
                <button onClick={handleClearPrompt} className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Hapus">
                  <X size={18} />
                </button>
              )}
              <button onClick={() => setEditingField('prompt')} className="p-1.5 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Perbesar">
                <Expand size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Textarea Negative Prompt */}
        <div>
          <label htmlFor="negative-prompt" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Negative Prompt (Hal yang ingin dihindari)</label>
          <div className="relative w-full">
            <textarea
              id="negative-prompt"
              className="w-full p-3 pr-20 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 resize-y h-[150px] text-gray-800 dark:text-gray-200"
              value={settings.negativePrompt}
              onChange={(e) => setSettings((prev: GeneratorSettings) => ({ ...prev, negativePrompt: e.target.value }))}
              placeholder="Contoh: blurry, ugly, deformed hands, watermark..."
            />
            <div className="absolute top-2 right-2 flex gap-x-1">
              {settings.negativePrompt && (
                <button onClick={handleClearNegativePrompt} className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Hapus">
                  <X size={18} />
                </button>
              )}
              <button onClick={() => setEditingField('negativePrompt')} className="p-1.5 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Perbesar">
                <Expand size={18} />
              </button>
            </div>
          </div>
          {/* Tombol Preset Negative Prompt */}
          <div className="flex flex-wrap gap-2 mt-2">
            <button onClick={() => addNegativePreset('kualitas')} className="text-xs px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              + Kualitas Buruk
            </button>
            <button onClick={() => addNegativePreset('anatomi')} className="text-xs px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              + Anatomi Buruk
            </button>
            <button onClick={() => addNegativePreset('teks')} className="text-xs px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              + Teks/UI
            </button>
            <button onClick={() => addNegativePreset('cacat')} className="text-xs px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              + Cacat/Duplikat
            </button>
          </div>
        </div>

        {/* Tombol Generate dan Aksi Prompt lainnya */}
        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600 flex flex-col justify-center items-center gap-3">
          <button
            onClick={onGenerate}
            className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner dark:active:shadow-dark-neumorphic-button-active disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-150 w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ButtonSpinner />
                <span>Mohon Tunggu...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                <span>Buat {settings.batchSize > 1 ? `${settings.batchSize} Gambar` : 'Gambar'}</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-3 w-full mt-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <button onClick={handleRandomPrompt} className={featureButtonStyle} disabled={isRandomizing || isEnhancing || isGeneratingJson}>
                {isRandomizing ? <ButtonSpinner /> : <Shuffle size={16} />} <span>Acak Prompt</span>
            </button>
            <button onClick={onSurpriseMe} className={featureButtonStyle} disabled={isLoading || isRandomizing || isEnhancing || isGeneratingJson}>
                <FlaskConical size={16} /> <span>Surprise Me!</span>
            </button>
            <button onClick={handleEnhancePrompt} className={featureButtonStyle} disabled={isRandomizing || isEnhancing || isGeneratingJson || !settings.prompt}>
                {isEnhancing ? <ButtonSpinner /> : <Wand2 size={16} />} <span>Sempurnakan</span>
            </button>
            <button onClick={handleGenerateJsonPrompt} className={featureButtonStyle} disabled={isRandomizing || isEnhancing || isGeneratingJson || !settings.prompt}>
                {isGeneratingJson ? <ButtonSpinner /> : <Braces size={16} />} <span>JSON</span>
            </button>
            {/* PERUBAHAN DI SINI: Menambahkan kelas col-span-2 sm:col-span-1 */}
            <button
              onClick={handleSavePrompt}
              className={`${featureButtonStyle} ${isSaving ? '!text-green-500' : ''} col-span-2 sm:col-span-1`}
              disabled={isSaving || !settings.prompt}
            >
                <Save size={16} /> <span>{isSaving ? 'Tersimpan!' : 'Simpan'}</span>
            </button>
          </div>
        </div>

        {/* Asisten-asisten Prompt */}
        {status === 'authenticated' ? (
          <PromptAssistant
            onUsePrompt={(newPrompt) => setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: newPrompt }))}
          />
        ) : (
          <LockedAccordion
            title={<div className="flex items-center gap-2"><Megaphone className="text-purple-600" />Asisten Prompt</div>}
            className="mt-6"
          />
        )}

        <TranslationAssistant
          onUsePrompt={(newPrompt) => setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: newPrompt }))}
        />

        {status === 'authenticated' ? (
          <ImageAnalysisAssistant
            onUsePrompt={(newPrompt) => setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: newPrompt }))}
          />
        ) : (
          <LockedAccordion
            title={<div className="flex items-center gap-2"><ImageIcon className="text-purple-600" />Asisten Analisis Gambar</div>}
            className="mt-6"
          />
        )}

        {savedPrompts.length > 0 && (
            <Accordion
                title={<div className="flex items-center gap-2"><Save size={16} className="text-purple-600" />Prompt Tersimpan ({savedPrompts.length})</div>}
                className="mt-4"
            >
                <div className="flex justify-end mb-4">
                    <button onClick={handleClearAllSavedPrompts} className="text-sm text-red-500 hover:underline">
                        Hapus Semua
                    </button>
                </div>
                <ul className="space-y-3">
                    {savedPrompts.map((prompt, index) => (
                        <li key={index} className="flex justify-between items-center bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md dark:shadow-dark-neumorphic cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                            <span onClick={() => handleSelectSavedPrompt(prompt)} className="flex-grow text-sm text-gray-700 dark:text-gray-200 truncate mr-4">
                                {prompt}
                            </span>
                            <button onClick={() => handleDeleteSavedPrompt(prompt)} className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Hapus">
                                <X size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            </Accordion>
        )}
      </div>
      <TextareaModal
        isOpen={editingField !== null}
        onClose={() => setEditingField(null)}
        value={editingField === 'prompt' ? settings.prompt : settings.negativePrompt || ''}
        onChange={(newValue) => {
          if (editingField === 'prompt') {
            setSettings((prev) => ({ ...prev, prompt: newValue }));
          } else if (editingField === 'negativePrompt') {
            setSettings((prev) => ({ ...prev, negativePrompt: newValue }));
          }
        }}
        title={editingField === 'prompt' ? 'Edit Prompt Utama' : 'Edit Negative Prompt'}
      />
    </>
  );
}