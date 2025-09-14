import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const promptsDirectory = path.join(process.cwd(), 'content/prompts');

export interface Prompt {
  id: string;
  slug: string;
  title: string;
  author: string;
  email?: string;
  facebook?: string;
  date: string;
  tool: string;
  image?: string;
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
          const fileContents = await fs.readFile(fullPath, 'utf8');
          const { data, content } = matter(fileContents);
          const prompt: Prompt = {
            id: data.id,
            slug: data.slug,
            image: data.image,
            title: data.title,
            author: data.author,
            email: data.email,
            facebook: data.facebook,
            date: data.date,
            tool: data.tool,
            tags: data.tags || [],
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