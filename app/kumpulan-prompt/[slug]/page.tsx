import { getAllPrompts } from '../../../lib/prompts';
import { notFound } from 'next/navigation';
import PromptDetailClient from './PromptDetailClient';

export default async function PromptDetailPage({ params }: { params: { slug: string } }) {
  const prompts = await getAllPrompts();
  const prompt = prompts.find(currentPrompt => currentPrompt.slug === params.slug);

  if (!prompt) {
    notFound();
  }

  return <PromptDetailClient prompt={prompt} prompts={prompts} />;
}
