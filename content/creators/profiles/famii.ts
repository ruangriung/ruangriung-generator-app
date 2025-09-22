import { defineCreator } from '../schema';

export default defineCreator({
  name: 'Famii',
  role: 'Admin',
  description:
    'Storyteller yang senang memadukan narasi dan visual; karyanya sering jadi inspirasi kolaborasi lintas kreator.',
  bio: 'Famii mengembangkan gaya storytelling yang menyatukan visual dan narasi emosional. Ia membantu kreator lain menerjemahkan konsep abstrak menjadi cerita yang mudah diingat audiens.',
  availability:
    'Terbuka untuk kolaborasi storytelling, produksi konten kampanye, dan sesi brainstorming.',
  location: 'Indonesia',
  imageUrl: '/author/img/famii.jpg',
  specialties: ['Storytelling', 'Kolaborasi', 'Eksperimen Karakter'],
  socials: {
    facebook: 'https://web.facebook.com/nengayu.hong',
  },
  highlights: [
    'Menggagas sesi kolaborasi lintas disiplin untuk memadukan naskah, visual, dan sound design.',
    'Menyusun kerangka cerita pendek yang siap dipakai kreator untuk konten episodik.',
    'Mendorong komunitas untuk mendokumentasikan proses kreatif sebagai aset storytelling.',
  ],
  portfolio: [
    {
      title: 'Seri Narasi Komunitas',
      description:
        'Menyusun cerita berseri yang menampilkan perjalanan kreator RuangRiung secara humanis.',
    },
    {
      title: 'Workshop Story Framework',
      description:
        'Mengajarkan kerangka storytelling agar ide liar bisa dirapikan menjadi konten yang terstruktur.',
    },
    {
      title: 'Kolaborasi Visual + Narasi',
      description:
        'Bekerja sama dengan kreator visual untuk menghadirkan konten kampanye yang konsisten.',
    },
  ],
});
