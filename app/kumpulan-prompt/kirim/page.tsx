import type { Metadata } from 'next';
import PromptSubmissionPageClient from './PromptSubmissionPageClient';

const PAGE_URL = 'https://ruangriung.my.id/kumpulan-prompt/kirim';
const SOCIAL_IMAGE_URL = 'https://ruangriung.my.id/og-image/og-image-rr.png';

export const metadata: Metadata = {
  title: 'Kirim Prompt AI Kreatif - RuangRiung Generator',
  description:
    'Bagikan prompt AI buatanmu ke komunitas RuangRiung. Prompt yang berhasil dikirim akan tampil di katalog dan mendapatkan halaman detail secara otomatis.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Kirim Prompt AI Kreatif - RuangRiung Generator',
    description:
      'Isi formulir kirim prompt dan jadikan inspirasimu tersedia bagi kreator lainnya. Prompt yang disetujui langsung muncul di katalog RuangRiung.',
    url: PAGE_URL,
    siteName: 'RuangRiung AI Generator',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: SOCIAL_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'Kirim prompt AI kreatif melalui RuangRiung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kirim Prompt AI Kreatif - RuangRiung Generator',
    description:
      'Kirim prompt AI terbaikmu dan buat halaman detail otomatis untuk dibagikan kepada komunitas.',
    images: [SOCIAL_IMAGE_URL],
  },
};

export default function PromptSubmissionPage() {
  return <PromptSubmissionPageClient />;
}
