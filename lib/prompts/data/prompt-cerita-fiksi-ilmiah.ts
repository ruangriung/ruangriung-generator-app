// lib/prompts/data/prompt-cerita-fiksi-ilmiah.ts
import type { Prompt } from '@/lib/prompts';

export const prompt: Prompt = {
  slug: 'cerita-fiksi-ilmiah-koloni-mars',
  title: 'Ide Cerita Fiksi Ilmiah: Koloni Pertama di Mars',
  author: 'Yogee Kribo',
  date: '10 Mei 2025',
  category: 'Teks',
  toolsUsed: ['ChatGPT', 'Gemini'],
  thumbnailUrl: '/v1/img/showcase-3.webp', // Ganti dengan URL gambar thumbnail Anda
  shortDescription: 'Prompt untuk menghasilkan ide dan kerangka cerita fiksi ilmiah tentang tantangan dan penemuan koloni manusia pertama di Mars.',
  fullPrompt: `
    Generate a detailed plot outline for a science fiction story about the first human colony on Mars. Include the initial challenges of terraforming, a mysterious discovery made beneath the Martian surface, and the ethical dilemmas faced by the colonists. Focus on character development and the psychological impact of isolation on the crew. The story should explore themes of survival, human resilience, and the quest for knowledge in an alien environment.
  `,
  negativePrompt: `
    generic, cliché, short, lacking detail, no conflict, happy ending from the start, shallow characters
  `,
  notes: 'Gunakan prompt ini sebagai titik awal untuk mengembangkan narasi yang kompleks. Pertimbangkan untuk menambahkan twist tak terduga.',
};