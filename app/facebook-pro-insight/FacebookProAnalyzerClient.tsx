'use client';
/* eslint-disable @next/next/no-img-element */

import {
  type ChangeEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Download,
  FileImage,
  Gauge,
  Image as ImageIcon,
  Info,
  Loader2,
  LucideIcon,
  Moon,
  Share2,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';

const POLLINATIONS_TEXT_ENDPOINT = 'https://text.pollinations.ai/openai';
const POLLINATIONS_MODELS_ENDPOINT = 'https://text.pollinations.ai/models';
const POLLINATIONS_TOKEN = process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN?.trim();

const ID_CURRENCY = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

type ThemeMode = 'light' | 'dark';

type PollinationsModel = string | { id: string; label?: string; name?: string };

type StructuredAnalysis = {
  overallScore: number;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  summary: string;
  recommendations: string[];
  algorithmHighlights: string[];
  monetization: {
    predictedCpm: number;
    predictedRpm: number;
    predictedCtr: number;
    revenueEstimate: string;
    monetizationPotential: 'Low' | 'Medium' | 'High';
    industryComparison: string;
    trendNarrative: string;
  };
  audience: {
    culturalRelevanceScore: number;
    languageAnalysis: string;
    localTrendAlignment: string;
    recommendations: string[];
    heatmap: string[];
  };
  contentQuality: {
    originalityScore: number;
    relevanceScore: number;
    visualQualityScore: number;
    insights: string;
    nicheAnalysis: string;
  };
  technical: {
    optimalPostingTimes: string[];
    hashtagRecommendations: string[];
    reachEstimates: {
      organic: string;
      paid: string;
    };
    frequency: string;
  };
  improvementSuggestions: string[];
  comparativeInsights: string[];
};

type AnalysisPayload = {
  title: string;
  description: string;
  type: string;
  audience: string;
  suggestions: string;
  toggles: AnalysisToggleState;
};

type AnalysisToggleKey = 'monetization' | 'audience' | 'quality' | 'technical';

type AnalysisToggleState = Record<AnalysisToggleKey, boolean>;

type VisualPlan = {
  presetId: string;
  mood: string;
  heroFocus: string;
  supportingVisuals: string[];
  colorPalette: string[];
  typography: string;
  ctaTone: string;
  captionIdeas: string[];
  highlight: string;
};

type ContentDraftSuggestion = {
  title: string;
  description: string;
  angle?: string;
};

function cleanCandidateString(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/^[\s"'`]+/, '')
    .replace(/["'`]+$/, '')
    .replace(/^[-•\d)]+\s*/, '')
    .trim();
}

function tryParseJson(input: string): any | null {
  try {
    return JSON.parse(input);
  } catch (error) {
    console.debug('JSON parse attempt failed', error);
    return null;
  }
}

function parseJsonLike(content: string): any | null {
  if (!content) return null;

  const normalizedQuotes = content
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');

  const fenceMatch = normalizedQuotes.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch?.[1]) {
    const parsed = tryParseJson(fenceMatch[1].trim());
    if (parsed) return parsed;
  }

  const firstBrace = normalizedQuotes.indexOf('{');
  const lastBrace = normalizedQuotes.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const snippet = normalizedQuotes.slice(firstBrace, lastBrace + 1).trim();
    const parsed = tryParseJson(snippet);
    if (parsed) return parsed;
  }

  return null;
}

function parseDraftFromText(content: string): ContentDraftSuggestion {
  if (!content) {
    return { title: '', description: '', angle: undefined };
  }

  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('```'))
    .map((line) => line.replace(/^[{\[]/, '').replace(/[}\]],?$/, '').trim())
    .filter(Boolean);

  let title = '';
  let description = '';
  let angle: string | undefined;
  const remainder: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.replace(/^[-•\d)]+\s*/, '').trim();
    const lower = line.toLowerCase();
    const colonIndex = line.indexOf(':');

    if (colonIndex !== -1) {
      const key = lower.slice(0, colonIndex).trim();
      const value = cleanCandidateString(line.slice(colonIndex + 1));

      if (!title && /(judul|title)/.test(key) && value) {
        title = value;
        continue;
      }

      if (!description && /(deskripsi|description|konten|isi)/.test(key) && value) {
        description = value;
        continue;
      }

      if (!angle && /(angle|pendekatan|hook)/.test(key) && value) {
        angle = value;
        continue;
      }
    }

    remainder.push(cleanCandidateString(line));
  }

  if (!title && remainder.length > 0) {
    title = remainder[0];
  }

  if (!description) {
    const descLines = remainder.slice(title ? 1 : 0).filter(Boolean);
    if (descLines.length > 0) {
      description = descLines.join(' ');
    }
  }

  if (!description && content) {
    description = cleanCandidateString(content);
  }

  return {
    title: title.trim(),
    description: description.trim(),
    angle: angle?.trim() || undefined,
  };
}

function coerceDraftSuggestion(candidate: unknown): ContentDraftSuggestion {
  if (!candidate || typeof candidate !== 'object') {
    return { title: '', description: '', angle: undefined };
  }

  const record = candidate as Record<string, unknown>;
  const title = cleanCandidateString(record.title);
  const description = cleanCandidateString(record.description);
  const angle = cleanCandidateString(record.angle);

  return {
    title,
    description,
    angle: angle || undefined,
  };
}

