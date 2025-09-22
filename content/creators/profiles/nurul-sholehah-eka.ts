import { defineCreator } from '../schema';

export default defineCreator({
  name: 'Nurul Sholehah Eka',
  role: 'Admin',
  description:
    'Penulis tutorial yang telaten mendokumentasikan langkah demi langkah agar semua orang bisa mencoba hal baru setiap hari.',
  bio: 'Nurul menuliskan pengalaman eksperimen hariannya menjadi catatan yang bisa diikuti kreator lain. Ia menekankan dokumentasi rinci supaya proses belajar terasa ringan dan menyenangkan.',
  availability:
    'Terbuka untuk kolaborasi penulisan panduan, dokumentasi produk, dan workshop mini.',
  location: 'Indonesia',
  imageUrl: '/author/img/uul.jpg',
  specialties: ['Penulisan Tutorial', 'Eksperimen Harian', 'Dukungan Anggota'],
  socials: {
    facebook: 'https://web.facebook.com/uul.aja',
  },
  highlights: [
    'Mendokumentasikan eksperimen harian agar kreator lain bisa replikasi dengan mudah.',
    'Menyediakan template catatan eksperimen untuk membantu anggota menjaga progres.',
    'Menjawab pertanyaan teknis dengan gaya bahasa yang ramah dan sabar.',
  ],
  portfolio: [
    {
      title: 'Jurnal Eksperimen Harian',
      description:
        'Menulis jurnal eksperimen yang merangkum parameter, hasil, dan catatan pembelajaran.',
    },
    {
      title: 'Panduan Quickstart Tools',
      description:
        'Membuat panduan quickstart untuk berbagai tools AI yang sering dipakai komunitas.',
    },
    {
      title: 'Sesi Dukungan One-on-One',
      description:
        'Memberikan bantuan personal bagi anggota yang membutuhkan penjelasan tambahan.',
    },
  ],
});
