import { defineCreator } from '../schema';

export default defineCreator({
  name: 'Mahidara Ratri',
  role: 'Admin',
  description:
    'Meracik panduan teknis bertahap yang membuat pembelajaran AI generator jadi lebih mudah diikuti oleh siapa saja.',
  bio: 'Mahidara merancang panduan teknis yang sabar dan terstruktur. Ia memecah konsep rumit menjadi langkah sederhana sehingga setiap orang bisa mencoba tanpa rasa takut.',
  availability:
    'Terbuka untuk menulis tutorial, membuat modul onboarding, dan sesi belajar privat.',
  location: 'Indonesia',
  imageUrl: '/author/img/mahidara.jpg',
  specialties: ['Panduan Teknis', 'Eksperimen Model', 'Pembelajaran'],
  socials: {
    facebook: 'https://web.facebook.com/ruth.andanasari',
  },
  highlights: [
    'Menghasilkan panduan teknis berformat carousel dan PDF yang mudah diikuti.',
    'Mengadakan sesi belajar kecil untuk menguji kejelasan tutorial secara langsung.',
    'Mendokumentasikan eksperimen model AI untuk referensi komunitas.',
  ],
  portfolio: [
    {
      title: 'Tutorial Langkah Demi Langkah',
      description:
        'Menyusun tutorial dengan struktur bertahap untuk berbagai tools AI yang digunakan komunitas.',
    },
    {
      title: 'Modul Onboarding Kreator',
      description:
        'Membantu kreator baru memahami ekosistem RuangRiung melalui modul onboarding yang ringkas.',
    },
    {
      title: 'Eksperimen Model AI',
      description:
        'Mendokumentasikan hasil eksperimen model untuk memperluas referensi prompt dan gaya.',
    },
  ],
});
