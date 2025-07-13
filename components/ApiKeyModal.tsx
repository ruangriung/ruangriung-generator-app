'use client';

import { useState } from 'react';
import { Key, X } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
  modelName: 'DALL-E 3' | 'Leonardo' | '';
}

const instructions = {
  'DALL-E 3': (
    <>
      <p>Untuk menggunakan DALL-E 3, Anda memerlukan API Key dari OpenAI.</p>
      <ol className="list-decimal list-inside space-y-1 mt-2 text-sm">
        <li>Login atau daftar di <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer" className="text-purple-500 underline">platform.openai.com</a>.</li>
        <li>Buka halaman "API keys" di menu pengaturan akun Anda.</li>
        <li>Klik "Create new secret key" dan salin key yang muncul.</li>
        <li>Tempelkan (paste) key tersebut di bawah ini.</li>
      </ol>
      <p className="text-xs mt-2 italic">Catatan: Penggunaan API key Anda akan dikenakan biaya sesuai dengan ketentuan OpenAI.</p>
    </>
  ),
  'Leonardo': (
     <>
      <p>Untuk menggunakan Leonardo, Anda memerlukan API Key dari Leonardo.Ai.</p>
      <ol className="list-decimal list-inside space-y-1 mt-2 text-sm">
        <li>Login atau daftar di <a href="https://app.leonardo.ai/" target="_blank" rel="noopener noreferrer" className="text-purple-500 underline">app.leonardo.ai</a>.</li>
        <li>Pergi ke "API Access" di bagian pengaturan pengguna.</li>
        <li>Klik "Generate New Key" atau salin key yang sudah ada.</li>
        <li>Tempelkan (paste) key tersebut di bawah ini.</li>
      </ol>
      <p className="text-xs mt-2 italic">Catatan: Penggunaan API key Anda akan dikenakan biaya atau menggunakan token sesuai ketentuan Leonardo.Ai.</p>
    </>
  )
};

export default function ApiKeyModal({ isOpen, onClose, onSubmit, modelName }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');

  if (!isOpen || !modelName) return null;

  const handleSubmit = () => {
    if (apiKey.trim()) {
      onSubmit(apiKey);
      onClose();
    } else {
      alert('API Key tidak boleh kosong.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="w-full max-w-lg bg-light-bg dark:bg-dark-bg rounded-2xl shadow-lg flex flex-col p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Key className="text-purple-600"/> Masukkan API Key untuk {modelName}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <X size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        <div className="text-gray-700 dark:text-gray-300 space-y-4 mb-6">
          {instructions[modelName]}
        </div>

        <div className="space-y-2">
          <label htmlFor="api-key-input" className="text-sm font-medium text-gray-600 dark:text-gray-400">API Key</label>
          <input
            id="api-key-input"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={`sk-xxxxxxxx atau leonardo-key-xxxxxx`}
            className="w-full p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-gray-200"
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
           <button onClick={onClose} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-bold rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-500">
            Batal
          </button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700">
            Simpan & Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}