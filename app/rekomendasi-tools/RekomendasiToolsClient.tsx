'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Lightbulb,
  Palette,
  Users,
  Wand2,
  LayoutGrid,
  MonitorPlay,
  PenSquare,
  Megaphone,
  MessageSquare,
  BookOpen,
  Bot,
  Brain,
  Rocket,
  Target,
  Gauge,
  Calendar,
  Compass,
  Video,
  Clipboard,
  ClipboardCheck,
} from 'lucide-react';
import { AdBanner } from '@/components/AdBanner';

const iconMap = {
  sparkles: Sparkles,
  lightbulb: Lightbulb,
  palette: Palette,
  users: Users,
  wand: Wand2,
  layoutGrid: LayoutGrid,
  monitor: MonitorPlay,
  pen: PenSquare,
  megaphone: Megaphone,
  message: MessageSquare,
  book: BookOpen,
  bot: Bot,
  brain: Brain,
  rocket: Rocket,
  target: Target,
  gauge: Gauge,
  calendar: Calendar,
  compass: Compass,
  video: Video,
} as const;

type IconKey = keyof typeof iconMap;

type GoalId = 'visual-story' | 'brand' | 'video' | 'community';
type FocusArea = 'ideation' | 'visual' | 'video' | 'branding' | 'community';
type Tempo = 'cepat' | 'santai' | 'mendalam';
type ExperienceLevel = 'pemula' | 'menengah' | 'mahir';
type ToolId =
  | 'kumpulanPrompt'
  | 'storyteller'
  | 'videoPromptLab'
  | 'uniqueArtName'
  | 'idCardGenerator'
  | 'bubbleKomentar'
  | 'kontenKreator'
  | 'artikel'
  | 'facebookCommunity';

type GoalOption = {
  id: GoalId;
  title: string;
  description: string;
  icon: IconKey;
  aiFocus: string;
  subline: string;
};

type FocusOption = {
  id: FocusArea;
  title: string;
  description: string;
  icon: IconKey;
};

type TempoOption = {
  id: Tempo;
  label: string;
  description: string;
  icon: IconKey;
};

type ExperienceOption = {
  id: ExperienceLevel;
  label: string;
  description: string;
  icon: IconKey;
};

type Tool = {
  id: ToolId;
  name: string;
  href: string;
  description: string;
  icon: IconKey;
  highlights: string[];
  goals: GoalId[];
  focus: FocusArea[];
  levels: ExperienceLevel[];
  tempos: Tempo[];
  aiAssists: string[];
  output: string;
  isExternal?: boolean;
};

type PlanTemplate = {
  title: string;
  description: string;
  steps: {
    title: string;
    detail: string;
    icon: IconKey;
    toolId?: ToolId;
  }[];
};

const goalOptions: GoalOption[] = [
  {
    id: 'visual-story',
    title: 'Bangun Cerita Visual',
    description: 'Susun storyboard dan ilustrasi generatif dari ide mentah.',
    icon: 'sparkles',
    aiFocus: 'Narasi & gambar AI multi-frame',
    subline: 'Cocok untuk komik pendek, konten edukasi visual, dan pitch deck kreatif.',
  },
  {
    id: 'brand',
    title: 'Perkuat Identitas Brand',
    description: 'Kembangkan gaya, aset, dan bukti sosial agar tampil profesional.',
    icon: 'palette',
    aiFocus: 'Penamaan gaya dan otomasi aset pendukung',
    subline: 'Ideal untuk kreator mandiri dan studio kecil yang ingin konsisten di semua kanal.',
  },
  {
    id: 'video',
    title: 'Optimalkan Konten Video Pendek',
    description: 'Bangun ide, script, dan visual bantu untuk reels, TikTok, atau Shorts.',
    icon: 'video',
    aiFocus: 'Generasi hook, shot list, dan storyboard AI',
    subline: 'Pilih jika kamu mengejar engagement tinggi lewat format video singkat.',
  },
  {
    id: 'community',
    title: 'Aktifkan Komunitas & Edukasi',
    description: 'Kurasi konten dan ruang diskusi agar audiens tetap terlibat.',
    icon: 'users',
    aiFocus: 'Distribusi konten berbasis insight komunitas',
    subline: 'Pas untuk fasilitator workshop, mentor, dan pengelola komunitas digital.',
  },
];

const focusOptions: FocusOption[] = [
  {
    id: 'ideation',
    title: 'Riset Ide & Prompt',
    description: 'Butuh template untuk memulai eksperimen AI.',
    icon: 'lightbulb',
  },
  {
    id: 'visual',
    title: 'Visual & Storyboard AI',
    description: 'Prioritas pada ilustrasi dan storytelling generatif.',
    icon: 'sparkles',
  },
  {
    id: 'video',
    title: 'Video Pendek & Script',
    description: 'Fokus mengoptimalkan konten video singkat.',
    icon: 'monitor',
  },
  {
    id: 'branding',
    title: 'Branding & Aset',
    description: 'Perlu identitas dan materi pendukung konsisten.',
    icon: 'palette',
  },
  {
    id: 'community',
    title: 'Komunitas & Distribusi',
    description: 'Menjaga interaksi dan kolaborasi audiens.',
    icon: 'megaphone',
  },
];

