import type { Metadata } from 'next';
import AsistenAIClient from './AsistenAIClient';

export const metadata: Metadata = {
  title: 'Asisten AI RuangRiung',
  description:
    'Temui asisten AI RuangRiung untuk berdiskusi, mencari ide, dan menghasilkan konten kreatif dengan beragam template percakapan siap pakai.',
  keywords: [
    'asisten ai',
    'chatbot ruangriung',
    'template percakapan ai',
    'ruangriung ai assistant',
    'generator konten ai',
  ],
};

export default function AsistenAIPage() {
  return <AsistenAIClient />;
}
