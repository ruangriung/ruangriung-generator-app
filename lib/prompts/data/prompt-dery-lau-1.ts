// lib/prompts/data/prompt-dery-lau-1.ts
import type { Prompt } from '@/lib/prompts';

export const prompt: Prompt = {
  slug: 'potret-wanita-elegan-vintage',
  title: 'Potret Wanita Elegan Gaya Vintage di Kafe',
  author: 'Dery Lau',
  date: '01 September 2025',
  category: 'Gambar',
  toolsUsed: ['Midjourney'],
  thumbnailUrl: '/v1/img/dery-1.jpg', // Ganti dengan URL gambar thumbnail Anda
  shortDescription: 'Prompt detail untuk potret seorang wanita dengan gaya vintage di kafe yang ramai, fokus pada ekspresi wajah dan pencahayaan lembut.',
  fullPrompt: `
    Close-up portrait of an elegant woman in a vintage cafe, soft natural lighting, she is looking thoughtfully out of the window, wearing a delicate lace dress, a cup of coffee on the table. Warm color tones, shallow depth of field, film photography aesthetic, capturing the essence of nostalgia and elegance. The background features blurred patrons and vintage decor, enhancing the intimate atmosphere of the scene.
  `,
  negativePrompt: `
    blurry, modern clothing, ugly, disfigured, extra limbs, bad anatomy, deformed, poorly drawn hands, busy background, harsh lighting, dull colors
  `,
  notes: 'Prompt ini cocok untuk mengeksplorasi nuansa emosi dan detail tekstur. Coba variasikan ekspresi wajah atau elemen di latar belakang.',
};