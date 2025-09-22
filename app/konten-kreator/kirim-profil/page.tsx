'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowLeft, Sparkles, Send, CheckCircle2, Info, FileText } from 'lucide-react';

const DynamicTurnstile = dynamic(() => import('@/components/TurnstileWidget'), {
  ssr: false,
  loading: () => (
    <div className="h-[65px] w-[300px] rounded-2xl bg-gray-200/80 dark:bg-gray-800/80" />
  ),
});

type ProfileSubmission = {
  name: string;
  role: string;
  description: string;
  brandTagline: string;
  audience: string;
  contentPillars: string;
  brandValues: string;
  customFieldOne: string;
  customFieldTwo: string;
  customFieldThree: string;
  facebook: string;
  youtube: string;
  instagram: string;
  threads: string;
  x: string;
  website: string;
  portfolio: string;
  contactEmail: string;
  contactWhatsapp: string;
  highlight: string;
};

const initialForm: ProfileSubmission = {
  name: '',
  role: '',
  description: '',
  brandTagline: '',
  audience: '',
  contentPillars: '',
  brandValues: '',
  customFieldOne: '',
  customFieldTwo: '',
  customFieldThree: '',
  facebook: '',
  youtube: '',
  instagram: '',
  threads: '',
  x: '',
  website: '',
  portfolio: '',
  contactEmail: '',
  contactWhatsapp: '',
  highlight: '',
};

const fieldLabels: Record<keyof ProfileSubmission, string> = {
  name: 'Nama lengkap',
  role: 'Peran atau spesialisasi',
  description: 'Deskripsi singkat',
  brandTagline: 'Tagline personal branding',
  audience: 'Audiens utama',
  contentPillars: 'Pilar konten utama',
  brandValues: 'Nilai atau pesan utama personal brand',
  customFieldOne: 'Kolom tambahan 1',
  customFieldTwo: 'Kolom tambahan 2',
  customFieldThree: 'Kolom tambahan 3',
  facebook: 'Profil Facebook',
  youtube: 'Channel YouTube',
  instagram: 'Profil Instagram',
  threads: 'Profil Threads',
  x: 'Profil X (d/h Twitter)',
  website: 'Website atau blog',
  portfolio: 'Tautan karya unggulan',
  contactEmail: 'Email yang bisa dihubungi',
  contactWhatsapp: 'Kontak WhatsApp',
  highlight: 'Sorotan pencapaian',
};

const requiredFields: (keyof ProfileSubmission)[] = [
  'name',
  'description',
  'facebook',
  'contactEmail',
];

const inputClassName =
  'w-full rounded-2xl border border-purple-200 bg-white/80 px-4 py-3 text-sm font-medium text-gray-900 shadow-sm transition hover:border-purple-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-purple-800 dark:bg-gray-900/60 dark:text-gray-100 dark:focus:border-purple-500 dark:focus:ring-purple-400';

const textAreaClassName = `${inputClassName} min-h-[140px] resize-y align-top`;

