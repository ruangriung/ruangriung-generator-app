import type { Metadata } from 'next';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  Award,
  CalendarDays,
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
    highlight: 'Segera diumumkan',
    description:
      'Pantau kabar terbaru langsung di RuangRiung untuk detail live battle dan sesi pengumuman juara.',
    icon: CalendarDays,
  },
  {
    title: 'Lokasi',
    highlight: 'RuangRiung',
    description:
      'Seluruh rangkaian battle dilaksanakan secara daring di markas komunitas RuangRiung.',
    icon: MapPin,
  },
] as const;

const teamQualifiers = [
  {
    name: 'RuangRiung',
    accent: 'from-amber-400 via-orange-500 to-amber-600',
    vsColor: 'text-amber-300',
    matchups: [
      { first: 'Nurul', second: 'Ayu Dian' },
      { first: 'Saka Mbarep', second: 'Budi. R' },
      { first: 'Famii', second: 'Aluh Gemoy' },
      { first: 'Dery Lau', second: 'Winda Azizah' },
    ],
  },
  {
    name: 'Thulin-AI',
    accent: 'from-emerald-400 via-green-500 to-lime-500',
    vsColor: 'text-emerald-300',
    matchups: [
      { first: 'David', second: 'Elena' },
      { first: 'Bangteng CRT', second: 'Ismail. A.R' },
      { first: 'Mahidara', second: 'Rudi Hartono' },
      { first: 'Code Z', second: 'Sri Hayati' },
    ],
  },
] as const;

const committee = ['Koko Ajeeb', 'Xenopath', 'Yogi Arfi'] as const;
const judges = ['Edyxcho AI', 'Arif Tirtana'] as const;
const tools = ['Gemini'] as const;
const hashtag = '#IgniteBattleAI';

export const metadata: Metadata = {
  title: 'Battle Ignite Friendship - RuangRiung vs Thulin-AI',
  description:
    'Susunan lengkap Battle Ignite Friendship antara RuangRiung dan Thulin-AI. Lihat skema kualifikasi, peserta, dan informasi pendukung lainnya.',
  alternates: {
    canonical: '/battle-ignite-friendship',
  },
};

const ParticipantBadge = ({
  name,
  accent,
}: {
  name: string;
  accent: string;
}) => (
  <div className="flex flex-col items-center gap-2 text-center">
    <div
      className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${accent} text-lg font-bold text-white shadow-lg shadow-black/40`}
      aria-hidden
    >
      {createInitials(name)}
    </div>
    <span className="text-sm font-semibold uppercase tracking-wide text-gray-100">{name}</span>
  </div>
);

const HighlightCard = ({
  title,
  highlight,
  description,
  icon: Icon,
}: (typeof eventHighlights)[number]) => (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-xl shadow-black/30 backdrop-blur-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-black">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200">{title}</p>
        <h3 className="text-xl font-bold text-white">{highlight}</h3>
      </div>
    </div>
    <p className="mt-4 text-sm text-gray-200/80">{description}</p>
  </div>
);

const Pill = ({ label, icon: Icon }: { label: string; icon?: LucideIcon }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm font-medium text-gray-100 shadow-inner shadow-black/40">
    {Icon ? <Icon className="h-4 w-4" /> : null}
    {label}
  </span>
);

export default function BattleIgniteFriendshipPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_60%)] bg-slate-950 text-white">
      <div className="bg-[radial-gradient(circle_at_bottom,_rgba(34,197,94,0.12),_transparent_60%)]">
        <div className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
          <div className="mb-10 flex justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-widest text-gray-100 transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Link>
            <span className="hidden items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200 sm:flex">
              <Sparkles className="h-4 w-4" /> Special Battle Edition
            </span>
          </div>

          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-amber-300">Battle Event</p>
            <h1 className="mt-4 text-4xl font-extrabold uppercase tracking-[0.15em] text-white sm:text-5xl">
              Battle Ignite <span className="text-amber-400">Friendship</span>
            </h1>
            <p className="mt-3 text-lg font-semibold uppercase tracking-[0.35em] text-emerald-300">RuangRiung vs Thulin-AI</p>
            <p className="mx-auto mt-4 max-w-3xl text-sm text-gray-200/80">
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
              <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-white">Babak Kualifikasi</h2>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
                Battle Location: RuangRiung
              </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {teamQualifiers.map((team) => (
                <div
                  key={team.name}
                  className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl shadow-black/40 backdrop-blur"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-300/90">Kualifikasi</p>
                      <h3 className="mt-1 text-2xl font-bold text-white">{team.name}</h3>
                    </div>
                    <span className={`rounded-full border border-white/20 bg-gradient-to-r ${team.accent} px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-black shadow-lg shadow-black/30`}>
                      Squad
                    </span>
                  </div>

                  <div className="mt-8 space-y-6">
                    {team.matchups.map((matchup, index) => (
                      <div
                        key={`${team.name}-${matchup.first}-${matchup.second}`}
                        className="relative flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-xl shadow-black/30"
                      >
                        <ParticipantBadge name={matchup.first} accent={team.accent} />
                        <div className="flex flex-col items-center justify-center text-center">
                          <span className={`text-sm font-black uppercase tracking-[0.4em] ${team.vsColor}`}>VS</span>
                          <span className="text-[10px] font-medium uppercase tracking-[0.5em] text-gray-400">Match {index + 1}</span>
                        </div>
                        <ParticipantBadge name={matchup.second} accent={team.accent} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="grid gap-8 md:grid-cols-3">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-amber-300">
                      <Users className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-white">Panitia</h3>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {committee.map((name) => (
                      <Pill key={name} label={name} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-emerald-300">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-white">Tools & Hashtag</h3>
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-amber-200">
                      <Award className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-white">Juri</h3>
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
