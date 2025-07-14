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

const allModels = [
    { name: 'deepseek', description: 'DeepSeek V3', input_modalities: ['text'], output_modalities: ['text'], vision: false },
    { name: 'deepseek-reasoning', description: 'DeepSeek R1 0528', input_modalities: ['text'], output_modalities: ['text'], vision: false },
    { name: 'grok', description: 'xAI Grok-3 Mini', input_modalities: ['text'], output_modalities: ['text'], vision: false },
    { name: 'llama-fast-roblox', description: 'Llama 3.2 11B Vision (Cloudflare)', input_modalities: ['text', 'image'], output_modalities: ['text'], vision: true },
    { name: 'llama-roblox', description: 'Llama 3.1 8B FP8 (Cloudflare)', input_modalities: ['text'], output_modalities: ['text'], vision: false },
    { name: 'llamascout', description: 'Llama 4 Scout 17B', input_modalities: ['text'], output_modalities: ['text'], vision: false },
    { name: 'mistral', description: 'Mistral Small 3.1 24B', input_modalities: ['text', 'image'], output_modalities: ['text'], vision: true },
    { name: 'mistral-roblox', description: 'Mistral Small 3.1 24B (Cloudflare)', input_modalities: ['text', 'image'], output_modalities: ['text'], vision: true },
    { name: 'openai', description: 'OpenAI GPT-4o Mini', input_modalities: ['text', 'image'], output_modalities: ['text'], vision: true },
    { name: 'openai-audio', description: 'OpenAI GPT-4o Mini Audio Preview', input_modalities: ['text', 'image', 'audio'], output_modalities: ['audio', 'text'], vision: true },
    { name: 'openai-fast', description: 'OpenAI GPT-4.1 Nano', input_modalities: ['text', 'image'], output_modalities: ['text'], vision: true },
    { name: 'openai-large', description: 'OpenAI GPT-4.1', input_modalities: ['text', 'image'], output_modalities: ['text'], vision: true },
    { name: 'openai-reasoning', description: 'OpenAI O3', input_modalities: ['text', 'image'], output_modalities: ['text'], vision: true },
    { name: 'openai-roblox', description: 'OpenAI GPT-4.1 Mini (Roblox)', input_modalities: ['text', 'image'], output_modalities: ['text'], vision: true },
    { name: 'phi', description: 'Phi-4 Mini Instruct', input_modalities: ['text', 'image', 'audio'], output_modalities: ['text'], vision: true },
    { name: 'qwen-coder', description: 'Qwen 2.5 Coder 32B', input_modalities: ['text'], output_modalities: ['text'], vision: false },
    { name: 'bidara', description: 'BIDARA by NASA', input_modalities: ['text', 'image'], output_modalities: ['text'], vision: true },
    { name: 'elixposearch', description: 'Elixpo Search', input_modalities: ['text'], output_modalities: ['text'], vision: false },
    { name: 'evil', description: 'Evil', input_modalities: ['text', 'image'], output_modalities: ['text'], vision: true },
    { name: 'hypnosis-tracy', description: 'Hypnosis Tracy', input_modalities: ['text', 'audio'], output_modalities: ['audio', 'text'], vision: false },
    { name: 'midijourney', description: 'MIDIjourney', input_modalities: ['text'], output_modalities: ['text'], vision: false },
    { name: 'mirexa', description: 'Mirexa AI Companion', input_modalities: ['text', 'image'], output_modalities: ['text'], vision: true },
    { name: 'rtist', description: 'Rtist', input_modalities: ['text'], output_modalities: ['text'], vision: false },
    { name: 'sur', description: 'Sur AI Assistant', input_modalities: ['text', 'image'], output_modalities: ['text'], vision: true },
    { name: 'unity', description: 'Unity Unrestricted Agent', input_modalities: ['text', 'image'], output_modalities: ['text'], vision: true }
];

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
    const imageGenerationModels = ["Flux", "gptimage", "DALL-E 3"];
    
    const textOnlyModels = allModels
      .filter(m => m.input_modalities.length === 1 && m.input_modalities[0] === 'text')
      .map(m => m.name);
      
    const availableModels = [...imageGenerationModels, ...textOnlyModels, "openai", "Gemini", "mistral", "google"];
    
    setModels([...new Set(availableModels)]);
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
                setIsLoading(false); // Hentikan loading
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
            // --- AWAL PERBAIKAN: Memperbaiki error TypeScript ---
            const response = await fetch('https://text.pollinations.ai/openai', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN}`
              },
              body: JSON.stringify({
                model: textModel,
                // Menggunakan `messagesForApi` dan memberikan tipe 'any' untuk 'm'
                messages: messagesForApi.map((m: any) => ({ 
                    role: m.role === 'assistant' ? 'assistant' : 'user', 
                    content: typeof m.content === 'string' ? m.content : m.content.text || '' 
                })),
              })
            });
            // --- AKHIR PERBAIKAN ---
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