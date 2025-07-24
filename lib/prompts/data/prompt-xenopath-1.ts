// lib/prompts/data/prompt-xenopath-1.ts
import type { Prompt } from '@/lib/prompts';

export const prompt: Prompt = {
  slug: 'pohon-raksasa-di-hutan-alien',
  title: 'Hutan Alien dengan Pohon Raksasa Bercahaya',
  author: 'Xenopath',
  date: '15 Agustus 2025',
  category: 'Gambar',
  toolsUsed: ['Stable Diffusion'],
  thumbnailUrl: '/v1/img/showcase-6.webp', // Ganti dengan URL gambar thumbnail Anda
  shortDescription: 'Prompt untuk menghasilkan gambar hutan alien yang surealis dengan pohon-pohon raksasa yang memancarkan cahaya biologis, suasana misterius.',
  fullPrompt: `
    A surreal alien forest with gigantic bioluminescent trees, strange glowing flora, and a mystical atmosphere. The ground is covered in glowing fungi, with faint ethereal mist. Wide-angle shot, fantasy art, volumetric light, intricate details, vibrant colors. The trees have twisting trunks and large, luminous leaves that cast a soft glow on the surroundings. The sky is a deep indigo with two moons visible, adding to the otherworldly feel of the scene. Include small alien creatures peeking from behind the trees to enhance the sense of mystery.
  `,
  negativePrompt: `
    normal trees, human structures, dull lighting, low contrast, blurry, abstract, cartoon, distorted, simple, uninspired
  `,
  notes: 'Coba bereksperimen dengan bentuk dan warna pohon serta jenis cahaya yang dipancarkan untuk hasil yang unik. Anda juga bisa menambahkan elemen seperti sungai atau danau kecil untuk memperkaya komposisi gambar ini.',
};