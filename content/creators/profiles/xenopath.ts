import { defineCreator } from '../schema';

export default defineCreator({
  name: 'Xenopath',
  role: 'Admin',
  description:
    'Kurator visual yang rajin berbagi preset dan referensi gaya sehingga ide liar komunitas bisa diwujudkan jadi gambar.',
  bio: 'Xenopath fokus mengembangkan referensi visual dan preset yang siap dipakai oleh kreator pemula maupun senior. Ia aktif memberi review karya dan memetakan gaya visual yang sedang tren di komunitas.',
  availability:
    'Siap membantu workshop visual, review prompt, dan kolaborasi moodboard.',
  location: 'Indonesia',
  imageUrl: '/author/img/xenopath.jpg',
  specialties: ['Kurasi Prompt', 'Eksperimen Visual', 'Mentor Komunitas'],
  socials: {
    facebook: 'https://web.facebook.com/xenopati',
  },
  highlights: [
    'Mengumpulkan referensi gaya visual untuk mempercepat proses eksplorasi kreator baru.',
    'Menyiapkan preset pencahayaan dan color grading yang bisa langsung diadaptasi pada berbagai model.',
    'Mereview karya komunitas dengan catatan teknis yang mudah dipahami dan diterapkan.',
  ],
  portfolio: [
    {
      title: 'Library Preset Visual',
      description:
        'Mengembangkan kumpulan preset dan contoh prompt yang memudahkan kreator menemukan mood yang tepat.',
    },
    {
      title: 'Sesi Bedah Karya Komunitas',
      description:
        'Memimpin sesi kritik konstruktif untuk membantu kreator mengidentifikasi kekuatan dan area pengembangan.',
    },
    {
      title: 'Referensi Gaya Mingguan',
      description:
        'Mengkurasi update gaya visual populer agar komunitas selalu punya inspirasi baru untuk eksperimen.',
    },
  ],
});
