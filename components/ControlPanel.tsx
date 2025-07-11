'use client';

import { useState } from 'react';
import AdvancedSettings from './AdvancedSettings';
import ButtonSpinner from './ButtonSpinner';
import { Sparkles, X, Expand } from 'lucide-react';
import TextareaModal from './TextareaModal';

// Definisikan tipe data di sini dan ekspor
export interface GeneratorSettings {
  prompt: string;
  model: string;
  width: number;
  height: number;
  seed: number;
  artStyle: string;
}

// Definisikan props untuk komponen ini
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

  const handleClearPrompt = () => {
    setSettings(prev => ({ ...prev, prompt: '' }));
  };

  return (
    <>
      <div className="w-full p-6 md:p-8 bg-light-bg rounded-2xl shadow-neumorphic">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-600 mb-2">Describe your imagination</label>
          <div className="relative w-full">
            <textarea 
              id="prompt" 
              value={settings.prompt}
              readOnly
              onFocus={() => setIsModalOpen(true)}
              placeholder="Klik untuk mulai menulis atau mengedit prompt..."
              className="w-full p-3 pr-20 bg-light-bg rounded-lg shadow-neumorphic-inset border-0 h-24 cursor-pointer resize-none"
            />
            <div className="absolute top-2 right-2 flex gap-x-1">
              {settings.prompt && (
                <button onClick={(e) => { e.stopPropagation(); handleClearPrompt(); }} className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200 transition-colors" title="Hapus Prompt">
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
                <span>Buat Gambar</span>
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