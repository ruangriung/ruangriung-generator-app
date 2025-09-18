import { getAllPrompts } from '../../../lib/prompts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import AdBanner from '@/components/AdBanner';
import CopyButton from '@/components/CopyButton';
import PromptSubmissionTrigger from '@/components/PromptSubmissionTrigger';

export default async function PromptDetailPage({ params }: { params: { slug: string } }) {
  const prompts = await getAllPrompts();
  const prompt = prompts.find(currentPrompt => currentPrompt.slug === params.slug);

  if (!prompt) {
    notFound();
  }

  const relatedPrompts = prompts
    .filter(related => {
      if (related.slug === prompt.slug) {
        return false;
      }

      if (!related.tags.length || !prompt.tags.length) {
        return false;
      }

      return related.tags.some(tag => prompt.tags.includes(tag));
    })
    .slice(0, 4);

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
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Link Gambar:</p>
            <a
              href={prompt.image}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {prompt.image}
            </a>
          </div>
        )}
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{prompt.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          By{' '}
          {prompt.link || prompt.facebook ? (
            <a
              href={prompt.link || prompt.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {prompt.author}
            </a>
          ) : (
            prompt.author
          )}
        </p>
        <p className="text-md text-gray-500 dark:text-gray-400 mb-2">Tanggal: {new Date(prompt.date).toLocaleDateString('id-ID')}</p>
        <p className="text-md text-gray-500 dark:text-gray-400 mb-6">Tool: {prompt.tool}</p>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PromptSubmissionTrigger className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300 shadow-lg" />
          <div className="flex w-full justify-end sm:w-auto">
            <CopyButton text={prompt.promptContent} />
          </div>
        </div>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prompt.promptContent}</ReactMarkdown>
        </div>

        {relatedPrompts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Prompt Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPrompts.map(relatedPrompt => (
                <Link
                  key={relatedPrompt.slug}
                  href={`/kumpulan-prompt/${relatedPrompt.slug}`}
                  className="block h-full"
                >
                  <div className="h-full p-5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 dark:bg-gray-900 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {relatedPrompt.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Oleh{' '}
                      {relatedPrompt.link || relatedPrompt.facebook ? (
                        <a
                          href={relatedPrompt.link || relatedPrompt.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {relatedPrompt.author}
                        </a>
                      ) : (
                        relatedPrompt.author
                      )}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Tool:{' '}
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {relatedPrompt.tool}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {relatedPrompt.promptContent.length > 120
                        ? `${relatedPrompt.promptContent.slice(0, 120)}...`
                        : relatedPrompt.promptContent}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {relatedPrompt.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {relatedPrompt.tags.length > 3 && (
                        <span className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">
                          +{relatedPrompt.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

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
