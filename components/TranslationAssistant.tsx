// components/TranslationAssistant.tsx
'use client';

import { useState } from 'react';
import { Languages, Copy, Check, Sparkles } from 'lucide-react';
import Accordion from './Accordion';
import ButtonSpinner from './ButtonSpinner';

interface TranslationAssistantProps {
  onUsePrompt: (prompt: string) => void; // Callback to use the translated prompt in the main input
}

export default function TranslationAssistant({ onUsePrompt }: TranslationAssistantProps) {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('id'); // 'id' for Indonesian, 'en' for English
  const [targetLanguage, setTargetLanguage] = useState('en'); // 'en' for English, 'id' for Indonesian
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const inputStyle = "w-full p-3 bg-light-bg rounded-lg shadow-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow";
  const textareaStyle = `${inputStyle} resize-none`;

  const LabelWithIcon = ({ icon: Icon, text, htmlFor }: { icon: React.ElementType, text: string, htmlFor: string }) => (
    <div className="flex items-center gap-x-2 mb-2">
      <Icon className="h-4 w-4 text-purple-600" />
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-600">
        {text}
      </label>
    </div>
  );

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      alert("Teks yang akan diterjemahkan tidak boleh kosong!");
      return;
    }
    setIsLoading(true);
    setTranslatedText('');
    setIsCopied(false);

    const promptInstruction = `Terjemahkan teks berikut dari ${sourceLanguage === 'id' ? 'Bahasa Indonesia' : 'Bahasa Inggris'} ke ${targetLanguage === 'id' ? 'Bahasa Indonesia' : 'Bahasa Inggris'}. Hanya berikan hasil terjemahan.`;
    const textToTranslate = inputText.trim();

    const combinedPrompt = `${promptInstruction}\n\nTeks: "${textToTranslate}"`;
    const urlWithToken = `https://text.pollinations.ai/openai?token=${process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN}`; // Pastikan token diatur

    try {
      const response = await fetch(urlWithToken, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai', // Atau model lain yang mendukung terjemahan
          messages: [{ role: 'user', content: combinedPrompt }],
          temperature: 0.2, // Rendahkan temperature untuk hasil yang lebih akurat
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API merespons dengan status ${response.status}. Isi: ${errorBody}`);
      }

      const result = await response.json();
      const newTranslatedText = result.choices[0].message.content.trim();
      setTranslatedText(newTranslatedText);

    } catch (error: any) {
      console.error("Gagal melakukan terjemahan:", error);
      alert(`Terjadi kesalahan saat terjemahan: ${error.message}`);
      setTranslatedText("Gagal menerjemahkan teks. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTranslatedPrompt = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleUseTranslatedPrompt = () => {
    if (translatedText) {
      onUsePrompt(translatedText);
      alert("Teks terjemahan telah digunakan di kolom utama!");
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(translatedText); // Pindahkan hasil terjemahan ke input jika menukar
    setTranslatedText(''); // Kosongkan hasil terjemahan sebelumnya
  };

  return (
    <Accordion title={<div className="flex items-center gap-2"><Languages className="text-purple-600" />Asisten Terjemahan</div>} className="mt-6">
      <div className="space-y-4">
        {/* Pilihan Bahasa */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <LabelWithIcon icon={Languages} text="Bahasa Sumber" htmlFor="source-lang" />
            <select
              id="source-lang"
              value={sourceLanguage}
              onChange={(e) => {
                setSourceLanguage(e.target.value);
                // Otomatis atur bahasa target jika sama
                if (e.target.value === targetLanguage) {
                  setTargetLanguage(e.target.value === 'id' ? 'en' : 'id');
                }
              }}
              className={inputStyle}
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">Bahasa Inggris</option>
            </select>
          </div>
          <button
            onClick={swapLanguages}
            className="mt-7 p-2 bg-light-bg rounded-lg shadow-neumorphic-button active:shadow-neumorphic-inset text-gray-700 hover:text-purple-600 transition-all duration-150"
            aria-label="Tukar Bahasa"
          >
            <Sparkles size={16} /> {/* Menggunakan Sparkles untuk ikon tukar */}
          </button>
          <div className="flex-1">
            <LabelWithIcon icon={Languages} text="Bahasa Target" htmlFor="target-lang" />
            <select
              id="target-lang"
              value={targetLanguage}
              onChange={(e) => {
                setTargetLanguage(e.target.value);
                // Otomatis atur bahasa sumber jika sama
                if (e.target.value === sourceLanguage) {
                  setSourceLanguage(e.target.value === 'id' ? 'en' : 'id');
                }
              }}
              className={inputStyle}
            >
              <option value="en">Bahasa Inggris</option>
              <option value="id">Bahasa Indonesia</option>
            </select>
          </div>
        </div>

        {/* Input Teks */}
        <div>
          <LabelWithIcon icon={Sparkles} text="Teks yang Ingin Diterjemahkan" htmlFor="input-text" />
          <textarea
            id="input-text"
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Masukkan teks di sini..."
            className={textareaStyle}
          />
        </div>

        <div className="text-center pt-2">
          <button
            onClick={handleTranslate}
            disabled={isLoading || !inputText.trim()}
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-150"
          >
            {isLoading ? <ButtonSpinner /> : <Languages className="w-5 h-5 mr-2" />}
            <span>Terjemahkan</span>
          </button>
        </div>

        {translatedText && (
          <div className="mt-4 p-4 bg-light-bg rounded-lg shadow-neumorphic-inset">
            <label className="block text-sm font-medium text-gray-600 mb-2">Hasil Terjemahan:</label>
            <textarea
              readOnly
              value={translatedText}
              className={`${textareaStyle} h-32`}
            />
            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={handleCopyTranslatedPrompt}
                className={`inline-flex items-center px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-neumorphic-button active:shadow-neumorphic-inset transition-all ${isCopied ? '!bg-green-200 text-green-700' : ''}`}
              >
                {isCopied ? <><Check size={16} className="mr-2" />Tersalin!</> : <><Copy size={16} className="mr-2" />Salin Teks</>}
              </button>
              <button
                onClick={handleUseTranslatedPrompt}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-neumorphic-button active:shadow-neumorphic-inset"
              >
                <Sparkles size={16} className="mr-2" />Gunakan Prompt
              </button>
            </div>
          </div>
        )}
      </div>
    </Accordion>
  );
}