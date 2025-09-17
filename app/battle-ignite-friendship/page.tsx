import type { Metadata } from 'next';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  Award,
  CalendarDays,
  Clock,
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
    theme: 'Makoto Shinichi Style',
    left: { name: 'Nurul', community: 'RuangRiung' as const },
    right: { name: 'Ayu Dian', community: 'Timun-AI' as const },
  },
  {
    id: 2,
    theme: 'Hyper-Detailed Maximalism',
    left: { name: 'Saka Mbarep', community: 'RuangRiung' as const },
    right: { name: 'Elena M.', community: 'Timun-AI' as const },
  },
  {
    id: 3,
    theme: 'Hyperreal Holographic Matrix',
    left: { name: 'Bangteh CRT', community: 'RuangRiung' as const },
    right: { name: 'Ismail A.R', community: 'Timun-AI' as const },
  },
  {
    id: 4,
    theme: 'Refraction Labyrinth',
    left: { name: 'Famii', community: 'RuangRiung' as const },
    right: { name: 'Aluh Gemoy', community: 'Timun-AI' as const },
  },
  {
    id: 5,
    theme: 'Baroque Grotesque',
    left: { name: 'Mahidara', community: 'RuangRiung' as const },
    right: { name: 'Rudi H.', community: 'Timun-AI' as const },
  },
  {
    id: 6,
    theme: 'Cyber Ethereal Essence',
    left: { name: 'David Amd', community: 'RuangRiung' as const },
    right: { name: 'Budy R.', community: 'Timun-AI' as const },
  },
  {
    id: 7,
    theme: 'Neon Dream Realism',
    left: { name: 'Dery Lau', community: 'RuangRiung' as const },
    right: { name: 'Winda A.', community: 'Timun-AI' as const },
  },
  {
    id: 8,
    theme: 'Fractal Lines Universe',
    left: { name: 'Code Z', community: 'RuangRiung' as const },
    right: { name: 'Sri Hayati', community: 'Timun-AI' as const },
  },
] as const;

const communityAccents = {
  'RuangRiung': 'from-amber-400 via-orange-500 to-amber-600',
  'Timun-AI': 'from-emerald-400 via-green-500 to-lime-500',
} as const;

const quarterFinalists = [
  {
    match: 'Match 1',
    left: { name: 'Elena M.', community: 'Timun-AI' as const },
    right: { name: 'Ayu Dian', community: 'Timun-AI' as const },
  },
  {
    match: 'Match 2',
    left: { name: 'Saka Mbarep', community: 'RuangRiung' as const },
    right: { name: 'Ismail A.R', community: 'Timun-AI' as const },
  },
  {
    match: 'Match 3',
    left: { name: 'Rudi H.', community: 'Timun-AI' as const },
    right: { name: 'Aluh Gemoy', community: 'Timun-AI' as const },
  },
  {
    match: 'Match 4',
    left: { name: 'Winda A.', community: 'Timun-AI' as const },
    right: { name: 'Code Z', community: 'RuangRiung' as const },
  },
] as const;

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
    time: '13.00',
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
};

const ParticipantBadge = ({
  name,
  accent,
  subtitle,
}: {
  name: string;
  accent: string;
  subtitle?: string;
}) => (
  <div className="flex flex-col items-center gap-2 text-center">
    <div
      className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${accent} text-lg font-bold text-white shadow-lg shadow-black/40`}
      aria-hidden
    >
      {createInitials(name)}
    </div>
    <span className="text-sm font-semibold uppercase tracking-wide text-gray-100">{name}</span>
    {subtitle ? (
      <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gray-400">{subtitle}</span>
    ) : null}
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
            <p className="mt-3 text-lg font-semibold uppercase tracking-[0.35em] text-emerald-300">RuangRiung vs Timun-AI</p>
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
              <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-white">Jadwal & Lokasi</h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-200/80">
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
                  className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur"
                >
                  <span
                    className="absolute left-[-1.85rem] top-7 hidden h-4 w-4 rounded-full border-2 border-slate-950 bg-gradient-to-br from-amber-300 to-emerald-300 shadow-lg shadow-black/40 sm:block"
                    aria-hidden
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-200">{stage.stage}</span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-200">{stage.date}</span>
                  </div>
                  <div className="mt-4 flex flex-col gap-4 text-sm text-gray-200/80 sm:flex-row sm:items-center sm:justify-between">
                    <div className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-300" />
                      <span className="uppercase tracking-[0.25em] text-gray-100">{stage.location}</span>
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-300" />
                      <span className="uppercase tracking-[0.25em] text-gray-100">{stage.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-white">Babak Kualifikasi</h2>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
                Battle Location: RuangRiung
              </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {qualificationBattles.map((battle) => (
                <div
                  key={battle.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.08),_transparent_60%)] bg-slate-950/60 p-6 shadow-2xl shadow-black/40 backdrop-blur"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-gray-300">
                      Battle {battle.id}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-200">
                      Tema Matchup
                    </span>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
                    <ParticipantBadge
                      name={battle.left.name}
                      accent={communityAccents[battle.left.community]}
                      subtitle={`Tim ${battle.left.community}`}
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-200">Tema</span>
                      <span className="mt-2 max-w-[12rem] text-sm font-bold uppercase tracking-[0.2em] text-amber-200">
                        {battle.theme}
                      </span>
                      <span className="mt-3 text-xs font-black uppercase tracking-[0.5em] text-gray-300">VS</span>
                    </div>
                    <ParticipantBadge
                      name={battle.right.name}
                      accent={communityAccents[battle.right.community]}
                      subtitle={`Tim ${battle.right.community}`}
                    />
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-200">
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-center">
                      Tim {battle.left.community}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-center">
                      Tim {battle.right.community}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-white">Babak Perempat Final</h2>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
                Jadwal: Jumat, 19 September 2025
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">
                Battle Location: RuangRiung AI Image
              </p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {quarterFinalists.map((match) => (
                <div
                  key={match.match}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.08),_transparent_60%)] bg-slate-950/60 p-6 shadow-2xl shadow-black/40 backdrop-blur"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-gray-200">
                      {match.match}
                    </span>
                    <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-200">
                      <CalendarDays className="h-3.5 w-3.5" /> 19 Sept 2025
                    </span>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
                    <ParticipantBadge
                      name={match.left.name}
                      accent={communityAccents[match.left.community]}
                      subtitle={match.left.community}
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                      <span className="text-lg font-black uppercase tracking-[0.5em] text-emerald-300">VS</span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-gray-400">Perempat Final</span>
                    </div>
                    <ParticipantBadge
                      name={match.right.name}
                      accent={communityAccents[match.right.community]}
                      subtitle={match.right.community}
                    />
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.25em] text-gray-200">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-300" />
                      RuangRiung AI Image
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-300" />
                      10.00 – 22.00
                    </span>
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
