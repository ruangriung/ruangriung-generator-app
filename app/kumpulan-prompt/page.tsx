
import { getAllPrompts } from '../../lib/prompts';
import PromptClient from './PromptClient';

export default async function KumpulanPromptPage() {
  const prompts = await getAllPrompts();

  return <PromptClient prompts={prompts} />;
}
