// lib/prompts.ts
export interface Prompt {
  id?: string; // ID opsional
  slug: string;
  title: string;
  author: string;
  date: string; // Tanggal publikasi prompt
  category: string;
  toolsUsed: string[];
  thumbnailUrl: string;
  shortDescription: string;
  fullPrompt: string;
  negativePrompt?: string | null; // Perbaikan: Izinkan null
  notes?: string | null; // Perbaikan: Izinkan null
}

// Catatan: Impor prompt individual di bawah ini mungkin akan dihapus
// setelah Anda memigrasikan semua data ke database dan mengandalkan API.
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

].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function getPrompt(slug: string): Prompt | undefined {
  return prompts.find((prompt) => prompt.slug === slug);
}