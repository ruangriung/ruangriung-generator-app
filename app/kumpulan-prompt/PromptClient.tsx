"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Hash, PenTool, Sparkles, Filter, ChevronDown, Check, X, Tag as TagIcon, Clock, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import PromptCard from '@/components/PromptCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { Prompt } from '@/lib/prompts';
import { useSession } from 'next-auth/react';

interface PromptClientProps {
  prompts: Prompt[];
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  basePath?: string;
  showSubmissionTrigger?: boolean;
}

export default function PromptClient({ 
  prompts: initialPrompts, 
  title = "Kumpulan Prompt Terbaik",
  description = "Temukan koleksi prompt pilihan untuk berbagai alat AI favorit Anda. Mulai dari generasi gambar, teks, hingga kode.",
  backHref = "/",
  backLabel = "Beranda",
  basePath = "/kumpulan-prompt",
  showSubmissionTrigger = true
}: PromptClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [selectedTool, setSelectedTool] = useState(searchParams.get('tool') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const searchInputRef = useRef<HTMLDivElement>(null);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTag, selectedTool]);

  // Get all unique tags and tools for filters
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialPrompts.forEach((p: Prompt) => p.tags.forEach((t: string) => tags.add(t)));
    return Array.from(tags).sort();
  }, [initialPrompts]);

  const allTools = useMemo(() => {
    const tools = new Set<string>();
    initialPrompts.forEach(p => tools.add(p.tool));
    return Array.from(tools).sort();
  }, [initialPrompts]);

  // Handle clicks outside of search to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter prompts
  const filteredPrompts = useMemo(() => {
    return initialPrompts.filter(prompt => {
      const matchesSearch = searchTerm === '' || 
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.promptContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTag = selectedTag === '' || prompt.tags.includes(selectedTag);
      const matchesTool = selectedTool === '' || prompt.tool === selectedTool;
      
      return matchesSearch && matchesTag && matchesTool;
    });
  }, [initialPrompts, searchTerm, selectedTag, selectedTool]);

  // Pagination logic
  const { paginatedPrompts, totalPages } = useMemo(() => {
    const total = filteredPrompts.length;
    const pages = Math.ceil(total / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return {
      paginatedPrompts: filteredPrompts.slice(start, end),
      totalPages: pages
    };
  }, [filteredPrompts, currentPage, itemsPerPage]);

  // Search Suggestions Logic
  const suggestions = useMemo(() => {
    if (searchTerm.length < 2) return [];
    
    const results: { value: string, type: 'title' | 'author', occurrences: number }[] = [];
    const titlesSeen = new Map<string, number>();
    const authorsSeen = new Map<string, number>();

    initialPrompts.forEach(p => {
      if (p.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        titlesSeen.set(p.title, (titlesSeen.get(p.title) || 0) + 1);
      }
      if (p.author.toLowerCase().includes(searchTerm.toLowerCase())) {
        authorsSeen.set(p.author, (authorsSeen.get(p.author) || 0) + 1);
      }
    });

    titlesSeen.forEach((count, title) => results.push({ value: title, type: 'title', occurrences: count }));
    authorsSeen.forEach((count, author) => results.push({ value: author, type: 'author', occurrences: count }));

    return results.sort((a, b) => b.occurrences - a.occurrences).slice(0, 6);
  }, [initialPrompts, searchTerm]);

  const handleSuggestionSelect = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(false);
    updateURL(value, selectedTag, selectedTool);
  };

  const updateURL = (search: string, tag: string, tool: string) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (tag) params.set('tag', tag);
    if (tool) params.set('tool', tool);
    
    const query = params.toString();
    router.push(`${basePath}${query ? `?${query}` : ''}`, { scroll: false });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(true);
    updateURL(value, selectedTag, selectedTool);
  };

  const applyTagFilter = (tag: string) => {
    setSelectedTag(tag);
    updateURL(searchTerm, tag, selectedTool);
  };

  const applyToolFilter = (tool: string) => {
    setSelectedTool(tool);
    updateURL(searchTerm, selectedTag, tool);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
    setSelectedTool('');
    updateURL('', '', '');
  };

  const highlightMatches = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <span key={i} className="text-primary-500 underline underline-offset-4 decoration-2">{part}</span> 
        : part
    );
  };

  const shouldShowSuggestions = showSuggestions && suggestions.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      {/* Back Button */}
      <div className="mb-8">
        <Link 
          href={backHref}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary-500 transition-colors group"
        >
          <div className="h-8 w-8 rounded-xl glass border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:border-primary-500/30 group-hover:bg-primary-500/5 transition-all">
            <ArrowRight size={16} className="rotate-180" />
          </div>
          {backLabel}
        </Link>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} />
            Inspirasi Tanpa Batas
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            {title.split(' ').map((word, i) => i === title.split(' ').length - 1 ? <span key={i} className="gradient-text"> {word}</span> : (i === 0 ? word : ` ${word}`))}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-2xl font-black text-slate-900 dark:text-white leading-none">{filteredPrompts.length}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Prompt Tersedia</div>
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${isFilterOpen ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/40 rotate-180' : 'glass border-2 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-primary-500/30'}`}
          >
            {isFilterOpen ? <X size={24} /> : <Filter size={24} />}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out mb-12 ${isFilterOpen ? 'max-h-[800px] opacity-100 mb-16' : 'max-h-0 opacity-0'}`}>
        <div className="glass-card !p-8 md:!p-10 !rounded-[2.5rem] grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pencarian Cepat</label>
            <div ref={searchInputRef} className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Cari judul, deskripsi, atau penulis..."
                value={searchTerm}
                onChange={e => handleSearchChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl glass-inset bg-transparent text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-slate-400"
              />
              {shouldShowSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-3 z-[100] overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl ring-1 ring-black/5">
                  {suggestions.map(suggestion => (
                    <button
                      key={`${suggestion.type}-${suggestion.value}`}
                      type="button"
                      className="w-full px-6 py-4 text-left border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                      onMouseDown={event => {
                        event.preventDefault();
                        handleSuggestionSelect(suggestion.value);
                      }}
                    >
                      <div className="text-sm font-bold text-slate-900 dark:text-white transition-colors">
                        {highlightMatches(suggestion.value, searchTerm)}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 group-hover:text-primary-500 transition-colors mt-1">
                        {suggestion.type === 'title' ? 'Judul' : 'Penulis'} • {suggestion.occurrences} matches
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kategori Tag</label>
            <div className="relative">
              <select
                value={selectedTag}
                onChange={e => applyTagFilter(e.target.value)}
                className="w-full h-14 px-5 pr-12 rounded-2xl glass-inset bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary-500/50 transition-all appearance-none border-2 border-transparent focus:border-primary-500/30"
              >
                <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Semua Tag</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{tag}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Model AI</label>
            <div className="relative">
              <select
                value={selectedTool}
                onChange={e => applyToolFilter(e.target.value)}
                className="w-full h-14 px-5 pr-12 rounded-2xl glass-inset bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary-500/50 transition-all appearance-none border-2 border-transparent focus:border-primary-500/30"
              >
                <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Semua Alat</option>
                {allTools.map(tool => (
                  <option key={tool} value={tool} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{tool}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button 
              onClick={clearFilters}
              className="px-6 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              Reset Semua Filter
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {paginatedPrompts.length > 0 ? (
          paginatedPrompts.map((prompt) => (
            <PromptCard key={prompt.slug} prompt={prompt} />
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="h-20 w-20 rounded-3xl glass border-2 border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-300">
              <Search size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Prompt Tidak Ditemukan</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Coba gunakan kata kunci lain atau reset filter Anda.</p>
            </div>
            <button 
              onClick={clearFilters}
              className="glass-button !bg-primary-500 !text-white !border-primary-500 shadow-xl shadow-primary-500/20"
            >
              Bersihkan Pencarian
            </button>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="h-12 w-12 rounded-2xl glass border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary-500/30 hover:text-primary-500 transition-all"
          >
            <ArrowRight size={20} className="rotate-180" />
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-12 w-12 rounded-2xl text-xs font-black transition-all ${currentPage === page ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'glass border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-primary-500/30'}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="h-12 w-12 rounded-2xl glass border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:border-primary-500/30 hover:text-primary-500 transition-all"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* Submission CTA */}
      {showSubmissionTrigger && (
        <div className="mt-24 glass-card !p-0 !rounded-[3rem] overflow-hidden">
          <div className="relative p-10 md:p-16 flex flex-col lg:flex-row items-center gap-12">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/10 to-transparent pointer-events-none" />
            
            <div className="flex-1 space-y-6 relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                <PenTool size={28} />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                Punya <span className="gradient-text">Prompt</span> Andalan?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-xl">
                Bagikan kreativitas Anda dengan komunitas! Kirimkan prompt terbaik Anda dan bantu orang lain menghasilkan karya yang luar biasa.
              </p>
              <button 
                onClick={() => router.push('/kumpulan-prompt/kirim')}
                className="btn-primary w-full sm:w-auto"
              >
                Kirim Prompt Sekarang <ArrowRight size={20} />
              </button>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4 relative z-10 w-full lg:w-auto">
              {[
                { icon: <Hash />, label: "Terstruktur", desc: "Format rapi" },
                { icon: <Check />, label: "Teruji", desc: "Hasil terjamin" },
                { icon: <User />, label: "Profil", desc: "Dapatkan kredit" },
                { icon: <Clock />, label: "Update", desc: "Selalu segar" }
              ].map((item, i) => (
                <div key={i} className="glass p-6 rounded-[2rem] border-slate-200/50 dark:border-white/5 space-y-3">
                  <div className="text-primary-500">{item.icon}</div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">{item.label}</div>
                    <div className="text-[10px] font-bold text-slate-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
