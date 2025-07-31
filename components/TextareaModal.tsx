'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface TextareaModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  title: string;
  readOnly?: boolean;
}

export default function TextareaModal({ isOpen, onClose, value, onChange, title, readOnly = false }: TextareaModalProps) {
  if (!isOpen) return null;

  const [internalValue, setInternalValue] = useState(value);

  const handleSave = () => {
    if (!readOnly) {
      onChange(internalValue);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      {/* <--- PERUBAHAN: Tambahkan dark:bg-dark-bg dan dark:shadow-dark-neumorphic */}
      <div className="w-full max-w-2xl bg-light-bg dark:bg-dark-bg rounded-2xl shadow-lg flex flex-col">
        {/* <--- PERUBAHAN: Tambahkan dark:border-gray-700, dark:text-gray-200 */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"> {/* <--- PERUBAHAN */}
            <X size={24} className="text-gray-600 dark:text-gray-300" /> {/* <--- PERUBAHAN */}
          </button>
        </div>
        
        <div className="p-4 flex-grow">
          <textarea
            value={internalValue}
            onChange={(e) => !readOnly && setInternalValue(e.target.value)}
            readOnly={readOnly}
            // <--- PERUBAHAN: Tambahkan dark:bg-gray-700, dark:border-gray-600, dark:text-gray-200
            className="w-full h-64 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-gray-200"
          />
        </div>

        {/* <--- PERUBAHAN: Tambahkan dark:border-gray-700 */}
        <div className="flex justify-end p-4 border-t border-gray-300 dark:border-gray-700">
          <button
            onClick={handleSave}
            // <--- PERUBAHAN: Tambahkan dark:active:shadow-dark-neumorphic-button-active
            className="inline-flex items-center justify-center px-6 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-colors active:shadow-inner dark:active:shadow-dark-neumorphic-button-active"
          >
            {readOnly ? <X size={20} className="mr-2" /> : <Check size={20} className="mr-2" />}
            {readOnly ? 'Tutup' : 'Simpan & Tutup'}
          </button>
        </div>
      </div>
    </div>
  );
}