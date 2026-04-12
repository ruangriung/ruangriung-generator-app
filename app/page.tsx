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
};

export default async function Home() {
  const allArticles = getAllArticles();
  const latestArticle = allArticles[0]; // Ambil artikel terbaru

  const websiteSchema = {
    name: 'RuangRiung AI Generator',
    url: 'https://ruangriung.my.id',
    description: 'Platform AI kreatif untuk gambar, video, dan audio.',
  };

  return (
    <>
      <JsonLd type="WebSite" data={websiteSchema} />
      <HomeClient latestArticle={latestArticle} />
    </>
  );
}
