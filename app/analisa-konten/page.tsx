'use client';

import { useMemo, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  Check,
  ClipboardCopy,
  Loader2,
  Sparkles,
} from 'lucide-react';

const CTA_KEYWORDS = [
  'klik',
  'daftar',
  'beli',
  'kunjungi',
  'subscribe',
  'ikuti',
  'pesan',
  'bergabung',
  'lihat selengkapnya',
  'pelajari lebih lanjut',
  'cari tahu',
  'simak',
  'gunakan',
];

const POSITIVE_WORDS = [
  'hebat',
  'luar biasa',
  'menarik',
  'bagus',
  'seru',
  'inspiratif',
  'mudah',
  'gratis',
  'berhasil',
  'terbaik',
  'unik',
  'bermanfaat',
  'efektif',
  'percaya',
  'aman',
];

const NEGATIVE_WORDS = [
  'buruk',
  'gagal',
  'sulit',
  'rumit',
  'mahal',
  'bahaya',
  'lambat',
  'risiko',
  'benci',
  'bosan',
  'lelah',
  'khawatir',
  'takut',
  'ragu',
];

type KeywordDensity = {
  keyword: string;
  count: number;
  density: number;
};

type AnalysisReport = {
  wordCount: number;
  charCount: number;
  sentenceCount: number;
  estimatedReadingTime: string;
  hashtags: string[];
  mentions: string[];
  emojiCount: number;
  callToActionDetected: boolean;
  positivityScore: number;
  positivityLabel: string;
  keywordDensity: KeywordDensity[];
  keySentences: string[];
};

const formatReadingTime = (wordCount: number) => {
  if (wordCount === 0) return '0 menit';
  const minutes = wordCount / 200;
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return `${seconds} detik`;
  }
  return `${Math.max(1, Math.round(minutes))} menit`;
};

const normalizeToken = (token: string) =>
  token
    .toLowerCase()
    .replace(/^[^\p{L}\p{N}#@]+|[^\p{L}\p{N}#@]+$/gu, '');

const analyzeContent = (text: string): AnalysisReport | null => {
  const clean = text.trim();
  if (!clean) {
    return null;
  }

  const sentenceTokens = clean
    .match(/[^.!?\n]+[.!?]?/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean) ?? [];

  const wordTokens = clean
    .split(/\s+/)
    .map((token) => normalizeToken(token))
    .filter(Boolean);

  const hashtags = Array.from(new Set(wordTokens.filter((token) => token.startsWith('#'))));
  const mentions = Array.from(new Set(wordTokens.filter((token) => token.startsWith('@'))));
  const emojiCount = (clean.match(/\p{Extended_Pictographic}/gu) ?? []).length;

  const positiveMatches = wordTokens.filter((token) => POSITIVE_WORDS.includes(token)).length;
  const negativeMatches = wordTokens.filter((token) => NEGATIVE_WORDS.includes(token)).length;

  const positivityScore = wordTokens.length
    ? Math.max(
        0,
        Math.min(100, Math.round(((positiveMatches - negativeMatches) / wordTokens.length) * 50 + 50)),
      )
    : 50;

  const positivityLabel = positivityScore >= 66 ? 'Positif' : positivityScore <= 40 ? 'Perlu ditingkatkan' : 'Netral';

  const callToActionDetected = CTA_KEYWORDS.some((keyword) => clean.toLowerCase().includes(keyword));

  const keywordFrequency = wordTokens.reduce<Record<string, number>>((acc, token) => {
    if (token.startsWith('#') || token.startsWith('@') || token.length < 4) {
      return acc;
    }
    acc[token] = (acc[token] ?? 0) + 1;
    return acc;
  }, {});

  const keywordDensity = Object.entries(keywordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: Number(((count / wordTokens.length) * 100).toFixed(2)),
    }));

  const scoredSentences = sentenceTokens.map((sentence) => {
    const lower = sentence.toLowerCase();
    let score = 0;

    if (lower.includes('?')) score += 1;
    if (CTA_KEYWORDS.some((cta) => lower.includes(cta))) score += 2;
    if (hashtags.some((tag) => lower.includes(tag.substring(1)))) score += 1;
    if (mentions.some((tag) => lower.includes(tag.substring(1)))) score += 1;

    return { sentence, score };
  });

  const keySentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .filter((entry) => entry.score > 0)
    .slice(0, 3)
    .map((entry) => entry.sentence);

  return {
    wordCount: wordTokens.length,
    charCount: clean.length,
    sentenceCount: sentenceTokens.length,
    estimatedReadingTime: formatReadingTime(wordTokens.length),
    hashtags,
    mentions,
    emojiCount,
    callToActionDetected,
    positivityScore,
    positivityLabel,
    keywordDensity,
    keySentences,
  };
};

