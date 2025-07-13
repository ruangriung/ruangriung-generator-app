// components/Chatbot.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, User, MessageSquare, Send, Trash2, Edit, Plus, Menu, X, Paperclip, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

// Definisikan tipe data untuk pesan dan sesi chat
interface Message {
  role: 'user' | 'assistant';
  content: string;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const activeChat = sessions?.find((s) => s.id === activeSessionId);

  // --- ALUR INISIALISASI YANG DISEMPURNAKAN ---
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
    setIsSidebarOpen(false); // Tutup sidebar di mobile setelah membuat chat baru
  };
  
  const handleSelectSession = (id: number) => {
      setActiveSessionId(id);
      setIsSidebarOpen(false); // Tutup sidebar di mobile saat memilih chat
  };

  const handleDeleteSession = (idToDelete: number) => {
      if (!window.confirm("Yakin ingin menghapus percakapan ini?")) return;
      setSessions(prev => prev!.filter(s => s.id !== idToDelete));
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
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !activeChat) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...activeChat.messages, userMessage];

    setSessions(prev => prev!.map(s => s.id === activeSessionId ? { ...s, messages: updatedMessages } : s));
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = updatedMessages.map(msg => ({ role: msg.role, content: msg.content as string }));
      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: activeChat.model, messages: apiMessages }),
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

  if (sessions === null) {
    return (
      <div className="w-full p-6 flex justify-center items-center h-[80vh] bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
        <Loader className="animate-spin" />
        <span className="ml-4 text-gray-600 dark:text-gray-300">Memuat Sesi Chat...</span>
      </div>
    );
  }

  return (
    <div className="w-full flex h-[80vh] bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic overflow-hidden relative">
      {/* Sidebar untuk Riwayat Chat */}
      <aside className={`absolute top-0 left-0 h-full z-20 md:static md:z-auto w-full md:w-1/4 md:min-w-[280px] p-4 border-r border-gray-300 dark:border-gray-700 flex flex-col bg-light-bg dark:bg-dark-bg transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex justify-between items-center mb-4">
          <button onClick={startNewChat} className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-semibold text-gray-700 dark:text-gray-200 bg-light-bg dark:bg-dark-bg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset">
              <Plus size={18} /> Chat Baru
          </button>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-2 p-2"><X size={20}/></button>
        </div>
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

      {/* Panel Chat Utama */}
      <main className="flex-1 flex flex-col h-full">
        {activeChat ? (
            <>
            <header className="p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
                <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mr-2 p-2"><Menu size={20}/></button>
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">{activeChat.title}</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeChat.messages.map((msg, index) => (
                    <div key={`msg-${activeChat.id}-${index}`} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'assistant' && <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0"><Bot size={22} /></div>}
                        <div className={`max-w-xl p-4 rounded-xl break-words ${msg.role === 'user' ? 'bg-purple-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 shadow-md'}`}>
                          <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content as string}</p>
                        </div>
                        {msg.role === 'user' && <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white shrink-0"><User size={22} /></div>}
                    </div>
                ))}
                {isLoading && <LoadingMessage />}
                <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-300 dark:border-gray-700">
                <div className="relative">
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }}} placeholder="Kirim pesan..." className="w-full p-4 pr-16 rounded-xl shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset resize-none" rows={1} disabled={isLoading} />
                    <button type="submit" className="absolute bottom-3 right-3 p-2.5 bg-purple-600 text-white rounded-full shadow-lg disabled:bg-purple-400" disabled={isLoading || !input.trim()}><Send size={24} /></button>
                </div>
            </form>
            </>
        ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-gray-500">
                <MessageSquare size={48} /><p className="mt-4">Pilih atau buat percakapan baru.</p>
            </div>
        )}
      </main>
    </div>
  );
}