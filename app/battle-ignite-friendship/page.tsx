import type { Metadata } from 'next';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  Award,
  CalendarDays,
  Clock,
  Facebook,
  Flame,
  Hash,
  MapPin,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';

const createInitials = (name: string) => {
  const sanitized = name
    .split(/\s+/)
    .map((part) => part.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean);

  if (sanitized.length === 0) {
    return name.slice(0, 2).toUpperCase();
  }

  return sanitized
    .map((part) => part[0]!.toUpperCase())
    .slice(0, 2)
    .join('');
};

type Community = 'RuangRiung' | 'Timun-AI';

type ParticipantProgression = 'advanced' | 'eliminated';

type ParticipantInfo = {
  name: string;
  community?: Community;
  subtitle?: string;
  progression?: ParticipantProgression;
  facebookUrl?: string;
};

type BracketMatch = {
  match: string;
  stageLabel: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  left: ParticipantInfo;
  right: ParticipantInfo;
};

const communityAccents: Record<Community, string> = {
  RuangRiung: 'from-amber-400 via-orange-500 to-amber-600',
  'Timun-AI': 'from-emerald-400 via-green-500 to-lime-500',
};

const fallbackAccent = 'from-slate-500 via-slate-600 to-slate-700';

const resolveAccent = (participant: ParticipantInfo) =>
  participant.community ? communityAccents[participant.community] : fallbackAccent;

const resolveSubtitle = (participant: ParticipantInfo) =>
  participant.subtitle ?? participant.community;

const participantDirectory = {
  Nurul: {
    name: 'Nurul',
    community: 'RuangRiung',
    facebookUrl: 'https://www.facebook.com/nurul.sholehah.eka',
  },
  'Ayu Dian': {
    name: 'Ayu Dian',
    community: 'Timun-AI',
    facebookUrl: 'https://www.facebook.com/ayu.D14n.1992',
  },
  'Saka Mbarep': {
    name: 'Saka Mbarep',
    community: 'RuangRiung',
    facebookUrl: 'https://www.facebook.com/saka.mbarep.2025',
  },
  'Budy R.': {
    name: 'Budy R.',
    community: 'Timun-AI',
    facebookUrl: 'https://www.facebook.com/buddy.putrasunda',
  },
  'Bangteh CRT': {
    name: 'Bangteh CRT',
    community: 'RuangRiung',
    facebookUrl: 'https://www.facebook.com/janseengan',
  },
  'Ismail A.R': {
    name: 'Ismail A.R',
    community: 'Timun-AI',
    facebookUrl: 'https://www.facebook.com/ismail.paputungan',
  },
  Famii: {
    name: 'Famii',
    community: 'RuangRiung',
    facebookUrl: 'https://www.facebook.com/nengayu.hong',
  },
  'Aluh Gemoy': {
    name: 'Aluh Gemoy',
    community: 'Timun-AI',
    facebookUrl: 'https://www.facebook.com/mia.fahrizt.58',
  },
  Mahidara: {
    name: 'Mahidara',
    community: 'RuangRiung',
    facebookUrl: 'https://www.facebook.com/ruth.andanasari',
  },
  'Winda A.': {
    name: 'Winda A.',
    community: 'Timun-AI',
    facebookUrl: 'https://www.facebook.com/windaazizah',
  },
  'David Amd': {
    name: 'David Amd',
    community: 'RuangRiung',
    facebookUrl: 'https://www.facebook.com/davidamd',
  },
  'Elena M.': {
    name: 'Elena M.',
    community: 'Timun-AI',
    facebookUrl: 'https://www.facebook.com/aiezci.endirleuweh',
  },
  'Dery Lau': {
    name: 'Dery Lau',
    community: 'RuangRiung',
    facebookUrl: 'https://www.facebook.com/dery.megana',
  },
  'Rudi H.': {
    name: 'Rudi H.',
    community: 'Timun-AI',
    facebookUrl: 'https://www.facebook.com/saka.mbarep.2025',
  },
  'Code Z': {
    name: 'Code Z',
    community: 'RuangRiung',
    facebookUrl: 'https://www.facebook.com/uul.aja',
  },
  'Sri Hayati': {
    name: 'Sri Hayati',
    community: 'Timun-AI',
    facebookUrl: 'https://www.facebook.com/sri.hayati',
  },
} satisfies Record<string, ParticipantInfo>;

