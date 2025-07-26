// ruangriung/ruangriung-generator-app/app/prompt/[slug]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Prompt } from '@/lib/prompts';
import Image from 'next/image';
import { Home, Copy, Edit } from 'lucide-react'; // Tambahkan Edit icon
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function PromptDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // State baru untuk mode pengeditan
  const [isUpdating, setIsUpdating] = useState(false); // State untuk status proses update

  useEffect(() => {
    if (slug) {
      const fetchPrompt = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await fetch(`/api/prompts/${slug}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch prompt detail.');
          }
          const data: Prompt = await response.json();
          setPrompt(data);
        } catch (err) {
          console.error("Error fetching prompt detail:", err);
          setError((err as Error).message || 'Terjadi kesalahan saat memuat prompt.');
        } finally {
          setLoading(false);
        }
      };
      fetchPrompt();
    }
  }, [slug]);

  // Fungsi untuk menyalin prompt ke clipboard
  const handleCopyPrompt = async (promptContent: string) => {
    try {
      await navigator.clipboard.writeText(promptContent);
      toast.success("Prompt berhasil disalin!");
    } catch (err) {
      toast.error("Gagal menyalin prompt.");
      console.error("Failed to copy: ", err);
    }
  };

  // Fungsi untuk menangani submit form update
  const handleUpdateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUpdating(true);
    setError(null);

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const updatedPromptData: Partial<Prompt> = {
      title: formData.get('title') as string,
      shortDescription: formData.get('shortDescription') as string,
      category: formData.get('category') as string,
      fullPrompt: formData.get('fullPrompt') as string,
      negativePrompt: formData.get('negativePrompt') as string || undefined,
      notes: formData.get('notes') as string || undefined,
      // Asumsi toolsUsed diinput sebagai string yang dipisahkan koma
      toolsUsed: (formData.get('toolsUsed') as string).split(',').map(item => item.trim()),
      thumbnailUrl: prompt?.thumbnailUrl || undefined, // Gunakan URL thumbnail yang sudah ada
    };

    try {
      const response = await fetch(`/api/prompts/${slug}`, {
        method: 'PUT', // Menggunakan PUT untuk update seluruh resource
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPromptData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui prompt.');
      }

      const data: Prompt = await response.json();
      setPrompt(data); // Perbarui state prompt dengan data terbaru
      setIsEditing(false); // Keluar dari mode pengeditan
      toast.success("Prompt berhasil diperbarui!");
    } catch (err) {
      console.error("Error updating prompt:", err);
      setError((err as Error).message || 'Terjadi kesalahan saat memperbarui prompt.');
      toast.error("Gagal memperbarui prompt.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8 flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300 text-xl">Memuat prompt...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Error: {error}</p>
          <Link
            href="/prompt"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
          >
            <Home size={20} />
            <span>Kembali ke Daftar Prompt</span>
          </Link>
        </div>
      </main>
    );
  }

  if (!prompt) {
    return (
      <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-800 dark:text-gray-100 text-xl mb-4">Prompt tidak ditemukan.</p>
          <Link
            href="/prompt"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
          >
            <Home size={20} />
            <span>Kembali ke Daftar Prompt</span>
          </Link>
        </div>
      </main>
    );
  }

  if (isEditing) {
    return (
      <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8">
        <div className="max-w-4xl mx-auto bg-light-bg dark:bg-dark-bg p-6 md:p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Edit Prompt</h1>
          <form onSubmit={handleUpdateSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Judul Prompt:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={prompt.title}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="shortDescription" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Deskripsi Singkat:
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                defaultValue={prompt.shortDescription}
                rows={3}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Kategori:
              </label>
              <input
                type="text"
                id="category"
                name="category"
                defaultValue={prompt.category}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="toolsUsed" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Alat yang Digunakan (pisahkan dengan koma):
              </label>
              <input
                type="text"
                id="toolsUsed"
                name="toolsUsed"
                defaultValue={prompt.toolsUsed.join(', ')}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="fullPrompt" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Isi Prompt Lengkap:
              </label>
              <textarea
                id="fullPrompt"
                name="fullPrompt"
                defaultValue={prompt.fullPrompt}
                rows={8}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                required
              ></textarea>
            </div>

            {prompt.negativePrompt !== undefined && ( // Hanya tampilkan jika ada negativePrompt awal
              <div className="mb-4">
                <label htmlFor="negativePrompt" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Prompt Negatif:
                </label>
                <textarea
                  id="negativePrompt"
                  name="negativePrompt"
                  defaultValue={prompt.negativePrompt || ''}
                  rows={4}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                ></textarea>
              </div>
            )}

            {prompt.notes !== undefined && ( // Hanya tampilkan jika ada notes awal
              <div className="mb-4">
                <label htmlFor="notes" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Catatan:
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  defaultValue={prompt.notes || ''}
                  rows={4}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                ></textarea>
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
              <button
                type="submit"
                disabled={isUpdating}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-500 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-light-bg dark:bg-dark-bg p-6 md:p-8 rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
        <div className="mb-8 flex justify-between items-center">
          <Link
            href="/prompt"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
          >
            <Home size={20} />
            <span>Semua Prompt</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center flex-grow">Detail Prompt</h1>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
          >
            <Edit size={20} />
            <span>Edit Prompt</span>
          </button>
        </div>

        {prompt.thumbnailUrl && (
          <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden shadow-neumorphic dark:shadow-dark-neumorphic">
            <Image
              src={prompt.thumbnailUrl}
              alt={prompt.title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
        )}

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{prompt.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Oleh: {prompt.author} | Tanggal: {new Date(prompt.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">Deskripsi Singkat:</h3>
          <p className="text-gray-700 dark:text-gray-300">{prompt.shortDescription}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">Kategori:</h3>
          <p className="text-gray-700 dark:text-gray-300">{prompt.category}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">Alat yang Digunakan:</h3>
          <p className="text-gray-700 dark:text-gray-300">{prompt.toolsUsed.join(', ')}</p>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Isi Prompt Lengkap:</h3>
            <button
              onClick={() => handleCopyPrompt(prompt.fullPrompt)}
              className="inline-flex items-center justify-center p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
            >
              <Copy size={16} />
            </button>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
            {prompt.fullPrompt}
          </div>
        </div>

        {prompt.negativePrompt && (
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">Prompt Negatif:</h3>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
              {prompt.negativePrompt}
            </div>
          </div>
        )}

        {prompt.notes && (
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-1">Catatan:</h3>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner-neumorphic dark:shadow-inner-dark-neumorphic text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
              {prompt.notes}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}