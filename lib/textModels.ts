export interface TextModelInfo {
  name: string;
  description: string;
  input_modalities: string[];
  output_modalities: string[];
}

export interface TextModelOption {
  name: string;
  description: string;
}

export const DEFAULT_TEXT_MODEL = 'openai';

const TEXT_MODEL_DATA: TextModelInfo[] = [
  { name: 'deepseek', description: 'DeepSeek V3', input_modalities: ['text'], output_modalities: ['text'] },
  { name: 'deepseek-reasoning', description: 'DeepSeek R1 0528', input_modalities: ['text'], output_modalities: ['text'] },
  { name: 'grok', description: 'xAI Grok-3 Mini', input_modalities: ['text'], output_modalities: ['text'] },
  { name: 'llamascout', description: 'Llama 4 Scout 17B', input_modalities: ['text'], output_modalities: ['text'] },
  { name: 'mistral', description: 'Mistral Small 3.1 24B', input_modalities: ['text', 'image'], output_modalities: ['text'] },
  { name: 'openai', description: 'OpenAI GPT-4o Mini', input_modalities: ['text', 'image'], output_modalities: ['text'] },
  { name: 'openai-fast', description: 'OpenAI GPT-4.1 Nano', input_modalities: ['text', 'image'], output_modalities: ['text'] },
  { name: 'openai-large', description: 'OpenAI GPT-4.1', input_modalities: ['text', 'image'], output_modalities: ['text'] },
  { name: 'phi', description: 'Phi-4 Mini Instruct', input_modalities: ['text', 'image', 'audio'], output_modalities: ['text'] },
  { name: 'rtist', description: 'Rtist', input_modalities: ['text'], output_modalities: ['text'] },
  { name: 'midijourney', description: 'MIDIjourney', input_modalities: ['text'], output_modalities: ['text'] },
];

const FALLBACK_TEXT_MODELS: TextModelOption[] = [
  { name: 'openai', description: 'OpenAI GPT-4o Mini' },
  { name: 'mistral', description: 'Mistral Small 3.1 24B' },
  { name: 'grok', description: 'xAI Grok-3 Mini' },
  { name: 'deepseek', description: 'DeepSeek V3' },
];

export const getTextModelOptions = (): TextModelOption[] => {
  const relevantModels = TEXT_MODEL_DATA.filter(
    (model) => model.input_modalities.includes('text') && model.output_modalities.includes('text')
  ).map(({ name, description }) => ({ name, description }));

  if (relevantModels.length > 0) {
    return relevantModels;
  }

  return FALLBACK_TEXT_MODELS;
};

export const resolveSelectedTextModel = (
  requestedModel: string | null | undefined,
  availableModels: TextModelOption[],
  defaultModel: string = DEFAULT_TEXT_MODEL
): string => {
  if (requestedModel && availableModels.some((model) => model.name === requestedModel)) {
    return requestedModel;
  }

  if (availableModels.some((model) => model.name === defaultModel)) {
    return defaultModel;
  }

  return availableModels[0]?.name ?? defaultModel;
};
