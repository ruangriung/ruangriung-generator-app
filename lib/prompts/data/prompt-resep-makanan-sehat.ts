// lib/prompts/data/prompt-resep-makanan-sehat.ts
import type { Prompt } from '@/lib/prompts';

export const prompt: Prompt = {
  slug: 'resep-makanan-sehat-sarapan',
  title: 'Resep Sarapan Sehat dan Cepat',
  author: 'Yogee Kribo',
  date: '01 April 2025',
  category: 'Resep',
  toolsUsed: ['ChatGPT', 'Bard'],
  thumbnailUrl: '/v1/img/showcase-4.webp', // Ganti dengan URL gambar thumbnail Anda
  shortDescription: 'Prompt untuk menghasilkan resep sarapan sehat, bergizi, dan mudah dibuat dalam waktu kurang dari 15 menit.',
  fullPrompt: `
    Generate a healthy and quick breakfast recipe that can be prepared in under 15 minutes. The recipe should be nutritious, include at least one fruit, and be suitable for a busy morning. Provide ingredients list, step-by-step instructions, and nutritional benefits. Focus on using whole foods, minimal processing, and avoiding added sugars or unhealthy fats. The dish should be visually appealing and easy to replicate.
    Example: A smoothie bowl with spinach, banana, almond milk, topped with chia seeds and fresh berries. Include tips for variations or substitutions based on dietary preferences (e.g., vegan, gluten-free).
  `,
  negativePrompt: `
    complicated, long preparation time, unhealthy ingredients, high sugar, deep-fried, bland, unclear instructions
  `,
  notes: 'Anda bisa menyesuaikan bahan-bahan sesuai preferensi diet atau ketersediaan. Ideal untuk pagi yang sibuk.',
};