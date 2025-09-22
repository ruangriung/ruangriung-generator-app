'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Loader2,
  MessageCircleQuestion,
  Wand2,
  ClipboardList,
  CircleAlert,
  Send,
  Undo2,
  ArrowLeft,
  Moon,
  Sun,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AdBanner } from '@/components/AdBanner';
import { PROMPT_TOP_AD_SLOT } from '@/lib/adsense';

interface PollinationsModel {
  id?: string;
  name?: string;
  description?: string;
  displayName?: string;
  family?: string;
  tags?: string[];
  capabilities?: string[];
}

interface ModelOption {
  id: string;
  name: string;
  description?: string;
}

interface KeywordResult {
  term: string;
  description: string;
}

interface PollinationsResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

const KEYWORD_COUNT = 20;

const FALLBACK_MODELS: ModelOption[] = [
  { id: 'openai', name: 'OpenAI GPT-4o Mini', description: 'Model generalis cepat untuk teks kreatif.' },
  { id: 'deepseek', name: 'DeepSeek V3', description: 'Model kreatif dengan nuansa deskriptif yang kuat.' },
  { id: 'mistral', name: 'Mistral Small 3.1', description: 'Ringan namun pintar dalam eksplorasi ide visual.' },
  { id: 'grok', name: 'xAI Grok-3 Mini', description: 'Peka terhadap gaya unik dan permainan kata.' },
  { id: 'phi', name: 'Phi-4 Mini Instruct', description: 'Ahli dalam gaya naratif ringkas.' },
];

const POLLINATIONS_TEXT_API_BASE_URL = 'https://text.pollinations.ai';
const POLLINATIONS_MODELS_ENDPOINT = `${POLLINATIONS_TEXT_API_BASE_URL}/models`;
const POLLINATIONS_OPENAI_ENDPOINT = `${POLLINATIONS_TEXT_API_BASE_URL}/openai`;
const POLLINATIONS_TOKEN = process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN?.trim();
const POLLINATIONS_REFERRER = 'ruangriung.my.id';

const getPollinationsQueryParam = () => {
  if (POLLINATIONS_TOKEN) {
    return { name: 'token', value: POLLINATIONS_TOKEN } as const;
  }

  return { name: 'referrer', value: POLLINATIONS_REFERRER } as const;
};

