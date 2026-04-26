import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/articles'; // Impor fungsi getAllArticles
import HomeClient from '../app/HomeClient'; // Impor HomeClient
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Beranda | RuangRiung AI Generator',
  description: 'Gunakan AI untuk membuat gambar artistik, naskah video, dan audio berkualitas. Platform kreatif all-in-one untuk konten kreator masa kini.',
  alternates: {
    canonical: 'https://ruangriung.my.id',
  },
  openGraph: {
    title: 'RuangRiung AI Generator - Kreativitas Tanpa Batas',
    description: 'Platform AI all-in-one untuk membuat gambar, video, dan audio artistik.',
    url: 'https://ruangriung.my.id',
    siteName: 'RuangRiung',
    images: [
      {
        url: '/og-image/main-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'RuangRiung AI Generator Banner',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RuangRiung AI Generator',
    description: 'Platform AI kreatif all-in-one untuk konten kreator.',
    images: ['/og-image/main-banner.jpg'],
  },
};

export default async function Home() {
  const allArticles = getAllArticles();
  const latestArticle = allArticles[0]; // Ambil artikel terbaru

  const websiteSchema = {
    name: 'RuangRiung AI Generator',
    url: 'https://ruangriung.my.id',
    description: 'Platform AI kreatif untuk gambar, video, dan audio.',
  };

  const softwareSchema = {
    name: 'RuangRiung AI Image Generator',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
    },
    description: 'Buat gambar AI artistik berkualitas tinggi dengan teknologi Flux dan Pollinations AI.',
  };

  return (
    <>
      <JsonLd type="WebSite" data={websiteSchema} />
      <JsonLd type="SoftwareApplication" data={softwareSchema} />
      <HomeClient latestArticle={latestArticle} />
    </>
  );
}
