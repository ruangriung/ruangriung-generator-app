'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Loader,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Cpu,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { useChatManager } from '@/components/chatbot/useChatManager';
import { ChatMessage } from '@/components/chatbot/ChatMessage';
import { ChatInput } from '@/components/chatbot/ChatInput';
import TextareaModal from '@/components/TextareaModal';
import ApiKeyModal from '@/components/ApiKeyModal';
import toast from 'react-hot-toast';

const quickTemplates = [
  {
    title: 'Ringkas Artikel',
    description: 'Buat rangkuman padat dari artikel atau materi belajar.',
    prompt:
      'Tolong ringkas poin-poin penting dari teks berikut dalam bahasa Indonesia yang mudah dipahami:\n\n',
    icon: <Lightbulb size={18} />,
  },
  {
    title: 'Ide Konten Harian',
    description: 'Minta daftar ide konten sesuai niche yang kamu jalankan.',
    prompt:
      'Saya adalah kreator konten di bidang edukasi finansial. Buatkan 5 ide konten harian yang relevan beserta hook singkatnya.',
    icon: <Sparkles size={18} />,
  },
  {
    title: 'Draft Email Profesional',
    description: 'Susun email atau pesan profesional dengan nada sopan.',
    prompt:
      'Bantu saya menulis email profesional kepada calon klien yang menanyakan rincian layanan desain grafis kami.',
    icon: <MessageSquare size={18} />,
  },
  {
    title: 'Brainstorm Produk',
    description: 'Cari insight atau USP untuk produk UMKM kamu.',
    prompt:
      'Saya memiliki usaha kopi susu literan. Berikan analisis singkat target market dan 3 ide kampanye promosi kreatif.',
    icon: <Lightbulb size={18} />,
  },
  {
    title: 'Perbaiki Prompt',
    description: 'Optimalkan prompt gambar agar hasil visual lebih konsisten.',
    prompt:
      'Berikut prompt awal untuk generator gambar: "Ilustrasi kota futuristik di malam hari." Tolong kembangkan agar lebih detail dengan menyertakan gaya visual, pencahayaan, komposisi, dan warna.',
    icon: <Sparkles size={18} />,
  },
  {
    title: 'Belajar Cepat',
    description: 'Minta penjelasan materi dengan contoh sederhana.',
    prompt:
      'Jelaskan konsep machine learning untuk pemula menggunakan analogi kehidupan sehari-hari dan berikan dua contoh penerapannya.',
    icon: <Lightbulb size={18} />,
  },
];

