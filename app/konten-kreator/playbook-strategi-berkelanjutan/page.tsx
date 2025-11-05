import type { Metadata } from 'next';
import PlaybookStrategiBerkelanjutan from './PlaybookStrategiBerkelanjutanClient';

const title = 'Playbook Strategi Kreator Berkelanjutan - RuangRiung';
const description =
  'Panduan langkah demi langkah untuk kreator pemula hingga berpengalaman: dari tujuan, produksi, distribusi, storytelling, kolaborasi, sampai etika profesional.';
const url = 'https://ruangriung.my.id/konten-kreator/playbook-strategi-berkelanjutan';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    type: 'article',
    url,
    siteName: 'RuangRiung',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function Page() {
  return <PlaybookStrategiBerkelanjutan />;
}
