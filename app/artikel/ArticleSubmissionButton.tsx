import { ARTICLE_SUBMISSION_URL } from '@/lib/externalLinks';
import { PenSquare } from 'lucide-react';

type ArticleSubmissionButtonProps = {
  className?: string;
};

const baseClassName =
  'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-neumorphic-button dark:shadow-dark-neumorphic-button bg-purple-600 text-white hover:bg-purple-700 transition-colors active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset';

const isExternalUrl = (url: string) => /^https?:\/\//.test(url);

export default function ArticleSubmissionButton({ className }: ArticleSubmissionButtonProps) {
  const href = ARTICLE_SUBMISSION_URL;
  const external = isExternalUrl(href);
  const combinedClassName = className ? `${baseClassName} ${className}` : baseClassName;

  return (
    <a
      href={href}
      className={combinedClassName}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <PenSquare size={18} />
      <span>Submit Artikel</span>
    </a>
  );
}
