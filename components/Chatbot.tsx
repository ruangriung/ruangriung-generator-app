// components/Chatbot.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Trash2, Save, Paperclip, Loader, ChevronDown, Sparkles, X } from 'lucide-react';
import ButtonSpinner from './ButtonSpinner';
import toast from 'react-hot-toast';

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

export default function Chatbot() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('openai');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = sessions.find(s => s.id === activeSessionId);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        const savedSessions = localStorage.getItem('chatbot_sessions');
        if (savedSessions) setSessions(JSON.parse(savedSessions));
      } catch (error) { console.error("Gagal memuat sesi chat:", error); }
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) {
      if (sessions.length > 0) {
        if (!activeSessionId || !sessions.find(s => s.id === activeSessionId)) {
          setActiveSessionId(sessions[0].id);
        }
      } else {
        startNewChat();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, isMounted]);

  useEffect(() => {
    if (isMounted && sessions.length > 0) {
      localStorage.setItem('chatbot_sessions', JSON.stringify(sessions));
    }
  }, [sessions, isMounted]);

  useEffect(() => {
    const fetchTextModels = async () => {
      try {
        const response = await fetch('https://text.pollinations.ai/models');
        if (!response.ok) throw new Error('Gagal mengambil model');
        const data = await response.json();
        const validModels = Array.isArray(data) ? data : Object.keys(data);
        if (validModels.length > 0) {
          setModels(validModels);
          if (!validModels.includes(selectedModel)) setSelectedModel(validModels[0]);
        } else { throw new Error('Tidak ada model yang ditemukan'); }
      } catch (error) {
        console.error("Error fetching text models:", error);
        toast.error("Gagal memuat model AI. Menggunakan model default.");
        setModels(['openai', 'mistral', 'google']);
      }
    };
    fetchTextModels();
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);


  const startNewChat = () => {
    const newId = Date.now();
    const newSession: ChatSession = {
      id: newId,
      title: `Percakapan #${Math.floor(Math.random() * 1000)}`,
      messages: [],
      model: selectedModel,
    };
    // --- PERBAIKAN TIPE DI SINI ---
    setSessions((prev: ChatSession[]) => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || activeSessionId === null) return;

    const userMessage: Message = { role: 'user', content: input };
    
    // --- PERBAIKAN TIPE DI SINI ---
    setSessions((prev: ChatSession[]) =>
      prev.map((s: ChatSession) =>
        s.id === activeSessionId
          ? { ...s, messages: [...s.messages, userMessage] }
          : s
      )
    );
    setInput('');
    setIsLoading(true);

    const currentSession = sessions.find(s => s.id === activeSessionId);
    const messagesForApi = currentSession ? [...currentSession.messages, userMessage] : [userMessage];

    try {
        const response = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: selectedModel,
                messages: messagesForApi.map(({role, content}) => ({role, content})),
            }),
        });
        if (!response.ok) throw new Error('Respons jaringan tidak baik');

        const result = await response.json();
        const assistantMessage = result.choices[0].message;

        // --- PERBAIKAN TIPE DI SINI ---
        setSessions((prev: ChatSession[]) =>
            prev.map((s: ChatSession) =>
                s.id === activeSessionId ? { ...s, messages: [...s.messages, assistantMessage] } : s
            )
        );

    } catch (error) {
        console.error('Error:', error);
        toast.error('Gagal mendapatkan respons dari AI.');
        const errorMessage: Message = { role: 'assistant', content: 'Maaf, terjadi kesalahan. Silakan coba lagi.' };
        
        // --- PERBAIKAN TIPE DI SINI ---
        setSessions((prev: ChatSession[]) =>
            prev.map((s: ChatSession) =>
                s.id === activeSessionId ? { ...s, messages: [...s.messages, errorMessage] } : s
            )
        );
    } finally {
        setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (activeSessionId === null || !window.confirm("Yakin ingin menghapus semua pesan di chat ini?")) return;
    // --- PERBAIKAN TIPE DI SINI ---
    setSessions((prev: ChatSession[]) =>
        prev.map((s: ChatSession) => (s.id === activeSessionId ? { ...s, messages: [] } : s))
    );
    toast.success("Riwayat chat ini telah dihapus!");
  };
  
  const saveChat = () => {
    if (activeSessionId === null) return;
    toast.success("Chat disimpan secara otomatis!");
  }
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(file) {
          toast.success(`File "${file.name}" berhasil diunggah.`);
      }
  }
  
  if (!isMounted) {
    return (
      <div className="w-full p-6 md:p-8 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic flex justify-center items-center h-[75vh]">
        <ButtonSpinner/>
        <span className="ml-4 text-gray-600 dark:text-gray-300">Memuat Chat...</span>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic flex flex-col h-[75vh]">
        <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-gray-300 dark:border-gray-600">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 sm:mb-0">
                {activeChat?.title || "Chatbot"}
            </h2>
            <div className="flex items-center gap-2">
                <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="p-2 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset text-sm"
                    disabled={models.length === 0}
                >
                    {models.length > 0 ? models.map(m => <option key={m} value={m}>{m}</option>) : <option>Memuat...</option>}
                </select>
                <button onClick={startNewChat} className="p-2 rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button" title="Chat Baru">
                    <Sparkles size={20} />
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeChat?.messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0"><Bot size={20} /></div>}
                    <div className={`max-w-md p-3 rounded-lg break-words ${msg.role === 'user' ? 'bg-purple-600 text-white shadow-md' : 'bg-white dark:bg-gray-700 shadow-md'}`}>
                        <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                    </div>
                     {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white shrink-0"><User size={20} /></div>}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-300 dark:border-gray-600">
            <div className="relative">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    placeholder="Ketik pesan Anda di sini..."
                    className="w-full p-3 pr-28 rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset resize-none text-gray-800 dark:text-gray-200"
                    rows={2}
                    disabled={isLoading}
                />
                <div className="absolute bottom-2.5 right-3 flex items-center gap-2">
                    <label htmlFor="file-upload" className="cursor-pointer p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Unggah Gambar">
                        <Paperclip size={20} />
                        <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} accept="image/*"/>
                    </label>
                    <button type="submit" className="p-2 bg-purple-600 text-white rounded-full shadow-md" disabled={isLoading || !input.trim()}>
                       {isLoading ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
                    </button>
                </div>
            </div>
             <div className="flex justify-start gap-2 mt-2">
                <button type="button" onClick={clearChat} className="flex items-center gap-1 text-xs text-red-500 hover:underline"><Trash2 size={12}/> Hapus Chat</button>
                <button type="button" onClick={saveChat} className="flex items-center gap-1 text-xs text-gray-500 hover:underline"><Save size={12}/> Simpan Chat</button>
            </div>
        </form>
    </div>
  );
}