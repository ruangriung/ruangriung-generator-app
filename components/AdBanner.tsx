// components/AdBanner.tsx
import { Megaphone } from 'lucide-react';

interface AdBannerProps {
  className?: string;
  style?: React.CSSProperties;
  type?: 'banner' | 'square';
}

export const AdBanner = ({ className = '', style, type = 'banner' }: AdBannerProps) => {
  const adContainerStyle = `
    w-full bg-gray-200 dark:bg-gray-800 
    border-2 border-dashed border-gray-400 dark:border-gray-600 
    rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400
    ${type === 'banner' ? 'min-h-[90px]' : 'aspect-square'}
    ${className}
  `;

  return (
    <div style={style} className={adContainerStyle}>
      <div className="text-center">
        <Megaphone className="mx-auto h-8 w-8" />
        <p className="text-sm font-semibold mt-2">Slot Iklan</p>
        <p className="text-xs">{type === 'banner' ? '728x90' : '300x300'}</p>
      </div>
    </div>
  );
};