const withParticipant = (
  name: keyof typeof participantDirectory,
  overrides?: Partial<ParticipantInfo>,
): ParticipantInfo => ({
  ...participantDirectory[name],
  ...overrides,
});

const eventHighlights = [
  {
    title: 'Tema',
    highlight: 'Friendship',
    description:
      'Menyalakan kembali semangat persahabatan melalui karya visual terbaik dari kedua komunitas.',
    icon: Flame,
  },
  {
    title: 'Format Kualifikasi',
    highlight: 'Duel 1 lawan 1',
    description:
      'Empat partai internal untuk masing-masing komunitas. Pemenang melaju sebagai wakil utama ke babak puncak.',
    icon: Trophy,
  },
  {
    title: 'Jadwal',
    highlight: '17 - 21 September 2025',
    description:
      'Dimulai dari 16 besar hingga final, dengan perempat final pada Jumat 19 September 2025 dan final Minggu 21 September 2025.',
    icon: CalendarDays,
  },
  {
    title: 'Lokasi',
    highlight: 'RuangRiung AI Image',
    description:
      'Seluruh rangkaian battle dilaksanakan secara daring di markas komunitas RuangRiung.',
    icon: MapPin,
  },
] as const;

const qualificationBattles = [
  {
    id: 1,
    theme: 'Makoto Shinkai style',
    left: withParticipant('Nurul', { progression: 'eliminated' }),
    right: withParticipant('Ayu Dian', { progression: 'advanced' }),
  },
  {
    id: 2,
    theme: 'Lattice reality',
    left: withParticipant('Saka Mbarep', { progression: 'advanced' }),
    right: withParticipant('Budy R.', { progression: 'eliminated' }),
  },
  {
    id: 3,
    theme: 'Refraction labyrinth',
    left: withParticipant('Bangteh CRT', { progression: 'eliminated' }),
    right: withParticipant('Ismail A.R', { progression: 'advanced' }),
  },
  {
    id: 4,
    theme: 'Escher style impossible geometri',
    left: withParticipant('Famii', { progression: 'eliminated' }),
    right: withParticipant('Aluh Gemoy', { progression: 'advanced' }),
  },
  {
    id: 5,
    theme: 'Hyper-detailed Maximalism',
    left: withParticipant('Mahidara', { progression: 'eliminated' }),
    right: withParticipant('Winda A.', { progression: 'advanced' }),
  },
  {
    id: 6,
    theme: 'Hypervoronoi Matrix',
    left: withParticipant('David Amd', { progression: 'eliminated' }),
    right: withParticipant('Elena M.', { progression: 'advanced' }),
  },
  {
    id: 7,
    theme: 'Baroque Grotesque',
    left: withParticipant('Dery Lau', { progression: 'eliminated' }),
    right: withParticipant('Rudi H.', { progression: 'advanced' }),
  },
  {
    id: 8,
    theme: 'Fractal Lines',
    left: withParticipant('Code Z', { progression: 'advanced' }),
    right: withParticipant('Sri Hayati', { progression: 'eliminated' }),
  },
] satisfies Array<{
  id: number;
  theme: string;
  left: ParticipantInfo;
  right: ParticipantInfo;
}>;

