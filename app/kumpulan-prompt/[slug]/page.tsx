import { getPromptBySlug } from '../../../lib/prompts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import CopyButton from '@/components/CopyButton';

export default async function PromptDetailPage({ params }: { params: { slug: string } }) {
  const prompt = await getPromptBySlug(params.slug);

  if (!prompt) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-center">
        <Link
          href="/kumpulan-prompt"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
        >
          <ArrowLeft size={18} />
          <span>Kembali ke Kumpulan Prompt</span>
        </Link>
        <Link
          href="/"
          className="ml-4 inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
        >
          <ArrowLeft size={18} />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        {prompt.image && (
          <div className="mb-8">
            <img src={prompt.image} alt={prompt.title} className="w-full h-[300px] object-cover rounded-lg shadow-lg" />
          </div>
        )}
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{prompt.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">By {prompt.author}</p>
        <p className="text-md text-gray-500 dark:text-gray-400 mb-2">Tanggal: {new Date(prompt.date).toLocaleDateString('id-ID')}</p>
        <p className="text-md text-gray-500 dark:text-gray-400 mb-6">Tool: {prompt.tool}</p>

        <div className="mb-4 flex justify-end">
          <CopyButton text={prompt.promptContent} />
        </div>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p>{prompt.promptContent}</p>
        </div>

        <div className="my-8">
          <AdBanner dataAdSlot="5961316189" />
        </div>

        <div className="mt-8">
          {prompt.tags.map(tag => (
            <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}