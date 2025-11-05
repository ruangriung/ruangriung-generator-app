import Chatbot from '@/components/Chatbot';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Bot, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Asisten AI RuangRiung',
  description:
    'Ngobrol dengan chatbot AI RuangRiung untuk mencari ide konten, menerjemahkan istilah rumit, atau mendapatkan panduan penggunaan fitur.',
};

type AsistenAIPageProps = {
  searchParams?: {
    prompt?: string | string[];
    autoSend?: string | string[];
  };
};

export default function AsistenAIPage({ searchParams }: AsistenAIPageProps) {
  const rawPrompt = searchParams?.prompt;
  const prompt = Array.isArray(rawPrompt) ? rawPrompt[0] : rawPrompt;
  const rawAutoSend = searchParams?.autoSend;
  const autoSendParam = Array.isArray(rawAutoSend) ? rawAutoSend[0] : rawAutoSend;
  const autoSend = autoSendParam === '1' || autoSendParam === 'true';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Bot className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h1 className="text-2xl font-semibold">Asisten AI RuangRiung</h1>
              <p className="text-sm text-slate-600">
                Tanyakan apa saja: strategi konten, cara pakai fitur, atau jelaskan istilah yang bikin bingung.
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Kembali ke Beranda
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Cara pakai singkat:</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Ketik atau sunting pertanyaan di kolom chat, lalu tekan Enter.</li>
            <li>Pilih model AI bila ingin bereksperimen dengan gaya jawaban yang berbeda.</li>
            <li>Gunakan tombol "Gambar" untuk mengaktifkan mode generator visual bila dibutuhkan.</li>
          </ol>
        </div>
        <Chatbot initialPrompt={prompt} autoSend={autoSend} />
      </main>
    </div>
  );
}
