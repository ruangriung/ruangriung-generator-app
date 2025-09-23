'use client';

import { MouseEvent, ReactNode, useState } from 'react';
import PromptSubmissionForm from './PromptSubmissionForm';
import { Prompt } from '@/lib/prompts';

interface PromptSubmissionTriggerProps {
  label?: ReactNode;
  className?: string;
  mode?: 'create' | 'edit';
  prompt?: Prompt;
  onSuccess?: (prompt: Prompt) => void;
}

const DEFAULT_BUTTON_CLASS =
  'px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300 shadow-lg';

export default function PromptSubmissionTrigger({
  label,
  className,
  mode = 'create',
  prompt,
  onSuccess,
}: PromptSubmissionTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  const buttonLabel = label ?? (mode === 'edit' ? 'Edit Prompt' : 'Kirim Prompt Anda');

  return (
    <>
      <button type="button" onClick={handleOpen} className={className ?? DEFAULT_BUTTON_CLASS}>
        {buttonLabel}
      </button>
      <PromptSubmissionForm
        isOpen={isOpen}
        onClose={handleClose}
        mode={mode}
        initialPrompt={prompt}
        onSuccess={onSuccess}
      />
    </>
  );
}
