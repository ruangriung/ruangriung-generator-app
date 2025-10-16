'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import PromptClient from '../PromptClient';
import type { Prompt } from '@/lib/prompts';
import PromptSubmissionForm from '@/components/PromptSubmissionForm';
import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  LineChart,
  Send,
  Sparkles,
} from 'lucide-react';
import { BUILD_APP_EVENT_CATEGORY, trackAnalyticsEvent } from '@/lib/analytics';

interface BuildAppPageClientProps {
  prompts: Prompt[];
  articleSlug: string;
}

const sortByRecency = (items: Prompt[]) =>
  items
    .slice()
    .sort((a, b) => Number(b.id) - Number(a.id));

export default function BuildAppPageClient({
  prompts: initialPrompts,
  articleSlug,
}: BuildAppPageClientProps) {
  const [prompts, setPrompts] = useState(() => sortByRecency(initialPrompts));
  const [hasTrackedFormFocus, setHasTrackedFormFocus] = useState(false);

  useEffect(() => {
    setPrompts(sortByRecency(initialPrompts));
  }, [initialPrompts]);

  useEffect(() => {
    trackAnalyticsEvent('view_build_app_prompts', {
      event_category: BUILD_APP_EVENT_CATEGORY,
      view_type: 'listing',
    });
  }, []);

  const handleArticleClick = useCallback(() => {
    trackAnalyticsEvent('click_build_app_article', {
      event_category: BUILD_APP_EVENT_CATEGORY,
      article_slug: articleSlug,
    });
  }, [articleSlug]);

  const handlePromptCreated = useCallback(
    (prompt: Prompt) => {
      setPrompts(previous => {
        const filtered = previous.filter(item => item.slug !== prompt.slug);
        return sortByRecency([prompt, ...filtered]);
      });

      trackAnalyticsEvent('submit_build_app_prompt', {
        event_category: BUILD_APP_EVENT_CATEGORY,
        prompt_slug: prompt.slug,
      });
    },
    [],
  );

  const handleFormFocus = useCallback(() => {
    if (hasTrackedFormFocus) {
      return;
    }

    setHasTrackedFormFocus(true);
    trackAnalyticsEvent('focus_build_app_submission_form', {
      event_category: BUILD_APP_EVENT_CATEGORY,
    });
  }, [hasTrackedFormFocus]);

  const highlightItems = useMemo(
    () => [
      {
        title: 'Pipeline Analitik Lengkap',
        description:
          'Ringkasan eksekutif, monetisasi, kesesuaian audiens, kualitas konten, hingga analisis teknis dalam satu halaman.',
      },
      {
        title: 'Integrasi Pollinations.AI',
        description:
          'Model dinamis, engine analisis, dan generator visual otomatis siap pakai untuk laporan AI yang kaya data.',
      },
      {
        title: 'Desain Futuristik',
        description:
          'Glassmorphism + neumorphism dengan dark/light mode, animasi halus, tooltips, dan skeleton loading responsif.',
      },
      {
        title: 'Kolaborasi & Ekspor',
        description:
          'Ekspor PDF/PNG, shareable link, multi-bahasa, dan analitik penggunaan untuk iterasi produk.',
      },
    ],
    [],
  );

  return (
    <div className="space-y-16">
      <PromptClient
        prompts={prompts}
        title="Kumpulan Prompt Build App"
        description="Kumpulan prompt terkurasi untuk membantu kamu merancang website, aplikasi, serta arsitektur produk digital dengan cepat."
        backHref="/kumpulan-prompt"
        backLabel="Kembali ke Kumpulan Prompt"
        basePath="/kumpulan-prompt/build-app"
        showSubmissionTrigger={false}
      />

      <section className="container mx-auto px-4">
        <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 p-8 shadow-xl backdrop-blur dark:border-indigo-900/60 dark:from-indigo-950/80 dark:via-slate-900 dark:to-purple-950/60">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="flex-1 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200">
                <FileText className="h-4 w-4" />
                Panduan Implementasi
              </span>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  Blueprint Analisis Konten Facebook Profesional
                </h2>
                <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
                  Pelajari cara membangun halaman analitik komprehensif dengan Next.js, Pollinations.AI, dan sistem tema futuristik khusus kreator serta marketer Indonesia.
                </p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {highlightItems.map(item => (
                  <li
                    key={item.title}
                    className="flex items-start gap-3 rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900/60 dark:shadow-lg"
                  >
                    <Sparkles className="mt-1 h-5 w-5 text-indigo-500 dark:text-indigo-300" />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/artikel/${articleSlug}`}
                  onClick={handleArticleClick}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                >
                  Baca panduan lengkap
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#kirim-prompt-build-app"
                  className="inline-flex items-center gap-2 rounded-full border border-indigo-200 px-5 py-2 text-sm font-semibold text-indigo-600 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-indigo-800 dark:text-indigo-300 dark:hover:border-indigo-600 dark:hover:text-indigo-200"
                >
                  Kirim ide prompt
                  <Send className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="w-full max-w-sm self-stretch rounded-2xl border border-indigo-200 bg-white/80 p-6 shadow-lg backdrop-blur dark:border-indigo-900/60 dark:bg-slate-900/80">
              <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-300">
                <LineChart className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">Kenapa penting?</span>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                Halaman analitik Facebook membantu tim konten, agency, dan brand memahami performa real-time tanpa berpindah alat.
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500"></span>
                  Insight monetisasi lokal dengan CPM/RPM Indonesia.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500"></span>
                  Heatmap waktu unggah dan benchmark industri.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500"></span>
                  Mode gelap/terang untuk efisiensi tim lintas perangkat.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="kirim-prompt-build-app" className="container mx-auto px-4">
        <div className="space-y-6 rounded-3xl border border-purple-200 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-purple-900/50 dark:bg-slate-900/80">
          <div className="max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700 dark:bg-purple-900/60 dark:text-purple-200">
              <Sparkles className="h-4 w-4" />
              Kolaborasi Komunitas
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Bagikan Prompt Build App Terbaik Versimu
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Isi form di bawah untuk mengirimkan blueprint, struktur UI, atau alur sistem favoritmu. Prompt terbaik akan dipublikasikan agar bisa dipakai kreator lainnya.
            </p>
          </div>
          <div onFocusCapture={handleFormFocus}>
            <PromptSubmissionForm
              isOpen
              variant="page"
              onSuccess={handlePromptCreated}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
