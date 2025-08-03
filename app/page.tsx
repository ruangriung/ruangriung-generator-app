import { getAllArticles } from '@/lib/articles'; // Impor fungsi getAllArticles
import HomeClient from '../app/HomeClient'; // Impor HomeClient

export default async function Home() {
  const allArticles = getAllArticles();
  const latestArticle = allArticles[0]; // Ambil artikel terbaru

  return (
    <HomeClient latestArticle={latestArticle} />
  );
}
