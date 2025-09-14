
'use client';

import { useState, useMemo } from 'react';
import { Prompt } from '../../lib/prompts';
import Link from 'next/link';
import PromptSubmissionForm from '../../components/PromptSubmissionForm';
import Pagination from '../../components/Pagination';
import AdBanner from '../../components/AdBanner';
import { ArrowLeft } from 'lucide-react';

const PROMPTS_PER_PAGE = 9;

interface PromptClientProps {
  prompts: Prompt[];
}

export default function PromptClient({ prompts }: PromptClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    prompts.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [prompts]);

  const filteredPrompts = useMemo(() => {
    setCurrentPage(1); // Reset to first page on filter change
    return prompts.filter(prompt => {
      const matchesSearch = 
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.promptContent.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTag = selectedTag ? prompt.tags.includes(selectedTag) : true;

      return matchesSearch && matchesTag;
    });
  }, [searchTerm, selectedTag, prompts]);

  const paginatedPrompts = useMemo(() => {
    const startIndex = (currentPage - 1) * PROMPTS_PER_PAGE;
    return filteredPrompts.slice(startIndex, startIndex + PROMPTS_PER_PAGE);
  }, [currentPage, filteredPrompts]);

  const totalPages = Math.ceil(filteredPrompts.length / PROMPTS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
        >
          <ArrowLeft size={18} />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Kumpulan Prompt</h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Jelajahi, gunakan, dan bagikan prompt kreatif untuk berbagai model AI.</p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-6 px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300 shadow-lg"
        >
          Kirim Prompt Anda
        </button>
      </div>

      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text"
            placeholder="Cari berdasarkan judul, penulis, atau isi..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          <select
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value)}
            className="p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Semua Tag</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedPrompts.map((prompt: Prompt) => (
          <Link key={prompt.id} href={`/kumpulan-prompt/${prompt.slug}`}>
            <div className="block h-full p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-700">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{prompt.title}</h5>
              <p className="font-normal text-gray-500 dark:text-gray-400">
                Oleh:{' '}
                {prompt.facebook ? (
                  <a
                    href={prompt.facebook}
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Tanggal: {new Date(prompt.date).toLocaleDateString('id-ID')}</p>
              <p className="font-normal text-gray-600 dark:text-gray-300 mb-4">Tool: <strong>{prompt.tool}</strong></p>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map(tag => (
                  <span key={tag} className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="my-8">
        <AdBanner dataAdSlot="5961316189" />
      </div>

      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <PromptSubmissionForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
