'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Sparkles,
  Type as TypeIcon,
  Copy,
  Check,
  RefreshCcw,
  Palette,
  Wand2,
  ChevronDown,
  Info,
  Target,
  SlidersHorizontal,
  PenSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ButtonSpinner from '@/components/ButtonSpinner';

type ModelOption = {
  id: string;
  name: string;
  description?: string;
};

type PollinationsChoice = {
  message?: {
    content?: string;
  };
};

type PollinationsResponse = {
  choices?: PollinationsChoice[];
};

type FontSuggestion = {
  name: string;
  category?: string;
  description?: string;
  useCase?: string;
  pairing?: string;
  cssSnippet?: string;
  downloadLink?: string;
  notes?: string;
};

type FontPlan = {
  summary?: string;
  voiceAndTone?: string;
  colorPalette: string[];
  fonts: FontSuggestion[];
  pairingIdeas: string[];
  usageTips: string[];
  rawText: string;
};

const POLLINATIONS_TEXT_API_BASE_URL = 'https://text.pollinations.ai';
const POLLINATIONS_MODELS_ENDPOINT = `${POLLINATIONS_TEXT_API_BASE_URL}/models`;
const POLLINATIONS_OPENAI_ENDPOINT = `${POLLINATIONS_TEXT_API_BASE_URL}/openai`;
const POLLINATIONS_TOKEN = process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN?.trim();
const POLLINATIONS_REFERRER = 'ruangriung.my.id';

const FALLBACK_MODELS: ModelOption[] = [
  { id: 'openai', name: 'OpenAI GPT-4o Mini', description: 'Respons cepat dan seimbang untuk teks kreatif.' },
  { id: 'mistral', name: 'Mistral Small 3.1', description: 'Alternatif ringan dengan respon ringkas.' },
  { id: 'deepseek', name: 'DeepSeek V3', description: 'Model kreatif dengan penjelasan deskriptif.' },
  { id: 'grok', name: 'xAI Grok-3 Mini', description: 'Cocok untuk eksplorasi gaya eksperimental.' },
];

const toneDescriptions: Record<string, string> = {
  modern: 'Tone modern, bersih, minimalis, cocok untuk brand digital dan teknologi.',
  humanis: 'Tone humanis, ramah, dan organik untuk brand yang dekat dengan komunitas.',
  elegan: 'Tone elegan, mewah, dan premium untuk brand high-end.',
  berani: 'Tone berani, eksperimental, dan kontras tinggi untuk brand kreatif.',
  klasik: 'Tone klasik dan terpercaya, menonjolkan kesan heritage.',
};

const useCasePrompts: Record<string, string> = {
  'Konten Media Sosial': 'Konten media sosial (Instagram, TikTok, carousel, video pendek).',
  'Branding Logo & Identitas': 'Logo, identitas visual utama, dan materi brand kit.',
  'UI/UX & Produk Digital': 'UI/UX aplikasi, dashboard digital, dan produk SaaS.',
  'Poster & Event': 'Poster event, flyer, undangan acara, dan materi kampanye.',
  'Dokumen Profesional': 'Presentasi, proposal, whitepaper, dan dokumen profesional.',
};

