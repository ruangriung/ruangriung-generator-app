import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const FacebookProInsightClient = dynamic(() => import('./FacebookProAnalyzerClient'), {
  ssr: false,
  loading: () => (
    <div className="mx-auto mt-16 max-w-4xl rounded-3xl bg-light-bg/80 p-6 text-center shadow-neumorphic-card backdrop-blur dark:bg-dark-bg/60 dark:shadow-dark-neumorphic-card">
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        Menginisialisasi pusat analitik konten profesional...
      </p>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Memuat model AI dan menyiapkan tampilan dashboard.
      </p>
    </div>
  ),
});

export const metadata: Metadata = {
  title: 'Facebook Pro Insight Hub - Analisis Konten Profesional',
  description:
    'Optimalkan performa konten Facebook profesional Anda dengan analisis AI mendalam. Dapatkan rekomendasi monetisasi, kesesuaian audiens Indonesia, dan strategi teknis terkini.',
  keywords: [
    'analisis konten Facebook',
    'facebook profesional',
    'pollinations ai',
    'strategi monetisasi facebook',
    'analisis audiens Indonesia',
    'dashboard insight facebook',
  ],
  openGraph: {
    title: 'Facebook Pro Insight Hub - Analisis Konten Profesional',
    description:
      'Dashboard AI terintegrasi untuk mengevaluasi kualitas konten, monetisasi, dan kesesuaian audiens Facebook di pasar Indonesia.',
    url: 'https://ruangriung.my.id/facebook-pro-insight',
    siteName: 'RuangRiung AI Generator',
    images: [
      {
        url: 'https://www.ruangriung.my.id/assets/ruangriung.png',
        width: 1200,
        height: 630,
        alt: 'RuangRiung Facebook Pro Insight Hub',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Facebook Pro Insight Hub - Analisis Konten Profesional',
    description:
      'Gunakan AI Pollinations untuk menilai konten Facebook profesional Anda dan dapatkan rekomendasi berbasis data.',
    images: ['https://www.ruangriung.my.id/assets/ruangriung.png'],
  },
};

export default function FacebookProInsightPage() {
  return <FacebookProInsightClient />;
}
