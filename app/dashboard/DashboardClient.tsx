'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Clock,
  Filter,
  Mail,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Store,
  Tag,
  Users,
} from 'lucide-react';

import type {
  DashboardSnapshot,
  ModerationItem,
  SubmissionStatus,
  SubmissionType,
} from '@/lib/dashboard/types';
import { moderationStorageKey } from '@/lib/dashboard/moderation-queue';

const statusLabel: Record<SubmissionStatus, string> = {
  pending: 'Menunggu Review',
  in_review: 'Sedang Ditinjau',
  approved: 'Siap Publikasi',
  rejected: 'Ditolak',
};

const statusTone: Record<SubmissionStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-200 border border-amber-500/30',
  in_review: 'bg-blue-500/10 text-blue-200 border border-blue-500/30',
  approved: 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/30',
  rejected: 'bg-rose-500/10 text-rose-200 border border-rose-500/30',
};

const priorityTone = {
  high: 'text-rose-300',
  medium: 'text-amber-300',
  low: 'text-slate-300',
} satisfies Record<ModerationItem['priority'], string>;

const typeLabel: Record<SubmissionType, string> = {
  prompt: 'Prompt',
  profile: 'Profil Kreator',
  umkm: 'UMKM',
};

const typeTone: Record<SubmissionType, string> = {
  prompt: 'bg-fuchsia-500/10 text-fuchsia-200 border border-fuchsia-400/30',
  profile: 'bg-cyan-500/10 text-cyan-200 border border-cyan-400/30',
  umkm: 'bg-emerald-500/10 text-emerald-200 border border-emerald-400/30',
};

const formatDate = (value?: string) => {
  if (!value) {
    return '-';
  }

  try {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const sortByPriority = (items: ModerationItem[]) => {
  const priorityOrder: Record<ModerationItem['priority'], number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return [...items].sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });
};

interface DashboardClientProps {
  adminName: string;
  adminEmail?: string;
  snapshot: DashboardSnapshot;
  initialQueue: ModerationItem[];
  hasConfiguredAdmins: boolean;
}

