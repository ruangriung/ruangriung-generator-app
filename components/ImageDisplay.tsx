'use client';

import { useState } from 'react';
import Spinner from './Spinner';
import { ZoomIn, Download, Paintbrush, Sun, Contrast, Droplets, Shuffle } from 'lucide-react';

interface ImageDisplayProps {
  isLoading: boolean;
  imageUrl: string;
  prompt: string;
  onLoad?: () => void; // <-- TAMBAHKAN '?'
  onError?: () => void; // <-- TAMBAHKAN '?'
  onZoomClick: () => void;
  onDownloadClick: () => void;
  onVariationsClick: () => void;
}

export default function ImageDisplay({ 
    isLoading, 
    imageUrl, 
    prompt, 
    onLoad, 
    onError, 
    onZoomClick, 
    onDownloadClick, 
    onVariationsClick 
}: ImageDisplayProps) {
  const isImageReady = !isLoading && imageUrl;

  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
  });

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: Number(value) }));
  };
  
  const imageFilterStyle = {
    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%)`
  };

  const actionButtonStyle = `p-3 bg-light-bg rounded-lg shadow-neumorphic-button active:shadow-neumorphic-inset text-gray-700 hover:text-purple-600 transition-all`;

  return (
    <div className="w-full max-w-2xl mt-8">
      <div className="relative aspect-square w-full bg-light-bg rounded-2xl shadow-neumorphic-inset p-4 flex items-center justify-center">
        {imageUrl && (
          <img
            key={imageUrl}
            src={imageUrl}
            alt={prompt}
            className={`w-full h-full object-contain rounded-lg transition-all duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
            style={imageFilterStyle}
            onLoad={onLoad} 
            onError={onError}
          />
        )}
        
        {!imageUrl && !isLoading && (
          <div className="text-center text-gray-500">
            <p>Gambar Anda akan muncul di sini.</p>
            <p className="text-sm">Atur parameter di atas dan klik "Buat Gambar".</p>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-40 rounded-xl">
            <Spinner />
            <p className="text-white mt-2 font-semibold">Membuat gambar...</p>
          </div>
        )}
      </div>

      {isImageReady && (
        <div className="mt-4 flex justify-center items-center gap-4">
          <button onClick={onVariationsClick} className={actionButtonStyle} aria-label="Buat Variasi">
            <Shuffle size={24} />
          </button>
          <button onClick={() => setIsEditing(!isEditing)} className={`${actionButtonStyle} ${isEditing ? '!text-purple-600' : ''}`} aria-label="Edit Gambar">
            <Paintbrush size={24} />
          </button>
          <button onClick={onZoomClick} className={actionButtonStyle} aria-label="Perbesar Gambar">
            <ZoomIn size={24} />
          </button>
          <button onClick={onDownloadClick} className={actionButtonStyle} aria-label="Unduh Gambar">
            <Download size={24} />
          </button>
        </div>
      )}

      {isEditing && isImageReady && (
        <div className="mt-4 p-4 bg-light-bg rounded-2xl shadow-neumorphic space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="brightness" className="flex items-center gap-2 text-sm font-medium text-gray-600"><Sun size={16} /> Kecerahan</label>
              <input id="brightness" type="range" min="0" max="200" value={filters.brightness} onChange={(e) => handleFilterChange('brightness', e.target.value)} className="w-full" />
            </div>
            <div className="space-y-1">
              <label htmlFor="contrast" className="flex items-center gap-2 text-sm font-medium text-gray-600"><Contrast size={16} /> Kontras</label>
              <input id="contrast" type="range" min="0" max="200" value={filters.contrast} onChange={(e) => handleFilterChange('contrast', e.target.value)} className="w-full" />
            </div>
            <div className="space-y-1">
              <label htmlFor="saturate" className="flex items-center gap-2 text-sm font-medium text-gray-600"><Droplets size={16} /> Saturasi</label>
              <input id="saturate" type="range" min="0" max="200" value={filters.saturate} onChange={(e) => handleFilterChange('saturate', e.target.value)} className="w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}