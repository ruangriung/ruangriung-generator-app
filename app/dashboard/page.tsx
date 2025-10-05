import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { getAdminEmails, hasConfiguredAdminEmails, isAdminEmail } from '@/lib/dashboard/access-control';
import { loadDashboardSnapshot } from '@/lib/dashboard/data';
import { initialModerationItems } from '@/lib/dashboard/moderation-queue';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard Admin RuangRiung',
  description:
    'Kelola submission prompt, profil kreator, dan UMKM dari satu pusat kendali yang hanya dapat diakses oleh tim admin.',
};

const buildLoginRedirect = () => `/premium/login?callbackUrl=${encodeURIComponent('/dashboard')}`;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(buildLoginRedirect());
  }

  const email = session.user?.email ?? null;

  if (!isAdminEmail(email)) {
    const configuredAdmins = getAdminEmails();

    return (
      <div className="bg-slate-950">
        <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 py-24 text-center text-slate-100">
          <div className="inline-flex rounded-full border border-slate-700/60 bg-slate-900/40 px-4 py-1 text-sm font-medium text-slate-300">
            Akses dashboard terbatas
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Anda belum terdaftar sebagai admin</h1>
            <p className="text-base leading-relaxed text-slate-300">
              Dashboard ini hanya bisa dibuka oleh tim pengelola RuangRiung. Pastikan Anda menggunakan akun email yang
              sudah terdaftar sebagai admin. Jika Anda membutuhkan akses, silakan hubungi super admin untuk ditambahkan.
            </p>
          </div>
          {configuredAdmins.length > 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-4 text-left shadow-lg shadow-slate-950/40">
              <p className="text-sm font-semibold text-slate-200">Daftar email admin aktif</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                {configuredAdmins.map((adminEmail) => (
                  <li key={adminEmail}>{adminEmail}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <a
            href="mailto:ruangriung.team@gmail.com?subject=Permintaan%20Akses%20Dashboard%20Admin"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Hubungi Tim RuangRiung
          </a>
        </div>
      </div>
    );
  }

  const snapshot = await loadDashboardSnapshot();

  return (
    <DashboardClient
      adminName={session.user?.name ?? session.user?.email ?? 'Admin RuangRiung'}
      adminEmail={email ?? undefined}
      snapshot={snapshot}
      initialQueue={initialModerationItems}
      hasConfiguredAdmins={hasConfiguredAdminEmails}
    />
  );
}
