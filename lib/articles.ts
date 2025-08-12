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