const tempoOptions: TempoOption[] = [
  {
    id: 'cepat',
    label: 'Sprint (< 1 jam)',
    description: 'Butuh hasil cepat untuk konten harian atau eksperimen singkat.',
    icon: 'rocket',
  },
  {
    id: 'santai',
    label: 'Seimbang (1-2 jam)',
    description: 'Waktu ideal untuk iterasi ringan dan review singkat.',
    icon: 'gauge',
  },
  {
    id: 'mendalam',
    label: 'Mendalam (3+ jam)',
    description: 'Siap memetakan kampanye lengkap dengan beberapa revisi.',
    icon: 'calendar',
  },
];

const experienceOptions: ExperienceOption[] = [
  {
    id: 'pemula',
    label: 'Pemula',
    description: 'Baru mencoba AI, perlu panduan dan template siap pakai.',
    icon: 'target',
  },
  {
    id: 'menengah',
    label: 'Menengah',
    description: 'Sudah paham dasar dan ingin workflow lebih efisien.',
    icon: 'brain',
  },
  {
    id: 'mahir',
    label: 'Mahir',
    description: 'Mengincar optimasi mendalam dan eksperimen lintas kanal.',
    icon: 'bot',
  },
];

const focusLabels: Record<FocusArea, string> = {
  ideation: 'Riset Prompt',
  visual: 'Visual AI',
  video: 'Video & Script',
  branding: 'Branding',
  community: 'Kolaborasi Komunitas',
};

const focusInsights: Record<FocusArea, { headline: string; detail: string; suggestion: string }> = {
  ideation: {
    headline: 'Mulai dari prompt berkualitas.',
    detail: 'Koleksi prompt RuangRiung bisa jadi fondasi sebelum kamu eksperimen di model favorit.',
    suggestion: 'Padukan 2-3 template lalu tambah kata kunci unik agar hasil AI terasa personal.',
  },
  visual: {
    headline: 'Visual AI efektif saat punya konteks.',
    detail: 'Storyboard otomatis membantu menghubungkan setiap frame sehingga ide tidak meloncat-loncat.',
    suggestion: 'Gunakan Unique Art Name untuk menjaga gaya ketika menghasilkan visual di berbagai model.',
  },
  video: {
    headline: 'Shot list jelas menghemat waktu produksi.',
    detail: 'Video Prompt Lab memetakan hook, body, dan CTA sehingga kamu tinggal fokus ke eksekusi.',
    suggestion: 'Sinkronkan storyboard StoryTeller AI dengan script dari Video Prompt Lab untuk hasil maksimal.',
  },
  branding: {
    headline: 'Identitas konsisten = audiens cepat mengenali.',
    detail: 'Nama gaya dan aset siap pakai mempercepat proses adaptasi ke banyak format.',
    suggestion: 'Simpan output Unique Art Name dan ID Card Generator sebagai brand kit dasar.',
  },
  community: {
    headline: 'Kolaborasi memperpanjang umur konten.',
    detail: 'Katalog kreator dan grup komunitas siap membantu validasi ide sekaligus distribusi.',
    suggestion: 'Bagikan progres ke grup Facebook untuk mengumpulkan feedback sebelum rilis.',
  },
};

const tempoInsights: Record<Tempo, { headline: string; detail: string }> = {
  cepat: {
    headline: 'Rencanakan sprint singkat.',
    detail: 'Prioritaskan tool dengan template siap pakai agar workflow selesai di bawah satu jam.',
  },
  santai: {
    headline: 'Sisihkan waktu untuk iterasi.',
    detail: 'Campur tool ideasi dan produksi supaya ada jeda untuk review sebelum publikasi.',
  },
  mendalam: {
    headline: 'Buat dokumentasi lengkap.',
    detail: 'Bangun catatan gaya, aset brand, dan kanal distribusi agar kampanye berjalan berkelanjutan.',
  },
};

const experienceTips: Record<ExperienceLevel, { headline: string; detail: string }> = {
  pemula: {
    headline: 'Mulai dari template siap pakai.',
    detail: 'Ikuti langkah contoh di bawah agar cepat akrab dengan ekosistem RuangRiung.',
  },
  menengah: {
    headline: 'Eksperimen dengan variasi prompt.',
    detail: 'Sesuaikan kata kunci dan gaya supaya karya makin mencerminkan karakter brand-mu.',
  },
  mahir: {
    headline: 'Standarisasi pipeline kreatif.',
    detail: 'Dokumentasikan preset favorit dan automasi distribusi lewat komunitas.',
  },
};

