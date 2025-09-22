import type { Metadata } from 'next';
import KeywordGeneratorClient from './KeywordGeneratorClient';

export const metadata: Metadata = {
  title: 'Unique Art Name Prompt Lab | RuangRiung',
  description:
    'Eksplorasi 20 kata kunci baru yang benar-benar unik untuk menguji ide prompt gambar AI dengan dukungan model teks Pollinations.',
};

export default function UniqueArtNamePage() {
  return <KeywordGeneratorClient />;
}
