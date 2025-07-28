import type { Article } from '@/lib/articles';

const tipsFiturEditGambarRealTime: Article = {
    slug: 'tips-fitur-edit-gambar-real-time',
    title: 'Tips & Trik Menggunakan Fitur Edit Gambar Real-time',
    authorSlug: 'Tim RuangRiung',
    publishedDate: '2025-07-28',
    lastUpdatedDate: '2025-07-28',
    description: 'Jangan berhenti setelah gambar berhasil dibuat. Pelajari cara menyempurnakan karya Anda secara langsung dengan fitur filter, penyesuaian, dan watermarking di RuangRiung.',
    category: 'Panduan Fitur',
    tags: ['edit gambar', 'filter', 'watermark'],
    image: '/v1/img/ruangriung.webp',
    content: `
      <p class="mb-4">
        Proses kreatif tidak berhenti saat AI selesai menghasilkan gambar. Di RuangRiung, kami menyediakan alat edit sederhana namun kuat yang memungkinkan Anda melakukan sentuhan akhir secara real-time tanpa perlu membuka aplikasi lain. Mari kita jelajahi cara memaksimalkannya.
      </p>
      <h3 class="text-xl font-bold mt-6 mb-2">1. Menyesuaikan Mood dengan Filter</h3>
      <p class="mb-4">
        Setelah gambar Anda muncul, klik tombol <strong>Edit (ikon kuas)</strong> untuk membuka panel kontrol. Di sini, Anda akan menemukan tiga slider utama untuk filter:
      </p>
      <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
        <li><strong>Kecerahan (Brightness):</strong> Geser ke kanan untuk membuat gambar lebih terang, atau ke kiri untuk suasana yang lebih gelap dan muram.</li>
        <li><strong>Kontras (Contrast):</strong> Tingkatkan kontras untuk membuat warna lebih "pop" dan detail lebih tajam, atau kurangi untuk tampilan yang lebih lembut dan datar.</li>
        <li><strong>Saturasi (Saturate):</strong> Naikkan saturasi untuk warna yang lebih hidup dan pekat, atau turunkan hingga ke nol untuk mendapatkan efek hitam-putih yang dramatis.</li>
      </ul>
      <p class="mb-4">
        Kombinasi ketiga filter ini memungkinkan Anda mengubah mood gambar secara signifikan. Gambar pemandangan yang cerah bisa diubah menjadi suasana senja yang melankolis hanya dengan beberapa penyesuaian.
      </p>
      <h3 class="text-xl font-bold mt-6 mb-2">2. Melindungi Karya dengan Watermark</h3>
      <p class="mb-4">
        Panel edit juga memungkinkan Anda menambahkan identitas pada karya Anda dengan watermark, baik berupa teks maupun logo.
      </p>
      <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
        <li><strong>Watermark Teks:</strong> Cukup ketikkan nama atau brand Anda di kolom "Teks Watermark". Anda bisa mengatur jenis font, warna, ukuran, dan opasitasnya agar menyatu dengan baik tanpa mengganggu gambar utama.</li>
        <li><strong>Watermark Gambar:</strong> Ingin menggunakan logo? Klik "Pilih File" di bawah "Gambar Watermark" dan unggah logo Anda (disarankan format PNG dengan latar transparan). Anda juga bisa mengatur ukuran dan opasitasnya.</li>
      </ul>
      <p>
        Setelah watermark ditambahkan, Anda dapat mengklik dan menyeretnya langsung di atas kanvas gambar untuk menempatkannya di posisi yang sempurna.
      </p>
      <h3 class="text-xl font-bold mt-6 mb-2">3. Unduh Hasil Akhir Anda</h3>
      <p class="mb-4">
        Setelah semua penyesuaian selesai, klik tombol <strong>Unduh (ikon panah ke bawah)</strong>. Sistem akan mengunduh gambar versi kanvas yang sudah Anda edit, lengkap dengan semua filter dan watermark yang telah diterapkan. Ini adalah cara cepat untuk memfinalisasi karya Anda dan siap untuk dibagikan.
      </p>
    `
,
};
export default tipsFiturEditGambarRealTime;