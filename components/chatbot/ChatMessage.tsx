// components/chatbot/ChatMessage.tsx
import { useState } from 'react';
import { Bot, User, Copy, Check, RefreshCw } from 'lucide-react';
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
    
    if (typeof message.content === 'object' && message.content.text) {
      textToCopy = message.content.text;
    } else if (typeof message.content === 'string') {
      textToCopy = message.content;
    }
    
    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        toast.success("Teks berhasil disalin!");
        setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const renderContent = () => {
    // Pengecekan tipe yang aman untuk pesan gambar
    if (typeof message.content === 'object' && message.content !== null && 'type' in message.content && message.content.type === 'image_url') {
      return (
        <div className="flex flex-col gap-2">
          <img 
            src={message.content.image_url.url} 
            alt="Uploaded content" 
            className="rounded-lg max-w-xs object-contain"
          />
          {message.content.text && <p>{message.content.text}</p>}
        </div>
      );
    }

    // --- PERBAIKAN UTAMA DI SINI ---
    // Jika bukan objek gambar, kita pastikan itu adalah string sebelum diberikan ke ReactMarkdown
    return (
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {String(message.content)}
      </ReactMarkdown>
    );
    // --- AKHIR PERBAIKAN ---
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