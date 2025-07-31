import type { Article } from '@/lib/articles';

export const article: Article = { 
    slug: 'privasi-dan-keamanan-data-di-ruangriung',
    title: 'Privasi Anda, Prioritas Kami: Bagaimana RuangRiung Menjaga Data Anda',
    author: 'Tim RuangRiung',
    date: '1 Agustus 2025',
    summary: `Transparansi adalah kunci. Pahami data apa yang kami gunakan, mengapa kami membutuhkannya, dan bagaimana kami berkomitmen untuk menjaga keamanan dan privasi Anda di setiap langkah.`,
    content: `
      <p class="mb-4">
        Di era digital saat ini, pertanyaan "Ke mana data saya pergi?" adalah hal yang sangat wajar dan penting. Di RuangRiung, kami percaya bahwa kreativitas yang hebat dibangun di atas fondasi kepercayaan. Oleh karena itu, kami ingin menjelaskan secara transparan bagaimana kami menangani data Anda.
      </p>
      <h3 class="text-xl font-bold mt-6 mb-2">Filosofi Kami: Minimalis dan Berpusat pada Pengguna</h3>
      <p class="mb-4">
        Prinsip utama kami adalah mengumpulkan data sesedikit mungkin. Kami hanya meminta informasi yang benar-benar kami butuhkan untuk menjalankan fungsionalitas aplikasi dan meningkatkan pengalaman Anda.
      </p>

      <h3 class="text-xl font-bold mt-6 mb-2">1. Penggunaan Tanpa Login: Kreativitas Anonim</h3>
      <p class="mb-4">
        Untuk fitur inti seperti Generator Gambar dan Chatbot dasar, Anda tidak perlu login. Saat Anda menggunakan fitur-fitur ini, kami tidak tahu siapa Anda. Aktivitas Anda bersifat anonim. Kami percaya setiap orang berhak untuk bereksperimen secara bebas.
      </p>

      <h3 class="text-xl font-bold mt-6 mb-2">2. Kekuatan "localStorage": Data di Tangan Anda</h3>
      <p class="mb-4">
        Anda mungkin bertanya, "Jika saya tidak login, bagaimana aplikasi bisa mengingat riwayat chat atau prompt yang saya simpan?" Jawabannya adalah teknologi bernama <strong>localStorage</strong>.
      </p>
      <p class="mb-4">
        Anggap saja localStorage sebagai "buku catatan kecil" yang disimpan di dalam browser Anda sendiri, bukan di server kami. Saat Anda menyimpan prompt, mengubah tema, atau melihat riwayat chat, informasi tersebut ditulis ke dalam localStorage. Ini berarti data Anda tetap di perangkat Anda, dan kami tidak memiliki akses langsung ke sana.
      </p>
      <h3 class="text-xl font-bold mt-6 mb-2">3. Data yang Kami Kumpulkan</h3>
      <p class="mb-4">
        Kami mengumpulkan data berikut untuk meningkatkan pengalaman Anda:
        <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
          <li><strong>Riwayat Chat:</strong> Untuk memungkinkan Anda melanjutkan percakapan sebelumnya.</li>
          <li><strong>Prompt yang Disimpan:</strong> Agar Anda dapat mengakses kembali ide-ide yang telah Anda buat.</li>
          <li><strong>Preferensi Tema:</strong> Untuk mengingat pilihan tema gelap atau terang Anda.</li>
        </ul>
      </p>
      <h3 class="text-xl font-bold mt-6 mb-2">4. Keamanan Data Anda</h3>
      <p class="mb-4">
        Kami mengambil langkah-langkah keamanan yang serius untuk melindungi data Anda. Meskipun kami tidak menyimpan data di server kami, kami tetap memastikan bahwa:
        <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
          <li>Data yang disimpan di localStorage dienkripsi untuk mencegah akses tidak sah.</li>
          <li>Kami tidak membagikan data Anda dengan pihak ketiga tanpa izin eksplisit dari Anda.</li>
          <li>Anda dapat menghapus data kapan saja melalui pengaturan aplikasi.</li>
        </ul>
      </p>
    `,
};