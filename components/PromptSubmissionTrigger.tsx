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
  'glass-button !bg-primary-500/10 hover:!bg-primary-500 !text-primary-500 hover:!text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary-500/20 transition-all active:scale-95 border-2 border-primary-500/20 hover:border-primary-500';

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
