'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Brain,
  CheckCircle2,
  Flame,
  Loader2,
  Network,
  Radar,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface ScoreRow {
  parameter: string;
  score: number;
  insight: string;
  recommendation: string;
}

interface AnalysisResult {
  aiScore: number;
  qualityLevel: 'Kreatif' | 'Menarik' | 'Standar' | 'Buruk';
  summary: string;
  narrative: string;
  trendNarrative: string;
  opportunities: string[];
  scores: ScoreRow[];
  heatmapFocus: string[];
}

const DEFAULT_PROMPT_CONTENT = `⚙️ Nama Tools: InsightRanker — Mesin Pengendus Kualitas Konten
Tujuan: Menilai kualitas konten (gambar, video, teks, audio) berdasarkan kreativitas, relevansi, dan daya tarik emosional.
Struktur Penilaian:
1. Kreatif (Level Dewa) — skor 85-100, indikator emas.
2. Menarik (Level Menengah Atas) — skor 70-84, indikator biru cerah.
3. Standar (Level Aman) — skor 50-69, indikator abu-abu.
4. Buruk (Level Ampas) — skor 0-49, indikator merah kusam.

Fitur Analitik Utama:
- AI Visual Heuristic
- Semantic Insight Engine
- Engagement Predictor
- Trend Alignment Scanner
- Originality Detector

Output contoh:
Kreativitas 82 (Ide segar tapi bisa lebih personal, rekomendasi: tambah konteks)
Visualitas 90 (Warna kuat, rekomendasi: pertahankan tone)
Orisinalitas 76 (Mirip 15% tren global, rekomendasi: ubah framing)
Relevansi 68 (Kurang koneksi audiens, rekomendasi: gunakan tema lokal)
Narratif: "Konten ini punya potensi viral karena kesederhanaannya."`;

const FALLBACK_ANALYSIS: AnalysisResult = {
  aiScore: 82,
  qualityLevel: 'Menarik',
  summary:
    'Konten menghadirkan ide segar dengan struktur rapi, namun masih memiliki ruang untuk personalisasi agar resonansinya lebih tinggi.',
  narrative:
    'Konten ini punya potensi viral karena kesederhanaannya membiarkan audiens fokus pada pesan utama tanpa gangguan visual.',
  trendNarrative:
    'Grafik tren satu minggu terakhir menunjukkan engagement meningkat stabil, tetapi originalitas sedikit menurun karena kedekatan dengan tren global.',
  opportunities: [
    'Selipkan humor atau konteks personal agar storytelling makin lekat secara emosional.',
    'Eksperimen dengan angle visual baru untuk menurunkan kemiripan dengan tren global.',
    'Perkuat koneksi audiens target dengan memasukkan referensi lokal atau isu komunitas.',
  ],
  scores: [
    {
      parameter: 'Kreativitas',
      score: 82,
      insight: 'Ide segar, storytelling tajam namun masih bisa dihangatkan secara personal.',
      recommendation: 'Tambahkan konteks personal atau humor singkat untuk memperkuat impresi.',
    },
    {
      parameter: 'Visualitas',
      score: 90,
      insight: 'Penggunaan warna kontras dan komposisi simetris memperkuat estetika profesional.',
      recommendation: 'Pertahankan tone visual, coba variasikan lighting untuk menjaga kejutan visual.',
    },
    {
      parameter: 'Orisinalitas',
      score: 76,
      insight: 'Konsep masih beririsan 15% dengan tren global yang sedang populer.',
      recommendation: 'Ubah framing atau twist narasi agar lebih terasa sebagai signature brand.',
    },
    {
      parameter: 'Relevansi',
      score: 68,
      insight: 'Pesan jelas namun belum menyentuh bahasa atau referensi khas audiens target.',
      recommendation: 'Gunakan tema lokal, data audiens, atau insight komunitas untuk mendekatkan emosi.',
    },
  ],
  heatmapFocus: [
    'Kreativitas dan Visualitas berada di zona panas (tinggi).',
    'Relevansi menunjukkan zona hangat yang butuh dorongan.',
    'Originalitas stabil namun perlu perhatian agar tidak jatuh ke zona dingin.',
  ],
};

