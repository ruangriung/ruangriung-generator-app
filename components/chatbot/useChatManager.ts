// components/chatbot/useChatManager.ts
import { useState, useEffect, useRef } from 'react';
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

export const useChatManager = () => {
  const [sessions, setSessions] = useState<ChatSession[] | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeChat = sessions?.find((s) => s.id === activeSessionId);

  // Fungsi untuk menyimpan sesi dengan penanganan error kuota
  const saveSessionsToLocalStorage = (sessionsToSave: ChatSession[]) => {
    try {
      localStorage.setItem('ruangriung_chatbot_sessions_v3', JSON.stringify(sessionsToSave));
    } catch (error: any) {
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.warn("Penyimpanan lokal penuh. Menghapus sesi terlama...");
        
        // --- PERBAIKAN DI SINI ---
        // Mengganti toast.warn dengan toast() dan ikon kustom
        toast("Penyimpanan penuh, sesi terlama akan dihapus.", {
          duration: 4000,
          icon: '⚠️',
        });
        // --- AKHIR PERBAIKAN ---
        
        // Hapus sesi paling lama (yang ada di akhir array)
        const prunedSessions = sessionsToSave.slice(0, -1);
        
        // Coba simpan lagi setelah menghapus satu sesi
        if (prunedSessions.length > 0) {
          saveSessionsToLocalStorage(prunedSessions);
          // Perbarui state aplikasi dengan sesi yang sudah dihapus
          setSessions(prunedSessions);
        } else {
            console.error("Tidak bisa menyimpan bahkan setelah menghapus sesi. Semua sesi dihapus.");
            localStorage.removeItem('ruangriung_chatbot_sessions_v3');
        }
      } else {
        console.error("Gagal menyimpan sesi ke localStorage:", error);
      }
    }
  };

  useEffect(() => {
    let initialSessions: ChatSession[] = [];
    try {
      const saved = localStorage.getItem('ruangriung_chatbot_sessions_v3');
      if (saved) initialSessions = JSON.parse(saved);
    } catch (error) {
      console.error("Gagal memuat sesi:", error);
    }
    
    if (initialSessions.length === 0) {
      const newSession: ChatSession = { id: Date.now(), title: `Percakapan Baru`, messages: [], model: 'openai' };
      initialSessions.push(newSession);
    }
    
    setSessions(initialSessions);
    setActiveSessionId(initialSessions[0].id);
  }, []);

  useEffect(() => {
    if (sessions !== null) {
      saveSessionsToLocalStorage(sessions);
    }
  }, [sessions]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('https://text.pollinations.ai/models');
        if (!res.ok) throw new Error('API request failed');
        const data = await res.json();
        let extractedModels: string[] = [];

        if (Array.isArray(data)) {
          extractedModels = data.map(item => (typeof item === 'string' ? item : (item?.id || item?.name))).filter(Boolean) as string[];
        } else if (typeof data === 'object' && data !== null) {
          extractedModels = Object.keys(data);
        }

        const validModels = extractedModels.filter(m => typeof m === 'string' && m.length > 0 && !m.includes('audio'));
        if (validModels.length > 0) setModels(validModels);
        else throw new Error("Tidak ada model teks valid yang ditemukan");

      } catch (error) {
        console.error("Gagal memuat model:", error);
        setModels(['openai', 'mistral', 'google']); // Fallback
      }
    };
    fetchModels();
  }, []);

  const updateMessages = (sessionId: number, updater: (prevMessages: Message[]) => Message[]) => {
    setSessions(prev => 
      prev!.map(s => s.id === sessionId ? { ...s, messages: updater(s.messages) } : s)
    );
  };

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now() + Math.random(),
      title: `Percakapan ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
      messages: [],
      model: activeChat?.model || 'openai',
    };
    setSessions(prev => [newSession, ...(prev ?? [])]);
    setActiveSessionId(newSession.id);
  };

  const deleteAllSessions = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua riwayat percakapan? Tindakan ini tidak dapat diurungkan.")) {
        const newSession: ChatSession = {
            id: Date.now() + Math.random(),
            title: `Percakapan Baru`,
            messages: [],
            model: activeChat?.model || 'openai',
        };
        setSessions([newSession]);
        setActiveSessionId(newSession.id);
        toast.success("Semua riwayat percakapan telah dihapus.");
    }
  };
  
  const processAndSendMessage = async (newMessage: Message) => {
    if (isLoading || !activeChat) return;

    setIsLoading(true);
    abortControllerRef.current = new AbortController();
    
    updateMessages(activeChat.id, prevMessages => [...prevMessages, newMessage]);

    const assistantMessagePlaceholder: Message = { role: 'assistant', content: '' };
    updateMessages(activeChat.id, prevMessages => [...prevMessages, assistantMessagePlaceholder]);
    
    const apiMessages = [...activeChat.messages, newMessage].map(msg => {
      if (typeof msg.content === 'string') {
        return { role: msg.role, content: msg.content };
      }
      return { role: msg.role, content: [{ type: 'text', text: msg.content.text || 'Analisis gambar ini.' }, { type: 'image_url', image_url: msg.content.image_url }] };
    });

    try {
      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            model: activeChat.model, 
            messages: apiMessages, 
            max_tokens: 2000,
            stream: true
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      if (!response.body) throw new Error("Response body tidak tersedia untuk streaming.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const jsonString = line.substring(6);
                if (jsonString === '[DONE]') break;
                
                try {
                    const parsed = JSON.parse(jsonString);
                    const textChunk = parsed.choices?.[0]?.delta?.content || '';
                    if (textChunk) {
                        fullResponse += textChunk;
                        updateMessages(activeChat.id, prevMessages => {
                           const newMessages = [...prevMessages];
                           newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], content: fullResponse };
                           return newMessages;
                        });
                    }
                } catch (e) {
                    // Abaikan baris yang bukan JSON valid
                }
            }
        }
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        toast.success('Pembuatan respons dihentikan.');
        updateMessages(activeChat.id, prevMessages => {
           const newMessages = [...prevMessages];
           const lastMessageContent = newMessages[newMessages.length - 1].content;
           newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], content: lastMessageContent + '\n\n*Respons dihentikan oleh pengguna.*' };
           return newMessages;
        });
      } else {
        console.error('Error:', error);
        toast.error('Gagal mendapatkan respons dari AI.');
         updateMessages(activeChat.id, prevMessages => {
           const newMessages = [...prevMessages];
           newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], content: '*Maaf, terjadi kesalahan.*' };
           return newMessages;
        });
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const stopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const regenerateResponse = () => {
      if (!activeChat || activeChat.messages.length === 0) return;
      
      const lastAssistantMessageIndex = activeChat.messages.map(m => m.role).lastIndexOf('assistant');
      if (lastAssistantMessageIndex === -1) return;

      const messagesToResend = activeChat.messages.slice(0, lastAssistantMessageIndex);
      const lastUserMessage = messagesToResend.filter(m => m.role === 'user').pop();
      
      if (lastUserMessage) {
          updateMessages(activeChat.id, () => messagesToResend);
          processAndSendMessage(lastUserMessage);
      }
  };

  return {
    sessions, setSessions, activeSessionId, setActiveSessionId,
    activeChat, isLoading, models, processAndSendMessage, startNewChat,
    stopGenerating, regenerateResponse, deleteAllSessions
  };
};