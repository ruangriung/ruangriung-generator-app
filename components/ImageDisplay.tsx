// components/ImageDisplay.tsx
'use client';

import { useState, useRef, useEffect, forwardRef, memo } from 'react';
import toast from 'react-hot-toast';
import Spinner from './Spinner';
import { ZoomIn, Download, Paintbrush, Shuffle, X, Sun, Contrast, Droplets, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react'; // Import RefreshCw, Sparkles, ImageIcon
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

// Definisikan pengaturan filter default
const DEFAULT_FILTER_SETTINGS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
};

const ImageDisplay = memo(forwardRef<HTMLDivElement, ImageDisplayProps>(({
    isLoading,
    imageUrls,
    prompt,
    onZoomClick,
    onVariationsClick
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [filters, setFilters] = useState<FilterSettings>(DEFAULT_FILTER_SETTINGS); // Gunakan default settings
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

  // Fungsi untuk mereset filter
  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTER_SETTINGS);
    toast.success("Filter berhasil direset!");
  };

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
  const actionButtonStyle = "h-12 w-12 glass-button";

  return (
    <div ref={ref} className="w-full max-w-3xl mt-12 space-y-6">
      <div className="relative aspect-square w-full glass-card overflow-hidden group">
        <div className="absolute inset-0 bg-slate-950/5 dark:bg-black/20 backdrop-blur-sm" />
        
        <canvas 
          ref={canvasRef} 
          className={`relative z-10 m-auto max-w-full max-h-full object-contain transition-transform duration-700 ${
            isEditing ? 'cursor-move touch-none scale-[0.98]' : 'cursor-auto hover:scale-[1.02]'
          }`} 
          onPointerDown={isEditing ? handlePointerDown : undefined} 
          onPointerMove={isEditing ? handlePointerMove : undefined} 
          onPointerUp={isEditing ? handlePointerUp : undefined} 
          onPointerLeave={isEditing ? handlePointerUp : undefined} 
        />

        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-md transition-all animate-in fade-in">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-[-20px] rounded-full bg-primary-500/20 blur-2xl animate-pulse" />
              
              {/* Spinning Ring */}
              <div className="h-24 w-24 rounded-full border-4 border-white/10 border-t-white animate-spin shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
              
              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" size={32} />
              </div>
            </div>
            <p className="mt-8 text-white font-black uppercase tracking-[0.4em] text-[10px] animate-pulse drop-shadow-sm">
              Generating Visual...
            </p>
          </div>
        )}

        {!isImageReady && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <div className="h-20 w-20 rounded-[2rem] bg-primary-500/10 flex items-center justify-center text-primary-500 mb-6 animate-float">
              <ImageIcon size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Hasil Gambar Akan muncul Disini</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs">
              Atur parameter dan klik tombol Generate untuk melihat keajaiban terjadi di sini.
            </p>
          </div>
        )}

        {/* Editing Mode Overlay Label */}
        {isEditing && (
          <div className="absolute top-6 left-6 z-30 px-4 py-2 bg-primary-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 flex items-center gap-2">
            <Paintbrush size={14} /> Mode Edit Aktif
          </div>
        )}
      </div>

      {isImageReady && (
        <div className="flex justify-center items-center gap-3 animate-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={onVariationsClick} 
            className={`${actionButtonStyle} text-slate-700 dark:text-slate-200 hover:text-white`} 
            title="Buat Variasi"
          >
            <Shuffle size={20} />
          </button>
          <div className="h-8 w-px bg-white/10" />
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className={`${actionButtonStyle} ${isEditing ? 'bg-primary-500 text-white border-primary-500' : 'text-primary-500'}`} 
            title={isEditing ? "Selesai Edit" : "Edit Gambar"}
            disabled={imageUrls.length > 1}
          >
            {isEditing ? <X size={20} /> : <Paintbrush size={20} />}
          </button>
          <button 
            onClick={onZoomClick} 
            className={`${actionButtonStyle} text-slate-700 dark:text-slate-200 hover:text-white`} 
            title="Perbesar Gambar" 
            disabled={imageUrls.length > 1}
          >
            <ZoomIn size={20} />
          </button>
          <div className="h-8 w-px bg-white/10" />
          <button 
            onClick={handleDownload} 
            className="h-12 px-6 glass-button text-primary-500 hover:bg-primary-500 hover:text-white"
            title="Unduh Gambar"
          >
            <Download size={20} className="mr-2" />
            <span className="font-black uppercase tracking-widest text-[10px]">Unduh</span>
          </button>
        </div>
      )}

      {isEditing && (
        <div className="animate-in slide-in-from-top-4 duration-500">
          <EditControls
            watermark={watermark}
            filters={filters}
            onWatermarkChange={handleWatermarkChange}
            onFilterChange={handleFilterChange}
            onWatermarkFileChange={handleWatermarkFileChange} // eslint-disable-line
            onResetFilters={handleResetFilters}
          />
        </div>
      )}
    </div>
  );
}));

ImageDisplay.displayName = 'ImageDisplay';
export default ImageDisplay;
