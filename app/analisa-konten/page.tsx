'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  Brain,
  Check,
  ChevronRight,
  ClipboardCopy,
  CopyCheck,
  Hash,
  Image as ImageIcon,
  Lightbulb,
  MoonStar,
  RefreshCw,
  Sparkles,
  SunMedium,
  Trash2,
  TrendingUp,
} from 'lucide-react';

const platformBenchmarks = [
  {
    name: 'Facebook',
    audienceMatch: 88,
    cpm: 2.1,
    rpm: 3.2,
    ctr: 4.6,
    engagement: 72,
  },
  {
    name: 'YouTube',
    audienceMatch: 91,
    cpm: 5.6,
    rpm: 7.4,
    ctr: 6.1,
    engagement: 83,
  },
  {
    name: 'TikTok',
    audienceMatch: 84,
    cpm: 1.8,
    rpm: 2.9,
    ctr: 8.5,
    engagement: 88,
  },
  {
    name: 'Instagram',
    audienceMatch: 86,
    cpm: 3.9,
    rpm: 4.6,
    ctr: 5.2,
    engagement: 79,
  },
  {
    name: 'Threads',
    audienceMatch: 78,
    cpm: 1.4,
    rpm: 2.2,
    ctr: 3.5,
    engagement: 65,
  },
];

type ContentInsights = {
  wordCount: number;
  charCount: number;
  hasQuestion: boolean;
  hasCTA: boolean;
  positivity: number;
  readinessScore: number;
};

type RevenueSnapshot = {
  views: number;
  cpmRevenue: number;
  rpmRevenue: number;
  ctrLeads: number;
};

type AiSuggestion = {
  title: string;
  description: string;
  tone: string;
};

const stopwords = new Set([
  'yang',
  'dan',
  'untuk',
  'dengan',
  'agar',
  'atau',
  'pada',
  'dari',
  'akan',
  'kami',
  'anda',
  'para',
  'dalam',
  'ketika',
  'bagi',
  'sebagai',
  'karena',
  'saat',
  'itu',
  'ini',
  'jadi',
  'tidak',
  'apa',
  'maka',
  'lebih',
  'sudah',
  'bisa',
  'harus',
]);

