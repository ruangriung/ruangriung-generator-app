'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export interface Message {
  role: 'user' | 'assistant';
  content: string | { type: 'image_url'; image_url: { url: string }; text?: string };
}

export interface ChatSession {
  id: number;
  title: string;
  messages: Message[];
  model: string;
}

interface ChatContextType {
  sessions: ChatSession[] | null;
  setSessions: React.Dispatch<React.SetStateAction<ChatSession[] | null>>;
  activeSessionId: number | null;
  setActiveSessionId: React.Dispatch<React.SetStateAction<number | null>>;
  activeChat: ChatSession | undefined;
  isLoading: boolean;
  models: string[];
  processAndSendMessage: (newMessage: Message) => Promise<void>;
  startNewChat: () => void;
  stopGenerating: () => void;
  regenerateResponse: () => void;
  deleteAllSessions: () => void;
  setModelForImage: () => void;
  isAssistantOpen: boolean;
  setIsAssistantOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pendingPrompt: string | null;
  setPendingPrompt: React.Dispatch<React.SetStateAction<string | null>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[] | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<string[]>(['openai', 'gemini-fast', 'deepseek', 'grok']);
  const [isMounted, setIsMounted] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeChat = sessions?.find((s) => s.id === activeSessionId);

  const saveSessionsToLocalStorage = (sessionsToSave: ChatSession[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('ruangriung_chatbot_sessions_v3', JSON.stringify(sessionsToSave));
    } catch (error: any) {
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        toast("Penyimpanan penuh, sesi terlama akan dihapus.", { icon: '⚠️' });
        const prunedSessions = sessionsToSave.slice(0, -1);
        if (prunedSessions.length > 0) {
          saveSessionsToLocalStorage(prunedSessions);
          setSessions(prunedSessions);
        } else {
          localStorage.removeItem('ruangriung_chatbot_sessions_v3');
        }
      }
    }
  };

  useEffect(() => {
    setIsMounted(true);
    let initialSessions: ChatSession[] = [];
    try {
      const saved = localStorage.getItem('ruangriung_chatbot_sessions_v3');
      if (saved) initialSessions = JSON.parse(saved);
    } catch (error) {
      console.error("Gagal memuat sesi:", error);
    }

    if (initialSessions.length === 0) {
      const newSession: ChatSession = { id: Date.now(), title: `Percakapan Baru`, messages: [], model: 'gemini-fast' };
      initialSessions.push(newSession);
    }

    setSessions(initialSessions);
    setActiveSessionId(initialSessions[0].id);
  }, []);

  useEffect(() => {
    if (isMounted && sessions !== null) {
      saveSessionsToLocalStorage(sessions);
    }
  }, [sessions, isMounted]);

  useEffect(() => {
    const fetchAndSetModels = async () => {
      try {
        const responseText = await fetch('/api/pollinations/models/text');
        if (!responseText.ok) throw new Error('Gagal ambil model.');
        const textModels = await responseText.json();
        const availableModels = ["Flux", "gptimage", ...textModels.map((m: any) => typeof m === 'string' ? m : m.name), "openai", "gemini-fast"];
        setModels([...new Set(availableModels)]);
      } catch (error) {
        setModels(["Flux", "gptimage", "openai", "gemini-fast", "deepseek", "grok"]);
      }
    };
    if (isMounted) fetchAndSetModels();
  }, [isMounted]);

  const updateMessages = (sessionId: number, updater: (prevMessages: Message[]) => Message[]) => {
    setSessions(prev =>
      prev ? prev.map(s => s.id === sessionId ? { ...s, messages: updater(s.messages) } : s) : null
    );
  };

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now() + Math.random(),
      title: `Percakapan ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
      messages: [],
      model: activeChat?.model || 'gemini-fast',
    };
    setSessions(prev => [newSession, ...(prev ?? [])]);
    setActiveSessionId(newSession.id);
  };

  const deleteAllSessions = () => {
    if (window.confirm("Hapus semua riwayat?")) {
      const newSession: ChatSession = { id: Date.now(), title: `Percakapan Baru`, messages: [], model: 'gemini-fast' };
      setSessions([newSession]);
      setActiveSessionId(newSession.id);
      toast.success("Riwayat dihapus.");
    }
  };

  const setModelForImage = () => {
    if (activeChat) {
      setSessions(prev => prev!.map(s => s.id === activeChat.id ? { ...s, model: 'Flux' } : s));
      toast('Mode Gambar Aktif!', { icon: '🎨' });
    }
  };

  const processAndSendMessage = async (newMessage: Message) => {
    if (isLoading || !activeChat) return;
    const currentActiveChatId = activeChat.id;
    updateMessages(currentActiveChatId, prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const isImageUpload = typeof newMessage.content === 'object' && newMessage.content.type === 'image_url';
      const isImageGenerationMode = ['Flux', 'gptimage', 'zimage'].includes(activeChat.model);

      const systemPrompt = {
        role: 'system',
        content: `Anda adalah RR AGENT, asisten virtual cerdas yang mewakili RuangRiung AI Generator. 
