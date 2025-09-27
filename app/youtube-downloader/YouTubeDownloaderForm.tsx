'use client';

import { FormEvent, useMemo, useState } from 'react';
import { CheckCircle2, Download, Loader2, PlaySquare } from 'lucide-react';

const YOUTUBE_URL_PATTERN = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i;

const qualityPresets = {
  mp4: ['1080p', '720p', '480p'],
  mp3: ['320 kbps', '256 kbps', '128 kbps'],
};

export default function YouTubeDownloaderForm() {
  const [videoUrl, setVideoUrl] = useState('');
  const [format, setFormat] = useState<'mp4' | 'mp3'>('mp4');
  const [quality, setQuality] = useState('1080p');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'validating' | 'ready'>('idle');

  const availableQualities = useMemo(() => qualityPresets[format], [format]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!videoUrl.trim()) {
      setErrorMessage('Silakan tempelkan tautan video YouTube terlebih dahulu.');
      setStatus('idle');
      return;
    }

    if (!YOUTUBE_URL_PATTERN.test(videoUrl.trim())) {
      setErrorMessage('URL tidak valid. Pastikan Anda menempelkan tautan dari youtube.com atau youtu.be.');
      setStatus('idle');
      return;
    }

    setStatus('validating');

    // Placeholder flow: pada aplikasi produksi, di sinilah Anda memanggil API backend.
    setTimeout(() => {
      setStatus('ready');
    }, 750);
  };

  const renderStatusMessage = () => {
    if (status === 'validating') {
      return (
        <div className="flex items-center gap-3 rounded-lg bg-white/80 p-4 text-sm text-gray-700 shadow-sm dark:bg-gray-900/80 dark:text-gray-200">
          <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
          <p>Memeriksa metadata video dan menyiapkan tautan unduhan...</p>
        </div>
      );
    }

    if (status === 'ready') {
      return (
        <div className="flex flex-col gap-3 rounded-lg bg-white/90 p-4 text-sm text-gray-700 shadow-md ring-1 ring-purple-200 dark:bg-gray-900/90 dark:text-gray-100 dark:ring-purple-500/30">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-semibold">Tautan unduhan siap dibuat!</p>
          </div>
          <p>
            Hubungkan tombol di bawah ini dengan endpoint backend Anda untuk mengunduh file{' '}
            <span className="font-semibold uppercase">{format}</span> kualitas <span className="font-semibold">{quality}</span>.
          </p>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <Download className="h-4 w-4" />
            <span>Unduh (contoh)</span>
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tombol di atas hanya simulasi. Gunakan fetch/axios untuk memanggil API server-side yang bertanggung jawab terhadap proses
            ekstraksi video dan pastikan Anda mematuhi ketentuan layanan YouTube.
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full rounded-2xl bg-white/80 p-6 shadow-xl ring-1 ring-purple-100 backdrop-blur dark:bg-gray-900/70 dark:ring-purple-500/30">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Tempel tautan YouTube</span>
          <div className="relative">
            <input
              type="url"
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              required
              className="w-full rounded-xl border border-purple-200 bg-white/80 px-4 py-3 text-sm text-gray-700 shadow-inner transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:border-purple-500/30 dark:bg-gray-950/70 dark:text-gray-100 dark:focus:ring-purple-500/40"
            />
            <PlaySquare className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-400" />
          </div>
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Format file</span>
            <select
              value={format}
              onChange={(event) => {
                const nextFormat = event.target.value as 'mp4' | 'mp3';
                setFormat(nextFormat);
                setQuality(qualityPresets[nextFormat][0]);
              }}
              className="w-full rounded-xl border border-purple-200 bg-white/80 px-4 py-3 text-sm text-gray-700 shadow-inner focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:border-purple-500/30 dark:bg-gray-950/70 dark:text-gray-100 dark:focus:ring-purple-500/40"
            >
              <option value="mp4">MP4 (Video)</option>
              <option value="mp3">MP3 (Audio)</option>
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Kualitas</span>
            <select
              value={quality}
              onChange={(event) => setQuality(event.target.value)}
              className="w-full rounded-xl border border-purple-200 bg-white/80 px-4 py-3 text-sm text-gray-700 shadow-inner focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:border-purple-500/30 dark:bg-gray-950/70 dark:text-gray-100 dark:focus:ring-purple-500/40"
            >
              {availableQualities.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          {status === 'validating' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span>{status === 'validating' ? 'Menyiapkan...' : 'Siapkan unduhan'}</span>
        </button>

        {errorMessage ? (
          <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-950/50 dark:text-red-200">
            {errorMessage}
          </p>
        ) : null}

        {renderStatusMessage()}
      </form>
    </div>
  );
}
