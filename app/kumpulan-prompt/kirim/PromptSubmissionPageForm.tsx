'use client';

import { useState, type FormEvent } from 'react';
import dynamic from 'next/dynamic';
import type { Prompt } from '@/lib/prompts';

const DynamicTurnstile = dynamic(() => import('@/components/TurnstileWidget'), {
  ssr: false,
  loading: () => (
    <div className="h-[65px] w-[300px] animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
  ),
});

const parseTags = (value: string) =>
  value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);

export interface PromptSubmissionPageFormResult {
  prompt: Prompt;
  persisted: boolean;
}

interface PromptSubmissionPageFormProps {
  onCancel: () => void;
  onSuccess: (result: PromptSubmissionPageFormResult) => void;
}

export default function PromptSubmissionPageForm({ onCancel, onSuccess }: PromptSubmissionPageFormProps) {
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [promptContent, setPromptContent] = useState('');
  const [tool, setTool] = useState('');
  const [tags, setTags] = useState('');
  const [facebook, setFacebook] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const [token, setToken] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const resetForm = () => {
    setAuthor('');
    setEmail('');
    setTitle('');
    setPromptContent('');
    setTool('');
    setTags('');
    setFacebook('');
    setLink('');
    setImage('');
    setToken('');
    setCaptchaError(false);
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setCaptchaError(true);
      return;
    }

    setCaptchaError(false);
    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      author: author.trim(),
      email: email.trim(),
      facebook: facebook.trim(),
      image: image.trim(),
      link: link.trim(),
      title: title.trim(),
      promptContent: promptContent.trim(),
      tool: tool.trim(),
      tags: parseTags(tags),
    };

    try {
      const response = await fetch('/api/submit-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...payload, token, skipEmail: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Gagal memproses permintaan.');
      }

      const prompt: Prompt | undefined = data?.prompt;
      const persisted: boolean = typeof data?.persisted === 'boolean' ? data.persisted : true;

      if (!prompt) {
        throw new Error('Server tidak mengembalikan data prompt.');
      }

      resetForm();
      onSuccess({ prompt, persisted });
    } catch (error) {
      console.error('Prompt submission failed:', error);
      setSubmitError(
        error instanceof Error ? error.message : 'Gagal memproses permintaan. Silakan coba lagi.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-6 shadow-sm dark:border-blue-400/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 dark:text-slate-100 sm:p-8">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-200">
          Tips agar prompt Anda mudah dikurasi
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Tuliskan judul yang singkat, jelas, dan menggambarkan hasil akhir prompt.</li>
          <li>Jelaskan konteks penggunaan prompt secara rinci agar mudah direplikasi.</li>
          <li>Sertakan referensi visual atau tautan yang mendukung bila tersedia.</li>
          <li>Pisahkan tag dengan koma untuk memudahkan pencarian dan kategorisasi.</li>
        </ul>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80 sm:p-10"
      >
        <fieldset className="space-y-6">
          <legend className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Informasi Kontributor
          </legend>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="author" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Nama Lengkap
              </label>
              <input
                id="author"
                type="text"
                value={author}
                onChange={event => setAuthor(event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/40"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Nama ini akan ditampilkan sebagai kontributor prompt.
              </p>
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Email Aktif
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/40"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Kami hanya menggunakan email ini untuk konfirmasi internal.
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="facebook" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Facebook / Media Sosial (opsional)
              </label>
              <input
                id="facebook"
                type="url"
                value={facebook}
                onChange={event => setFacebook(event.target.value)}
                placeholder="https://www.facebook.com/username"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/40"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Tautan ini akan kami tampilkan bila Anda ingin dicantumkan sebagai sumber.
              </p>
            </div>
            <div>
              <label htmlFor="link" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Referensi Tambahan (opsional)
              </label>
              <input
                id="link"
                type="url"
                value={link}
                onChange={event => setLink(event.target.value)}
                placeholder="https://contoh.com/inspirasi"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/40"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Sertakan rujukan jika prompt terinspirasi dari sumber tertentu.
              </p>
            </div>
          </div>
        </fieldset>

        <fieldset className="mt-10 space-y-6">
          <legend className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Detail Prompt
          </legend>
          <div>
            <label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Judul Prompt
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={event => setTitle(event.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/40"
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Maksimalkan 70 karakter pertama agar menarik di halaman daftar prompt.
            </p>
          </div>
          <div>
            <label htmlFor="promptContent" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Isi Prompt Lengkap
            </label>
            <textarea
              id="promptContent"
              value={promptContent}
              onChange={event => setPromptContent(event.target.value)}
              required
              rows={8}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/40"
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Cantumkan instruksi langkah demi langkah atau parameter penting agar hasilnya konsisten.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <label htmlFor="tool" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Tool / Model AI
              </label>
              <input
                id="tool"
                type="text"
                value={tool}
                onChange={event => setTool(event.target.value)}
                required
                placeholder="Contoh: Midjourney v6, Stable Diffusion XL, ChatGPT"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/40"
              />
            </div>
            <div>
              <label htmlFor="image" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Gambar Pratinjau (opsional)
              </label>
              <input
                id="image"
                type="url"
                value={image}
                onChange={event => setImage(event.target.value)}
                placeholder="https://images.site/prompt.jpg"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/40"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Gunakan URL gambar beresolusi tinggi (jika ada) untuk mempercantik katalog prompt.
              </p>
            </div>
          </div>
          <div>
            <label htmlFor="tags" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Tag Prompt
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={event => setTags(event.target.value)}
              placeholder="contoh: karakter, sci-fi, produk"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/40"
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Pisahkan dengan koma. Tag membantu kami membuat front matter secara otomatis.
            </p>
          </div>
        </fieldset>

        <div className="mt-10 space-y-6">
          <div className="flex justify-center">
            <DynamicTurnstile onSuccess={value => setToken(value)} />
          </div>
          {captchaError && (
            <p className="text-center text-sm font-semibold text-red-500">
              Silakan selesaikan verifikasi keamanan sebelum mengirim.
            </p>
          )}
          {submitError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-950/50 dark:text-red-200">
              {submitError}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100"
          >
            Batal dan Kembali
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !token}
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSubmitting ? 'Mengirim Prompt...' : 'Kirim Prompt ke RuangRiung'}
          </button>
        </div>
      </form>
    </div>
  );
}
