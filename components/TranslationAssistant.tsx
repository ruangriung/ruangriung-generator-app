// components/TranslationAssistant.tsx
'use client';

import { useState } from 'react';
import { Languages, Copy, Check, Sparkles, X, Expand } from 'lucide-react';
import Accordion from './Accordion';
import ButtonSpinner from './ButtonSpinner';
import toast from 'react-hot-toast';
import TextareaModal from './TextareaModal';

interface TranslationAssistantProps {
  onUsePrompt: (prompt: string) => void;
}

export default function TranslationAssistant({ onUsePrompt }: TranslationAssistantProps) {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('id');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [editingField, setEditingField] = useState<null | 'input' | 'output'>(null);

  // <--- PERUBAHAN: inputStyle, textareaStyle, selectStyle sekarang punya dark variant
  const inputStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-gray-800 dark:text-gray-200";
  const textareaStyle = `${inputStyle} min-h-[150px] resize-y`; // Tinggi awal dan bisa di-resize vertikal
  const selectStyle = `${inputStyle} appearance-none`;

  // <--- PERUBAHAN: LabelWithIcon class text
  const LabelWithIcon = ({ icon: Icon, text, htmlFor }: { icon: React.ElementType, text: string, htmlFor: string }) => (
    <div className="flex items-center gap-x-2 mb-2">
      <Icon className="h-4 w-4 text-purple-600" />
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-600 dark:text-gray-300"> {/* <--- PERUBAHAN */}
        {text}
      </label>
    </div>
  );

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast.error("Teks yang akan diterjemahkan tidak boleh kosong!");
      return;
    }
    setIsLoading(true);
    setTranslatedText('');
    setIsCopied(false);

    const promptInstruction = `Terjemahkan teks berikut dari ${sourceLanguage === 'id' ? 'Bahasa Indonesia' : 'Bahasa Inggris'} ke ${targetLanguage === 'id' ? 'Bahasa Indonesia' : 'Bahasa Inggris'}. Hanya berikan hasil terjemahan.`;
    const textToTranslate = inputText.trim();

    const combinedPrompt = `${promptInstruction}\n\nTeks: "${textToTranslate}"`;

    const POLLINATIONS_OPENAI_ENDPOINT = 'https://text.pollinations.ai/openai';
    const POLLINATIONS_TOKEN = process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN?.trim();
    const POLLINATIONS_REFERRER = 'ruangriung.my.id';

    const pollinationsUrl = POLLINATIONS_TOKEN
      ? POLLINATIONS_OPENAI_ENDPOINT
      : `${POLLINATIONS_OPENAI_ENDPOINT}?referrer=${encodeURIComponent(POLLINATIONS_REFERRER)}`;

    const pollinationsHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (POLLINATIONS_TOKEN) {
      pollinationsHeaders.Authorization = `Bearer ${POLLINATIONS_TOKEN}`;
    }

    try {
      const response = await fetch(pollinationsUrl, {
        method: 'POST',
        headers: pollinationsHeaders,
        body: JSON.stringify({
          model: 'openai',
          messages: [{ role: 'user', content: combinedPrompt }],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API merespons dengan status ${response.status}. Isi: ${errorBody}`);
      }

      const result = await response.json();
      const newTranslatedText = result.choices[0].message.content.trim();
      setTranslatedText(newTranslatedText);
      toast.success("Teks berhasil diterjemahkan!");

    } catch (error: any) {
      console.error("Gagal melakukan terjemahan:", error);
      toast.error(`Terjadi kesalahan saat terjemahan: ${error.message}`);
      setTranslatedText("Gagal menerjemahkan teks. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTranslatedPrompt = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setIsCopied(true);
      toast.success("Teks terjemahan berhasil disalin!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleUseTranslatedPrompt = () => {
    if (translatedText) {
      onUsePrompt(translatedText);
      toast.success("Teks terjemahan telah digunakan di kolom utama!");
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText);
    setTranslatedText('');
    toast('Bahasa ditukar!', { icon: '🔄' });
  };

  return (
    // <--- PERUBAHAN: Tambahkan dark:bg-dark-bg dan dark:shadow-dark-neumorphic
    <Accordion title={<div className="flex items-center gap-2"><Languages className="text-purple-600" />Asisten Terjemahan</div>} className="mt-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <LabelWithIcon icon={Languages} text="Bahasa Sumber" htmlFor="source-lang" />
            <select
              id="source-lang"
              value={sourceLanguage}
              onChange={(e) => {
                setSourceLanguage(e.target.value);
                if (e.target.value === targetLanguage) {
                  setTargetLanguage(e.target.value === 'id' ? 'en' : 'id');
                }
              }}
              className={selectStyle}
            >
              {/* <--- PERUBAHAN: option style */}
              <option value="id" className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Indonesia</option>
              <option value="en" className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Inggris</option>
            </select>
          </div>
          <button
            onClick={swapLanguages}
            // <--- PERUBAHAN: Tambahkan dark:bg-dark-bg, dark:shadow-dark-neumorphic-button, dark:active:shadow-dark-neumorphic-inset, dark:text-gray-300, dark:hover:text-purple-500
            className="mt-7 p-2 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-500 transition-all duration-150"
            aria-label="Tukar Bahasa"
          >
            <Sparkles size={16} />
          </button>
          <div className="flex-1">
            <LabelWithIcon icon={Languages} text="Bahasa Target" htmlFor="target-lang" />
            <select
              id="target-lang"
              value={targetLanguage}
              onChange={(e) => {
                setTargetLanguage(e.target.value);
                if (e.target.value === sourceLanguage) {
                  setSourceLanguage(e.target.value === 'id' ? 'en' : 'id');
                }
              }}
              className={selectStyle}
            >
              {/* <--- PERUBAHAN: option style */}
              <option value="en" className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Inggris</option>
              <option value="id" className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Indonesia</option>
            </select>
          </div>
        </div>

        <div>
          <LabelWithIcon icon={Sparkles} text="Teks yang Ingin Diterjemahkan" htmlFor="input-text" />
          <div className="relative w-full">
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Masukkan teks di sini..."
              className={`${textareaStyle} pr-20`}
            />
            <div className="absolute top-2 right-2 flex gap-x-1">
              {inputText && (
                <button onClick={() => setInputText('')} className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Hapus">
                  <X size={18} />
                </button>
              )}
              <button onClick={() => setEditingField('input')} className="p-1.5 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Perbesar">
                <Expand size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={handleTranslate}
            disabled={isLoading || !inputText.trim()}
            // <--- PERUBAHAN: Tambahkan dark:active:shadow-dark-neumorphic-button-active
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner dark:active:shadow-dark-neumorphic-button-active disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-150"
          >
            {isLoading ? <ButtonSpinner /> : <Languages className="w-5 h-5 mr-2" />}
            <span>Terjemahkan</span>
          </button>
        </div>

        {translatedText && (
          // <--- PERUBAHAN: Tambahkan dark:bg-dark-bg dan dark:shadow-dark-neumorphic-inset
          <div className="mt-4 p-4 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Hasil Terjemahan:</label> {/* <--- PERUBAHAN */}
            <div className="relative w-full">
              <textarea
                readOnly
                value={translatedText}
                className={`${textareaStyle} pr-20`}
              />
              <div className="absolute top-2 right-2 flex gap-x-1">
                <button onClick={() => setEditingField('output')} className="p-1.5 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Perbesar">
                  <Expand size={18} />
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={handleCopyTranslatedPrompt}
                // <--- PERUBAHAN: Tambahkan dark:bg-gray-700, dark:text-gray-200, dark:active:shadow-dark-neumorphic-inset, dark:hover:bg-gray-600
                className={`inline-flex items-center px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all ${isCopied ? '!bg-gray-500 text-green-700' : ''} hover:bg-gray-400 dark:hover:bg-gray-600`}
              >
                {isCopied ? <><Check size={16} className="mr-2" />Tersalin!</> : <><Copy size={16} className="mr-2" />Salin Teks</>}
              </button>
              <button
                onClick={handleUseTranslatedPrompt}
                // <--- PERUBAHAN: Tambahkan dark:active:shadow-dark-neumorphic-inset
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset"
              >
                <Sparkles size={16} className="mr-2" />Gunakan Prompt
              </button>
            </div>
          </div>
        )}
      </div>
      <TextareaModal
        isOpen={editingField !== null}
        onClose={() => setEditingField(null)}
        title={editingField === 'input' ? 'Edit Teks untuk Diterjemahkan' : 'Lihat Hasil Terjemahan'}
        value={editingField === 'input' ? inputText : translatedText}
        onChange={(newValue) => {
          if (editingField === 'input') {
            setInputText(newValue);
          }
        }}
        readOnly={editingField === 'output'}
      />
    </Accordion>
  );
}