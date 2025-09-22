import type { Metadata } from 'next';
import KeywordGeneratorClient from './KeywordGeneratorClient';

export const metadata: Metadata = {
  title: 'Generator Kata Kunci Antik AI | RuangRiung',
  description:
    'Bangun 20 kata kunci antik yang benar-benar baru untuk kebutuhan prompt gambar AI dengan bantuan model teks Pollinations.',
};

export default function KataKunciUnikPage() {
  return <KeywordGeneratorClient />;
}
