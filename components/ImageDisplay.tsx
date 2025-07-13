// components/ImageDisplay.tsx
'use client';

import { useState, useRef, useEffect, forwardRef } from 'react';
import toast from 'react-hot-toast';
import Spinner from './Spinner';
import { ZoomIn, Download, Paintbrush, Shuffle, X, Sun, Contrast, Droplets } from 'lucide-react';
import { EditControls } from './EditControls';

// Definisikan tipe data untuk pengaturan
export interface WatermarkSettings {
  text: string;
  image: HTMLImageElement | null;
  size: number;
  opacity: number;
  color: string;
  font: string;
  position: { x: number; y: number };
}

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturate: number;
}

// Definisikan props untuk komponen
interface ImageDisplayProps {
  isLoading: boolean;
  imageUrls: string[];
  prompt: string;
  onZoomClick: () => void;
  onVariationsClick: () => void;
}

const ImageDisplay = forwardRef<HTMLDivElement, ImageDisplayProps>(({ 
    isLoading, 
    imageUrls,
    prompt, 
    onZoomClick,
    onVariationsClick 
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [filters, setFilters] = useState<FilterSettings>({ brightness: 100, contrast: 100, saturate: 100 });
  const [watermark, setWatermark] = useState<WatermarkSettings>({
    text: 'RuangRiung', image: null, size: 48, opacity: 0.7,
    color: '#FFFFFF', font: 'Arial', position: { x: 150, y: 150 },
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    // Jika tidak ada gambar, bersihkan canvas dan jangan gambar apa-apa
    if (imageUrls.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    const baseImage = new Image();
    baseImage.crossOrigin = 'anonymous';
    baseImage.src = imageUrls[0];
    
    baseImage.onload = () => {
      canvas.width = baseImage.naturalWidth;
      canvas.height = baseImage.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%)`;
      ctx.drawImage(baseImage, 0, 0);
      ctx.filter = 'none';
      
      ctx.globalAlpha = watermark.opacity;
      if (watermark.image) {
        const w = watermark.image.width * (watermark.size / 100);
        const h = watermark.image.height * (watermark.size / 100);
        ctx.drawImage(watermark.image, watermark.position.x - w / 2, watermark.position.y - h / 2, w, h);
      } else if (watermark.text) {
        ctx.fillStyle = watermark.color;
        ctx.font = `${watermark.size}px ${watermark.font}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(watermark.text, watermark.position.x, watermark.position.y);
      }
      ctx.globalAlpha = 1.0;
    };
  };

  useEffect(() => {
      drawCanvas();
  }, [watermark, filters, imageUrls]);

  const handleWatermarkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => handleWatermarkChange({ image: img, text: '' });
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleWatermarkChange = (newSettings: Partial<WatermarkSettings>) => setWatermark(prev => ({ ...prev, ...newSettings }));
  const handleFilterChange = (newSettings: Partial<FilterSettings>) => setFilters(prev => ({ ...prev, ...newSettings }));

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    setIsDragging(true);
    dragStartPos.current = { x: x - watermark.position.x, y: y - watermark.position.y };
    canvas.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    setWatermark(prev => ({ ...prev, position: { x: x - dragStartPos.current.x, y: y - dragStartPos.current.y } }));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    canvasRef.current?.releasePointerCapture(e.pointerId);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || imageUrls.length === 0) {
        toast.error("Tidak ada gambar untuk diunduh.");
        return;
    }
    drawCanvas();
    const dataUrl = canvas.toDataURL('image/png', 0.95);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `ruangriung-edited-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Gambar berhasil diunduh!");
  };

  const isImageReady = !isLoading && imageUrls.length > 0;
  const actionButtonStyle = `p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-all`;

  return (
    <div ref={ref} className="w-full max-w-2xl mt-8">
      <div className="relative aspect-square w-full bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset p-4 flex items-center justify-center">
        <canvas ref={canvasRef} className={`m-auto max-w-full max-h-full object-contain ${isEditing ? 'cursor-move touch-none' : 'cursor-auto'}`} onPointerDown={isEditing ? handlePointerDown : undefined} onPointerMove={isEditing ? handlePointerMove : undefined} onPointerUp={isEditing ? handlePointerUp : undefined} onPointerLeave={isEditing ? handlePointerUp : undefined} />
        {isLoading && <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-40 rounded-xl"><Spinner /></div>}
        
        {/* --- PERBAIKAN: Placeholder dibuat menjadi overlay absolut --- */}
        {!isImageReady && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 p-4">
                <p>Gambar Anda akan muncul di sini.</p>
                <p className="text-sm">Atur parameter di atas dan klik "Buat Gambar".</p>
            </div>
        )}
      </div>

      {isImageReady && (
        <div className="mt-4 flex justify-center items-center gap-4">
          <button onClick={onVariationsClick} className={actionButtonStyle} aria-label="Buat Variasi"><Shuffle size={24} /></button>
          <button onClick={() => setIsEditing(!isEditing)} className={`${actionButtonStyle} ${isEditing ? '!text-purple-600' : ''}`} aria-label={isEditing ? "Selesai Edit" : "Edit Gambar"} disabled={imageUrls.length > 1}>
            {isEditing ? <X size={24} /> : <Paintbrush size={24} />}
          </button>
          <button onClick={onZoomClick} className={actionButtonStyle} aria-label="Perbesar Gambar" disabled={imageUrls.length > 1}><ZoomIn size={24} /></button>
          <button onClick={handleDownload} className={actionButtonStyle} aria-label="Unduh Gambar"><Download size={24} /></button>
        </div>
      )}

      {isEditing && (
        <EditControls 
          watermark={watermark} 
          filters={filters} 
          onWatermarkChange={handleWatermarkChange}
          onFilterChange={handleFilterChange}
          onWatermarkFileChange={handleWatermarkFileChange}
        />
      )}
    </div>
  );
});

ImageDisplay.displayName = 'ImageDisplay';
export default ImageDisplay;