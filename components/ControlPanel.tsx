// components/ControlPanel.tsx
'use client';

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import AdvancedSettings from './AdvancedSettings';
import ButtonSpinner from './ButtonSpinner';
import { Sparkles, X, Expand, Shuffle, Save, Wand2, Cpu, ArrowLeftRight, ArrowUpDown, Sprout, Settings, Image as ImageIcon } from 'lucide-react';
import TextareaModal from './TextareaModal';
import Accordion from './Accordion';
import PromptAssistant from './PromptAssistant';
import TranslationAssistant from './TranslationAssistant';
import ImageAnalysisAssistant from './ImageAnalysisAssistant';
import toast from 'react-hot-toast';
import { artStyles, ArtStyleCategory, ArtStyleOption } from '@/lib/artStyles';


export interface GeneratorSettings {
  prompt: string;
  model: string;
  width: number;
  height: number;
  seed: number;
  artStyle: string;
  batchSize: number;
  imageQuality: 'Standar' | 'HD' | 'Ultra';
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
}

export default function ControlPanel({ settings, setSettings, onGenerate, isLoading, models, aspectRatio, onAspectRatioChange, onManualDimensionChange, onImageQualityChange }: ControlPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);

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

  const callPromptApi = async (promptForApi: string) => {
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
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API merespons dengan status ${response.status}. Isi: ${errorBody}`);
      }

      const result = await response.json();
      const newPrompt = result.choices[0].message.content.replace(/"/g, '');
      setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: newPrompt }));
      return newPrompt;
    } catch (error: any) {
      console.error("Gagal memanggil API prompt:", error);
      toast.error(`Terjadi kesalahan saat berkomunikasi dengan AI: ${error.message}`);
      setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: "Gagal menghasilkan prompt. Silakan coba lagi." }));
      throw error;
    }
  };

  const handleRandomPrompt = async () => {
    setIsRandomizing(true);
    toast.promise(
      callPromptApi("Berikan saya satu prompt gambar yang acak, kreatif, dan deskriptif secara visual. Jadilah ringkas dan jangan gunakan tanda kutip."),
      {
        loading: 'Mencari ide prompt acak...',
        success: 'Prompt acak berhasil dibuat!',
        error: 'Gagal membuat prompt acak.',
      }
    ).finally(() => setIsRandomizing(false));
  };

  const handleEnhancePrompt = async () => {
    if (!settings.prompt) {
      toast.error("Tuliskan prompt terlebih dahulu untuk disempurnakan!");
      return;
    }
    setIsEnhancing(true);
    toast.promise(
      callPromptApi(`Sempurnakan dan tambahkan lebih banyak detail visual ke prompt gambar berikut, tetapi tetap ringkas: "${settings.prompt}". Jangan gunakan tanda kutip dalam respons Anda.`),
      {
        loading: 'Menyempurnakan prompt...',
        success: 'Prompt berhasil disempurnakan!',
        error: 'Gagal menyempurnakan prompt.',
      }
    ).finally(() => setIsEnhancing(false));
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
  
  const featureButtonStyle = "flex-1 inline-flex items-center justify-center gap-x-2 px-3 py-2 bg-light-bg dark:bg-dark-bg text-gray-600 dark:text-gray-300 font-semibold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  const inputStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-gray-800 dark:text-gray-200";
  const selectStyle = `${inputStyle} appearance-none`;

  const LabelWithIcon = ({ icon: Icon, text, htmlFor }: { icon: React.ElementType, text: string, htmlFor: string }) => (
    <div className="flex items-center gap-x-2 mb-2">
      <Icon className="h-4 w-4 text-purple-600" />
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-600 dark:text-gray-300">
        {text}
      </label>
    </div>
  );

  return (
    <>
      <div className="w-full p-6 md:p-8 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
        
        {/* Pengaturan Lanjutan dipindahkan ke atas */}
        <AdvancedSettings
          settings={settings}
          setSettings={setSettings}
          models={models}
          aspectRatio={aspectRatio}
          onAspectRatioChange={onAspectRatioChange}
          onManualDimensionChange={onManualDimensionChange}
          onImageQualityChange={onImageQualityChange}
          className="mb-6" // Tambahkan margin-bottom untuk jarak dengan elemen di bawahnya
        />

        {/* Textarea Prompt Utama */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Describe your imagination</label>
          <div className="relative w-full">
            <textarea
              id="prompt"
              className="w-full p-3 pr-20 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 h-24 resize-none text-gray-800 dark:text-gray-200"
              value={settings.prompt}
              onChange={(e) => setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: e.target.value }))}
              placeholder="Ketikkan imajinasimu atau gunakan tombol bantuan di bawah..."
            />
            <div className="absolute top-2 right-2 flex gap-x-1">
              {settings.prompt && (
                <button onClick={handleClearPrompt} className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Hapus Prompt">
                  <X size={18} />
                </button>
              )}
              <button onClick={() => setIsModalOpen(true)} className="p-1.5 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Perbesar Textarea">
                <Expand size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Tombol Generate dan Aksi Prompt lainnya (dipindahkan ke sini) */}
        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600 flex flex-col justify-center items-center gap-3">
          <button
            onClick={onGenerate}
            className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner dark:active:shadow-dark-neumorphic-button-active disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-150 w-full" // w-full untuk tombol generate
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
          {/* Tombol aksi lainnya diatur dalam baris terpisah atau grup */}
          <div className="flex flex-row flex-wrap justify-center items-center gap-3 w-full mt-3"> {/* Tambahkan w-full ke wrapper tombol */}
            <button onClick={handleRandomPrompt} className={featureButtonStyle} disabled={isRandomizing || isEnhancing}>
                {isRandomizing ? <ButtonSpinner /> : <Shuffle size={16} />} <span>Acak</span>
            </button>
            <button onClick={handleEnhancePrompt} className={featureButtonStyle} disabled={isRandomizing || isEnhancing || !settings.prompt}>
                {isEnhancing ? <ButtonSpinner /> : <Wand2 size={16} />} <span>Sempurnakan</span>
            </button>
            <button onClick={handleSavePrompt} className={`${featureButtonStyle} ${isSaving ? '!text-green-500' : ''}`} disabled={isSaving || !settings.prompt}>
                <Save size={16} /> <span>{isSaving ? 'Tersimpan!' : 'Simpan'}</span>
            </button>
          </div>
        </div>

        {/* Asisten-asisten Prompt dipindahkan ke bawah */}
        <PromptAssistant 
          onUsePrompt={(newPrompt) => setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: newPrompt }))} 
        />
        
        <TranslationAssistant
          onUsePrompt={(newPrompt) => setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: newPrompt }))}
        />

        <ImageAnalysisAssistant
          onUsePrompt={(newPrompt) => setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: newPrompt }))}
        />

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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        value={settings.prompt}
        onChange={(newPrompt) => setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: newPrompt }))}
        title="Edit Prompt Utama"
      />
    </>
  );
}