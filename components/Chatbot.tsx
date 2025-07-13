// components/Chatbot.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Trash2, Edit, Plus, Menu, X, Paperclip, Loader, MessageSquare, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

// Definisikan tipe data untuk pesan dan sesi chat
interface Message {
  role: 'user' | 'assistant';
  content: string | { type: 'image_url'; image_url: { url: string }; text?: string };
}

interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
  model: string;
}

// Komponen untuk pesan loading
const LoadingMessage = () => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0"><Bot size={22} /></div>
    <div className="max-w-xl p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md flex items-center">
      <div className="dot-flashing"></div>
    </div>
  </div>
);

export default function Chatbot() {
  const [sessions, setSessions] = useState<ChatSession[] | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState<number | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [models, setModels] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const activeChat = sessions?.find((s) => s.id === activeSessionId);

  // --- ALUR INISIALISASI ---
  useEffect(() => {
    let initialSessions: ChatSession[] = [];
    try {
      const saved = localStorage.getItem('ruangriung_chatbot_sessions_v3');
      if (saved) {
        initialSessions = JSON.parse(saved);
      }
    } catch (error) {
      console.error("Gagal memuat sesi:", error);
    }
    
    if (initialSessions.length === 0) {
      const newSession: ChatSession = {
        id: Date.now(),
        title: `Percakapan Baru`,
        messages: [],
        model: 'openai',
      };
      initialSessions.push(newSession);
    }
    
    setSessions(initialSessions);
    setActiveSessionId(initialSessions[0].id);
  }, []);

  useEffect(() => {
    if (sessions !== null) {
      localStorage.setItem('ruangriung_chatbot_sessions_v3', JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (isRenaming !== null) renameInputRef.current?.focus();
  }, [isRenaming]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  // --- PERBAIKAN LOGIKA FETCH MODEL DI SINI ---
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('https://text.pollinations.ai/models');
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        let extractedModels: string[] = [];

        if (Array.isArray(data)) {
          extractedModels = data.map(item => {
            if (typeof item === 'string') return item;
            if (typeof item === 'object' && item !== null && (item.id || item.name)) return item.id || item.name;
            return null;
          }).filter(Boolean) as string[];
        } else if (typeof data === 'object' && data !== null) {
          extractedModels = Object.keys(data);
        }

        const validModels = extractedModels.filter(m => typeof m === 'string' && m.length > 0 && !m.includes('audio'));

        if (validModels.length > 0) {
          setModels(validModels);
          if (activeChat && !validModels.includes(activeChat.model)) {
            setSessions(prev => prev!.map(s => s.id === activeSessionId ? {...s, model: validModels[0]} : s));
          }
        } else {
          throw new Error("Tidak ada model teks valid yang ditemukan");
        }
      } catch (error) {
        console.error("Gagal memuat model:", error);
        toast.error("Gagal memuat model AI. Menggunakan default.");
        setModels(['openai', 'mistral', 'google']);
      }
    };
    fetchModels();
  }, [activeChat, activeSessionId]); // Tambahkan dependensi
  
  // --- FUNGSI-FUNGSI UTAMA ---
  const startNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now(),
      title: `Percakapan ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
      messages: [],
      model: activeChat?.model || 'openai',
    };
    setSessions(prev => [newSession, ...(prev ?? [])]);
    setActiveSessionId(newSession.id);
    setIsSidebarOpen(false);
  };
  
  const handleSelectSession = (id: number) => {
      setActiveSessionId(id);
      setIsSidebarOpen(false);
  };

  const handleDeleteSession = (idToDelete: number) => {
      if (!window.confirm("Yakin ingin menghapus percakapan ini?")) return;
      setSessions(prev => {
        const newSessions = prev!.filter(s => s.id !== idToDelete);
        if(newSessions.length === 0) {
            startNewChat();
        } else if (activeSessionId === idToDelete) {
            setActiveSessionId(newSessions[0].id);
        }
        return newSessions;
      });
      toast.success("Percakapan dihapus.");
  };
  
  const deleteAllHistory = () => {
    if (!window.confirm("PERINGATAN: Semua riwayat akan dihapus. Lanjutkan?")) return;
    setSessions([]);
    setActiveSessionId(null);
  };

  const handleRename = (session: ChatSession) => {
    setIsRenaming(session.id);
    setRenameInput(session.title);
  };
  
  const handleSaveRename = (idToRename: number) => {
    if (!renameInput.trim()) { toast.error("Judul tidak boleh kosong."); return; }
    setSessions(prev => prev!.map(s => s.id === idToRename ? { ...s, title: renameInput } : s));
    setIsRenaming(null);
  };
  
  const processAndSendMessage = async (newMessage: Message) => {
    if (isLoading || !activeChat) return;

    setIsLoading(true);
    setInput('');
    
    const updatedMessages = [...activeChat.messages, newMessage];
    setSessions(prev => prev!.map(s => s.id === activeSessionId ? { ...s, messages: updatedMessages } : s));

    const apiMessages = updatedMessages.map(msg => {
      if (typeof msg.content === 'string') {
        return { role: msg.role, content: msg.content };
      }
      return { role: msg.role, content: [{ type: 'text', text: msg.content.text || 'Analisis gambar ini.' }, { type: 'image_url', image_url: msg.content.image_url }] };
    });

    try {
      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: activeChat.model, messages: apiMessages, max_tokens: 1000 }),
      });
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      const result = await response.json();
      const assistantMessage: Message = result.choices[0].message;
      
      setSessions(prev => prev!.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, assistantMessage] } : s));
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal mendapatkan respons dari AI.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTextSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      processAndSendMessage({ role: 'user', content: input });
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
      const imageMessage: Message = {
        role: 'user',
        content: { type: 'image_url', image_url: { url: base64String }, text: input || `Analisis gambar ini.` }
      };
      processAndSendMessage(imageMessage);
    };
    reader.onerror = () => {
        toast.dismiss();
        toast.error("Gagal membaca file gambar.");
    }
  };

  if (sessions === null) {
    return <div className="w-full p-6 flex justify-center items-center h-[80vh] bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic"><Loader className="animate-spin" /><span className="ml-4 text-gray-600 dark:text-gray-300">Memuat...</span></div>;
  }

  const formElementStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-gray-800 dark:text-gray-200";

  return (
    <div className="w-full flex h-[80vh] bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic overflow-hidden relative">
      <aside className={`absolute top-0 left-0 h-full z-20 md:static md:z-auto w-full md:w-1/4 md:min-w-[280px] p-4 border-r border-gray-300 dark:border-gray-700 flex flex-col bg-light-bg dark:bg-dark-bg transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex justify-between items-center mb-4"><button onClick={startNewChat} className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-semibold text-gray-700 dark:text-gray-200 bg-light-bg dark:bg-dark-bg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset"><Plus size={18} /> Chat Baru</button><button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-2 p-2"><X size={20}/></button></div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {sessions.map(session => (
                <div key={session.id} onClick={() => handleSelectSession(session.id)} className={`p-2 rounded-lg cursor-pointer group ${activeSessionId === session.id ? 'bg-purple-100 dark:bg-purple-900/50' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                    {isRenaming === session.id ? ( <input ref={renameInputRef} type="text" value={renameInput} onChange={e => setRenameInput(e.target.value)} onBlur={() => handleSaveRename(session.id)} onKeyDown={e => e.key === 'Enter' && handleSaveRename(session.id)} className="w-full bg-transparent text-sm font-medium focus:outline-none"/>
                    ) : ( <div className="flex justify-between items-center"><p className="text-sm text-gray-700 dark:text-gray-300 truncate">{session.title}</p><div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={(e) => { e.stopPropagation(); handleRename(session); }} className="p-1 hover:text-purple-600"><Edit size={14}/></button><button onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id); }} className="p-1 hover:text-red-500"><Trash2 size={14}/></button></div></div> )}
                </div>
            ))}
        </div>
        <div className="pt-4 border-t border-gray-300 dark:border-gray-600">
            <button onClick={deleteAllHistory} className="w-full flex items-center justify-center gap-2 p-2 text-sm text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg">
                <Trash2 size={16} /> Hapus Semua Riwayat
            </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full">
        {activeChat ? (
            <>
            <header className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center gap-4"><button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2"><Menu size={20}/></button><h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate flex-1">{activeChat.title}</h2></header>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeChat.messages.map((msg, index) => (
                    <div key={`msg-${activeChat.id}-${index}`} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'assistant' && <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0"><Bot size={22} /></div>}
                        <div className={`max-w-xl p-4 rounded-xl break-words ${msg.role === 'user' ? 'bg-purple-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 shadow-md'}`}>
                          {typeof msg.content === 'string' ? <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p> : <div className="space-y-2"><p>{msg.content.text}</p><img src={msg.content.image_url.url} alt="Uploaded by user" className="max-w-xs rounded-lg"/></div> }
                        </div>
                        {msg.role === 'user' && <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white shrink-0"><User size={22} /></div>}
                    </div>
                ))}
                {isLoading && <LoadingMessage />}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-300 dark:border-gray-700 space-y-4">
                <div className="flex items-center gap-4">
                    <label htmlFor="model-select" className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300"><Cpu size={16}/> Model:</label>
                    <select id="model-select" value={activeChat.model} onChange={(e) => setSessions(prev => prev!.map(s => s.id === activeSessionId ? {...s, model: e.target.value} : s))} className={`${formElementStyle} flex-1 text-sm appearance-none`}>{models.map(m => <option key={m} value={m}>{m}</option>)}</select>
                </div>
                <form onSubmit={handleTextSubmit}>
                    <div className="relative">
                        <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTextSubmit(e); }}} placeholder="Kirim pesan atau unggah gambar..." className={`${formElementStyle} pr-24 resize-none`} rows={1} disabled={isLoading} />
                        <div className="absolute bottom-3 right-3 flex items-center gap-1">
                            <label htmlFor="image-upload" className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"><Paperclip size={24} /><input id="image-upload" type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={isLoading}/></label>
                            <button type="submit" className="p-2.5 bg-purple-600 text-white rounded-full shadow-lg disabled:bg-purple-400" disabled={isLoading || !input.trim()}><Send size={24} /></button>
                        </div>
                    </div>
                </form>
            </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-gray-500"><MessageSquare size={48} /><p className="mt-4">Pilih atau buat percakapan baru.</p></div>
        )}
      </main>
    </div>
  );
}