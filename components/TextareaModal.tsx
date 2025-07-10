'use client';

import { useState } from 'react'; // <-- KESALAHAN ADA DI SINI, LUPA IMPORT
import { Check, X } from 'lucide-react';

interface TextareaModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  title: string;
}

export default function TextareaModal({ isOpen, onClose, value, onChange, title }: TextareaModalProps) {
  if (!isOpen) return null;

  const [internalValue, setInternalValue] = useState(value);

  const handleSave = () => {
    onChange(internalValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="w-full max-w-2xl bg-light-bg rounded-2xl shadow-lg flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        
        <div className="p-4 flex-grow">
          <textarea
            value={internalValue}
            onChange={(e) => setInternalValue(e.target.value)}
            className="w-full h-64 p-3 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex justify-end p-4 border-t border-gray-300">
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center px-6 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition-colors"
          >
            <Check size={20} className="mr-2" />
            Simpan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}