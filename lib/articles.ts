import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'content/articles-md');

export function getArticleSlugs() {
  try {
    return (fs.readdirSync(articlesDirectory) as string[]).map((fileName: string) => fileName.replace(/\.md$/, ''));
  } catch (error) {
    console.error("Error reading article slugs:", error);
    return [];
  }
}

export type Article = {
  slug: string;
  content: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  image?: string;
  category: string;
  tags: string[];
};

export function getArticleBySlug(slug: string): Article | undefined {
  if (articlesCache) {
    return articlesCache.find(a => a.slug === slug);
  }

  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      content,
      title: data.title,
      date: new Date(data.date).toISOString(),
      author: data.author,
      summary: data.summary,
      image: data.image || undefined,
      category: data.category || 'Umum',
      tags: data.tags || [],
    };
  } catch (error) {
    return undefined;
  }
}

let articlesCache: Article[] | null = null;

export function getAllArticles() {
  if (articlesCache) {
    return articlesCache;
  }

  const slugs = getArticleSlugs();
  const articles = slugs
    .map((slug: string) => getArticleBySlug(slug))
    .filter((article): article is Article => article !== undefined);

  // Sort articles by date in descending order
  articlesCache = articles.sort((a: Article, b: Article) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return articlesCache;
}

export function getRelatedArticles(currentSlug: string, count: number = 3): Article[] {
  const allArticles = getAllArticles();
  const currentArticle = allArticles.find((a: Article) => a.slug === currentSlug);

  if (!currentArticle) {
    return [];
  }

  // Cari artikel terkait berdasarkan skor (kategori & tag)
  let related = allArticles
    .filter((article: Article) => {
      if (article.slug === currentSlug) {
        return false; // Abaikan artikel saat ini
      }
      const hasSameCategory = article.category === currentArticle.category;
      const hasSharedTags = article.tags.some((tag: string) => currentArticle.tags.includes(tag));
      return hasSameCategory || hasSharedTags;
    })
    .map((article: Article) => {
      let score = 0;
      if (article.category === currentArticle.category) {
        score += 2;
      }
      score += article.tags.filter((tag: string) => currentArticle.tags.includes(tag)).length;
      return { ...article, score };
    })
    .sort((a: any, b: any) => b.score - a.score);

  // --- LOGIKA FALLBACK ---
  // Jika tidak ada artikel terkait yang ditemukan, tampilkan artikel terbaru.
  if (related.length < count) {
    const latestArticles = allArticles.filter((article: Article) =>
      article.slug !== currentSlug && !related.find((r: any) => r.slug === article.slug)
    );
    const needed = count - related.length;

    // === PERBAIKAN DI SINI ===
    // Tambahkan properti 'score' ke artikel fallback sebelum menambahkannya
    const fallbackArticles = latestArticles.slice(0, needed).map((article: Article) => ({ ...article, score: 0 }));
    related.push(...fallbackArticles);
  }

  return related.slice(0, count);
}