import { defineCreator } from '../schema';

export default defineCreator({
  name: 'Yogi Arfianto',
  role: 'Admin',
  description:
    'Menjaga percakapan komunitas tetap hangat sambil merangkum tips teknis agar tiap kreator cepat menemukan gaya uniknya.',
  bio: 'Yogi memastikan setiap diskusi di RuangRiung berlangsung ramah dan produktif. Ia merangkum insight terbaik komunitas menjadi panduan singkat yang membantu kreator mengatasi hambatan teknis.',
  availability:
    'Terbuka untuk modul bimbingan komunitas, sesi tanya jawab, dan kolaborasi edukasi.',
  location: 'Indonesia',
  imageUrl: '/author/img/yogi-profil.jpg',
  specialties: ['Moderasi Komunitas', 'Tutorial Cepat', 'Eksperimen Gaya'],
  socials: {
    facebook: 'https://web.facebook.com/yogee.krib',
  },
  highlights: [
    'Menyusun rangkuman diskusi teknis menjadi catatan singkat yang mudah dibagikan.',
    'Mengelola sesi live Q&A untuk menjawab kendala kreator secara real time.',
    'Menjaga kultur komunitas agar kolaborasi berlangsung suportif dan inklusif.',
  ],
  portfolio: [
    {
      title: 'Digest Tips Komunitas',
      description:
        'Mengubah diskusi maraton menjadi rangkuman praktis berisi checklist langkah demi langkah.',
    },
    {
      title: 'Sesi Tanya Jawab Mingguan',
      description:
        'Memfasilitasi Q&A tematik sehingga anggota bisa mendapatkan solusi teknis tanpa menunggu lama.',
    },
    {
      title: 'Program Buddy Kreator',
      description:
        'Memasangkan kreator baru dengan mentor komunitas untuk mempercepat adaptasi dan eksplorasi.',
    },
  ],
});
