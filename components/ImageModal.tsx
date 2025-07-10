// components/ImageModal.tsx
'use client';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function ImageModal({ isOpen, imageUrl, onClose }: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose} // Menutup modal saat backdrop diklik
    >
      <button 
        className="absolute top-4 right-4 text-white text-4xl font-bold"
        onClick={onClose}
      >
        &times;
      </button>
      <div className="relative p-4">
        {/* Menghentikan penutupan modal saat gambar diklik */}
        <img 
          src={imageUrl} 
          alt="Gambar yang diperbesar" 
          className="max-h-[90vh] max-w-[90vw] object-contain"
          onClick={(e) => e.stopPropagation()} 
        />
      </div>
    </div>
  );
}