const buildPollinationsUrl = (baseUrl: string) => {
  const paramName = POLLINATIONS_TOKEN ? 'token' : 'referrer';
  const paramValue = POLLINATIONS_TOKEN ?? POLLINATIONS_REFERRER;

  try {
    const url = new URL(baseUrl);
    url.searchParams.set(paramName, paramValue);
    return url.toString();
  } catch (error) {
    console.warn('Gagal membangun URL layanan teks internal:', error);
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}${paramName}=${encodeURIComponent(paramValue)}`;
  }
};

const getPollinationsHeaders = (hasJsonBody: boolean) => {
  const headers: Record<string, string> = {};
  if (hasJsonBody) {
    headers['Content-Type'] = 'application/json';
  }
  if (POLLINATIONS_TOKEN) {
    headers.Authorization = `Bearer ${POLLINATIONS_TOKEN}`;
  }
  return headers;
};

const sanitizeModels = (models: unknown): ModelOption[] => {
  if (!Array.isArray(models)) {
    return [];
  }

  const seen = new Set<string>();

  return models.reduce<ModelOption[]>((accumulator, current) => {
    if (!current || typeof current !== 'object') {
      return accumulator;
    }

    const item = current as { id?: unknown; name?: unknown; displayName?: unknown; description?: unknown };
    const idCandidate = item.id ?? item.name ?? item.displayName;

    if (typeof idCandidate !== 'string' || !idCandidate.trim()) {
      return accumulator;
    }

    const id = idCandidate.trim();
    if (seen.has(id)) {
      return accumulator;
    }
    seen.add(id);

    const nameCandidate = item.displayName ?? item.name ?? id;
    const name = typeof nameCandidate === 'string' && nameCandidate.trim()
      ? nameCandidate.trim()
      : id;

    const description = typeof item.description === 'string' ? item.description.trim() : undefined;

    accumulator.push({ id, name, description });
    return accumulator;
  }, []);
};

const extractJsonBlock = (content: string) => {
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }
  return content.slice(start, end + 1);
};

const normalizeTextValue = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  return undefined;
};

const sanitizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        const trimmed = item.trim();
        return trimmed.length > 0 ? trimmed : null;
      }
      if (typeof item === 'number') {
        return String(item);
      }
      if (item && typeof item === 'object' && 'text' in item) {
        const textValue = (item as { text?: unknown }).text;
        return typeof textValue === 'string' ? textValue.trim() : null;
      }
      return null;
    })
    .filter((item): item is string => Boolean(item && item.length > 0));
};

const sanitizeColorPalette = (value: unknown): string[] => {
  const colors = sanitizeStringArray(value);
  return colors.map((color) => color.toUpperCase()).slice(0, 10);
};

const sanitizeFontItem = (item: unknown): FontSuggestion | null => {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const candidate = item as Record<string, unknown>;
  const nameCandidate = candidate.name ?? candidate.font ?? candidate.title;
  const name = normalizeTextValue(nameCandidate);

  if (!name) {
    return null;
  }

  const category =
    normalizeTextValue(candidate.category ?? candidate.style ?? candidate.family ?? candidate.type) ?? undefined;
  const description =
    normalizeTextValue(
      candidate.description ?? candidate.summary ?? candidate.reason ?? candidate.inspiration ?? candidate.detail,
    ) ?? undefined;
  const useCase =
    normalizeTextValue(candidate.useCase ?? candidate.application ?? candidate.bestFor ?? candidate.context) ?? undefined;
  const pairing = normalizeTextValue(candidate.pairing ?? candidate.pair ?? candidate.match ?? candidate.secondary) ?? undefined;
  const cssSnippet =
    normalizeTextValue(candidate.cssSnippet ?? candidate.css ?? candidate.cssExample ?? candidate.stylesheet) ?? undefined;
  const downloadLink = normalizeTextValue(candidate.download ?? candidate.link ?? candidate.url ?? candidate.source) ?? undefined;
  const notes = normalizeTextValue(candidate.notes ?? candidate.additional ?? candidate.extra ?? candidate.comment) ?? undefined;

  return {
    name,
    category,
    description,
    useCase,
    pairing,
    cssSnippet,
    downloadLink,
    notes,
  };
};

const parseFontResponse = (content: string): FontPlan => {
  const fallback: FontPlan = {
    summary: undefined,
    voiceAndTone: undefined,
    colorPalette: [],
    fonts: [],
    pairingIdeas: [],
    usageTips: [],
    rawText: content,
  };

  const jsonBlock = extractJsonBlock(content);
  if (!jsonBlock) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(jsonBlock) as Record<string, unknown>;
    const fonts = Array.isArray(parsed.fonts)
      ? parsed.fonts
          .map(sanitizeFontItem)
          .filter((item): item is FontSuggestion => Boolean(item))
      : [];

    const summary = normalizeTextValue(parsed.summary ?? parsed.overview ?? parsed.intro);
    const voiceAndTone = normalizeTextValue(parsed.voiceAndTone ?? parsed.brandVoice ?? parsed.direction);
    const pairingIdeas = sanitizeStringArray(parsed.pairingIdeas ?? parsed.pairings ?? parsed.combinations);
    const usageTips = sanitizeStringArray(parsed.usageTips ?? parsed.tips ?? parsed.guidelines);
    const colorPalette = sanitizeColorPalette(parsed.colorPalette ?? parsed.palette ?? parsed.colors ?? parsed.swatches);

    return {
      summary,
      voiceAndTone,
      colorPalette,
      fonts,
      pairingIdeas,
      usageTips,
      rawText: content,
    };
  } catch (error) {
    console.warn('Gagal mengurai respons font dari layanan teks internal:', error);
    return fallback;
  }
};

export default function FontGeneratorClient() {
  const [models, setModels] = useState<ModelOption[]>(FALLBACK_MODELS);
  const [selectedModel, setSelectedModel] = useState('openai');
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const [brandName, setBrandName] = useState('');
  const [brandTagline, setBrandTagline] = useState('');
  const [brandPersonality, setBrandPersonality] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [primaryUseCase, setPrimaryUseCase] = useState<keyof typeof useCasePrompts>('Konten Media Sosial');
  const [visualDirection, setVisualDirection] = useState('');
  const [languageSupport, setLanguageSupport] = useState('Indonesia & Inggris');
  const [specialNotes, setSpecialNotes] = useState('');
  const [tone, setTone] = useState<keyof typeof toneDescriptions>('modern');
  const [fontCount, setFontCount] = useState(4);
  const [includePairing, setIncludePairing] = useState(true);
  const [includeSpacingTips, setIncludeSpacingTips] = useState(true);
  const [temperature, setTemperature] = useState(0.7);

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<FontPlan | null>(null);
  const [showRawText, setShowRawText] = useState(false);
  const [copiedCssIndex, setCopiedCssIndex] = useState<number | null>(null);
  const [rawCopied, setRawCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchModels = async () => {
      setIsLoadingModels(true);
      setModelError(null);

      try {
        const response = await fetch(buildPollinationsUrl(POLLINATIONS_MODELS_ENDPOINT), {
          headers: getPollinationsHeaders(false),
        });

        if (!response.ok) {
          throw new Error(`Gagal memuat model (${response.status})`);
        }

        const data = await response.json();
        const parsed = sanitizeModels(data);

        if (!isMounted) {
          return;
        }

        if (parsed.length === 0) {
          throw new Error('Daftar model kosong.');
        }

        setModels(parsed);
        if (!parsed.some((item) => item.id === selectedModel)) {
          setSelectedModel(parsed[0]?.id ?? 'openai');
        }
      } catch (error) {
        console.error('Kesalahan memuat model dari layanan teks internal:', error);
        if (!isMounted) {
          return;
        }
        setModelError('Tidak dapat memuat katalog model utama. Menggunakan opsi cadangan.');
        setModels(FALLBACK_MODELS);
        if (!FALLBACK_MODELS.some((item) => item.id === selectedModel)) {
          setSelectedModel('openai');
        }
      } finally {
        if (isMounted) {
          setIsLoadingModels(false);
        }
      }
    };

    fetchModels();

    return () => {
      isMounted = false;
    };
  }, [selectedModel]);

  const systemPrompt = useMemo(() => {
    const pairingRequirement = includePairing
      ? 'Isi field "pairing" dengan nama font pendamping yang saling melengkapi.'
      : 'Isi field "pairing" dengan string kosong jika tidak diperlukan.';

    const spacingRequirement = includeSpacingTips
      ? 'Sertakan rekomendasi ringkas tentang tracking, leading, atau penggunaan huruf kapital dalam "usageTips".'
      : 'Fokus pada konteks penggunaan tanpa perlu detail teknis spacing kecuali sangat relevan.';

    return `Kamu adalah konsultan tipografi senior untuk brand di Indonesia. Susun rekomendasi font profesional yang mudah diakses (prioritaskan Google Fonts atau foundry populer). Gunakan format JSON persis dengan struktur berikut:
{
  "summary": "ringkasan singkat (maks 2 kalimat)",
  "voiceAndTone": "deskripsi arah tipografi yang disarankan",
  "colorPalette": ["#HEX"],
  "fonts": [
    {
      "name": "Nama Font",
      "category": "Sans-serif / Serif / Display / Script / Mono",
      "description": "Alasan font ini cocok",
      "useCase": "Contoh penggunaan utama",
      "pairing": "Nama font pendamping atau kosong",
      "cssSnippet": "Snippet CSS/@import siap pakai",
      "downloadLink": "URL resmi",
      "notes": "Catatan opsional"
    }
  ],
  "pairingIdeas": ["Saran kombinasi tambahan"],
  "usageTips": ["Tips implementasi praktis"]
}
${pairingRequirement}
${spacingRequirement}
Jika font berbayar, jelaskan pada "description". Gunakan bahasa Indonesia.`;
  }, [includePairing, includeSpacingTips]);

  const buildUserPrompt = useCallback(() => {
    const details: string[] = [];

    details.push(`Nama brand: ${brandName || 'Belum ditentukan'}`);
    if (brandTagline.trim()) {
      details.push(`Tagline / slogan: ${brandTagline.trim()}`);
    }
    if (brandPersonality.trim()) {
      details.push(`Kepribadian brand: ${brandPersonality.trim()}`);
    }
    if (targetAudience.trim()) {
      details.push(`Audiens utama: ${targetAudience.trim()}`);
    }

    const useCaseDescription = useCasePrompts[primaryUseCase] ?? primaryUseCase;
    details.push(`Konteks utama: ${useCaseDescription}`);

    if (visualDirection.trim()) {
      details.push(`Arah visual / moodboard: ${visualDirection.trim()}`);
    }

    if (languageSupport.trim()) {
      details.push(`Dukungan bahasa: ${languageSupport.trim()}`);
    }

    const toneDescription = toneDescriptions[tone] ?? tone;
    details.push(`Preferensi tone tipografi: ${toneDescription}`);

    details.push(`Jumlah rekomendasi font unik yang diminta: ${fontCount}.`);
    details.push(`Perlu pasangan font pendukung: ${includePairing ? 'Ya' : 'Tidak'}.`);
    details.push(
      `Butuh tips teknis implementasi seperti tracking/leading: ${includeSpacingTips ? 'Ya, sertakan ringkas' : 'Tidak perlu khusus'}.`,
    );

    if (specialNotes.trim()) {
      details.push(`Catatan tambahan: ${specialNotes.trim()}`);
    }

    details.push('Gunakan bahasa Indonesia dalam seluruh respons.');

    return details.join('\n');
  }, [
    brandName,
    brandTagline,
    brandPersonality,
    targetAudience,
    primaryUseCase,
    visualDirection,
    languageSupport,
    tone,
    fontCount,
    includePairing,
    includeSpacingTips,
    specialNotes,
  ]);

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!brandName.trim() && !brandPersonality.trim() && !visualDirection.trim()) {
      toast.error('Isi minimal satu detail brand agar AI dapat bekerja.');
      return;
    }

    setIsGenerating(true);
    setResult(null);
    setShowRawText(false);

    const payload = {
      model: selectedModel,
      temperature,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: buildUserPrompt() },
      ],
    };

    try {
      const response = await fetch(buildPollinationsUrl(POLLINATIONS_OPENAI_ENDPOINT), {
        method: 'POST',
        headers: getPollinationsHeaders(true),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Gagal memproses respons (${response.status})`);
      }

      const data: PollinationsResponse = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Konten AI kosong.');
      }

      const parsedResult = parseFontResponse(content);
      setResult(parsedResult);
      toast.success('Rekomendasi font berhasil dibuat!');
    } catch (error) {
      console.error('Kesalahan saat membuat rekomendasi font:', error);
      toast.error('Gagal membuat rekomendasi font. Coba lagi dalam beberapa saat.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetForm = () => {
    setBrandName('');
    setBrandTagline('');
    setBrandPersonality('');
    setTargetAudience('');
    setPrimaryUseCase('Konten Media Sosial');
    setVisualDirection('');
    setLanguageSupport('Indonesia & Inggris');
    setSpecialNotes('');
    setTone('modern');
    setFontCount(4);
    setIncludePairing(true);
    setIncludeSpacingTips(true);
    setTemperature(0.7);
    setResult(null);
    setShowRawText(false);
    setCopiedCssIndex(null);
    setRawCopied(false);
  };

  const handleCopyCss = (snippet: string, index: number) => {
    if (!snippet) {
      toast.error('Snippet CSS kosong.');
      return;
    }

    navigator.clipboard
      .writeText(snippet)
      .then(() => {
        setCopiedCssIndex(index);
        setTimeout(() => setCopiedCssIndex((current) => (current === index ? null : current)), 2000);
        toast.success('Snippet CSS berhasil disalin.');
      })
      .catch(() => {
        toast.error('Gagal menyalin snippet CSS.');
      });
  };

  const handleCopyRaw = () => {
    if (!result?.rawText) {
      toast.error('Tidak ada respons mentah untuk disalin.');
      return;
    }

    navigator.clipboard
      .writeText(result.rawText)
      .then(() => {
        setRawCopied(true);
        setTimeout(() => setRawCopied(false), 2000);
        toast.success('Respons mentah berhasil disalin.');
      })
      .catch(() => {
        toast.error('Gagal menyalin respons mentah.');
      });
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-10 rounded-3xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 text-lg font-semibold uppercase tracking-wide text-white/80">
              <TypeIcon className="h-7 w-7" />
              Generator Tipografi AI
            </div>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Susun Paket Font Profesional Dalam Hitungan Detik</h1>
            <p className="mt-3 max-w-3xl text-sm sm:text-base text-white/85">
              Hubungkan karakter brand Anda dengan model dari katalog AI internal. Masukkan konteks penggunaan, pilih model,
              dan dapatkan rekomendasi font lengkap dengan pairing, snippet CSS, serta tips implementasi.
            </p>
          </div>
          <div className="flex h-full items-center">
            <div className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-medium text-white/90 shadow-lg backdrop-blur">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span>Terintegrasi layanan teks internal</span>
              </div>
              <p className="mt-1 text-xs text-white/70">
                Token otomatis digunakan dari konfigurasi Vercel.
              </p>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={handleGenerate} className="space-y-8">
        <section className="rounded-3xl bg-light-bg p-6 shadow-neumorphic dark:bg-dark-bg dark:shadow-dark-neumorphic">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Detail Brand</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Berikan gambaran singkat tentang brand agar AI dapat memilih karakter tipografi yang tepat.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
              <Target className="h-4 w-4" /> Fokus Brand
            </span>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="brand-name">
                Nama brand
              </label>
              <input
                id="brand-name"
                value={brandName}
                onChange={(event) => setBrandName(event.target.value)}
                placeholder="Mis. RuangRiung Studio"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="brand-tagline">
                Tagline / slogan
              </label>
              <input
                id="brand-tagline"
                value={brandTagline}
                onChange={(event) => setBrandTagline(event.target.value)}
                placeholder="Mis. Personal branding untuk kreator lokal"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="brand-personality">
                Kepribadian brand
              </label>
              <textarea
                id="brand-personality"
                rows={3}
                value={brandPersonality}
                onChange={(event) => setBrandPersonality(event.target.value)}
                placeholder="Enerjik, optimistis, dekat dengan komunitas kreatif."
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="target-audience">
                Audiens utama
              </label>
              <textarea
                id="target-audience"
                rows={3}
                value={targetAudience}
                onChange={(event) => setTargetAudience(event.target.value)}
                placeholder="Kreator konten usia 20-30 tahun, aktif di media sosial, mencari konsistensi branding."
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-purple-500"
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-light-bg p-6 shadow-neumorphic dark:bg-dark-bg dark:shadow-dark-neumorphic">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Arah Kreatif</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Jelaskan kebutuhan visual dan konteks penggunaan untuk membantu AI memilih gaya tipografi terbaik.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
              <PenSquare className="h-4 w-4" /> Creative Brief
            </span>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="primary-use-case">
                Konteks utama penggunaan font
              </label>
              <div className="relative">
                <select
                  id="primary-use-case"
                  value={primaryUseCase}
                  onChange={(event) => setPrimaryUseCase(event.target.value as keyof typeof useCasePrompts)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                >
                  {Object.keys(useCasePrompts).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="language-support">
                Dukungan bahasa
              </label>
              <input
                id="language-support"
                value={languageSupport}
                onChange={(event) => setLanguageSupport(event.target.value)}
                placeholder="Indonesia & Inggris (Latin)"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="visual-direction">
                Arah visual / moodboard (opsional)
              </label>
              <textarea
                id="visual-direction"
                rows={4}
                value={visualDirection}
                onChange={(event) => setVisualDirection(event.target.value)}
                placeholder="Mis. palet warna pastel neon, gaya futuristik namun ramah, gunakan aksen bentuk organik."
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="special-notes">
                Catatan tambahan
              </label>
              <textarea
                id="special-notes"
                rows={3}
                value={specialNotes}
                onChange={(event) => setSpecialNotes(event.target.value)}
                placeholder="Mis. hindari font dengan lisensi rumit, sertakan fallback aman, atau sediakan opsi serif untuk heading."
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-purple-500"
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-light-bg p-6 shadow-neumorphic dark:bg-dark-bg dark:shadow-dark-neumorphic">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Pengaturan Lanjutan</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Atur jumlah rekomendasi, karakter tone, serta pilihan model teks yang akan digunakan.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
              <SlidersHorizontal className="h-4 w-4" /> Advanced Controls
            </span>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="tone">
                  Tone tipografi
                </label>
                <div className="relative">
                  <select
                    id="tone"
                    value={tone}
                    onChange={(event) => setTone(event.target.value as keyof typeof toneDescriptions)}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  >
                    {Object.keys(toneDescriptions).map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {toneDescriptions[tone]}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="font-count">
                  Jumlah rekomendasi font
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="font-count"
                    type="range"
                    min={2}
                    max={6}
                    value={fontCount}
                    onChange={(event) => setFontCount(Number(event.target.value))}
                    className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-purple-200"
                  />
                  <span className="w-10 text-right text-sm font-semibold text-purple-600 dark:text-purple-300">{fontCount}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Direkomendasikan 3-5 font agar paket tetap fokus dan mudah diterapkan.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="include-pairing">
                    Sertakan pasangan font pendukung
                  </label>
                  <button
                    type="button"
                    id="include-pairing"
                    onClick={() => setIncludePairing((current) => !current)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      includePairing ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                    aria-pressed={includePairing}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                        includePairing ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Aktifkan jika Anda ingin rekomendasi font pendamping untuk heading, body text, atau aksen.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="include-spacing">
                    Sertakan tips teknis (tracking, leading, dsb.)
                  </label>
                  <button
                    type="button"
                    id="include-spacing"
                    onClick={() => setIncludeSpacingTips((current) => !current)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      includeSpacingTips ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                    aria-pressed={includeSpacingTips}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                        includeSpacingTips ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Membantu tim desain memahami jarak huruf/baris atau kapitalisasi yang disarankan.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="model">
                  Pilih model teks AI
                </label>
                <div className="relative">
                  <select
                    id="model"
                    value={selectedModel}
                    onChange={(event) => setSelectedModel(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    disabled={isLoadingModels}
                  >
                    {models.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} {model.description ? `— ${model.description}` : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                </div>
                {isLoadingModels ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Memuat daftar model terbaru...</p>
                ) : modelError ? (
                  <p className="text-xs text-red-500 dark:text-red-400">{modelError}</p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Model dipanggil langsung dari katalog penyedia teks menggunakan token yang sama dengan konfigurasi aplikasi.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="temperature">
                  Eksplorasi ide (temperature)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="temperature"
                    type="range"
                    min={0}
                    max={12}
                    step={1}
                    value={Math.round(temperature * 10)}
                    onChange={(event) => setTemperature(Number(event.target.value) / 10)}
                    className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-purple-200"
                  />
                  <span className="w-12 text-right text-sm font-semibold text-purple-600 dark:text-purple-300">
                    {temperature.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Nilai rendah = stabil, nilai tinggi = eksploratif. 0.6–0.8 direkomendasikan untuk branding.
                </p>
              </div>

              <div className="rounded-2xl border border-dashed border-purple-300/60 bg-purple-50/70 p-4 text-sm text-purple-700 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-200">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0" />
                  <p>
                    Permintaan dikirim ke endpoint teks bawaan dengan Authorization token (jika tersedia) dan fallback referrer RuangRiung.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-80 dark:focus:ring-offset-gray-900"
          >
            {isGenerating ? (
              <>
                <ButtonSpinner />
                Memproses...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" />
                Buat Rekomendasi
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleResetForm}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-400 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:text-purple-300 dark:focus:ring-offset-gray-900"
          >
            <RefreshCcw className="h-5 w-5" />
            Reset
          </button>
        </div>
      </form>

      {result && (
        <section className="mt-10 space-y-6 rounded-3xl bg-white p-6 shadow-neumorphic dark:bg-gray-900 dark:shadow-dark-neumorphic">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Hasil Rekomendasi Tipografi</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Simpan kombinasi font favorit Anda atau langsung gunakan snippet CSS yang disediakan.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowRawText((current) => !current)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-purple-400 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:text-gray-300 dark:hover:border-purple-500 dark:hover:text-purple-300 dark:focus:ring-offset-gray-900"
              >
                <Info className="h-4 w-4" />
                {showRawText ? 'Sembunyikan JSON' : 'Lihat JSON mentah'}
              </button>
              <button
                type="button"
                onClick={handleCopyRaw}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-900"
              >
                {rawCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Salin JSON
              </button>
            </div>
          </div>

          {result.summary && (
            <div className="rounded-2xl border border-purple-200 bg-purple-50/80 p-5 text-sm text-purple-800 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-100">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-semibold uppercase tracking-wide text-xs text-purple-600 dark:text-purple-300">Ringkasan</p>
                  <p className="mt-1 leading-relaxed">{result.summary}</p>
                  {result.voiceAndTone && (
                    <p className="mt-2 text-xs text-purple-600/80 dark:text-purple-200/80">
                      Arah tipografi: {result.voiceAndTone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {result.colorPalette.length > 0 && (
            <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <Palette className="h-4 w-4" /> Palet warna rekomendasi
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {result.colorPalette.map((color) => (
                  <div
                    key={color}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 text-xs font-medium text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-8 w-8 rounded-full border border-gray-200 shadow-inner dark:border-gray-600"
                        style={{ backgroundColor: color }}
                      />
                      <span>{color}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.fonts.length > 0 && (
            <div className="space-y-4">
              {result.fonts.map((font, index) => (
                <article
                  key={`${font.name}-${index}`}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{font.name}</h3>
                      {font.category && (
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{font.category}</p>
                      )}
                    </div>
                    {font.downloadLink && (
                      <a
                        href={font.downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                      >
                        Kunjungi sumber
                      </a>
                    )}
                  </div>

                  {font.description && (
                    <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{font.description}</p>
                  )}

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {font.useCase && (
                      <div className="rounded-xl bg-gray-100/70 p-3 text-sm text-gray-700 dark:bg-gray-700/50 dark:text-gray-200">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">Penggunaan utama</p>
                        <p className="mt-1">{font.useCase}</p>
                      </div>
                    )}

                    {font.pairing && (
                      <div className="rounded-xl bg-gray-100/70 p-3 text-sm text-gray-700 dark:bg-gray-700/50 dark:text-gray-200">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">Pasangan disarankan</p>
                        <p className="mt-1">{font.pairing}</p>
                      </div>
                    )}
                  </div>

                  {font.notes && (
                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">Catatan: {font.notes}</p>
                  )}

                  {font.cssSnippet && (
                    <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-200">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Snippet CSS</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCss(font.cssSnippet ?? '', index)}
                          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-900"
                        >
                          {copiedCssIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          Salin CSS
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap break-words text-[11px] leading-relaxed">{font.cssSnippet}</pre>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          {result.pairingIdeas.length > 0 && (
            <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-700">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">Ide kombinasi tambahan</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
                {result.pairingIdeas.map((idea, index) => (
                  <li key={index}>{idea}</li>
                ))}
              </ul>
            </div>
          )}

          {result.usageTips.length > 0 && (
            <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-700">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">Tips implementasi</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
                {result.usageTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {showRawText && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-200">
              <pre className="whitespace-pre-wrap break-words">{result.rawText}</pre>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
