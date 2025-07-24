// app/prompt/[slug]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getPrompt } from '@/lib/prompts'; // Mengimpor fungsi untuk mendapatkan prompt
import { ArrowLeft, Copy, User, Calendar, Tag, Settings2Icon } from 'lucide-react'; // Ikon yang relevan
import toast from 'react-hot-toast'; // Untuk notifikasi "berhasil disalin"

export default function PromptDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [prompt, setPrompt] = useState<any>(null); // Menggunakan any untuk fleksibilitas awal

  useEffect(() => {
    if (slug) {
      const foundPrompt = getPrompt(slug);
      if (foundPrompt) {
        setPrompt(foundPrompt);
      } else {
        // Handle case where prompt is not found, e.g., redirect to 404 or prompt list
        console.warn(`Prompt with slug "${slug}" not found.`);
        // Anda bisa menambahkan redirect di sini jika perlu, misalnya:
        // router.push('/404');
      }
    }
  }, [slug]);

  const handleCopyPrompt = async (promptContent: string) => {
    try {
      await navigator.clipboard.writeText(promptContent);
      toast.success("Prompt berhasil disalin!");
    } catch (err) {
      toast.error("Gagal menyalin prompt.");
      console.error("Failed to copy: ", err);
    }
  };

  if (!prompt) {
    return (
      <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8 flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300">Memuat prompt...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-light-bg dark:bg-dark-bg p-6 md:p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
          <Link href="/prompt" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all mb-6">
            <ArrowLeft size={18} />
            <span>Kembali ke Daftar Prompt</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">{prompt.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <p className="flex items-center gap-1">
              <User size={16} /> Oleh <span className="font-semibold text-purple-600 dark:text-purple-400">{prompt.author}</span>
            </p>
            <p className="flex items-center gap-1">
              <Calendar size={16} /> Tanggal: {prompt.date}
            </p>
            <p className="flex items-center gap-1">
              <Tag size={16} /> Kategori: <span className="font-semibold">{prompt.category}</span>
            </p>
            <p className="flex items-center gap-1">
              <Settings2Icon size={16} /> Tools: <span className="font-semibold">{prompt.toolsUsed.join(', ')}</span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-inner mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Prompt Utama:</h2>
            <pre className="whitespace-pre-wrap font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-auto border border-gray-200 dark:border-gray-600">
              {prompt.fullPrompt.trim()}
            </pre>
            <button
              onClick={() => handleCopyPrompt(prompt.fullPrompt)}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white font-bold rounded-lg shadow-md hover:bg-purple-600 transition-colors"
            >
              <Copy size={18} />
              <span>Salin Prompt Utama</span>
            </button>
          </div>

          {prompt.negativePrompt && (
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-inner mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Prompt Negatif (Opsional):</h2>
              <pre className="whitespace-pre-wrap font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-auto border border-gray-200 dark:border-gray-600">
                {prompt.negativePrompt.trim()}
              </pre>
              <button
                onClick={() => handleCopyPrompt(prompt.negativePrompt)}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white font-bold rounded-lg shadow-md hover:bg-purple-600 transition-colors"
              >
                <Copy size={18} />
                <span>Salin Prompt Negatif</span>
              </button>
            </div>
          )}

          {prompt.notes && (
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-inner mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">Catatan:</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{prompt.notes}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}