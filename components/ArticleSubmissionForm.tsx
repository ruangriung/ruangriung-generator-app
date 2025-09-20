'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicTurnstile = dynamic(() => import('./TurnstileWidget'), {
  ssr: false,
  loading: () => (
    <div className="w-[300px] h-[65px] bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
  ),
});

interface ArticleSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArticleSubmissionForm({ isOpen, onClose }: ArticleSubmissionFormProps) {
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [references, setReferences] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [token, setToken] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setAuthor('');
    setEmail('');
    setTitle('');
    setSummary('');
    setContent('');
    setCategory('');
    setTags('');
    setReferences('');
    setToken('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setCaptchaError(true);
      return;
    }

    setCaptchaError(false);
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/submit-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author,
          email,
          title,
          summary,
          content,
          category,
          tags: tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean),
          references,
          token,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        resetForm();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Gagal mengirim artikel:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Kirim Artikel Anda</h2>
        {submitStatus === 'success' ? (
          <div className="text-green-500 text-center">
            <p>Artikel berhasil dikirim! Terima kasih atas kontribusi Anda.</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nama Anda"
                value={author}
                onChange={event => setAuthor(event.target.value)}
                required
                className="p-2 border rounded dark:bg-gray-700"
              />
              <input
                type="email"
                placeholder="Email Anda"
                value={email}
                onChange={event => setEmail(event.target.value)}
                required
                className="p-2 border rounded dark:bg-gray-700"
              />
            </div>
            <input
              type="text"
              placeholder="Judul Artikel"
              value={title}
              onChange={event => setTitle(event.target.value)}
              required
              className="w-full p-2 border rounded dark:bg-gray-700"
            />
            <input
              type="text"
              placeholder="Kategori (opsional)"
              value={category}
              onChange={event => setCategory(event.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700"
            />
            <textarea
              placeholder="Ringkasan Artikel"
              value={summary}
              onChange={event => setSummary(event.target.value)}
              rows={3}
              className="w-full p-2 border rounded dark:bg-gray-700"
            ></textarea>
            <textarea
              placeholder="Isi Artikel"
              value={content}
              onChange={event => setContent(event.target.value)}
              required
              rows={10}
              className="w-full p-2 border rounded dark:bg-gray-700"
            ></textarea>
            <input
              type="text"
              placeholder="Tags (pisahkan dengan koma)"
              value={tags}
              onChange={event => setTags(event.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700"
            />
            <textarea
              placeholder="Referensi atau catatan tambahan (opsional)"
              value={references}
              onChange={event => setReferences(event.target.value)}
              rows={3}
              className="w-full p-2 border rounded dark:bg-gray-700"
            ></textarea>

            <div className="flex justify-center mb-6">
              <DynamicTurnstile onSuccess={setToken} />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !token}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-500"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim'}
              </button>
            </div>
            {captchaError && (
              <p className="text-red-500 mt-4">Silakan selesaikan verifikasi keamanan.</p>
            )}
            {submitStatus === 'error' && (
              <p className="text-red-500 mt-4">Gagal mengirim artikel. Silakan coba lagi.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
