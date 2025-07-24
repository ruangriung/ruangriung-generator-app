// lib/prompts/data/prompt-koko-ajeeb-2.ts
import type { Prompt } from '@/lib/prompts';

export const prompt: Prompt = {
  slug: 'robot-vintage-di-padang-pasir',
  title: 'Robot Vintage di Padang Pasir Senja',
  author: 'Koko Ajeeb',
  date: '10 September 2025', // Tanggal baru
  category: 'Gambar, Seni Digital, AI Generatif, Prompt Engineering, Eksperimen Seni',
  toolsUsed: ['Midjourney', 'Stable Diffusion'],
  thumbnailUrl: '/v1/img/gbr-2.jpg', // Ganti dengan URL gambar thumbnail Anda
  shortDescription: 'Prompt untuk menciptakan gambar robot bergaya vintage yang berdiri sendirian di tengah padang pasir luas saat senja, dengan nuansa melankolis.',
  fullPrompt: `
    A vintage-style robot, reminiscent of 1950s sci-fi, standing alone in a vast desert at sunset. The sky is painted with warm orange and purple hues, casting long shadows. Intricate metallic details on the robot, a sense of solitude and wonder. Cinematic, highly detailed, golden hour lighting.
  `,
  negativePrompt: `
    modern robot, futuristic, human figures, city, green landscape, bright daylight, blurry, low quality, cartoon, simple, cluttered
  `,
  notes: 'Fokus pada tekstur karat atau usang pada robot untuk menambah kesan vintage. Pertimbangkan untuk menambahkan debu atau pasir yang beterbangan.',
};