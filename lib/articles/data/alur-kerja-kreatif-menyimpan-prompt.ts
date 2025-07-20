import type { Article } from '@/lib/articles';

export const article: Article = {
    slug: 'alur-kerja-kreatif-menyimpan-prompt',
    title: 'Alur Kerja Kreatif: Mengelola dan Menyimpan Prompt',
    author: 'Tim RuangRiung',
    date: '29 Juli 2025',
    summary: 'Prompt yang bagus adalah aset berharga. Pelajari cara menggunakan fitur simpan, muat, dan hapus prompt di RuangRiung untuk mempercepat proses kreatif Anda.',
    content: `
      <p class="mb-4">
        Dalam proses menciptakan seni AI, Anda pasti akan menemukan beberapa "prompt ajaib" yang secara konsisten menghasilkan gambar yang luar biasa. Kehilangan prompt tersebut bisa sangat disayangkan. Untungnya, RuangRiung dilengkapi dengan fitur untuk menyimpan dan mengelola prompt favorit Anda, menciptakan alur kerja yang lebih efisien.
      </p>
      <h3 class="text-xl font-bold mt-6 mb-2">1. Menyimpan Prompt Terbaik Anda</h3>
      <p class="mb-4">
        Setiap kali Anda berhasil membuat prompt yang menghasilkan visual memukau, jangan biarkan hilang! Setelah prompt tertulis di kolom utama, cukup klik tombol <strong>Simpan (ikon save)</strong>. Prompt Anda akan langsung ditambahkan ke daftar "Prompt Tersimpan" di bagian bawah panel kontrol.
      </p>
      <h3 class="text-xl font-bold mt-6 mb-2">2. Membangun Perpustakaan Gaya Pribadi</h3>
      <p class="mb-4">
        Fitur ini sangat berguna untuk menjaga konsistensi gaya. Misalnya, Anda menemukan kombinasi kata kunci yang sempurna untuk gaya "fantasi cat air". Simpan prompt dasar tersebut, seperti:
      </p>
      <p class="mb-4">
        <code>A beautiful fantasy landscape, watercolor painting, soft pastels, detailed, magical atmosphere, by [artist name style]</code>
      </p>
      <p class="mb-4">
        Nantinya, saat Anda ingin membuat gambar baru dengan gaya yang sama, Anda tidak perlu mengetik ulang semuanya. Cukup muat prompt ini dari daftar, lalu ganti bagian subjek utamanya (misalnya, "a beautiful fantasy landscape" menjadi "a majestic dragon").
      </p>
      <h3 class="text-xl font-bold mt-6 mb-2">3. Mengakses dan Mengelola Prompt Tersimpan</h3>
      <p class="mb-4">
        Semua prompt yang Anda simpan akan muncul di dalam akordeon "Prompt Tersimpan".
      </p>
      <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
        <li><strong>Memuat Prompt:</strong> Cukup klik pada teks prompt yang ada di daftar. Prompt tersebut akan otomatis dimuat ke kolom input utama, siap untuk digunakan atau dimodifikasi.</li>
        <li><strong>Menghapus Prompt:</strong> Jika sebuah prompt sudah tidak relevan lagi, klik ikon <strong>X</strong> di sebelah kanannya untuk menghapusnya dari daftar.</li>
        <li><strong>Menghapus Semua:</strong> Ingin memulai dari awal? Gunakan tombol "Hapus Semua" untuk membersihkan seluruh daftar prompt tersimpan Anda.</li>
      </ul>
      <p>
        Dengan memperlakukan prompt sebagai aset yang bisa dikelola, Anda tidak hanya menghemat waktu, tetapi juga membangun sebuah "toolkit" pribadi yang dapat diandalkan untuk semua proyek kreatif Anda di masa depan.
      </p>
    `
,
};