const buildPollinationsUrl = (baseUrl: string) => {
  try {
    const url = new URL(baseUrl);
    const { name, value } = getPollinationsQueryParam();
    url.searchParams.set(name, value);
    return url.toString();
  } catch (error) {
    console.warn('Gagal membangun URL Pollinations:', error);
    const { name, value } = getPollinationsQueryParam();
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}${name}=${encodeURIComponent(value)}`;
  }
};

const getPollinationsAuthHeaders = (hasJsonBody: boolean) => {
  const headers: Record<string, string> = {};
  if (hasJsonBody) {
    headers['Content-Type'] = 'application/json';
  }
  if (POLLINATIONS_TOKEN) {
    headers.Authorization = `Bearer ${POLLINATIONS_TOKEN}`;
  }
  return headers;
};

const shouldEnforceDefaultTemperature = (modelId: string) => {
  const normalized = modelId.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  return normalized.includes('azure') || normalized.includes('openai');
};

const getSafeTemperature = (modelId: string, desired: number) => {
  if (Number.isNaN(desired)) {
    return undefined;
  }

  return shouldEnforceDefaultTemperature(modelId) ? undefined : desired;
};

const sanitizeModels = (models: unknown): ModelOption[] => {
  if (!Array.isArray(models)) {
    return [];
  }

  const cleaned: ModelOption[] = [];
  const seen = new Set<string>();

  models.forEach((model) => {
    const item = model as PollinationsModel;
    const id = item.id || item.name || item.displayName;
    if (!id) {
      return;
    }

    if (seen.has(id)) {
      return;
    }

    seen.add(id);

    cleaned.push({
      id,
      name: item.name || item.displayName || id,
      description: item.description,
    });
  });

  return cleaned;
};

const tryParseJsonKeywords = (text: string): KeywordResult[] => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    return [];
  }

  const jsonCandidate = text.slice(start, end + 1);

  try {
    const parsed = JSON.parse(jsonCandidate);
    const keywordArray = Array.isArray(parsed)
      ? parsed
      : Array.isArray((parsed as { keywords?: unknown }).keywords)
        ? (parsed as { keywords: unknown[] }).keywords
        : Array.isArray((parsed as { items?: unknown }).items)
          ? (parsed as { items: unknown[] }).items
          : [];

    return keywordArray
      .map((item) => {
        if (typeof item !== 'object' || item === null) {
          return null;
        }

        const keywordItem = item as { term?: unknown; keyword?: unknown; name?: unknown; description?: unknown; detail?: unknown; explanation?: unknown };
        const rawTerm = keywordItem.term || keywordItem.keyword || keywordItem.name;
        if (!rawTerm) {
          return null;
        }

        const term = String(rawTerm).trim();
        if (!term) {
          return null;
        }

        const rawDescription = keywordItem.description || keywordItem.detail || keywordItem.explanation || '';
        const description = String(rawDescription).trim() || 'Deskripsi singkat belum tersedia.';

        return { term, description };
      })
      .filter((item): item is KeywordResult => Boolean(item));
  } catch (error) {
    console.warn('Gagal mengurai respons JSON:', error);
    return [];
  }
};

const parseKeywordResponse = (content: string): KeywordResult[] => {
  if (!content) {
    return [];
  }

  const trimmed = content.trim();
  let keywords = tryParseJsonKeywords(trimmed);

  if (keywords.length === 0) {
    const lines = trimmed.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    const seen = new Set<string>();

    keywords = lines
      .map((line) => {
        const withoutIndex = line
          .replace(/^\d+\s*\.?\s*/, '')
          .replace(/^[\-\*•]\s*/, '')
          .trim();

        if (!withoutIndex) {
          return null;
        }

        const separators = [' — ', ' – ', ' - ', ' : ', ': ', ' —', ' –', ' -'];
        let term = withoutIndex;
        let description = '';

        for (const separator of separators) {
          if (withoutIndex.includes(separator)) {
            const [left, ...rest] = withoutIndex.split(separator);
            term = left.trim();
            description = rest.join(separator).trim();
            break;
          }
        }

        if (!description) {
          const match = withoutIndex.match(/^(.*?)\s{2,}(.*)$/);
          if (match) {
            term = match[1].trim();
            description = match[2].trim();
          }
        }

        if (!description && term.includes('. ')) {
          const [possibleTerm, ...rest] = term.split(/\.\s+/);
          description = rest.join('. ').trim();
          term = possibleTerm.trim();
        }

        if (!term) {
          return null;
        }

        const normalizedTerm = term.replace(/"/g, '').trim();
        if (!normalizedTerm) {
          return null;
        }

        const normalizedKey = normalizedTerm.toLowerCase();
        if (seen.has(normalizedKey)) {
          return null;
        }

        seen.add(normalizedKey);

        return {
          term: normalizedTerm,
          description: description || 'Eksplorasi visual tanpa deskripsi eksplisit.',
        };
      })
      .filter((item): item is KeywordResult => Boolean(item));
  }

  return keywords.slice(0, KEYWORD_COUNT);
};

const formatKeywordsForClipboard = (items: KeywordResult[]) =>
  items
    .map((item, index) => `${index + 1}. ${item.term} — ${item.description}`)
    .join('\n');

const KeywordGeneratorClient = () => {
  const [models, setModels] = useState<ModelOption[]>([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const [creativeBrief, setCreativeBrief] = useState('');
  const [stylisticHints, setStylisticHints] = useState('');

  const [results, setResults] = useState<KeywordResult[]>([]);
  const [rawContent, setRawContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<Date | null>(null);

  const [question, setQuestion] = useState('');
  const [qaHistory, setQaHistory] = useState<Array<{ question: string; answer: string }>>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const storedTheme = window.localStorage.getItem('theme');

    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      return;
    }

    if (storedTheme === 'light') {
      setIsDarkMode(false);
      return;
    }

    setIsDarkMode(root.classList.contains('dark'));
  }, []);

  const toggleDarkMode = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    setIsDarkMode((previous) => {
      const next = !previous;
      const root = document.documentElement;

      if (next) {
        root.classList.add('dark');
        window.localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        window.localStorage.setItem('theme', 'light');
      }

      return next;
    });
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      setIsLoadingModels(true);
      setModelError(null);
      try {
        const response = await fetch(buildPollinationsUrl(POLLINATIONS_MODELS_ENDPOINT), {
          headers: getPollinationsAuthHeaders(false),
        });
        if (!response.ok) {
          throw new Error(`Gagal memuat model (${response.status})`);
        }

        const data = await response.json();
        const parsedModels = sanitizeModels(data);

        if (parsedModels.length === 0) {
          throw new Error('Daftar model kosong.');
        }

        setModels(parsedModels);
        setSelectedModel(parsedModels.find((model) => model.id === 'openai')?.id || parsedModels[0].id);
      } catch (error) {
        console.error('Kesalahan memuat model:', error);
        setModelError('Tidak dapat memuat model dari Pollinations. Menggunakan opsi cadangan.');
        setModels(FALLBACK_MODELS);
        setSelectedModel('openai');
      } finally {
        setIsLoadingModels(false);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    if (results.length === 0) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const scrollTimeout = window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);

    return () => window.clearTimeout(scrollTimeout);
  }, [results.length]);

  const selectedModelDetail = useMemo(
    () => models.find((model) => model.id === selectedModel),
    [models, selectedModel],
  );

  const buildInstruction = useCallback(
    ({ nonce, previousKeywords }: { nonce: string; previousKeywords: KeywordResult[] }) => {
      const intro = `Buat daftar ${KEYWORD_COUNT} kata kunci baru yang terasa eksperimental untuk pengujian prompt gambar. Kata kunci harus terdengar benar-benar baru, memancing rasa ingin tahu, dan membantu mengeksplorasi arah visual yang segar.`;
      const rules = [
        'Jawab dalam bahasa Indonesia.',
        'Hasilkan variasi struktur: beberapa kata tunggal, beberapa gabungan dua kata, dan beberapa menggabungkan kata sebelumnya dengan modifikasi kreatif (mis. menggunakan tanda hubung atau penggabungan).',
        'Pastikan seluruh kata kunci terasa langka, eksperimental, atau seperti istilah baru yang siap diuji dalam prompt.',
        'Untuk setiap kata kunci, sertakan deskripsi singkat maksimal 18 kata yang menggambarkan visual atau suasana yang bisa dijadikan prompt.',
        'Gunakan format JSON dengan struktur: {"keywords": [{"term": "...", "description": "..."}, ...]}. Tidak ada teks lain di luar JSON.',
        'Jangan ulangi kosakata umum yang sudah sering digunakan dalam prompt populer.',
      ];

      if (previousKeywords.length > 0) {
        const seenTerms = previousKeywords.map((item) => `"${item.term}"`).join(', ');
        rules.push(
          `Jangan tampilkan ulang kata kunci yang pernah diberikan sebelumnya: ${seenTerms}. Buatlah istilah baru yang benar-benar berbeda.`,
        );
      } else {
        rules.push('Pastikan kumpulan kata kunci kali ini berbeda dari permintaan sebelumnya dan terasa segar.');
      }

      const contextParts = [];

      if (creativeBrief.trim()) {
        contextParts.push(`Tema atau fokus utama yang wajib tercermin: ${creativeBrief.trim()}`);
      }

      if (stylisticHints.trim()) {
        contextParts.push(`Elemen tambahan yang boleh diadaptasi: ${stylisticHints.trim()}`);
      }

      const context = contextParts.length > 0
        ? `Pertimbangkan konteks tambahan berikut:\n- ${contextParts.join('\n- ')}`
        : 'Bebas mengeksplorasi selama kata kunci tetap segar dan relevan untuk uji coba prompt.';

      const randomnessSignal = `Kode permintaan acak: ${nonce}. Gunakan sebagai penanda internal agar hasil setiap kali regenerasi tetap unik.`;

      return `${intro}\n\nAturan keluaran:\n- ${rules.join('\n- ')}\n\n${context}\n\n${randomnessSignal}`;
    },
    [creativeBrief, stylisticHints],
  );

  const handleGenerate = useCallback(async () => {
    if (!selectedModel) {
      toast.error('Model belum siap.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setCopiedTerm(null);

    const nonce =
      typeof window !== 'undefined' && typeof window.crypto?.randomUUID === 'function'
        ? window.crypto.randomUUID()
        : `req-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const instruction = buildInstruction({ nonce, previousKeywords: results });

    try {
      const payload: Record<string, unknown> = {
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content:
              'Anda adalah kurator kata kunci eksperimental yang terus menemukan istilah baru untuk pengetesan prompt visual. Selalu patuhi format yang diminta dan pastikan hasil dapat langsung disalin.',
          },
          { role: 'user', content: instruction },
        ],
        max_tokens: 1200,
      };

      const generationTemperature = getSafeTemperature(selectedModel, 0.95);
      if (typeof generationTemperature === 'number') {
        payload.temperature = generationTemperature;
      }

      const response = await fetch(buildPollinationsUrl(POLLINATIONS_OPENAI_ENDPOINT), {
        method: 'POST',
        headers: getPollinationsAuthHeaders(true),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Pollinations mengembalikan kesalahan: ${errorText}`);
      }

      const data = (await response.json()) as PollinationsResponse;
      const content = data.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('Respons model kosong.');
      }

      const parsedKeywords = parseKeywordResponse(content);

      if (parsedKeywords.length === 0) {
        throw new Error('Tidak dapat mengurai kata kunci dari respons model.');
      }

      setResults(parsedKeywords);
      setRawContent(content);
      setLastGeneratedAt(new Date());
      toast.success('Berhasil membuat kata kunci unik!');
    } catch (error) {
      console.error('Gagal membuat kata kunci:', error);
      const rawMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tak dikenal.';
      const normalized = rawMessage.toLowerCase();
      const friendlyMessage = normalized.includes('temperature')
        ? 'Model ini hanya mendukung pengaturan suhu default. Coba ulangi tanpa mengganti model atau pilih opsi berbeda.'
        : rawMessage;
      setGenerationError(friendlyMessage);
      toast.error('Gagal membuat kata kunci.');
    } finally {
      setIsGenerating(false);
    }
  }, [buildInstruction, results, selectedModel]);

  const handleCopyTerm = useCallback((item: KeywordResult) => {
    const text = `${item.term} — ${item.description}`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedTerm(item.term);
        toast.success('Kata kunci disalin!');
        setTimeout(() => setCopiedTerm(null), 1800);
      })
      .catch(() => {
        toast.error('Tidak dapat menyalin ke clipboard.');
      });
  }, []);

  const handleCopyAll = useCallback(() => {
    if (results.length === 0) {
      toast.error('Belum ada kata kunci untuk disalin.');
      return;
    }

    const text = formatKeywordsForClipboard(results);
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success('Semua kata kunci berhasil disalin!');
      })
      .catch(() => {
        toast.error('Gagal menyalin seluruh kata kunci.');
      });
  }, [results]);

  const handleReset = () => {
    setResults([]);
    setRawContent('');
    setGenerationError(null);
    setCopiedTerm(null);
    setLastGeneratedAt(null);
  };

  const handleAskModel = useCallback(async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      toast.error('Tulis pertanyaan atau kebutuhan tambahan terlebih dahulu.');
      return;
    }

    if (!selectedModel) {
      toast.error('Model belum siap.');
      return;
    }

    setIsAsking(true);
    setAskError(null);

    try {
      const payload: Record<string, unknown> = {
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content:
              'Anda adalah asisten singkat untuk brainstorming prompt visual. Jawab padat, fokus pada ide kreatif yang bisa ditindaklanjuti.',
          },
          { role: 'user', content: trimmedQuestion },
        ],
        max_tokens: 600,
      };

      const askTemperature = getSafeTemperature(selectedModel, 0.85);
      if (typeof askTemperature === 'number') {
        payload.temperature = askTemperature;
      }

      const response = await fetch(buildPollinationsUrl(POLLINATIONS_OPENAI_ENDPOINT), {
        method: 'POST',
        headers: getPollinationsAuthHeaders(true),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Pollinations mengembalikan kesalahan: ${errorText}`);
      }

      const data = (await response.json()) as PollinationsResponse;
      const content = data.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('Respons model kosong.');
      }

      setQaHistory((prev) => [
        ...prev.slice(-4),
        { question: trimmedQuestion, answer: content },
      ]);
      setQuestion('');
    } catch (error) {
      console.error('Gagal mengirim pertanyaan:', error);
      const rawMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tak dikenal.';
      const normalized = rawMessage.toLowerCase();
      const friendlyMessage = normalized.includes('temperature')
        ? 'Model ini hanya menerima suhu default saat sesi tanya jawab. Silakan coba lagi atau ganti model yang berbeda.'
        : rawMessage;
      setAskError(friendlyMessage);
      toast.error('Tidak dapat menjawab pertanyaan.');
    } finally {
      setIsAsking(false);
    }
  }, [question, selectedModel]);

  const darkModeToggleClasses = isDarkMode
    ? 'bg-amber-300/90 text-gray-900 hover:bg-amber-200'
    : 'bg-gray-900 text-white hover:bg-gray-800';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-gray-800 shadow-neumorphic transition hover:bg-white dark:bg-dark-neumorphic-light dark:text-gray-200 dark:shadow-dark-neumorphic"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-neumorphic transition ${darkModeToggleClasses} dark:shadow-dark-neumorphic`}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
          </button>
        </div>

        <section className="rounded-3xl bg-light-bg p-8 shadow-neumorphic dark:bg-dark-bg dark:shadow-dark-neumorphic">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-purple-700 shadow dark:bg-dark-neumorphic-light/70 dark:text-purple-200">
                  <Sparkles className="h-4 w-4" />
                  Unique Art Name Lab
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl">
                  20 Gaya Visual Eksperimental AI untuk Mewujudkan Gambar yang Tidak Pernah Anda Bayangkan
                </h1>
                <p className="max-w-2xl text-base text-gray-700 dark:text-gray-300">
                  Selamat datang di Unique Art Name Lab — ruang eksperimen visual yang dirancang untuk merangsang kreativitas dan memperkaya imajinasi. Di sini Anda dapat menghasilan istilah visual style yang orisinal dan eksperimental, yang dapat menjadi bahan pemicu kuat untuk prompt-generasi karya seni digital.
                </p>
              </div>
              <div className="rounded-2xl bg-white/60 p-5 shadow-inner dark:bg-dark-neumorphic-light/70">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Status Model</p>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {isLoadingModels ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Memuat model...
                    </span>
                  ) : (
                    <span>
                      Menggunakan{' '}
                      <span className="font-semibold text-purple-700 dark:text-purple-300">
                        {selectedModelDetail?.name || 'Model cadangan'}
                      </span>
                      .
                    </span>
                  )}
                </div>
                {modelError ? (
                  <p className="mt-3 inline-flex items-start gap-2 rounded-xl bg-red-100/70 px-3 py-2 text-xs font-medium text-red-700 dark:bg-red-500/20 dark:text-red-200">
                    <CircleAlert className="mt-0.5 h-4 w-4" />
                    {modelError}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Hasilkan Visual Style untuk Uji Prompt</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Klik tombol di bawah ini untuk memanggil {KEYWORD_COUNT} istilah Visual Style eksperimental lengkap dengan deskripsi kilatnya — setiap kombinasi dibuat acak agar setiap kali kamu mencoba, selalu muncul gagasan baru yang mengejutkan dan membangkitkan inspirasi!
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-400"
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {isGenerating ? 'Sedang membuat...' : 'Generate Visual Style'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-neumorphic transition hover:bg-gray-50 dark:bg-dark-neumorphic-light dark:text-gray-200 dark:shadow-dark-neumorphic"
                >
                  <Undo2 className="h-4 w-4" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/90 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-500"
                >
                  <Copy className="h-4 w-4" />
                  Salin Semua
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200" htmlFor="model-select">
                  Pilih Model Teks
                </label>
                <div className="relative">
                  <select
                    id="model-select"
                    value={selectedModel}
                    onChange={(event) => setSelectedModel(event.target.value)}
                    disabled={isLoadingModels || models.length === 0}
                    className="w-full appearance-none rounded-2xl border-0 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-neumorphic dark:bg-dark-neumorphic-light dark:text-gray-100 dark:shadow-dark-neumorphic focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {models.length === 0 ? (
                      <option>Memuat model...</option>
                    ) : (
                      models.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-purple-600">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                </div>
                {selectedModelDetail?.description ? (
                  <p className="mt-3 rounded-2xl bg-white/70 p-3 text-xs text-gray-600 shadow-inner dark:bg-dark-neumorphic-light/70 dark:text-gray-300">
                    {selectedModelDetail.description}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200" htmlFor="creative-brief">
                    Tema Utama (Opsional)
                  </label>
                  <textarea
                    id="creative-brief"
                    value={creativeBrief}
                    onChange={(event) => setCreativeBrief(event.target.value)}
                    placeholder="Contoh: Dunia mesin waktu berdebu dengan pengaruh arsitektur Nusantara kuno"
                    className="min-h-[92px] w-full resize-none rounded-2xl border-0 bg-white px-4 py-3 text-sm text-gray-800 shadow-neumorphic-inset dark:bg-dark-neumorphic-light dark:text-gray-100 dark:shadow-dark-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200" htmlFor="stylistic-hints">
                    Arah Gaya / Hal Khusus (Opsional)
                  </label>
                  <textarea
                    id="stylistic-hints"
                    value={stylisticHints}
                    onChange={(event) => setStylisticHints(event.target.value)}
                    placeholder="Contoh: campuran kata kunci bilingual, sedikit sentuhan art deco, fokus pada pencahayaan remang"
                    className="min-h-[92px] w-full resize-none rounded-2xl border-0 bg-white px-4 py-3 text-sm text-gray-800 shadow-neumorphic-inset dark:bg-dark-neumorphic-light dark:text-gray-100 dark:shadow-dark-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {generationError ? (
              <div className="rounded-2xl border border-red-300 bg-red-50/80 p-4 text-sm text-red-700 dark:border-red-500/60 dark:bg-red-500/10 dark:text-red-200">
                {generationError}
              </div>
            ) : null}

            <div ref={resultsRef}>
              {results.length > 0 ? (
                <div className="space-y-6 rounded-3xl bg-white/80 p-6 shadow-neumorphic dark:bg-dark-neumorphic-light dark:shadow-dark-neumorphic">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {results.length} kata kunci siap pakai{' '}
                      {lastGeneratedAt
                        ? `• Dibuat ${lastGeneratedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
                        : ''}
                    </p>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600/90 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-400"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Regenerasi
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {results.map((item, index) => (
                      <div
                        key={item.term}
                        className="group flex h-full flex-col justify-between rounded-3xl bg-white/80 p-5 text-gray-800 shadow-neumorphic dark:bg-dark-neumorphic-light dark:text-gray-100 dark:shadow-dark-neumorphic"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-purple-600/80 dark:text-purple-300/90">
                                #{index + 1}
                              </p>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{item.term}</h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyTerm(item)}
                              className="rounded-full bg-purple-600/10 p-2 text-purple-600 transition hover:bg-purple-600 hover:text-white dark:bg-purple-500/10 dark:text-purple-200"
                            >
                              {copiedTerm === item.term ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border-2 border-dashed border-purple-300/60 bg-white/60 p-10 text-center text-sm text-gray-600 dark:border-purple-500/40 dark:bg-dark-neumorphic-light/60 dark:text-gray-300">
                  Hasil kata kunci akan tampil di sini setelah kamu menekan tombol <span className="font-semibold text-purple-700 dark:text-purple-300">Generate</span>. Kamu bisa memasukkan tema khusus untuk memengaruhi karakter kata.
                </div>
              )}
            </div>

            {rawContent ? (
              <details className="rounded-2xl bg-white/70 p-5 shadow-inner dark:bg-dark-neumorphic-light/70">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Lihat respons mentah dari model
                </summary>
                <pre className="mt-4 whitespace-pre-wrap break-words rounded-2xl bg-gray-900/90 p-4 text-xs text-purple-100">
                  {rawContent}
                </pre>
              </details>
            ) : null}

            <div className="rounded-3xl bg-gradient-to-br from-purple-600/90 to-indigo-600/80 p-6 text-purple-50 shadow-neumorphic dark:shadow-dark-neumorphic">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Cara Kerja Cepat</h2>
                <ul className="space-y-3 text-sm leading-relaxed">
                  <li className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 text-amber-200" />
                    <span>Pilih model teks favoritmu atau gunakan default untuk keseimbangan kecepatan dan kreativitas.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Wand2 className="mt-0.5 h-5 w-5 text-amber-200" />
                    <span>Tambahkan tema dan gaya opsional untuk menyesuaikan citra visual yang ingin dibangun.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ClipboardList className="mt-0.5 h-5 w-5 text-amber-200" />
                    <span>Tekan tombol &ldquo;Generate&rdquo; untuk memperoleh 20 kata kunci uji prompt lengkap beserta deskripsi.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MessageCircleQuestion className="mt-0.5 h-5 w-5 text-amber-200" />
                    <span>Gunakan panel pertanyaan di bawah untuk berdiskusi cepat atau meminta variasi tambahan.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm backdrop-blur">
                <p>
                  Butuh kata kunci lain? Simpan hasilnya terlebih dahulu, lalu kreasikan kembali dengan tema berbeda. Kombinasi kata yang unik akan membantu model gambar memahami nuansa yang kamu bayangkan.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-light-bg p-6 shadow-neumorphic dark:bg-dark-bg dark:shadow-dark-neumorphic">
          <div className="rounded-2xl bg-white/75 p-4 shadow-inner dark:bg-dark-neumorphic-light/70">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Dukungan Kreativitas</p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              Iklan berikut membantu menjaga pengembangan fitur eksperimen prompt tetap berjalan.
            </p>
            <AdBanner
              className="mt-4 w-full overflow-hidden rounded-xl"
              dataAdSlot={PROMPT_TOP_AD_SLOT}
              dataFullWidthResponsive="true"
            />
          </div>
        </section>

        <section className="rounded-3xl bg-light-bg p-8 shadow-neumorphic dark:bg-dark-bg dark:shadow-dark-neumorphic">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Panel Pertanyaan Kilat</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Ajukan pertanyaan atau minta variasi tambahan menggunakan model yang sama. Jawaban akan tersimpan agar mudah kamu telaah.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Contoh: Beri 3 ide bagaimana menggabungkan dua kata kunci pertama menjadi prompt sinematik."
              className="min-h-[120px] flex-1 resize-none rounded-2xl border-0 bg-white px-4 py-3 text-sm text-gray-800 shadow-neumorphic-inset dark:bg-dark-neumorphic-light dark:text-gray-100 dark:shadow-dark-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={handleAskModel}
              disabled={isAsking}
              className="inline-flex items-center justify-center gap-2 self-end rounded-2xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-400"
            >
              {isAsking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {isAsking ? 'Mengirim...' : 'Tanyakan Model'}
            </button>
          </div>

          {askError ? (
            <div className="mt-4 rounded-2xl border border-red-300 bg-red-50/80 p-3 text-sm text-red-700 dark:border-red-500/60 dark:bg-red-500/10 dark:text-red-200">
              {askError}
            </div>
          ) : null}

          {qaHistory.length > 0 ? (
            <div className="mt-6 space-y-5">
              {qaHistory.map((item, index) => (
                <div
                  key={`${item.question}-${index}`}
                  className="rounded-3xl bg-white/80 p-5 shadow-neumorphic dark:bg-dark-neumorphic-light dark:shadow-dark-neumorphic"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-300">
                    Pertanyaan #{index + 1}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-100">{item.question}</p>
                  <div className="mt-3 rounded-2xl bg-gray-900/90 p-4 text-sm text-purple-100 dark:bg-gray-900">
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-white/70 p-4 text-sm text-gray-600 shadow-inner dark:bg-dark-neumorphic-light/70 dark:text-gray-300">
              Belum ada percakapan tambahan. Gunakan panel ini untuk eksplorasi lanjutan atau klarifikasi instruksi prompt.
            </p>
          )}
        </section>
      </div>
    </div>
  );

};

export default KeywordGeneratorClient;