const QUALITY_COLORS: Record<AnalysisResult['qualityLevel'], string> = {
  Kreatif: 'from-yellow-400 via-amber-500 to-orange-500 text-yellow-900',
  Menarik: 'from-sky-400 via-blue-500 to-indigo-500 text-blue-900',
  Standar: 'from-slate-300 via-gray-400 to-zinc-500 text-gray-800',
  Buruk: 'from-rose-500 via-red-500 to-orange-600 text-red-50',
};

const QUALITY_LABELS: Record<AnalysisResult['qualityLevel'], string> = {
  Kreatif: 'Level Dewa',
  Menarik: 'Level Menengah Atas',
  Standar: 'Level Aman Tapi Nggak Wow',
  Buruk: 'Level Ampas',
};

const ANALYTICS_FEATURES = [
  {
    title: 'AI Visual Heuristic',
    description:
      'Menganalisis komposisi, warna, simetri, dan tekstur untuk memetakan estetika konten secara objektif.',
    icon: Radar,
  },
  {
    title: 'Semantic Insight Engine',
    description:
      'Menggali makna tersembunyi dalam caption, deskripsi, maupun tone percakapan untuk membaca resonansi emosional.',
    icon: Brain,
  },
  {
    title: 'Engagement Predictor',
    description:
      'Memodelkan kemungkinan reaksi audiens menggunakan pola emosi, gaya bahasa, dan data historis platform.',
    icon: TrendingUp,
  },
  {
    title: 'Trend Alignment Scanner',
    description:
      'Membandingkan konten terhadap tren terkini untuk menilai apakah Anda selaras atau justru terlihat basi.',
    icon: Activity,
  },
  {
    title: 'Originality Detector',
    description:
      'Mendeteksi kemiripan konseptual dengan dataset global guna menghindari kesan copy-paste.',
    icon: Flame,
  },
];

const QUALITY_GUIDE: Array<{
  level: AnalysisResult['qualityLevel'];
  description: string;
  quickTip: string;
}> = [
  {
    level: 'Kreatif',
    description: 'Eksekusi istimewa dengan kejutan konseptual yang kuat.',
    quickTip: 'Pertahankan storytelling dan dokumentasikan resep suksesnya.',
  },
  {
    level: 'Menarik',
    description: 'Fondasi kokoh dan mudah dipahami, tinggal diberi sentuhan personal.',
    quickTip: 'Sisipi pengalaman nyata atau twist visual untuk naik kelas.',
  },
  {
    level: 'Standar',
    description: 'Aman untuk tayang tetapi belum meninggalkan kesan mendalam.',
    quickTip: 'Tata ulang sudut pandang atau format supaya lebih segar.',
  },
  {
    level: 'Buruk',
    description: 'Pesan kabur atau tidak relevan dengan audiens target.',
    quickTip: 'Perjelas tujuan konten dan gunakan bahasa yang lebih akrab.',
  },
];

const SAMPLE_PRESETS: Array<{ id: string; name: string; description: string; content: string }> = [
  {
    id: 'product-launch',
    name: 'Peluncuran Produk Lifestyle',
    description: 'Caption promosi produk wearable dengan sentuhan storytelling.',
    content:
      'Hey #RuangCreators! Minggu ini kami rilis smartwatch Aurora Vibe. Fokus kami simpel: bantu kamu fokus tanpa kecanduan layar. Bayangkan jam tangan yang auto-switch ke mode sunyi saat kamu mulai olahraga, tapi kembali aktif saat kamu selesai. Video teaser-nya nunjukin bagaimana warna layar mengikuti mood. Kami pengin tahu, menurut kalian fitur mana yang paling bikin penasaran? Drop di komentar ya!',
  },
  {
    id: 'event-recap',
    name: 'Rekap Event Komunitas',
    description: 'Ringkasan kegiatan komunitas lokal beserta ajakan bergabung.',
    content:
      'Terima kasih untuk 250+ kreator yang hadir di #RuangRiung Meetup Bandung! Dari sesi micro-storytelling, workshop AI copywriting, sampai open mic, semua bikin vibes kreatifnya terasa banget. Minggu depan kami coba format co-creation clinic. Mau ikutan jadi mentor atau peserta? Tulis “AYO” di kolom komentar, kami bakal DM detail lengkapnya.',
  },
  {
    id: 'public-service',
    name: 'Pesan Layanan Publik',
    description: 'Informasi singkat untuk edukasi audiens luas.',
    content:
      'Buat teman-teman di kota pesisir, BMKG baru saja merilis peringatan dini gelombang tinggi untuk 48 jam ke depan. Tolong batasi aktivitas pelayaran kecil, pastikan anak-anak nggak bermain terlalu dekat bibir pantai, dan simpan nomor darurat setempat. Kami juga menyiapkan infografik singkat untuk dibagikan ulang di story kalian. Stay safe dan saling kabari ya!',
  },
];

