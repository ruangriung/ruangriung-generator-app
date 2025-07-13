// components/AdvancedSettings.tsx
'use client';

import { GeneratorSettings } from './ControlPanel';
import { Palette, Cpu, ArrowLeftRight, ArrowUpDown, Sprout, Settings, Image as ImageIcon, Sparkles, ChevronDown } from 'lucide-react';
import { artStyles, ArtStyleCategory, ArtStyleOption } from '@/lib/artStyles';

interface AdvancedSettingsProps {
  settings: GeneratorSettings;
  setSettings: React.Dispatch<React.SetStateAction<GeneratorSettings>>;
  models: string[];
  aspectRatio: 'Kotak' | 'Portrait' | 'Lansekap' | 'Custom';
  onAspectRatioChange: (preset: 'Kotak' | 'Portrait' | 'Lansekap') => void;
  onManualDimensionChange: (width: number, height: number) => void;
  onImageQualityChange: (quality: 'Standar' | 'HD' | 'Ultra') => void;
  className?: string;
}

export default function AdvancedSettings({ settings, setSettings, models, aspectRatio, onAspectRatioChange, onManualDimensionChange, onImageQualityChange, className }: AdvancedSettingsProps) {
  const handleSettingChange = (field: keyof GeneratorSettings, value: string | number) => {
    if (field === 'width' || field === 'height' || field === 'batchSize' || field === 'seed') {
      const parsedValue = parseInt(value as string, 10);
      const numValue = isNaN(parsedValue) ? 0 : parsedValue;

      if (field === 'width' || field === 'height') {
        onManualDimensionChange(
          field === 'width' ? numValue : settings.width,
          field === 'height' ? numValue : settings.height
        );
      } else {
        setSettings(prev => ({ ...prev, [field]: numValue }));
      }
    } else {
      setSettings(prev => ({ ...prev, [field]: value }));
    }
  };

  const inputStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-gray-800 dark:text-gray-200";
  const selectStyle = `${inputStyle} appearance-none`;
  
  const presetButtonStyle = (presetName: 'Kotak' | 'Portrait' | 'Lansekap') => 
    `px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
      aspectRatio === presetName 
        ? 'bg-purple-600 text-white shadow-neumorphic-button dark:shadow-dark-neumorphic-button'
        : 'bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 shadow-neumorphic-button dark:shadow-dark-neumorphic-button'
    }`;
  
  const LabelWithIcon = ({ icon: Icon, text, htmlFor }: { icon: React.ElementType, text: string, htmlFor: string }) => (
    <div className="flex items-center gap-x-2 mb-2">
      <Icon className="h-4 w-4 text-purple-600" />
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-600 dark:text-gray-300">
        {text}
      </label>
    </div>
  );

  return (
    // Root element diubah menjadi div, elemen <details> dan <summary> dipindahkan ke ControlPanel.tsx
    <div className={`mt-6 p-6 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset ${className || ''}`}>
        <div className="mb-6">
          <label className="block text-center text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Preset Aspek Rasio</label>
          <div className="flex justify-center gap-4">
            <button onClick={() => onAspectRatioChange('Kotak')} className={presetButtonStyle('Kotak')}>Kotak</button>
            <button onClick={() => onAspectRatioChange('Portrait')} className={presetButtonStyle('Portrait')}>Portrait</button>
            <button onClick={() => onAspectRatioChange('Lansekap')} className={presetButtonStyle('Lansekap')}>Lansekap</button>
          </div>
        </div>
        <hr className="my-6 border-gray-300 dark:border-gray-600" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <div>
            <LabelWithIcon icon={ArrowLeftRight} text="Lebar" htmlFor="width" />
            <input type="number" id="width" value={settings.width} onChange={(e) => handleSettingChange('width', e.target.value)} className={inputStyle} />
          </div>
          <div>
            <LabelWithIcon icon={ArrowUpDown} text="Tinggi" htmlFor="height" />
            <input type="number" id="height" value={settings.height} onChange={(e) => handleSettingChange('height', e.target.value)} className={inputStyle} />
          </div>
          
          <div>
            <LabelWithIcon icon={Sparkles} text="Kualitas Gambar" htmlFor="imageQuality" />
            <div className="relative">
              <select
                id="imageQuality"
                value={settings.imageQuality}
                onChange={(e) => onImageQualityChange(e.target.value as 'Standar' | 'HD' | 'Ultra')}
                className={selectStyle}
              >
                <option value="Standar" className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Standar</option>
                <option value="HD" className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">HD</option>
                <option value="Ultra" className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Ultra</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-300 pointer-events-none" />
            </div>
          </div>

          <div>
            <LabelWithIcon icon={Palette} text="Gaya Seni" htmlFor="artStyle" />
            <div className="relative">
              <select id="artStyle" value={settings.artStyle} onChange={(e) => handleSettingChange('artStyle', e.target.value)} className={selectStyle}>
                {artStyles.map((category: ArtStyleCategory, index: number) => (
                  <optgroup key={index} label={category.label} className="bg-light-bg dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    {category.options.map((style: ArtStyleOption) => (
                      <option key={style.value} value={style.value} className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {style.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-300 pointer-events-none" />
            </div>
          </div>

          <div>
            <LabelWithIcon icon={Cpu} text="Model AI" htmlFor="model" />
            <div className="relative">
              <select id="model" value={settings.model} onChange={(e) => handleSettingChange('model', e.target.value)} className={selectStyle}>
                {models.length > 0 ? (models.map(model => (<option key={model} value={model} className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">{model}</option>))) : (<option disabled className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Memuat...</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-300 pointer-events-none" />
            </div>
          </div>
          <div>
            <LabelWithIcon icon={ImageIcon} text="Jumlah Gambar" htmlFor="batchSize" />
            <input
                type="number"
                id="batchSize"
                min="1"
                max="10"
                value={settings.batchSize}
                onChange={(e) => handleSettingChange('batchSize', e.target.value)}
                className={inputStyle}
            />
          </div>
          <div className="md:col-start-2">
            <LabelWithIcon icon={Sprout} text="Seed" htmlFor="seed" />
            <input type="number" id="seed" value={settings.seed} onChange={(e) => handleSettingChange('seed', e.target.value)} className={inputStyle} />
          </div>
        </div>
    </div>
  );
}