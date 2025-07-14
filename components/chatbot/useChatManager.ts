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
  const [models, setModels] = useState<string[]>(['openai', 'Gemini']); // Default models
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
            const response = await fetch('https://text.pollinations.ai/models');
            if (!response.ok) {
                throw new Error('Gagal mengambil daftar model dari API.');
            }
            const allModels: any[] = await response.json();

            const imageGenerationModels = ["Flux", "gptimage", "DALL-E 3"];
            
            // Filter untuk model yang hanya mendukung teks
            const textOnlyModels = allModels
                .filter(m => Array.isArray(m.input_modalities) && m.input_modalities.length === 1 && m.input_modalities[0] === 'text')
                .map(m => m.name);
            
            // Gabungkan model-model yang ada dengan yang baru difilter
            const availableModels = [...imageGenerationModels, ...textOnlyModels, "openai", "Gemini"];
            
            setModels([...new Set(availableModels)]); // Gunakan Set untuk menghilangkan duplikat
        } catch (error) {
            console.error("Gagal memuat model dinamis:", error);
            // Fallback ke daftar model dasar jika API gagal
            setModels(["Flux", "gptimage", "DALL-E 3", "openai", "Gemini", "deepseek", "grok"]);
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
    const imageGenerationModels = ['Flux', 'gptimage', 'DALL-E 3'];
    const isImageGenerationMode = imageGenerationModels.includes(activeChat.model);

    try {
      if (isImageUpload) {
        const content = newMessage.content as { type: 'image_url'; image_url: { url: string }; text?: string };
        const payload = {
            model: 'openai',
            messages: [{ role: 'user', content: [{ type: 'image_url', image_url: { url: content.image_url.url } }, { type: 'text', text: content.text || 'Jelaskan gambar ini.' }] }],
            max_tokens: 500
        };

        const response = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Gagal menganalisis gambar. Status: ${response.status}. Pesan: ${errorBody}`);
        }
        
        const result = await response.json();
        const description = result.choices?.[0]?.message?.content?.trim();
        if (!description) throw new Error("API tidak memberikan deskripsi yang valid.");
        
        updateMessages(currentActiveChatId, prev => [...prev, { role: 'assistant', content: description }]);

      } else if (isImageGenerationMode) {
          let promptText = newMessage.content as string;

          if (activeChat.model === 'DALL-E 3') {
              if (!dalleApiKey) throw new Error('API Key DALL-E 3 diperlukan.');
              const response = await fetch('/api/dalle', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ prompt: promptText, apiKey: dalleApiKey })
              });
              if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.message || "Gagal membuat gambar dengan DALL-E 3.");
              }
              const data = await response.json();
              updateMessages(currentActiveChatId, prev => [...prev, {
                  role: 'assistant',
                  content: { type: 'image_url', image_url: { url: data.imageUrl }, text: `Gambar DALL-E 3 untuk: "${promptText}"` }
              }]);
          } else { 
              const params = new URLSearchParams({
                  model: activeChat.model,
                  nologo: 'true',
                  enhance: 'true',
                  safe: 'false',
                  referrer: 'ruangriung.my.id',
                  seed: Math.floor(Math.random() * 100000).toString(),
                  width: '1024',
                  height: '1024'
              });
              const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?${params.toString()}`;
              const imageResponse = await fetch(imageUrl);

              if (!imageResponse.ok) throw new Error('Gagal saat menghubungi API gambar Pollinations.');
              
              updateMessages(currentActiveChatId, prev => [...prev, {
                role: 'assistant',
                content: { type: 'image_url', image_url: { url: imageResponse.url }, text: `Gambar untuk: "${promptText}"` }
              }]);
          }
      } else {
          const textModel = activeChat.model || 'openai';
          const messagesForApi = [...activeChat.messages, newMessage];

          if (textModel === 'Gemini') {
            if (!geminiApiKey) {
                toast.error('API Key Gemini diperlukan untuk fitur chat ini.');
                updateMessages(currentActiveChatId, prev => prev.slice(0, -1));
                setIsLoading(false);
                return;
            }
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
          } else {
            const response = await fetch('https://text.pollinations.ai/openai', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN}`
              },
              body: JSON.stringify({
                model: textModel,
                messages: messagesForApi.map((m: any) => ({ 
                    role: m.role === 'assistant' ? 'assistant' : 'user', 
                    content: typeof m.content === 'string' ? m.content : m.content.text || '' 
                })),
              })
            });
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Gagal melakukan chat: ${response.statusText} - ${errorText}`);
            }
            const result = await response.json();
            const reply = result.choices[0].message.content;
            updateMessages(currentActiveChatId, prev => [...prev, { role: 'assistant', content: reply }]);
          }
      }
    } catch (error: any) {
        console.error("Gagal memproses pesan:", error);
        toast.error(`Error: ${error.message}`);
        updateMessages(currentActiveChatId, prev => [...prev, { role: 'assistant', content: `Maaf, terjadi kesalahan: ${error.message}` }]);
    } finally {
        setIsLoading(false);
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