
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicTurnstile = dynamic(() => import('./TurnstileWidget'), {
  ssr: false,
  loading: () => (
    <div className="w-[300px] h-[65px] bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
  ),
});

interface PromptSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PromptSubmissionForm({ isOpen, onClose }: PromptSubmissionFormProps) {
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [promptContent, setPromptContent] = useState('');
  const [tool, setTool] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [token, setToken] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);
    setIsSubmitting(true);
    setSubmitStatus(null);

    const response = await fetch('/api/submit-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        author,
        email,
        title,
        promptContent,
        tool,
        tags: tags.split(',').map(tag => tag.trim()),
        token,
      }),
    });

    setIsSubmitting(false);

    if (response.ok) {
      setSubmitStatus('success');
      setAuthor('');
      setEmail('');
      setTitle('');
      setPromptContent('');
      setTool('');
      setTags('');
      setToken('');
    } else {
      setSubmitStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Kirim Prompt Anda</h2>
        {submitStatus === 'success' ? (
          <div className="text-green-500 text-center">
            <p>Prompt berhasil dikirim! Terima kasih atas kontribusi Anda.</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Tutup</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Nama Anda" value={author} onChange={e => setAuthor(e.target.value)} required className="p-2 border rounded dark:bg-gray-700" />
              <input type="email" placeholder="Email Anda" value={email} onChange={e => setEmail(e.target.value)} required className="p-2 border rounded dark:bg-gray-700" />
            </div>
            <input type="text" placeholder="Judul Prompt" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded mb-4 dark:bg-gray-700" />
            <textarea placeholder="Isi Prompt" value={promptContent} onChange={e => setPromptContent(e.target.value)} required rows={6} className="w-full p-2 border rounded mb-4 dark:bg-gray-700"></textarea>
            <input type="text" placeholder="Tool yang Digunakan (e.g., DALL-E 3)" value={tool} onChange={e => setTool(e.target.value)} required className="w-full p-2 border rounded mb-4 dark:bg-gray-700" />
            <input type="text" placeholder="Tags (pisahkan dengan koma)" value={tags} onChange={e => setTags(e.target.value)} className="w-full p-2 border rounded mb-6 dark:bg-gray-700" />

            <div className="flex justify-center mb-6">
              <DynamicTurnstile onSuccess={setToken} />
            </div>

            <div className="flex justify-end gap-4">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400">Batal</button>
              <button type="submit" disabled={isSubmitting || !token} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-500">
                {isSubmitting ? 'Mengirim...' : 'Kirim'}
              </button>
            </div>
            {captchaError && <p className="text-red-500 mt-4">Silakan selesaikan verifikasi keamanan.</p>}
            {submitStatus === 'error' && <p className="text-red-500 mt-4">Gagal mengirim prompt. Silakan coba lagi.</p>}
          </form>
        )}
      </div>
    </div>
  );
}
