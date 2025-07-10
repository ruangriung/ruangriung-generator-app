'use client';

import AdvancedSettings from './AdvancedSettings';
import ButtonSpinner from './ButtonSpinner';
import { Sparkles } from 'lucide-react';

// Definisikan tipe data untuk pengaturan, untuk diekspor dan digunakan di komponen lain
export interface GeneratorSettings {
  prompt: string;
  model: string;
  width: number;
  height: number;
  seed: number;
  artStyle: string;
}

// Definisikan tipe data untuk props yang diterima oleh komponen ini
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
  
  return (
    <div className="w-full p-6 md:p-8 bg-light-bg rounded-2xl shadow-neumorphic">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-600 mb-2">Prompt Utama</label>
        <textarea 
          id="prompt" 
          rows={4} 
          value={settings.prompt} 
          onChange={(e) => setSettings(prev => ({...prev, prompt: e.target.value}))} 
          placeholder="Contoh: seekor rubah di hutan bersalju" 
          className="w-full p-3 bg-light-bg rounded-lg shadow-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        />
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
              <span>Membuat...</span>
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
  );
}