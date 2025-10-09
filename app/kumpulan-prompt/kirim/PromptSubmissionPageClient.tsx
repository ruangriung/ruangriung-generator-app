'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import PromptSubmissionForm from '@/components/PromptSubmissionForm';
import type { Prompt } from '@/lib/prompts';

export default function PromptSubmissionPageClient() {
  const router = useRouter();

  const handleSuccess = useCallback(
    (prompt: Prompt) => {
      router.prefetch('/kumpulan-prompt');
      router.prefetch(`/kumpulan-prompt/${prompt.slug}`);
    },
    [router],
  );

  return (
    <main className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-center">
          <Link
            href="/kumpulan-prompt"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-light-bg px-4 py-2 font-semibold text-gray-700 shadow-neumorphic-button transition hover:-translate-y-0.5 hover:shadow-neumorphic-button-hover dark:bg-dark-bg dark:text-gray-200 dark:shadow-dark-neumorphic-button"
          >
            <ArrowLeft size={18} />
            <span>Kembali ke Kumpulan Prompt</span>
          </Link>
        </div>

        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl dark:bg-gray-800 sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg">
              <Sparkles className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Bagikan Prompt Kreatifmu
            </h1>
            <p className="mt-3 text-base text-gray-600 dark:text-gray-300 sm:text-lg">
              Isi formulir di bawah ini untuk mempublikasikan prompt Anda di RuangRiung. Prompt yang berhasil dikirim akan langsung tampil di katalog dan mendapatkan halaman detail tersendiri.
            </p>
          </div>

          <PromptSubmissionForm isOpen variant="page" onSuccess={handleSuccess} />
        </div>
      </div>
    </main>
  );
}