const goalAngles: Record<GoalId, { highlight: string; tip: string }> = {
  'visual-story': {
    highlight: 'AI membantu menerjemahkan outline cerita menjadi visual lengkap dengan narasi.',
    tip: 'Validasi setiap frame dengan audiens kecil sebelum lanjut ke produksi akhir.',
  },
  brand: {
    highlight: 'Generator gaya memastikan branding tetap konsisten di berbagai platform.',
    tip: 'Satukan hasil AI dengan aset manual agar identitas brand makin kuat.',
  },
  video: {
    highlight: 'Kombinasi script dan storyboard AI mempercepat produksi konten video singkat.',
    tip: 'Gunakan hasil storyboard sebagai referensi ketika merekam footage nyata.',
  },
  community: {
    highlight: 'Konten berbasis insight komunitas menjaga engagement tetap tinggi.',
    tip: 'Libatkan anggota untuk menentukan tema berikutnya agar partisipasi meningkat.',
  },
};

const toolLibrary: Tool[] = [
  {
    id: 'kumpulanPrompt',
    name: 'Kumpulan Prompt',
    href: '/kumpulan-prompt',
    description: 'Telusuri ratusan template prompt siap pakai untuk berbagai gaya visual dan narasi.',
    icon: 'layoutGrid',
    highlights: [
      'Filter gaya ilustrasi & video',
      'Favoritkan koleksi inspirasi pribadi',
      'Update mingguan dari komunitas',
    ],
    goals: ['visual-story', 'video', 'community'],
    focus: ['ideation'],
    levels: ['pemula', 'menengah', 'mahir'],
    tempos: ['cepat', 'santai', 'mendalam'],
    aiAssists: [
      'Menyediakan ide instan untuk eksplorasi AI',
      'Mempercepat eksperimen lintas model',
    ],
    output: 'Daftar prompt kurasi siap digunakan',
  },
  {
    id: 'storyteller',
    name: 'StoryTeller AI',
    href: '/storyteller',
    description: 'Bangun storyboard lima frame lengkap dengan deskripsi otomatis dalam sekali klik.',
    icon: 'sparkles',
    highlights: [
      'Visual generatif multi-frame',
      'Narasi otomatis per adegan',
      'Ekspor cepat untuk revisi',
    ],
    goals: ['visual-story', 'video'],
    focus: ['visual', 'video'],
    levels: ['pemula', 'menengah'],
    tempos: ['cepat', 'santai'],
    aiAssists: [
      'Mengubah outline menjadi visual storytelling',
      'Membantu validasi alur sebelum produksi',
    ],
    output: 'Storyboard AI siap dibagikan',
  },
  {
    id: 'videoPromptLab',
    name: 'Video Prompt Lab',
    href: '/video-prompt',
    description: 'Racik ide video pendek dengan perpaduan kata kunci, hook, dan CTA yang siap dieksekusi.',
    icon: 'monitor',
    highlights: [
      'Paket hook & CTA otomatis',
      'Shot list terstruktur',
      'Variasi gaya narasi',
    ],
    goals: ['video', 'visual-story'],
    focus: ['video', 'ideation'],
    levels: ['pemula', 'menengah', 'mahir'],
    tempos: ['cepat', 'santai'],
    aiAssists: [
      'Mempercepat brainstorming skrip',
      'Menjaga struktur video tetap solid',
    ],
    output: 'Outline video siap produksi',
  },
  {
    id: 'uniqueArtName',
    name: 'Unique Art Name',
    href: '/UniqueArtName',
    description: 'Temukan nama gaya unik plus rekomendasi moodboard agar brand visual tetap konsisten.',
    icon: 'palette',
    highlights: [
      'Generator nama gaya otomatis',
      'Saran palet dan moodboard',
      'Catatan penggunaan lintas platform',
    ],
    goals: ['brand', 'visual-story'],
    focus: ['branding', 'visual'],
    levels: ['pemula', 'menengah', 'mahir'],
    tempos: ['santai', 'mendalam'],
    aiAssists: [
      'Mengusulkan variasi estetika unik',
      'Menjaga identitas visual tetap seragam',
    ],
    output: 'Identitas gaya siap dokumentasi',
  },
  {
    id: 'idCardGenerator',
    name: 'ID Card Generator',
    href: '/id-card-generator',
    description: 'Buat kartu identitas digital profesional untuk portofolio dan event daring.',
    icon: 'users',
    highlights: [
      'Template multi warna siap pakai',
      'Ekspor instan untuk profil sosial',
      'Sinkron dengan brand kit AI-mu',
    ],
    goals: ['brand'],
    focus: ['branding'],
    levels: ['pemula', 'menengah'],
    tempos: ['cepat', 'santai'],
    aiAssists: [
      'Menyusun profil profesional dalam hitungan menit',
      'Memastikan konsistensi identitas lintas kanal',
    ],
    output: 'Kartu identitas siap distribusi',
  },
  {
    id: 'bubbleKomentar',
    name: 'Bubble Komentar',
    href: '/comment-overlay',
    description: 'Ubah testimoni dan komentar jadi overlay PNG transparan siap tempel di konten.',
    icon: 'message',
    highlights: [
      'Kustom warna & font fleksibel',
      'Format transparan untuk video & desain',
      'Cocok sebagai bukti sosial cepat',
    ],
    goals: ['brand', 'video', 'community'],
    focus: ['branding', 'community', 'video'],
    levels: ['pemula', 'menengah'],
    tempos: ['cepat'],
    aiAssists: [
      'Memperkuat kepercayaan pada konten AI',
      'Memicu percakapan di komunitas',
    ],
    output: 'Overlay komentar siap pakai',
  },
  {
    id: 'kontenKreator',
    name: 'Konten Kreator Showcase',
    href: '/konten-kreator',
    description: 'Bangun etalase karya dan temukan kolaborator dalam ekosistem RuangRiung.',
    icon: 'users',
    highlights: [
      'Halaman portofolio kreator',
      'Peluang kolaborasi komunitas',
      'Eksposur ke pencari talenta',
    ],
    goals: ['community', 'brand'],
    focus: ['community', 'branding'],
    levels: ['menengah', 'mahir'],
    tempos: ['santai', 'mendalam'],
    aiAssists: [
      'Memvalidasi respon audiens terhadap karya AI',
      'Membangun jejaring profesional baru',
    ],
    output: 'Profil kreator siap kolaborasi',
  },
  {
    id: 'artikel',
    name: 'Artikel & Tutorial',
    href: '/artikel',
    description: 'Pelajari strategi produksi, studi kasus, dan liputan event untuk mempertajam kemampuanmu.',
    icon: 'book',
    highlights: [
      'Kumpulan strategi konten AI',
      'Insight komunitas terbaru',
      'Panduan teknis mendalam',
    ],
    goals: ['community', 'video', 'brand'],
    focus: ['ideation', 'community'],
    levels: ['pemula', 'menengah', 'mahir'],
    tempos: ['santai', 'mendalam'],
    aiAssists: [
      'Memperbarui pengetahuan tentang tren AI',
      'Memberi referensi untuk strategi distribusi',
    ],
    output: 'Insight strategi siap diterapkan',
  },
  {
    id: 'facebookCommunity',
    name: 'Komunitas Facebook RuangRiung',
    href: 'https://www.facebook.com/groups/1182261482811767/?ref=share&mibextid=lOuIew',
    description: 'Diskusikan proyek, dapatkan feedback cepat, dan ikuti challenge rutin bersama kreator lain.',
    icon: 'megaphone',
    highlights: [
      'Sesi berbagi mingguan',
      'Feedback langsung dari anggota aktif',
      'Informasi challenge dan kolaborasi',
    ],
    goals: ['community', 'visual-story', 'video'],
    focus: ['community'],
    levels: ['pemula', 'menengah', 'mahir'],
    tempos: ['santai', 'mendalam'],
    aiAssists: [
      'Memvalidasi ide sebelum dipublikasikan',
      'Mengumpulkan dataset testimoni organik',
    ],
    output: 'Forum diskusi aktif untuk eksperimen AI',
    isExternal: true,
  },
];

