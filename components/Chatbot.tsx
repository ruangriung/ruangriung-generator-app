// components/Chatbot.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Trash2, Edit, Plus, MessageSquare, Loader, ChevronDown, Paperclip } from 'lucide-react';
import toast from 'react-hot-toast';

// Tipe data untuk pesan (bisa teks atau gambar)
interface Message {
  role: 'user' | 'assistant';
  content: string | { type: 'image_url'; image_url: { url: string }; text?: string };
}

// Tipe data untuk sesi chat
interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
  model: string;
}

export default function Chatbot() {
  const [sessions, setSessions] = useState<ChatSession[] | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRenaming, setIsRenaming] = useState<number | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('openai');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const activeChat = sessions?.find((s) => s.id === activeSessionId);

  // --- ALUR INISIALISASI STATE YANG AMAN ---
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('ruangriung_chatbot_sessions_v2');
      setSessions(savedSessions ? JSON.parse(savedSessions) : []);
    } catch (error) {
      console.error("Gagal memuat sesi:", error);
      setSessions([]);
    }
  }, []);

  useEffect(() => {
    if (sessions === null) return;
    if (sessions.length > 0) {
      if (!activeSessionId || !sessions.some(s => s.id === activeSessionId)) {
        setActiveSessionId(sessions[0].id);
      }
    } else {
      startNewChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions]);

  useEffect(() => {
    if (sessions !== null) {
      localStorage.setItem('ruangriung_chatbot_sessions_v2', JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (isRenaming !== null) renameInputRef.current?.focus();
  }, [isRenaming]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('https://text.pollinations.ai/models');
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        const textModels = ['openai', 'google', 'mistral', 'claude-opus', 'claude-sonnet', 'claude-haiku'];
        const visionModels = ['openai', 'openai-large', 'claude-hybridspace'];
        const allValid = [...new Set([...textModels, ...visionModels])];
        setModels(allValid);
      } catch (error) {
        console.error("Gagal memuat model:", error);
        setModels(['openai', 'mistral', 'google']);
      }
    };
    fetchModels();
  }, []);
  
  // --- FUNGSI-FUNGSI UTAMA ---
  const startNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now(),
      title: `Percakapan ${new Date().toLocaleTimeString('id-ID')}`,
      messages: [],
      model: selectedModel,
    };
    setSessions(prev => [newSession, ...(prev ?? [])]);
    setActiveSessionId(newSession.id);
  };

  const handleSelectSession = (id: number) => setActiveSessionId(id);

  const handleDeleteSession = (idToDelete: number) => {
    if (!window.confirm("Yakin ingin menghapus percakapan ini?")) return;
    setSessions(prev => prev!.filter(s => s.id !== idToDelete));
    toast.success("Percakapan dihapus.");
  };

  const deleteAllHistory = () => {
    if (!window.confirm("PERINGATAN: Semua riwayat chat akan dihapus. Lanjutkan?")) return;
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
    setInput(''); // Kosongkan input setelah pesan (teks/gambar) diproses
    
    // 1. Tambahkan pesan baru dari user ke state
    const updatedMessages = [...activeChat.messages, newMessage];
    setSessions(prev => prev!.map(s => s.id === activeSessionId ? { ...s, messages: updatedMessages } : s));

    // 2. Siapkan data untuk API
    const apiMessages = updatedMessages.map(msg => {
      if (typeof msg.content === 'string') {
        return { role: msg.role, content: msg.content };
      }
      return { role: msg.role, content: [{ type: 'text', text: msg.content.text || 'Analisis gambar ini.' }, msg.content] };
    });

    // 3. Panggil API
    try {
      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: selectedModel, messages: apiMessages, max_tokens: 1000 }),
      });
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      const result = await response.json();
      const assistantMessage: Message = result.choices[0].message;
      
      // 4. Tambahkan respons dari AI ke state
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

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const imageMessage: Message = {
        role: 'user',
        content: { type: 'image_url', image_url: { url: base64String }, text: input }
      };
      processAndSendMessage(imageMessage);
    };
  };

  if (sessions === null) {
    return <div className="w-full p-6 flex justify-center items-center h-[80vh]"><p>Memuat...</p></div>;
  }

  return (
    <div className="w-full flex h-[80vh] bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
      <aside className="w-1/4 min-w-[250px] p-4 border-r border-gray-300 dark:border-gray-700 flex flex-col">
        <button onClick={startNewChat} className="w-full flex items-center justify-center gap-2 p-3 mb-4 rounded-lg font-semibold text-gray-700 dark:text-gray-200 bg-light-bg dark:bg-dark-bg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset">
            <Plus size={18} /> Chat Baru
        </button>
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

      <main className="flex-1 flex flex-col">
        {activeChat ? (
            <>
            <header className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center"><h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{activeChat.title}</h2><select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="p-2 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset text-sm w-40">{models.map(m => <option key={m} value={m}>{m}</option>)}</select></header>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeChat.messages.map((msg, index) => (
                    <div key={`msg-${activeChat.id}-${index}`} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'assistant' && <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0"><Bot size={22} /></div>}
                        <div className={`max-w-xl p-4 rounded-xl break-words ${msg.role === 'user' ? 'bg-purple-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 shadow-md'}`}>
                            {typeof msg.content === 'string' ? <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p> : <div className="space-y-2"><p>{msg.content.text}</p><img src={msg.content.image_url.url} alt="Uploaded" className="max-w-xs rounded-lg"/></div> }
                        </div>
                        {msg.role === 'user' && <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white shrink-0"><User size={22} /></div>}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleTextSubmit} className="p-4 border-t border-gray-300 dark:border-gray-700">
                <div className="relative">
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleTextSubmit(e); }}} placeholder="Kirim pesan atau unggah gambar..." className="w-full p-4 pr-32 rounded-xl shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset resize-none" rows={2} disabled={isLoading} />
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <label htmlFor="image-upload" className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"><Paperclip size={24} /><input id="image-upload" type="file" className="hidden" onChange={handleFileUpload} accept="image/*"/></label>
                        <button type="submit" className="p-2.5 bg-purple-600 text-white rounded-full shadow-lg" disabled={isLoading || !input.trim()}><Send size={24} /></button>
                    </div>
                </div>
            </form>
            </>
        ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-gray-500"><MessageSquare size={48} /><p className="mt-4">Pilih atau buat percakapan baru.</p></div>
        )}
      </main>
    </div>
  );
}