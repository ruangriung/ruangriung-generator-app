"use client";

import type { ChangeEvent, FormEvent } from 'react';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { storeCategories, stores } from './data';

const ALL_CATEGORY_VALUE = 'Semua kategori';

export default function UmkmPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY_VALUE);

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchCategory =
        selectedCategory === ALL_CATEGORY_VALUE || store.category === selectedCategory;
      const normalizedSearch = searchTerm.trim().toLowerCase();

      if (!normalizedSearch) {
        return matchCategory;
      }

      const haystack = [store.name, store.tagline, store.location, store.category]
        .join(' ')
        .toLowerCase();

      return matchCategory && haystack.includes(normalizedSearch);
    });
  }, [searchTerm, selectedCategory]);

  const [formData, setFormData] = useState({
    ownerName: '',
    email: '',
    whatsapp: '',
    businessName: '',
    businessCategory: '',
    location: '',
    description: '',
    productHighlights: '',
    imageLinks: '',
    additionalInfo: '',
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      ownerName: '',
      email: '',
      whatsapp: '',
      businessName: '',
      businessCategory: '',
      location: '',
      description: '',
      productHighlights: '',
      imageLinks: '',
      additionalInfo: '',
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.ownerName || !formData.email || !formData.businessName || !formData.description) {
      setFormStatus('error');
      setFormMessage('Mohon lengkapi minimal nama penanggung jawab, email, nama usaha, dan deskripsi.');
      return;
    }

    try {
      setFormStatus('loading');
      setFormMessage('');

      const response = await fetch('/api/umkm-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Gagal mengirimkan data.');
      }

      setFormStatus('success');
      setFormMessage(result?.message || 'Pengajuan berhasil dikirim. Kami akan segera meninjau data Anda.');
      resetForm();
    } catch (error) {
      console.error(error);
      setFormStatus('error');
      setFormMessage(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat mengirimkan formulir. Silakan coba lagi nanti.',
      );
    }
  };

  return (
    <div className="bg-white pb-16 pt-12 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="inline-flex rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-700">
            Etalase UMKM
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Temukan UMKM Inspiratif dari Berbagai Penjuru Nusantara
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Jelajahi katalog UMKM pilihan kami. Ketuk salah satu toko untuk membuka halaman etalase lengkap
            berisi profil usaha, produk unggulan, dan akses langsung ke kontak mereka.
          </p>
        </div>

        <div className="mb-10 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/60 sm:grid-cols-3 sm:items-end">
          <label className="flex flex-col gap-2 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Cari toko atau kata kunci</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Misal: kopi, batik, Yogyakarta"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Filter kategori</span>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
            >
              <option value={ALL_CATEGORY_VALUE}>Semua kategori</option>
              {storeCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filteredStores.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
            {filteredStores.map((store) => (
              <Link
                key={store.id}
                href={`/umkm/${store.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={store.heroImage}
                    alt={store.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent" />
                </div>
                <div className="flex flex-1 flex-col justify-between px-4 py-3 text-left">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{store.category}</p>
                    <h2 className="mt-1 text-sm font-semibold text-slate-900 sm:text-base">{store.name}</h2>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600 sm:text-sm">{store.tagline}</p>
                  </div>
                  <p className="mt-3 flex items-center gap-1 text-xs font-medium text-slate-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21c4.97-4.03 8-7.459 8-11a8 8 0 1 0-16 0c0 3.541 3.03 6.97 8 11z"
                      />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                    {store.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            <p className="text-base font-semibold text-slate-800">Hmm, belum ada hasil yang cocok.</p>
            <p className="mt-2 text-sm">
              Coba ubah kata kunci pencarian atau pilih kategori lain untuk menemukan UMKM yang Anda butuhkan.
            </p>
          </div>
        )}

        <section className="mt-16 rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-8 shadow-sm shadow-indigo-100/70 sm:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Daftarkan UMKM Anda ke dalam Katalog Kami
            </h2>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Ceritakan lebih jauh tentang usaha Anda melalui formulir di bawah ini. Tim kami akan meninjau setiap
              pengajuan dan menghubungi Anda kembali melalui email atau WhatsApp.
            </p>
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-700">
              <strong className="font-semibold">Catatan gambar:</strong> cantumkan tautan drive, folder, atau marketplace
              yang berisi foto produk Anda. Kami tidak menerima unggahan file langsung agar tetap ringan bagi penyimpanan.
            </p>
          </div>

          <form className="mx-auto mt-10 grid max-w-3xl gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-left">
                <span className="text-sm font-medium text-slate-700">Nama penanggung jawab</span>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                />
              </label>
              <label className="flex flex-col gap-2 text-left">
                <span className="text-sm font-medium text-slate-700">Email aktif</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                />
              </label>
              <label className="flex flex-col gap-2 text-left">
                <span className="text-sm font-medium text-slate-700">Nomor WhatsApp</span>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="Contoh: 6281234567890"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                />
              </label>
              <label className="flex flex-col gap-2 text-left">
                <span className="text-sm font-medium text-slate-700">Nama UMKM</span>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                />
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-left">
                <span className="text-sm font-medium text-slate-700">Kategori utama</span>
                <select
                  name="businessCategory"
                  value={formData.businessCategory}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                >
                  <option value="">Pilih kategori</option>
                  {storeCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="Kategori lainnya">Kategori lainnya</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-left">
                <span className="text-sm font-medium text-slate-700">Domisili usaha</span>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Kota/Kabupaten, Provinsi"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-left">
              <span className="text-sm font-medium text-slate-700">Deskripsi singkat usaha</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              />
            </label>

            <label className="flex flex-col gap-2 text-left">
              <span className="text-sm font-medium text-slate-700">Sorotan produk/jasa</span>
              <textarea
                name="productHighlights"
                value={formData.productHighlights}
                onChange={handleInputChange}
                rows={3}
                placeholder="Boleh cantumkan daftar singkat produk unggulan atau layanan utama"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              />
            </label>

            <label className="flex flex-col gap-2 text-left">
              <span className="text-sm font-medium text-slate-700">Tautan gambar atau katalog produk</span>
              <textarea
                name="imageLinks"
                value={formData.imageLinks}
                onChange={handleInputChange}
                rows={3}
                placeholder="Contoh: https://drive.google.com/... atau tautan marketplace"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              />
            </label>

            <label className="flex flex-col gap-2 text-left">
              <span className="text-sm font-medium text-slate-700">Informasi tambahan (opsional)</span>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={3}
                placeholder="Cerita brand, pencapaian, atau kanal media sosial"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
              />
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={formStatus === 'loading'}
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-400/50 transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {formStatus === 'loading' ? 'Mengirim data…' : 'Kirim pengajuan UMKM'}
              </button>

              <p
                className={`text-sm ${
                  formStatus === 'success'
                    ? 'text-emerald-600'
                    : formStatus === 'error'
                    ? 'text-rose-600'
                    : 'text-slate-500'
                }`}
                role="status"
                aria-live="polite"
              >
                {formMessage}
              </p>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