export default function AsistenAIClient() {
  const {
    sessions,
    setSessions,
    activeSessionId,
    setActiveSessionId,
    activeChat,
    isLoading,
    models,
    processAndSendMessage,
    startNewChat,
    stopGenerating,
    regenerateResponse,
    deleteAllSessions,
    geminiApiKey,
    setGeminiApiKey,
    dalleApiKey,
    setDalleApiKey,
    setModelForImage,
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
    if (!window.confirm('Yakin ingin menghapus percakapan ini?')) return;
    setSessions((prev) => {
      if (!prev) return [];
      const newSessions = prev.filter((s) => s.id !== idToDelete);
      if (newSessions.length === 0) {
        startNewChat();
        return [];
      }
      if (activeSessionId === idToDelete && newSessions.length > 0) {
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
    setSessions((prev) => prev!.map((s) => (s.id === idToRename ? { ...s, title: renameInput } : s)));
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
      setSessions((prev) => prev!.map((s) => (s.id === activeSessionId ? { ...s, model: newModel } : s)));
    }
  };

  const handleGeminiApiKeySubmit = (apiKey: string) => {
    setGeminiApiKey(apiKey);
    localStorage.setItem('gemini_api_key', apiKey);
    if (activeChat) {
      setSessions((prev) => prev!.map((s) => (s.id === activeSessionId ? { ...s, model: 'Gemini' } : s)));
    }
    toast.success('API Key Gemini disimpan!');
    setIsGeminiKeyModalOpen(false);
  };

  const handleDalleApiKeySubmit = (apiKey: string) => {
    setDalleApiKey(apiKey);
    localStorage.setItem('dalle_api_key', apiKey);
    if (activeChat) {
      setSessions((prev) => prev!.map((s) => (s.id === activeSessionId ? { ...s, model: 'DALL-E 3' } : s)));
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

  const handleTemplateClick = (templatePrompt: string) => {
    if (isLoading) {
      toast.error('Tunggu hingga respons sebelumnya selesai.');
      return;
    }

    if (!templatePrompt) return;

    processAndSendMessage({ role: 'user', content: templatePrompt });
    toast.success('Template dimuat ke percakapan!');
  };

  if (!sessions || !activeChat) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center rounded-2xl bg-light-bg p-6 text-gray-700 shadow-neumorphic dark:bg-dark-bg dark:text-gray-200 dark:shadow-dark-neumorphic">
        <Loader className="mr-3 animate-spin" />
        Memuat sesi Asisten AI...
      </div>
    );
  }

  const formElementStyle =
    'w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-gray-800 dark:text-gray-200';

  const imageGenerationModels = ['Flux', 'gptimage', 'DALL-E 3'];
  const isImageModeActive = imageGenerationModels.includes(activeChat.model);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-purple-50 to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <div className="mx-auto flex w-full flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
              <Bot size={16} /> Asisten AI RuangRiung
            </p>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 sm:text-2xl">Percakapan Aktif</h1>
          </div>
          <button
            onClick={startNewChat}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-500"
          >
            <Plus size={18} /> Chat Baru
          </button>
        </div>

        <div className="relative flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
          {isSidebarOpen && (
            <button
              type="button"
              aria-label="Tutup riwayat"
              className="fixed inset-0 z-10 bg-black/40 transition-opacity lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <aside
            className={`absolute inset-y-0 left-0 z-20 flex h-full w-full max-w-sm flex-shrink-0 transform flex-col rounded-2xl border border-gray-200 bg-white/85 shadow-lg transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900/70 lg:relative lg:inset-auto lg:translate-x-0 ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Riwayat Percakapan</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="rounded-full p-1 text-gray-500 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800">
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center gap-2 px-4 py-3">
              <button
                onClick={startNewChat}
                className="flex-1 rounded-lg bg-purple-100 px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-200"
              >
                <Plus size={14} className="mr-1 inline" /> Chat Baru
              </button>
              <button
                onClick={deleteAllSessions}
                className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300"
                title="Hapus semua riwayat"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`group cursor-pointer rounded-xl border px-3 py-2 transition ${
                    activeSessionId === session.id
                      ? 'border-purple-500 bg-purple-50 dark:border-purple-400 dark:bg-purple-900/30'
                      : 'border-transparent bg-white/40 hover:border-purple-300 hover:bg-purple-50 dark:bg-gray-900/40 dark:hover:border-purple-500/60'
                  }`}
                >
                  {isRenaming === session.id ? (
                    <input
                      ref={renameInputRef}
                      type="text"
                      value={renameInput}
                      onChange={(e) => setRenameInput(e.target.value)}
                      onBlur={() => handleSaveRename(session.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(session.id)}
                      className="w-full border-none bg-transparent text-sm font-medium text-gray-700 focus:outline-none dark:text-gray-200"
                    />
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm text-gray-700 dark:text-gray-200">{session.title}</p>
                      <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRename(session);
                          }}
                          className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                          className="rounded-full p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Model: {session.model}</p>
                </div>
              ))}
            </div>
          </aside>

          <main className="flex flex-1 min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/90 shadow-xl dark:border-gray-800 dark:bg-gray-900/70">
            <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Percakapan aktif</p>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{activeChat.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsSidebarOpen(true)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800" aria-label="Buka riwayat">
                  <Menu size={18} />
                </button>
              </div>
            </header>

            <div ref={scrollContainerRef} className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg">
                  <Sparkles size={20} />
                </div>
                <div className="flex w-full shrink-0 flex-col gap-3 rounded-2xl bg-purple-50/80 p-4 text-gray-700 shadow-inner dark:bg-purple-950/40 dark:text-gray-200">
                  <div>
                    <p className="text-sm font-semibold">Template Percakapan Cepat</p>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                      Gunakan bubble di bawah ini untuk langsung mengirim instruksi dan memulai percakapan.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickTemplates.map((template) => (
                      <button
                        key={template.title}
                        onClick={() => handleTemplateClick(template.prompt)}
                        className="group flex min-w-[180px] max-w-xs flex-1 cursor-pointer flex-col gap-1 rounded-2xl border border-purple-200/70 bg-white/90 px-3 py-2 text-left text-sm shadow transition hover:-translate-y-0.5 hover:border-purple-500 hover:shadow-md dark:border-purple-800/60 dark:bg-gray-900/70 dark:hover:border-purple-400"
                      >
                        <span className="flex items-center gap-2 font-semibold text-purple-700 dark:text-purple-300">
                          {template.icon}
                          {template.title}
                        </span>
                        <span className="text-xs text-gray-600 transition group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-100">
                          {template.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {activeChat.messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                  <MessageSquare size={42} />
                  <p className="mt-3 text-sm font-medium">Belum ada percakapan. Pilih template atau tulis pertanyaanmu.</p>
                </div>
              )}
              {activeChat.messages.map((msg, index) => (
                <ChatMessage
                  key={`${activeChat.id}-${index}`}
                  message={msg}
                  messageId={`${activeChat.id}-${index}`}
                  onRegenerate={
                    index === activeChat.messages.length - 1 && !isLoading && msg.role === 'assistant'
                      ? regenerateResponse
                      : undefined
                  }
                />
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white">
                    <Bot size={20} />
                  </div>
                  <div className="flex items-center rounded-xl bg-white px-4 py-3 shadow dark:bg-gray-800">
                    <div className="dot-flashing" />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-800">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <label htmlFor="model-select" className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                    <Cpu size={16} /> Model
                  </label>
                  <select
                    id="model-select"
                    value={activeChat.model}
                    onChange={(e) => handleModelChange(e.target.value)}
                    className={`${formElementStyle} flex-1 text-sm`}
                  >
                    {models.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleImageShortcutClick}
                    className={`flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      isImageModeActive
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700 dark:bg-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <ImageIcon size={16} /> Gambar
                  </button>
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
            </div>
          </main>
        </div>
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
    </div>
  );
}
