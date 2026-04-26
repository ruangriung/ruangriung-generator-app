const getPath = () => (process.env.NEXT_RUNTIME !== 'edge' ? require('path') : null);
const path = getPath();
import { getPromptsFromDirectory, Prompt } from './prompts';

const buildAppPromptsDirectory = path ? path.join(process.cwd(), 'content/build-app-prompts') : '';


export const getBuildAppPrompts = async (): Promise<Prompt[]> => {
  return getPromptsFromDirectory(buildAppPromptsDirectory);
};

export const getBuildAppPromptBySlug = async (slug: string): Promise<Prompt | undefined> => {
  const prompts = await getBuildAppPrompts();
  return prompts.find(prompt => prompt.slug === slug);
};
