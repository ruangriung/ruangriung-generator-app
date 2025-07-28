import type { Article } from '@/lib/articles';

const mengenalFiturPwa: Article = {
slug: 'mengenal-fitur-pwa',
    title: 'Instal RuangRiung di Perangkat Anda dengan PWA', // Changed from 'author' to 'authorSlug'
    authorSlug: 'Tim RuangRiung', // Changed from 'author' to 'authorSlug'
    publishedDate: '2025-07-21', // Changed from 'date' to 'publishedDate'
    lastUpdatedDate: '2025-07-21', // Changed from 'summary' to 'lastUpdatedDate'
    description: 'Pelajari apa itu Progressive Web App (PWA) dan bagaimana Anda bisa menginstal RuangRiung langsung ke perangkat Anda untuk akses cepat dan pengalaman seperti aplikasi.',
    image: '/v1/img/ruangriung.webp',
    category: 'Panduan Fitur',
    tags: ['PWA', 'instalasi', 'aplikasi web'],
    content: `
      <p class="mb-4">Anda mungkin melihat banner di bagian atas halaman yang menyarankan Anda untuk "Install App". Namun, ini bukanlah proses unduh dari App Store atau Play Store. RuangRiung dibangun sebagai <strong>Progressive Web App (PWA)</strong>, sebuah teknologi web modern yang memberikan pengalaman seperti aplikasi asli langsung dari browser Anda.</p>
      <h3 class="text-xl font-bold mt-6 mb-2">Apa Itu PWA?</h3>
      <p class="mb-4">PWA adalah situs web yang memiliki kemampuan tambahan untuk berfungsi seperti aplikasi yang Anda instal di ponsel atau komputer. Teknologi ini memungkinkan aplikasi web untuk diinstal ke layar utama (homescreen), bekerja secara offline (untuk beberapa fitur), dan mengirimkan notifikasi. Ini adalah gabungan terbaik dari kemudahan akses sebuah website dengan fungsionalitas sebuah aplikasi.</p>
      <h3 class="text-xl font-bold mt-6 mb-2">Keuntungan Menginstal RuangRiung sebagai PWA</h3>
      <p class="mb-4">Dengan mengklik tombol "Install App", Anda mendapatkan beberapa keuntungan signifikan:</p>
      <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
        <li><strong>Akses Cepat:</strong> Ikon aplikasi akan muncul di layar utama (ponsel) atau desktop (komputer), memungkinkan Anda membuka RuangRiung dengan satu kali klik, sama seperti aplikasi lainnya.</li>
        <li><strong>Pengalaman Imersif:</strong> Saat dibuka dari ikonnya, aplikasi akan berjalan di jendelanya sendiri tanpa bilah alamat browser, memberikan nuansa seperti aplikasi asli.</li>
        <li><strong>Performa Lebih Baik:</strong> Aset-aset penting aplikasi akan disimpan di perangkat Anda, membuatnya dapat dimuat lebih cepat pada kunjungan berikutnya.</li>
        <li><strong>Pembaruan Otomatis:</strong> Anda tidak perlu memperbarui aplikasi secara manual. Setiap kali kami merilis versi baru, Anda akan otomatis mendapatkan versi terbarunya saat Anda membuka aplikasi.</li>
      </ul>
      <h3 class="text-xl font-bold mt-6 mb-2">Bagaimana Cara Menginstalnya?</h3>
      <p class="mb-4">Sangat mudah! Jika Anda melihat banner instalasi, cukup klik tombol tersebut. Jika tidak, pada browser Chrome di desktop, cari ikon instalasi (biasanya berupa layar dengan panah ke bawah) di ujung kanan bilah alamat. Di browser seluler, cari opsi "Add to Home Screen" atau "Install App" di menu browser.</p>
      <p>Dengan PWA, kami berupaya memberikan pengalaman terbaik bagi Anda, menggabungkan aksesibilitas web dengan kenyamanan aplikasi modern. Selamat mencoba!</p>
    `,

};
export default mengenalFiturPwa;