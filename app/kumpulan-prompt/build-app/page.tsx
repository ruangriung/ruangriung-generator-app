import type { Metadata } from 'next';
import { getBuildAppPrompts } from '@/lib/buildAppPrompts';
import BuildAppPageClient from './BuildAppPageClient';

const FEATURED_PROMPT_SLUG = 'analisis-konten-facebook-profesional';

const PAGE_URL = 'https://ruangriung.my.id/kumpulan-prompt/build-app';
const SOCIAL_IMAGE_URL = 'https://ruangriung.my.id/og-image/og-image-rr.png';

export const metadata: Metadata = {
  title: 'Kumpulan Prompt Build App & Website - RuangRiung Generator',
  description:
    'Temukan kumpulan prompt pilihan untuk membangun website, aplikasi, dan produk digital. Jelajahi ide struktur UI, alur UX, arsitektur backend, hingga strategi copywriting siap pakai.',
  keywords: [
    'prompt build website',
    'prompt buat aplikasi',
    'prompt UX',
    'prompt arsitektur aplikasi',
    'ruangriung build app',
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Kumpulan Prompt Build App & Website - RuangRiung Generator',
    description:
      'Koleksi lengkap prompt untuk merancang website, aplikasi mobile, backend, dan otomasi produk digital. Cocok untuk founder, desainer, dan developer.',
    url: PAGE_URL,
    siteName: 'RuangRiung AI Generator',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: SOCIAL_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'Kumpulan prompt build app dari RuangRiung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kumpulan Prompt Build App & Website - RuangRiung Generator',
    description:
      'Temukan referensi prompt khusus untuk membangun website, aplikasi mobile, dan sistem backend lengkap.',
    images: [SOCIAL_IMAGE_URL],
  },
};

export const revalidate = 0;

export default async function BuildAppPromptPage() {
  const prompts = await getBuildAppPrompts();

  return (
    <BuildAppPageClient
      prompts={prompts}
      featuredPromptSlug={FEATURED_PROMPT_SLUG}
    />
  );
}
