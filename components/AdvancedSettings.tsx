// components/AdvancedSettings.tsx
'use client';

import { GeneratorSettings } from './ControlPanel';
import { Palette, Cpu, ArrowLeftRight, ArrowUpDown, Sparkles, ImageIcon, Sprout, ChevronDown, Lock, Shield, EyeOff, Link2 } from 'lucide-react';
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
  onModelSelect: (model: string) => void;
}

export default function AdvancedSettings({ settings, setSettings, models, aspectRatio, onAspectRatioChange, onManualDimensionChange, onImageQualityChange, className, onModelSelect }: AdvancedSettingsProps) {
  const handleSettingChange = (field: keyof GeneratorSettings, value: string | number | boolean) => {
    if (field === 'model') {
        onModelSelect(value as string);
    } else if (field === 'private' || field === 'safe' || field === 'transparent') {
        setSettings(prev => ({ ...prev, [field]: value as boolean }));
    } else if (field === 'width' || field === 'height' || field === 'batchSize' || field === 'seed') {
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
  const checkboxContainerStyle = "flex items-center gap-3 p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button";
  const checkboxStyle = "h-5 w-5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer";
  
  const LabelWithIcon = ({ icon: Icon, text, htmlFor }: { icon: React.ElementType, text: string, htmlFor?: string }) => (
    <div className="flex items-center gap-x-2 mb-2">
      <Icon className="h-4 w-4 text-purple-600" />
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-600 dark:text-gray-300">
        {text}
      </label>
    </div>
  );

  return (
    <div className={`mt-6 p-6 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset ${className || ''}`}>
        <div className="mb-6">
          <label className="block text-center text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Preset Aspek Rasio</label>
          <div className="flex justify-center gap-4">
            <button onClick={() => onAspectRatioChange('Kotak')} className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${aspectRatio === 'Kotak' ? 'bg-purple-600 text-white shadow-neumorphic-button dark:shadow-dark-neumorphic-button' : 'bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 shadow-neumorphic-button dark:shadow-dark-neumorphic-button'}`}>Kotak</button>
            <button onClick={() => onAspectRatioChange('Portrait')} className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${aspectRatio === 'Portrait' ? 'bg-purple-600 text-white shadow-neumorphic-button dark:shadow-dark-neumorphic-button' : 'bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 shadow-neumorphic-button dark:shadow-dark-neumorphic-button'}`}>Portrait</button>
            <button onClick={() => onAspectRatioChange('Lansekap')} className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${aspectRatio === 'Lansekap' ? 'bg-purple-600 text-white shadow-neumorphic-button dark:shadow-dark-neumorphic-button' : 'bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 shadow-neumorphic-button dark:shadow-dark-neumorphic-button'}`}>Lansekap</button>
          </div>
        </div>
        <hr className="my-6 border-gray-300 dark:border-gray-600" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <div>
            <LabelWithIcon icon={Sparkles} text="Guidance Scale (CFG)" htmlFor="cfg-scale" />
            <div className="flex items-center gap-3">
              <input
                type="range"
                id="cfg-scale"
                min="1"
                max="20"
                step="0.5"
                value={settings.cfg_scale}
                onChange={(e) => handleSettingChange('cfg_scale', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 range-slider-colored-track"
              />
              <span className="font-bold text-purple-600 w-10 text-center">{settings.cfg_scale}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Nilai rendah lebih kreatif, nilai tinggi lebih mengikuti prompt.</p>
          </div>
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
              <select id="imageQuality" value={settings.imageQuality} onChange={(e) => onImageQualityChange(e.target.value as 'Standar' | 'HD' | 'Ultra')} className={selectStyle}>
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
                {artStyles.map((category: ArtStyleCategory) => (
                  <optgroup key={category.label} label={category.label} className="bg-light-bg dark:bg-gray-800 text-gray-800 dark:text-gray-200">
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
            <input type="number" id="batchSize" min="1" max="10" value={settings.batchSize} onChange={(e) => handleSettingChange('batchSize', e.target.value)} className={inputStyle} />
          </div>
          <div>
            <LabelWithIcon icon={Sprout} text="Seed" htmlFor="seed" />
            <input type="number" id="seed" value={settings.seed} onChange={(e) => handleSettingChange('seed', e.target.value)} className={inputStyle} />
          </div>
           {/* -- KONTROL UNTUK PARAMETER BARU -- */}
          <div className="md:col-span-2">
            <LabelWithIcon icon={Link2} text="URL Gambar Input (Image-to-Image)" htmlFor="inputImage" />
            <input type="text" id="inputImage" value={settings.inputImage} onChange={(e) => handleSettingChange('inputImage', e.target.value)} className={inputStyle} placeholder="https://example.com/image.jpg (opsional)" />
          </div>
          <div className={checkboxContainerStyle}>
            <input id="private" type="checkbox" checked={settings.private} onChange={(e) => handleSettingChange('private', e.target.checked)} className={checkboxStyle} />
            <label htmlFor="private" className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 cursor-pointer"><Lock size={16}/>Mode Privat</label>
          </div>
          <div className={checkboxContainerStyle}>
            <input id="safe" type="checkbox" checked={settings.safe} onChange={(e) => handleSettingChange('safe', e.target.checked)} className={checkboxStyle} />
            <label htmlFor="safe" className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 cursor-pointer"><Shield size={16}/>Filter NSFW Ketat</label>
          </div>
          <div className={checkboxContainerStyle}>
            <input id="transparent" type="checkbox" checked={settings.transparent} onChange={(e) => handleSettingChange('transparent', e.target.checked)} className={checkboxStyle} disabled={settings.model !== 'gptimage'} />
            <label htmlFor="transparent" className={`flex items-center gap-2 text-sm font-medium cursor-pointer ${settings.model !== 'gptimage' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}><EyeOff size={16}/>Latar Transparan (Hanya gptimage)</label>
          </div>
        </div>
    </div>
  );
}