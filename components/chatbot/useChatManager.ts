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
  const [models, setModels] = useState<string[]>(['openai']); // Default models
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

  // --- AWAL PERUBAHAN: Fetch dan filter model secara dinamis ---
  useEffect(() => {
    const fetchAndSetModels = async () => {
      try {
        // Fetch text models
        const responseText = await fetch('/api/pollinations/models/text');
        if (!responseText.ok) throw new Error('Gagal mengambil daftar model teks.');
        const textModels = await responseText.json();

        const imageGenerationModels = ["Flux", "gptimage"];

        let availableTextModels: string[] = [];
        if (Array.isArray(textModels)) {
          availableTextModels = textModels.map((m: any) => typeof m === 'string' ? m : m.name);
        }

        // Gabungkan
        const availableModels = [...imageGenerationModels, ...availableTextModels, "openai"];

        setModels([...new Set(availableModels)]);
      } catch (error) {
        console.error("Gagal memuat model dinamis:", error);
        // Fallback
        setModels(["Flux", "gptimage", "openai", "deepseek", "grok"]);
        toast.error("Gagal memuat daftar model terbaru, menggunakan daftar default.");
      }
    };

    fetchAndSetModels();
  }, []);
  // --- AKHIR PERUBAHAN ---

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
        model: 'openai',
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

    const currentActiveChatId = activeChat.id;
    updateMessages(currentActiveChatId, prev => [...prev, newMessage]);
    setIsLoading(true);

    const isImageUpload = typeof newMessage.content === 'object' && newMessage.content.type === 'image_url';
    const imageGenerationModels = ['Flux', 'gptimage'];
    const isImageGenerationMode = imageGenerationModels.includes(activeChat.model);

    try {
      if (isImageUpload) {
        const content = newMessage.content as { type: 'image_url'; image_url: { url: string }; text?: string };
        const payload = {
          model: 'openai',
          messages: [{ role: 'user', content: [{ type: 'image_url', image_url: { url: content.image_url.url } }, { type: 'text', text: content.text || 'Jelaskan gambar ini.' }] }],
          max_tokens: 500
        };

        // Use internal proxy
        const response = await fetch('/api/pollinations/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Gagal menganalisis gambar. Status: ${response.status}. Pesan: ${errorBody}`);
        }

        // Proxy returns text directly
        const description = await response.text();
        if (!description) throw new Error("API tidak memberikan deskripsi yang valid.");

        updateMessages(currentActiveChatId, prev => [...prev, { role: 'assistant', content: description }]);

      } else if (isImageGenerationMode) {
        let promptText = newMessage.content as string;

      } else if (isImageGenerationMode) {
        let promptText = newMessage.content as string;

        const params = new URLSearchParams({
          model: activeChat.model,
          nologo: 'true',
          enhance: 'true',
          safe: 'false',
          referrer: 'ruangriung.my.id',
          seed: Math.floor(Math.random() * 100000).toString(),
          width: '1024',
          height: '1024',
          prompt: promptText // Pass prompt in params for our proxy
        });
        // Use internal proxy
        const imageUrl = `/api/pollinations/image?${params.toString()}`;

        // We can't verify 200 OK easily without fetching, but for <img> src it's fine.
        // However, the original code validates it with fetch.
        const imageResponse = await fetch(imageUrl);

        if (!imageResponse.ok) throw new Error('Gagal saat menghubungi API gambar Pollinations.');

        updateMessages(currentActiveChatId, prev => [...prev, {
          role: 'assistant',
          content: { type: 'image_url', image_url: { url: imageResponse.url }, text: `Gambar untuk: "${promptText}"` }
        }]);
      } else {
        const textModel = activeChat.model || 'openai';
        const messagesForApi = [...activeChat.messages, newMessage];

        // Use internal proxy
        const response = await fetch('/api/pollinations/text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: textModel,
            messages: messagesForApi.map((m: any) => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: typeof m.content === 'string' ? m.content : m.content.text || ''
            })),
            json: false
          })
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Gagal melakukan chat: ${response.statusText} - ${errorText}`);
        }
        // Proxy returns text directly
        const reply = await response.text();
        updateMessages(currentActiveChatId, prev => [...prev, { role: 'assistant', content: reply }]);
      }
    } catch (error: any) {
      console.error("Gagal memproses pesan:", error);
      toast.error(`Error: ${error.message}`);
      updateMessages(currentActiveChatId, prev => [...prev, { role: 'assistant', content: `Maaf, terjadi kesalahan: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const stopGenerating = () => { };

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
    setModelForImage
  };
};