const toolMap: Record<ToolId, Tool> = toolLibrary.reduce((acc, tool) => {
  acc[tool.id] = tool;
  return acc;
}, {} as Record<ToolId, Tool>);

const planTemplates: Record<GoalId, PlanTemplate> = {
  'visual-story': {
    title: 'Workflow Cerita Visual',
    description: 'Mulai dari riset prompt hingga mempublikasikan storyboard ke komunitas.',
    steps: [
      {
        title: 'Eksplor inspirasi',
        detail: 'Pilih 2-3 template di Kumpulan Prompt sebagai fondasi cerita.',
        icon: 'layoutGrid',
        toolId: 'kumpulanPrompt',
      },
      {
        title: 'Tetapkan gaya visual',
        detail: 'Gunakan Unique Art Name untuk memilih nama gaya dan moodboard referensi.',
        icon: 'palette',
        toolId: 'uniqueArtName',
      },
      {
        title: 'Bangun storyboard AI',
        detail: 'Masukkan outline ke StoryTeller AI dan iterasi hingga alur terasa solid.',
        icon: 'sparkles',
        toolId: 'storyteller',
      },
      {
        title: 'Bagikan untuk review',
        detail: 'Publikasikan ke Konten Kreator Showcase atau grup komunitas untuk feedback.',
        icon: 'users',
        toolId: 'kontenKreator',
      },
    ],
  },
  brand: {
    title: 'Workflow Identitas Brand',
    description: 'Satukan gaya visual, aset pendukung, dan bukti sosial untuk tampil profesional.',
    steps: [
      {
        title: 'Definisikan gaya utama',
        detail: 'Riset kombinasi nama gaya di Unique Art Name sebagai fondasi brand kit.',
        icon: 'palette',
        toolId: 'uniqueArtName',
      },
      {
        title: 'Siapkan profil profesional',
        detail: 'Buat kartu identitas digital serasi lewat ID Card Generator.',
        icon: 'users',
        toolId: 'idCardGenerator',
      },
      {
        title: 'Kumpulkan bukti sosial',
        detail: 'Konversi testimoni menjadi aset visual dengan Bubble Komentar.',
        icon: 'message',
        toolId: 'bubbleKomentar',
      },
      {
        title: 'Sebarkan di kanal komunitas',
        detail: 'Tampilkan aset brand di Konten Kreator Showcase untuk membuka kolaborasi.',
        icon: 'users',
        toolId: 'kontenKreator',
      },
    ],
  },
  video: {
    title: 'Workflow Video Pendek',
    description: 'Padukan script AI, storyboard, dan distribusi komunitas.',
    steps: [
      {
        title: 'Racik konsep & hook',
        detail: 'Gunakan Video Prompt Lab untuk membuat script dan shot list.',
        icon: 'monitor',
        toolId: 'videoPromptLab',
      },
      {
        title: 'Visualisasikan storyboard',
        detail: 'Bangun referensi visual cepat dengan StoryTeller AI.',
        icon: 'sparkles',
        toolId: 'storyteller',
      },
      {
        title: 'Perkuat pesan',
        detail: 'Ambil insight produksi terbaru dari Artikel & Tutorial.',
        icon: 'book',
        toolId: 'artikel',
      },
      {
        title: 'Aktifkan distribusi komunitas',
        detail: 'Bagikan teaser ke Komunitas Facebook RuangRiung untuk mendapatkan feedback awal.',
        icon: 'megaphone',
        toolId: 'facebookCommunity',
      },
    ],
  },
  community: {
    title: 'Workflow Aktivasi Komunitas',
    description: 'Kurasi konten edukasi dan fasilitasi diskusi interaktif.',
    steps: [
      {
        title: 'Petakan kebutuhan audiens',
        detail: 'Gunakan Artikel & Tutorial untuk menentukan topik yang sedang hangat.',
        icon: 'book',
        toolId: 'artikel',
      },
      {
        title: 'Siapkan materi visual',
        detail: 'Ambil template prompt relevan di Kumpulan Prompt sebagai materi pelatihan.',
        icon: 'layoutGrid',
        toolId: 'kumpulanPrompt',
      },
      {
        title: 'Bangun ruang showcase',
        detail: 'Dorong peserta memamerkan karya di Konten Kreator Showcase.',
        icon: 'users',
        toolId: 'kontenKreator',
      },
      {
        title: 'Lanjutkan diskusi hangat',
        detail: 'Arahkan obrolan ke Komunitas Facebook untuk menjaga momentum.',
        icon: 'megaphone',
        toolId: 'facebookCommunity',
      },
    ],
  },
};

