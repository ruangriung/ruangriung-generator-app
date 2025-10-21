'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Prompt } from '@/lib/prompts';

const DynamicTurnstile = dynamic(() => import('./TurnstileWidget'), {
  ssr: false,
  loading: () => (
    <div className="w-[300px] h-[65px] bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
  ),
});

interface PromptSubmissionFormProps {
  isOpen: boolean;
  onClose?: () => void;
  mode?: 'create' | 'edit';
  initialPrompt?: Prompt;
  onSuccess?: (prompt: Prompt) => void;
  variant?: 'modal' | 'page';
}

const parseTags = (value: string) =>
  value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);

export default function PromptSubmissionForm({
  isOpen,
  onClose,
  mode = 'create',
  initialPrompt,
  onSuccess,
  variant = 'modal',
}: PromptSubmissionFormProps) {
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [promptContent, setPromptContent] = useState('');
  const [tool, setTool] = useState('');
  const [tags, setTags] = useState('');
  const [facebook, setFacebook] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [token, setToken] = useState(() =>
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ? '' : 'captcha-skipped',
  );
  const [adminToken, setAdminToken] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [createdPrompt, setCreatedPrompt] = useState<Prompt | null>(null);

  const isEditMode = mode === 'edit';
  const isStandalone = variant === 'page';
  const isFormVisible = isStandalone || isOpen;
  const isCaptchaConfigured = Boolean(
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
  );

  const containerClasses = useMemo(
    () =>
      isStandalone
        ? 'w-full rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:p-8'
        : 'w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-8 max-h-[calc(100vh-2rem)] overflow-y-auto',
    [isStandalone],
  );

  useEffect(() => {
    if (!isFormVisible) {
      setToken(isCaptchaConfigured ? '' : 'captcha-skipped');
      return;
    }

    const prompt = initialPrompt;
    setAuthor(prompt?.author ?? '');
    setEmail(prompt?.email ?? '');
    setTitle(prompt?.title ?? '');
    setPromptContent(prompt?.promptContent ?? '');
    setTool(prompt?.tool ?? '');
    setTags(prompt?.tags?.join(', ') ?? '');
    setFacebook(prompt?.facebook ?? '');
    setLink(prompt?.link ?? '');
    setImage(prompt?.image ?? '');
    setDate(prompt?.date ?? '');
    setSubmitStatus(null);
    setFeedbackMessage('');
    setCaptchaError(false);
    setAdminToken('');
    setCreatedPrompt(isEditMode ? prompt ?? null : null);
    setToken(isCaptchaConfigured ? '' : 'captcha-skipped');
  }, [
    isFormVisible,
    initialPrompt,
    isEditMode,
    isCaptchaConfigured,
  ]);

  const handleClose = () => {
    onClose?.();
    setSubmitStatus(null);
    setFeedbackMessage('');
    setCaptchaError(false);
    setCreatedPrompt(isEditMode ? initialPrompt ?? null : null);
    setToken(isCaptchaConfigured ? '' : 'captcha-skipped');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isEditMode && isCaptchaConfigured && !token) {
      setCaptchaError(true);
      return;
    }

    if (isEditMode && !initialPrompt?.slug) {
      setSubmitStatus('error');
      setFeedbackMessage('Prompt tidak memiliki slug yang valid.');
      return;
    }

    if (isEditMode && !adminToken.trim()) {
      setSubmitStatus('error');
      setFeedbackMessage('Token admin diperlukan untuk mengedit prompt.');
      return;
    }

    setCaptchaError(false);
    setIsSubmitting(true);
    setSubmitStatus(null);
    setFeedbackMessage('');

    const normalizedDate = date.trim();
    const todayDate = new Date().toISOString().split('T')[0];
    const resolvedDate = normalizedDate || todayDate;
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
      date: resolvedDate,
    };

    try {
      const endpoint = isEditMode ? `/api/prompts/${initialPrompt?.slug}` : '/api/submit-prompt';
      const method = isEditMode ? 'PATCH' : 'POST';
      const body = {
        ...payload,
        ...(isEditMode
          ? {}
          : isCaptchaConfigured
            ? { token }
            : {}),
      };

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (isEditMode) {
        headers['x-admin-token'] = adminToken.trim();
      }

      const response = await fetch(endpoint, {
        method,
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Gagal memproses permintaan.');
      }

      const prompt: Prompt | undefined = data?.prompt;
      const persisted: boolean =
        typeof data?.persisted === 'boolean' ? data.persisted : true;

      if (!prompt) {
        throw new Error('Server tidak mengembalikan data prompt.');
      }

      if (isEditMode) {
        setAuthor(prompt.author ?? '');
        setEmail(prompt.email ?? '');
        setTitle(prompt.title ?? '');
        setPromptContent(prompt.promptContent ?? '');
        setTool(prompt.tool ?? '');
        setTags(prompt.tags?.join(', ') ?? '');
        setFacebook(prompt.facebook ?? '');
        setLink(prompt.link ?? '');
        setImage(prompt.image ?? '');
        setDate(prompt.date ?? '');
      } else {
        setAuthor('');
        setEmail('');
        setTitle('');
        setPromptContent('');
        setTool('');
        setTags('');
        setFacebook('');
        setLink('');
        setImage('');
        setDate('');
        setToken(isCaptchaConfigured ? '' : 'captcha-skipped');
      }

      setSubmitStatus('success');
      const successMessage = isEditMode
        ? 'Prompt berhasil diperbarui dan perubahan langsung ditayangkan.'
        : persisted
            ? 'Prompt berhasil dikirim dan langsung dipublikasikan.'
            : 'Prompt berhasil dikirim dan langsung ditampilkan di katalog dengan penyimpanan sementara.';
      setFeedbackMessage(successMessage);

      setCreatedPrompt(prompt);
      onSuccess?.(prompt);
    } catch (error: any) {
      console.error('Prompt submission failed:', error);
      setSubmitStatus('error');
      setFeedbackMessage(
        error instanceof Error ? error.message : 'Gagal memproses permintaan. Silakan coba lagi.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isFormVisible) {
    return null;
  }

  const formContent = (
    <div className={containerClasses}>
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Prompt' : 'Kirim Prompt Anda'}
      </h2>
      {submitStatus === 'success' ? (
        <div className="text-green-500 text-center">
          <p>{feedbackMessage}</p>
          {isStandalone && createdPrompt ? (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/kumpulan-prompt/${createdPrompt.slug}`}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
              >
                Lihat Detail Prompt
              </Link>
              <Link
                href="/kumpulan-prompt"
                className="inline-flex items-center justify-center rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-500/10"
              >
                Jelajahi Kumpulan Prompt
              </Link>
            </div>
          ) : (
            <button
              onClick={handleClose}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tutup
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 mb-4">
            <input
              type="text"
              placeholder="Nama Anda"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              required
              className="p-3 border rounded-lg dark:bg-gray-700"
            />
            <input
              type="email"
              placeholder="Email Anda"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required={!isEditMode}
              className="p-3 border rounded-lg dark:bg-gray-700"
            />
          </div>
          <input
            type="url"
            placeholder="Link Facebook (opsional)"
            value={facebook}
            onChange={e => setFacebook(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700"
          />
          <input
            type="url"
            placeholder="Link Referensi (opsional)"
            value={link}
            onChange={e => setLink(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700"
          />
          <input
            type="url"
            placeholder="Link Gambar (opsional)"
            value={image}
            onChange={e => setImage(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700"
          />
          <input
            type="text"
            placeholder="Judul Prompt"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700"
          />
          <textarea
            placeholder="Isi Prompt"
            value={promptContent}
            onChange={e => setPromptContent(e.target.value)}
            required
            rows={6}
            className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700"
          ></textarea>
          <input
            type="text"
            placeholder="Tool yang Digunakan (e.g., DALL-E 3)"
            value={tool}
            onChange={e => setTool(e.target.value)}
            required
            className="w-full p-3 border rounded-lg mb-4 dark:bg-gray-700"
          />
          <div className="mb-4">
            <label htmlFor="prompt-date" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Tanggal Publikasi (opsional)
            </label>
            <input
              id="prompt-date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="mt-2 w-full p-3 border rounded-lg dark:bg-gray-700"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Kosongkan untuk menggunakan tanggal hari ini secara otomatis.
            </p>
          </div>
          <input
            type="text"
            placeholder="Tags (pisahkan dengan koma)"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="w-full p-3 border rounded-lg mb-6 dark:bg-gray-700"
          />

          {isEditMode && (
            <div className="mb-6">
              <input
                type="password"
                placeholder="Token admin"
                value={adminToken}
                onChange={e => setAdminToken(e.target.value)}
                className="w-full p-3 border rounded-lg dark:bg-gray-700"
                required
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Masukkan token admin untuk memverifikasi hak edit.
              </p>
            </div>
          )}

          {!isEditMode && isCaptchaConfigured && (
            <div className="flex justify-center mb-6">
              <DynamicTurnstile onSuccess={setToken} />
            </div>
          )}

          {!isEditMode && !isCaptchaConfigured && (
            <p className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500 dark:bg-amber-500/10 dark:text-amber-200">
              Verifikasi captcha sedang dinonaktifkan karena konfigurasi lingkungan
              belum lengkap. Kirimkan formulir seperti biasa.
            </p>
          )}

          <div className="flex justify-end gap-4">
            {!isStandalone && (
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Batal
              </button>
            )}
            <button
              type="submit"
              disabled={
                isSubmitting || (!isEditMode && isCaptchaConfigured && !token)
              }
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-500"
            >
              {isSubmitting ? 'Mengirim...' : isEditMode ? 'Simpan Perubahan' : 'Kirim'}
            </button>
          </div>

          {captchaError && !isEditMode && isCaptchaConfigured && (
            <p className="text-red-500 mt-4">Silakan selesaikan verifikasi keamanan.</p>
          )}
          {submitStatus === 'error' && (
            <p className="text-red-500 mt-4">{feedbackMessage}</p>
          )}
        </form>
      )}
    </div>
  );

  if (isStandalone) {
    return formContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50 p-4 sm:items-center sm:p-6">
      {formContent}
    </div>
  );
}
