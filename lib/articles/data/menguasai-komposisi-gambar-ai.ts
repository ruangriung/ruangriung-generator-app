import type { Article } from '@/lib/articles';

const menguasaiKomposisiGambarAi: Article = {
    slug: 'menguasai-komposisi-gambar-ai',
    title: 'Menguasai Seni Komposisi Gambar dengan AI',
    authorSlug: 'Tim RuangRiung',
    publishedDate: '2025-07-25',
    lastUpdatedDate: '2025-07-25',
    category: 'Prompt Engineering',
    tags: ['komposisi', 'prompt', 'AI Image'],
    image: '/v1/img/ruangriung.webp',
    description: 'Lebih dari sekadar subjek, komposisi adalah kunci visual yang memukau. Pelajari cara mengarahkan AI untuk menggunakan shot, angle, dan pencahayaan layaknya seorang sutradara profesional.',
    content: `
      <p class="mb-4">
        Banyak pengguna AI generator fokus pada "apa" yang ada di dalam gambar, namun seringkali melupakan "bagaimana" gambar itu disajikan. Padahal, komposisi, sudut pandang (angle), dan pencahayaan adalah elemen kunci yang membedakan gambar biasa dengan karya seni yang luar biasa. Di RuangRiung, Anda memiliki kekuatan untuk menjadi sutradara bagi karya visual Anda.
      </p>
      <h3 class="text-xl font-bold mt-6 mb-2">1. Menentukan Jarak Pandang: Shot Size</h3>
      <p class="mb-4">
        Sama seperti di dunia film, cara Anda "membingkai" subjek sangatlah penting. Jangan hanya menulis "seorang ksatria", tapi tentukan seberapa dekat kita melihatnya. Gunakan istilah seperti:
      </p>
      <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
        <li><strong>Wide Shot:</strong> Untuk menunjukkan subjek bersama lingkungan sekitarnya secara luas. Contoh: "<em>Wide shot of a lone knight standing on a cliff overlooking a stormy sea.</em>"</li>
        <li><strong>Medium Shot:</strong> Menampilkan subjek dari pinggang ke atas, ideal untuk menunjukkan bahasa tubuh. Contoh: "<em>Medium shot of a knight drawing their sword, determined expression.</em>"</li>
        <li><strong>Close-Up:</strong> Fokus pada detail, terutama ekspresi wajah. Contoh: "<em>Close-up portrait of a knight, with a single tear rolling down their cheek.</em>"</li>
      </ul>
      <h3 class="text-xl font-bold mt-6 mb-2">2. Bermain dengan Sudut Pandang: Camera Angle</h3>
      <p class="mb-4">
        Sudut pengambilan gambar dapat mengubah psikologi sebuah gambar secara drastis. Cobalah bereksperimen dengan angle berikut di prompt Anda:
      </p>
      <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
        <li><strong>Low Angle Shot:</strong> Membuat subjek terlihat kuat, dominan, dan megah. Contoh: "<em>Low angle shot of a giant robot towering over a futuristic city.</em>"</li>
        <li><strong>High Angle Shot:</strong> Membuat subjek tampak rentan atau kecil. Contoh: "<em>High angle shot of a small boat lost in a vast, empty ocean.</em>"</li>
        <li><strong>Dutch Angle:</strong> Menciptakan perasaan tegang, tidak nyaman, atau disorientasi. Contoh: "<em>Dutch angle shot of a detective running through a chaotic, crowded market.</em>"</li>
      </ul>
      <h3 class="text-xl font-bold mt-6 mb-2">3. Mengatur Suasana dengan Pencahayaan</h3>
      <p class="mb-4">
        Pencahayaan adalah jiwa dari sebuah gambar. Gunakan kata kunci pencahayaan untuk menciptakan mood yang tepat. Di RuangRiung, Anda bisa mencoba berbagai gaya pencahayaan seperti 'Cinematic Lighting' atau 'Neon' dari panel pengaturan. Atau, Anda bisa memasukkannya langsung ke dalam prompt:
      </p>
      <ul class="list-disc list-inside pl-4 mt-2 space-y-1">
        <li><strong>Cinematic Lighting:</strong> Untuk tampilan dramatis dan berkualitas tinggi seperti di film.</li>
        <li><strong>Rim Light:</strong> Menciptakan garis cahaya tipis di sekitar subjek, memisahkannya dari latar belakang.</li>
        <li><strong>Golden Hour:</strong> Memberikan cahaya hangat dan lembut yang ideal untuk pemandangan indah atau potret.</li>
      </ul>
      <p>Dengan menggabungkan instruksi subjek, shot size, angle, dan pencahayaan, Anda tidak lagi hanya sekadar "meminta" gambar, tetapi Anda "mengarahkan" sebuah adegan. Selamat mencoba menjadi sutradara AI Anda sendiri!</p>
    `
,
};
export default menguasaiKomposisiGambarAi;