const quarterFinalMatches = [
  {
    match: 'Match 1',
    stageLabel: 'Perempat Final',
    dateLabel: 'Jumat, 19 September 2025',
    timeLabel: '10.00 – 22.00',
    locationLabel: 'RuangRiung AI Image',
    left: withParticipant('Elena M.'),
    right: withParticipant('Ayu Dian'),
  },
  {
    match: 'Match 2',
    stageLabel: 'Perempat Final',
    dateLabel: 'Jumat, 19 September 2025',
    timeLabel: '10.00 – 22.00',
    locationLabel: 'RuangRiung AI Image',
    left: withParticipant('Saka Mbarep'),
    right: withParticipant('Ismail A.R'),
  },
  {
    match: 'Match 3',
    stageLabel: 'Perempat Final',
    dateLabel: 'Jumat, 19 September 2025',
    timeLabel: '10.00 – 22.00',
    locationLabel: 'RuangRiung AI Image',
    left: withParticipant('Rudi H.'),
    right: withParticipant('Aluh Gemoy'),
  },
  {
    match: 'Match 4',
    stageLabel: 'Perempat Final',
    dateLabel: 'Jumat, 19 September 2025',
    timeLabel: '10.00 – 22.00',
    locationLabel: 'RuangRiung AI Image',
    left: withParticipant('Winda A.'),
    right: withParticipant('Code Z'),
  },
] satisfies BracketMatch[];

const semiFinalMatches = [
  {
    match: 'Semifinal 1',
    stageLabel: 'Semifinal',
    dateLabel: 'Sabtu, 20 September 2025',
    timeLabel: '10.00 – 22.00',
    locationLabel: 'RuangRiung AI Image',
    left: { name: 'Pemenang Match 1', subtitle: 'Perempat Final 1' },
    right: { name: 'Pemenang Match 2', subtitle: 'Perempat Final 2' },
  },
  {
    match: 'Semifinal 2',
    stageLabel: 'Semifinal',
    dateLabel: 'Sabtu, 20 September 2025',
    timeLabel: '10.00 – 22.00',
    locationLabel: 'RuangRiung AI Image',
    left: { name: 'Pemenang Match 3', subtitle: 'Perempat Final 3' },
    right: { name: 'Pemenang Match 4', subtitle: 'Perempat Final 4' },
  },
] satisfies BracketMatch[];

const finalMatches = [
  {
    match: 'Grand Final',
    stageLabel: 'Final',
    dateLabel: 'Minggu, 21 September 2025',
    timeLabel: '19.00',
    locationLabel: 'RuangRiung AI Image',
    left: { name: 'Pemenang Semifinal 1', subtitle: 'Semifinal 1' },
    right: { name: 'Pemenang Semifinal 2', subtitle: 'Semifinal 2' },
  },
] satisfies BracketMatch[];

const thirdPlaceMatches = [
  {
    match: '3rd Place Battle',
    stageLabel: '3rd Place',
    dateLabel: 'Minggu, 21 September 2025',
    timeLabel: '19.00 (bersamaan Final)',
    locationLabel: 'RuangRiung AI Image',
    left: { name: 'Kalah Semifinal 1', subtitle: 'Semifinal 1' },
    right: { name: 'Kalah Semifinal 2', subtitle: 'Semifinal 2' },
  },
] satisfies BracketMatch[];

const stageSchedule = [
  {
    stage: '16 Besar',
    date: 'Rabu, 17 September 2025',
    time: '10.00 – 22.00',
    location: 'RuangRiung AI Image',
  },
  {
    stage: '8 Besar',
    date: 'Jumat, 19 September 2025',
    time: '10.00 – 22.00',
    location: 'RuangRiung AI Image',
  },
  {
    stage: 'Semifinal',
    date: 'Sabtu, 20 September 2025',
    time: '10.00 – 22.00',
    location: 'RuangRiung AI Image',
  },
  {
    stage: 'Final',
    date: 'Minggu, 21 September 2025',
    time: '19.00',
    location: 'RuangRiung AI Image',
  },
  {
    stage: '3rd Place',
    date: 'Minggu, 21 September 2025',
    time: '19.00 (bersamaan Final)',
    location: 'RuangRiung AI Image',
  },
] as const;

const committee = ['Yogi Arfi', 'Xenopath', 'Koko Ajeeb'] as const;
const judges = ['Arif Tirtana', 'Edxycho AI'] as const;
const tools = ['Gemini'] as const;
const hashtag = '#IgniteBattleAI';

