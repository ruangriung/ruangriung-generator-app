// components/Chatbot.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Loader, MessageSquare, Menu, X, Plus, Edit, Trash2, Cpu, Image as ImageIcon } from 'lucide-react';
import { useChatManager } from './chatbot/useChatManager';
import { ChatMessage } from './chatbot/ChatMessage';
import { ChatInput } from './chatbot/ChatInput';
import TextareaModal from './TextareaModal';
import ApiKeyModal from './ApiKeyModal';
import toast from 'react-hot-toast';

export default function Chatbot() {
  const {
    sessions, setSessions, activeSessionId, setActiveSessionId,
    activeChat, isLoading, models, processAndSendMessage, startNewChat,
    stopGenerating, regenerateResponse, deleteAllSessions,
    geminiApiKey, setGeminiApiKey,
    dalleApiKey, setDalleApiKey,
    setModelForImage
  } = useChatManager();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState<number | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  const [isTextareaModalOpen, setIsTextareaModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const [isGeminiKeyModalOpen, setIsGeminiKeyModalOpen] = useState(false);
  const [isDalleKeyModalOpen, setIsDalleKeyModalOpen] = useState(false);

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
    if (newModel === 'Gemini' && !geminiApiKey) {
      setIsGeminiKeyModalOpen(true);
      return;
    }
    if (newModel === 'DALL-E 3' && !dalleApiKey) {
      setIsDalleKeyModalOpen(true);
      return;
    }
    if (activeChat) {
      setSessions(prev => prev!.map(s => s.id === activeSessionId ? {...s, model: newModel} : s));
    }
  };

  const handleGeminiApiKeySubmit = (apiKey: string) => {
    setGeminiApiKey(apiKey);
    localStorage.setItem('gemini_api_key', apiKey);
    if (activeChat) {
      setSessions(prev => prev!.map(s => s.id === activeSessionId ? {...s, model: 'Gemini'} : s));
    }
    toast.success('API Key Gemini disimpan!');
    setIsGeminiKeyModalOpen(false);
  };

  const handleDalleApiKeySubmit = (apiKey: string) => {
    setDalleApiKey(apiKey);
    localStorage.setItem('dalle_api_key', apiKey);
    if (activeChat) {
      setSessions(prev => prev!.map(s => s.id === activeSessionId ? {...s, model: 'DALL-E 3'} : s));
    }
    toast.success('API Key DALL-E 3 disimpan!');
    setIsDalleKeyModalOpen(false);
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

  if (!sessions || !activeChat) {
    return (
        <div className="w-full p-6 flex justify-center items-center h-[90vh] bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
            <Loader className="animate-spin" />
            <span className="ml-4 text-gray-600 dark:text-gray-300">Memuat Sesi Chat...</span>
        </div>
    );
  }

  const formElementStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-gray-800 dark:text-gray-200";

  const imageGenerationModels = ['Flux', 'gptimage', 'DALL-E 3'];
  const isImageModeActive = imageGenerationModels.includes(activeChat.model);

  return (
    <>
      <div className="w-full flex h-[90vh] bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic overflow-hidden relative">
        <aside className={`absolute top-0 left-0 h-full z-20 md:static md:z-auto w-full md:w-1/4 md:min-w-[280px] p-2 sm:p-4 border-r border-gray-300 dark:border-gray-700 flex flex-col bg-light-bg dark:bg-dark-bg transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="flex justify-between items-center mb-4 gap-2">
                <button onClick={startNewChat} className="flex-grow flex items-center justify-center gap-2 p-3 rounded-lg font-semibold text-gray-700 dark:text-gray-200 bg-light-bg dark:bg-dark-bg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset"><Plus size={18} /> Chat Baru</button>
                <button
                    onClick={deleteAllSessions}
                    title="Hapus semua riwayat"
                    className="p-3 text-red-500 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset"
                >
                    <Trash2 size={18} />
                </button>
                <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-2 p-2 text-gray-600 dark:text-gray-300"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {sessions.map(session => (
                  <div key={session.id} onClick={() => handleSelectSession(session.id)} className={`p-2 rounded-lg cursor-pointer group ${activeSessionId === session.id ? 'bg-purple-100 dark:bg-purple-900/50' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                      {isRenaming === session.id ? ( <input ref={renameInputRef} type="text" value={renameInput} onChange={e => setRenameInput(e.target.value)} onBlur={() => handleSaveRename(session.id)} onKeyDown={e => e.key === 'Enter' && handleSaveRename(session.id)} className="w-full bg-transparent text-sm font-medium focus:outline-none"/>
                      ) : ( <div className="flex justify-between items-center"><p className="text-sm text-gray-700 dark:text-gray-300 truncate">{session.title}</p><div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={(e) => { e.stopPropagation(); handleRename(session); }} className="p-1 text-gray-500 hover:text-purple-600"><Edit size={14}/></button><button onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id); }} className="p-1 text-gray-500 hover:text-red-500"><Trash2 size={14}/></button></div></div> )}
                  </div>
              ))}
            </div>
        </aside>

        <main className="flex-1 flex flex-col h-full">
          <header className="p-3 sm:p-4 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-gray-600 dark:text-gray-300"><Menu size={20}/></button>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate flex-1">{activeChat.title}</h2>
          </header>

          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-6">
              {activeChat.messages.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <MessageSquare size={48} />
                      <p className="mt-4">Pilih model atau klik tombol "Gambar" untuk memulai.</p>
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
                <div className="flex items-start gap-2 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0">
                        <Bot size={22} />
                    </div>
                    <div className="max-w-xl p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md flex items-center">
                        <div className="dot-flashing"></div>
                    </div>
                </div>
              )}
          </div>

          <div className="p-2 sm:p-4 border-t border-gray-300 dark:border-gray-700 space-y-2">
            <div className="flex items-center gap-2 sm:gap-4 px-1">
                <label htmlFor="model-select" className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300"><Cpu size={16}/> Model:</label>
                <select
                    id="model-select"
                    value={activeChat.model}
                    onChange={(e) => handleModelChange(e.target.value)}
                    className={`${formElementStyle} flex-1 text-sm appearance-none`}
                >
                  {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <div className="flex flex-col items-center">
                    <button
                      onClick={handleImageShortcutClick}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-semibold bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-200 transition-all duration-150
                          ${isImageModeActive
                              ? 'shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset text-purple-600'
                              : 'shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset'
                          }`}
                      title="Pilih mode gambar"
                    >
                        <ImageIcon size={16} />
                        <span>Gambar</span>
                    </button>
                    {isImageModeActive && (
                        <span className="text-xs font-semibold text-green-600 dark:text-green-400 mt-1">Mode Gambar Aktif</span>
                    )}
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

      <ApiKeyModal
        isOpen={isGeminiKeyModalOpen}
        onClose={() => setIsGeminiKeyModalOpen(false)}
        onSubmit={handleGeminiApiKeySubmit}
        modelName="Gemini"
      />

      <ApiKeyModal
        isOpen={isDalleKeyModalOpen}
        onClose={() => setIsDalleKeyModalOpen(false)}
        onSubmit={handleDalleApiKeySubmit}
        modelName="DALL-E 3"
      />
    </>
  );
}