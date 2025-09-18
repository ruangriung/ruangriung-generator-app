'use client';

import { ReactNode, useState } from 'react';
import PromptSubmissionForm from './PromptSubmissionForm';

interface PromptSubmissionTriggerProps {
  label?: ReactNode;
  className?: string;
}

const DEFAULT_BUTTON_CLASS =
  'px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300 shadow-lg';

export default function PromptSubmissionTrigger({
  label = 'Kirim Prompt Anda',
  className,
}: PromptSubmissionTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <button type="button" onClick={handleOpen} className={className ?? DEFAULT_BUTTON_CLASS}>
        {label}
      </button>
      <PromptSubmissionForm isOpen={isOpen} onClose={handleClose} />
    </>
  );
}
