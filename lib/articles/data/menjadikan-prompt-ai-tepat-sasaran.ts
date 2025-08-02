// lib/articles/data/menjadikan-prompt-ai-tepat-sasaran.ts

import type { Article } from '@/lib/articles'; // Memastikan path import sesuai dengan struktur repositori Anda

export const article: Article = {
  slug: 'menjadikan-prompt-ai-tepat-sasaran', // Slug unik untuk URL artikel
  title: 'Menjadikan Prompt AI Tepat Sasaran agar Gambar Sesuai Ekspektasi',
  author: 'Tim RuangRiung', // Anda bisa mengubah ini ke nama Anda
  date: '02 Agustus 2025', // Sesuaikan tanggal publikasi artikel ini
  summary: 'Panduan komprehensif untuk membuat prompt AI yang spesifik, deskriptif, dan terstruktur dengan baik agar hasil gambar AI sesuai dengan ekspektasi Anda.',
  content: `
      <p class="mb-4">
        Untuk mendapatkan gambar dari AI yang sesuai dengan ekspektasi Anda, kuncinya adalah membuat prompt yang <strong>spesifik, deskriptif, dan terstruktur dengan baik</strong>. AI tidak bisa membaca pikiran Anda, jadi semakin jelas Anda menyampaikan keinginan Anda, semakin baik hasilnya.
      </p>
      <p class="mb-4">
        Berikut adalah panduan lengkap untuk menjadikan prompt Anda tepat sasaran:
      </p>

      <h3 class="text-xl font-bold mt-6 mb-2">1. Spesifik dan Detail</h3>
      <p class="mb-4">
        Hindari prompt yang terlalu umum. Semakin detail Anda, semakin baik.
      </p>
      <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
        <li><strong>Hindari:</strong> "Seorang wanita cantik."</li>
        <li><strong>Lebih Baik:</strong> "Seorang wanita muda berambut pirang panjang, mengenakan gaun biru langit, tersenyum lembut di tengah taman bunga matahari, dengan pencahayaan hangat."</li>
      </ul>

      <h3 class="text-xl font-bold mt-6 mb-2">2. Gunakan Kata Kunci yang Kuat</h3>
      <p class="mb-4">
        Pilih kata-kata yang paling menggambarkan subjek, gaya, suasana, dan elemen lain yang Anda inginkan.
      </p>
      <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
        <li><strong>Subjek:</strong> "kucing", "robot", "pemandangan kota", "manusia purba"</li>
        <li><strong>Aksi/Emosi:</strong> "melompat", "terbang", "sedih", "gembira", "berpikir"</li>
        <li><strong>Gaya Seni:</strong> "fotorealistik", "cat air", "sketsa pensil", "lukisan minyak", "gaya anime", "cyberpunk", "fantasi"</li>
        <li><strong>Pencahayaan:</strong> "cahaya keemasan", "cahaya redup", "cahaya dramatis", "siluet", "bayangan panjang"</li>
        <li><strong>Komposisi:</strong> "potret dekat", "pemandangan luas", "sudut pandang mata burung", "sudut rendah"</li>
        <li><strong>Warna:</strong> "palet warna pastel", "warna cerah", "monokrom", "kontras tinggi"</li>
        <li><strong>Tekstur:</strong> "halus", "kasar", "mengkilap", "berbulu"</li>
      </ul>

      <h3 class="text-xl font-bold mt-6 mb-2">3. Struktur Prompt yang Jelas (Prompt Engineering)</h3>
      <p class="mb-4">
        Meskipun tidak ada aturan baku, struktur berikut seringkali sangat efektif:
      </p>
      <p class="mb-4">
        <strong>[Subjek] + [Aksi/Deskripsi] + [Detail Tambahan: Pakaian, Ekspresi, Lingkungan] + [Gaya Seni] + [Pencahayaan/Warna/Suasana Hati] + [Komposisi/Sudut Pandang]</strong>
      </p>
      <p class="mb-4">
        <strong>Contoh:</strong>
      </p>
      <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
        <li>"Seekor harimau Bengal yang anggun, melompat di atas air terjun hutan tropis yang rimbun, dengan cipratan air, gaya fotorealistik, pencahayaan dramatis senja, sudut pandang lebar."</li>
        <li>"Seorang ksatria wanita berbaju zirah berkilau, memegang pedang bercahaya, berdiri di puncak gunung bersalju dengan naga di latar belakang, gaya fantasi epik, langit badai, potret pahlawan."</li>
      </ul>

      <h3 class="text-xl font-bold mt-6 mb-2">4. Gunakan Modifier Positif dan Negatif (Jika Tersedia)</h3>
      <p class="mb-4">
        Beberapa model AI memungkinkan Anda untuk secara eksplisit menyebutkan apa yang Anda <strong>inginkan</strong> (positif) dan apa yang <strong>tidak Anda inginkan</strong> (negatif).
      </p>
      <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
        <li><strong>Prompt Positif:</strong> "Gadis muda yang tersenyum, bunga sakura bermekaran, langit biru cerah."</li>
        <li><strong>Prompt Negatif (jika ada fitur ini):</strong> "buruk, distorsi, tangan aneh, cacat, kabur."</li>
      </ul>

      <h3 class="text-xl font-bold mt-6 mb-2">5. Bereksperimen dengan Urutan Kata</h3>
      <p class="mb-4">
        Urutan kata dalam prompt dapat memengaruhi penekanan. Kata-kata yang ditempatkan di awal prompt cenderung memiliki bobot lebih besar bagi AI.
      </p>
      <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
        <li><strong>"Kucing oranye besar, mata hijau"</strong> mungkin akan lebih fokus pada "kucing oranye".</li>
        <li><strong>"Mata hijau, kucing oranye besar"</strong> mungkin akan lebih menekankan pada "mata hijau".</li>
      </ul>

      <h3 class="text-xl font-bold mt-6 mb-2">6. Iterasi dan Refinement</h3>
      <p class="mb-4">
        Jarang sekali Anda akan mendapatkan hasil sempurna di percobaan pertama. Prosesnya adalah:
      </p>
      <ol class="list-decimal list-inside pl-4 mt-2 space-y-1">
        <li><strong>Buat prompt awal.</strong></li>
        <li><strong>Hasilkan gambar.</strong></li>
        <li><strong>Analisis hasilnya:</strong> Apa yang berhasil? Apa yang tidak?</li>
        <li><strong>Perbaiki prompt Anda:</strong> Tambahkan detail yang hilang, hapus elemen yang tidak diinginkan, ubah gaya, atau sesuaikan komposisi.</li>
        <li><strong>Ulangi</strong> sampai Anda mendapatkan hasil yang diinginkan.</li>
      </ol>

      <h3 class="text-xl font-bold mt-6 mb-2">7. Pahami Keterbatasan AI (untuk saat ini)</h3>
      <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
        <li><strong>Teks:</strong> AI masih sering kesulitan dalam menghasilkan teks atau huruf yang koheren dalam gambar.</li>
        <li><strong>Anatomi Kompleks:</strong> Terkadang, bagian tubuh seperti tangan atau jari bisa terlihat aneh atau berjumlah tidak wajar. Anda mungkin perlu melakukan banyak iterasi atau editing manual.</li>
        <li><strong>Konsep Abstrak:</strong> Menerjemahkan emosi atau konsep yang sangat abstrak bisa jadi tantangan. Cobalah untuk memvisualisasikan emosi tersebut dengan skenario atau ekspresi wajah yang spesifik.</li>
      </ul>

      <p>
        Dengan menerapkan tips di atas, Anda akan jauh lebih efektif dalam "berkomunikasi" dengan AI dan menghasilkan gambar yang lebih sesuai dengan visi Anda. Selamat bereksperimen!
      </p>
    `
};
