'use client';

import { useMemo, useState } from 'react';
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

const aiContentSuggestions = [
  {
    title: 'Storytelling Komunitas',
    description:
      'Bagikan kisah nyata pelanggan yang berhasil setelah bergabung dengan komunitas Anda, sertakan kutipan dan CTA untuk diskusi.',
    tone: 'Hangat & Menginspirasi',
  },
  {
    title: 'Tips Actionable 3 Langkah',
    description:
      'Gunakan format carousel dengan tiga langkah praktis untuk mencapai hasil spesifik, tutup dengan pertanyaan pemicu komentar.',
    tone: 'Informasional & Energik',
  },
  {
    title: 'Debunking Miskonsepsi',
    description:
      'Sorot 3 miskonsepsi populer di industri Anda dan jelaskan fakta sebenarnya dengan data pendukung yang mudah dipahami.',
    tone: 'Edukatif & Persuasif',
  },
];

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
                    Pilih ide konten untuk langsung digunakan atau modifikasi sesuai konteks platform pilihan.
                  </p>
                  <div className="mt-4 space-y-3">
                    {aiContentSuggestions.map((suggestion) => (
                      <div key={suggestion.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{suggestion.title}</h3>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{suggestion.description}</p>
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
