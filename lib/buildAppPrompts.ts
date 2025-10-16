import path from 'path';
import { getPromptsFromDirectory, Prompt } from './prompts';

const buildAppPromptsDirectory = path.join(process.cwd(), 'content/build-app-prompts');

export const getBuildAppPrompts = async (): Promise<Prompt[]> => {
  return getPromptsFromDirectory(buildAppPromptsDirectory);
};

export const getBuildAppPromptBySlug = async (slug: string): Promise<Prompt | undefined> => {
  const prompts = await getBuildAppPrompts();
  return prompts.find(prompt => prompt.slug === slug);
};
