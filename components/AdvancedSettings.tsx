// components/AdvancedSettings.tsx
'use client';

import { GeneratorSettings } from './ControlPanel';
import { Palette, Cpu, ArrowLeftRight, ArrowUpDown, Sprout, Settings, Image as ImageIcon } from 'lucide-react';
import { artStyles, ArtStyleCategory, ArtStyleOption } from '@/lib/artStyles';

// Definisikan props untuk komponen ini
interface AdvancedSettingsProps {
  settings: GeneratorSettings;
  setSettings: React.Dispatch<React.SetStateAction<GeneratorSettings>>;
  models: string[];
  aspectRatio: 'Kotak' | 'Portrait' | 'Lansekap' | 'Custom'; // <--- PERUBAHAN: Tambahkan 'Custom'
  onAspectRatioChange: (preset: 'Kotak' | 'Portrait' | 'Lansekap') => void;
  onManualDimensionChange: (width: number, height: number) => void; // <--- PERUBAHAN BARU: Tambahkan prop ini
  className?: string;
}

export default function AdvancedSettings({ settings, setSettings, models, aspectRatio, onAspectRatioChange, onManualDimensionChange, className }: AdvancedSettingsProps) { // <--- PERUBAHAN: Tambahkan prop baru di sini
  // <--- PERUBAHAN: Fungsi ini sekarang memanggil onManualDimensionChange untuk width/height
  const handleSettingChange = (field: keyof GeneratorSettings, value: string | number) => {
    if (field === 'width' || field === 'height') {
      const numValue = parseInt(value as string, 10);
      if (isNaN(numValue) || numValue <= 0) { // Validasi dasar
        // Opsional: Anda bisa menambahkan feedback ke user atau mengatur nilai default
        return;
      }
      // Panggil fungsi baru untuk memperbarui dimensi DAN memeriksa preset
      if (field === 'width') {
        onManualDimensionChange(numValue, settings.height);
      } else { // field === 'height'
        onManualDimensionChange(settings.width, numValue);
      }
    } else {
      // Untuk pengaturan lain (model, seed, artStyle, batchSize)
      setSettings(prev => ({ ...prev, [field]: value }));
    }
  };

  const inputStyle = "w-full p-3 bg-light-bg rounded-lg shadow-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow";
  const selectStyle = `${inputStyle} appearance-none`;
  
  // <--- PERUBAHAN: Sesuaikan logika presetButtonStyle
  const presetButtonStyle = (presetName: 'Kotak' | 'Portrait' | 'Lansekap') => 
    `px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
      aspectRatio === presetName // Sekarang cek langsung terhadap prop aspectRatio
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
    <details className={`w-full group ${className || ''}`}>
      <summary className="flex items-center justify-between p-4 bg-light-bg rounded-lg cursor-pointer list-none shadow-neumorphic-button transition-shadow">
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
            <button onClick={() => onAspectRatioChange('Kotak')} className={presetButtonStyle('Kotak')}>Kotak</button>
            <button onClick={() => onAspectRatioChange('Portrait')} className={presetButtonStyle('Portrait')}>Portrait</button>
            <button onClick={() => onAspectRatioChange('Lansekap')} className={presetButtonStyle('Lansekap')}>Lansekap</button>
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
              {artStyles.map((category: ArtStyleCategory, index: number) => (
                <optgroup key={index} label={category.label}>
                  {category.options.map((style: ArtStyleOption) => (
                    <option key={style.value} value={style.value}>{style.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <LabelWithIcon icon={Cpu} text="Model AI" htmlFor="model" />
            <select id="model" value={settings.model} onChange={(e) => handleSettingChange('model', e.target.value)} className={selectStyle}>
              {models.length > 0 ? (models.map(model => (<option key={model} value={model}>{model}</option>))) : (<option disabled>Memuat...</option>)}
            </select>
          </div>
          {/* --- Penambahan Input Batch Size di sini --- */}
          <div>
            <LabelWithIcon icon={ImageIcon} text="Jumlah Gambar" htmlFor="batchSize" />
            <input
                type="number"
                id="batchSize"
                min="1"
                max="10" // Batasi agar tidak terlalu banyak
                value={settings.batchSize}
                onChange={(e) => handleSettingChange('batchSize', parseInt(e.target.value, 10))}
                className={inputStyle}
            />
          </div>
          <div className="md:col-start-2">
            <LabelWithIcon icon={Sprout} text="Seed" htmlFor="seed" />
            <input type="number" id="seed" value={settings.seed} onChange={(e) => handleSettingChange('seed', parseInt(e.target.value))} className={inputStyle} />
          </div>
        </div>
      </div>
    </details>
  );
}