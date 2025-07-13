// components/WatermarkControls.tsx
'use client';

import { FileImage, Type, Droplets, Text, Maximize, Palette } from 'lucide-react';
import { WatermarkSettings } from './ImageDisplay'; // Kita akan buat interface ini nanti

interface WatermarkControlsProps {
  settings: WatermarkSettings;
  onSettingsChange: (newSettings: Partial<WatermarkSettings>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ControlRow = ({ label, icon, children }: { label: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{icon}{label}</label>
        {children}
    </div>
);

export const WatermarkControls = ({ settings, onSettingsChange, onFileChange }: WatermarkControlsProps) => {
  return (
    <div className="mt-4 p-4 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ControlRow label="Teks Watermark" icon={<Type size={16} />}>
          <input
            type="text"
            value={settings.text}
            onChange={(e) => onSettingsChange({ text: e.target.value })}
            placeholder="Teks watermark Anda..."
            className="w-full p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
          />
        </ControlRow>
        <ControlRow label="Gambar Watermark" icon={<FileImage size={16} />}>
            <input type="file" accept="image/png, image/jpeg" onChange={onFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 dark:file:bg-purple-900/50 file:text-purple-700 dark:file:text-purple-300 hover:file:bg-purple-100"/>
        </ControlRow>
        <ControlRow label="Warna Teks" icon={<Palette size={16} />}>
             <input type="color" value={settings.color} onChange={(e) => onSettingsChange({ color: e.target.value })} className="w-full h-10 p-1 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer" />
        </ControlRow>
        <ControlRow label="Ukuran" icon={<Maximize size={16} />}>
          <input type="range" min="10" max="200" value={settings.size} onChange={(e) => onSettingsChange({ size: Number(e.target.value) })} className="w-full" />
        </ControlRow>
        <ControlRow label="Opasitas" icon={<Droplets size={16} />}>
          <input type="range" min="0" max="1" step="0.05" value={settings.opacity} onChange={(e) => onSettingsChange({ opacity: Number(e.target.value) })} className="w-full" />
        </ControlRow>
         <ControlRow label="Jenis Font" icon={<Text size={16} />}>
          <select value={settings.font} onChange={(e) => onSettingsChange({ font: e.target.value })} className="w-full p-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
            <option>Arial</option>
            <option>Verdana</option>
            <option>Georgia</option>
            <option>Times New Roman</option>
            <option>Courier New</option>
          </select>
        </ControlRow>
      </div>
    </div>
  );
};