export default function DashboardClient({
  adminName,
  adminEmail,
  snapshot,
  initialQueue,
  hasConfiguredAdmins,
}: DashboardClientProps) {
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>(initialQueue);
  const [selectedStatus, setSelectedStatus] = useState<SubmissionStatus | 'all'>('pending');
  const [selectedType, setSelectedType] = useState<SubmissionType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const stored = window.localStorage.getItem(moderationStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as ModerationItem[];
        if (Array.isArray(parsed)) {
          setModerationItems(parsed);
        }
      }
    } catch (error) {
      console.error('Gagal memuat data moderasi dari localStorage:', error);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(moderationStorageKey, JSON.stringify(moderationItems));
    } catch (error) {
      console.error('Gagal menyimpan data moderasi:', error);
    }
  }, [hydrated, moderationItems]);

  const updateItem = (id: string, patch: Partial<ModerationItem>) => {
    setModerationItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch,
              lastUpdated: new Date().toISOString(),
            }
          : item,
      ),
    );
  };

  const handleStatusChange = (id: string, status: SubmissionStatus) => {
    updateItem(id, { status, assignee: adminName });
  };

  const handleAssignToMe = (id: string) => {
    updateItem(id, { assignee: adminName });
  };

  const queueStats = useMemo(() => {
    return moderationItems.reduce(
      (acc, item) => {
        acc[item.status] += 1;
        return acc;
      },
      {
        pending: 0,
        in_review: 0,
        approved: 0,
        rejected: 0,
      } as Record<SubmissionStatus, number>,
    );
  }, [moderationItems]);

  const filteredItems = useMemo(() => {
    const loweredSearch = search.toLowerCase().trim();

    return sortByPriority(
      moderationItems.filter((item) => {
        if (selectedStatus !== 'all' && item.status !== selectedStatus) {
          return false;
        }

        if (selectedType !== 'all' && item.type !== selectedType) {
          return false;
        }

        if (!loweredSearch) {
          return true;
        }

        const haystack = [
          item.title,
          item.submittedBy,
          item.channel,
          item.contactEmail,
          item.contactWhatsapp,
          ...(item.tags ?? []),
        ]
          .join(' ')
          .toLowerCase();

        return haystack.includes(loweredSearch);
      }),
    );
  }, [moderationItems, search, selectedStatus, selectedType]);

  const activeModerationCount = queueStats.pending + queueStats.in_review;

  const summaryCards = [
    {
      label: 'Prompt Terpublikasi',
      value: snapshot.summary.promptsPublished,
      icon: Sparkles,
      gradient: 'from-fuchsia-500/20 via-fuchsia-500/10 to-purple-500/5',
    },
    {
      label: 'Profil Kreator Aktif',
      value: snapshot.summary.profilesPublished,
      icon: Users,
      gradient: 'from-sky-500/20 via-sky-500/10 to-cyan-500/5',
    },
    {
      label: 'UMKM Tayang',
      value: snapshot.summary.umkmPublished,
      icon: Store,
      gradient: 'from-emerald-500/20 via-emerald-500/10 to-lime-500/5',
    },
    {
      label: 'Antrian Moderasi',
      value: activeModerationCount,
      icon: ClipboardList,
      gradient: 'from-amber-500/20 via-amber-500/10 to-orange-500/5',
    },
  ];

  return (
    <div className="bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-slate-800 pb-10 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-200">
              <ShieldCheck className="h-4 w-4" />
              Admin Dashboard
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">Halo, {adminName.split(' ')[0] || 'Admin'}!</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
                Pantau submission baru, tetapkan penanggung jawab, dan pastikan konten terpublikasi tepat waktu. Gunakan filter
                di bawah untuk fokus pada prioritas tertinggi.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-4 text-sm text-slate-300">
            <p className="font-semibold text-slate-200">Akun admin aktif</p>
            <p>{adminName}</p>
            {adminEmail ? <p className="mt-1 flex items-center gap-2 text-xs text-slate-400"><Mail className="h-4 w-4" />{adminEmail}</p> : null}
            <p className="mt-3 text-xs text-slate-400">
              Total submission aktif: <span className="font-semibold text-slate-200">{moderationItems.length}</span>
            </p>
          </div>
        </header>

        {!hasConfiguredAdmins ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-amber-50">
            <ShieldAlert className="mt-1 h-5 w-5" />
            <div>
              <p className="text-sm font-semibold">Konfigurasi admin belum diatur</p>
              <p className="mt-1 text-sm text-amber-100/90">
                Tambahkan variabel <code className="rounded bg-slate-900/70 px-1 py-0.5 text-xs text-amber-200">ADMIN_EMAILS</code> di
                Vercel agar akses dashboard hanya diberikan kepada email tertentu. Selama belum diatur, semua pengguna yang login akan
                dianggap admin.
              </p>
            </div>
          </div>
        ) : null}

        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/60 px-5 py-6 shadow-lg shadow-slate-950/40 transition hover:border-white/10`}
            >
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${card.gradient} opacity-70`} aria-hidden />
              <card.icon className="mb-4 h-8 w-8 text-white/80" />
              <p className="text-sm font-medium text-slate-200">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Antrian Moderasi</h2>
              <p className="text-sm text-slate-400">
                {activeModerationCount} submission masih menunggu aksi. Filter berdasarkan status, jenis konten, atau cari nama
                pengaju.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:min-w-[240px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama pengaju, judul, atau tag"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/70 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
                <Filter className="h-4 w-4" />
                Filter aktif: {selectedStatus === 'all' ? 'Semua status' : statusLabel[selectedStatus]}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'in_review', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400/70 ${
                  selectedStatus === status
                    ? 'border-emerald-400 bg-emerald-500/10 text-emerald-100'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {status === 'all' ? 'Semua' : statusLabel[status]} ({
                  status === 'all' ? moderationItems.length : queueStats[status]
                })
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {(['all', 'prompt', 'profile', 'umkm'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400/70 ${
                  selectedType === type
                    ? 'border-sky-400 bg-sky-500/10 text-sky-100'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {type === 'all' ? 'Semua Kanal' : typeLabel[type]}
              </button>
            ))}
          </div>

          <ul className="grid gap-4">
            {filteredItems.length === 0 ? (
              <li className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center text-sm text-slate-400">
                <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-amber-400" />
                Tidak ada submission yang cocok dengan filter saat ini.
              </li>
            ) : (
              filteredItems.map((item) => (
                <li key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/30">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${typeTone[item.type]}`}>
                          <Tag className="h-3.5 w-3.5" />
                          {typeLabel[item.type]}
                        </span>
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusTone[item.status]}`}>
                          <Clock className="h-3.5 w-3.5" />
                          {statusLabel[item.status]}
                        </span>
                        <span className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold ${priorityTone[item.priority]}`}>
                          Prioritas {item.priority === 'high' ? 'Tinggi' : item.priority === 'medium' ? 'Sedang' : 'Rendah'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">
                          Dikirim oleh <span className="font-semibold text-slate-200">{item.submittedBy}</span> melalui {item.channel}
                        </p>
                      </div>
                      <dl className="grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
                        <div>
                          <dt className="font-semibold text-slate-200">Dikirim</dt>
                          <dd>{formatDate(item.submittedAt)}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-slate-200">Terakhir diperbarui</dt>
                          <dd>{formatDate(item.lastUpdated)}</dd>
                        </div>
                        {item.assignee ? (
                          <div>
                            <dt className="font-semibold text-slate-200">Penanggung jawab</dt>
                            <dd>{item.assignee}</dd>
                          </div>
                        ) : null}
                        {item.contactEmail ? (
                          <div>
                            <dt className="font-semibold text-slate-200">Kontak email</dt>
                            <dd>{item.contactEmail}</dd>
                          </div>
                        ) : null}
                        {item.contactWhatsapp ? (
                          <div>
                            <dt className="font-semibold text-slate-200">Kontak WhatsApp</dt>
                            <dd>{item.contactWhatsapp}</dd>
                          </div>
                        ) : null}
                      </dl>
                      {item.notes ? (
                        <p className="mt-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-xs leading-relaxed text-slate-300">
                          {item.notes}
                        </p>
                      ) : null}
                      {item.tags && item.tags.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.tags.map((tagValue) => (
                            <span key={tagValue} className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs text-slate-300">
                              #{tagValue}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      {item.relatedLink ? (
                        <Link
                          href={item.relatedLink}
                          target="_blank"
                          className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 hover:text-emerald-200"
                        >
                          Lihat lampiran <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : null}
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:w-48">
                      <label className="text-xs font-semibold text-slate-300">Ubah status</label>
                      <select
                        value={item.status}
                        onChange={(event) => handleStatusChange(item.id, event.target.value as SubmissionStatus)}
                        className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
                      >
                        {(Object.keys(statusLabel) as SubmissionStatus[]).map((status) => (
                          <option key={status} value={status}>
                            {statusLabel[status]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleAssignToMe(item.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-400 hover:text-emerald-50"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Ambil alih
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/30">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Konten Terpublikasi Terbaru</h2>
                <p className="text-sm text-slate-400">Pantau hasil kurasi yang sudah tayang ke publik.</p>
              </div>
            </div>
            <ul className="mt-5 space-y-4">
              {snapshot.publishedResources.slice(0, 10).map((resource) => (
                <li
                  key={resource.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold ${typeTone[resource.type]}`}>
                        {typeLabel[resource.type]}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-300">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(resource.updatedAt)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{resource.title}</p>
                      {resource.owner ? (
                        <p className="text-xs text-slate-400">Oleh {resource.owner}</p>
                      ) : null}
                    </div>
                    {resource.tags && resource.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {resource.tags.slice(0, 4).map((tagValue) => (
                          <span key={tagValue} className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-[11px] text-slate-400">
                            #{tagValue}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <Link
                    href={resource.url}
                    className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-100 transition hover:border-emerald-400 hover:text-emerald-50 md:self-center"
                  >
                    Buka halaman <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/30">
              <h2 className="text-lg font-semibold text-white">Langkah Cepat</h2>
              <p className="mt-1 text-sm text-slate-400">Arahkan admin lain ke kanal yang tepat.</p>
              <div className="mt-4 space-y-3">
                <Link
                  href="/kumpulan-prompt"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40 hover:text-emerald-100"
                >
                  Kelola daftar prompt <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/konten-kreator"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40 hover:text-emerald-100"
                >
                  Review direktori kreator <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/umkm"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40 hover:text-emerald-100"
                >
                  Kurasi etalase UMKM <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/konten-kreator/kirim-profil"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40 hover:text-emerald-100"
                >
                  Formulir pengajuan profil <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-950/30">
              <h2 className="text-lg font-semibold text-white">Catatan Proses</h2>
              <ul className="mt-3 space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-300" />
                  Tandai status menjadi <span className="font-semibold text-slate-100">Siap Publikasi</span> setelah konten final masuk ke repo atau CMS.
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="mt-1 h-4 w-4 text-amber-300" />
                  Gunakan kolom <span className="font-semibold text-slate-100">Catatan</span> untuk memberi konteks singkat agar admin lain dapat melanjutkan proses review.
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="mt-1 h-4 w-4 text-rose-300" />
                  Jika submission melanggar pedoman komunitas, setel status ke <span className="font-semibold text-slate-100">Ditolak</span> dan hubungi pengaju melalui email atau WhatsApp.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