const promptSuggestions: Record<GoalId, string[]> = {
  'visual-story': [
    'Ciptakan 5 panel komik tentang "mentor AI" yang membantu murid menemukan gaya gambar mereka.',
    'Storyboard workshop hybrid yang menggabungkan sesi daring dan tatap muka dengan visual futuristik ramah komunitas.',
    'Ilustrasikan perjalanan produk dari sketsa hingga launching menggunakan gaya majalah retro futurism.',
  ],
  brand: [
    'Susun brand kit untuk studio kreatif yang spesialis AI fashion dengan tone warna neon pastel.',
    'Buat narasi testimoni pelanggan yang menggambarkan transformasi bisnis setelah memakai jasa kreator AI.',
    'Rancang seri konten carousel tentang "aturan visual" brand komunitas dengan gaya editorial minimalis.',
  ],
  video: [
    'Tuliskan script reels 45 detik tentang tantangan membuat video AI dalam 24 jam.',
    'Bangun konsep teaser video edukasi dengan struktur hook-problem-solution dan CTA komunitas.',
    'Susun ide behind the scene menggunakan format vlog cepat dengan highlight proses AI generation.',
  ],
  community: [
    'Rancang sesi belajar bareng bertema "AI untuk UMKM" dengan aktivitas kolaboratif selama 60 menit.',
    'Buat rangkaian konten challenge mingguan yang memadukan prompt visual dan refleksi komunitas.',
    'Susun agenda onboarding anggota baru lengkap dengan template materi yang bisa dikustom.',
  ],
};

