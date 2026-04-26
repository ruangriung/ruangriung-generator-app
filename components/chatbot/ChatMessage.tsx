import { useState } from 'react';
import { Bot, User, Copy, Check, RefreshCw, Download } from 'lucide-react'; 
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import toast from 'react-hot-toast';
import { Message } from './useChatManager';
import Image from 'next/image';

interface ChatMessageProps {
  message: Message;
  messageId: string;
  onRegenerate?: () => void;
}

export const ChatMessage = ({ message, messageId, onRegenerate }: ChatMessageProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    let textToCopy = '';
    
    // Hanya salin teks, bukan objek gambar
    if (typeof message.content === 'string') {
      textToCopy = message.content;
    } else if (typeof message.content === 'object' && message.content.text) {
        // Jika ada teks deskripsi pada gambar, salin itu
        textToCopy = message.content.text;
    }
    
    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        toast.success("Teks berhasil disalin!");
        setTimeout(() => setIsCopied(false), 2000);
    } else {
        toast.error("Tidak ada teks untuk disalin.");
    }
  };

  const downloadImage = async (url: string) => {
    toast.loading('Mempersiapkan unduhan...');

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Gagal mengambil data gambar dari URL.');
      const blob = await response.blob();
      
      const objectUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `ruangriung-ai-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(objectUrl);
      
      toast.dismiss();
      toast.success('Gambar berhasil diunduh!');
    } catch (error: any) {
      toast.dismiss();
      toast.error(`Gagal mengunduh: ${error.message}`);
      console.error('Download error:', error);
    }
  };

  const handleDownload = async () => {
    if (typeof message.content === 'object' && message.content !== null && 'image_url' in message.content) {
      downloadImage(message.content.image_url.url);
    }
  };

  const ImageWithLoader = ({ src, alt, className, showDownload = false }: { src: string; alt: string; className?: string; showDownload?: boolean }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const getProxiedUrl = (url: string) => {
      if (url.includes('pollinations.ai/p/')) {
        const parts = url.split('/p/');
        const promptAndParams = parts[1];
        if (promptAndParams) {
          const [prompt, query] = promptAndParams.split('?');
          return `/api/pollinations/image?prompt=${prompt}${query ? '&' + query : ''}`;
        }
      }
      return url;
    };

    const imageUrl = getProxiedUrl(src);

    return (
      <span className="relative group my-2 block min-h-[200px]">
        {isLoading && (
          <span className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg flex flex-col items-center justify-center gap-2">
            <Bot className="text-primary-400 animate-bounce" size={32} />
            <span className="text-[10px] text-gray-500 uppercase tracking-widest animate-pulse">Memproses Visual...</span>
          </span>
        )}
        {hasError && (
          <span className="w-full min-h-[200px] bg-red-50 dark:bg-red-900/20 rounded-lg flex flex-col items-center justify-center p-4 text-center">
            <Bot className="text-red-400 mb-2" size={32} />
            <span className="text-xs text-red-500">Gagal memuat gambar. Silakan coba lagi.</span>
          </span>
        )}
        <img 
          src={imageUrl} 
          alt={alt} 
          className={`${className} ${isLoading ? 'opacity-0 h-0' : 'opacity-100 h-auto transition-opacity duration-500'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
        {!isLoading && !hasError && showDownload && (
          <button 
            onClick={() => downloadImage(imageUrl || '')}
            className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-primary-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md border border-primary-100"
            title="Unduh Gambar"
          >
            <Download size={16} />
          </button>
        )}
      </span>
    );
  };

  const renderContent = () => {
    if (typeof message.content === 'object' && message.content !== null && 'type' in message.content && message.content.type === 'image_url') {
      return (
        <div className="flex flex-col gap-2">
          <ImageWithLoader 
            src={message.content.image_url.url} 
            alt={message.content.text || "Generated AI image"} 
            className="rounded-lg max-w-full object-contain"
          />
          {message.content.text && <p className="text-sm italic opacity-80 mt-1">{message.content.text}</p>}
        </div>
      );
    }
    return (
      <ReactMarkdown 
        rehypePlugins={[rehypeHighlight]}
        components={{
          img: ({ src, alt }) => (
            <ImageWithLoader 
              src={src || ''} 
              alt={alt || 'image'} 
              className="rounded-lg max-w-full object-contain shadow-sm" 
              showDownload={true} 
            />
          )
        }}
      >
        {String(message.content)}
      </ReactMarkdown>
    );
  };

  return (
    <div className={`flex items-start gap-2 sm:gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-purple-100 overflow-hidden relative">
            <Image src="/logo.png" alt="RR" width={24} height={24} className="object-contain" />
        </div>

      <div className={`max-w-xl flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300`}>
        <div className={`break-words ${isAssistant 
          ? 'prose dark:prose-invert text-slate-700 dark:text-slate-300 glass shadow-md rounded-[1.5rem] p-4 sm:p-5' 
          : 'p-4 sm:p-5 rounded-[1.5rem] bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/20'}`}>
          {renderContent()}
        </div>
        
        {isAssistant && (
            <div className="flex items-center justify-end gap-2 mt-2">
                {typeof message.content === 'object' && message.content?.type === 'image_url' && (
                    <button onClick={handleDownload} className="p-1.5 text-gray-500 hover:text-purple-600 transition-colors" aria-label="Unduh Gambar">
                        <Download size={16} />
                    </button>
                )}
                <button onClick={handleCopy} className="p-1.5 text-gray-500 hover:text-purple-600 transition-colors" aria-label="Salin">
                    {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
                {onRegenerate && (
                    <button onClick={onRegenerate} className="p-1.5 text-gray-500 hover:text-purple-600 transition-colors" aria-label="Buat ulang">
                        <RefreshCw size={16} />
                    </button>
                )}
            </div>
        )}
      </div>

      {!isAssistant && (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-600 flex items-center justify-center text-white shrink-0">
              <User size={22} />
          </div>
      )}
    </div>
  );
};