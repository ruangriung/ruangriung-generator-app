// components/EditControls.tsx
'use client';

import { FileImage, Type, Droplets, Text, Maximize, Palette, Sun, Contrast, RefreshCw } from 'lucide-react';
import { WatermarkSettings, FilterSettings } from './ImageDisplay';
import { useEffect } from 'react'; // Import useEffect

interface EditControlsProps {
  watermark: WatermarkSettings;
  filters: FilterSettings;
  onWatermarkChange: (newSettings: Partial<WatermarkSettings>) => void;
  onFilterChange: (newSettings: Partial<FilterSettings>) => void;
  onWatermarkFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetFilters: () => void;
}

const ControlRow = ({ label, icon, children }: { label: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{icon}{label}</label>
        {children}
    </div>
);

export const EditControls: React.FC<EditControlsProps> = ({
  watermark,
  filters,
  onWatermarkChange,
  onFilterChange,
  onWatermarkFileChange,
  onResetFilters
}) => {
  const inputStyle = `w-full p-2 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500`;
  const labelStyle = `block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1`;
  const sectionTitleStyle = `text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3`;
  // const sliderValueStyle = `text-sm text-gray-600 dark:text-gray-400 ml-2`; // Tidak diperlukan lagi, nilai akan ada di label ControlRow
  const buttonStyle = `p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-all flex items-center justify-center gap-2`;

  // Fungsi untuk menangani input slider dan memperbarui variabel CSS --value
  const handleSliderInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const min = parseFloat(target.min);
    const max = parseFloat(target.max);
    const value = parseFloat(target.value);
    const percentage = ((value - min) / (max - min)) * 100;
    target.style.setProperty('--value', `${percentage}%`); // Set variabel CSS --value

    // Panggil handler asli untuk memperbarui state React
    if (target.id === 'brightness' || target.id === 'contrast' || target.id === 'saturate') {
      onFilterChange({ [target.id]: Number(target.value) });
    } else if (target.id === 'size' || target.id === 'opacity') {
      onWatermarkChange({ [target.id]: Number(target.value) });
    }
  };

  // useEffect untuk mengatur nilai awal --value saat komponen dimuat atau filter/watermark berubah
  useEffect(() => {
    const setInitialSliderValues = () => {
      // Filter Sliders
      const brightnessInput = document.getElementById('brightness') as HTMLInputElement;
      if (brightnessInput) {
        const percentage = ((filters.brightness - parseFloat(brightnessInput.min)) / (parseFloat(brightnessInput.max) - parseFloat(brightnessInput.min))) * 100;
        brightnessInput.style.setProperty('--value', `${percentage}%`);
      }
      const contrastInput = document.getElementById('contrast') as HTMLInputElement;
      if (contrastInput) {
        const percentage = ((filters.contrast - parseFloat(contrastInput.min)) / (parseFloat(contrastInput.max) - parseFloat(contrastInput.min))) * 100;
        contrastInput.style.setProperty('--value', `${percentage}%`);
      }
      const saturateInput = document.getElementById('saturate') as HTMLInputElement;
      if (saturateInput) {
        const percentage = ((filters.saturate - parseFloat(saturateInput.min)) / (parseFloat(saturateInput.max) - parseFloat(saturateInput.min))) * 100;
        saturateInput.style.setProperty('--value', `${percentage}%`);
      }

      // Watermark Sliders
      const sizeInput = document.getElementById('size') as HTMLInputElement;
      if (sizeInput) {
        const percentage = ((watermark.size - parseFloat(sizeInput.min)) / (parseFloat(sizeInput.max) - parseFloat(sizeInput.min))) * 100;
        sizeInput.style.setProperty('--value', `${percentage}%`);
      }
      const opacityInput = document.getElementById('opacity') as HTMLInputElement;
      if (opacityInput) {
        const percentage = ((watermark.opacity - parseFloat(opacityInput.min)) / (parseFloat(opacityInput.max) - parseFloat(opacityInput.min))) * 100;
        opacityInput.style.setProperty('--value', `${percentage}%`);
      }
    };

    setInitialSliderValues();
  }, [filters, watermark]); // Jalankan ulang saat filters atau watermark berubah

  return (
    <div className="mt-6 p-6 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
      {/* Filter Controls */}
      <details open className="space-y-4">
        <summary className="font-semibold text-lg text-gray-700 dark:text-gray-200 cursor-pointer">Filter Gambar</summary>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <ControlRow label={`Kecerahan: ${filters.brightness}%`} icon={<Sun size={16} />}>
                <input
                  id="brightness" // Pastikan ada ID unik
                  type="range"
                  min="0"
                  max="200"
                  value={filters.brightness}
                  onChange={handleSliderInput} // Tetap gunakan ini untuk update state React
                  onInput={handleSliderInput} // Gunakan ini untuk update visual track secara real-time
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer range-slider-colored-track" // Class baru untuk styling
                />
            </ControlRow>
            <ControlRow label={`Kontras: ${filters.contrast}%`} icon={<Contrast size={16} />}>
                <input
                  id="contrast" // ID unik
                  type="range"
                  min="0"
                  max="200"
                  value={filters.contrast}
                  onChange={handleSliderInput}
                  onInput={handleSliderInput}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer range-slider-colored-track"
                />
            </ControlRow>
            <ControlRow label={`Saturasi: ${filters.saturate}%`} icon={<Droplets size={16} />}>
                <input
                  id="saturate" // ID unik
                  type="range"
                  min="0"
                  max="200"
                  value={filters.saturate}
                  onChange={handleSliderInput}
                  onInput={handleSliderInput}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer range-slider-colored-track"
                />
            </ControlRow>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onResetFilters} className={buttonStyle}>
            <RefreshCw size={20} /> Reset Filter
          </button>
        </div>
      </details>
      
      <hr className="border-gray-300 dark:border-gray-600 my-6"/>

      {/* Watermark Controls */}
      <details className="space-y-4">
        <summary className="font-semibold text-lg text-gray-700 dark:text-gray-200 cursor-pointer">Watermark</summary>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <ControlRow label="Teks Watermark" icon={<Type size={16} />}>
                <input type="text" value={watermark.text} onChange={(e) => onWatermarkChange({ text: e.target.value, image: null })} placeholder="Teks watermark..." className={inputStyle} />
            </ControlRow>
            <ControlRow label="Gambar Watermark" icon={<FileImage size={16} />}>
                <input type="file" accept="image/png, image/jpeg" onChange={onWatermarkFileChange} className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 dark:file:bg-purple-900/50 file:text-purple-700 dark:file:text-purple-300 hover:file:bg-purple-100"/>
            </ControlRow>
            <ControlRow label="Warna Teks" icon={<Palette size={16} />}>
                <input type="color" value={watermark.color} onChange={(e) => onWatermarkChange({ color: e.target.value })} className="w-full h-10 p-1 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer" />
            </ControlRow>
            <ControlRow label={`Ukuran: ${watermark.size}`} icon={<Maximize size={16} />}>
                <input
                  id="size" // ID unik
                  type="range"
                  min="10"
                  max="200"
                  value={watermark.size}
                  onChange={handleSliderInput}
                  onInput={handleSliderInput}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer range-slider-colored-track"
                />
            </ControlRow>
            <ControlRow label={`Opasitas: ${watermark.opacity}`} icon={<Droplets size={16} />}>
                <input
                  id="opacity" // ID unik
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={watermark.opacity}
                  onChange={handleSliderInput}
                  onInput={handleSliderInput}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer range-slider-colored-track"
                />
            </ControlRow>
            <ControlRow label="Jenis Font" icon={<Text size={16} />}>
                <select value={watermark.font} onChange={(e) => onWatermarkChange({ font: e.target.value })} className="w-full p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                    <option>Arial</option> <option>Verdana</option> <option>Georgia</option>
                    <option>Times New Roman</option> <option>Courier New</option>
                </select>
            </ControlRow>
        </div>
      </details>
    </div>
  );
};