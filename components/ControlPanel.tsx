'use client';

import { useState } from 'react';
import AdvancedSettings from './AdvancedSettings';
import ButtonSpinner from './ButtonSpinner';
import { Sparkles, X, Expand, Shuffle, Save, Wand2 } from 'lucide-react';
import TextareaModal from './TextareaModal';

export interface GeneratorSettings {
  prompt: string;
  model: string;
  width: number;
  height: number;
  seed: number;
  artStyle: string;
  batchSize: number;
}

interface ControlPanelProps {
  settings: GeneratorSettings;
  setSettings: React.Dispatch<React.SetStateAction<GeneratorSettings>>;
  onGenerate: () => void;
  isLoading: boolean;
  models: string[];
  aspectRatio: string;
  onAspectRatioChange: (preset: 'Kotak' | 'Portrait' | 'Lansekap') => void;
}

export default function ControlPanel({ settings, setSettings, onGenerate, isLoading, models, aspectRatio, onAspectRatioChange }: ControlPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  const handleClearPrompt = () => {
    setSettings(prev => ({ ...prev, prompt: '' }));
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
          // --- PERBAIKAN UTAMA DI SINI ---
          // Mengganti model yang salah dengan model yang benar sesuai dokumentasi
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
      setSettings(prev => ({ ...prev, prompt: newPrompt }));
    } catch (error: any) {
      console.error("Gagal memanggil API prompt:", error);
      alert(`Terjadi kesalahan saat berkomunikasi dengan AI: ${error.message}`);
    }
  };

  const handleRandomPrompt = async () => {
    setIsRandomizing(true);
    await callPromptApi("Give me a single, random, creative, and visually descriptive image prompt. Be concise and do not use quotation marks.");
    setIsRandomizing(false);
  };

  const handleEnhancePrompt = async () => {
    if (!settings.prompt) {
      alert("Tuliskan prompt terlebih dahulu untuk disempurnakan!");
      return;
    }
    setIsEnhancing(true);
    await callPromptApi(`Enhance and add more visual details to the following image prompt, but keep it concise: "${settings.prompt}". Do not use quotation marks in your response.`);
    setIsEnhancing(false);
  };
  
  const handleSavePrompt = () => {
    if (!settings.prompt) {
      alert("Tidak ada prompt untuk disimpan!");
      return;
    }
    setIsSaving(true);
    try {
      const savedPrompts = JSON.parse(localStorage.getItem('ruangriung_saved_prompts') || '[]');
      if (!savedPrompts.includes(settings.prompt)) {
        const newSavedPrompts = [settings.prompt, ...savedPrompts].slice(0, 50);
        localStorage.setItem('ruangriung_saved_prompts', JSON.stringify(newSavedPrompts));
      }
    } catch (error) {
      alert("Gagal menyimpan prompt.");
    } finally {
      setTimeout(() => setIsSaving(false), 1500);
    }
  };
  
  const featureButtonStyle = "flex-1 inline-flex items-center justify-center gap-x-2 px-3 py-2 bg-light-bg text-gray-600 font-semibold rounded-lg shadow-neumorphic-button active:shadow-neumorphic-inset transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <>
      <div className="w-full p-6 md:p-8 bg-light-bg rounded-2xl shadow-neumorphic">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-600 mb-2">Describe your imagination</label>
          <div className="relative w-full">
            <textarea
              id="prompt"
              value={settings.prompt}
              onChange={(e) => setSettings(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="Ketikkan imajinasimu atau gunakan tombol bantuan di bawah..."
              className="w-full p-3 pr-20 bg-light-bg rounded-lg shadow-neumorphic-inset border-0 h-24 resize-none"
            />
            <div className="absolute top-2 right-2 flex gap-x-1">
              {settings.prompt && (
                <button onClick={handleClearPrompt} className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200 transition-colors" title="Hapus Prompt">
                  <X size={18} />
                </button>
              )}
              <button onClick={() => setIsModalOpen(true)} className="p-1.5 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-200 transition-colors" title="Perbesar Textarea">
                <Expand size={18} />
              </button>
            </div>
          </div>
        </div>

        <AdvancedSettings
          settings={settings}
          setSettings={setSettings}
          models={models}
          aspectRatio={aspectRatio}
          onAspectRatioChange={onAspectRatioChange}
        />

        <div className="mt-4 pt-4 border-t border-gray-300 flex flex-col sm:flex-row items-center gap-3">
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


        <div className="mt-8 text-center">
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-150"
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
        </div>
      </div>
      <TextareaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        value={settings.prompt}
        onChange={(newPrompt) => setSettings(prev => ({ ...prev, prompt: newPrompt }))}
        title="Edit Prompt Utama"
      />
    </>
  );
}