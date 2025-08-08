import fs from 'fs/promises';
import path from 'path';

const promptsDirectory = path.join(process.cwd(), 'content/prompts');

export interface Prompt {
  id: string;
  slug: string;
  title: string;
  author: string;
  tool: string;
  tags: string[];
  promptContent: string;
}

export async function getAllPrompts(): Promise<Prompt[]> {
  try {
    const fileNames = await fs.readdir(promptsDirectory);
    const allPrompts = await Promise.all(fileNames.map(async (fileName) => {
      const fullPath = path.join(promptsDirectory, fileName);
      const fileContents = await fs.readFile(fullPath, 'utf8');
      const prompt = JSON.parse(fileContents) as Prompt;
      return prompt;
    }));
    return allPrompts;
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