const extractKeywords = (text: string) => {
  const tokens = text
    .toLowerCase()
    .match(/[a-zà-ÿ0-9]+/gi)
    ?.filter((token) => token.length > 3 && !stopwords.has(token)) ?? [];

  const frequency = tokens.reduce<Record<string, number>>((acc, word) => {
    acc[word] = (acc[word] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .map(([word]) => word)
    .slice(0, 5);
};

const platformVoices: Record<string, {
  tone: string;
  defaultTopic: string;
  hookTemplate: string;
  ctaTemplate: string;
  ctaHint: string;
  proofPoint: string;
  formatTip: string;
}> = {
  Facebook: {
    tone: 'Hangat & Komunitas',
    defaultTopic: 'komunitas digital',
    hookTemplate: 'Mulai dengan pertanyaan yang mengajak audiens berbagi tentang {keyword}.',
    ctaTemplate: 'Ajak audiens menuliskan pengalaman mereka di kolom komentar.',
    ctaHint: 'ajak audiens menuliskan pengalaman mereka di kolom komentar',
    proofPoint: 'Sisipi kutipan singkat atau fakta komunitas untuk menjaga kepercayaan.',
    formatTip: 'Pisahkan paragraf agar mudah dibaca pada feed dan grup.',
  },
  YouTube: {
    tone: 'Strategis & Edukatif',
    defaultTopic: 'perjalanan kreator',
    hookTemplate: 'Buka dengan fakta atau statistik mengejutkan soal {keyword} di awal video.',
    ctaTemplate: 'Dorong penonton untuk subscribe dan cek link deskripsi.',
    ctaHint: 'dorong penonton untuk subscribe dan cek link deskripsi',
    proofPoint: 'Tunjukkan preview visual atau data grafis agar hook semakin kuat.',
    formatTip: 'Gunakan struktur hook, nilai utama, dan closing dengan CTA jelas.',
  },
  TikTok: {
    tone: 'Enerjik & Eksperimental',
    defaultTopic: 'tren singkat',
    hookTemplate: 'Mulai dengan pernyataan berani tentang {keyword} dalam 3 detik pertama.',
    ctaTemplate: 'Ajak penonton mencoba langkahnya dan tag akun Anda.',
    ctaHint: 'ajak penonton mencoba langkahnya dan tag akun Anda',
    proofPoint: 'Gunakan teks overlay singkat untuk menonjolkan fakta utama.',
    formatTip: 'Pecah cerita dalam 3 scene cepat agar ritmenya terjaga.',
  },
  Instagram: {
    tone: 'Estetis & Aspiratif',
    defaultTopic: 'gaya hidup kreator',
    hookTemplate: 'Tulis caption pembuka yang relatable tentang {keyword} untuk slide pertama.',
    ctaTemplate: 'Ajak audiens menyimpan carousel dan bagikan ke teman dekat.',
    ctaHint: 'ajak audiens menyimpan carousel dan bagikan ke teman dekat',
    proofPoint: 'Tampilkan before-after visual atau testimoni singkat.',
    formatTip: 'Rancang 4-5 slide dengan headline tajam dan highlight emoji.',
  },
  Threads: {
    tone: 'Percakapan & Spontan',
    defaultTopic: 'obrolan komunitas',
    hookTemplate: 'Mulai thread dengan kalimat pendek yang memancing diskusi seputar {keyword}.',
    ctaTemplate: 'Arahkan audiens untuk merespons thread lanjutan atau kirim DM.',
    ctaHint: 'ajak audiens merespons thread lanjutan atau mengirim DM lanjutan',
    proofPoint: 'Sisipkan opini personal atau humor ringan untuk memanaskan percakapan.',
    formatTip: 'Buat 3-4 thread berseri dengan callout yang mudah di-skim.',
  },
};

const pickRandom = <T,>(items: T[], random: () => number) =>
  items[Math.floor(random() * items.length)] ?? items[0];

const createSeededRandom = (seed: number) => {
  let currentSeed = Math.floor(Math.abs(seed) * 1000) || 1;
  return () => {
    currentSeed += 1;
    const value = Math.sin(currentSeed) * 10000;
    return value - Math.floor(value);
  };
};

const generateAiContentSuggestions = (
  platform: string,
  text: string,
  insights: ContentInsights,
  benchmark: (typeof platformBenchmarks)[number],
  revenue: RevenueSnapshot,
  seed: number,
): AiSuggestion[] => {
  const voice = platformVoices[platform] ?? platformVoices.Facebook;
  const keywords = extractKeywords(text);
  const [primaryKeyword, secondaryKeyword, tertiaryKeyword] = [
    keywords[0] ?? voice.defaultTopic,
    keywords[1] ?? 'pertumbuhan komunitas',
    keywords[2] ?? 'engagement audiens',
  ];

  const random = createSeededRandom(seed);

  const readinessFeedback =
    insights.readinessScore > 85
      ? 'Pertahankan alur narasi yang sudah kuat, tinggal poles visual pendukung.'
      : 'Perjelas fokus manfaat utama dan sisipkan CTA eksplisit agar pesan lebih tajam.';

  const ctaCue = insights.hasCTA
    ? 'CTA existing bisa disingkat agar tidak memecah fokus pembaca.'
    : `Tambahkan CTA seperti "${voice.ctaHint}".`;

  const questionCue = insights.hasQuestion
    ? 'Pertanyaan pemicu sudah ada, tinggal tambahkan opsi jawaban untuk memudahkan respon.'
    : 'Tambahkan pertanyaan reflektif di akhir untuk memancing komentar lanjutan.';

  const toneVariants = [voice.tone, `${voice.tone} · ${pickRandom(['Optimistis', 'Visioner', 'Data-driven', 'Empatik'], random)}`];

  return [
    {
      title: `Narasi Cerita ${platform}`,
      tone: toneVariants[0],
      description: [
        voice.hookTemplate.replace('{keyword}', primaryKeyword),
        `Ceritakan momen ketika ${primaryKeyword} menjadi titik balik dan hubungkan dengan ${secondaryKeyword}. ${voice.proofPoint}`,
        `${readinessFeedback} ${questionCue}`,
        voice.ctaTemplate,
      ].join('\n\n'),
    },
    {
      title: `Formula 3 Langkah ${pickRandom(['Actionable', 'Eksperimen', 'Pro Growth'], random)}`,
      tone: toneVariants[1],
      description: [
        `Ramu 3 langkah praktis: (1) ${primaryKeyword.toUpperCase()} insight, (2) ${secondaryKeyword} sebagai studi kasus, (3) ajak audiens mencoba dalam 24 jam.`,
        `${voice.formatTip} Gunakan emoji atau penomoran agar mudah dipindai.`,
        `${ctaCue} Sorot bahwa potensi CPM mencapai ${formatCurrency(revenue.cpmRevenue)} dan RPM ${formatCurrency(revenue.rpmRevenue)} untuk memancing rasa penasaran monetisasi.`,
      ].join('\n\n'),
    },
    {
      title: `Analisa Data & Rekomendasi ${platform}`,
      tone: pickRandom(toneVariants, random),
      description: [
        `Buka dengan insight data: CTR platform ${platform} berada di ${formatPercent(benchmark.ctr)} dengan engagement ${benchmark.engagement}%. Kaitkan dengan ${tertiaryKeyword}.`,
        `Susun perbandingan singkat antara performa sekarang dan target berikutnya. ${voice.proofPoint}`,
        `${questionCue} Tutup dengan highlight ${revenue.ctrLeads.toLocaleString()} potensi klik menuju funnel.`,
      ].join('\n\n'),
    },
  ];
};

const aiImagePrompts = [
  'Ilustrasi gaya flat design tentang komunitas yang saling membantu, warna biru dan jingga.',
  'Foto konseptual suasana kerja kolaboratif dengan pencahayaan sinematik dan tone hangat.',
  'Grafis data futuristik dengan ikon media sosial melingkar dan pola geometrik modern.',
];

const hashtagGroups = [
  {
    label: 'Growth & Komunitas',
    tags: ['#RuangRiung', '#CommunityGrowth', '#DigitalTribe', '#CreatorJourney'],
  },
  {
    label: 'Konten Edukatif',
    tags: ['#BelajarBareng', '#InsightHarian', '#StoryForImpact', '#GrowTogether'],
  },
  {
    label: 'Eksperimen Sosial',
    tags: ['#SocialLab', '#UjiCobaKonten', '#AudiencePulse', '#DataDrivenStory'],
  },
];

const engagementFactors = [
  {
    label: 'Hook 3 detik pertama',
    score: 86,
    insight:
      'Perkuat kalimat pembuka dengan pertanyaan memancing rasa ingin tahu agar retensi meningkat.',
  },
  {
    label: 'Kejelasan pesan inti',
    score: 91,
    insight:
      'Sudah kuat, pertahankan dengan contoh konkret dan ajakan untuk berbagi pengalaman.',
  },
  {
    label: 'Call-to-action',
    score: 74,
    insight:
      'CTA perlu dipertegas dengan manfaat langsung atau penawaran eksklusif.',
  },
  {
    label: 'Visual pendukung',
    score: 68,
    insight:
      'Tambahkan B-roll atau ilustrasi utama yang menggambarkan langkah demi langkah.',
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export default function AnalisaKontenPage() {
  const [activeTab, setActiveTab] = useState<'analisis' | 'kreasi'>('analisis');
  const [selectedPlatform, setSelectedPlatform] = useState('Facebook');
  const [contentInput, setContentInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedImagePrompt, setSelectedImagePrompt] = useState('');

  const selectedBenchmark = useMemo(
    () =>
      platformBenchmarks.find((platform) => platform.name === selectedPlatform) ??
      platformBenchmarks[0],
    [selectedPlatform],
  );

  const estimatedRevenue = useMemo(() => {
    const baseViews = 125_000;
    const cpmRevenue = (selectedBenchmark.cpm / 1000) * baseViews;
    const rpmRevenue = (selectedBenchmark.rpm / 1000) * baseViews;
    const ctrLeads = Math.round((selectedBenchmark.ctr / 100) * baseViews);

    return {
      views: baseViews,
      cpmRevenue,
      rpmRevenue,
      ctrLeads,
    };
  }, [selectedBenchmark]);

  const analysisInsights = useMemo(() => {
    const wordCount = contentInput.trim()
      ? contentInput.trim().split(/\s+/).length
      : 0;
    const charCount = contentInput.length;
    const hasQuestion = /\?|bagaimana|kenapa|mengapa/i.test(contentInput);
    const hasCTA = /gabung|klik|daftar|ikuti|share|bagikan|cek/i.test(
      contentInput,
    );
    const positivity = /terbaik|seru|keren|inspirasi|hebat|mudah/i.test(
      contentInput,
    )
      ? 78
      : 52;
    const readinessScore = Math.min(
      98,
      Math.round(
        (wordCount > 90 ? 30 : wordCount > 40 ? 25 : 18) +
          (hasCTA ? 32 : 12) +
          (hasQuestion ? 18 : 9) +
          positivity / 3,
      ),
    );

    return {
      wordCount,
      charCount,
      hasQuestion,
      hasCTA,
      positivity,
      readinessScore,
    };
  }, [contentInput]);

  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>(() =>
    generateAiContentSuggestions(
      selectedPlatform,
      contentInput,
      analysisInsights,
      selectedBenchmark,
      estimatedRevenue,
      Math.random(),
    ),
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousPlatformRef = useRef(selectedPlatform);

  const regenerateAiSuggestions = useCallback(
    (seed?: number) =>
      generateAiContentSuggestions(
        selectedPlatform,
        contentInput,
        analysisInsights,
        selectedBenchmark,
        estimatedRevenue,
        seed ?? Math.random(),
      ),
    [analysisInsights, contentInput, estimatedRevenue, selectedBenchmark, selectedPlatform],
  );

  useEffect(() => {
    if (previousPlatformRef.current !== selectedPlatform) {
      setAiSuggestions(
        generateAiContentSuggestions(
          selectedPlatform,
          contentInput,
          analysisInsights,
          selectedBenchmark,
          estimatedRevenue,
          Math.random(),
        ),
      );
      previousPlatformRef.current = selectedPlatform;
    }
  }, [analysisInsights, contentInput, estimatedRevenue, selectedBenchmark, selectedPlatform]);

  const handleGenerateAiContent = useCallback(() => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }
    setIsGenerating(true);
    const suggestions = regenerateAiSuggestions(Math.random());
    aiTimeoutRef.current = setTimeout(() => {
      setAiSuggestions(suggestions);
      setIsGenerating(false);
      aiTimeoutRef.current = null;
    }, 320);
  }, [regenerateAiSuggestions]);

  useEffect(() => () => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }
  }, []);

  const handleUseSuggestion = (text: string) => {
    setContentInput(text);
    setActiveTab('analisis');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contentInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Gagal menyalin konten', error);
    }
  };

  const containerClass = darkMode
    ? 'dark bg-slate-950 text-slate-100'
    : 'bg-slate-50 text-slate-900';

  return (
    <div className={`${containerClass} min-h-screen pb-16`}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-16 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-500">RuangRiung Intelligence</p>
              <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-900 dark:text-slate-100">Analisa Konten Lintas Platform</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">Optimalkan performa konten Facebook, YouTube, TikTok, Instagram, dan Threads dengan insight terpusat, estimasi pendapatan, serta rekomendasi AI yang siap pakai.</p>
            </div>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:shadow dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              type="button"
            >
              {darkMode ? (
                <>
                  <SunMedium className="h-4 w-4" />
                  Mode terang
                </>
              ) : (
                <>
                  <MoonStar className="h-4 w-4" />
                  Mode gelap
                </>
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {platformBenchmarks.map((platform) => {
              const isActive = platform.name === selectedPlatform;
              return (
                <button
                  key={platform.name}
                  onClick={() => setSelectedPlatform(platform.name)}
                  type="button"
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-500 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:text-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  {platform.name}
                </button>
              );
            })}
          </div>
        </header>

        <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <nav className="flex gap-2 rounded-full bg-slate-100 p-1 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <button
              type="button"
              onClick={() => setActiveTab('analisis')}
              className={`flex-1 rounded-full px-4 py-2 transition ${
                activeTab === 'analisis'
                  ? 'bg-white text-indigo-600 shadow dark:bg-slate-950 dark:text-indigo-300'
                  : 'hover:text-indigo-500'
              }`}
            >
              Hasil Analisa
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('kreasi')}
              className={`flex-1 rounded-full px-4 py-2 transition ${
                activeTab === 'kreasi'
                  ? 'bg-white text-indigo-600 shadow dark:bg-slate-950 dark:text-indigo-300'
                  : 'hover:text-indigo-500'
              }`}
            >
              Kreasi AI
            </button>
          </nav>

          {activeTab === 'analisis' ? (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Kanvas Analisis Konten</h2>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setContentInput('')}
                      className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:text-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus teks
                    </button>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        copied
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:border-emerald-400 dark:bg-emerald-500/10 dark:text-emerald-300'
                          : 'border-slate-200 bg-white text-slate-600 hover:text-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {copied ? (
                        <>
                          <CopyCheck className="h-3.5 w-3.5" />
                          Tersalin!
                        </>
                      ) : (
                        <>
                          <ClipboardCopy className="h-3.5 w-3.5" />
                          Salin konten
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('kreasi')}
                      className="flex items-center gap-2 rounded-full border border-indigo-500 bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-600"
                    >
                      <Brain className="h-3.5 w-3.5" />
                      Gunakan saran AI
                    </button>
                  </div>
                </div>
                <textarea
                  value={contentInput}
                  onChange={(event) => setContentInput(event.target.value)}
                  placeholder="Tempel skrip atau caption di sini untuk dianalisa..."
                  className="min-h-[220px] w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Skor kesiapan</p>
                    <p className="mt-3 flex items-end gap-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
                      {analysisInsights.readinessScore}
                      <span className="text-base font-semibold text-slate-500 dark:text-slate-400">/100</span>
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {analysisInsights.readinessScore > 80
                        ? 'Konten siap tayang dengan sedikit polishing visual.'
                        : 'Perkuat CTA dan struktur cerita agar lebih meyakinkan.'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Statistik teks</p>
                    <dl className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <div>
                        <dt className="font-medium text-slate-500 dark:text-slate-400">Jumlah kata</dt>
                        <dd className="text-lg font-semibold text-slate-900 dark:text-slate-100">{analysisInsights.wordCount}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-500 dark:text-slate-400">Karakter</dt>
                        <dd className="text-lg font-semibold text-slate-900 dark:text-slate-100">{analysisInsights.charCount}</dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className={`h-4 w-4 ${analysisInsights.hasQuestion ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <span>Pertanyaan pemicu</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className={`h-4 w-4 ${analysisInsights.hasCTA ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <span>CTA eksplisit</span>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-indigo-500">
                    <BarChart3 className="h-4 w-4" />
                    Estimasi pendapatan
                  </h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 p-4 text-white shadow">
                      <p className="text-xs font-medium uppercase tracking-wide">Potensi CPM</p>
                      <p className="mt-2 text-3xl font-bold">{formatCurrency(estimatedRevenue.cpmRevenue)}</p>
                      <p className="mt-1 text-xs text-indigo-100">{selectedBenchmark.cpm.toFixed(2)} CPM · {estimatedRevenue.views.toLocaleString()} tayangan</p>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 p-4 text-white shadow">
                      <p className="text-xs font-medium uppercase tracking-wide">Potensi RPM</p>
                      <p className="mt-2 text-3xl font-bold">{formatCurrency(estimatedRevenue.rpmRevenue)}</p>
                      <p className="mt-1 text-xs text-sky-100">{selectedBenchmark.rpm.toFixed(2)} RPM · {estimatedRevenue.views.toLocaleString()} tayangan</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">CTR estimasi</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatPercent(selectedBenchmark.ctr)}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Perkiraan {estimatedRevenue.ctrLeads.toLocaleString()} klik menuju funnel.</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Engagement</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{selectedBenchmark.engagement}%</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Penilaian berdasarkan kinerja historis niche serupa.</p>
                    </div>
                  </div>
                </div>
              </section>

              <aside className="flex flex-col gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-indigo-500">
                    <TrendingUp className="h-4 w-4" />
                    Perbandingan platform
                  </h3>
                  <div className="mt-4 space-y-4">
                    {platformBenchmarks.map((platform) => {
                      const revenueScore = (platform.cpm + platform.rpm) * 6;
                      return (
                        <div key={platform.name} className="space-y-2">
                          <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-300">
                            <span>{platform.name}</span>
                            <span>{formatPercent(platform.ctr)} CTR</span>
                          </div>
                          <div className="flex items-end gap-2">
                            <div className="flex h-32 w-full items-end rounded-xl bg-gradient-to-t from-indigo-100 to-indigo-400/60 p-2 dark:from-indigo-900/20 dark:to-indigo-500/60">
                              <div
                                className="w-full rounded-lg bg-indigo-600/90 dark:bg-indigo-400"
                                style={{ height: `${Math.min(100, revenueScore)}%` }}
                              />
                            </div>
                            <div className="flex flex-col text-xs text-slate-500 dark:text-slate-400">
                              <span>CPM {platform.cpm.toFixed(2)}</span>
                              <span>RPM {platform.rpm.toFixed(2)}</span>
                              <span>Eng {platform.engagement}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-indigo-500">
                    <Lightbulb className="h-4 w-4" />
                    Insight keterlibatan
                  </h3>
                  <div className="mt-4 space-y-3">
                    {engagementFactors.map((factor) => (
                      <div key={factor.label} className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                        <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-200">
                          <span>{factor.label}</span>
                          <span>{factor.score}/100</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                          <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: `${factor.score}%` }} />
                        </div>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{factor.insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-indigo-500">
                    <Hash className="h-4 w-4" />
                    Rekomendasi hashtag
                  </h3>
                  <div className="mt-3 space-y-3">
                    {hashtagGroups.map((group) => (
                      <div key={group.label} className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{group.label}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {group.tags.map((tag) => (
                            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                              <Hash className="h-3 w-3" />
                              {tag.replace('#', '')}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <section className="flex flex-col gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    <Brain className="h-5 w-5 text-indigo-500" />
                    Saran narasi AI
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Pilih ide konten yang diproses secara dinamis oleh AI berdasarkan analisa teks dan platform pilihan.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Saran memperhitungkan kata kunci dominan, kekuatan CTA, dan peluang monetisasi.
                    </p>
                    <button
                      type="button"
                      onClick={handleGenerateAiContent}
                      disabled={isGenerating}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow transition ${
                        isGenerating
                          ? 'cursor-wait border border-indigo-300 bg-indigo-200 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-500/30 dark:text-indigo-200'
                          : 'border border-indigo-500 bg-indigo-500 text-white hover:bg-indigo-600'
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {isGenerating ? 'Memproses ide...' : 'Hasilkan ulang konten'}
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {aiSuggestions.map((suggestion) => (
                      <div key={suggestion.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{suggestion.title}</h3>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                              {suggestion.description}
                            </p>
                            <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                              <Sparkles className="h-3.5 w-3.5" />
                              {suggestion.tone}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUseSuggestion(suggestion.description)}
                            className="flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-600"
                          >
                            <ChevronRight className="h-4 w-4" />
                            Gunakan konten
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    <ImageIcon className="h-5 w-5 text-indigo-500" />
                    Referensi visual AI
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Gunakan prompt gambar untuk memadukan narasi dan visual secara konsisten.
                  </p>
                  <div className="mt-4 space-y-3">
                    {aiImagePrompts.map((prompt) => (
                      <div
                        key={prompt}
                        className={`rounded-2xl border border-slate-100 p-4 text-sm shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:bg-slate-900/60 ${
                          selectedImagePrompt === prompt
                            ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-slate-900/60'
                            : 'bg-white'
                        }`}
                      >
                        <p>{prompt}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedImagePrompt(prompt)}
                            className="inline-flex items-center gap-2 rounded-full border border-indigo-500 bg-indigo-500 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-indigo-600"
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            Gunakan saran gambar
                          </button>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(prompt)}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:text-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                          >
                            <ClipboardCopy className="h-3.5 w-3.5" />
                            Salin prompt
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <aside className="flex flex-col gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-indigo-500">
                    <Sparkles className="h-4 w-4" />
                    Blueprint konten akhir
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Konten yang dipilih akan langsung masuk ke kanvas analisa untuk langkah finalisasi.
                  </p>
                  <div className="mt-4 rounded-xl border border-dashed border-indigo-300 bg-indigo-50 p-4 text-sm text-indigo-700 dark:border-indigo-500/70 dark:bg-indigo-500/10 dark:text-indigo-200">
                    {contentInput ? (
                      <>
                        <p className="font-semibold">Konten aktif</p>
                        <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed">{contentInput}</p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">Belum ada konten dipilih</p>
                        <p className="mt-1 text-xs">
                          Pilih salah satu saran AI untuk mulai merancang pesan lintas platform.
                        </p>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('analisis')}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Gunakan konten dan analisa
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-indigo-500">
                    <TrendingUp className="h-4 w-4" />
                    Momentum platform saat ini
                  </h3>
                  <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    {platformBenchmarks.map((platform) => (
                      <div
                        key={platform.name}
                        className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60"
                      >
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-slate-200">{platform.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Audience match {platform.audienceMatch}% · Engagement {platform.engagement}%</p>
                        </div>
                        <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                          <p>CPM {platform.cpm.toFixed(2)}</p>
                          <p>RPM {platform.rpm.toFixed(2)}</p>
                          <p>CTR {formatPercent(platform.ctr)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
