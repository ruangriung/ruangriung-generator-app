// components/chatbot/ChatMessage.tsx
import { useState } from 'react';
import { Bot, User, Copy, Check, RefreshCw, Download } from 'lucide-react'; // Tambahkan ikon Download
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import toast from 'react-hot-toast';
import { Message } from './useChatManager';

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

  const handleDownload = async () => {
    if (typeof message.content !== 'object' || !('image_url' in message.content)) return;

    const imageUrl = message.content.image_url.url;
    toast.loading('Mempersiapkan unduhan...');

    try {
      // Fetch gambar sebagai blob untuk memastikan unduhan berjalan di semua browser
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Gagal mengambil data gambar dari URL.');
      const blob = await response.blob();
      
      const objectUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `ruangriung-ai-image-${Date.now()}.png`; // Nama file lebih deskriptif
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


  const renderContent = () => {
    if (typeof message.content === 'object' && message.content !== null && 'type' in message.content && message.content.type === 'image_url') {
      return (
        <div className="flex flex-col gap-2">
          <img 
            src={message.content.image_url.url} 
            alt={message.content.text || "Generated AI image"} 
            className="rounded-lg max-w-full object-contain"
          />
          {message.content.text && <p className="text-sm italic opacity-80 mt-1">{message.content.text}</p>}
        </div>
      );
    }
    return (
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {String(message.content)}
      </ReactMarkdown>
    );
  };

  return (
    <div className={`flex items-start gap-2 sm:gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
      {isAssistant && (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0">
            <Bot size={22} />
        </div>
      )}

      <div className={`max-w-xl flex flex-col`}>
        <div className={`break-words ${isAssistant ? 'prose dark:prose-invert text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 shadow-md rounded-xl p-3 sm:p-4' : 'p-3 sm:p-4 rounded-xl bg-purple-600 text-white shadow-md'}`}>
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