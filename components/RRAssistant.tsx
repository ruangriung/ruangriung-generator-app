'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User, Paperclip, Trash2, Plus, Maximize2, MinusCircle } from 'lucide-react';
import Image from 'next/image';
import { useChat } from './chatbot/ChatContext';
import { ChatMessage } from './chatbot/ChatMessage';
import toast from 'react-hot-toast';

const RRAssistant = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [typingText, setTypingText] = useState('AI sedang mengetik...');
  
  const { 
    activeChat, isLoading, processAndSendMessage, startNewChat,
    isAssistantOpen, setIsAssistantOpen,
    pendingPrompt, setPendingPrompt,
    deleteAllSessions
  } = useChat();

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync with global open state
  useEffect(() => {
    if (pendingPrompt) {
      setChatInput(pendingPrompt);
      setPendingPrompt(null);
      setIsAssistantOpen(true);
    }
  }, [pendingPrompt, setIsAssistantOpen, setPendingPrompt]);

  // Onboarding: Welcome message for V2 transition
  useEffect(() => {
    if (isMounted) {
      const hasSeenOnboarding = localStorage.getItem('has_seen_v2_onboarding');
      if (!hasSeenOnboarding) {
        // Hanya siapkan pesan, jangan buka otomatis
        processAndSendMessage({
          role: 'assistant',
          content: "Halo! Selamat datang di **RuangRiung V2**. Saya adalah **RR AGENT**, asisten AI baru Anda.\n\nKami telah melakukan banyak perubahan besar pada antarmuka untuk membuat kreasi Anda lebih cepat dan mudah. \n\nAda yang bisa saya bantu jelaskan mengenai fitur-fitur baru kami hari ini?"
        });
        localStorage.setItem('has_seen_v2_onboarding', 'true');
      }
    }
  }, [isMounted, setIsAssistantOpen, processAndSendMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat?.messages.length, isLoading]);

  // Handle automatic full screen on mobile
  useEffect(() => {
    if (isMounted) {
      const checkMobile = () => {
        if (window.innerWidth < 640) {
          setIsFullScreen(true);
        } else {
          setIsFullScreen(false);
        }
      };
      
      if (isAssistantOpen) checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, [isAssistantOpen, isMounted]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [chatInput]);

  // Dynamic typing indicator with cycling phrases
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      const phrases = [
        'Agent sedang mengetik...',
        'Sedang merangkum jawaban...',
        'Sedang memproses permintaan...',
        'Sedang memuat data...',
        'Sedang berpikir...',
        'Mencari solusi terbaik...',
        'Menunggu respon server...',
        'Menyiapkan teks...'
      ];
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % phrases.length;
        setTypingText(phrases[i]);
      }, 2500);
    } else {
      setTypingText('Agent sedang mengetik...');
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isLoading || !activeChat) return;

    const currentInput = chatInput;
    setChatInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    
    await processAndSendMessage({ role: 'user', content: currentInput });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.loading("Memproses gambar...");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      toast.dismiss();
      const base64String = reader.result as string;
      processAndSendMessage({
        role: 'user',
        content: { type: 'image_url', image_url: { url: base64String }, text: chatInput || `Analisis gambar ini.` }
      });
      setChatInput('');
    };
  };

  if (!isMounted) return null;

  return (
    <div 
      className={`fixed ${isAssistantOpen ? 'z-[250]' : 'z-[150]'} transition-all duration-300 ease-in-out ${
         (isAssistantOpen && isFullScreen) 
          ? 'inset-0 w-full h-full sm:inset-4 sm:w-auto sm:h-auto' 
          : isAssistantOpen 
            ? 'bottom-6 right-6 w-[95vw] sm:w-[450px] h-[80vh] max-h-[700px]' 
            : 'bottom-6 right-6 w-auto h-auto'
      } ${!isAssistantOpen ? 'rr-assistant-trigger' : ''}`}
    >
      {!isAssistantOpen ? (
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="flex items-center gap-3 p-4 bg-gradient-to-br from-primary-600 to-indigo-600 dark:from-primary-500 dark:to-indigo-500 text-white rounded-full shadow-2xl shadow-primary-500/20 hover:scale-110 hover:shadow-primary-500/40 transition-all duration-500 group border border-white/20 animate-pulse"
          aria-label="Buka RR AGENT"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/50 bg-white">
             <Image src="/logo.webp" alt="RR" width={32} height={32} className="object-cover" />
          </div>
          <span className="font-bold text-sm pr-2 whitespace-nowrap">RR AGENT</span>
        </button>
      ) : (
        <div className="w-full h-full bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-primary-500/20 dark:border-primary-500/10 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/30 bg-white flex items-center justify-center">
                <Image src="/logo.webp" alt="RR" width={32} height={32} className="object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-none text-white">RR AGENT</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] text-purple-100 uppercase tracking-widest leading-none">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={startNewChat} 
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title="Percakapan Baru"
              >
                <Plus size={18} />
              </button>
              <button 
                onClick={deleteAllSessions} 
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title="Hapus Semua Riwayat"
              >
                <Trash2 size={16} />
              </button>
              {/* Desktop-only toggle full screen / restore */}
              <button 
                onClick={() => setIsFullScreen(!isFullScreen)} 
                className="hidden sm:block p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title={isFullScreen ? "Kecilkan" : "Layar Penuh"}
              >
                <Maximize2 size={16} className={isFullScreen ? "rotate-180" : ""} />
              </button>
              <button 
                onClick={() => setIsAssistantOpen(false)} 
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                title="Tutup"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Chat area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-gray-900/50"
          >
                {!activeChat || activeChat.messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-inner border-2 border-purple-100">
                      <Image src="/logo.webp" alt="RR AGENT" width={60} height={60} className="rounded-full object-contain" />
                    </div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Halo! Saya RR AGENT</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Saya asisten cerdas Anda. Ada yang bisa saya bantu hari ini?
                    </p>
                  </div>
                ) : (
                  activeChat.messages.map((msg, idx) => (
                    <ChatMessage 
                      key={`${activeChat.id}-${idx}`}
                      message={msg}
                      messageId={`${activeChat.id}-${idx}`}
                    />
                  ))
                )}
                {isLoading && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-purple-100 shadow-sm overflow-hidden relative">
                      <Image src="/logo.webp" alt="RR" width={24} height={24} className="object-contain" />
                    </div>
                    <div className="max-w-xl p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                         <Loader2 className="animate-spin text-primary-600" size={16} />
                         <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                           {typingText}
                         </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input section */}
              <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <form onSubmit={handleSendMessage} className="relative flex flex-col gap-2">
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Tanya sesuatu..."
                      className="w-full p-4 pr-24 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none resize-none max-h-[200px]"
                      disabled={isLoading}
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-1">
                      <label htmlFor="assistant-upload" className="p-2.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors" title="Unggah Gambar">
                        <Paperclip size={20} className="text-gray-500 dark:text-gray-400" />
                        <input id="assistant-upload" type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={isLoading} />
                      </label>
                      <button
                        type="submit"
                        disabled={!chatInput.trim() || isLoading}
                        className="p-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl shadow-lg transition-all active:scale-95"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      );
    };

export default RRAssistant;
