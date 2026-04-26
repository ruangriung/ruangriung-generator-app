// app/ketentuan-layanan/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Accordion from '@/components/Accordion'; // Import Accordion component
import { FileText, User, Hammer, Lightbulb, Lock, Award, RotateCw, Mail, ArrowLeft } from 'lucide-react'; // Import icons

export const metadata: Metadata = {
  title: 'Ketentuan Layanan - Ruang Riung',
};

export default function KetentuanLayananPage() {
  return (
    <main className="min-h-screen mesh-gradient py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="glass-card p-10 text-center space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-primary-500/10 text-primary-500 mb-2">
            <FileText size={32} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Ketentuan Layanan
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Terakhir diperbarui: 11 Juli 2025
          </p>
        </div>

        <div className="glass-card p-10 space-y-8">
          <div className="prose prose-premium dark:prose-invert max-w-none">
            <div className="space-y-12">
              <section className="space-y-4">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-sm">1</span>
                  Penerimaan Ketentuan
                </h2>
                <div className="glass-inset p-6 rounded-2xl">
                  <p className="text-sm">
                    Dengan mengakses dan menggunakan aplikasi Ruang Riung AI Generator ("Layanan"), Anda setuju untuk mematuhi dan terikat oleh Ketentuan Layanan ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan Layanan kami.
                  </p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-sm">2</span>
                  Deskripsi Layanan
                </h2>
                <p>Layanan kami menyediakan alat berbasis kecerdasan buatan (AI) untuk menghasilkan gambar, ide prompt video, dan audio. Layanan ini menggunakan API pihak ketiga.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'AI Creative Hub', icon: <Lightbulb size={18} /> },
                    { title: 'Multi-Tool Access', icon: <Hammer size={18} /> }
                  ].map((item) => (
                    <div key={item.title} className="flex items-center gap-4 p-4 rounded-xl glass-inset">
                      <div className="text-primary-500">{item.icon}</div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.title}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-sm">3</span>
                  Akun Pengguna
                </h2>
                <p>Untuk mengakses fitur premium, Anda harus mendaftar dan login menggunakan akun Google. Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-sm">4</span>
                  Penggunaan yang Diizinkan
                </h2>
                <ul className="grid gap-3">
                  {[
                    'Tidak menghasilkan konten yang melanggar hukum.',
                    'Tidak mencoba mengakses akun pengguna lain.',
                    'Tidak merusak integritas server atau jaringan.',
                    'Tidak menggunakan layanan untuk spamming.'
                  ].map((text, i) => (
                    <li key={i} className="flex gap-4 p-4 rounded-xl glass-inset text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-sm">5</span>
                  Hak Kekayaan Intelektual
                </h2>
                <p>Konten yang Anda hasilkan menggunakan Layanan ini adalah milik Anda. Namun, Anda memberikan kami lisensi non-eksklusif untuk menampilkan konten tersebut sebatas untuk keperluan operasional.</p>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-500/10">
                <div className="space-y-4">
                  <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                    <Award size={18} className="text-primary-500" />
                    Batasan Tanggung Jawab
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Layanan disediakan "sebagaimana adanya". Kami tidak menjamin bahwa Layanan akan selalu bebas dari gangguan.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                    <Mail size={18} className="text-primary-500" />
                    Kontak & Bantuan
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Jika Anda memiliki pertanyaan, silakan hubungi kami di <a href="mailto:admin@ruangriung.my.id" className="text-primary-500 font-bold hover:underline">admin@ruangriung.my.id</a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center pt-8">
          <Link 
            href="/" 
            className="glass-button px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
