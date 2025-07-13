// components/chatbot/ChatInput.tsx
import { useState, useRef, useEffect } from 'react';
import { Send, StopCircle, Paperclip } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatInputProps {
  isLoading: boolean;
  onSendMessage: (message: any) => void;
  onStop: () => void;
}

export const ChatInput = ({ isLoading, onSendMessage, onStop }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage({ role: 'user', content: input });
    setInput('');
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.loading("Memproses gambar...");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      toast.dismiss();
      const base64String = reader.result as string;
      const imageMessage = {
        role: 'user',
        content: { type: 'image_url', image_url: { url: base64String }, text: input || `Analisis gambar ini.` }
      };
      onSendMessage(imageMessage);
      setInput('');
    };
    reader.onerror = () => {
        toast.dismiss();
        toast.error("Gagal membaca file gambar.");
    }
  };


  const formElementStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-gray-800 dark:text-gray-200";

  return (
    <div className="p-2 sm:p-4 border-t border-gray-300 dark:border-gray-700">
      {isLoading && (
        <div className="flex justify-center mb-2">
            <button onClick={onStop} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-100 dark:bg-red-900/50 rounded-lg shadow-md">
                <StopCircle size={16} /> Hentikan Proses
            </button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea 
             ref={textareaRef}
             value={input} 
             onChange={(e) => setInput(e.target.value)} 
             onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }}} 
             placeholder="Kirim pesan atau unggah gambar..." 
             // --- PERBAIKAN: Padding kanan dikurangi di mobile ---
             className={`${formElementStyle} pr-20 sm:pr-24 resize-none overflow-y-auto`} 
             rows={1} 
             disabled={isLoading} 
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <label htmlFor="image-upload" className="p-2 sm:p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer" aria-label="Unggah Gambar">
                  {/* --- PERBAIKAN: Ukuran ikon responsif --- */}
                  <Paperclip size={20} />
                  <input id="image-upload" type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={isLoading} />
              </label>
              <button type="submit" className="p-2 sm:p-2.5 bg-purple-600 text-white rounded-full shadow-lg disabled:bg-purple-400" disabled={isLoading || !input.trim()} aria-label="Kirim">
                  {/* --- PERBAIKAN: Ukuran ikon responsif --- */}
                  <Send size={20} />
              </button>
          </div>
        </div>
      </form>
    </div>
  );
};