export const metadata: Metadata = {
  title: 'Battle Ignite Friendship - RuangRiung vs Timun-AI',
  description:
    'Susunan lengkap Battle Ignite Friendship antara RuangRiung dan Timun-AI. Lihat skema kualifikasi, peserta, dan informasi pendukung lainnya.',
  alternates: {
    canonical: '/battle-ignite-friendship',
  },
  keywords: [
    'Battle Ignite Friendship',
    'RuangRiung',
    'Timun-AI',
    'Kompetisi AI Art',
    'Battle Ignite',
    'Turnamen AI Art',
    'Jadwal Battle Ignite',
    'Tema Battle Ignite',
    'Komunitas AI Indonesia',
  ],
  openGraph: {
    title: 'Battle Ignite Friendship - RuangRiung vs Timun-AI',
    description:
      'Ikuti Battle Ignite Friendship: duel kreator AI RuangRiung dan Timun-AI lengkap dengan jadwal, tema, dan peserta setiap babak.',
    url: '/battle-ignite-friendship',
    type: 'website',
    siteName: 'RuangRiung AI Generator',
    locale: 'id_ID',
    images: [
      {
        url: '/battle-ignite-friendship/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Kolase Battle Ignite Friendship RuangRiung vs Timun-AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Battle Ignite Friendship - RuangRiung vs Timun-AI',
    description:
      'Skema lengkap Battle Ignite Friendship: peserta, tema, dan jadwal duel kreator AI RuangRiung dan Timun-AI.',
    images: ['/battle-ignite-friendship/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const ParticipantBadge = ({
  name,
  accent,
  subtitle,
  progression,
  facebookUrl,
}: {
  name: string;
  accent: string;
  subtitle?: string;
  progression?: ParticipantProgression;
  facebookUrl?: string;
}) => {
  const isEliminated = progression === 'eliminated';
  const isAdvanced = progression === 'advanced';

  const containerClasses = [
    'flex flex-col items-center gap-2 text-center transition-all duration-300',
  ];
  if (isEliminated) {
    containerClasses.push('opacity-75');
  }
  const baseClassName = containerClasses.join(' ');

  const circleClasses = [
    'flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-lg font-bold text-white shadow-lg transition-all duration-300',
    accent,
  ];

  if (isEliminated) {
    circleClasses.push(
      'grayscale brightness-75 ring-1 ring-rose-300/40 shadow-none dark:ring-rose-400/40'
    );
  } else if (isAdvanced) {
    circleClasses.push(
      'ring-2 ring-emerald-400/70 shadow-emerald-500/40 dark:shadow-emerald-400/40'
    );
  } else {
    circleClasses.push('shadow-slate-900/10 dark:shadow-black/40');
  }

  if (facebookUrl) {
    circleClasses.push(
      'group-hover:scale-105 group-hover:shadow-blue-500/25 dark:group-hover:shadow-blue-400/30'
    );
  }

  const nameClasses = ['text-sm font-semibold uppercase tracking-wide transition'];
  if (isEliminated) {
    nameClasses.push(
      'text-slate-500 line-through decoration-2 decoration-rose-400/70 dark:text-gray-400'
    );
  } else if (isAdvanced) {
    nameClasses.push('text-emerald-600 dark:text-emerald-200');
  } else {
    nameClasses.push('text-slate-900 dark:text-gray-100');
  }

  if (facebookUrl) {
    nameClasses.push('group-hover:text-blue-600 dark:group-hover:text-blue-300');
  }

  const subtitleClasses = [
    'text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-gray-400',
  ];
  if (isEliminated) {
    subtitleClasses.push('line-through decoration-rose-300/60');
  }
  if (facebookUrl) {
    subtitleClasses.push('group-hover:text-blue-500 dark:group-hover:text-blue-300');
  }

  const badgeContent = (
    <>
      <div className={circleClasses.join(' ')} aria-hidden>
        {createInitials(name)}
      </div>
      <span className={nameClasses.join(' ')}>{name}</span>
      {subtitle ? <span className={subtitleClasses.join(' ')}>{subtitle}</span> : null}
      {progression || facebookUrl ? (
        <div className="flex flex-col items-center gap-1">
          {progression ? (
            <span
              className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.35em] ${
                isAdvanced
                  ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-200'
                  : 'border-rose-400/60 bg-rose-400/10 text-rose-500 dark:bg-rose-500/10 dark:text-rose-300'
              }`}
            >
              {isAdvanced ? 'Lolos 8 Besar' : 'Tidak Lolos'}
            </span>
          ) : null}
          {facebookUrl ? (
            <span
              className="inline-flex items-center gap-1 rounded-full border border-blue-400/60 bg-blue-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.35em] text-blue-600 transition-colors duration-300 group-hover:border-blue-500/70 group-hover:bg-blue-500/15 dark:border-blue-400/60 dark:bg-blue-500/10 dark:text-blue-300"
            >
              <Facebook className="h-3 w-3" aria-hidden />
              Profil
            </span>
          ) : null}
        </div>
      ) : null}
    </>
  );

  if (facebookUrl) {
    return (
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClassName} group rounded-2xl px-3 py-2 no-underline hover:-translate-y-1 hover:bg-blue-50/70 hover:shadow-lg hover:shadow-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:hover:bg-blue-500/10 dark:hover:shadow-blue-500/15`}
        title={`Buka profil Facebook ${name}`}
        aria-label={`Buka profil Facebook ${name}`}
      >
        {badgeContent}
      </a>
    );
  }

  return <div className={baseClassName}>{badgeContent}</div>;
};

const HighlightCard = ({
  title,
  highlight,
  description,
  icon: Icon,
}: (typeof eventHighlights)[number]) => (
  <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 text-left shadow-xl shadow-slate-900/10 backdrop-blur-sm transition-colors duration-300 dark:border-white/10 dark:bg-slate-900/70 dark:text-white dark:shadow-black/30">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-black dark:from-amber-500 dark:to-orange-600">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500 dark:text-amber-200">{title}</p>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{highlight}</h3>
      </div>
    </div>
    <p className="mt-4 text-sm text-slate-600 dark:text-gray-200/80">{description}</p>
  </div>
);

const Pill = ({ label, icon: Icon }: { label: string; icon?: LucideIcon }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-1 text-sm font-medium text-slate-700 shadow-inner shadow-slate-900/10 transition-colors duration-300 dark:border-white/15 dark:bg-slate-900/70 dark:text-gray-100 dark:shadow-black/40">
    {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
    {label}
  </span>
);

const BracketMatchCard = ({
  match,
  stageLabel,
  dateLabel,
  timeLabel,
  locationLabel,
  left,
  right,
}: BracketMatch) => (
  <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 transition-colors duration-300 dark:border-white/10 dark:bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.08),_transparent_60%)] dark:bg-slate-950/60 dark:shadow-black/40 backdrop-blur">
    <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
      <span className="rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-600 transition-colors duration-300 dark:border-white/10 dark:bg-white/10 dark:text-gray-200">
        {match}
      </span>
      <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-200">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden /> {dateLabel}
      </span>
    </div>
    <div className="mt-6 flex flex-col items-center gap-6 text-center sm:flex-row sm:flex-wrap sm:justify-between sm:text-left">
      <ParticipantBadge
        name={left.name}
        accent={resolveAccent(left)}
        subtitle={resolveSubtitle(left)}
        progression={left.progression}
        facebookUrl={left.facebookUrl}
      />
      <div className="flex w-full flex-col items-center justify-center text-center sm:flex-1">
        <span className="text-lg font-black uppercase tracking-[0.5em] text-emerald-600 dark:text-emerald-300">VS</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-gray-400">{stageLabel}</span>
      </div>
      <ParticipantBadge
        name={right.name}
        accent={resolveAccent(right)}
        subtitle={resolveSubtitle(right)}
        progression={right.progression}
        facebookUrl={right.facebookUrl}
      />
    </div>
    <div className="mt-6 flex flex-col items-center gap-3 text-center text-[11px] font-medium uppercase tracking-[0.25em] text-slate-700 dark:text-gray-200 sm:flex-row sm:justify-between sm:text-left">
      <span className="inline-flex items-center gap-2">
        <MapPin className="h-4 w-4 text-emerald-500 dark:text-emerald-300" />
        {locationLabel}
      </span>
      <span className="inline-flex items-center gap-2">
        <Clock className="h-4 w-4 text-amber-500 dark:text-amber-300" />
        {timeLabel}
      </span>
    </div>
  </div>
);

export default function BattleIgniteFriendshipPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-emerald-50 text-slate-900 transition-colors duration-300 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 dark:bg-slate-950 dark:bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.14),_transparent_65%)] dark:text-white">
      <div className="bg-white/80 transition-colors duration-300 dark:bg-slate-950/70 dark:bg-[radial-gradient(circle_at_bottom,_rgba(34,197,94,0.12),_transparent_60%)]">
        <div className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 bg-white/70 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-slate-700 transition hover:bg-white/90 dark:border-white/10 dark:bg-white/10 dark:text-gray-100 dark:hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Link>
              <span className="hidden items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-200 sm:flex">
                <Sparkles className="h-4 w-4" /> Special Battle Edition
              </span>
            </div>
            <div className="w-full sm:w-[260px]">
              <ThemeToggle />
            </div>
          </div>

          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-amber-600 dark:text-amber-300">Battle Event</p>
            <h1 className="mt-4 text-4xl font-extrabold uppercase tracking-[0.15em] text-slate-900 transition-colors duration-300 dark:text-white sm:text-5xl">
              Battle Ignite <span className="text-amber-500 dark:text-amber-400">Friendship</span>
            </h1>
            <p className="mt-3 text-lg font-semibold uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-300">
              RuangRiung vs Timun-AI
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-sm text-slate-600 dark:text-gray-200/80">
              Format kompetisi eksklusif yang mempertemukan kreator terbaik dari dua komunitas besar. Saksikan bagaimana persahabatan
              menjadi energi utama dalam setiap karya yang dipertaruhkan.
            </p>
          </header>

          <section className="mt-12 grid gap-6 md:grid-cols-2">
            {eventHighlights.map((item) => (
              <HighlightCard key={item.title} {...item} />
            ))}
          </section>

          <section className="mt-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white">Jadwal & Lokasi</h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 dark:text-gray-200/80">
                Ikuti alur lengkap Battle Ignite Friendship dari 16 besar hingga laga pamungkas. Semua pertandingan digelar
                secara daring dengan intensitas tinggi sepanjang akhir pekan spesial ini.
              </p>
            </div>

            <div className="relative mt-12 space-y-8 pl-8 sm:pl-14">
              <span
                className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-amber-400/60 via-white/10 to-emerald-400/60 sm:block"
                aria-hidden
              />
              {stageSchedule.map((stage) => (
                <div
                  key={stage.stage}
                  className="relative rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur transition-colors duration-300 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/40"
                >
                  <span
                    className="absolute left-[-1.85rem] top-7 hidden h-4 w-4 rounded-full border-2 border-white bg-gradient-to-br from-amber-300 to-emerald-400 shadow-lg shadow-slate-900/15 dark:border-slate-950 dark:shadow-black/40 sm:block"
                    aria-hidden
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-600 dark:text-amber-200">{stage.stage}</span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-200">{stage.date}</span>
                  </div>
                  <div className="mt-4 flex flex-col gap-4 text-sm text-slate-600 dark:text-gray-200/80 sm:flex-row sm:items-center sm:justify-between">
                    <div className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-500 dark:text-emerald-300" />
                      <span className="uppercase tracking-[0.25em] text-slate-800 dark:text-gray-100">{stage.location}</span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500 dark:text-amber-300" />
                      <span className="uppercase tracking-[0.25em] text-slate-800 dark:text-gray-100">{stage.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white">Babak Kualifikasi</h2>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">
                Battle Location: RuangRiung
              </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {qualificationBattles.map((battle) => (
                <div
                  key={battle.id}
                  className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 transition-colors duration-300 dark:border-white/10 dark:bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.08),_transparent_60%)] dark:bg-slate-950/60 dark:shadow-black/40 backdrop-blur"
                >
                  <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:flex-wrap sm:justify-between sm:text-left">
                    <span className="rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-600 transition-colors duration-300 dark:border-white/10 dark:bg-white/10 dark:text-gray-300">
                      Battle {battle.id}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-600 transition-colors duration-300 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200">
                      Tema Matchup
                    </span>
                  </div>

                  <div className="mt-6 flex flex-col items-center gap-6 text-center sm:flex-row sm:flex-wrap sm:justify-between sm:text-left">
                    <ParticipantBadge
                      name={battle.left.name}
                      accent={resolveAccent(battle.left)}
                      subtitle={resolveSubtitle(battle.left)}
                      progression={battle.left.progression}
                    />
                    <div className="flex w-full items-center justify-center sm:flex-1 sm:min-w-[120px]">
                      <span className="text-xs font-black uppercase tracking-[0.5em] text-emerald-600 dark:text-emerald-300">VS</span>
                    </div>
                    <ParticipantBadge
                      name={battle.right.name}
                      accent={resolveAccent(battle.right)}
                      subtitle={resolveSubtitle(battle.right)}
                      progression={battle.right.progression}
                    />
                  </div>

                  <div className="mt-6 rounded-2xl border border-amber-300/40 bg-white/80 p-4 text-center shadow-inner shadow-slate-900/10 transition-colors duration-300 dark:border-amber-300/20 dark:bg-slate-900/70 dark:shadow-black/40">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-600 dark:text-emerald-200">Tema Wajib</span>
                    <p className="mt-2 text-sm font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-200">{battle.theme}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white">Babak Perempat Final</h2>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">
                Jadwal: Jumat, 19 September 2025
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.35em] text-amber-600 dark:text-amber-200">
                Battle Location: RuangRiung AI Image
              </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {quarterFinalMatches.map((match) => (
                <BracketMatchCard key={match.match} {...match} />
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white">Babak Semifinal</h2>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">
                Jadwal: Sabtu, 20 September 2025
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.35em] text-amber-600 dark:text-amber-200">
                Slot menunggu pemenang perempat final
              </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {semiFinalMatches.map((match) => (
                <BracketMatchCard key={match.match} {...match} />
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white">Babak Final</h2>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">
                Minggu, 21 September 2025 - Pukul 19.00
              </p>
            </div>

            <div className="mt-10 grid gap-8 sm:mx-auto sm:max-w-2xl">
              {finalMatches.map((match) => (
                <BracketMatchCard key={match.match} {...match} />
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white">3rd Place Battle</h2>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">
                Digelar serentak dengan Final pada pukul 19.00
              </p>
            </div>

            <div className="mt-10 grid gap-8 sm:mx-auto sm:max-w-2xl">
              {thirdPlaceMatches.map((match) => (
                <BracketMatchCard key={match.match} {...match} />
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur transition-colors duration-300 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/40">
              <div className="grid gap-8 md:grid-cols-3">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-500 dark:bg-white/10 dark:text-amber-300">
                      <Users className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-white">Panitia</h3>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {committee.map((name) => (
                      <Pill key={name} label={name} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-white/10 dark:text-emerald-300">
                      <Sparkles className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-white">Tools & Hashtag</h3>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tools.map((tool) => (
                      <Pill key={tool} label={tool} icon={Sparkles} />
                    ))}
                    <Pill label={hashtag} icon={Hash} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-500 dark:bg-white/10 dark:text-amber-200">
                      <Award className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-white">Juri</h3>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {judges.map((judge) => (
                      <Pill key={judge} label={judge} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