const qualityFromScore = (score: number): AnalysisResult['qualityLevel'] => {
  if (score >= 85) return 'Kreatif';
  if (score >= 70) return 'Menarik';
  if (score >= 50) return 'Standar';
  return 'Buruk';
};

const clampScore = (score: number) => Math.min(100, Math.max(0, Math.round(score)));

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

const extractJsonObject = (rawText: string): Record<string, any> => {
  const cleaned = rawText.trim().replace(/^[^\{\[]*/, '');

  try {
    const parsed = JSON.parse(cleaned);

    if (parsed && typeof parsed === 'object') {
      if (typeof parsed.text === 'string') {
        return extractJsonObject(parsed.text);
      }

      if (
        parsed.choices &&
        Array.isArray(parsed.choices) &&
        parsed.choices[0]?.message?.content
      ) {
        return extractJsonObject(parsed.choices[0].message.content);
      }

      return parsed;
    }
  } catch (error) {
    // ignore parse error and try fallback strategies below
  }

  const codeFenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeFenceMatch) {
    return extractJsonObject(codeFenceMatch[1]);
  }

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error('Respons AI tidak mengandung JSON yang bisa dibaca.');
};

const parseAnalysisResponse = (rawText: string): AnalysisResult => {
  const parsed = extractJsonObject(rawText);

  const scores: ScoreRow[] = Array.isArray(parsed.scores)
    ? parsed.scores.map((row: any) => ({
        parameter: String(row.parameter ?? row.name ?? 'Parameter'),
        score: clampScore(Number(row.score ?? 0)),
        insight: String(row.insight ?? row.detail ?? 'Tidak ada insight'),
        recommendation: String(row.recommendation ?? row.action ?? 'Tidak ada rekomendasi'),
      }))
    : FALLBACK_ANALYSIS.scores;

  const averageScore =
    scores.length > 0
      ? scores.reduce((accumulator, current) => accumulator + current.score, 0) / scores.length
      : 0;

  const aiScore = clampScore(
    Number(
      (parsed.aiScore ?? parsed.summaryScore ?? averageScore) ?? 0
    )
  );

  const qualityLevel = (parsed.qualityLevel as AnalysisResult['qualityLevel']) ?? qualityFromScore(aiScore);

  return {
    aiScore,
    qualityLevel,
    summary:
      typeof parsed.summary === 'string'
        ? parsed.summary
        : parsed.overview ?? FALLBACK_ANALYSIS.summary,
    narrative:
      typeof parsed.narrative === 'string'
        ? parsed.narrative
        : parsed.panelNarrative ?? FALLBACK_ANALYSIS.narrative,
    trendNarrative:
      typeof parsed.trendNarrative === 'string'
        ? parsed.trendNarrative
        : parsed.trend ?? FALLBACK_ANALYSIS.trendNarrative,
    opportunities: Array.isArray(parsed.opportunities)
      ? parsed.opportunities.map((item: any) => String(item))
      : FALLBACK_ANALYSIS.opportunities,
    scores,
    heatmapFocus: Array.isArray(parsed.heatmapFocus)
      ? parsed.heatmapFocus.map((item: any) => String(item))
      : FALLBACK_ANALYSIS.heatmapFocus,
  };
};

export default function FacebookProAnalyzerClient() {
  const [content, setContent] = useState(DEFAULT_PROMPT_CONTENT);
  const [models, setModels] = useState<{ name: string; description?: string }[]>([]);
  const [selectedModel, setSelectedModel] = useState('openai');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(FALLBACK_ANALYSIS);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activePreset, setActivePreset] = useState<string>('');

  useEffect(() => {
    const controller = new AbortController();

    const loadModels = async () => {
      try {
        const headers = {
          Accept: 'application/json',
          ...getPollinationsAuthHeaders(false),
        };

        const response = await fetch(buildPollinationsUrl(POLLINATIONS_MODELS_ENDPOINT), {
          signal: controller.signal,
          headers,
        });

        if (!response.ok) {
          throw new Error(`Gagal memuat daftar model (status ${response.status}).`);
        }

        const data = await response.json();
        const parsedModels: { name: string; description?: string }[] = [];

        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (typeof item === 'string') {
              parsedModels.push({ name: item });
            } else if (item && typeof item === 'object') {
              parsedModels.push({ name: item.name ?? item.id ?? 'model', description: item.description ?? item.label });
            }
          });
        } else if (data && typeof data === 'object') {
          if (Array.isArray(data.models)) {
            data.models.forEach((item: any) => {
              if (typeof item === 'string') {
                parsedModels.push({ name: item });
              } else if (item && typeof item === 'object') {
                parsedModels.push({ name: item.name ?? item.id ?? 'model', description: item.description ?? item.label });
              }
            });
          } else {
            Object.entries(data).forEach(([key, value]) => {
              if (typeof value === 'string') {
                parsedModels.push({ name: value, description: key });
              }
            });
          }
        }

        const uniqueModels = parsedModels.filter(
          (model, index, self) => index === self.findIndex((item) => item.name === model.name)
        );

        setModels(uniqueModels);

        if (uniqueModels.length > 0 && !uniqueModels.some((model) => model.name === selectedModel)) {
          setSelectedModel(uniqueModels[0].name);
        }
      } catch (fetchError) {
        console.error(fetchError);
        setError('Gagal memuat model dari Pollinations.ai, menggunakan model default.');
      }
    };

    loadModels();

    return () => {
      controller.abort();
    };
  }, [selectedModel]);

  const handleAnalyze = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const prompt = `Analisis konten Facebook profesional berikut secara menyeluruh. Kembalikan JSON dengan struktur: {\n  \"aiScore\": number (0-100),\n  \"qualityLevel\": \"Kreatif|Menarik|Standar|Buruk\",\n  \"summary\": string,\n  \"narrative\": string,\n  \"trendNarrative\": string,\n  \"opportunities\": string[],\n  \"scores\": [{ \"parameter\": string, \"score\": number, \"insight\": string, \"recommendation\": string }],\n  \"heatmapFocus\": string[]\n}. Fokus pada kreativitas, relevansi, daya tarik emosional, orisinalitas, dan visualitas. Konten:\n\n${content}`;

      const payload = {
        model: selectedModel || 'openai',
        messages: [
          {
            role: 'system',
            content:
              'Anda adalah InsightRanker, analis konten profesional khusus Facebook Pro. Jawaban wajib dalam JSON valid sesuai skema yang diminta.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      };

      const response = await fetch(buildPollinationsUrl(POLLINATIONS_OPENAI_ENDPOINT), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...getPollinationsAuthHeaders(true),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Analisis gagal (status ${response.status}).`);
      }

      const rawResponse = await response.text();
      const parsed = parseAnalysisResponse(rawResponse);
      setAnalysis(parsed);
      setLastUpdated(new Date());
    } catch (fetchError: any) {
      console.error(fetchError);
      setError(fetchError.message ?? 'Terjadi kesalahan saat menganalisis konten.');
      setAnalysis(FALLBACK_ANALYSIS);
    } finally {
      setIsLoading(false);
    }
  };

  const qualityColor = useMemo(() => QUALITY_COLORS[analysis?.qualityLevel ?? 'Menarik'], [analysis?.qualityLevel]);

  const heatmapCells = useMemo(() => {
    return (analysis?.scores ?? []).map((score) => {
      let backgroundClass = 'bg-slate-200/60 dark:bg-slate-700/40';

      if (score.score >= 85) backgroundClass = 'bg-amber-400/80 dark:bg-amber-500/40';
      else if (score.score >= 70) backgroundClass = 'bg-sky-400/70 dark:bg-sky-500/40';
      else if (score.score >= 50) backgroundClass = 'bg-zinc-300/70 dark:bg-zinc-600/40';
      else backgroundClass = 'bg-rose-500/70 dark:bg-rose-500/30';

      return {
        ...score,
        backgroundClass,
      };
    });
  }, [analysis?.scores]);

  return (
    <section className="mt-10 space-y-10">
      <div className="grid gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleAnalyze}
          className="lg:col-span-2 space-y-6 rounded-2xl bg-light-bg p-6 shadow-neumorphic-card dark:bg-dark-bg dark:shadow-dark-neumorphic-card"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Panel Analisis Konten</h2>
            <button
              type="button"
              onClick={() => {
                setContent(DEFAULT_PROMPT_CONTENT);
                setActivePreset('');
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <RefreshCw className="h-4 w-4" />
              Reset ke Template
            </button>
          </div>

          <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 p-4 text-sm text-purple-800 dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-100">
            <p className="font-semibold uppercase tracking-widest text-xs text-purple-500 dark:text-purple-200">Cara cepat</p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-500" />
                <span>Tempelkan caption, deskripsi, atau ringkasan konten yang ingin diendus.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-500" />
                <span>Pilih model AI Analisis yang paling sesuai dengan gaya bahasa Anda.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-500" />
                <span>
                  Klik <strong>Jalankan Analisis InsightRanker</strong> dan baca insight yang muncul di panel kanan.
                </span>
              </li>
            </ul>
            <p className="mt-3 text-xs text-purple-600 dark:text-purple-200/80">Tip: gunakan preset di bawah untuk contoh konten jika ingin mencoba cepat.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Konten Facebook Pro yang Ingin Dianalisis
            </label>
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="flex-1">
                <select
                  value={activePreset}
                  onChange={(event) => {
                    const presetId = event.target.value;
                    setActivePreset(presetId);
                    const preset = SAMPLE_PRESETS.find((item) => item.id === presetId);
                    if (preset) {
                      setContent(preset.content);
                    }
                  }}
                  className="w-full rounded-xl border border-transparent bg-white/90 px-4 py-3 text-sm font-medium text-gray-800 shadow-inner focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/60 dark:bg-gray-800/80 dark:text-gray-100"
                >
                  <option value="">Pilih preset contoh konten (opsional)</option>
                  {SAMPLE_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>
              {activePreset && (
                <div className="rounded-xl border border-purple-200 bg-purple-50/70 px-4 py-3 text-xs text-purple-700 dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-200">
                  {SAMPLE_PRESETS.find((preset) => preset.id === activePreset)?.description}
                </div>
              )}
            </div>
            <textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={12}
              className="w-full rounded-xl border border-transparent bg-white/90 p-4 text-sm text-gray-800 shadow-inner focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/60 dark:bg-gray-800/80 dark:text-gray-100"
              placeholder="Tempelkan caption, deskripsi, atau ringkasan konten Anda di sini."
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="model" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Model AI Analisis
              </label>
              <div className="relative">
                <select
                  id="model"
                  value={selectedModel}
                  onChange={(event) => setSelectedModel(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-transparent bg-white/90 px-4 py-3 text-sm font-medium text-gray-800 shadow-inner focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/60 dark:bg-gray-800/80 dark:text-gray-100"
                >
                  {models.length > 0 ? (
                    models.map((model) => (
                      <option key={model.name} value={model.name}>
                        {model.description ? `${model.description} — ${model.name}` : model.name}
                      </option>
                    ))
                  ) : (
                    <option value="openai">openai</option>
                  )}
                </select>
                <Sparkles className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-500" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Sistem</label>
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-purple-200 bg-purple-50/60 px-4 py-3 text-sm text-purple-700 dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-200">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {isLoading ? 'AI sedang mengendus kualitas konten...' : 'Siap mengendus kualitas konten Anda.'}
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/50 dark:bg-red-500/10 dark:text-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Terjadi kendala</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-purple-400 dark:focus:ring-offset-slate-900"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Mengendus konten...
              </>
            ) : (
              <>
                <Network className="h-5 w-5" />
                Jalankan Analisis InsightRanker
              </>
            )}
          </button>
        </form>

        <div className="space-y-6 rounded-2xl bg-gradient-to-br from-purple-600/90 via-purple-700/90 to-indigo-800/90 p-6 text-purple-50 shadow-neumorphic-card dark:shadow-dark-neumorphic-card lg:col-span-1">
          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.4em] text-purple-200">AI Score</p>
            <div className="mt-3 flex items-end justify-between">
              <h3 className="text-5xl font-black leading-none">{analysis?.aiScore ?? '—'}</h3>
              <span className="text-sm font-medium text-purple-100">
                {lastUpdated ? `Diperbarui ${lastUpdated.toLocaleTimeString('id-ID')}` : 'Menggunakan data baseline' }
              </span>
            </div>
          </div>

          <div className={`rounded-2xl p-5 text-center font-semibold shadow-lg backdrop-blur transition-colors bg-gradient-to-br ${qualityColor}`}>
            <p className="text-xs uppercase tracking-[0.35em]">Tingkat Kualitas</p>
            <p className="mt-2 text-2xl font-black">{analysis ? analysis.qualityLevel : '—'}</p>
            <p className="text-sm font-medium opacity-80">{analysis ? QUALITY_LABELS[analysis.qualityLevel] : ''}</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-5 backdrop-blur">
            <h4 className="text-lg font-semibold">Heatmap Fokus</h4>
            <ul className="mt-3 space-y-2 text-sm text-purple-100/90">
              {(analysis?.heatmapFocus ?? []).map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <BarChart3 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl bg-light-bg p-6 text-sm text-gray-600 shadow-neumorphic-card dark:bg-dark-bg dark:text-gray-300 dark:shadow-dark-neumorphic-card lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Checklist Pembacaan Insight</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-500" />
              <span>Identifikasi skor terendah terlebih dahulu untuk menentukan prioritas perbaikan konten.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-500" />
              <span>Cocokkan rekomendasi dengan tujuan kampanye agar insight langsung dapat dieksekusi.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-500" />
              <span>Catat insight heatmap sebagai bahan diskusi tim sebelum iterasi konten berikutnya.</span>
            </li>
          </ul>
          <div className="rounded-xl border border-purple-100 bg-purple-50/80 p-4 text-purple-800 shadow-inner dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-100">
            <h4 className="text-base font-semibold text-purple-900 dark:text-purple-100">Panduan Membaca Indikator</h4>
            <p className="mt-2 text-sm text-purple-900/80 dark:text-purple-100/80">
              Gunakan legenda berikut untuk mempermudah memahami warna dan rekomendasi InsightRanker.
            </p>
            <div className="mt-4 space-y-3 text-sm">
              {QUALITY_GUIDE.map((guide) => (
                <div
                  key={guide.level}
                  className="rounded-xl border border-purple-100 bg-white/90 p-3 text-purple-800 shadow-sm dark:border-purple-500/40 dark:bg-purple-500/20 dark:text-purple-100"
                >
                  <p className="text-xs uppercase tracking-widest text-purple-500 dark:text-purple-200">
                    {guide.level} — {QUALITY_LABELS[guide.level]}
                  </p>
                  <p className="mt-1 text-purple-900 dark:text-purple-100">{guide.description}</p>
                  <p className="mt-2 text-xs text-purple-600 dark:text-purple-200/80">Cepat dipraktekkan: {guide.quickTip}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tata ulang ini memisahkan kartu pembacaan dari hasil utama sehingga layar mobile terasa lebih lega dan mudah dipindai.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6 rounded-2xl bg-light-bg p-6 shadow-neumorphic-card dark:bg-dark-bg dark:shadow-dark-neumorphic-card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pemetaan Skor InsightRanker</h3>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200/60 dark:border-gray-700/60">
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50/90 dark:bg-gray-800/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Parameter
                    </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Skor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Insight Otomatis
                  </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                      Rekomendasi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white/80 dark:divide-gray-800 dark:bg-gray-900/60">
                  {(analysis?.scores ?? []).map((row) => (
                    <tr key={row.parameter}>
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{row.parameter}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                      <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-100">
                        {row.score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{row.insight}</td>
                      <td className="px-4 py-3 text-sm text-purple-700 dark:text-purple-300">{row.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-4 md:hidden">
              {(analysis?.scores ?? []).map((row) => (
                <div
                  key={`${row.parameter}-mobile`}
                  className="rounded-2xl border border-gray-200 bg-white/90 p-4 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900/60"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{row.parameter}</p>
                    <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-100">
                      {row.score}
                    </span>
                  </div>
                  <p className="mt-3 text-gray-600 dark:text-gray-300">{row.insight}</p>
                  <p className="mt-2 text-purple-700 dark:text-purple-300">{row.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-2xl bg-light-bg p-6 shadow-neumorphic-card dark:bg-dark-bg dark:shadow-dark-neumorphic-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Opportunities Radar</h3>
          <ul className="grid gap-3 text-sm text-gray-600 sm:grid-cols-2 sm:gap-4 dark:text-gray-300">
            {(analysis?.opportunities ?? []).map((opportunity, index) => (
              <li
                key={index}
                className="flex flex-col gap-2 rounded-xl border border-purple-100 bg-purple-50/70 px-4 py-3 text-purple-700 shadow-sm transition-colors hover:border-purple-200 hover:bg-purple-100/70 dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-200"
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="h-4 w-4" />
                  <span>Peluang #{index + 1}</span>
                </div>
                <span className="text-xs leading-relaxed text-purple-800 dark:text-purple-100">{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 rounded-2xl bg-light-bg p-6 shadow-neumorphic-card dark:bg-dark-bg dark:shadow-dark-neumorphic-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Heatmap Kualitas</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {heatmapCells.map((cell) => (
              <div key={cell.parameter} className={`rounded-xl p-4 text-sm font-medium text-gray-800 shadow-inner dark:text-gray-100 ${cell.backgroundClass}`}>
                <p className="text-xs uppercase tracking-wide opacity-80">{cell.parameter}</p>
                <p className="mt-2 text-3xl font-black">{cell.score}</p>
                <p className="mt-1 text-xs font-normal opacity-90">{cell.insight}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 rounded-2xl bg-light-bg p-6 shadow-neumorphic-card dark:bg-dark-bg dark:shadow-dark-neumorphic-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Panel Insight Naratif</h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{analysis?.narrative}</p>
          <div className="rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm text-blue-800 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200">
            <p className="font-semibold">Catatan Strategis</p>
            <p>{analysis?.summary}</p>
          </div>
        </div>

        <div className="space-y-6 rounded-2xl bg-light-bg p-6 shadow-neumorphic-card dark:bg-dark-bg dark:shadow-dark-neumorphic-card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Grafik Tren Mingguan</h3>
          <div className="h-36 w-full rounded-xl bg-gradient-to-tr from-emerald-400/30 via-sky-400/40 to-purple-500/30 p-4">
            <div className="flex h-full items-end gap-2">
              {[60, 72, 68, 74, 79, 83, analysis?.aiScore ?? 80].map((value, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-lg bg-white/70 dark:bg-white/30"
                  style={{ height: `${Math.max(20, value)}%` }}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">{analysis?.trendNarrative}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-light-bg p-6 shadow-neumorphic-card dark:bg-dark-bg dark:shadow-dark-neumorphic-card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mesin Analitik InsightRanker</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          InsightRanker menggabungkan lima modul kecerdasan yang bekerja secara paralel untuk menilai konten profesional Facebook.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {ANALYTICS_FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-gray-200 bg-white/80 p-4 text-gray-700 shadow-sm transition hover:border-purple-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-200">
              <feature.icon className="h-6 w-6 text-purple-500" />
              <h4 className="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{feature.title}</h4>
              <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          Butuh mockup visual futuristik? Tinggal hubungi kami—kami bisa bantu bikin dashboard yang terlihat seperti alat alien yang membedakan karya hidup dan konten numpang eksis.
        </p>
      </div>
    </section>
  );
}
