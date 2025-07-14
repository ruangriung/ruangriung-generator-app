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
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [dalleApiKey, setDalleApiKey] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeChat = sessions?.find((s) => s.id === activeSessionId);

  const saveSessionsToLocalStorage = (sessionsToSave: ChatSession[]) => {
    try {
      localStorage.setItem('ruangriung_chatbot_sessions_v3', JSON.stringify(sessionsToSave));
    } catch (error: any) {
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        toast("Penyimpanan penuh, sesi terlama akan dihapus.", {
          duration: 4000,
          icon: '⚠️',
        });
        const prunedSessions = sessionsToSave.slice(0, -1);
        if (prunedSessions.length > 0) {
          saveSessionsToLocalStorage(prunedSessions);
          setSessions(prunedSessions);
        } else {
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
      const savedGeminiKey = localStorage.getItem('gemini_api_key');
      if (savedGeminiKey) setGeminiApiKey(savedGeminiKey);
      const savedDalleKey = localStorage.getItem('dalle_api_key');
      if (savedDalleKey) setDalleApiKey(savedDalleKey);
    } catch (error) {
      console.error("Gagal memuat sesi:", error);
    }
    
    if (initialSessions.length === 0) {
      const newSession: ChatSession = { id: Date.now(), title: `Percakapan Baru`, messages: [], model: 'Gemini' };
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
        
        const allModels = ['Flux', 'gptimage', 'DALL-E 3', 'Gemini', ...validModels];
        
        setModels([...new Set(allModels)]);
      } catch (error) {
        console.error("Gagal memuat model:", error);
        setModels(['Flux', 'gptimage', 'DALL-E 3', 'Gemini', 'openai', 'mistral', 'google']);
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
      model: activeChat?.model || 'Gemini',
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
            model: 'Gemini',
        };
        setSessions([newSession]);
        setActiveSessionId(newSession.id);
        toast.success("Semua riwayat percakapan telah dihapus.");
    }
  };

  const setModelForImage = () => {
    if (activeChat) {
      setSessions(prev => 
        prev!.map(s => s.id === activeChat.id ? { ...s, model: 'Flux' } : s)
      );
      toast('Mode Gambar Aktif!', { icon: '🎨' });
    }
  };

  const processAndSendMessage = async (newMessage: Message) => {
    if (isLoading || !activeChat) return;

    if (typeof newMessage.content === 'string' && !newMessage.content.trim()) {
        toast.error("Pesan tidak boleh kosong.");
        return;
    }

    const currentActiveChatId = activeChat.id;
    updateMessages(currentActiveChatId, prev => [...prev, newMessage]);
    setIsLoading(true);

    const imageGenerationModels = ['Flux', 'gptimage'];

    if (imageGenerationModels.includes(activeChat.model)) {
        let promptText = newMessage.content as string;
        
        const ratioMatch = promptText.match(/rasio\s+(\d+:\d+)/);
        let width = 1024;
        let height = 1024;

        if (ratioMatch) {
            const ratio = ratioMatch[1];
            if (ratio === '9:16') { width = 1024; height = 1792; } 
            else if (ratio === '16:9') { width = 1792; height = 1024; }
            promptText = promptText.replace(/rasio\s+\d+:\d+/, '').trim();
        }

        try {
            const params = new URLSearchParams({
                model: activeChat.model,
                nologo: 'true',
                enhance: 'true',
                safe: 'false',
                referrer: 'ruangriung.my.id',
                seed: Math.floor(Math.random() * 100000).toString(),
                width: width.toString(),
                height: height.toString()
            });
            if (activeChat.model === 'gptimage') {
                params.append('transparent', 'true');
            }

            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?${params.toString()}`;
            const imageResponse = await fetch(imageUrl);

            if (!imageResponse.ok) throw new Error('Gagal saat menghubungi API gambar.');
            
            updateMessages(currentActiveChatId, prev => [...prev, {
              role: 'assistant',
              content: { type: 'image_url', image_url: { url: imageResponse.url }, text: `Gambar untuk: "${promptText}"` }
            }]);
        } catch (error: any) {
            toast.error("Maaf, gagal membuat gambar.");
            updateMessages(currentActiveChatId, prev => [...prev, { role: 'assistant', content: `Gagal membuat gambar: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    } else if (activeChat.model === 'DALL-E 3') {
        if (!dalleApiKey) {
            toast.error('API Key DALL-E 3 diperlukan.');
            updateMessages(currentActiveChatId, prev => prev.slice(0, -1));
            setIsLoading(false);
            return;
        }
        try {
            const response = await fetch('/api/dalle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: newMessage.content, apiKey: dalleApiKey })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal membuat gambar dengan DALL-E 3.");
            }
            const data = await response.json();
            updateMessages(currentActiveChatId, prev => [...prev, {
                role: 'assistant',
                content: { type: 'image_url', image_url: { url: data.imageUrl }, text: `Gambar DALL-E 3 untuk: "${newMessage.content}"` }
            }]);
        } catch(error: any) {
            toast.error(`Error: ${error.message}`);
            updateMessages(currentActiveChatId, prev => [...prev, { role: 'assistant', content: `Gagal membuat gambar: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    } else {
      if (!geminiApiKey) {
        toast.error('API Key Gemini diperlukan untuk fitur chat ini.');
        updateMessages(currentActiveChatId, prev => prev.slice(0, -1));
        setIsLoading(false);
        return;
      }
      try {
        const messagesForApi = [...activeChat.messages, newMessage];
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: messagesForApi, apiKey: geminiApiKey })
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Respons API tidak baik.");
        }
        const data = await response.json();
        updateMessages(currentActiveChatId, prev => [...prev, { role: 'assistant', content: data.text }]);
      } catch (error: any) {
        console.error("Gagal melakukan chat:", error);
        toast.error(`Error: ${error.message}`);
        updateMessages(currentActiveChatId, prev => [...prev, { role: 'assistant', content: `Maaf, terjadi kesalahan: ${error.message}` }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const stopGenerating = () => {};
  
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
    stopGenerating, regenerateResponse, deleteAllSessions,
    geminiApiKey, setGeminiApiKey,
    dalleApiKey, setDalleApiKey,
    setModelForImage
  };
};