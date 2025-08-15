import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'content/articles-md');

export function getArticleSlugs() {
  try {
    return fs.readdirSync(articlesDirectory).map(fileName => fileName.replace(/\.md$/, ''));
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
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      content,
      title: data.title,
      date: data.date,
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

export function getAllArticles() {
  const slugs = getArticleSlugs();
  const articles = slugs
    .map(slug => getArticleBySlug(slug))
    .filter((article): article is Article => article !== undefined);
    
  // Sort articles by date in descending order
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRelatedArticles(currentSlug: string, count: number = 3): Article[] {
  const allArticles = getAllArticles();
  const currentArticle = allArticles.find(a => a.slug === currentSlug);

  if (!currentArticle) {
    return [];
  }

  // Cari artikel terkait berdasarkan skor (kategori & tag)
  let related = allArticles
    .filter(article => {
      if (article.slug === currentSlug) {
        return false; // Abaikan artikel saat ini
      }
      const hasSameCategory = article.category === currentArticle.category;
      const hasSharedTags = article.tags.some(tag => currentArticle.tags.includes(tag));
      return hasSameCategory || hasSharedTags;
    })
    .map(article => {
      let score = 0;
      if (article.category === currentArticle.category) {
        score += 2;
      }
      score += article.tags.filter(tag => currentArticle.tags.includes(tag)).length;
      return { ...article, score };
    })
    .sort((a, b) => b.score - a.score);

  // --- LOGIKA FALLBACK ---
  // Jika tidak ada artikel terkait yang ditemukan, tampilkan artikel terbaru.
  if (related.length < count) {
    const latestArticles = allArticles.filter(article => 
        article.slug !== currentSlug && !related.find(r => r.slug === article.slug)
    );
    const needed = count - related.length;
    
    // === PERBAIKAN DI SINI ===
    // Tambahkan properti 'score' ke artikel fallback sebelum menambahkannya
    const fallbackArticles = latestArticles.slice(0, needed).map(article => ({ ...article, score: 0 }));
    related.push(...fallbackArticles);
  }
  
  return related.slice(0, count);
}