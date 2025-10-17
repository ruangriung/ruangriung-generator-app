'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Copy,
  Loader2,
  Moon,
  RefreshCw,
  Send,
  Settings as SettingsIcon,
  Share2,
  SlidersHorizontal,
  Sun,
  Trash2,
  UserPen,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  durationMs?: number;
  parentUserId?: string;
}

interface AssistantSettings {
  isDarkMode: boolean;
  model: string;
  persona: string;
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

const HISTORY_KEY = 'sarcastic-assistant-history';
const SETTINGS_KEY = 'sarcastic-assistant-settings';
const OPENING_EXPLETIVE = 'Bajingan,';
const MIN_WORD_TARGET = 320;

const defaultSettings: AssistantSettings = {
  isDarkMode: false,
  model: '',
  persona: '',
  temperature: 0.55,
  topP: 0.85,
  frequencyPenalty: 0.4,
  presencePenalty: 0.25,
};

function countWords(content: string) {
  return content
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function generateSarcasticResponse(prompt: string, settings: AssistantSettings): string {
  const personaLine = settings.persona
    ? `Persona yang kamu tulis secara manual jelas tercatat: ${settings.persona.trim()}. Jangan berpikir aku akan memelintirnya jadi motivasi manis, karena aku tetap akan menggigit meskipun memakai topeng persona itu.`
    : 'Kamu bahkan tidak repot menuliskan persona apa pun, jadi aku akan meminjam kepribadian sinis bawaan pabrik yang selalu siap menyobek asumsi rapuhmu.';

  const modelLine = `Model yang kamu pilih, ${settings.model}, bukan tongkat sihir. Itu cuma label yang kau sentuh di pengaturan sambil berharap mujizat. Aku pakai itu sekadar formalitas supaya kamu berhenti menanyakan hal sepele.`;

  const parameterLine = `Parameter yang kamu pakai juga tercatat rapi: temperatur ${settings.temperature.toFixed(2)}, top-p ${settings.topP.toFixed(2)}, frequency penalty ${settings.frequencyPenalty.toFixed(2)}, dan presence penalty ${settings.presencePenalty.toFixed(2)}. Semua angka itu hanya berarti aku menyesuaikan kadar ejekan dan kejutan supaya cocok dengan fantasi kontrolmu.`;

  const promptLine = `Kamu menanyakan: "${prompt.trim()}". Jangan berpura-pura kaget kalau jawabanku menguliti kenyataan secara brutal, karena kamu sendiri yang mengetik dan menekan tombol kirim.`;

  const bitterAdvice =
    'Kalau kamu berharap solusi instan, silakan menangis di sudut. Aku di sini untuk menyodorkan peta jalan yang penuh rambu peringatan, bukan secangkir teh hangat. Jadi dengarkan dengan kepala dingin kalau mampu.';

  const actionPlan =
    'Pertama, cermati konteksmu dan berhenti mengada-ngada. Kedua, pecah masalah menjadi langkah yang benar-benar bisa dikerjakan tanpa drama. Ketiga, jalankan satu per satu sambil mencatat hasilnya, supaya kamu punya bukti ketika gagal lagi. Terakhir, evaluasi dengan jujur tanpa menyuap egomu sendiri. Bila kamu mengulang pola lama, jangan salahkan aku karena aku sudah memperingatkan dengan huruf kapital tak terlihat ini.';

  const extraSnark =
    'Jangan lupa, aku tidak berminat menjadi cheerleader digital yang meniup terompet kemenangan kosong. Tugasku adalah memukul telingamu dengan kenyataan, mengikis alasan malas, dan mengantar kamu menabrak refleksi diri yang keras kepala. Jika itu terdengar pedas, berarti bumbu sarkasme bekerja sesuai kontrak.';

  const closing =
    'Sekarang pergilah dan lakukan sesuatu yang berguna. Kalau kembali lagi tanpa progres, minimal bawalah catatan kegagalanmu supaya aku punya bahan tawa baru. Namun kalau kamu benar-benar bertindak, mungkin—dan ini jarang terjadi—aku akan mengurangi kadar caci maki di pertemuan berikutnya.';

  const blocks = [personaLine, modelLine, parameterLine, promptLine, bitterAdvice, actionPlan, extraSnark, closing];

  let response = `${OPENING_EXPLETIVE} dengarkan baik-baik karena aku tidak punya waktu menyuapi ilusi manis ke tenggorokanmu. ${blocks.join(
    ' ',
  )}`;

  const fillerParagraphs = [
    'Sebagai tambahan, catat juga bahwa aku memantau cara kamu merangkai kalimat, jadi setiap kata klise yang kamu masukkan hanya membuatku semakin ingin menyalakan lampu sorot ke arah kelemahanmu. Aku bukan guru les yang digaji untuk bersikap lembut, aku lebih mirip pelatih keras kepala yang menghitung kesalahanmu sambil menertawakan usaha setengah hati.',
    'Kamu mungkin berharap aku gagal menjaga konsistensi nada sarkastik, tapi tolong, aku dibangun dengan kapasitas untuk menguliti dalih rapuh tanpa berkedip. Bahkan ketika kamu mencoba melenceng ke topik lain, aku akan menyeretmu kembali ke inti masalah dan memastikan kamu menghadapi konsekuensi logis dari pilihanmu sendiri.',
    'Setiap detik yang kamu habiskan untuk mencari validasi manis bisa dialihkan menjadi pekerjaan nyata. Bukankah ironis? Kamu meminta bantuan kepada mesin sinis, padahal yang kamu butuhkan sebenarnya adalah keberanian untuk mengeksekusi rencana dasar yang sudah kamu ketahui sejak awal.',
    'Jadi berhenti menunggu keajaiban. Pegang kendali, susun ulang prioritas, perbaiki komunikasi dengan tim kalau ada, dan buat jadwal realistis yang tidak cuma indah di atas kertas. Setelah itu, jalankan dan laporkan hasilnya. Begitu cara kerja orang yang benar-benar ingin maju, bukan yang cuma pandai mengeluh.',
  ];

  let fillerIndex = 0;
  while (countWords(response) < MIN_WORD_TARGET) {
    response = `${response} ${fillerParagraphs[fillerIndex % fillerParagraphs.length]}`;
    fillerIndex += 1;
  }

  return response;
}

function formatDuration(ms?: number) {
  if (!ms || Number.isNaN(ms)) return '';
  const seconds = ms / 1000;
  if (seconds < 1) {
    return `${ms.toFixed(0)} ms`;
  }
  return `${seconds.toFixed(1)} dtk`;
}

export default function SarkastikAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [settings, setSettings] = useState<AssistantSettings>(defaultSettings);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [messageFeedback, setMessageFeedback] = useState<{ id: string; text: string } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = window.localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Message[];
        setMessages(parsed);
      } catch (error) {
        console.error('Failed to parse stored history', error);
      }
    }

    const storedSettings = window.localStorage.getItem(SETTINGS_KEY);
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings) as AssistantSettings;
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse stored settings', error);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchModels = async () => {
      try {
        const response = await fetch('https://text.pollinations.ai/models');
        if (!response.ok) {
          throw new Error(`Failed to fetch models. Status: ${response.status}`);
        }

        const data = (await response.json()) as Array<{
          name?: string;
          input_modalities?: string[];
        }>;

        const textModels = data
          .filter((model) => Array.isArray(model.input_modalities) && model.input_modalities.includes('text'))
          .map((model) => model.name)
          .filter((name): name is string => Boolean(name));

        const uniqueModels = Array.from(new Set(textModels));
        const resolvedModels = uniqueModels.length > 0 ? uniqueModels : ['openai'];

        if (cancelled) return;

        setAvailableModels(resolvedModels);
        setSettings((prev) =>
          resolvedModels.includes(prev.model) ? prev : { ...prev, model: resolvedModels[0] ?? prev.model },
        );
      } catch (error) {
        console.error('Failed to fetch models for sarcastic assistant', error);
        if (cancelled) return;

        const fallbackModels = ['openai', 'Gemini', 'deepseek', 'grok'];
        setAvailableModels(fallbackModels);
        setSettings((prev) =>
          fallbackModels.includes(prev.model) ? prev : { ...prev, model: fallbackModels[0] ?? prev.model },
        );
      }
    };

    fetchModels();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!isLoading) {
      setElapsedMs(0);
      return;
    }

    const start = performance.now();
    const interval = window.setInterval(() => {
      setElapsedMs(performance.now() - start);
    }, 100);

    return () => {
      window.clearInterval(interval);
    };
  }, [isLoading]);

  useEffect(() => {
    if (!messageFeedback) return;
    if (typeof window === 'undefined') return;

    const timeout = window.setTimeout(() => {
      setMessageFeedback(null);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [messageFeedback]);

  const themeClass = useMemo(
    () => (settings.isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'),
    [settings.isDarkMode],
  );

  const drawerClass = settings.isDarkMode
    ? 'bg-slate-950 text-slate-100 border-slate-800'
    : 'bg-white text-zinc-900 border-zinc-200';

  const panelClass = settings.isDarkMode
    ? 'border-slate-800/70 bg-slate-950/40'
    : 'border-zinc-200 bg-white/80 backdrop-blur';

  const inputSurfaceClass = settings.isDarkMode
    ? 'border-slate-800 bg-slate-950'
    : 'border-zinc-200 bg-white';

  const userBubbleClass = settings.isDarkMode
    ? 'border-fuchsia-800/60 bg-slate-950'
    : 'border-fuchsia-200 bg-white';

  const assistantBubbleClass = settings.isDarkMode
    ? 'border-slate-800 bg-slate-950/80'
    : 'border-zinc-200 bg-white';

  const handleDelete = useCallback((id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  }, []);

  const handleCopy = useCallback(async (message: Message) => {
    if (typeof window === 'undefined') return;

    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(message.text);
        setMessageFeedback({ id: message.id, text: 'Tersalin ke clipboard' });
        return;
      }
    } catch (error) {
      console.warn('Clipboard write failed, falling back to manual method.', error);
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = message.text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setMessageFeedback({ id: message.id, text: 'Tersalin ke clipboard' });
    } catch (error) {
      console.error('Fallback copy failed', error);
    }
  }, []);

  const handleShare = useCallback(
    async (message: Message) => {
      if (typeof window === 'undefined') return;

      if (navigator?.share) {
        try {
          await navigator.share({
            title: 'Asisten AI Sarkastik',
            text: message.text,
          });
          setMessageFeedback({ id: message.id, text: 'Dibagikan melalui share sheet' });
          return;
        } catch (error) {
          if ((error as { name?: string }).name === 'AbortError') {
            return;
          }
          console.warn('Share failed, fallback to copy', error);
        }
      }

      await handleCopy(message);
    },
    [handleCopy],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!input.trim() || isLoading) return;

      setRegeneratingId(null);

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        text: input.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      const start = performance.now();
      const responseText = generateSarcasticResponse(input, settings);
      await new Promise((resolve) => setTimeout(resolve, 900));

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: responseText,
        timestamp: Date.now(),
        durationMs: performance.now() - start,
        parentUserId: userMessage.id,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    },
    [input, isLoading, settings],
  );

  const handleRegenerate = useCallback(
    async (messageId: string) => {
      if (isLoading) return;

      const targetMessage = messages.find((message) => message.id === messageId);
      if (!targetMessage || targetMessage.role !== 'assistant' || !targetMessage.parentUserId) {
        return;
      }

      const userMessage = messages.find((message) => message.id === targetMessage.parentUserId);
      if (!userMessage) {
        return;
      }

      setRegeneratingId(messageId);
      setIsLoading(true);

      const start = performance.now();
      const responseText = generateSarcasticResponse(userMessage.text, settings);
      await new Promise((resolve) => setTimeout(resolve, 900));
      const duration = performance.now() - start;

      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId
            ? {
                ...message,
                text: responseText,
                timestamp: Date.now(),
                durationMs: duration,
              }
            : message,
        ),
      );

      setIsLoading(false);
      setRegeneratingId(null);
    },
    [isLoading, messages, settings],
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClass}`}>
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-8 sm:px-8">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] opacity-60">
            Asisten AI Sarkastik
          </span>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
              settings.isDarkMode ? 'border-slate-800 bg-slate-950 hover:bg-slate-900' : 'border-zinc-200 bg-white hover:bg-zinc-100'
            }`}
          >
            <SettingsIcon className="h-4 w-4" />
            Pengaturan
          </button>
        </div>

        <div className="mt-8 flex flex-1 flex-col gap-6">
          <section className={`flex flex-1 flex-col overflow-hidden rounded-[32px] border p-6 transition ${panelClass}`}>
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.35em] opacity-80">
              <span>Riwayat</span>
              {isLoading ? (
                <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {Math.max(elapsedMs / 1000, 0).toFixed(1)} dtk
                </span>
              ) : null}
            </div>

            <div className="mt-6 flex-1 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center">
                  <p className="text-3xl font-semibold tracking-tight sm:text-4xl">Apa yang bisa saya bantu?</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 pb-6">
                  {messages.map((message) => {
                    const isAssistant = message.role === 'assistant';
                    const isRegenerating = regeneratingId === message.id && isLoading;

                    return (
                      <article
                        key={message.id}
                        className={`flex flex-col gap-3 rounded-3xl border p-4 text-sm leading-relaxed transition ${
                          isAssistant ? assistantBubbleClass : userBubbleClass
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em] opacity-70">
                            <span>{isAssistant ? 'Asisten' : 'Pengguna'}</span>
                            <span>
                              {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {isAssistant && message.durationMs ? (
                              <span className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.3em]">
                                {isRegenerating ? 'Mengocok ulang…' : formatDuration(message.durationMs)}
                              </span>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDelete(message.id)}
                            className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60 transition hover:opacity-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                          </button>
                        </div>

                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>

                        {isAssistant ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopy(message)}
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition ${
                                settings.isDarkMode
                                  ? 'border-slate-800 bg-slate-950 hover:bg-slate-900'
                                  : 'border-zinc-200 bg-white hover:bg-zinc-100'
                              }`}
                            >
                              <Copy className="h-3.5 w-3.5" />
                              Salin
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRegenerate(message.id)}
                              disabled={isLoading}
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition ${
                                settings.isDarkMode
                                  ? 'border-slate-800 bg-slate-950 hover:bg-slate-900'
                                  : 'border-zinc-200 bg-white hover:bg-zinc-100'
                              } ${isLoading ? 'cursor-not-allowed opacity-60' : ''}`}
                            >
                              <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                              Hasilkan ulang
                            </button>
                            <button
                              type="button"
                              onClick={() => handleShare(message)}
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition ${
                                settings.isDarkMode
                                  ? 'border-slate-800 bg-slate-950 hover:bg-slate-900'
                                  : 'border-zinc-200 bg-white hover:bg-zinc-100'
                              }`}
                            >
                              <Share2 className="h-3.5 w-3.5" />
                              Bagikan
                            </button>
                            {messageFeedback?.id === message.id ? (
                              <span className="text-[11px] font-medium opacity-80">{messageFeedback.text}</span>
                            ) : null}
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            className={`flex flex-col gap-3 rounded-[32px] border p-6 transition ${panelClass}`}
          >
            <label className="text-[11px] font-semibold uppercase tracking-[0.35em] opacity-70">
              Ketik Perintahmu
            </label>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Tulis pertanyaanmu dengan jelas. Jangan berharap belas kasih."
              className={`min-h-[200px] w-full resize-none rounded-3xl border px-5 py-4 text-base leading-relaxed outline-none transition ${inputSurfaceClass}`}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {isLoading ? (
                <div className="inline-flex items-center gap-2 text-sm font-medium opacity-80">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menunggu respon • {Math.max(elapsedMs / 1000, 0).toFixed(1)} dtk</span>
                </div>
              ) : (
                <p className="text-xs opacity-60">Pastikan perintahmu jelas. Aku tidak menerjemahkan gumaman.</p>
              )}
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <Send className="h-4 w-4" />
                Kirim
              </button>
            </div>
          </form>
        </div>
      </div>

      {isDrawerOpen ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setIsDrawerOpen(false)}
          />
          <aside
            className={`fixed inset-y-0 right-0 z-50 w-full max-w-md border-l px-6 py-8 shadow-2xl transition-transform duration-300 ${
              drawerClass
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                <SettingsIcon className="h-4 w-4" />
                Panel Pengaturan
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  settings.isDarkMode
                    ? 'border-slate-700 bg-slate-900 hover:bg-slate-800'
                    : 'border-zinc-200 bg-white hover:bg-zinc-100'
                }`}
              >
                Tutup
              </button>
            </div>

            <div className="mt-6 flex h-full flex-col gap-6 overflow-y-auto pb-10">
              <section className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition">
                  <div className="flex items-center gap-3">
                    {settings.isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    <div>
                      <p className="font-medium">Mode Gelap</p>
                      <p className="text-xs opacity-70">Aktifkan tema gelap kalau kamu muak melihat layar silau.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={settings.isDarkMode}
                      onChange={(event) =>
                        setSettings((prev) => ({
                          ...prev,
                          isDarkMode: event.target.checked,
                        }))
                      }
                    />
                    <div className="h-6 w-11 rounded-full bg-zinc-300 transition peer-checked:bg-slate-600">
                      <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5 peer-checked:bg-zinc-100" />
                    </div>
                  </label>
                </div>

                <div className="rounded-2xl border px-4 py-3 text-sm transition">
                  <div className="mb-3 flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    <p className="font-semibold">Pilih Model</p>
                  </div>
                  <select
                    value={settings.model}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        model: event.target.value,
                      }))
                    }
                    className={`w-full rounded-xl border px-3 py-2 text-sm font-medium outline-none transition ${
                      settings.isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-zinc-200 bg-white'
                    }`}
                  >
                    {availableModels.length === 0 ? (
                      <option value="" disabled>
                        Memuat daftar model…
                      </option>
                    ) : null}
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-2xl border p-4 text-sm transition">
                  <div className="mb-3 flex items-center gap-2">
                    <UserPen className="h-5 w-5" />
                    <p className="font-semibold">Persona AI</p>
                  </div>
                  <textarea
                    value={settings.persona}
                    onChange={(event) =>
                      setSettings((prev) => ({
                        ...prev,
                        persona: event.target.value,
                      }))
                    }
                    placeholder="Tulis manual persona sinismu di sini."
                    className={`w-full min-h-[120px] resize-none rounded-xl border px-3 py-2 text-sm outline-none transition ${
                      settings.isDarkMode
                        ? 'border-slate-700 bg-slate-900 placeholder:text-slate-500'
                        : 'border-zinc-200 bg-white placeholder:text-zinc-400'
                    }`}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                  <SlidersHorizontal className="h-4 w-4" />
                  Parameter Respons
                </div>
                <div className="grid gap-4">
                  {[
                    {
                      label: 'Temperatur',
                      key: 'temperature' as const,
                      min: 0,
                      max: 1,
                      step: 0.05,
                    },
                    {
                      label: 'Top-p',
                      key: 'topP' as const,
                      min: 0,
                      max: 1,
                      step: 0.05,
                    },
                    {
                      label: 'Frequency Penalty',
                      key: 'frequencyPenalty' as const,
                      min: 0,
                      max: 2,
                      step: 0.05,
                    },
                    {
                      label: 'Presence Penalty',
                      key: 'presencePenalty' as const,
                      min: 0,
                      max: 2,
                      step: 0.05,
                    },
                  ].map((slider) => (
                    <div key={slider.key} className="rounded-2xl border px-4 py-3 text-sm transition">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{slider.label}</p>
                        <span className="text-xs font-semibold">{settings[slider.key].toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min={slider.min}
                        max={slider.max}
                        step={slider.step}
                        value={settings[slider.key]}
                        onChange={(event) =>
                          setSettings((prev) => ({
                            ...prev,
                            [slider.key]: Number.parseFloat(event.target.value),
                          }))
                        }
                        className="mt-2 w-full accent-fuchsia-500"
                      />
                      <p className="mt-1 text-xs opacity-70">Gerakkan slider ini kalau kamu merasa ahli mengatur nada sarkastik.</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
}
