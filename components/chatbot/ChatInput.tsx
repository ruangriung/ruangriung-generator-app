// components/chatbot/ChatInput.tsx
import { useRef, useEffect } from 'react';
import { Send, StopCircle, Paperclip, Expand } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatInputProps {
  isLoading: boolean;
  onSendMessage: (message: any) => void;
  onStop: () => void;
  onExpand: () => void;
  value: string;
  onValueChange: (value: string) => void;
}

export const ChatInput = ({ 
  isLoading, 
  onSendMessage, 
  onStop, 
  onExpand,
  value,
  onValueChange
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; 
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSendMessage({ role: 'user', content: value });
    onValueChange('');
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
        content: { type: 'image_url', image_url: { url: base64String }, text: value || `Analisis gambar ini.` }
      };
      onSendMessage(imageMessage);
      onValueChange('');
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
             id="chat-input-textarea" // ID ditambahkan untuk fokus
             ref={textareaRef}
             value={value}
             onChange={(e) => onValueChange(e.target.value)}
             onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }}} 
             placeholder="Kirim pesan atau unggah gambar..." 
             // --- PERBAIKAN UTAMA DI SINI ---
             // Padding kanan (pr) ditambah agar tombol tidak tertutup
             className={`${formElementStyle} pr-32 sm:pr-36 resize-none overflow-y-auto`} 
             rows={1} 
             disabled={isLoading} 
          />
          <div className="absolute top-2 right-2 flex gap-x-1">
            <button type="button" onClick={onExpand} className="p-1.5 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Perbesar Textarea">
              <Expand size={18} />
            </button>
          </div>
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <label htmlFor="image-upload" className="p-2 sm:p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer" aria-label="Unggah Gambar">
                  <Paperclip size={20} className="text-gray-600 dark:text-gray-300" />
                  <input id="image-upload" type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={isLoading} />
              </label>
              <button type="submit" className="p-2 sm:p-2.5 bg-purple-600 text-white rounded-full shadow-lg disabled:bg-purple-400" disabled={isLoading || !value.trim()} aria-label="Kirim">
                  <Send size={20} />
              </button>
          </div>
        </div>
      </form>
    </div>
  );
};