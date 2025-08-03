import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'content/articles-md');

export function getArticleSlugs() {
  return fs.readdirSync(articlesDirectory).map(fileName => fileName.replace(/\.md$/, ''));
}

export function getArticleBySlug(slug: string) {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    content,
    ...(data as { title: string; date: string; author: string }),
  };
}

export function getAllArticles() {
  const slugs = getArticleSlugs();
  const articles = slugs.map(slug => getArticleBySlug(slug));
  // Sort articles by date in descending order
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}