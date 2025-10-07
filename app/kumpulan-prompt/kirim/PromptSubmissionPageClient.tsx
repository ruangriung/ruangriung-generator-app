'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import PromptSubmissionPageForm, {
  type PromptSubmissionPageFormResult,
} from './PromptSubmissionPageForm';

export default function PromptSubmissionPageClient() {
  const router = useRouter();
  const [result, setResult] = useState<PromptSubmissionPageFormResult | null>(null);

  const handleCancel = () => {
    router.push('/kumpulan-prompt');
  };

  const handleSuccess = (value: PromptSubmissionPageFormResult) => {
    setResult(value);
  };

  const handleBackToList = () => {
    router.push('/kumpulan-prompt');
  };

  const handleSubmitAnother = () => {
    setResult(null);
  };

  if (result) {
    const { prompt, persisted } = result;
    const persistenceMessage = persisted
      ? 'Prompt Anda sudah langsung tampil di halaman kumpulan prompt.'
      : 'Prompt Anda akan kami tinjau terlebih dahulu sebelum dipublikasikan.';

    return (
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center shadow-lg dark:border-emerald-400/30 dark:bg-emerald-950/40">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 dark:text-emerald-300" />
          <h2 className="mt-4 text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
            Prompt berhasil dikirim!
          </h2>
          <p className="mt-4 text-base text-emerald-900 dark:text-emerald-200">
            “{prompt.title}” untuk {prompt.tool} telah kami terima. {persistenceMessage}
          </p>
          <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-300/80">
            Format front matter akan otomatis mengikuti standar RuangRiung sehingga prompt Anda siap tampil bersama koleksi lain.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleBackToList}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              Lihat Kumpulan Prompt
            </button>
            <button
              type="button"
              onClick={handleSubmitAnother}
              className="inline-flex items-center justify-center rounded-2xl border border-emerald-400 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-500 hover:text-emerald-900 dark:border-emerald-400/60 dark:text-emerald-200 dark:hover:border-emerald-300 dark:hover:text-emerald-100"
            >
              Kirim Prompt Lain
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/70 sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Cara kerja pengiriman prompt
        </h2>
        <ol className="mt-4 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <li className="flex gap-3">
            <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600 dark:bg-blue-400/20 dark:text-blue-200">
              1
            </span>
            <span>
              Isi seluruh kolom dengan data kontributor, isi prompt, serta lampiran opsional. Form halaman ini memvalidasi CAPTCHA Turnstile agar mencegah spam sebelum permintaan dikirim.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600 dark:bg-blue-400/20 dark:text-blue-200">
              2
            </span>
            <span>
              Setelah tombol kirim ditekan, data dikirim ke endpoint <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[0.75rem] dark:bg-slate-800">/api/submit-prompt</code> yang menyusun front matter Markdown baru dengan struktur sama persis seperti prompt yang sudah tayang.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600 dark:bg-blue-400/20 dark:text-blue-200">
              3
            </span>
            <span>
              Jika moderasi otomatis menyetujui, prompt segera ditambahkan ke katalog dan Anda melihat kartu konfirmasi di halaman ini. Jika perlu peninjauan manual, tim RuangRiung akan memproses sebelum publikasi.
            </span>
          </li>
        </ol>
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Apa bedanya dengan form submission sebelumnya?</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium">Tampilan halaman penuh.</span> Form ini hadir sebagai halaman mandiri dengan tips, penjelasan alur, dan status sukses on-page. Form lama tetap berupa modal ringan yang muncul dari tombol &ldquo;Kirim Prompt Anda&rdquo;.
            </li>
            <li>
              <span className="font-medium">Fokus kontribusi.</span> Pengguna tetap berada di halaman ini setelah kirim sehingga bisa mengirim prompt lain, sedangkan modal lama langsung menutup dan mengembalikan pengguna ke konteks sebelumnya.
            </li>
            <li>
              <span className="font-medium">Pengalaman berbeda, backend sama.</span> Keduanya menuju endpoint yang sama sehingga hasil front matter identik. Perbedaannya hanya pada pengalaman antarmuka dan dukungan konten panduan.
            </li>
          </ul>
        </div>
      </section>

      <div className="mt-8">
        <PromptSubmissionPageForm onCancel={handleCancel} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
