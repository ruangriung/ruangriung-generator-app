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
    <div className="w-full">
      {isLoading && (
        <div className="flex justify-center mb-4 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={onStop} 
              className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
            >
                <StopCircle size={16} /> Hentikan Proses
            </button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea 
             id="chat-input-textarea" 
             ref={textareaRef}
             value={value}
             onChange={(e) => onValueChange(e.target.value)}
             onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }}} 
             placeholder="Kirim pesan atau unggah gambar..." 
             className="w-full p-4 glass-inset !rounded-[1.5rem] pr-32 sm:pr-40 resize-none overflow-y-auto text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary-500 transition-all border-2 border-slate-200 dark:border-white/10" 
             rows={1} 
             disabled={isLoading} 
          />
          <div className="absolute top-2 right-2 flex gap-x-1">
            <button type="button" onClick={onExpand} className="p-2 text-slate-400 hover:text-primary-500 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all" title="Perbesar Textarea">
              <Expand size={18} />
            </button>
          </div>
          <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
              <label htmlFor="image-upload" className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-primary-500 cursor-pointer transition-all" aria-label="Unggah Gambar">
                  <Paperclip size={20} />
                  <input id="image-upload" type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={isLoading} />
              </label>
              <button type="submit" className="p-2.5 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/20 hover:bg-primary-500 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all" disabled={isLoading || !value.trim()} aria-label="Kirim">
                  <Send size={20} />
              </button>
          </div>
        </div>
      </form>
    </div>
  );
};