export default function RekomendasiToolsClient() {
  const [goal, setGoal] = useState<GoalId>('visual-story');
  const [tempo, setTempo] = useState<Tempo>('cepat');
  const [experience, setExperience] = useState<ExperienceLevel>('pemula');
  const [selectedFocus, setSelectedFocus] = useState<Set<FocusArea>>(new Set(['ideation', 'visual']));
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const focusList = useMemo(() => Array.from(selectedFocus), [selectedFocus]);

  const selectedGoal = goalOptions.find((option) => option.id === goal) ?? goalOptions[0];
  const selectedTempo = tempoOptions.find((option) => option.id === tempo) ?? tempoOptions[0];
  const selectedExperience =
    experienceOptions.find((option) => option.id === experience) ?? experienceOptions[0];
  const primaryFocus = (focusList[0] ?? 'ideation') as FocusArea;

  const focusInsight = focusInsights[primaryFocus];
  const tempoInsight = tempoInsights[tempo];
  const experienceTip = experienceTips[experience];
  const goalAngle = goalAngles[goal];
  const planTemplate = planTemplates[goal];
  const prompts = promptSuggestions[goal];

  const recommendedTools = useMemo(() => {
    return toolLibrary
      .map((tool) => {
        let score = 0;
        let matchCount = 0;
        if (tool.goals.includes(goal)) {
          score += 4;
          matchCount += 1;
        }
        if (tool.tempos.includes(tempo)) {
          score += 1.5;
        }
        if (tool.levels.includes(experience)) {
          score += 1.5;
        }
        if (focusList.length === 0) {
          score += 1;
        } else {
          const matches = focusList.filter((focus) => tool.focus.includes(focus as FocusArea)).length;
          if (matches > 0) {
            score += matches * 2.5;
            matchCount += matches;
          }
        }

        return { ...tool, score, matchCount };
      })
      .filter((tool) => tool.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [experience, focusList, goal, tempo]);

  const focusSummary = focusList.length
    ? focusList.map((item) => focusLabels[item as FocusArea]).join(', ')
    : 'Eksplorasi lintas kebutuhan';

  const planSummary = useMemo(() => {
    const toolLines = recommendedTools
      .map((tool, index) => `${index + 1}. ${tool.name} — ${tool.output}`)
      .join('\n');
    const stepLines = planTemplate.steps
      .map((step, index) => {
        const relatedTool = step.toolId ? toolMap[step.toolId] : undefined;
        const toolLabel = relatedTool ? ` (${relatedTool.name})` : '';
        return `${index + 1}. ${step.title}${toolLabel} — ${step.detail}`;
      })
      .join('\n');

    return [
      `🎯 Tujuan: ${selectedGoal.title}`,
      `🧭 Fokus: ${focusSummary}`,
      `⚡ Tempo: ${selectedTempo.label}`,
      `🎓 Level: ${selectedExperience.label}`,
      '',
      '🔧 Tool unggulan:',
      toolLines || 'Masih menunggu kamu memilih fokus agar rekomendasi muncul.',
      '',
      '🛠️ Langkah disarankan:',
      stepLines,
    ].join('\n');
  }, [focusSummary, planTemplate, recommendedTools, selectedExperience, selectedGoal, selectedTempo]);

  const toggleFocus = (focus: FocusArea) => {
    setSelectedFocus((prev) => {
      const next = new Set(prev);
      if (next.has(focus)) {
        next.delete(focus);
      } else {
        next.add(focus);
      }
      return next;
    });
  };

  const handleCopyPlan = async () => {
    try {
      await navigator.clipboard.writeText(planSummary);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2200);
    } catch (error) {
      console.error('Failed to copy plan', error);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2200);
    }
  };

  const CopyIcon = copyStatus === 'copied' ? ClipboardCheck : Clipboard;
  const copyLabel = copyStatus === 'copied' ? 'Rencana tersalin!' : copyStatus === 'error' ? 'Gagal menyalin' : 'Salin rencana';

  return (
    <main className="min-h-screen bg-light-bg py-12 px-4 dark:bg-dark-bg sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 self-start rounded-full border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-600 shadow-neumorphic-button transition hover:-translate-y-0.5 hover:bg-purple-50 dark:border-purple-800 dark:bg-gray-900 dark:text-purple-200 dark:shadow-dark-neumorphic-button"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-600 dark:border-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
            <Bot className="h-3.5 w-3.5" /> Alat AI Eksperimental
          </span>
        </div>

        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-8 text-white shadow-2xl">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold uppercase">
                <Compass className="h-4 w-4" /> AI Workflow Navigator
              </span>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                Susun Stack Tools AI sesuai Target Kontenmu
              </h1>
              <p className="text-sm text-white/85 sm:text-base">
                Pilih tujuan, fokus, dan tempo kerja. Kami akan merekomendasikan kombinasi tools RuangRiung untuk mendukung proses
                ideasi hingga distribusi kontenmu.
              </p>
              <p className="text-sm text-white/70">{selectedGoal.subline}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-5 w-5" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/70">Fokus AI Rekomendasi</p>
                  <p className="text-base font-semibold">{selectedGoal.aiFocus}</p>
                  <p className="text-sm text-white/80">{selectedGoal.description}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-4">
                  <Gauge className="h-5 w-5 text-white/80" />
                  <p className="mt-2 text-xs uppercase tracking-wide text-white/60">Tempo kerja</p>
                  <p className="text-sm font-semibold">{selectedTempo.label}</p>
                  <p className="text-xs text-white/70">{tempoInsight.headline}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <Brain className="h-5 w-5 text-white/80" />
                  <p className="mt-2 text-xs uppercase tracking-wide text-white/60">Pengalaman</p>
                  <p className="text-sm font-semibold">{selectedExperience.label}</p>
                  <p className="text-xs text-white/70">{experienceTip.headline}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-neumorphic dark:border-gray-700 dark:bg-gray-900/60 dark:shadow-dark-neumorphic">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Atur preferensi workflow
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Sesuaikan tujuan dan area fokus agar rekomendasi tool terasa lebih presisi.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600 dark:bg-purple-900/40 dark:text-purple-200">
                  <Compass className="h-3.5 w-3.5" /> 3 langkah kurasi
                </span>
              </div>

              <div className="mt-6 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-300">
                    <Target className="h-4 w-4" /> Tujuan utama kontenmu
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    {goalOptions.map((option) => {
                      const Icon = iconMap[option.icon];
                      const isActive = goal === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setGoal(option.id)}
                          className={`flex h-full flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                            isActive
                              ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg dark:border-purple-500/60 dark:bg-purple-900/40 dark:text-purple-100'
                              : 'border-purple-100 bg-white text-gray-700 hover:border-purple-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-200 dark:hover:border-purple-500/40'
                          }`}
                          aria-pressed={isActive}
                        >
                          <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600 dark:bg-purple-900/50 dark:text-purple-200">
                            <Icon className="h-4 w-4" /> {option.title}
                          </span>
                          <p className="text-sm">{option.description}</p>
                          <p className="text-xs text-purple-500 dark:text-purple-300">{option.aiFocus}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-300">
                    <Sparkles className="h-4 w-4" /> Area yang ingin dimaksimalkan
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {focusOptions.map((option) => {
                      const Icon = iconMap[option.icon];
                      const isActive = selectedFocus.has(option.id);
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => toggleFocus(option.id)}
                          className={`flex h-full flex-col items-start gap-2 rounded-2xl border p-4 text-left transition ${
                            isActive
                              ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg dark:border-purple-500/60 dark:bg-purple-900/40 dark:text-purple-100'
                              : 'border-purple-100 bg-white text-gray-700 hover:border-purple-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-200 dark:hover:border-purple-500/40'
                          }`}
                          aria-pressed={isActive}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-200">
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className="text-sm font-semibold">{option.title}</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300">{option.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {experienceOptions.map((option) => {
                    const Icon = iconMap[option.icon];
                    const isActive = option.id === experience;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setExperience(option.id)}
                        className={`flex h-full flex-col items-start gap-3 rounded-2xl border p-4 text-left transition ${
                          isActive
                            ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg dark:border-purple-500/60 dark:bg-purple-900/40 dark:text-purple-100'
                            : 'border-purple-100 bg-white text-gray-700 hover:border-purple-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-200 dark:hover:border-purple-500/40'
                        }`}
                        aria-pressed={isActive}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-200">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-semibold">{option.label}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{option.description}</p>
                      </button>
                    );
                  })}
                  {tempoOptions.map((option) => {
                    const Icon = iconMap[option.icon];
                    const isActive = option.id === tempo;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setTempo(option.id)}
                        className={`flex h-full flex-col items-start gap-3 rounded-2xl border p-4 text-left transition ${
                          isActive
                            ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg dark:border-purple-500/60 dark:bg-purple-900/40 dark:text-purple-100'
                            : 'border-purple-100 bg-white text-gray-700 hover:border-purple-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-200 dark:hover:border-purple-500/40'
                        }`}
                        aria-pressed={isActive}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-200">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-semibold">{option.label}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Stack tools yang kami sarankan
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Disesuaikan untuk tujuan {selectedGoal.title.toLowerCase()} dengan fokus {focusSummary.toLowerCase()}.
                  </p>
                </div>
              </div>

              {recommendedTools.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-purple-200 bg-white/80 p-6 text-sm text-gray-600 dark:border-purple-800 dark:bg-gray-900/60 dark:text-gray-300">
                  Belum ada rekomendasi yang cocok. Aktifkan minimal satu area fokus agar kami dapat memetakan tools terbaik.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {recommendedTools.map((tool) => {
                    const ToolIcon = iconMap[tool.icon];
                    const fitPercentage = Math.min(96, Math.round(58 + tool.score * 8));
                    return (
                      <div
                        key={tool.id}
                        className="flex h-full flex-col justify-between rounded-3xl border border-purple-100 bg-white p-6 shadow-neumorphic transition hover:-translate-y-1 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-900/60 dark:shadow-dark-neumorphic"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-200">
                              <ToolIcon className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{tool.name}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{tool.output}</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600 dark:bg-purple-900/40 dark:text-purple-200">
                            {fitPercentage}% cocok
                          </span>
                        </div>
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{tool.description}</p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                          {tool.highlights.map((highlight) => (
                            <li key={highlight} className="flex items-start gap-2">
                              <ArrowRight className="mt-0.5 h-4 w-4 text-purple-500" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {tool.focus.map((tag) => (
                            <span
                              key={`${tool.id}-${tag}`}
                              className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600 dark:bg-purple-900/40 dark:text-purple-200"
                            >
                              #{focusLabels[tag]}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 rounded-2xl bg-purple-50/70 p-4 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">
                          <p className="font-semibold uppercase tracking-wide">Cara AI membantu</p>
                          <ul className="mt-2 space-y-1">
                            {tool.aiAssists.map((assist) => (
                              <li key={assist} className="flex items-start gap-2">
                                <Sparkles className="mt-0.5 h-3.5 w-3.5" />
                                <span>{assist}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-5 flex items-center justify-between">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {tool.matchCount > 1 ? 'Multi fokus' : 'Fokus utama'} • {tool.matchCount} kecocokan
                          </div>
                          {tool.isExternal ? (
                            <a
                              href={tool.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700"
                            >
                              Gunakan tool
                              <ArrowRight className="h-4 w-4" />
                            </a>
                          ) : (
                            <Link
                              href={tool.href}
                              className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700"
                            >
                              Gunakan tool
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-neumorphic dark:border-gray-700 dark:bg-gray-900/60 dark:shadow-dark-neumorphic">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Prompt starter untuk langkah berikutnya
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Gunakan daftar ini sebagai input awal di model AI favoritmu lalu sesuaikan dengan gaya khas RuangRiung.
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-3">
                {prompts.map((prompt) => (
                  <li
                    key={prompt}
                    className="rounded-2xl border border-purple-100 bg-purple-50/60 p-4 text-sm text-purple-700 shadow-sm dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-200"
                  >
                    {prompt}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-neumorphic dark:border-gray-700 dark:bg-gray-900/60 dark:shadow-dark-neumorphic">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Rencana workflow AI</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Ikuti langkah berikut sebagai kerangka dasar.</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPlan}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                    copyStatus === 'copied'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:border-emerald-400/60 dark:bg-emerald-900/30 dark:text-emerald-200'
                      : copyStatus === 'error'
                      ? 'border-red-500 bg-red-50 text-red-600 dark:border-red-500/60 dark:bg-red-900/30 dark:text-red-200'
                      : 'border-purple-200 bg-purple-50 text-purple-600 hover:border-purple-400 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/40 dark:text-purple-200'
                  }`}
                >
                  <CopyIcon className="h-4 w-4" />
                  {copyLabel}
                </button>
              </div>
              <div className="mt-5 space-y-4">
                {planTemplate.steps.map((step, index) => {
                  const StepIcon = iconMap[step.icon];
                  const linkedTool = step.toolId ? toolMap[step.toolId] : undefined;
                  return (
                    <div
                      key={step.title}
                      className="flex gap-4 rounded-2xl border border-purple-100 bg-white/80 p-4 dark:border-gray-700 dark:bg-gray-900/60"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-200">
                        <StepIcon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {index + 1}. {step.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{step.detail}</p>
                        {linkedTool && (
                          <p className="text-xs font-semibold text-purple-600 dark:text-purple-300">
                            Gunakan: {linkedTool.name}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-neumorphic dark:border-gray-700 dark:bg-gray-900/60 dark:shadow-dark-neumorphic">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Insight tambahan</h3>
              <div className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="rounded-2xl border border-purple-100 bg-purple-50/70 p-4 dark:border-purple-700 dark:bg-purple-900/30">
                  <p className="font-semibold text-purple-700 dark:text-purple-200">{focusInsight.headline}</p>
                  <p>{focusInsight.detail}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-300">Tips: {focusInsight.suggestion}</p>
                </div>
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 dark:border-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-100">
                  <p className="font-semibold text-indigo-700 dark:text-indigo-200">{tempoInsight.headline}</p>
                  <p>{tempoInsight.detail}</p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-200">{experienceTip.headline}</p>
                  <p>{experienceTip.detail}</p>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4 dark:border-orange-700 dark:bg-orange-900/30 dark:text-orange-100">
                  <p className="font-semibold text-orange-700 dark:text-orange-200">{goalAngle.highlight}</p>
                  <p>{goalAngle.tip}</p>
                </div>
              </div>
            </section>

            <div className="rounded-3xl border border-purple-200 bg-white/70 p-6 shadow-neumorphic dark:border-purple-800 dark:bg-gray-900/60 dark:shadow-dark-neumorphic">
              <AdBanner dataAdSlot="6897039624" />
            </div>

            <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6 text-blue-900 shadow-neumorphic dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-100">
              <div className="flex items-start gap-3">
                <Users className="h-6 w-6" />
                <div>
                  <h3 className="text-lg font-semibold">Perlu sparring partner?</h3>
                  <p className="text-sm">
                    Gabung ke komunitas Facebook RuangRiung untuk berbagi progres, minta review, dan mengikuti challenge rutin.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href="https://www.facebook.com/groups/1182261482811767/?ref=share&mibextid=lOuIew"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                    >
                      Masuk grup sekarang
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <Link
                      href="/kontak"
                      className="inline-flex items-center gap-2 rounded-full border border-blue-400/60 px-4 py-2 text-sm font-semibold text-blue-900 transition hover:bg-blue-100 dark:border-blue-800 dark:text-blue-100 dark:hover:bg-blue-900/40"
                    >
                      Hubungi tim RuangRiung
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
