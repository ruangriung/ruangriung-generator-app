'use client';

import { ReactNode, useState } from 'react';
import { PenSquare } from 'lucide-react';
import ArticleSubmissionForm from './ArticleSubmissionForm';

interface ArticleSubmissionTriggerProps {
  label?: ReactNode;
  className?: string;
}

const BASE_BUTTON_CLASS =
  'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-neumorphic-button dark:shadow-dark-neumorphic-button bg-purple-600 text-white hover:bg-purple-700 transition-colors active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset';

const DEFAULT_LABEL = (
  <>
    <PenSquare size={18} />
    <span>Submit Artikel</span>
  </>
);

export default function ArticleSubmissionTrigger({
  label = DEFAULT_LABEL,
  className,
}: ArticleSubmissionTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const combinedClassName = className ? `${BASE_BUTTON_CLASS} ${className}` : BASE_BUTTON_CLASS;

  return (
    <>
      <button type="button" onClick={handleOpen} className={combinedClassName}>
        {label}
      </button>
      <ArticleSubmissionForm isOpen={isOpen} onClose={handleClose} />
    </>
  );
}
