import { defineCreator } from '../schema';

export default defineCreator({
  name: 'Dery Lau',
  role: 'Admin',
  description:
    'Berbagi tips editing dan workflow sehingga anggota baru cepat percaya diri menyelesaikan proyek visual mereka.',
  bio: 'Dery memecah proses editing dan lighting menjadi langkah mudah diikuti. Ia rajin membuat template workflow supaya kreator bisa fokus berkreasi tanpa tersesat pada detail teknis.',
  availability:
    'Siap bekerja sama untuk kelas editing, konsultasi workflow, dan review portofolio.',
  location: 'Indonesia',
  imageUrl: '/author/img/dery-lau.jpg',
  specialties: ['Workflow Kreatif', 'Eksperimen Lighting', 'Pendampingan'],
  socials: {
    facebook: 'https://web.facebook.com/dery.megana',
    website: 'https://www.derylau.my.id/',
  },
  highlights: [
    'Menyediakan template workflow yang membantu kreator menjaga konsistensi kualitas.',
    'Membimbing eksperimen pencahayaan melalui demo langsung dan studi kasus.',
    'Memberikan review portofolio dengan fokus pada efisiensi produksi konten.',
  ],
  portfolio: [
    {
      title: 'Template Workflow Editing',
      description:
        'Membuat template editing modular untuk proyek video pendek, kampanye brand, dan konten edukasi.',
    },
    {
      title: 'Clinic Lighting Komunitas',
      description:
        'Mengadakan sesi klinik pencahayaan untuk membantu kreator memahami karakter cahaya.',
    },
    {
      title: 'Review Portofolio Personal',
      description:
        'Memberikan umpan balik mendalam pada portofolio kreator agar siap ditawarkan ke klien.',
    },
  ],
});
