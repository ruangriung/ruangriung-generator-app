import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { getStores } from '@/lib/umkm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = getAllArticles();
  const stores = await getStores();

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `https://ruangriung.my.id/artikel/${article.slug}`,
    lastModified: new Date(article.date).toISOString(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const storeEntries: MetadataRoute.Sitemap = stores.map((store) => ({
    url: `https://ruangriung.my.id/umkm/${store.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const staticPages = [
    { url: 'https://ruangriung.my.id', priority: 1.0, changeFrequency: 'daily' },
    { url: 'https://ruangriung.my.id/artikel', priority: 0.9, changeFrequency: 'daily' },
    { url: 'https://ruangriung.my.id/kumpulan-prompt', priority: 0.9, changeFrequency: 'daily' },
    { url: 'https://ruangriung.my.id/umkm', priority: 0.8, changeFrequency: 'daily' },
    { url: 'https://ruangriung.my.id/id-card-generator', priority: 0.8, changeFrequency: 'weekly' },
    { url: 'https://ruangriung.my.id/storyteller', priority: 0.8, changeFrequency: 'weekly' },
    { url: 'https://ruangriung.my.id/UniqueArtName', priority: 0.8, changeFrequency: 'weekly' },
    { url: 'https://ruangriung.my.id/video-prompt', priority: 0.7, changeFrequency: 'monthly' },
    { url: 'https://ruangriung.my.id/battle-ignite-friendship', priority: 0.6, changeFrequency: 'monthly' },
    { url: 'https://ruangriung.my.id/konten-kreator', priority: 0.6, changeFrequency: 'monthly' },
    { url: 'https://ruangriung.my.id/tentang-kami', priority: 0.5, changeFrequency: 'monthly' },
    { url: 'https://ruangriung.my.id/kontak', priority: 0.5, changeFrequency: 'monthly' },
    { url: 'https://ruangriung.my.id/kebijakan-privasi', priority: 0.3, changeFrequency: 'yearly' },
    { url: 'https://ruangriung.my.id/ketentuan-layanan', priority: 0.3, changeFrequency: 'yearly' },
  ].map(page => ({
    ...page,
    url: page.url,
    lastModified: new Date().toISOString(),
    changeFrequency: page.changeFrequency as any,
  }));

  return [
    ...staticPages,
    ...articleEntries,
    ...storeEntries,
  ];
}