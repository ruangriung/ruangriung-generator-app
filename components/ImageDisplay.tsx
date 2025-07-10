'use client';

interface ImageDisplayProps {
  isLoading: boolean;
  imageUrl: string;
  prompt: string;
  onLoad: () => void;
  onError: () => void;
}

export default function ImageDisplay({ isLoading, imageUrl, prompt, onLoad, onError }: ImageDisplayProps) {
  return (
    <div className="w-full max-w-2xl mt-8">
      <div className="aspect-square w-full bg-gray-200 rounded-2xl shadow-neumorphic-inset p-4 flex items-center justify-center">
        {isLoading && <div className="text-gray-500">Memuat gambar...</div>}
        
        {imageUrl && (
           <img
            src={imageUrl}
            alt={prompt}
            className="w-full h-full object-contain rounded-lg transition-opacity duration-500 opacity-0"
            onLoad={(e) => {
              (e.target as HTMLImageElement).style.opacity = '1';
              onLoad();
            }}
            onError={onError}
          />
        )}

        {!imageUrl && !isLoading && (
          <div className="text-center text-gray-500">
            <p>Gambar Anda akan muncul di sini.</p>
            <p className="text-sm">Atur parameter di atas dan klik "Buat Gambar".</p>
          </div>
        )}
      </div>
    </div>
  );
}