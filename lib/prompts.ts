import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { resolveDateString } from './date';

const promptsDirectory = path.join(process.cwd(), 'content/prompts');

const slugify = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const normalizeTags = (tags: string[]): string[] =>
  tags
    .map(tag => tag.trim())
    .filter(tag => Boolean(tag));

const sanitizeFrontMatter = (frontMatter: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(frontMatter).filter(([, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }


      if (value instanceof Date) {
        return !Number.isNaN(value.getTime());
      }


      return value !== undefined && value !== null && value !== '';
    }),
  );
};

const ensureDirectoryExists = async () => {
  try {
    await fs.access(promptsDirectory);
  } catch {
    await fs.mkdir(promptsDirectory, { recursive: true });
  }
};

const generateUniqueSlug = (title: string, existingSlugs: Set<string>) => {
  const base = slugify(title) || 'prompt';
  if (!existingSlugs.has(base)) {
    return base;
  }

  let index = 2;
  let candidate = `${base}-${index}`;

  while (existingSlugs.has(candidate)) {
    index += 1;
    candidate = `${base}-${index}`;
  }

  return candidate;
};

const formatPrompt = (prompt: Prompt) => {
  const frontMatter = sanitizeFrontMatter({
    id: prompt.id,
    slug: prompt.slug,
    title: prompt.title,
    author: prompt.author,
    email: prompt.email,
    facebook: prompt.facebook,
    image: prompt.image,
    link: prompt.link,
    date: prompt.date,
    tool: prompt.tool,
    tags: prompt.tags,
  });

  return matter.stringify(`${prompt.promptContent}\n`, frontMatter);
};

export interface PromptPayload {
  author: string;
  email?: string;
  facebook?: string;
  image?: string;
  link?: string;
  title: string;
  promptContent: string;
  tool: string;
  tags: string[];
  date?: string;
}

export interface Prompt {
  id: string;
  slug: string;
  title: string;
  author: string;
  email?: string;
  facebook?: string;
  image?: string;
  link?: string;
  date: string;
  tool: string;
  tags: string[];
  promptContent: string;
}

export async function getAllPrompts(): Promise<Prompt[]> {
  try {
    const fileNames = await fs.readdir(promptsDirectory);
    const allPrompts = await Promise.all(
      fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(async fileName => {
          const fullPath = path.join(promptsDirectory, fileName);
          const [fileContents, stats] = await Promise.all([
            fs.readFile(fullPath, 'utf8'),
            fs.stat(fullPath),
          ]);
          const { data, content } = matter(fileContents);
          const date = resolveDateString(
            data.date,
            stats.birthtime,
            stats.mtime,
          );
          const prompt: Prompt = {
            id: data.id,
            slug: data.slug,
            title: data.title,
            author: data.author,
            email: data.email,
            facebook: data.facebook,
            image: data.image,
            link: data.link,
            date,
            tool: data.tool,
            tags: Array.isArray(data.tags) ? data.tags.map(tag => String(tag)) : [],
            promptContent: content.trim(),
          };
          return prompt;
        })
    );
    return allPrompts.sort((a, b) => Number(b.id) - Number(a.id));
  } catch (error) {
    // If the directory doesn't exist, return an empty array
    console.log("Could not read prompts directory, returning empty array.");
    return [];
  }
}

export async function getPromptBySlug(slug: string): Promise<Prompt | undefined> {
  const allPrompts = await getAllPrompts();
  return allPrompts.find(prompt => prompt.slug === slug);
}

export async function createPrompt(payload: PromptPayload): Promise<Prompt> {
  await ensureDirectoryExists();
  const allPrompts = await getAllPrompts();
  const nextId = allPrompts.length
    ? (Math.max(...allPrompts.map(prompt => Number(prompt.id))) + 1).toString()
    : '1';
  const existingSlugs = new Set(allPrompts.map(prompt => prompt.slug));
  const slug = generateUniqueSlug(payload.title, existingSlugs);

  const date = resolveDateString(payload.date, new Date());

  const providedDate = payload.date?.trim();
  const date = providedDate && providedDate.length > 0 ? providedDate : new Date().toISOString().split('T')[0];
  const prompt: Prompt = {
    id: nextId,
    slug,
    title: payload.title.trim(),
    author: payload.author.trim(),
    email: payload.email?.trim() || undefined,
    facebook: payload.facebook?.trim() || undefined,
    image: payload.image?.trim() || undefined,
    link: payload.link?.trim() || undefined,
    date,
    tool: payload.tool.trim(),
    tags: normalizeTags(payload.tags),
    promptContent: payload.promptContent.trim(),
  };

  const fileName = `prompt-${prompt.id}.md`;
  const filePath = path.join(promptsDirectory, fileName);
  const fileContents = formatPrompt(prompt);
  await fs.writeFile(filePath, fileContents, 'utf8');

  return prompt;
}

export async function updatePromptBySlug(slug: string, payload: PromptPayload): Promise<Prompt> {
  await ensureDirectoryExists();
  const fileNames = await fs.readdir(promptsDirectory);

  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) {
      continue;
    }

    const filePath = path.join(promptsDirectory, fileName);
    const fileContents = await fs.readFile(filePath, 'utf8');
    const { data } = matter(fileContents);

    const stats = await fs.stat(filePath);



    if (data.slug !== slug) {
      continue;
    }


    const normalizedDate = resolveDateString(
      payload.date,
      data.date,
      stats.birthtime,
      stats.mtime,
    );

    const prompt: Prompt = {
      id: data.id,
      slug: data.slug,
      title: payload.title.trim(),
      author: payload.author.trim(),
      email: payload.email?.trim() || undefined,
      facebook: payload.facebook?.trim() || undefined,
      image: payload.image?.trim() || undefined,
      link: payload.link?.trim() || undefined,

      date: normalizedDate,

      date:
        payload.date?.trim() && payload.date.trim().length > 0
          ? payload.date.trim()
          : data.date ?? new Date().toISOString().split('T')[0],

      tool: payload.tool.trim(),
      tags: normalizeTags(payload.tags),
      promptContent: payload.promptContent.trim(),
    };

    const updatedFileContents = formatPrompt(prompt);
    await fs.writeFile(filePath, updatedFileContents, 'utf8');

    return prompt;
  }

  throw new Error(`Prompt with slug "${slug}" not found.`);
}