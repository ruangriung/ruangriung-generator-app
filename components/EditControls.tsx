// components/EditControls.tsx
'use client';

import { FileImage, Type, Droplets, Text, Maximize, Palette, Sun, Contrast } from 'lucide-react';
import { WatermarkSettings, FilterSettings } from './ImageDisplay';

interface EditControlsProps {
  watermark: WatermarkSettings;
  filters: FilterSettings;
  onWatermarkChange: (newSettings: Partial<WatermarkSettings>) => void;
  onFilterChange: (newSettings: Partial<FilterSettings>) => void;
  onWatermarkFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ControlRow = ({ label, icon, children }: { label: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{icon}{label}</label>
        {children}
    </div>
);

export const EditControls = ({ watermark, filters, onWatermarkChange, onFilterChange, onWatermarkFileChange }: EditControlsProps) => {
  return (
    <div className="mt-4 p-4 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic space-y-6">
      {/* Filter Controls */}
      <details open className="space-y-4">
        <summary className="font-semibold text-lg text-gray-700 dark:text-gray-200 cursor-pointer">Filter Gambar</summary>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <ControlRow label="Kecerahan" icon={<Sun size={16} />}>
                <input type="range" min="0" max="200" value={filters.brightness} onChange={(e) => onFilterChange({ brightness: Number(e.target.value) })} className="w-full" />
            </ControlRow>
            <ControlRow label="Kontras" icon={<Contrast size={16} />}>
                <input type="range" min="0" max="200" value={filters.contrast} onChange={(e) => onFilterChange({ contrast: Number(e.target.value) })} className="w-full" />
            </ControlRow>
            <ControlRow label="Saturasi" icon={<Droplets size={16} />}>
                <input type="range" min="0" max="200" value={filters.saturate} onChange={(e) => onFilterChange({ saturate: Number(e.target.value) })} className="w-full" />
            </ControlRow>
        </div>
      </details>
      
      <hr className="border-gray-300 dark:border-gray-600"/>

      {/* Watermark Controls */}
      <details className="space-y-4">
        <summary className="font-semibold text-lg text-gray-700 dark:text-gray-200 cursor-pointer">Watermark</summary>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <ControlRow label="Teks Watermark" icon={<Type size={16} />}>
                <input type="text" value={watermark.text} onChange={(e) => onWatermarkChange({ text: e.target.value, image: null })} placeholder="Teks watermark..." className="w-full p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600" />
            </ControlRow>
            <ControlRow label="Gambar Watermark" icon={<FileImage size={16} />}>
                <input type="file" accept="image/png, image/jpeg" onChange={onWatermarkFileChange} className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 dark:file:bg-purple-900/50 file:text-purple-700 dark:file:text-purple-300 hover:file:bg-purple-100"/>
            </ControlRow>
            <ControlRow label="Warna Teks" icon={<Palette size={16} />}>
                <input type="color" value={watermark.color} onChange={(e) => onWatermarkChange({ color: e.target.value })} className="w-full h-10 p-1 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer" />
            </ControlRow>
            <ControlRow label="Ukuran" icon={<Maximize size={16} />}>
                <input type="range" min="10" max="200" value={watermark.size} onChange={(e) => onWatermarkChange({ size: Number(e.target.value) })} className="w-full" />
            </ControlRow>
            <ControlRow label="Opasitas" icon={<Droplets size={16} />}>
                <input type="range" min="0" max="1" step="0.05" value={watermark.opacity} onChange={(e) => onWatermarkChange({ opacity: Number(e.target.value) })} className="w-full" />
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