export default function KirimProfilPage() {
  const [formData, setFormData] = useState<ProfileSubmission>(initialForm);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  const handleCaptchaSuccess = (tokenValue: string) => {
    setToken(tokenValue);
    setCaptchaError(false);
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setFeedbackMessage(null);

    const trimmedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]),
    ) as ProfileSubmission;

    const missingFields = requiredFields.filter(field => !trimmedFormData[field]);

    if (missingFields.length > 0) {
      const readableMissing = missingFields.map(field => fieldLabels[field]).join(', ');
      setErrorMessage(`Lengkapi terlebih dahulu: ${readableMissing}.`);
      return;
    }

    const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (!emailPattern.test(trimmedFormData.contactEmail)) {
      setErrorMessage('Pastikan email kontak ditulis dengan format yang benar.');
      return;
    }

    if (!token) {
      setCaptchaError(true);
      return;
    }

    setCaptchaError(false);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...trimmedFormData,
          token,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setCaptchaError(true);
          setToken('');
        }

        setErrorMessage(result?.message ?? 'Gagal mengirim pengajuan profil. Silakan coba lagi.');
        return;
      }

      setCaptchaError(false);
      setFeedbackMessage(result?.message ?? 'Profil Anda berhasil dikirim! Tim RuangRiung akan meninjaunya.');
      setFormData(initialForm);
      setToken('');
    } catch (submissionError) {
      console.error('Gagal mengirim pengajuan profil:', submissionError);
      setErrorMessage('Terjadi kesalahan saat mengirim pengajuan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-16 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex justify-center">
            <Link
              href="/konten-kreator"
              className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-5 py-2 text-sm font-semibold text-purple-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-purple-50 dark:border-purple-800 dark:bg-gray-900 dark:text-purple-200 dark:hover:bg-purple-900/60"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Direktori
            </Link>
          </div>

          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-700 shadow-sm dark:bg-purple-900/40 dark:text-purple-200">
              <Sparkles className="h-4 w-4" />
              Pengajuan Profil Kreator
            </span>
            <h1 className="mt-6 text-4xl font-bold text-gray-900 dark:text-gray-100">Perkuat Personal Branding Anda</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Isi formulir di bawah untuk memperkenalkan diri, memaparkan identitas personal branding, menampilkan karya, serta mencantumkan kanal digital utama Anda.
              Tim RuangRiung akan menghubungi Anda bila profil siap ditayangkan.
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr,1fr]">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 rounded-3xl border border-purple-100 bg-white/90 p-8 shadow-xl shadow-purple-100/40 backdrop-blur dark:border-purple-900/60 dark:bg-gray-900/70 dark:shadow-black/40"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Nama lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="Mis. Koko Ajeeb"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Peran atau spesialisasi (opsional)
                  </label>
                  <input
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="Mis. Storyteller, Kurator Prompt"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Deskripsi singkat <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={textAreaClassName}
                  placeholder="Ceritakan dalam 2-3 kalimat tentang gaya berkarya, komunitas, atau misi Anda."
                  required
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="brandTagline" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Tagline personal branding (opsional)
                  </label>
                  <input
                    id="brandTagline"
                    name="brandTagline"
                    value={formData.brandTagline}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="Mis. Visual Storyteller untuk UMKM berani tampil"
                  />
                </div>
                <div>
                  <label htmlFor="audience" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Audiens utama (opsional)
                  </label>
                  <input
                    id="audience"
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="Mis. Komunitas kreator, brand lokal fashion, atau UMKM digital"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contentPillars" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Pilar konten utama (opsional)
                </label>
                <textarea
                  id="contentPillars"
                  name="contentPillars"
                  value={formData.contentPillars}
                  onChange={handleChange}
                  className={textAreaClassName}
                  placeholder="Sebutkan 2-3 tema besar konten Facebook Pro Anda, mis. tips produksi AI, showcase kolaborasi, ulasan alat."
                />
              </div>

              <div>
                <label htmlFor="brandValues" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Nilai atau pesan utama personal brand
                </label>
                <textarea
                  id="brandValues"
                  name="brandValues"
                  value={formData.brandValues}
                  onChange={handleChange}
                  className={textAreaClassName}
                  placeholder="Jelaskan kata kunci, tone komunikasi, atau janji utama yang selalu Anda bawa di setiap kolaborasi."
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label htmlFor="customFieldOne" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Kolom tambahan 1 (opsional)
                  </label>
                  <input
                    id="customFieldOne"
                    name="customFieldOne"
                    value={formData.customFieldOne}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="Mis. Program rutin, jadwal live, atau kelas yang Anda jalankan"
                  />
                </div>
                <div>
                  <label htmlFor="customFieldTwo" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Kolom tambahan 2 (opsional)
                  </label>
                  <input
                    id="customFieldTwo"
                    name="customFieldTwo"
                    value={formData.customFieldTwo}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="Mis. Daftar layanan, komunitas yang diampu, atau paket kolaborasi"
                  />
                </div>
                <div>
                  <label htmlFor="customFieldThree" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Kolom tambahan 3 (opsional)
                  </label>
                  <input
                    id="customFieldThree"
                    name="customFieldThree"
                    value={formData.customFieldThree}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="Mis. Media kit, link katalog, atau catatan penting lainnya"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="facebook" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Profil Facebook <span className="text-red-500">*</span>
                </label>
                <input
                  id="facebook"
                  name="facebook"
                  type="url"
                  value={formData.facebook}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="https://web.facebook.com/nama.profil"
                  required
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Kami memprioritaskan tautan Facebook karena komunitas utama RuangRiung aktif di sana.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="youtube" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Channel YouTube
                  </label>
                  <input
                    id="youtube"
                    name="youtube"
                    type="url"
                    value={formData.youtube}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="https://youtube.com/@username"
                  />
                </div>
                <div>
                  <label htmlFor="instagram" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Profil Instagram
                  </label>
                  <input
                    id="instagram"
                    name="instagram"
                    type="url"
                    value={formData.instagram}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div>
                  <label htmlFor="threads" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Profil Threads
                  </label>
                  <input
                    id="threads"
                    name="threads"
                    type="url"
                    value={formData.threads}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="https://threads.net/@username"
                  />
                </div>
                <div>
                  <label htmlFor="x" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Profil X (d/h Twitter)
                  </label>
                  <input
                    id="x"
                    name="x"
                    type="url"
                    value={formData.x}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div>
                  <label htmlFor="website" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Website atau blog
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="https://portfolio.com"
                  />
                </div>
                <div>
                  <label htmlFor="portfolio" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Tautan karya unggulan
                  </label>
                  <input
                    id="portfolio"
                    name="portfolio"
                    type="url"
                    value={formData.portfolio}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="Drive, Notion, atau galeri pilihan"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="highlight" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Sorotan pencapaian atau kolaborasi penting
                </label>
                <textarea
                  id="highlight"
                  name="highlight"
                  value={formData.highlight}
                  onChange={handleChange}
                  className={textAreaClassName}
                  placeholder="Sebutkan penghargaan, kolaborasi, atau proyek komunitas yang paling membanggakan."
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="contactEmail" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Email yang bisa dihubungi <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="nama@domain.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contactWhatsapp" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Kontak WhatsApp (opsional)
                  </label>
                  <input
                    id="contactWhatsapp"
                    name="contactWhatsapp"
                    value={formData.contactWhatsapp}
                    onChange={handleChange}
                    className={inputClassName}
                    placeholder="+62..."
                  />
                </div>
              </div>

              <div className="mt-2 flex flex-col items-center gap-2">
                <DynamicTurnstile onSuccess={handleCaptchaSuccess} options={{ theme: 'auto' }} />
                {captchaError && (
                  <p className="text-xs font-medium text-red-600 dark:text-red-400">
                    Silakan selesaikan verifikasi keamanan sebelum mengirim.
                  </p>
                )}
              </div>

              {errorMessage && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-950/50 dark:text-red-200">
                  {errorMessage}
                </div>
              )}

              {feedbackMessage && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-200">
                  {feedbackMessage}
                </div>
              )}

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition hover:from-purple-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting || !token}
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}
              </button>
            </form>

            <aside className="flex h-fit flex-col gap-6 rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8 text-left shadow-lg shadow-purple-100/40 dark:border-purple-900/60 dark:from-purple-950 dark:via-gray-950 dark:to-blue-950 dark:shadow-black/40">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Panduan pengisian cepat</h2>
              </div>
              <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                  <span>
                    <strong>Susun tagline yang berkesan.</strong> Padatkan personal branding dalam 5-7 kata agar pembaca langsung menangkap janji utama Anda.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                  <span>
                    <strong>Jelaskan pilar dan nilai brand.</strong> Manfaatkan kolom pilar konten dan nilai brand untuk menuliskan tema utama sekaligus sikap yang konsisten Anda suarakan.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                  <span>
                    <strong>Tulis deskripsi otentik.</strong> Ceritakan karakter berkarya Anda agar tim mudah mengenali ciri khas konten yang ditampilkan.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                  <span>
                    <strong>Pastikan tautan dan portofolio aktif.</strong> Gunakan URL lengkap untuk Facebook, kanal lain, dan karya unggulan agar mudah diverifikasi.
                  </span>
                </li>
              </ul>
              <div className="rounded-2xl border border-purple-200/70 bg-white/80 p-5 text-sm text-gray-600 shadow-sm dark:border-purple-800/60 dark:bg-gray-900/70 dark:text-gray-300">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 text-purple-600 dark:text-purple-300" />
                  <div>
                    <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Proses kurasi</h3>
                    <p>
                      Tim kami meninjau setiap pengajuan secara manual. Bila diperlukan klarifikasi, kami akan menghubungi melalui
                      email atau WhatsApp yang Anda cantumkan.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Dengan mengirimkan formulir ini Anda menyetujui bahwa konten dan tautan yang dibagikan aman ditampilkan secara
                publik di ruangriung.my.id.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
