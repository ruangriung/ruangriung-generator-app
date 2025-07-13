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
  const abortControllerRef = useRef<AbortController | null>(null);

  const activeChat = sessions?.find((s) => s.id === activeSessionId);

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
      localStorage.setItem('ruangriung_chatbot_sessions_v3', JSON.stringify(sessions));
    }
  }, [sessions]);

  const updateMessages = (sessionId: number, messages: Message[]) => {
    setSessions(prev => 
      prev!.map(s => s.id === sessionId ? { ...s, messages } : s)
    );
  };

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now(),
      title: `Percakapan ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
      messages: [],
      model: activeChat?.model || 'openai',
    };
    setSessions(prev => [newSession, ...(prev ?? [])]);
    setActiveSessionId(newSession.id);
  };
  
  const processAndSendMessage = async (newMessage: Message) => {
    if (isLoading || !activeChat) return;

    setIsLoading(true);
    abortControllerRef.current = new AbortController();
    
    const updatedMessages = [...activeChat.messages, newMessage];
    updateMessages(activeChat.id, updatedMessages);
    
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
        body: JSON.stringify({ 
            model: activeChat.model, 
            messages: apiMessages, 
            max_tokens: 2000 
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      
      const result = await response.json();
      const assistantMessage: Message = result.choices[0].message;
      updateMessages(activeChat.id, [...updatedMessages, assistantMessage]);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        toast.success('Pembuatan respons dihentikan.');
        // --- PERBAIKAN: Beri tahu TypeScript tipe objek ini adalah Message ---
        const finalMessages = [...updatedMessages, {role: 'assistant', content: '*Respons dihentikan oleh pengguna.*'} as Message];
        updateMessages(activeChat.id, finalMessages);
      } else {
        console.error('Error:', error);
        toast.error('Gagal mendapatkan respons dari AI.');
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
      const lastUserMessage = [...activeChat.messages].reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
          const messagesWithoutLastResponse = activeChat.messages.slice(0, -1);
          updateMessages(activeChat.id, messagesWithoutLastResponse);
          processAndSendMessage(lastUserMessage as Message);
      }
  };

  return {
    sessions, setSessions, activeSessionId, setActiveSessionId,
    activeChat, isLoading, processAndSendMessage, startNewChat,
    stopGenerating, regenerateResponse
  };
};