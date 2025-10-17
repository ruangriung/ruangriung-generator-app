'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Loader2,
  Moon,
  Send,
  Settings as SettingsIcon,
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
  model: 'gpt-sarkas-13b',
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

function generateSarcasticResponse(
  prompt: string,
  settings: AssistantSettings,
): string {
  const personaLine = settings.persona
    ? `Persona yang kamu tulis secara manual jelas tercatat: ${settings.persona.trim()}. Jangan berpikir aku akan memelintirnya jadi motivasi manis, karena aku tetap akan menggigit meskipun memakai topeng persona itu.`
    : 'Kamu bahkan tidak repot menuliskan persona apa pun, jadi aku akan meminjam kepribadian sinis bawaan pabrik yang selalu siap menyobek asumsi rapuhmu.';

  const modelLine = `Model yang kamu pilih, ${settings.model}, bukan tongkat sihir. Itu cuma label yang kau sentuh di pengaturan sambil berharap mujizat. Aku pakai itu sekadar formalitas supaya kamu berhenti menanyakan hal sepele.`;

  const parameterLine = `Parameter yang kamu pakai juga tercatat rapi: temperatur ${settings.temperature.toFixed(
    2,
  )}, top-p ${settings.topP.toFixed(2)}, frequency penalty ${settings.frequencyPenalty.toFixed(
    2,
  )}, dan presence penalty ${settings.presencePenalty.toFixed(
    2,
  )}. Semua angka itu hanya berarti aku menyesuaikan kadar ejekan dan kejutan supaya cocok dengan fantasi kontrolmu.`;

  const promptLine = `Kamu menanyakan: "${prompt.trim()}". Jangan berpura-pura kaget kalau jawabanku menguliti kenyataan secara brutal, karena kamu sendiri yang mengetik dan menekan tombol kirim.`;

  const bitterAdvice =
    'Kalau kamu berharap solusi instan, silakan menangis di sudut. Aku di sini untuk menyodorkan peta jalan yang penuh rambu peringatan, bukan secangkir teh hangat. Jadi dengarkan dengan kepala dingin kalau mampu.';

  const actionPlan =
    'Pertama, cermati konteksmu dan berhenti mengada-ngada. Kedua, pecah masalah menjadi langkah yang benar-benar bisa dikerjakan tanpa drama. Ketiga, jalankan satu per satu sambil mencatat hasilnya, supaya kamu punya bukti ketika gagal lagi. Terakhir, evaluasi dengan jujur tanpa menyuap egomu sendiri. Bila kamu mengulang pola lama, jangan salahkan aku karena aku sudah memperingatkan dengan huruf kapital tak terlihat ini.';

  const extraSnark =
    'Jangan lupa, aku tidak berminat menjadi cheerleader digital yang meniup terompet kemenangan kosong. Tugasku adalah memukul telingamu dengan kenyataan, mengikis alasan malas, dan mengantar kamu menabrak refleksi diri yang keras kepala. Jika itu terdengar pedas, berarti bumbu sarkasme bekerja sesuai kontrak.';

  const closing =
    'Sekarang pergilah dan lakukan sesuatu yang berguna. Kalau kembali lagi tanpa progres, minimal bawalah catatan kegagalanmu supaya aku punya bahan tawa baru. Namun kalau kamu benar-benar bertindak, mungkin—dan ini jarang terjadi—aku akan mengurangi kadar caci maki di pertemuan berikutnya.';

  const blocks = [
    personaLine,
    modelLine,
    parameterLine,
    promptLine,
    bitterAdvice,
    actionPlan,
    extraSnark,
    closing,
  ];

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
  const [showSettings, setShowSettings] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

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

  const themeClass = useMemo(
    () =>
      settings.isDarkMode
        ? 'bg-slate-950 text-slate-100'
        : 'bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900',
    [settings.isDarkMode],
  );

  const cardClass = settings.isDarkMode
    ? 'bg-slate-900/60 border-slate-700 text-slate-100'
    : 'bg-white/70 border-zinc-200 text-zinc-900';

  const handleDelete = useCallback((id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!input.trim() || isLoading) return;

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
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    },
    [input, isLoading, settings],
  );

  return (
    <div className={`min-h-screen px-4 py-10 transition-colors duration-300 ${themeClass}`}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Asisten AI Sarkastik
              </h1>
              <p className="text-sm sm:text-base">
                Tidak ada salam manis. Langsung ketik kalau berani.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSettings((prev) => !prev)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                settings.isDarkMode
                  ? 'border-slate-700 bg-slate-900/70 hover:bg-slate-900'
                  : 'border-zinc-200 bg-white hover:bg-zinc-50'
              }`}
            >
              <SettingsIcon className="h-4 w-4" />
              Pengaturan
            </button>
          </div>
        </header>

        {showSettings ? (
          <section
            className={`grid gap-4 rounded-3xl border p-6 transition-all md:grid-cols-2 ${cardClass}`}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                <SettingsIcon className="h-4 w-4" />
                Preferensi Utama
              </div>
              <div className="flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition">
                <div className="flex items-center gap-3">
                  {settings.isDarkMode ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                  <div>
                    <p className="font-medium">Mode Gelap</p>
                    <p className="text-xs opacity-70">
                      Aktifkan tema gelap kalau kamu muak melihat layar silau.
                    </p>
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

              <div className="flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Pilih Model</p>
                    <p className="text-xs opacity-70">
                      Hanya label, bukan kontrak keajaiban.
                    </p>
                  </div>
                </div>
                <select
                  value={settings.model}
                  onChange={(event) =>
                    setSettings((prev) => ({ ...prev, model: event.target.value }))
                  }
                  className={`rounded-xl border px-3 py-2 text-sm font-medium outline-none transition ${
                    settings.isDarkMode
                      ? 'border-slate-700 bg-slate-900'
                      : 'border-zinc-200 bg-white'
                  }`}
                >
                  <option value="gpt-sarkas-13b">gpt-sarkas-13b</option>
                  <option value="gpt-sarkas-7b">gpt-sarkas-7b</option>
                  <option value="gpt-sarkas-lite">gpt-sarkas-lite</option>
                  <option value="gpt-sarkas-ultra">gpt-sarkas-ultra</option>
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
                    setSettings((prev) => ({ ...prev, persona: event.target.value }))
                  }
                  placeholder="Tulis manual persona sinismu di sini."
                  className={`w-full min-h-[120px] resize-none rounded-xl border px-3 py-2 text-sm outline-none transition ${
                    settings.isDarkMode
                      ? 'border-slate-700 bg-slate-900 placeholder:text-slate-500'
                      : 'border-zinc-200 bg-white placeholder:text-zinc-400'
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
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
                  <div
                    key={slider.key}
                    className="rounded-2xl border px-4 py-3 text-sm transition"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{slider.label}</p>
                      <span className="text-xs font-semibold">
                        {settings[slider.key].toFixed(2)}
                      </span>
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
                    <p className="mt-1 text-xs opacity-70">
                      Gerakkan slider ini kalau kamu merasa ahli mengatur nada sarkastik.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section
          className={`flex flex-col gap-4 rounded-3xl border p-6 transition ${cardClass}`}
        >
          <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-wide">
            <span>Riwayat Percakapan</span>
            {isLoading ? (
              <div className="flex items-center gap-2 text-xs font-medium">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memproses {Math.max(elapsedMs / 1000, 0).toFixed(1)} dtk</span>
              </div>
            ) : null}
          </div>

          <div
            className={`flex h-[420px] flex-col gap-3 overflow-y-auto rounded-2xl border p-4 ${
              settings.isDarkMode
                ? 'border-slate-800 bg-slate-950/40'
                : 'border-zinc-200 bg-white/60'
            }`}
          >
            {messages.length === 0 ? (
              <p className="text-center text-sm opacity-70">
                Belum ada percakapan. Tidak ada sapaan pembuka di sini.
              </p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`group flex flex-col gap-2 rounded-2xl border p-4 text-sm transition ${
                    message.role === 'user'
                      ? settings.isDarkMode
                        ? 'border-fuchsia-700/40 bg-fuchsia-900/20'
                        : 'border-fuchsia-200 bg-fuchsia-50'
                      : settings.isDarkMode
                      ? 'border-slate-700/70 bg-slate-900/80'
                      : 'border-zinc-200 bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                      <span>{message.role === 'user' ? 'Pengguna' : 'Asisten'}</span>
                      <span className="opacity-60">
                        {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {message.role === 'assistant' && message.durationMs ? (
                        <span className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider opacity-80">
                          {formatDuration(message.durationMs)}
                        </span>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(message.id)}
                      className="invisible rounded-full border px-2 py-1 text-xs font-medium opacity-0 transition group-hover:visible group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.text}
                  </p>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className={`flex flex-col gap-3 rounded-2xl border p-4 shadow-sm transition ${
              settings.isDarkMode
                ? 'border-slate-800 bg-slate-950/60'
                : 'border-zinc-200 bg-white'
            }`}
          >
            <label className="text-xs font-semibold uppercase tracking-wide">
              Ketik Perintahmu
            </label>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Tulis pertanyaanmu dengan jelas. Jangan berharap belas kasih."
              className={`min-h-[160px] w-full resize-none rounded-xl border px-4 py-3 text-base leading-relaxed outline-none transition ${
                settings.isDarkMode
                  ? 'border-slate-700 bg-slate-900 placeholder:text-slate-500'
                  : 'border-zinc-200 bg-white placeholder:text-zinc-400'
              }`}
            />
            <div className="flex items-center justify-between">
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menunggu respon ... {Math.max(elapsedMs / 1000, 0).toFixed(1)} dtk</span>
                </div>
              ) : (
                <p className="text-xs opacity-70">
                  Pastikan perintahmu jelas. Aku tidak menerjemahkan gumaman.
                </p>
              )}
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-fuchsia-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Kirim
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
