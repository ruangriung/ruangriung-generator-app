import Link from 'next/link';
import { Prompt } from '@/lib/prompts';
import { Tag, Clock, User, ArrowRight } from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Link 
      href={`/kumpulan-prompt/${prompt.slug}`}
      className="group relative glass-card !p-0 !rounded-[2rem] overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500"
    >
      {/* Visual Header */}
      <div className="relative h-48 overflow-hidden">
        {prompt.image ? (
          <img 
            src={prompt.image} 
            alt={prompt.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/20 via-primary-500/5 to-transparent flex items-center justify-center">
            <Tag size={48} className="text-primary-500/20" />
          </div>
        )}
        
        {/* Tool Badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">
          {prompt.tool}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1 space-y-4">
        <div className="space-y-2 flex-1">
          <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-primary-500 transition-colors">
            {prompt.title}
          </h3>
          <div className="flex items-center gap-2 text-slate-400">
            <User size={14} />
            <span className="text-xs font-bold">{prompt.author}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {prompt.tags.slice(0, 3).map(tag => (
            <span 
              key={tag}
              className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-[10px] font-bold text-slate-600 dark:text-slate-400"
            >
              #{tag}
            </span>
          ))}
          {prompt.tags.length > 3 && (
            <span className="text-[10px] font-bold text-slate-400">+{prompt.tags.length - 3}</span>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {new Date(prompt.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="text-primary-500 transform transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
}
