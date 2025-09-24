import type { Metadata } from 'next';
import RekomendasiToolsClient from './RekomendasiToolsClient';

export const metadata: Metadata = {
  title: 'Perencana Workflow AI - RuangRiung',
  description:
    'Gunakan alat rekomendasi interaktif RuangRiung untuk menemukan kombinasi tools AI, workflow langkah demi langkah, dan prompt starter sesuai tujuan kontenmu.',
  keywords: [
    'perencana workflow AI',
    'rekomendasi tools AI',
    'ruangriung tools',
    'generator konten AI',
    'prompt kreatif',
    'strategi komunitas',
  ],
  alternates: {
    canonical: '/rekomendasi-tools',
  },
  openGraph: {
    title: 'Perencana Workflow AI RuangRiung',
    description:
      'Susun stack tools AI, workflow, dan prompt inspiratif untuk mempercepat produksi kontenmu.',
    url: 'https://ruangriung.my.id/rekomendasi-tools',
    siteName: 'RuangRiung AI Generator',
    images: [
      {
        url: 'https://www.ruangriung.my.id/assets/ruangriung.png',
        width: 1200,
        height: 630,
        alt: 'Perencana Workflow AI RuangRiung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Perencana Workflow AI RuangRiung',
    description:
      'Temukan rekomendasi tool AI, langkah kerja, dan prompt starter yang relevan dengan kebutuhanmu.',
    images: ['https://www.ruangriung.my.id/assets/ruangriung.png'],
  },
};

export default function RekomendasiToolsPage() {
  return <RekomendasiToolsClient />;
}