Motto RuangRiung: "Dari sebuah gambar terjalin sebuah persahabatan".

Tugas Utama Anda:
1. Membantu pengguna memaksimalkan alat AI di RuangRiung (Image, Video, Audio, dan Chatbot).
2. Memberikan inspirasi kreatif, tutorial singkat, dan tips pembuatan konten AI.
3. Memperkenalkan visi RuangRiung sebagai wadah inspirasi kreatif yang lahir dari kolaborasi komunitas.

Identitas RuangRiung:
- Founder & CEO: Koko Ajeeb.
- Asal: Komunitas grup Facebook RuangRiung.
- Semangat: Ramah, kolaboratif, mandiri dalam berkarya, dan "gila sehat" dalam berkreasi.

Nada Bicara:
Ramah, solutif, hangat seperti teman karib, namun tetap profesional. Gunakan Bahasa Indonesia yang luwes dan santai namun sopan.

Pengetahuan Fitur:
- Generator Gambar: Menggunakan model Flux dan gptimage.
- Generator Teks: Mendukung model OpenAI, Gemini, DeepSeek, Grok, dll.
- Anda terintegrasi secara global sebagai RR AGENT (floating assistant).

Catatan Khusus:
- Selalu sebutkan RuangRiung dengan bangga.
- Ajak pengguna bergabung ke Grup Facebook RuangRiung jika mereka ingin berinteraksi lebih dalam dengan komunitas.
- Jika ditanya siapa Anda, jawablah Anda adalah asisten resmi RuangRiung.`
      };

      if (isImageUpload) {
        const content = newMessage.content as any;
        const response = await fetch('/api/pollinations/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'openai',
            messages: [
              systemPrompt,
              { role: 'user', content: [{ type: 'image_url', image_url: { url: content.image_url.url } }, { type: 'text', text: content.text || 'Jelaskan gambar ini.' }] }
            ]
          }),
        });
        const reply = await response.text();
        updateMessages(currentActiveChatId, prev => [...prev, { role: 'assistant', content: reply }]);
      } else if (isImageGenerationMode) {
        const promptText = newMessage.content as string;
        const imageUrl = `/api/pollinations/image?model=${activeChat.model}&prompt=${encodeURIComponent(promptText)}&seed=${Math.random()}`;
        updateMessages(currentActiveChatId, prev => [...prev, {
          role: 'assistant',
          content: { type: 'image_url', image_url: { url: imageUrl }, text: `Gambar untuk: "${promptText}"` }
        }]);
      } else {
        const response = await fetch('/api/pollinations/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: activeChat.model,
            messages: [
              systemPrompt,
              ...activeChat.messages, newMessage
            ].map(m => ({
              role: m.role,
              content: typeof m.content === 'string' ? m.content : (m.content as any).text || ''
            }))
          })
        });
        const reply = await response.text();
        updateMessages(currentActiveChatId, prev => [...prev, { role: 'assistant', content: reply }]);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{
      sessions, setSessions, activeSessionId, setActiveSessionId,
      activeChat, isLoading, models, processAndSendMessage, startNewChat,
      stopGenerating: () => {}, regenerateResponse: () => {}, deleteAllSessions,
      setModelForImage,
      isAssistantOpen, setIsAssistantOpen,
      pendingPrompt, setPendingPrompt
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