function extractNumericValue(input: string | undefined | null): number | null {
  if (!input) return null;
  const match = input.match(/[\d.,]+/);
  if (!match) return null;
  const normalized = match[0].replace(/\./g, '').replace(',', '.');
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

type VisualPreset = {
  id: string;
  keywords: string[];
  mood: string;
  heroFocus: string;
  supportingVisuals: string[];
  palette: string[];
  typography: string;
  ctaTone: string;
  captionIdeas: string[];
  highlightTemplate: string;
};

const VISUAL_PRESETS: VisualPreset[] = [
  {
    id: 'finance',
    keywords: ['finans', 'invest', 'bank', 'roi', 'keuangan', 'bisnis', 'modal'],
    mood: 'Profesional premium & terpercaya',
    heroFocus: 'Ilustrasi grafik pertumbuhan dan tim analis finansial dengan nuansa kantor modern.',
    supportingVisuals: [
      'Sorot angka utama atau KPI dalam kartu highlight.',
      'Gunakan ikonografi finansial (grafik batang, mata uang Rupiah).',
      'Tambahkan foto profesional dengan latar ruang rapat modern.',
    ],
    palette: ['#0f172a', '#22c55e', '#f59e0b', '#f1f5f9'],
    typography: 'Sans-serif modern dengan huruf tegas (contoh: Plus Jakarta Sans).',
    ctaTone: 'Tawarkan solusi investasi atau konsultasi dengan nada yakin dan data-driven.',
    captionIdeas: [
      'Tunjukkan ROI atau efisiensi biaya dalam angka yang mudah dipahami.',
      'Ajak audiens mengambil keputusan melalui sesi konsultasi singkat.',
      'Gunakan testimoni klien atau studi kasus singkat untuk memperkuat kepercayaan.',
    ],
    highlightTemplate: 'Tekankan {focus} dengan menampilkan metrik keuangan yang paling kuat.',
  },
  {
    id: 'education',
    keywords: ['edukasi', 'belajar', 'kelas', 'kursus', 'pelatihan', 'academy'],
    mood: 'Inspiratif & bersahabat',
    heroFocus: 'Visual mentor dan peserta workshop dengan elemen papan tulis atau layar interaktif.',
    supportingVisuals: [
      'Sisipkan ilustrasi langkah-langkah pembelajaran yang runtut.',
      'Gunakan foto aktivitas belajar dengan ekspresi antusias.',
      'Tambahkan ikon sertifikat atau badge pencapaian.',
    ],
    palette: ['#1d4ed8', '#f97316', '#facc15', '#e2e8f0'],
    typography: 'Font humanis dengan ketebalan medium (contoh: Inter, Poppins).',
    ctaTone: 'Ajak audiens mendaftar atau mencoba sesi demo dengan bahasa persuasif.',
    captionIdeas: [
      'Soroti manfaat langsung yang didapat peserta setelah mengikuti program.',
      'Gunakan testimoni singkat untuk menunjukkan hasil nyata.',
      'Tawarkan bonus materi atau workbook eksklusif.',
    ],
    highlightTemplate: 'Tonjolkan {focus} sebagai alasan utama mengikuti sesi belajar.',
  },
  {
    id: 'technology',
    keywords: ['teknologi', 'startup', 'digital', 'saas', 'platform', 'aplikasi', 'ai', 'otomasi'],
    mood: 'Futuristik & inovatif',
    heroFocus: 'Tampilan dashboard produk atau ilustrasi AI dengan cahaya neon lembut.',
    supportingVisuals: [
      'Gunakan mockup perangkat (mobile/desktop) untuk menunjukkan fitur utama.',
      'Tambahkan elemen garis grid atau partikel untuk nuansa teknologi.',
      'Sorot angka performa atau keamanan data.',
    ],
    palette: ['#312e81', '#6366f1', '#22d3ee', '#0f172a'],
    typography: 'Sans-serif geometris dengan aksen semi-bold (contoh: Rubik, Space Grotesk).',
    ctaTone: 'Dorong audiens mencoba demo atau fitur gratis dengan nada visioner.',
    captionIdeas: [
      'Tampilkan keunggulan teknologi dan dampaknya bagi bisnis.',
      'Jelaskan integrasi atau kompatibilitas dengan tools populer.',
      'Highlight keamanan dan kecepatan layanan.',
    ],
    highlightTemplate: 'Fokuskan {focus} sebagai bukti inovasi yang memudahkan audiens.',
  },
  {
    id: 'health',
    keywords: ['kesehatan', 'wellness', 'nutrisi', 'mental', 'hidup sehat', 'kebugaran'],
    mood: 'Segar & menenangkan',
    heroFocus: 'Visual close-up gaya hidup sehat dengan pencahayaan natural.',
    supportingVisuals: [
      'Gunakan elemen daun, air, atau gradient pastel untuk rasa sejuk.',
      'Tambahkan ikon ceklis untuk langkah praktis menjaga kesehatan.',
      'Sisipkan testimoni atau kutipan motivasi singkat.',
    ],
    palette: ['#15803d', '#34d399', '#fde68a', '#ecfdf5'],
    typography: 'Font rounded atau humanis (contoh: Nunito, Quicksand).',
    ctaTone: 'Ajak audiens memulai kebiasaan sehat dengan dukungan program Anda.',
    captionIdeas: [
      'Bagikan tips sederhana yang dapat dilakukan hari ini.',
      'Highlight sebelum-sesudah atau progress nyata pengguna.',
      'Tekankan komunitas pendukung atau akses konsultasi ahli.',
    ],
    highlightTemplate: 'Jelaskan {focus} untuk menunjukkan manfaat kesehatan yang mudah diterapkan.',
  },
  {
    id: 'lifestyle',
    keywords: ['gaya hidup', 'komunitas', 'event', 'travel', 'kuliner', 'retail', 'produk'],
    mood: 'Hangat & energik',
    heroFocus: 'Momen komunitas atau produk hero dengan ekspresi antusias.',
    supportingVisuals: [
      'Gunakan foto aktivitas nyata yang dekat dengan keseharian target audiens.',
      'Tambahkan pattern dinamis atau bentuk organik.',
      'Sorot benefit emosional seperti kebersamaan atau keseruan.',
    ],
    palette: ['#be123c', '#fb7185', '#f97316', '#fef2f2'],
    typography: 'Font sans-serif tegas dengan aksen display untuk judul.',
    ctaTone: 'Ajak audiens bergabung atau mencoba pengalaman langsung.',
    captionIdeas: [
      'Cerita singkat tentang pengalaman pelanggan terbaik.',
      'Soroti keunikan produk atau acara yang tidak boleh dilewatkan.',
      'Gunakan pertanyaan retoris untuk mendorong interaksi.',
    ],
    highlightTemplate: 'Angkat {focus} untuk menunjukkan nilai emosional yang kuat.',
  },
];

function selectVisualPreset(text: string): VisualPreset {
  const lowered = text.toLowerCase();
  for (const preset of VISUAL_PRESETS) {
    if (preset.keywords.some((keyword) => lowered.includes(keyword))) {
      return preset;
    }
  }
  return {
    id: 'default',
    keywords: [],
    mood: 'Modern & terarah',
    heroFocus: 'Visual hero menampilkan inti pesan dengan komposisi simetris dan tipografi kuat.',
    supportingVisuals: [
      'Gunakan kombinasi ikon dan angka kunci yang paling meyakinkan.',
      'Tambahkan foto manusia atau aktivitas yang mewakili audiens.',
      'Gunakan blok warna solid untuk memisahkan informasi utama.',
    ],
    palette: ['#0ea5e9', '#6366f1', '#facc15', '#f8fafc'],
    typography: 'Sans-serif modern dengan variasi ketebalan (contoh: Inter, Manrope).',
    ctaTone: 'Sampaikan ajakan yang jelas dan singkat sesuai tujuan konten.',
    captionIdeas: [
      'Perjelas manfaat utama dan tambahkan CTA langsung.',
      'Gunakan data atau fakta singkat untuk memperkuat klaim.',
      'Ajak audiens berinteraksi melalui pertanyaan pemicu.',
    ],
    highlightTemplate: 'Sorot {focus} sebagai pesan utama yang perlu diingat.',
  };
}

function extractKeywords(text: string, limit = 4): string[] {
  if (!text) return [];
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 3 && !['dalam', 'dengan', 'untuk', 'pada', 'yang', 'anda', 'kita'].includes(token));
  const counts = new Map<string, number>();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([token]) => token);
}

function buildVisualPlan(
  input: {
    title: string;
    description: string;
    suggestions: string;
    contentType: string;
    targetAudience: string;
    analysis: StructuredAnalysis | null;
  }
): VisualPlan {
  const combined = [input.title, input.description, input.suggestions].filter(Boolean).join(' ');
  const preset = selectVisualPreset(combined);
  const keywords = extractKeywords(combined);
  const focus = keywords.slice(0, 2).join(' & ') || input.contentType || 'kampanye utama';
  const audienceNote = input.analysis?.audience.localTrendAlignment || input.analysis?.summary || input.description;

  return {
    presetId: preset.id,
    mood: preset.mood,
    heroFocus: `${preset.heroFocus} Fokuskan pada ${focus.toLowerCase()} yang relevan untuk audiens ${
      input.targetAudience || 'Indonesia'
    }.`,
    supportingVisuals: preset.supportingVisuals,
    colorPalette: preset.palette,
    typography: preset.typography,
    ctaTone: preset.ctaTone,
    captionIdeas: preset.captionIdeas.map((idea) =>
      idea.replace('{audience}', input.targetAudience || 'audiens utama').replace('{focus}', focus)
    ),
    highlight: preset.highlightTemplate.replace('{focus}', focus).concat(
      audienceNote ? ` Pastikan narasi menyentuh konteks: ${audienceNote}` : ''
    ),
  };
}

type RevenueChartItem = {
  label: string;
  value: number;
  description?: string;
};