const buildAiPrompt = (content: string) => `Kamu adalah analis konten sosial media profesional.

Analisis konten berikut:
"""
${content.trim()}
"""

Berikan hasil dalam bahasa Indonesia dengan format yang rapi:
- Insight utama terhadap gaya bahasa dan struktur konten
- Rekomendasi perbaikan konten secara spesifik
- Daftar hashtag relevan (maksimal 8)
- Ide CTA yang bisa dipakai
- Ringkasan satu paragraf yang siap dipakai ulang`;

export default function ContentAnalysisPage() {
  const [content, setContent] = useState('');
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const stats = useMemo(() => {
    if (!analysisReport) return [];
    return [
      {
        label: 'Jumlah kata',
        value: analysisReport.wordCount.toLocaleString('id-ID'),
      },
      {
        label: 'Jumlah karakter',
        value: analysisReport.charCount.toLocaleString('id-ID'),
      },
      {
        label: 'Jumlah kalimat',
        value: analysisReport.sentenceCount.toLocaleString('id-ID'),
      },
      {
        label: 'Estimasi waktu baca',
        value: analysisReport.estimatedReadingTime,
      },
    ];
  }, [analysisReport]);

  const handleAnalyze = () => {
    setAnalysisError(null);
    const report = analyzeContent(content);
    if (!report) {
      setAnalysisReport(null);
      setAnalysisError('Masukkan konten terlebih dahulu sebelum menganalisis.');
      return;
    }
    setAnalysisReport(report);
  };

  const handleGenerateSuggestion = async () => {
    if (!content.trim()) {
      setAiError('Masukkan konten terlebih dahulu sebelum meminta saran AI.');
      return;
    }

    setAiError(null);
    setIsAiLoading(true);
    setAiSuggestion('');

    try {
      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai',
          temperature: 0.6,
          messages: [
            {
              role: 'system',
              content:
                'Kamu adalah konsultan konten yang selalu memberikan analisis tajam dan rekomendasi yang bisa langsung dieksekusi.',
            },
            {
              role: 'user',
              content: buildAiPrompt(content),
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal memproses permintaan ke Pollinations.');
      }

      const data = await response.json();
      const suggestion = data?.choices?.[0]?.message?.content?.trim();

      if (!suggestion) {
        throw new Error('Respons AI kosong.');
      }

      setAiSuggestion(suggestion);
    } catch (error) {
      console.error(error);
      setAiError('Terjadi kesalahan saat mengambil saran AI. Coba lagi dalam beberapa saat.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!aiSuggestion) return;
    try {
      await navigator.clipboard.writeText(aiSuggestion);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUseSuggestion = () => {
    if (!aiSuggestion) return;
    setContent((prev) => `${prev ? `${prev}\n\n` : ''}${aiSuggestion}`);
  };

  return (
    <div className="min-h-screen bg-slate-950/5 py-10 dark:bg-slate-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-700 dark:bg-purple-500/10 dark:text-purple-200">
            <Sparkles className="h-4 w-4" />
            Analisis Konten Sosial Media
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
            Ruang Analisa Konten
          </h1>
          <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-300">
            Tempelkan konsep atau draft kontenmu pada bidang di bawah, kemudian jalankan analisis otomatis untuk mendapatkan metrik dasar.
            Gunakan tombol saran AI agar sistem memberikan insight dan rekomendasi perbaikan yang langsung dapat dipakai.
          </p>
        </header>

        <section className="space-y-4">
          <div>
            <label htmlFor="content" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Konten untuk dianalisis
            </label>
            <textarea
              id="content"
              rows={10}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Tempelkan caption, skrip video, atau ide kontenmu di sini..."
              className="w-full rounded-xl border border-slate-200 bg-white p-4 text-base text-slate-900 shadow-sm transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <p>
                Kontenmu tidak disimpan. Gunakan tombol di bawah untuk melihat insight cepat dan rekomendasi otomatis.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleGenerateSuggestion}
                disabled={isAiLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {isAiLoading ? 'Meminta saran AI...' : 'Minta saran AI'}
              </button>
              <button
                type="button"
                onClick={handleAnalyze}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-purple-400 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-purple-500 dark:hover:text-purple-300 sm:w-auto"
              >
                <BarChart3 className="h-4 w-4" />
                Analisis Konten
              </button>
            </div>
          </div>
        </section>

        {analysisError && (
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
            <AlertCircle className="mt-0.5 h-5 w-5" />
            <p>{analysisError}</p>
          </div>
        )}

        {analysisReport && (
          <section className="mt-8 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Ringkasan Analisis</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Gunakan ringkasan ini sebagai acuan cepat untuk menyesuaikan nada, struktur, dan potensi performa kontenmu.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800"
                >
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Kualitas narasi</h3>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      analysisReport.positivityScore >= 66
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                        : analysisReport.positivityScore <= 40
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-300'
                    }`}
                  >
                    {analysisReport.positivityLabel} · {analysisReport.positivityScore}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <p>
                    {analysisReport.callToActionDetected
                      ? 'Call-to-action terdeteksi di dalam konten. Pertimbangkan untuk menegaskan CTA dengan manfaat yang jelas.'
                      : 'Belum ada call-to-action spesifik. Tambahkan ajakan bertindak yang jelas untuk mengarahkan audiens.'}
                  </p>
                  <p>
                    {analysisReport.emojiCount > 0
                      ? `Terdapat ${analysisReport.emojiCount} emoji. Pastikan penggunaannya mendukung pesan dan tidak berlebihan.`
                      : 'Belum ada emoji yang digunakan. Pertimbangkan 1-2 emoji yang relevan jika sesuai dengan identitas brand.'}
                  </p>
                </div>
                {analysisReport.keySentences.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Kalimat yang menonjol</p>
                    <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      {analysisReport.keySentences.map((sentence) => (
                        <li key={sentence} className="rounded-lg bg-slate-100 p-3 dark:bg-slate-700/40">
                          {sentence}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tag dan mention</h3>
                  <div className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-200">Hashtag</p>
                      {analysisReport.hashtags.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {analysisReport.hashtags.map((tag) => (
                            <span key={tag} className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Belum ada hashtag. Tambahkan 2-4 hashtag spesifik agar mudah ditemukan.
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-200">Mention</p>
                      {analysisReport.mentions.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {analysisReport.mentions.map((tag) => (
                            <span key={tag} className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Belum ada mention. Tag kolaborator atau sumber untuk meningkatkan kredibilitas.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Kata kunci dominan</h3>
                  {analysisReport.keywordDensity.length > 0 ? (
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      {analysisReport.keywordDensity.map((item) => (
                        <li key={item.keyword} className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-700/40">
                          <span className="font-medium">{item.keyword}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{item.count}× · {item.density}%</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Belum ada kata kunci dominan. Tambahkan kata yang mencerminkan topik utama agar algoritma lebih mudah mengenali konteks.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {(aiError || aiSuggestion) && (
          <section className="mt-10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Saran AI</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Hasil otomatis dari Pollinations AI. Gunakan untuk memperkuat konten sebelum dipublikasikan.
                </p>
              </div>
              {aiSuggestion && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-purple-400 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 dark:border-slate-700 dark:text-slate-300 dark:hover:border-purple-500 dark:hover:text-purple-200"
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
                    {isCopied ? 'Disalin' : 'Salin'}
                  </button>
                  <button
                    type="button"
                    onClick={handleUseSuggestion}
                    className="inline-flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  >
                    Gunakan konten
                  </button>
                </div>
              )}
            </div>

            {aiError && (
              <div className="flex items-start gap-3 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
                <AlertCircle className="mt-0.5 h-5 w-5" />
                <p>{aiError}</p>
              </div>
            )}

            {aiSuggestion && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                {aiSuggestion}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
