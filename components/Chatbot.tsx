// components/Chatbot.tsx
'use client';

import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { Bot, Loader, MessageSquare, Menu, X, Plus, Edit, Trash2, Cpu, Image as ImageIcon } from 'lucide-react';
import { useChat } from './chatbot/ChatContext';
import { ChatMessage } from './chatbot/ChatMessage';
import { ChatInput } from './chatbot/ChatInput';
import TextareaModal from './TextareaModal';
import toast from 'react-hot-toast';

type ChatbotProps = {
  initialPrompt?: string;
  autoSend?: boolean;
};

const Chatbot = memo(({ initialPrompt, autoSend = false }: ChatbotProps) => {
  const {
    sessions, setSessions, activeSessionId, setActiveSessionId,
    activeChat, isLoading, models, processAndSendMessage, startNewChat,
    regenerateResponse, deleteAllSessions,
    setModelForImage
  } = useChat();

  const stopGenerating = () => {}; // No-op for now as context doesn't have it

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState<number | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  const [isTextareaModalOpen, setIsTextareaModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState(initialPrompt ?? '');

  const hasInitializedPrompt = useRef(false);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeChat?.messages.length, isLoading]);

  useEffect(() => {
    if (isRenaming !== null) {
      renameInputRef.current?.focus();
    }
  }, [isRenaming]);

  const handleSelectSession = (id: number) => {
    setActiveSessionId(id);
    setIsSidebarOpen(false);
  };

  const handleDeleteSession = (idToDelete: number) => {
    if (!window.confirm("Yakin ingin menghapus percakapan ini?")) return;
    setSessions(prev => {
      if (!prev) return [];
      const newSessions = prev.filter(s => s.id !== idToDelete);
      if (newSessions.length === 0) {
        startNewChat();
        return [];
      }
      if (activeSessionId === idToDelete) {
        setActiveSessionId(newSessions[0].id);
      }
      return newSessions;
    });
  };

  const handleRename = (session: any) => {
    setIsRenaming(session.id);
    setRenameInput(session.title);
  };

  const handleSaveRename = (idToRename: number) => {
    if (!renameInput.trim()) return;
    setSessions(prev => prev!.map(s => s.id === idToRename ? { ...s, title: renameInput } : s));
    setIsRenaming(null);
  };

  const handleModelChange = (newModel: string) => {
    if (activeChat) {
      setSessions(prev => prev!.map(s => s.id === activeSessionId ? { ...s, model: newModel } : s));
    }
  };



  const handleSendMessage = (message: any) => {
    processAndSendMessage(message);
    setChatInput('');
  };

  const handleImageShortcutClick = () => {
    setModelForImage();
    const textarea = document.getElementById('chat-input-textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  useEffect(() => {
    if (!sessions || !activeChat) return;
    if (!initialPrompt || hasInitializedPrompt.current) return;

    if (autoSend) {
      processAndSendMessage({ role: 'user', content: initialPrompt });
      setChatInput('');
    } else {
      setChatInput(initialPrompt);
    }

    hasInitializedPrompt.current = true;
  }, [sessions, activeChat, initialPrompt, autoSend, processAndSendMessage]);

  if (!sessions || !activeChat) {
    return (
      <div className="w-full p-6 flex justify-center items-center h-[90vh] bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
        <Loader className="animate-spin" />
        <span className="ml-4 text-gray-600 dark:text-gray-300">Memuat Sesi Chat...</span>
      </div>
    );
  }

  const formElementStyle = "w-full p-3 glass-inset border-2 border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-900 dark:text-white font-medium";

  const imageGenerationModels = ['Flux', 'gptimage'];
  const isImageModeActive = imageGenerationModels.includes(activeChat.model);

  return (
    <>
      <div className="w-full flex h-[85vh] glass rounded-[2.5rem] border border-white/20 dark:border-white/10 overflow-hidden relative shadow-2xl">
        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[25] md:hidden transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside className={`absolute top-0 left-0 h-full z-[30] md:static md:z-auto w-[280px] p-4 border-r border-slate-200 dark:border-white/10 flex flex-col glass dark:bg-slate-900/90 transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="flex justify-between items-center mb-6 gap-2">
            <button 
              onClick={startNewChat} 
              className="flex-grow flex items-center justify-center gap-2 p-3 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-primary-600 hover:bg-primary-500 shadow-lg shadow-primary-500/20 transition-all active:scale-95"
            >
              <Plus size={16} /> Chat Baru
            </button>
            <button
              onClick={deleteAllSessions}
              title="Hapus semua riwayat"
              className="p-3 text-red-500 glass-button !p-3 !rounded-2xl"
            >
              <Trash2 size={16} />
            </button>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-2 p-2 text-slate-500 hover:text-primary-500 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 px-2">Riwayat Percakapan</p>
            {sessions.map(session => (
              <div 
                key={session.id} 
                onClick={() => handleSelectSession(session.id)} 
                className={`p-3 rounded-2xl cursor-pointer group transition-all border-2 ${
                  activeSessionId === session.id 
                    ? 'bg-primary-500/10 border-primary-500/30' 
                    : 'border-transparent hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {isRenaming === session.id ? (
                  <input 
                    ref={renameInputRef} 
                    type="text" 
                    value={renameInput} 
                    onChange={e => setRenameInput(e.target.value)} 
                    onBlur={() => handleSaveRename(session.id)} 
                    onKeyDown={e => e.key === 'Enter' && handleSaveRename(session.id)} 
                    className="w-full bg-transparent text-sm font-bold focus:outline-none text-primary-500" 
                  />
                ) : (
                  <div className="flex justify-between items-center">
                    <p className={`text-sm truncate font-bold ${activeSessionId === session.id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300'}`}>
                      {session.title}
                    </p>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                      <button onClick={(e) => { e.stopPropagation(); handleRename(session); }} className="p-1 text-slate-400 hover:text-primary-500">
                        <Edit size={14} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id); }} className="p-1 text-slate-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-full bg-white/30 dark:bg-slate-950/20 backdrop-blur-sm">
          <header className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center gap-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                <Menu size={20} />
              </button>
              <div className="h-8 w-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500">
                <MessageSquare size={18} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
                {activeChat.title}
              </h2>
            </div>
          </header>

          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 custom-scrollbar">
            {activeChat.messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center space-y-4">
                <div className="h-20 w-20 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <Bot size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">RuangRiung Chatbot</h3>
                  <p className="text-sm font-medium max-w-xs mx-auto">Pilih model atau klik tombol "Gambar" untuk memulai percakapan kreatif.</p>
                </div>
              </div>
            )}
            {activeChat.messages.map((msg, index) => (
              <ChatMessage
                key={`${activeChat.id}-${index}`}
                message={msg}
                messageId={`${activeChat.id}-${index}`}
                onRegenerate={index === activeChat.messages.length - 1 && !isLoading && msg.role === 'assistant' ? regenerateResponse : undefined}
              />
            ))}
            {isLoading && (
              <div className="flex items-start gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="w-10 h-10 rounded-2xl bg-primary-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-500/20">
                  <Bot size={22} className="animate-pulse" />
                </div>
                <div className="glass shadow-md rounded-2xl p-5 flex items-center">
                  <div className="dot-flashing"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-t border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 shrink-0">
                <Cpu size={14} className="text-primary-500" /> Model AI
              </div>
              <div className="flex-1 w-full flex items-center gap-2">
                <select
                  id="model-select"
                  value={activeChat.model}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full p-2.5 glass-inset !rounded-xl text-xs font-bold appearance-none cursor-pointer hover:border-primary-500/50 transition-all text-slate-900 dark:text-white"
                >
                  {models.map(m => <option key={m} value={m} className="bg-white dark:bg-slate-900">{m}</option>)}
                </select>
                <button
                  onClick={handleImageShortcutClick}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs rounded-xl font-black uppercase tracking-widest transition-all duration-300 shrink-0
                    ${isImageModeActive
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                      : 'glass-button'
                    }`}
                  title="Pilih mode gambar"
                >
                  <ImageIcon size={14} />
                  <span>Gambar</span>
                </button>
              </div>
            </div>
            
            <ChatInput
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onStop={stopGenerating}
              onExpand={() => setIsTextareaModalOpen(true)}
              value={chatInput}
              onValueChange={setChatInput}
            />
          </div>
        </main>
      </div>

      <TextareaModal
        isOpen={isTextareaModalOpen}
        onClose={() => setIsTextareaModalOpen(false)}
        title="Edit Pesan"
        value={chatInput}
        onChange={(newValue) => setChatInput(newValue)}
      />


    </>
  );
});

Chatbot.displayName = 'Chatbot';

export default Chatbot;