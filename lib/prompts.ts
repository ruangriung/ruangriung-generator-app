import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const promptsDirectory = path.join(process.cwd(), 'content/prompts');
const READ_ONLY_ERROR_CODES = new Set(['EROFS', 'EACCES', 'EPERM']);

type TransientPromptStore = {
  prompts: Map<string, Prompt>;
};

const globalPromptStore = globalThis as typeof globalThis & {
  __transientPromptStore?: TransientPromptStore;
};

const getTransientPromptStore = (): TransientPromptStore => {
  if (!globalPromptStore.__transientPromptStore) {
    globalPromptStore.__transientPromptStore = {
      prompts: new Map<string, Prompt>(),
    } satisfies TransientPromptStore;
  }

  return globalPromptStore.__transientPromptStore;
};

const addTransientPrompt = (prompt: Prompt) => {
  getTransientPromptStore().prompts.set(prompt.slug, prompt);
};

const removeTransientPrompt = (slug: string) => {
  getTransientPromptStore().prompts.delete(slug);
};

const listTransientPrompts = (): Prompt[] => {
  return Array.from(getTransientPromptStore().prompts.values());
};

const isReadOnlyFileSystemError = (error: unknown): error is NodeJS.ErrnoException => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const code = (error as NodeJS.ErrnoException).code;
  return typeof code === 'string' && READ_ONLY_ERROR_CODES.has(code);
};

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

      return value !== undefined && value !== null && value !== '';
    }),
  );
};

const ensureDirectoryExists = async () => {
  try {
    await fs.access(promptsDirectory);
  } catch {
    try {
      await fs.mkdir(promptsDirectory, { recursive: true });
    } catch (error) {
      if (!isReadOnlyFileSystemError(error)) {
        throw error;
      }
    }
  }
};

const getPromptSortValue = (prompt: Prompt) => {
  const numericId = Number.parseInt(prompt.id, 10);

  if (!Number.isNaN(numericId)) {
    return numericId;
  }

  const dateValue = Date.parse(prompt.date);

  if (!Number.isNaN(dateValue)) {
    return dateValue;
  }

  return 0;
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

const buildPromptFromPayload = (payload: PromptPayload, allPrompts: Prompt[]): Prompt => {
  const nextId = allPrompts.length
    ? (Math.max(...allPrompts.map(prompt => Number(prompt.id))) + 1).toString()
    : '1';
  const existingSlugs = new Set(allPrompts.map(prompt => prompt.slug));
  const slug = generateUniqueSlug(payload.title, existingSlugs);
  const providedDate = payload.date?.trim();
  const date = providedDate && providedDate.length > 0
    ? providedDate
    : new Date().toISOString().split('T')[0];

  return {
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
  } satisfies Prompt;
};

export interface PromptCreationResult {
  prompt: Prompt;
  persisted: boolean;
}

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

const readPromptsFromDirectory = async (directory: string): Promise<Prompt[]> => {
  try {
    const fileNames = await fs.readdir(directory);
    const prompts = await Promise.all(
      fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(async fileName => {
          const fullPath = path.join(directory, fileName);
          const fileContents = await fs.readFile(fullPath, 'utf8');
          const { data, content } = matter(fileContents);
          const prompt: Prompt = {
            id: data.id,
            slug: data.slug,
            title: data.title,
            author: data.author,
            email: data.email,
            facebook: data.facebook,
            image: data.image,
            link: data.link,
            date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
            tool: data.tool,
            tags: data.tags || [],
            promptContent: content.trim(),
          };
          return prompt;
        }),
    );

    return prompts;
  } catch (error) {
    console.log(`Could not read prompts directory at ${directory}, returning empty array.`);
    return [];
  }
};

export const getPromptsFromDirectory = async (directory: string): Promise<Prompt[]> => {
  const prompts = await readPromptsFromDirectory(directory);
  return prompts.sort((a, b) => getPromptSortValue(b) - getPromptSortValue(a));
};

export async function getAllPrompts(): Promise<Prompt[]> {
  const persistedPrompts = await readPromptsFromDirectory(promptsDirectory);
  const transientPrompts = listTransientPrompts();
  const promptMap = new Map<string, Prompt>();

  transientPrompts.forEach(prompt => {
    promptMap.set(prompt.slug, prompt);
  });

  persistedPrompts.forEach(prompt => {
    promptMap.set(prompt.slug, prompt);
    removeTransientPrompt(prompt.slug);
  });

  return Array.from(promptMap.values()).sort(
    (a, b) => getPromptSortValue(b) - getPromptSortValue(a),
  );
}

export async function getPromptBySlug(slug: string): Promise<Prompt | undefined> {
  const allPrompts = await getAllPrompts();
  return allPrompts.find(prompt => prompt.slug === slug);
}

export async function createPrompt(payload: PromptPayload): Promise<PromptCreationResult> {
  await ensureDirectoryExists();
  const allPrompts = await getAllPrompts();
  const prompt = buildPromptFromPayload(payload, allPrompts);

  const fileName = `prompt-${prompt.id}.md`;
  const filePath = path.join(promptsDirectory, fileName);
  const fileContents = formatPrompt(prompt);
  try {
    await fs.writeFile(filePath, fileContents, 'utf8');
    removeTransientPrompt(prompt.slug);
    return { prompt, persisted: true } satisfies PromptCreationResult;
  } catch (error) {
    if (isReadOnlyFileSystemError(error)) {
      console.warn(
        'Prompt berhasil dibuat namun tidak dapat disimpan karena sistem berkas hanya-baca. Mengirim data prompt tanpa penyimpanan.',
        error,
      );

      addTransientPrompt(prompt);

      return { prompt, persisted: false } satisfies PromptCreationResult;
    }

    throw error;
  }
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

    if (data.slug !== slug) {
      continue;
    }

    const prompt: Prompt = {
      id: data.id,
      slug: data.slug,
      title: payload.title.trim(),
      author: payload.author.trim(),
      email: payload.email?.trim() || undefined,
      facebook: payload.facebook?.trim() || undefined,
      image: payload.image?.trim() || undefined,
      link: payload.link?.trim() || undefined,
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