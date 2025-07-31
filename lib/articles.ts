// lib/articles.ts
import { article as kolaborasiKreatifChatbotDanGambar } from './articles/data/kolaborasi-kreatif-chatbot-dan-gambar';
import { article as menjelajahiGayaSeniDiRuangriung } from './articles/data/menjelajahi-gaya-seni-di-ruangriung';
import { article as privasiDanKeamananDataDiRuangriung } from './articles/data/privasi-dan-keamanan-data-di-ruangriung';
import { article as studiKasusCreatorPromptVideo } from './articles/data/studi-kasus-creator-prompt-video';
import { article as pengenalanAiGenerator } from './articles/data/pengenalan-ai-generator';
import { article as tipsMembuatPromptEfektif } from './articles/data/tips-membuat-prompt-efektif';
import { article as memahamiModelAiChatbot } from './articles/data/memahami-model-ai-chatbot';
import { article as etikaSeniAi } from './articles/data/etika-seni-ai';
import { article as mengenalFiturPwa } from './articles/data/mengenal-fitur-pwa';
import { article as memaksimalkanAsistenPrompt } from './articles/data/memaksimalkan-asisten-prompt';
import { article as analisisGambarUntukInspirasi } from './articles/data/analisis-gambar-untuk-inspirasi';

// --- ARTIKEL BARU DITAMBAHKAN DI SINI ---
import { article as menguasaiKomposisiGambarAi } from './articles/data/menguasai-komposisi-gambar-ai';
import { article as panduanMemilihModelAi } from './articles/data/panduan-memilih-model-ai';
import { article as menghidupkanNarasiDenganAudioAi } from './articles/data/menghidupkan-narasi-dengan-audio-ai';
import { article as tipsFiturEditGambarRealTime } from './articles/data/tips-fitur-edit-gambar-real-time';
import { article as alurKerjaKreatifMenyimpanPrompt } from './articles/data/alur-kerja-kreatif-menyimpan-prompt';
import { article as menggunakanNegativePrompt } from './articles/data/menggunakan-negative-prompt';
// -----------------------------------------

// Interface ini tetap dibutuhkan agar komponen lain tahu bentuk data artikel
export interface Article {
  slug: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string;
  
}

// Helper function to parse Indonesian date strings
const convertDate = (dateStr: string): Date => {
    const parts = dateStr.split(' ');
    if (parts.length !== 3) return new Date(0); // Return an old date for invalid formats
    const day = parseInt(parts[0], 10);
    const monthIndex = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].indexOf(parts[1]);
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || monthIndex === -1 || isNaN(year)) {
        return new Date(0);
    }

    return new Date(year, monthIndex, day);
};

// Gabungkan semua artikel yang diimpor ke dalam satu array
// Urutan di sini akan menentukan urutan di halaman daftar artikel Anda
export const articles: Article[] = [
  // --- ARTIKEL BARU ---
  menggunakanNegativePrompt,
  kolaborasiKreatifChatbotDanGambar,
  menjelajahiGayaSeniDiRuangriung,
  privasiDanKeamananDataDiRuangriung,
  studiKasusCreatorPromptVideo,
  alurKerjaKreatifMenyimpanPrompt,
  tipsFiturEditGambarRealTime,
  menghidupkanNarasiDenganAudioAi,
  panduanMemilihModelAi,
  menguasaiKomposisiGambarAi,
  // --- ARTIKEL LAMA ---
  analisisGambarUntukInspirasi,
  memaksimalkanAsistenPrompt,
  mengenalFiturPwa,
  etikaSeniAi,
  memahamiModelAiChatbot,
  tipsMembuatPromptEfektif,
  pengenalanAiGenerator,
].sort((a, b) => convertDate(b.date).getTime() - convertDate(a.date).getTime()); // <-- Mengurutkan artikel berdasarkan tanggal terbaru


// Fungsi untuk mendapatkan satu artikel berdasarkan slug-nya
export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}