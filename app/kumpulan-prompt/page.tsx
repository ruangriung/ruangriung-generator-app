
import type { Metadata } from 'next';
import { getAllPrompts } from '../../lib/prompts';
import PromptClient from './PromptClient';

const PAGE_URL = 'https://ruangriung.my.id/kumpulan-prompt';
const SOCIAL_IMAGE_URL = 'https://ruangriung.my.id/og-image/og-image-rr.png';

export const metadata: Metadata = {
  title: 'Kumpulan Prompt AI Kreatif - RuangRiung Generator',
  description:
    'Eksplorasi kumpulan prompt AI siap pakai untuk Midjourney, Stable Diffusion, ChatGPT, dan generator kreatif lainnya. Temukan ide baru, filter berdasarkan tag, dan bagikan prompt favorit Anda secara gratis.',
  keywords: [
    'kumpulan prompt AI',
    'prompt Midjourney Indonesia',
    'prompt Stable Diffusion',
    'prompt ChatGPT bahasa Indonesia',
    'ide prompt kreatif',
    'ruangriung AI generator',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Kumpulan Prompt AI Kreatif - RuangRiung Generator',
    description:
      'Temukan dan gunakan prompt AI terbaik untuk berbagai model seperti Midjourney, Stable Diffusion, dan ChatGPT. Filter berdasarkan tag, simpan inspirasi, dan bagikan dengan komunitas RuangRiung.',
    url: PAGE_URL,
    siteName: 'RuangRiung AI Generator',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: SOCIAL_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'Kumpulan prompt AI kreatif dari RuangRiung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kumpulan Prompt AI Kreatif - RuangRiung Generator',
    description:
      'Jelajahi perpustakaan prompt AI lengkap untuk Midjourney, Stable Diffusion, dan ChatGPT. Dapatkan inspirasi dan bagikan prompt andalan Anda.',
    images: [SOCIAL_IMAGE_URL],
  },
};

export default async function KumpulanPromptPage() {
  const prompts = await getAllPrompts();

  return <PromptClient prompts={prompts} />;
}
