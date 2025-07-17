// lib/articles.ts
import { article as pengenalanAiGenerator } from './articles/data/pengenalan-ai-generator';
import { article as tipsMembuatPromptEfektif } from './articles/data/tips-membuat-prompt-efektif';
import { article as memahamiModelAiChatbot } from './articles/data/memahami-model-ai-chatbot';
import { article as etikaSeniAi } from './articles/data/etika-seni-ai';
import { article as mengenalFiturPwa } from './articles/data/mengenal-fitur-pwa';
import { article as memaksimalkanAsistenPrompt } from './articles/data/memaksimalkan-asisten-prompt';
import { article as analisisGambarUntukInspirasi } from './articles/data/analisis-gambar-untuk-inspirasi';

// Interface ini tetap dibutuhkan agar komponen lain tahu bentuk data artikel
export interface Article {
  slug: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string;
}

// Gabungkan semua artikel yang diimpor ke dalam satu array
// Urutan di sini akan menentukan urutan di halaman daftar artikel Anda
export const articles: Article[] = [
  analisisGambarUntukInspirasi,
  memaksimalkanAsistenPrompt,
  mengenalFiturPwa,
  etikaSeniAi,
  memahamiModelAiChatbot,
  tipsMembuatPromptEfektif,
  pengenalanAiGenerator,
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // <-- Opsional: Mengurutkan artikel berdasarkan tanggal terbaru


// Fungsi untuk mendapatkan satu artikel berdasarkan slug-nya
export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}