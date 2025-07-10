'use client';

import { GeneratorSettings } from './ControlPanel';
import { Palette, Cpu, ArrowLeftRight, ArrowUpDown, Sprout, Settings } from 'lucide-react'; // 1. Impor ikon Settings

interface AdvancedSettingsProps {
  settings: GeneratorSettings;
  setSettings: React.Dispatch<React.SetStateAction<GeneratorSettings>>;
  models: string[];
  aspectRatio: string;
  onAspectRatioChange: (preset: 'Kotak' | 'Portrait' | 'Lansekap') => void;
}

const artStyles = [
  { name: 'Default', value: '' },
  { name: 'Fotorealistis', value: ', photorealistic, 4k, hyper-detailed' },
  { name: 'Lukisan Cat Minyak', value: ', oil painting, masterpiece' },
  { name: 'Gaya Anime', value: ', anime style, trending on artstation' },
  { name: 'Seni Digital', value: ', digital art, smooth, sharp focus' },
  { name: 'Konsep Seni', value: ', concept art, intricate details' },
];

export default function AdvancedSettings({ settings, setSettings, models, aspectRatio, onAspectRatioChange }: AdvancedSettingsProps) {
  const handleSettingChange = (field: keyof GeneratorSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const inputStyle = "w-full p-3 bg-light-bg rounded-lg shadow-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow";
  const selectStyle = `${inputStyle} appearance-none`;
  
  const presetButtonStyle = (isActive: boolean) => 
    `px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
      isActive 
        ? 'bg-purple-600 text-white shadow-neumorphic-button'
        : 'bg-light-bg text-gray-700 shadow-neumorphic-button'
    }`;
  
  const LabelWithIcon = ({ icon: Icon, text, htmlFor }: { icon: React.ElementType, text: string, htmlFor: string }) => (
    <div className="flex items-center gap-x-2 mb-2">
      <Icon className="h-4 w-4 text-purple-600" />
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-600">
        {text}
      </label>
    </div>
  );

  return (
    <details className="w-full mt-6 group">
      <summary className="flex items-center justify-between p-4 bg-light-bg rounded-lg cursor-pointer list-none shadow-neumorphic-button transition-shadow">
        {/* 2. Tambahkan div untuk mengelompokkan ikon dan teks */}
        <div className="flex items-center gap-x-2">
          <Settings className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-gray-700">
            Pengaturan Lanjutan
          </span>
        </div>
        
        <svg className="w-5 h-5 text-purple-600 transition-transform duration-300 group-open:rotate-90"
             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </summary>
      
      <div className="mt-6 p-6 bg-light-bg rounded-2xl shadow-neumorphic-inset">
        <div className="mb-6">
          <label className="block text-center text-sm font-medium text-gray-600 mb-2">Preset Aspek Rasio</label>
          <div className="flex justify-center gap-4">
            <button onClick={() => onAspectRatioChange('Kotak')} className={presetButtonStyle(aspectRatio === 'Kotak')}>Kotak</button>
            <button onClick={() => onAspectRatioChange('Portrait')} className={presetButtonStyle(aspectRatio === 'Portrait')}>Portrait</button>
            <button onClick={() => onAspectRatioChange('Lansekap')} className={presetButtonStyle(aspectRatio === 'Lansekap')}>Lansekap</button>
          </div>
        </div>
        <hr className="my-6 border-gray-300" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <div>
            <LabelWithIcon icon={ArrowLeftRight} text="Lebar" htmlFor="width" />
            <input type="number" id="width" value={settings.width} onChange={(e) => handleSettingChange('width', parseInt(e.target.value))} className={inputStyle} />
          </div>
          <div>
            <LabelWithIcon icon={ArrowUpDown} text="Tinggi" htmlFor="height" />
            <input type="number" id="height" value={settings.height} onChange={(e) => handleSettingChange('height', parseInt(e.target.value))} className={inputStyle} />
          </div>
          <div>
            <LabelWithIcon icon={Palette} text="Gaya Seni" htmlFor="artStyle" />
            <select id="artStyle" value={settings.artStyle} onChange={(e) => handleSettingChange('artStyle', e.target.value)} className={selectStyle}>
              {artStyles.map(style => (<option key={style.name} value={style.value}>{style.name}</option>))}
            </select>
          </div>
          <div>
            <LabelWithIcon icon={Cpu} text="Model AI" htmlFor="model" />
            <select id="model" value={settings.model} onChange={(e) => handleSettingChange('model', e.target.value)} className={selectStyle}>
              {models.length > 0 ? (models.map(model => (<option key={model} value={model}>{model}</option>))) : (<option disabled>Memuat...</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <LabelWithIcon icon={Sprout} text="Seed" htmlFor="seed" />
            <input type="number" id="seed" value={settings.seed} onChange={(e) => handleSettingChange('seed', parseInt(e.target.value))} className={inputStyle} />
          </div>
        </div>
      </div>
    </details>
  );
}