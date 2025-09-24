import type { Metadata } from 'next';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  MessageSquare,
  IdCard,
  LayoutGrid,
  Users,
  MonitorPlay,
  Wand2,
  Lightbulb,
  Megaphone,
  Palette,
  Newspaper,
  Flame,
  Facebook,
} from 'lucide-react';
import { AdBanner } from '@/components/AdBanner';

export const metadata: Metadata = {
  title: 'Rekomendasi Tools AI & Konten - RuangRiung',
  description:
    'Jelajahi kurasi tools dan konten RuangRiung untuk membantu proses kreatifmu: generator AI, sumber inspirasi, hingga ruang kolaborasi komunitas.',
  keywords: [
    'rekomendasi tools AI',
    'ruangriung tools',
    'generator AI Indonesia',
    'inspirasi konten',
    'komunitas kreator',
  ],
  alternates: {
    canonical: '/rekomendasi-tools',
  },
  openGraph: {
    title: 'Rekomendasi Tools AI & Konten - RuangRiung',
    description:
      'Temukan rangkuman tools dan konten terbaik RuangRiung untuk mempercepat workflow kreatifmu.',
    url: 'https://ruangriung.my.id/rekomendasi-tools',
    siteName: 'RuangRiung AI Generator',
    images: [
      {
        url: 'https://www.ruangriung.my.id/assets/ruangriung.png',
        width: 1200,
        height: 630,
        alt: 'Kurasi Tools RuangRiung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rekomendasi Tools AI & Konten - RuangRiung',
    description:
      'Rangkuman generator AI, konten inspiratif, dan kanal kolaborasi untuk komunitas RuangRiung.',
    images: ['https://www.ruangriung.my.id/assets/ruangriung.png'],
  },
};

type ToolItem = {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge: string;
};

type ToolSection = {
  title: string;
  description: string;
  icon: LucideIcon;
  items: ToolItem[];
};

const toolSections: ToolSection[] = [
  {
    title: 'Generator & Otomasi AI',
    description:
      'Bangun visual, konsep, dan ide dengan cepat menggunakan alat-alat generatif yang disiapkan khusus untuk komunitas.',
    icon: Sparkles,
    items: [
      {
        name: 'StoryTeller AI',
        description:
          'Susun lima frame cerita sekaligus dengan narasi otomatis. Cocok untuk komik pendek, storyboard, atau konten edukasi.',
        href: '/storyteller',
        icon: BookOpen,
        badge: 'Narasi Visual',
      },
      {
        name: 'Video Prompt Lab',
        description:
          'Racik ide video dalam hitungan menit. Kumpulan kata kunci siap pakai membantu proses brainstorming sebelum produksi.',
        href: '/video-prompt',
        icon: MonitorPlay,
        badge: 'Ide Video',
      },
      {
        name: 'Unique Art Name',
        description:
          'Cari nama tema dan gaya unik agar karya AI-mu terasa konsisten dan mudah diingat audiens.',
        href: '/UniqueArtName',
        icon: Wand2,
        badge: 'Penamaan Tema',
      },
    ],
  },
  {
    title: 'Perlengkapan Kreator & Branding',
    description:
      'Lengkapi kebutuhan identitas dan materi pendukung konten supaya tampil profesional di setiap kanal.',
    icon: Palette,
    items: [
      {
        name: 'ID Card Generator',
        description:
          'Buat kartu identitas digital dalam sekali klik. Praktis sebagai kartu nama virtual atau profil event daring.',
        href: '/id-card-generator',
        icon: IdCard,
        badge: 'Brand Kit',
      },
      {
        name: 'Bubble Komentar',
        description:
          'Konversi komentar favorit menjadi overlay PNG transparan untuk video, poster, atau konten testimoni.',
        href: '/comment-overlay',
        icon: MessageSquare,
        badge: 'Social Proof',
      },
      {
        name: 'Konten Kreator Showcase',
        description:
          'Bangun etalase karya di RuangRiung dan jangkau peluang kolaborasi baru lewat katalog kreator.',
        href: '/konten-kreator',
        icon: Users,
        badge: 'Kolaborasi',
      },
    ],
  },
  {
    title: 'Inspirasi Prompt & Pembelajaran',
    description:
      'Tetap update dengan referensi prompt, artikel, dan agenda komunitas untuk mempertajam strategi kontenmu.',
    icon: BookOpen,
    items: [
      {
        name: 'Kumpulan Prompt',
        description:
          'Telusuri ratusan template prompt siap pakai untuk berbagai gaya gambar dan kebutuhan storytelling.',
        href: '/kumpulan-prompt',
        icon: LayoutGrid,
        badge: 'Prompt Library',
      },
      {
        name: 'Artikel & Tutorial',
        description:
          'Pelajari tren terbaru, tips produksi, hingga liputan event melalui artikel pilihan tim RuangRiung.',
        href: '/artikel',
        icon: Newspaper,
        badge: 'Wawasan',
      },
      {
        name: 'Battle Ignite Friendship',
        description:
          'Ikuti rangkuman kompetisi kreatif komunitas untuk mencari inspirasi tema dan standar kualitas karya.',
        href: '/battle-ignite-friendship',
        icon: Flame,
        badge: 'Event Komunitas',
      },
    ],
  },
];

type WorkflowStep = {
  title: string;
  detail: string;
  icon: LucideIcon;
};

type Workflow = {
  title: string;
  description: string;
  steps: WorkflowStep[];
};

const workflows: Workflow[] = [
  {
    title: 'Bangun Cerita Visual dari Ide hingga Publikasi',
    description:
      'Mulai dari eksplorasi prompt hingga membagikan karya final ke audiens komunitas.',
    steps: [
      {
        title: 'Cari inspirasi di Kumpulan Prompt',
        detail:
          'Gunakan filter kategori untuk menemukan template narasi yang sesuai dengan genre ceritamu.',
        icon: Lightbulb,
      },
      {
        title: 'Visualisasikan dengan StoryTeller AI',
        detail:
          'Masukkan garis besar cerita agar AI menghasilkan lima frame ilustrasi lengkap dengan deskripsi.',
        icon: Wand2,
      },
      {
        title: 'Pamerkan di Konten Kreator Showcase',
        detail:
          'Lengkapi profil dan unggah hasil karya agar mudah ditemukan calon kolaborator.',
        icon: Megaphone,
      },
    ],
  },
  {
    title: 'Perkuat Identitas Brand Personal',
    description:
      'Pastikan setiap touchpoint konsisten sebelum dibagikan ke media sosial.',
    steps: [
      {
        title: 'Definisikan gaya lewat Unique Art Name',
        detail:
          'Tentukan tone visual yang akan kamu pakai di seluruh platform agar audiens langsung mengenalinya.',
        icon: Sparkles,
      },
      {
        title: 'Siapkan kartu identitas digital',
        detail:
          'Gunakan ID Card Generator untuk membuat profil profesional sebagai pendamping bio atau landing page.',
        icon: IdCard,
      },
      {
        title: 'Tambahkan bukti sosial terbaik',
        detail:
          'Ubah testimoni menjadi aset visual dengan Bubble Komentar lalu sematkan di desain atau video.',
        icon: MessageSquare,
      },
    ],
  },
  {
    title: 'Optimalkan Konten Video Pendek',
    description:
      'Satukan ide, referensi, dan aktivasi komunitas untuk menjangkau audiens lebih luas.',
    steps: [
      {
        title: 'Riset ide dengan Video Prompt Lab',
        detail:
          'Pilih kombinasi kata kunci untuk membuka variasi konsep video reels, TikTok, atau short form lainnya.',
        icon: MonitorPlay,
      },
      {
        title: 'Pelajari strategi dari artikel terbaru',
        detail:
          'Baca insight produksi konten agar hasil eksekusi tetap relevan dengan tren AI terbaru.',
        icon: Newspaper,
      },
      {
        title: 'Ajak audiens bergabung ke komunitas',
        detail:
          'Undang penonton menuju grup Facebook RuangRiung agar diskusi dan feedback terus mengalir.',
        icon: Users,
      },
    ],
  },
];

export default function RekomendasiToolsPage() {
  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-600 shadow-neumorphic-button transition hover:-translate-y-0.5 hover:bg-purple-50 dark:border-purple-800 dark:bg-gray-900 dark:text-purple-300 dark:shadow-dark-neumorphic-button"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <span className="hidden rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-purple-600 dark:border-purple-700 dark:bg-purple-900/40 dark:text-purple-200 sm:inline-flex">
            Kurasi terbaru
          </span>
        </div>

        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 p-8 text-white shadow-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
                <Sparkles className="h-4 w-4" />
                Direkomendasikan komunitas
              </span>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                Temukan Tools AI & Konten untuk Workflow Kreatifmu
              </h1>
              <p className="max-w-2xl text-base text-white/90 sm:text-lg">
                Halaman ini merangkum fitur-fitur favorit RuangRiung yang saling terhubung. Gunakan sebagai peta perjalanan ketika kamu ingin merencanakan produksi konten, membangun brand, atau sekadar mencari ide baru.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl bg-white/10 p-6 text-sm backdrop-blur">
              <p className="font-semibold uppercase tracking-wide text-white/70">Mengapa kami memilihnya?</p>
              <ul className="mt-3 space-y-2 text-white/80">
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4" />
                  <span>Terintegrasi dengan konten dan komunitas RuangRiung.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4" />
                  <span>Mendukung proses riset, produksi, hingga distribusi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4" />
                  <span>Siap dipakai gratis oleh seluruh anggota komunitas.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {toolSections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <section key={section.title} className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
                  <SectionIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{section.title}</h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 sm:text-base">{section.description}</p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {section.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group relative block overflow-hidden rounded-3xl border border-purple-100 bg-white p-6 shadow-neumorphic transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-900/60 dark:shadow-dark-neumorphic"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 transition-colors duration-200 group-hover:bg-purple-600 group-hover:text-white dark:bg-purple-900/50 dark:text-purple-300">
                            <ItemIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wide text-purple-500 dark:text-purple-300">
                              {item.badge}
                            </span>
                            <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{item.name}</h3>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-purple-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-purple-500 dark:text-purple-500 dark:group-hover:text-purple-300" />
                      </div>
                      <p className="mt-4 text-sm text-gray-600 transition-colors duration-200 group-hover:text-gray-700 dark:text-gray-300 dark:group-hover:text-gray-200">
                        {item.description}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 transition-colors duration-200 group-hover:text-purple-700 dark:text-purple-300 dark:group-hover:text-purple-200">
                        Jelajahi sekarang
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        <div className="rounded-3xl border border-dashed border-purple-200 bg-white/70 p-6 shadow-neumorphic dark:border-purple-800 dark:bg-gray-900/60 dark:shadow-dark-neumorphic">
          <AdBanner dataAdSlot="6897039624" />
        </div>

        <section className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
              <Lightbulb className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Rangkai Tools Jadi Workflow Andal
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                Gunakan contoh alur berikut sebagai titik awal. Kamu bebas memodifikasi sesuai gaya dan kebutuhan kontenmu.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {workflows.map((workflow) => (
              <div
                key={workflow.title}
                className="rounded-3xl border border-purple-100 bg-white p-6 shadow-neumorphic dark:border-gray-700 dark:bg-gray-900/60 dark:shadow-dark-neumorphic"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {workflow.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                  {workflow.description}
                </p>

                <div className="mt-6 space-y-4">
                  {workflow.steps.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={step.title} className="flex gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
                          <StepIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 sm:text-base">
                            {index + 1}. {step.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {step.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-purple-200 bg-white p-8 shadow-neumorphic dark:border-purple-800 dark:bg-gray-900/60 dark:shadow-dark-neumorphic">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Aktif di Komunitas untuk Dukungan Berkelanjutan
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                Diskusikan ide, bagikan hasil karyamu, dan dapatkan umpan balik langsung dari sesama kreator RuangRiung. Kami selalu terbuka untuk kolaborasi dan cerita sukses terbaru.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.facebook.com/groups/1182261482811767/?ref=share&mibextid=lOuIew"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
                >
                  <Facebook className="h-4 w-4" />
                  Gabung Grup Facebook
                </a>
                <Link
                  href="/kontak"
                  className="inline-flex items-center gap-2 rounded-full border border-purple-200 px-5 py-2 text-sm font-semibold text-purple-600 transition hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/40"
                >
                  <MessageSquare className="h-4 w-4" />
                  Hubungi Tim RuangRiung
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/80 p-6 text-sm text-purple-700 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-200">
              <p className="font-semibold">Tips cepat:</p>
              <ul className="mt-3 space-y-2">
                <li>📌 Simpan halaman ini sebagai referensi workflow favoritmu.</li>
                <li>🗓️ Cek artikel terbaru minimal seminggu sekali untuk update tren.</li>
                <li>💬 Jangan ragu meminta review karya di grup sebelum dipublikasikan.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
