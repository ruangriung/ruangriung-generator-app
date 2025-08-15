import IdCardGeneratorClient from './IdCardGeneratorClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ID Card Mahasiswa Generator - RuangRiung',
  description: 'Buat kartu identitas mahasiswa kustom dengan mudah. Tambahkan foto, logo, latar belakang, dan unduh sebagai gambar.',
  keywords: 'id card generator, generator kartu mahasiswa, buat id card, kartu identitas online',
};

export default function IdCardGeneratorPage() {
  return <IdCardGeneratorClient />;
}