function RevenueBarChart({ data }: { data: RevenueChartItem[] }) {
  if (!data.length) {
    return null;
  }

  const maxValue = Math.max(...data.map((item) => item.value));
  if (maxValue <= 0) {
    return null;
  }

  return (
    <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
      {data.map((item) => {
        const percentage = Math.round((item.value / maxValue) * 100);
        return (
          <div key={item.label} className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-32 w-full items-end justify-center rounded-2xl bg-slate-100/70 p-2 shadow-inner dark:bg-slate-900/60">
              <div
                className="w-3/4 rounded-xl bg-gradient-to-b from-indigo-400 via-purple-500 to-pink-500"
                style={{ height: `${Math.max(8, percentage)}%` }}
                aria-hidden="true"
              />
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-slate-600 dark:text-slate-300">{item.label}</p>
              <p className="text-slate-500 dark:text-slate-400">{ID_CURRENCY.format(item.value)}</p>
              {item.description ? (
                <p className="text-[11px] text-slate-400 dark:text-slate-500">{item.description}</p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

type HeatmapEntry = {
  slot: string;
  descriptor: string;
  intensity: 0 | 1 | 2 | 3;
  highlighted: boolean;
};

function parseHeatmapSlot(slot: string, highlights: Set<string>): HeatmapEntry {
  const [timePartRaw, descriptorRaw] = slot.split('•').map((part) => part.trim());
  const timePart = timePartRaw || slot;
  const descriptor = descriptorRaw || 'Aktif';
  const normalized = descriptor.toLowerCase();
  let intensity: HeatmapEntry['intensity'] = 1;
  if (normalized.includes('hot') || normalized.includes('prime')) {
    intensity = 3;
  } else if (normalized.includes('warm')) {
    intensity = 2;
  } else if (normalized.includes('cool') || normalized.includes('low')) {
    intensity = 0;
  }

  return {
    slot: timePart,
    descriptor,
    intensity,
    highlighted: highlights.has(timePart)
      || highlights.has(timePart.replace(/WIB|WITA|WIT/gi, '').trim())
      || highlights.has(timePart.toLowerCase()),
  };
}

function AudienceHeatmap({ entries }: { entries: HeatmapEntry[] }) {
  if (!entries.length) {
    return null;
  }

  const intensityClassMap: Record<HeatmapEntry['intensity'], string> = {
    0: 'bg-slate-200/70 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300',
    1: 'bg-emerald-100/70 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
    2: 'bg-amber-100/80 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
    3: 'bg-rose-100/80 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200',
  };

  return (
    <div className="mt-4">
      <div className="grid gap-2 sm:grid-cols-3">
        {entries.map((entry) => (
          <div
            key={`${entry.slot}-${entry.descriptor}`}
            className={`rounded-xl p-3 text-xs font-semibold transition ${intensityClassMap[entry.intensity]} ${
              entry.highlighted ? 'ring-2 ring-indigo-500/60 dark:ring-indigo-400/60' : ''
            }`}
          >
            <p>{entry.slot}</p>
            <p className="text-[11px] font-normal opacity-80">{entry.descriptor}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
        Slot dengan garis tebal merupakan rekomendasi jam tayang dari analisis teknis.
      </p>
    </div>
  );
}

class ThemeManager {
  currentTheme: ThemeMode;

  constructor(private readonly onThemeChange: (mode: ThemeMode) => void) {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem('fb-insight-theme') as ThemeMode | null) : null;
    this.currentTheme = stored ?? 'light';
    this.applyTheme();
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme();
  }

  private applyTheme() {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('data-theme', this.currentTheme);
      root.setAttribute('data-fb-theme', this.currentTheme);
      root.classList.toggle('dark', this.currentTheme === 'dark');
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('fb-insight-theme', this.currentTheme);
    }

    this.onThemeChange(this.currentTheme);
  }
}

class ModelManager {
  availableModels: PollinationsModel[] = [];
  currentModel = 'openai';

  constructor(private readonly onUpdate: (models: PollinationsModel[]) => void) {}

  async loadModels() {
    try {
      const response = await fetch(POLLINATIONS_MODELS_ENDPOINT, {
        headers: this.buildHeaders(),
      });
      const payload = await response.json();
      const models = Array.isArray(payload) ? payload : payload?.models ?? [];
      this.availableModels = models;
      this.updateUI();
    } catch (error) {
      console.error('Failed to load models:', error);
      this.availableModels = ['openai'];
      this.updateUI();
    }
  }

  private buildHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      Referrer: 'ruangriung.my.id',
    };
    if (POLLINATIONS_TOKEN) {
      headers.Authorization = `Bearer ${POLLINATIONS_TOKEN}`;
    }
    return headers;
  }

  updateUI() {
    this.onUpdate(this.availableModels);
  }
}

class AnalyticsTracker {
  private readonly namespace = 'fb-pro-insight-analytics';

  constructor() {
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(this.namespace);
      if (!existing) {
        localStorage.setItem(this.namespace, JSON.stringify([]));
      }
    }
  }

  track(event: string, data?: Record<string, unknown>) {
    if (typeof window === 'undefined') return;

    const entry = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem(this.namespace);
      const parsed: unknown[] = existing ? JSON.parse(existing) : [];
      parsed.push(entry);
      localStorage.setItem(this.namespace, JSON.stringify(parsed));
    } catch (error) {
      console.warn('Failed to persist analytics data', error);
    }

    if (navigator.sendBeacon) {
      try {
        navigator.sendBeacon(
          '/api/analytics',
          JSON.stringify({ source: 'facebook-pro-insight', ...entry })
        );
      } catch (error) {
        console.debug('Beacon not sent', error);
      }
    }
  }
}

class FacebookAnalyzer {
  private cache = new Map<string, StructuredAnalysis>();

  constructor(private readonly getModel: () => string) {}

  async analyze(payload: AnalysisPayload) {
    const cacheKey = JSON.stringify({ ...payload, model: this.getModel() });
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const aiAnalysis = await analyzeContent(payload, this.getModel());
    const structured = normalizeAnalysisResponse(aiAnalysis, payload.toggles);
    this.cache.set(cacheKey, structured);
    return structured;
  }
}

async function analyzeContent(payload: AnalysisPayload, selectedModel: string) {
  const analysisPrompt = `Analisis konten Facebook berikut untuk audiens Indonesia dengan fokus pada monetisasi, relevansi audiens, kualitas konten, dan optimasi teknis. Gunakan bahasa Indonesia dan berikan hasil dalam format JSON sesuai struktur yang diminta.\n\nJudul: ${payload.title || '-'}\nDeskripsi: ${payload.description || '-'}\nJenis Konten: ${payload.type || 'Status'}\nTarget Audiens: ${payload.audience || 'Indonesia'}\nCatatan Tambahan: ${payload.suggestions || '-'}\n\nAktifkan bagian analisis hanya jika pengguna mengizinkan:\n- Monetisasi: ${payload.toggles.monetization}\n- Audiens: ${payload.toggles.audience}\n- Kualitas: ${payload.toggles.quality}\n- Teknis: ${payload.toggles.technical}\n\nBerikan analisis dalam format JSON dengan struktur:\n{\n  "overall_score": number,\n  "overall_status": "Excellent" | "Good" | "Fair" | "Poor",\n  "summary": string,\n  "monetization_analysis": {\n    "predicted_cpm": number,\n    "predicted_rpm": number,\n    "predicted_ctr": number,\n    "revenue_estimate": string,\n    "monetization_potential": "Low" | "Medium" | "High",\n    "industry_comparison": string,\n    "trend_narrative": string\n  },\n  "audience_suitability": {\n    "cultural_relevance_score": number,\n    "language_analysis": string,\n    "local_trend_alignment": string,\n    "recommendations": string[],\n    "heatmap": string[]\n  },\n  "content_quality": {\n    "originality_score": number,\n    "relevance_score": number,\n    "visual_quality_score": number,\n    "insights": string,\n    "niche_analysis": string\n  },\n  "technical_analysis": {\n    "optimal_posting_times": string[],\n    "hashtag_recommendations": string[],\n    "reach_estimates": {\n      "organic": string,\n      "paid": string\n    },\n    "frequency": string\n  },\n  "improvement_suggestions": string[],\n  "comparative_insights": string[]\n}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Referrer: 'ruangriung.my.id',
  };

  if (POLLINATIONS_TOKEN) {
    headers.Authorization = `Bearer ${POLLINATIONS_TOKEN}`;
  }

  const response = await fetch(POLLINATIONS_TEXT_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: selectedModel,
      messages: [
        {
          role: 'system',
          content:
            'Anda adalah ahli analisis media sosial khusus pasar Indonesia. Berikan analisis yang mendalam dan actionable dalam format JSON yang terstruktur.',
        },
        {
          role: 'user',
          content: analysisPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      token: POLLINATIONS_TOKEN,
    }),
  });

  if (!response.ok) {
    throw new Error(`Analisis gagal: ${response.statusText}`);
  }

  const raw = await response.json();
  if (raw?.choices?.[0]?.message?.content) {
    try {
      return JSON.parse(raw.choices[0].message.content);
    } catch (error) {
      console.warn('Gagal mengurai konten AI, menggunakan payload mentah', error);
      return raw;
    }
  }

  return raw;
}

async function generateContentDraft(
  payload: {
    contentType: string;
    audience: string;
    suggestions: string;
    existingTitle: string;
    existingDescription: string;
  },
  selectedModel: string
): Promise<ContentDraftSuggestion> {
  const prompt = `Anda adalah copywriter Facebook profesional untuk pasar Indonesia. Buat satu usulan judul dan deskripsi konten yang menarik berdasarkan informasi berikut.

Format output dalam JSON:
{
  "title": string,
  "description": string,
  "angle": string
}

Gunakan bahasa Indonesia natural, sertakan CTA singkat, dan fokus pada audiens ${payload.audience || 'Indonesia'}.

Informasi referensi:
- Jenis konten: ${payload.contentType || 'Video Pendek'}
- Catatan tim: ${payload.suggestions || '-'}
- Judul saat ini: ${payload.existingTitle || '-'}
- Deskripsi saat ini: ${payload.existingDescription || '-'}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Referrer: 'ruangriung.my.id',
  };

  if (POLLINATIONS_TOKEN) {
    headers.Authorization = `Bearer ${POLLINATIONS_TOKEN}`;
  }

  const response = await fetch(POLLINATIONS_TEXT_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: selectedModel,
      messages: [
        {
          role: 'system',
          content:
            'Anda adalah asisten kreatif ahli konten Facebook profesional Indonesia. Tulis dengan nada strategis dan actionable.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 800,
      token: POLLINATIONS_TOKEN,
    }),
  });

  if (!response.ok) {
    throw new Error(`Gagal memperoleh saran konten: ${response.statusText}`);
  }

  const raw = await response.json();
  const content = typeof raw?.choices?.[0]?.message?.content === 'string' ? raw.choices[0].message.content : '';

  const candidates: unknown[] = [];
  const jsonCandidate = content ? parseJsonLike(content) : null;
  if (jsonCandidate) {
    candidates.push(jsonCandidate);
  }

  if (raw && typeof raw === 'object') {
    candidates.push(raw);
    if (Array.isArray(raw.choices)) {
      for (const choice of raw.choices) {
        candidates.push(choice);
        if (choice?.message) {
          candidates.push(choice.message);
        }
      }
    }
    if (raw?.data) {
      candidates.push(raw.data);
    }
    if (raw?.result) {
      candidates.push(raw.result);
    }
  }

  let suggestion: ContentDraftSuggestion = { title: '', description: '', angle: undefined };
  for (const candidate of candidates) {
    const coerced = coerceDraftSuggestion(candidate);
    suggestion = {
      title: suggestion.title || coerced.title,
      description: suggestion.description || coerced.description,
      angle: suggestion.angle || coerced.angle,
    };
    if (suggestion.title && suggestion.description && suggestion.angle) {
      break;
    }
  }

  if ((!suggestion.title || !suggestion.description) && content) {
    const fromText = parseDraftFromText(content);
    suggestion = {
      title: suggestion.title || fromText.title,
      description: suggestion.description || fromText.description,
      angle: suggestion.angle || fromText.angle,
    };
  }

  if (!suggestion.title && !suggestion.description) {
    suggestion = {
      title:
        payload.existingTitle?.trim() ||
        `Strategi ${payload.contentType || 'Konten Facebook'} untuk ${payload.audience || 'Audiens Indonesia'}`,
      description:
        payload.existingDescription?.trim() ||
        'Soroti manfaat utama, ajak interaksi audiens Indonesia, dan gunakan CTA yang jelas untuk memperkuat performa konten.',
      angle: undefined,
    };
  }

  return suggestion;
}

function buildFallbackDraftSuggestion(payload: {
  contentType: string;
  audience: string;
  suggestions: string;
  existingTitle: string;
  existingDescription: string;
}): ContentDraftSuggestion {
  const trimmedType = payload.contentType?.trim() || 'Konten Facebook';
  const trimmedAudience = payload.audience?.trim() || 'komunitas Anda';
  const sanitizedNotes = payload.suggestions?.replace(/\s+/g, ' ').trim();
  const baseTitle =
    payload.existingTitle?.trim() || `${trimmedType} untuk ${trimmedAudience}`;

  const highlight = sanitizedNotes
    ? sanitizedNotes.replace(/[.]+$/, '')
    : payload.existingDescription?.trim() || '';

  const descriptionSegments = [
    `Soroti nilai utama ${trimmedType.toLowerCase()} bagi ${trimmedAudience}.`,
    highlight ? `Tekankan ${highlight.toLowerCase()}.` : '',
    'Ajak audiens berinteraksi di komentar dan bagikan pengalaman mereka.',
  ].filter(Boolean);

  return {
    title: baseTitle,
    description: descriptionSegments.join(' '),
    angle: `Fokus pada kebutuhan ${trimmedAudience.toLowerCase()}`,
  };
}

function normalizeAnalysisResponse(input: any, toggles: AnalysisToggleState): StructuredAnalysis {
  const safeNumber = (value: unknown, fallback: number) => {
    const parsed = typeof value === 'string' ? Number.parseFloat(value) : value;
    return typeof parsed === 'number' && Number.isFinite(parsed) ? parsed : fallback;
  };

  const overallScore = Math.min(100, Math.max(0, safeNumber(input?.overall_score, 72)));
  const status: StructuredAnalysis['status'] = (input?.overall_status as StructuredAnalysis['status']) || (
    overallScore >= 85 ? 'Excellent' : overallScore >= 70 ? 'Good' : overallScore >= 55 ? 'Fair' : 'Poor'
  );

  const monetizationData = toggles.monetization ? input?.monetization_analysis ?? {} : {};
  const audienceData = toggles.audience ? input?.audience_suitability ?? {} : {};
  const qualityData = toggles.quality ? input?.content_quality ?? {} : {};
  const technicalData = toggles.technical ? input?.technical_analysis ?? {} : {};

  const monetizationPotential =
    (monetizationData?.monetization_potential as StructuredAnalysis['monetization']['monetizationPotential']) || 'Medium';

  const structured: StructuredAnalysis = {
    overallScore,
    status,
    summary:
      input?.summary || 'Analisis AI belum menyediakan ringkasan mendalam. Coba jalankan ulang analisis.',
    recommendations: Array.isArray(input?.improvement_suggestions)
      ? input.improvement_suggestions
      : ['Tambahkan CTA yang relevan dengan audiens Indonesia.', 'Optimalkan penggunaan hashtag lokal yang sedang tren.'],
    algorithmHighlights: [
      `Model mendeteksi ${monetizationPotential.toLowerCase()} monetization potential di Indonesia.`,
      `CTR prediksi ${safeNumber(monetizationData?.predicted_ctr, 2.8).toFixed(1)}% dengan estimasi CPM ${safeNumber(
        monetizationData?.predicted_cpm,
        17000
      ).toFixed(0)} IDR.`,
      audienceData?.local_trend_alignment ||
        'Konten memiliki koneksi awal dengan tren lokal namun masih bisa ditingkatkan.',
    ],
    monetization: {
      predictedCpm: safeNumber(monetizationData?.predicted_cpm, 17000),
      predictedRpm: safeNumber(monetizationData?.predicted_rpm, 11000),
      predictedCtr: safeNumber(monetizationData?.predicted_ctr, 2.8),
      revenueEstimate: monetizationData?.revenue_estimate || 'Rp120.000 per 1000 views',
      monetizationPotential,
      industryComparison:
        monetizationData?.industry_comparison || 'Performa berada sedikit di atas rata-rata page profesional di Indonesia.',
      trendNarrative:
        monetizationData?.trend_narrative ||
        'Tren CPM Indonesia cenderung stabil dengan peluang peningkatan melalui konten interaktif dan live session.',
    },
    audience: {
      culturalRelevanceScore: safeNumber(audienceData?.cultural_relevance_score, 82),
      languageAnalysis:
        audienceData?.language_analysis ||
        'Bahasa sudah cukup natural untuk audiens Indonesia, tambahkan idiom lokal agar lebih hangat.',
      localTrendAlignment:
        audienceData?.local_trend_alignment ||
        'Konten relevan dengan topik hangat nasional, optimalkan jadwal tayang di jam prime time.',
      recommendations: Array.isArray(audienceData?.recommendations)
        ? audienceData.recommendations
        : ['Gunakan istilah populer di komunitas lokal.', 'Soroti manfaat langsung untuk audiens Indonesia.'],
      heatmap: Array.isArray(audienceData?.heatmap)
        ? audienceData.heatmap
        : ['WIB 11:00 • Warm', 'WIB 19:00 • Hot', 'WITA 20:00 • Hot', 'WIT 21:00 • Warm'],
    },
    contentQuality: {
      originalityScore: safeNumber(qualityData?.originality_score, 78),
      relevanceScore: safeNumber(qualityData?.relevance_score, 84),
      visualQualityScore: safeNumber(qualityData?.visual_quality_score, 80),
      insights:
        qualityData?.insights ||
        'Konten memiliki struktur narasi kuat dengan potensi viralitas melalui highlight emosi dan call-to-action yang jelas.',
      nicheAnalysis:
        qualityData?.niche_analysis ||
        'Posisi konten berada di segmen edukasi profesional dengan diferensiasi berupa storytelling berbasis data lokal.',
    },
    technical: {
      optimalPostingTimes: Array.isArray(technicalData?.optimal_posting_times)
        ? technicalData.optimal_posting_times
        : ['WIB 19:00-21:00', 'WITA 20:00-22:00', 'WIT 21:00-23:00'],
      hashtagRecommendations: Array.isArray(technicalData?.hashtag_recommendations)
        ? technicalData.hashtag_recommendations
        : ['#TrenIndonesia', '#BisnisLokal', '#InsightProfesional'],
      reachEstimates: {
        organic: technicalData?.reach_estimates?.organic || 'Potensi organik 45-55% dari total reach.',
        paid: technicalData?.reach_estimates?.paid || 'Boost ads dapat meningkatkan reach hingga 3,2x.',
      },
      frequency: technicalData?.frequency || '3-4 kali per minggu dengan variasi format carousel, video pendek, dan live.',
    },
    improvementSuggestions: Array.isArray(input?.improvement_suggestions)
      ? input.improvement_suggestions
      : ['Tambah CTA ajakan diskusi di akhir konten.', 'Sisipkan insight berbasis data lokal untuk membangun kredibilitas.'],
    comparativeInsights: Array.isArray(input?.comparative_insights)
      ? input.comparative_insights
      : [
          'Performa konten ini 12% lebih tinggi dibanding rata-rata niche profesional minggu lalu.',
          'Konten serupa dengan visual data-driven mengalami peningkatan CTR 1.4x.',
        ],
  };

  return structured;
}

function formatScoreLabel(score: number) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Fair';
  return 'Poor';
}

function getScoreColor(score: number) {
  if (score >= 85) return 'from-green-400 via-emerald-500 to-teal-500';
  if (score >= 70) return 'from-blue-400 via-indigo-500 to-purple-500';
  if (score >= 55) return 'from-amber-400 via-yellow-500 to-orange-500';
  return 'from-rose-500 via-red-500 to-orange-500';
}

const translations: Record<'id' | 'en', Record<string, string>> = {
  id: {
    executiveSummary: 'Ringkasan Eksekutif',
    monetization: 'Analisis Monetisasi',
    audienceFit: 'Analisis Kesesuaian Audiens Indonesia',
    contentQuality: 'Analisis Kualitas Konten',
    technicalAnalysis: 'Analisis Teknis',
    improvementSuggestions: 'Saran Perbaikan',
    comparative: 'Analisis Komparatif',
    livePreview: 'Pratinjau Konten Real-time',
    history: 'Riwayat Analisis',
  },
  en: {
    executiveSummary: 'Executive Summary',
    monetization: 'Monetization Analysis',
    audienceFit: 'Indonesian Audience Fit Analysis',
    contentQuality: 'Content Quality Analysis',
    technicalAnalysis: 'Technical Analysis',
    improvementSuggestions: 'Improvement Suggestions',
    comparative: 'Comparative Analysis',
    livePreview: 'Real-time Content Preview',
    history: 'Analysis History',
  },
};

export default function FacebookProAnalyzerClient() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [models, setModels] = useState<PollinationsModel[]>([]);
  const [selectedModel, setSelectedModel] = useState('openai');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('Video Pendek');
  const [suggestions, setSuggestions] = useState('');
  const [targetAudience, setTargetAudience] = useState('Indonesia');
  const [toggles, setToggles] = useState<AnalysisToggleState>({
    monetization: true,
    audience: true,
    quality: true,
    technical: true,
  });
  const [analysis, setAnalysis] = useState<StructuredAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorSource, setErrorSource] = useState<'analysis' | 'content' | 'upload' | 'visual' | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'info'; message: string } | null>(null);
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [visualPlan, setVisualPlan] = useState<VisualPlan | null>(null);
  const [isGeneratingVisualPlan, setIsGeneratingVisualPlan] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<Array<{ timestamp: string; score: number; status: string }>>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const modelManagerRef = useRef<ModelManager>();
  const themeManagerRef = useRef<ThemeManager>();
  const analyzerRef = useRef<FacebookAnalyzer>();
  const analyticsRef = useRef<AnalyticsTracker>();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const dashboardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    themeManagerRef.current = new ThemeManager(setTheme);
    analyticsRef.current = new AnalyticsTracker();
    analyticsRef.current.track('page_view', { page: 'facebook-pro-insight' });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateStatus = () => setIsOffline(!navigator.onLine);
    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('fb-analysis-last');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.analysis) {
          setAnalysis(parsed.analysis as StructuredAnalysis);
          setLastUpdated(parsed.timestamp ?? parsed.updatedAt ?? null);
        }
      }
      const storedHistory = localStorage.getItem('fb-analysis-history');
      if (storedHistory) {
        const history = JSON.parse(storedHistory);
        if (Array.isArray(history)) {
          setAnalysisHistory(history);
        }
      }
    } catch (loadError) {
      console.warn('Failed to load cached analysis', loadError);
    }
  }, []);

  useEffect(() => {
    if (!title.trim() && !description.trim()) {
      setVisualPlan(null);
    }
  }, [title, description]);

  useEffect(() => {
    modelManagerRef.current = new ModelManager((loadedModels) => {
      setModels(loadedModels);
      if (loadedModels.length > 0) {
        const first = loadedModels[0];
        const fallback = typeof first === 'string' ? first : first?.id || first?.name || 'openai';
        setSelectedModel((current) => (loadedModels.includes(current) ? current : fallback));
      }
    });
    modelManagerRef.current.loadModels();
  }, []);

  useEffect(() => {
    analyzerRef.current = new FacebookAnalyzer(() => selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    if (!autoAnalyze) return;
    if (!title && !description) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      runAnalysis('auto');
    }, 1200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, contentType, suggestions, targetAudience, toggles, autoAnalyze]);

  const runAnalysis = useCallback(
    async (trigger: 'auto' | 'manual') => {
      if (!analyzerRef.current) return;
      if (!title && !description) {
        setError('Masukkan judul atau deskripsi konten terlebih dahulu.');
        setErrorSource('analysis');
        setNotice(null);
        return;
      }

      setIsAnalyzing(true);
      setError(null);
      setErrorSource(null);
      setNotice(null);
      analyticsRef.current?.track('analysis_requested', { trigger, model: selectedModel });

      try {
        const result = await analyzerRef.current.analyze({
          title,
          description,
          type: contentType,
          audience: targetAudience,
          suggestions,
          toggles,
        });
        const timestamp = new Date().toISOString();
        setAnalysis(result);
        setLastUpdated(timestamp);
        setAnalysisHistory((prev) => {
          const updated = [
            { timestamp, score: result.overallScore, status: result.status },
            ...prev.filter((item) => item.timestamp !== timestamp),
          ].slice(0, 6);
          if (typeof window !== 'undefined') {
            localStorage.setItem('fb-analysis-history', JSON.stringify(updated));
          }
          return updated;
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('fb-analysis-last', JSON.stringify({ analysis: result, timestamp }));
        }
        analyticsRef.current?.track('analysis_success', { status: result.status, score: result.overallScore });
        if (trigger === 'manual') {
          setNotice({ type: 'success', message: 'Analisis berhasil diperbarui.' });
        }
      } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'Terjadi kesalahan tak terduga.';
        setError(message);
        setErrorSource('analysis');
        setNotice(null);
        analyticsRef.current?.track('analysis_failed', { message });
      } finally {
        setIsAnalyzing(false);
      }
    },
    [contentType, selectedModel, suggestions, targetAudience, title, description, toggles]
  );

  const handleToggleChange = (key: AnalysisToggleKey) => {
    setToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAutoFillContent = useCallback(async () => {
    setIsGeneratingContent(true);
    setError(null);
    setErrorSource(null);
    setNotice(null);
    analyticsRef.current?.track('content_autofill_requested', {
      model: selectedModel,
      contentType,
    });

    try {
      const suggestion = await generateContentDraft(
        {
          contentType,
          audience: targetAudience,
          suggestions,
          existingTitle: title,
          existingDescription: description,
        },
        selectedModel
      );

      const fallback = buildFallbackDraftSuggestion({
        contentType,
        audience: targetAudience,
        suggestions,
        existingTitle: title,
        existingDescription: description,
      });

      const finalSuggestion: ContentDraftSuggestion = {
        title: suggestion.title?.trim() || fallback.title,
        description: suggestion.description?.trim() || fallback.description,
        angle: suggestion.angle || fallback.angle,
      };

      const usedFallback =
        !suggestion.title?.trim() || !suggestion.description?.trim();

      setTitle(finalSuggestion.title);
      setDescription(finalSuggestion.description);
      setNotice({
        type: usedFallback ? 'info' : 'success',
        message: usedFallback
          ? 'Template otomatis melengkapi judul dan deskripsi yang belum tersedia.'
          : 'Judul dan deskripsi diperbarui oleh AI.',
      });
      analyticsRef.current?.track('content_autofill_success', {
        hasTitle: Boolean(suggestion.title),
        hasDescription: Boolean(suggestion.description),
        usedFallback,
      });
    } catch (err) {
      const fallback = buildFallbackDraftSuggestion({
        contentType,
        audience: targetAudience,
        suggestions,
        existingTitle: title,
        existingDescription: description,
      });
      const message = err instanceof Error ? err.message : 'Gagal mendapatkan saran AI.';
      setTitle(fallback.title);
      setDescription(fallback.description);
      setError('AI belum merespons. Template otomatis siap diedit.');
      setErrorSource('content');
      setNotice({
        type: 'info',
        message: 'Template otomatis digunakan untuk menjaga alur kerja Anda.',
      });
      analyticsRef.current?.track('content_autofill_failed', { message });
      analyticsRef.current?.track('content_autofill_fallback', {
        strategy: 'local-template',
      });
    } finally {
      setIsGeneratingContent(false);
    }
  }, [contentType, description, selectedModel, suggestions, targetAudience, title]);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Format file harus berupa gambar.');
      setErrorSource('upload');
      setNotice(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      setError(null);
      setErrorSource(null);
      setNotice({ type: 'info', message: 'Gambar berhasil ditambahkan ke pratinjau.' });
      analyticsRef.current?.track('image_uploaded', { size: file.size });
    };
    reader.onerror = () => {
      setError('Gagal membaca file gambar.');
      setErrorSource('upload');
      setNotice(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateVisualPlan = async () => {
    setIsGeneratingVisualPlan(true);
    setError(null);
    setErrorSource(null);
    setNotice(null);
    analyticsRef.current?.track('visual_plan_requested');

    try {
      if (!title.trim() && !description.trim()) {
        throw new Error('Isi judul atau deskripsi untuk membuat rencana visual yang relevan.');
      }

      const plan = buildVisualPlan({
        title,
        description,
        suggestions,
        contentType,
        targetAudience,
        analysis,
      });
      setVisualPlan(plan);
      setNotice({ type: 'info', message: 'Rencana visual disesuaikan dengan konten dan audiens Anda.' });
      analyticsRef.current?.track('visual_plan_success', {
        preset: plan.presetId,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menyiapkan rencana visual.';
      setError(message);
      setErrorSource('visual');
      setNotice(null);
      analyticsRef.current?.track('visual_plan_failed', { message });
    } finally {
      setIsGeneratingVisualPlan(false);
    }
  };

  const handleExport = async (type: 'png' | 'pdf') => {
    if (!dashboardRef.current) return;

    analyticsRef.current?.track('export_requested', { type });

    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(dashboardRef.current, {
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      scale: 1.5,
    });

    if (type === 'png') {
      const link = document.createElement('a');
      link.download = `facebook-pro-insight-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      return;
    }

    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!printWindow) {
      alert('Pop-up diblokir. Izinkan pop-up untuk menyimpan PDF.');
      return;
    }
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Facebook Pro Insight Export</title></head><body style="margin:0;display:flex;align-items:center;justify-content:center;background:${
      theme === 'dark' ? '#0f172a' : '#ffffff'
    }"><img src="${dataUrl}" style="width:90vw;height:auto;"/></body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleShare = async () => {
    analyticsRef.current?.track('share_attempt');

    const shareData = {
      title: 'Facebook Pro Insight Hub',
      text: 'Lihat analisis komprehensif konten Facebook profesional saya.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        analyticsRef.current?.track('share_success');
        return;
      } catch (shareError) {
        console.warn('Share dibatalkan', shareError);
      }
    }

    await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
    analyticsRef.current?.track('share_clipboard');
    alert('Link analisis disalin ke clipboard!');
  };

  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdated) return null;
    try {
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
        timeStyle: 'short',
      }).format(new Date(lastUpdated));
    } catch (formatError) {
      console.warn('Failed to format date', formatError);
      return lastUpdated;
    }
  }, [lastUpdated]);

  const t = translations[language];

  const scoreCardItems = useMemo(() => {
    if (!analysis) return [];
    return [
      {
        icon: Gauge,
        label: 'Overall Score',
        value: `${analysis.overallScore.toFixed(0)}/100`,
        status: analysis.status,
        score: analysis.overallScore,
      },
      {
        icon: BarChart3,
        label: 'Monetization',
        value: `${ID_CURRENCY.format(analysis.monetization.predictedCpm)}/1000 CPM`,
        status: formatScoreLabel(Math.min(100, analysis.monetization.predictedCtr * 25)),
        score: Math.min(100, analysis.monetization.predictedCtr * 25),
      },
      {
        icon: Users,
        label: 'Audience Fit',
        value: `${analysis.audience.culturalRelevanceScore.toFixed(0)}/100`,
        status: formatScoreLabel(analysis.audience.culturalRelevanceScore),
        score: analysis.audience.culturalRelevanceScore,
      },
    ];
  }, [analysis]);

  const revenueChartData = useMemo(() => {
    if (!analysis) return [];
    const items: RevenueChartItem[] = [
      {
        label: 'CPM',
        value: Math.max(0, analysis.monetization.predictedCpm),
        description: 'Biaya per 1000 tayangan.',
      },
      {
        label: 'RPM',
        value: Math.max(0, analysis.monetization.predictedRpm),
        description: 'Pendapatan per 1000 tayangan.',
      },
    ];
    const estimatedRevenue = extractNumericValue(analysis.monetization.revenueEstimate);
    if (estimatedRevenue) {
      items.push({
        label: 'Estimasi',
        value: estimatedRevenue,
        description: analysis.monetization.revenueEstimate,
      });
    }
    return items;
  }, [analysis]);

  const heatmapEntries = useMemo(() => {
    if (!analysis) return [];
    const highlightSet = new Set<string>(analysis.technical.optimalPostingTimes.map((time) => time.trim()));
    return analysis.audience.heatmap.map((slot) => parseHeatmapSlot(slot, highlightSet));
  }, [analysis]);

  const renderToggle = (key: AnalysisToggleKey, label: string, description: string) => (
    <label className="flex items-start justify-between gap-3 rounded-2xl bg-white/70 p-4 shadow-neumorphic-card transition hover:-translate-y-0.5 hover:shadow-neumorphic-card-lg dark:bg-slate-900/60 dark:shadow-dark-neumorphic-card">
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">{label}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <span
        role="switch"
        aria-checked={toggles[key]}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleToggleChange(key);
          }
        }}
        onClick={() => handleToggleChange(key)}
        className={`relative inline-flex h-7 w-12 cursor-pointer items-center rounded-full border border-transparent transition ${
          toggles[key]
            ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-inner'
            : 'bg-slate-300/70 dark:bg-slate-700/70'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
            toggles[key] ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </span>
    </label>
  );

  const renderScoreMeter = (score: number, label: string) => (
    <div className="rounded-2xl bg-white/70 p-4 shadow-neumorphic-card dark:bg-slate-900/60 dark:shadow-dark-neumorphic-card">
      <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
        <span>{label}</span>
        <span>{score.toFixed(0)} / 100</span>
      </div>
      <div className="mt-3 h-3 rounded-full bg-slate-200/70 dark:bg-slate-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(score)} transition-all duration-700`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );

  const renderCard = (title: string, IconComponent: LucideIcon, content: ReactNode, tooltip?: string) => (
    <section className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/80 p-6 shadow-neumorphic-card backdrop-blur transition hover:-translate-y-1 hover:shadow-neumorphic-card-lg dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-dark-neumorphic-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-3 text-indigo-600 dark:text-indigo-300">
            <IconComponent className="h-5 w-5" />
          </span>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        </div>
        {tooltip ? (
          <span className="text-slate-400" title={tooltip}>
            <Info className="h-4 w-4" />
          </span>
        ) : null}
      </div>
      <div className="mt-4 space-y-3 text-sm text-slate-600 transition-opacity duration-300 group-hover:opacity-95 dark:text-slate-300">
        {content}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 px-4 py-10 transition-colors duration-500 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="rounded-3xl border border-white/30 bg-white/60 p-6 shadow-neumorphic-card backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-dark-neumorphic-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700 shadow-neumorphic-button transition hover:-translate-y-0.5 hover:text-indigo-600 dark:bg-slate-900/60 dark:text-slate-200 dark:shadow-dark-neumorphic-button"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Beranda
              </Link>
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <Sparkles className="h-4 w-4" />
                Insight AI
              </span>
            </div>
            <div className="flex items-center gap-3">
              <nav className="hidden text-sm font-medium text-slate-500 dark:text-slate-400 md:flex md:items-center md:gap-4">
                <a className="transition hover:text-indigo-600 dark:hover:text-indigo-300" href="#input">Konfigurasi</a>
                <a className="transition hover:text-indigo-600 dark:hover:text-indigo-300" href="#dashboard">Dashboard</a>
                <a className="transition hover:text-indigo-600 dark:hover:text-indigo-300" href="#insight">Insight</a>
              </nav>
              <button
                type="button"
                onClick={() => themeManagerRef.current?.toggleTheme()}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 shadow-neumorphic-button transition hover:-translate-y-0.5 hover:from-indigo-500/20 hover:to-purple-500/20 hover:text-indigo-600 dark:from-slate-800 dark:to-slate-900 dark:text-slate-200"
              >
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">Facebook Pro Insight</h1>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 md:text-base">
                Analisis cepat untuk judul, konten, dan potensi performa Facebook Anda.
              </p>
              {lastUpdatedLabel ? (
                <p className="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-300">
                  Terakhir diperbarui: {lastUpdatedLabel}
                </p>
              ) : null}
            </div>
            <div className="flex h-full flex-col justify-between gap-3 rounded-3xl bg-white/80 p-4 shadow-inner dark:bg-slate-900/70">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Mode Analisis</span>
                <label className="inline-flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={autoAnalyze}
                    onChange={(event) => setAutoAnalyze(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-400"
                  />
                  Auto Refresh
                </label>
              </div>
              <button
                type="button"
                onClick={() => runAnalysis('manual')}
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-xl hover:shadow-indigo-500/40"
              >
                {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4" />}
                Jalankan Analisis Sekarang
              </button>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => handleExport('png')}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-100/80 px-3 py-2 font-semibold shadow-neumorphic-button transition hover:-translate-y-0.5 hover:text-indigo-600 dark:bg-slate-800/60 dark:text-slate-200"
                >
                  <Download className="h-4 w-4" /> PNG
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('pdf')}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-100/80 px-3 py-2 font-semibold shadow-neumorphic-button transition hover:-translate-y-0.5 hover:text-indigo-600 dark:bg-slate-800/60 dark:text-slate-200"
                >
                  <Download className="h-4 w-4" /> PDF
                </button>
              </div>
            </div>
          </div>
        </header>

        {isOffline ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-700 shadow-neumorphic-card dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            Mode offline aktif. Anda dapat melihat hasil analisis terakhir dan riwayat meskipun tanpa koneksi internet.
          </div>
        ) : null}

        <main className="grid gap-8 lg:grid-cols-[340px_1fr]" id="dashboard">
          <aside
            id="input"
            className="flex flex-col gap-6 rounded-3xl border border-white/30 bg-white/70 p-6 shadow-neumorphic-card backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-dark-neumorphic-card"
          >
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Panel Konten</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Sesuaikan teks dan analisis sebelum dibagikan.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoFillContent}
                  disabled={isGeneratingContent}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-xl hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGeneratingContent ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Gunakan AI
                </button>
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-700 shadow-sm dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div className="space-y-2">
                      <p>{error}</p>
                      {errorSource === 'analysis' ? (
                        <button
                          type="button"
                          onClick={() => runAnalysis('manual')}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 underline decoration-rose-300 underline-offset-2 transition hover:text-rose-700 dark:text-rose-200"
                        >
                          <Activity className="h-3 w-3" /> Coba lagi
                        </button>
                      ) : errorSource === 'visual' ? (
                        <button
                          type="button"
                          onClick={handleGenerateVisualPlan}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 underline decoration-rose-300 underline-offset-2 transition hover:text-rose-700 dark:text-rose-200"
                        >
                          <ImageIcon className="h-3 w-3" /> Susun ulang blueprint
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              {notice ? (
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/90 p-3 text-xs text-indigo-700 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200">
                  {notice.message}
                </div>
              ) : null}

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Judul Konten
                </label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Contoh: Strategi Iklan Edukasi 2024"
                  className="mt-2 w-full rounded-2xl border border-slate-200/60 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Deskripsi & Pesan Utama
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Tuliskan deskripsi konten, CTA, dan nilai utama yang ingin disampaikan."
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-slate-200/60 bg-white/80 px-3 py-3 text-sm font-medium text-slate-700 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-200"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Jenis Konten
                  </label>
                  <select
                    value={contentType}
                    onChange={(event) => setContentType(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200/60 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-200"
                  >
                    <option>Video Pendek</option>
                    <option>Live Streaming</option>
                    <option>Carousel</option>
                    <option>Artikel Panjang</option>
                    <option>Gambar & Caption</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Target Audiens
                  </label>
                  <input
                    value={targetAudience}
                    onChange={(event) => setTargetAudience(event.target.value)}
                    placeholder="Indonesia"
                    className="mt-2 w-full rounded-2xl border border-slate-200/60 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Saran Konten / Catatan Tim
                </label>
                <textarea
                  value={suggestions}
                  onChange={(event) => setSuggestions(event.target.value)}
                  placeholder="Misal: fokus pada manfaat produk bagi pekerja remote, tekankan kemudahan integrasi."
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-slate-200/60 bg-white/80 px-3 py-3 text-sm font-medium text-slate-700 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Model Pollinations.AI
                </label>
                <select
                  value={selectedModel}
                  onChange={(event) => setSelectedModel(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200/60 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-200"
                >
                  {models.length === 0 ? <option value="openai">openai</option> : null}
                  {models.map((model) => {
                    if (typeof model === 'string') {
                      return (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      );
                    }
                    const id = model.id ?? model.name ?? 'openai';
                    return (
                      <option key={id} value={id}>
                        {model.label || model.name || id}
                      </option>
                    );
                  })}
                </select>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Model dimuat otomatis dari Pollinations.AI. Pastikan token aktif untuk akses premium.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-100">Fitur Analisis</h3>
              {renderToggle('monetization', 'Analisis Monetisasi', 'Prediksi CPM, RPM, CTR, dan estimasi pendapatan.')}
              {renderToggle('audience', 'Kesesuaian Audiens', 'Bahasa, relevansi budaya, dan tren lokal.')}
              {renderToggle('quality', 'Kualitas Konten', 'Originalitas, relevansi, visualitas, dan niche positioning.')}
              {renderToggle('technical', 'Analisis Teknis', 'Hashtag, jam tayang, dan estimasi jangkauan.')}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-100">Media Pendukung</h3>
                <button
                  type="button"
                  onClick={handleGenerateVisualPlan}
                  disabled={isGeneratingVisualPlan}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500/90 to-purple-500/90 px-3 py-2 text-xs font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isGeneratingVisualPlan ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImageIcon className="h-3 w-3" />}
                  Blueprint Visual
                </button>
              </div>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-500 shadow-inner transition hover:border-indigo-300 hover:text-indigo-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
                <FileImage className="h-6 w-6" />
                <span>Unggah gambar pendukung</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              <div className="grid gap-3">
                {uploadedImage ? (
                  <div className="overflow-hidden rounded-2xl border border-white/10 shadow-neumorphic-card dark:border-slate-800/60 dark:shadow-dark-neumorphic-card">
                    <img src={uploadedImage} alt="Uploaded" className="h-36 w-full object-cover" />
                    <p className="bg-white/70 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
                      Pratinjau unggahan manual.
                    </p>
                  </div>
                ) : null}
                {visualPlan ? (
                  <div className="rounded-2xl border border-white/10 bg-white/85 p-4 text-xs text-slate-600 shadow-neumorphic-card dark:border-slate-800/60 dark:bg-slate-950/70 dark:text-slate-300 dark:shadow-dark-neumorphic-card">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">Blueprint Visual</p>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">{visualPlan.mood}</p>
                    <div className="mt-3 space-y-2">
                      <div>
                        <p className="font-semibold text-slate-600 dark:text-slate-200">Fokus Hero</p>
                        <p className="mt-1 text-slate-500 dark:text-slate-400">{visualPlan.heroFocus}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-600 dark:text-slate-200">Palet Warna</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {visualPlan.colorPalette.map((color) => (
                            <span
                              key={color}
                              className="flex h-8 w-8 items-center justify-center rounded-xl text-[10px] font-semibold text-white shadow-inner"
                              style={{ backgroundColor: color }}
                            >
                              {color.replace('#', '').slice(0, 3).toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-600 dark:text-slate-200">Elemen Pendukung</p>
                        <ul className="mt-1 space-y-1">
                          {visualPlan.supportingVisuals.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-600 dark:text-slate-200">CTA & Caption</p>
                        <p className="mt-1 text-slate-500 dark:text-slate-400">{visualPlan.ctaTone}</p>
                        <ul className="mt-1 space-y-1">
                          {visualPlan.captionIdeas.map((idea) => (
                            <li key={idea}>– {idea}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-600 dark:text-slate-200">Highlight Pesan</p>
                        <p className="mt-1 text-slate-500 dark:text-slate-400">{visualPlan.highlight}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-4 text-xs text-slate-600 shadow-inner dark:text-slate-300">
              <p className="font-semibold text-slate-700 dark:text-slate-100">Tips:</p>
              <ul className="mt-2 space-y-1">
                <li>• Gunakan bahasa spesifik dan angka untuk hasil analisis yang lebih tajam.</li>
                <li>• Aktifkan hanya fitur analisis yang dibutuhkan agar respon lebih cepat.</li>
                <li>• Blueprint visual akan mengikuti judul, deskripsi, dan insight analisis.</li>
              </ul>
            </div>
          </aside>

          <section className="flex flex-col gap-6" ref={dashboardRef}>
            <div className="rounded-3xl border border-white/20 bg-white/80 p-6 shadow-neumorphic-card backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/70 dark:shadow-dark-neumorphic-card">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t.executiveSummary}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {analysis?.summary || 'Hasil analisis akan muncul di sini setelah AI menyelesaikan evaluasi konten.'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-100/80 px-4 py-2 text-xs font-semibold text-slate-600 shadow-neumorphic-button transition hover:-translate-y-0.5 hover:text-indigo-600 dark:bg-slate-800/60 dark:text-slate-300"
                  >
                    <Share2 className="h-4 w-4" /> Bagikan Insight
                  </button>
                  <div className="flex overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                    <button
                      type="button"
                      className={`px-3 py-2 text-xs font-semibold transition ${
                        language === 'id'
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                          : 'bg-transparent text-slate-500 dark:text-slate-400'
                      }`}
                      onClick={() => setLanguage('id')}
                    >
                      ID
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-2 text-xs font-semibold transition ${
                        language === 'en'
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                          : 'bg-transparent text-slate-500 dark:text-slate-400'
                      }`}
                      onClick={() => setLanguage('en')}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </div>

              {isAnalyzing ? (
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-24 rounded-2xl bg-slate-200/60 shadow-inner animate-pulse dark:bg-slate-800/60"
                    />
                  ))}
                </div>
              ) : null}

              {analysis ? (
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {scoreCardItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex h-full flex-col justify-between rounded-2xl bg-white/80 p-4 shadow-neumorphic-card dark:bg-slate-950/60 dark:shadow-dark-neumorphic-card"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-200">
                          <item.icon className="h-4 w-4" /> {item.label}
                        </span>
                        <span>{item.status}</span>
                      </div>
                      <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
                      <div className="mt-3 h-2 rounded-full bg-slate-200/60 dark:bg-slate-800/60">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(item.score)}`}
                          style={{ width: `${Math.min(100, item.score)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {analysis ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-white/80 p-4 shadow-inner dark:bg-slate-950/60">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Rekomendasi Utama</h4>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      {analysis.recommendations.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-4 shadow-inner dark:bg-slate-950/60">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Pencapaian Algoritma</h4>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      {analysis.algorithmHighlights.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Sparkles className="mt-0.5 h-4 w-4 text-indigo-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>

            {analysis ? (
              <div className="grid gap-6 xl:grid-cols-2" id="insight">
                {renderCard(
                  t.monetization,
                  BarChart3,
                  <div className="space-y-3 text-sm">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {renderScoreMeter(
                        Math.min(100, (analysis.monetization.predictedCpm / 20000) * 100),
                        'CPM Indonesia'
                      )}
                      {renderScoreMeter(
                        Math.min(100, (analysis.monetization.predictedCtr / 4) * 100),
                        'CTR Prediksi'
                      )}
                    </div>
                    <p>
                      <strong>Estimasi Pendapatan:</strong> {analysis.monetization.revenueEstimate}
                    </p>
                    <p>
                      <strong>Perbandingan Industri:</strong> {analysis.monetization.industryComparison}
                    </p>
                    <p>
                      <strong>Narasi Tren:</strong> {analysis.monetization.trendNarrative}
                    </p>
                    {analysis && revenueChartData.length > 0 ? <RevenueBarChart data={revenueChartData} /> : null}
                  </div>,
                  'Prediksi CPM/RPM dan perbandingan dengan standar industri Indonesia.'
                )}

                {renderCard(
                  t.audienceFit,
                  Users,
                  <div className="space-y-3 text-sm">
                    {renderScoreMeter(analysis.audience.culturalRelevanceScore, 'Skor Relevansi Budaya')}
                    <p>
                      <strong>Analisis Bahasa:</strong> {analysis.audience.languageAnalysis}
                    </p>
                    <p>
                      <strong>Tren Lokal:</strong> {analysis.audience.localTrendAlignment}
                    </p>
                    <ul className="space-y-2 text-sm">
                      {analysis.audience.recommendations.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-indigo-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {analysis.audience.heatmap.map((slot) => (
                        <span
                          key={slot}
                          className="inline-flex items-center justify-center rounded-xl bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                    {analysis && heatmapEntries.length > 0 ? <AudienceHeatmap entries={heatmapEntries} /> : null}
                  </div>,
                  'Relevansi budaya, bahasa, dan jadwal terbaik untuk audiens Indonesia.'
                )}

                {renderCard(
                  t.contentQuality,
                  Target,
                  <div className="space-y-3 text-sm">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {renderScoreMeter(analysis.contentQuality.originalityScore, 'Orisinalitas')}
                      {renderScoreMeter(analysis.contentQuality.relevanceScore, 'Relevansi')}
                      {renderScoreMeter(analysis.contentQuality.visualQualityScore, 'Visualitas')}
                    </div>
                    <p>
                      <strong>Insight:</strong> {analysis.contentQuality.insights}
                    </p>
                    <p>
                      <strong>Niche Analysis:</strong> {analysis.contentQuality.nicheAnalysis}
                    </p>
                  </div>,
                  'Kualitas konten mencakup orisinalitas, relevansi, dan visualitas.'
                )}

                {renderCard(
                  t.technicalAnalysis,
                  Activity,
                  <div className="space-y-3 text-sm">
                    <p>
                      <strong>Jam Tayang Terbaik:</strong> {analysis.technical.optimalPostingTimes.join(', ')}
                    </p>
                    <p>
                      <strong>Frekuensi Ideal:</strong> {analysis.technical.frequency}
                    </p>
                    <p>
                      <strong>Estimasi Reach:</strong> {analysis.technical.reachEstimates.organic} · {analysis.technical.reachEstimates.paid}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.technical.hashtagRecommendations.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-slate-200/70 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800/70 dark:text-slate-300"
                        >
                          #{tag.replace('#', '')}
                        </span>
                      ))}
                    </div>
                  </div>,
                  'Optimasi teknis mencakup hashtag, jam tayang, dan estimasi jangkauan.'
                )}
              </div>
            ) : null}

            {analysis ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {renderCard(
                  t.improvementSuggestions,
                  Sparkles,
                  <ul className="space-y-2 text-sm">
                    {analysis.improvementSuggestions.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>,
                  'Daftar aksi yang dapat langsung diterapkan untuk meningkatkan performa konten.'
                )}

                {renderCard(
                  t.comparative,
                  TrendingUp,
                  <div className="space-y-3 text-sm">
                    <ul className="space-y-2">
                      {analysis.comparativeInsights.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-purple-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-2xl bg-white/70 p-3 text-xs text-slate-500 shadow-inner dark:bg-slate-900/60 dark:text-slate-400">
                      Benchmark industri: {analysis.monetization.industryComparison}
                    </div>
                  </div>,
                  'Bandingkan performa konten dengan standar industri dan histori Anda.'
                )}
              </div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-2">
              {renderCard(
                t.livePreview,
                ImageIcon,
                <div className="space-y-3 text-sm">
                  <p>
                    <strong>Judul:</strong> {title || 'Belum diisi'}
                  </p>
                  <p>
                    <strong>Jenis Konten:</strong> {contentType}
                  </p>
                  <p>
                    <strong>Target Audiens:</strong> {targetAudience || 'Indonesia'}
                  </p>
                  <p>
                    <strong>Pesan Utama:</strong> {description || 'Tambahkan deskripsi untuk analisis yang kaya.'}
                  </p>
                  <p>
                    <strong>Catatan Tim:</strong> {suggestions || 'Belum ada catatan tambahan.'}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Pratinjau diperbarui secara langsung saat Anda mengubah input.
                  </p>
                </div>,
                'Pantau isi konten sebelum dikirim ke AI untuk menjaga kualitas input.'
              )}

              {renderCard(
                t.history,
                Activity,
                <div className="space-y-3 text-sm">
                  {analysisHistory.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400">Belum ada riwayat analisis tersimpan.</p>
                  ) : (
                    <ul className="space-y-2">
                      {analysisHistory.map((item) => (
                        <li
                          key={item.timestamp}
                          className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2 text-xs shadow-inner dark:bg-slate-900/60"
                        >
                          <div>
                            <p className="font-semibold text-slate-600 dark:text-slate-300">{item.status}</p>
                            <p className="text-slate-400">
                              {new Date(item.timestamp).toLocaleString('id-ID', { hour12: false })}
                            </p>
                          </div>
                          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                            {item.score.toFixed(0)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Riwayat tersimpan secara lokal untuk memantau progres performa konten.
                  </p>
                </div>,
                'Lihat perkembangan skor dan status analisis yang pernah dijalankan.'
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

