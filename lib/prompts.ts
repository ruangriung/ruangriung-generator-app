// lib/prompts.ts
export interface Prompt {
  slug: string;
  title: string;
  author: string;
  date: string; // Tanggal publikasi prompt
  category: string; // Contoh: "Gambar", "Teks", "Audio"
  toolsUsed: string[]; // Contoh: ["DALL-E", "Midjourney", "Stable Diffusion"]
  thumbnailUrl: string; // URL gambar thumbnail
  shortDescription: string; // Deskripsi singkat untuk tampilan daftar
  fullPrompt: string; // Isi prompt lengkap
  negativePrompt?: string; // Prompt negatif opsional
  notes?: string; // Catatan tambahan tentang prompt
}

// Impor prompt individual di sini
import { prompt as contohPrompt1 } from '@/lib/prompts/data/contoh-prompt-1';
import { prompt as contohPromptGambarPembandangan } from '@/lib/prompts/data/contoh-prompt-gambar-pemandangan';
import { prompt as promptCeritaFiksiIlmiah } from '@/lib/prompts/data/prompt-cerita-fiksi-ilmiah';
import { prompt as promptDesainMinimalis } from '@/lib/prompts/data/prompt-desain-minimalis';
import { prompt as promptResepMakananSehat } from '@/lib/prompts/data/prompt-resep-makanan-sehat';
import { prompt as promptKokoAjeeb1 } from '@/lib/prompts/data/prompt-koko-ajeeb-1';
import { prompt as promptXenopath1 } from '@/lib/prompts/data/prompt-xenopath-1';
import { prompt as promptDeryLau1 } from '@/lib/prompts/data/prompt-dery-lau-1';
import { prompt as promptDeryLau2 } from '@/lib/prompts/data/prompt-dery-lau-2';
import { prompt as promptKokoAjeeb2 } from '@/lib/prompts/data/prompt-koko-ajeeb-2';
import { prompt as promptXenopath2 } from '@/lib/prompts/data/prompt-xenopath-2';
import { prompt as promptHighFashionEditorialPosterEnzi } from '@/lib/prompts/data/high-fashion-editorial-poster-enzi';
import { prompt as promptYayoiKusamaTokyoFashionDream } from '@/lib/prompts/data/yayoi-kusama-tokyo-fashion-dream';
import { prompt as promptSaksanaStreetwearPoster } from '@/lib/prompts/data/saksana-streetwear-poster';


export const prompts: Prompt[] = [
  contohPrompt1,
  contohPromptGambarPembandangan,
  promptCeritaFiksiIlmiah,
  promptDesainMinimalis,
  promptResepMakananSehat,
  promptKokoAjeeb1,
  promptXenopath1,
  promptDeryLau1,
  promptDeryLau2,
  promptKokoAjeeb2,
  promptXenopath2,
  promptHighFashionEditorialPosterEnzi,
  promptYayoiKusamaTokyoFashionDream,
  promptSaksanaStreetwearPoster,

].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Mengurutkan prompt berdasarkan tanggal terbaru

export function getPrompt(slug: string): Prompt | undefined {
  return prompts.find((prompt) => prompt.slug === slug);
}