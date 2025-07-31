import type { Article } from '@/lib/articles';

export const article: Article = {
    slug: 'menggunakan-negative-prompt',
    title: 'Kekuatan Negatif Prompt: Menghilangkan yang Tidak Diinginkan',
    author: 'Tim RuangRiung',
    date: '1 Agustus 2025',
    summary: 'Belajar cara menggunakan "negative prompt" untuk mengontrol hasil gambar dengan lebih presisi. Hilangkan elemen yang tidak diinginkan dan perbaiki kualitas gambar secara signifikan.',
    content: `
      <p class="mb-4">
        Saat membuat gambar dengan AI, kita sering fokus pada apa yang ingin kita lihat. Tapi, tahukah Anda bahwa memberi tahu AI apa yang <strong>tidak</strong> ingin kita lihat bisa sama pentingnya? Inilah fungsi dari "Negative Prompt", sebuah alat canggih di RuangRiung untuk menyempurnakan karya Anda.
      </p>
      <h3 class="text-xl font-bold mt-6 mb-2">Apa Itu Negative Prompt?</h3>
      <p class="mb-4">
        Secara sederhana, negative prompt adalah daftar kata kunci yang Anda berikan kepada AI untuk dihindari saat menghasilkan gambar. Jika prompt utama adalah instruksi "gambar ini", maka negative prompt adalah instruksi "jangan gambar ini".
      </p>

      <h3 class="text-xl font-bold mt-6 mb-2">Mengapa Ini Sangat Berguna?</h3>
      <p class="mb-4">
        Negative prompt membantu Anda mengatasi beberapa masalah umum dalam pembuatan gambar AI dan memberikan kontrol yang lebih halus:
      </p>
      <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
        <li><strong>Memperbaiki Anatomi:</strong> AI terkadang kesulitan dengan detail seperti tangan atau jumlah jari. Negative prompt sangat efektif untuk mengatasi ini.</li>
        <li><strong>Menghilangkan Objek:</strong> Ingin pemandangan kota tanpa mobil? Atau hutan tanpa ada orang? Sebutkan saja di negative prompt.</li>
        <li><strong>Meningkatkan Kualitas Umum:</strong> Anda bisa "melarang" AI menghasilkan gambar berkualitas rendah, buram, atau jelek.</li>
        <li><strong>Mengontrol Gaya:</strong> Jika Anda ingin gaya fotorealistik, Anda bisa memasukkan kata seperti "kartun" atau "lukisan" di negative prompt untuk memastikan hasilnya tidak menyimpang.</li>
      </ul>

      <h3 class="text-xl font-bold mt-6 mb-2">Contoh Praktis Penggunaan</h3>
      <p class="mb-4">
        Mari kita lihat beberapa skenario bagaimana negative prompt bisa menyelamatkan hasil gambar Anda.
      </p>
      <p class="mb-4">
        <strong>Skenario 1: Membuat Potret Sempurna</strong><br>
        <strong>Prompt Utama:</strong> <code>close-up portrait of a beautiful woman, smiling</code><br>
        <strong>Potensi Masalah:</strong> Tangan yang aneh, mata juling, atau proporsi yang salah.<br>
        <strong>Negative Prompt:</strong> <code>deformed, ugly, disfigured, extra limbs, bad hands, extra fingers, blurry, jpeg artifacts</code>
      </p>
      <p class="mb-4">
        <strong>Skenario 2: Pemandangan Alam yang Murni</strong><br>
        <strong>Prompt Utama:</strong> <code>a serene landscape of a green valley with a river</code><br>
        <strong>Potensi Masalah:</strong> AI mungkin menambahkan bangunan, jalan, atau orang yang tidak diinginkan.<br>
        <strong>Negative Prompt:</strong> <code>people, buildings, roads, cars, text, watermark, signature</code>
      </p>
      <p class="mt-6">
        Di RuangRiung, Anda akan menemukan kolom khusus untuk "Negative Prompt" tepat di bawah kolom prompt utama. Jangan ragu untuk mengisinya. Mulailah dengan beberapa kata kunci umum seperti <code>ugly, blurry, low quality</code> dan tambahkan kata-kata spesifik sesuai kebutuhan Anda. Menguasai negative prompt adalah langkah selanjutnya untuk bertransformasi dari pengguna biasa menjadi seorang "pembisik" AI yang andal.
      </p>
    `,
};