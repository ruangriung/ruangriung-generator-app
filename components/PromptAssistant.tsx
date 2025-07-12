// components/PromptAssistant.tsx
'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Wand2, MessageSquarePlus, Copy, Check, Megaphone, X, Cpu, Star } from 'lucide-react';
import Accordion from './Accordion';
import ButtonSpinner from './ButtonSpinner';
import toast from 'react-hot-toast';

interface PromptAssistantProps {
  onUsePrompt: (prompt: string) => void;
}

export default function PromptAssistant({ onUsePrompt }: PromptAssistantProps) {
  const [assistantSubject, setAssistantSubject] = useState('');
  const [assistantDetails, setAssistantDetails] = useState('');
  const [generatedAssistantPrompt, setGeneratedAssistantPrompt] = useState('');
  const [isGeneratingAssistantPrompt, setIsGeneratingAssistantPrompt] = useState(false);
  const [isAssistantPromptCopied, setIsAssistantPromptCopied] = useState(false);
  const [modelList, setModelList] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('openai');

  // <--- PERUBAHAN: inputStyle, textareaStyle, selectStyle sekarang punya dark variant
  const inputStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-gray-800 dark:text-gray-200";
  const textareaStyle = `${inputStyle} resize-none`;
  const selectStyle = `${inputStyle} appearance-none`;

  // <--- PERUBAHAN: LabelWithIcon class text
  const LabelWithIcon = ({ icon: Icon, text, htmlFor, colorClass }: { icon: React.ElementType, text: string, htmlFor: string, colorClass?: string }) => (
    <div className="flex items-center gap-x-2 mb-2">
      <Icon className={`h-4 w-4 ${colorClass || 'text-purple-600'}`} />
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-600 dark:text-gray-300"> {/* <--- PERUBAHAN */}
        {text}
      </label>
    </div>
  );

  useEffect(() => {
    const fetchTextModels = async () => {
      try {
        const response = await fetch('https://text.pollinations.ai/models');
        if (!response.ok) {
          throw new Error(`Gagal mengambil model teks: ${response.statusText}`);
        }
        const data = await response.json();
        let extractedModels: string[] = [];

        if (Array.isArray(data)) {
          extractedModels = data.map(item => {
            if (typeof item === 'string') {
              return item;
            } else if (typeof item === 'object' && item !== null && (item.id || item.name)) {
              return item.id || item.name;
            }
            return null;
          }).filter(Boolean) as string[];
        } else if (typeof data === 'object' && data !== null) {
          extractedModels = Object.keys(data).filter(key => {
            const modelDetails = data[key];
            return typeof modelDetails === 'object' && modelDetails !== null &&
                   !modelDetails.capabilities?.includes('audio-text') &&
                   !modelDetails.capabilities?.includes('vision');
          });
        }

        const validModels = extractedModels.filter(name => typeof name === 'string' && name.length > 0);

        if (validModels.length > 0) {
          setModelList(validModels);
          if (validModels.includes('openai')) {
            setSelectedModel('openai');
          } else {
            setSelectedModel(validModels[0]);
          }
        } else {
          console.warn("Tidak ada model teks valid yang ditemukan dari API. Menggunakan model fallback.");
          setModelList(['openai', 'mistral']);
          setSelectedModel('openai');
          toast.error("Model teks sementara gagal dimuat dari API. Menggunakan model fallback.");
        }
      } catch (error) {
        console.error("Error mengambil model teks:", error);
        toast.error("Model teks sementara gagal dimuat dari API. Menggunakan model fallback.");
        setModelList(['openai', 'mistral']);
        setSelectedModel('openai');
      }
    };

    fetchTextModels();
  }, []);

  const handleGenerateAssistantPrompt = async () => {
    if (!assistantSubject) {
      toast.error("Subjek tidak boleh kosong untuk Asisten Prompt!");
      return;
    }

    setIsGeneratingAssistantPrompt(true);
    setGeneratedAssistantPrompt('');
    setIsAssistantPromptCopied(false);

    const fullPromptInstruction = `Kembangkan subjek berikut untuk prompt pembuatan gambar yang kreatif dan deskriptif secara visual. Jadikan ringkas dan jangan gunakan tanda kutip dalam respons Anda.`;
    const subjectContent = `Subjek: ${assistantSubject}`;
    const detailsContent = assistantDetails ? `Detail tambahan: ${assistantDetails}` : '';

    const combinedPrompt = `${fullPromptInstruction}\n${subjectContent}\n${detailsContent}`;
    const urlWithToken = `https://text.pollinations.ai/openai?token=${process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN}`;
    
    try {
      const response = await fetch(urlWithToken, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: 'user', content: combinedPrompt }],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API merespons dengan status ${response.status}. Isi: ${errorBody}`);
      }

      const result = await response.json();
      const newPrompt = result.choices[0].message.content.replace(/"/g, '');
      setGeneratedAssistantPrompt(newPrompt);
      toast.success("Prompt berhasil dibuat!");
    } catch (error: any) {
      console.error("Gagal membuat prompt dengan Asisten Prompt:", error);
      toast.error(`Terjadi kesalahan dengan Asisten Prompt: ${error.message}`);
      setGeneratedAssistantPrompt("Gagal menghasilkan prompt. Silakan coba lagi.");
    } finally {
      setIsGeneratingAssistantPrompt(false);
    }
  };

  const handleCopyAssistantPrompt = () => {
    if (generatedAssistantPrompt) {
      navigator.clipboard.writeText(generatedAssistantPrompt);
      setIsAssistantPromptCopied(true);
      toast.success("Prompt berhasil disalin!");
      setTimeout(() => setIsAssistantPromptCopied(false), 2000);
    }
  };

  const handleUseAssistantPrompt = () => {
    if (generatedAssistantPrompt) {
      onUsePrompt(generatedAssistantPrompt);
      toast.success("Prompt telah digunakan di kolom utama!");
    }
  };

  return (
    // <--- PERUBAHAN: Tambahkan dark:bg-dark-bg dan dark:shadow-dark-neumorphic
    <Accordion title={<div className="flex items-center gap-2"><Megaphone className="text-purple-600" />Asisten Prompt</div>} className="mt-6">
      <div className="space-y-4">
        <div>
          <LabelWithIcon icon={Cpu} text="Model AI" htmlFor="assistant-model" />
          <select
            id="assistant-model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className={selectStyle}
            disabled={modelList.length === 0}
          >
            {modelList.length > 0 ? (
              modelList.map(model => (
                // <--- PERUBAHAN: option style
                <option key={model} value={model} className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {model}
                </option>
              ))
            ) : (
              // <--- PERUBAHAN: option style
              <option disabled className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">Memuat model...</option>
            )}
          </select>
        </div>

        <div>
          <LabelWithIcon icon={Star} text="Subjek Utama Prompt (Wajib)" htmlFor="assistant-subject" colorClass="text-red-600" />
          <input
            type="text"
            id="assistant-subject"
            value={assistantSubject}
            onChange={(e) => setAssistantSubject(e.target.value)}
            placeholder="Misal: Pemandangan kota futuristik"
            className={inputStyle}
            required
          />
        </div>

        <div>
          <LabelWithIcon icon={Sparkles} text="Detail Tambahan (Opsional)" htmlFor="assistant-details" />
          <textarea
            id="assistant-details"
            rows={3}
            value={assistantDetails}
            onChange={(e) => setAssistantDetails(e.target.value)}
            placeholder="Misal: dengan mobil terbang, pencahayaan neon, suasana hujan."
            className={textareaStyle}
          />
        </div>
        <div className="text-center pt-2">
          <button
            onClick={handleGenerateAssistantPrompt}
            disabled={isGeneratingAssistantPrompt || !assistantSubject || modelList.length === 0}
            // <--- PERUBAHAN: Tambahkan dark:active:shadow-dark-neumorphic-button-active
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner dark:active:shadow-dark-neumorphic-button-active disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-150"
          >
            {isGeneratingAssistantPrompt ? <ButtonSpinner /> : <Wand2 className="w-5 h-5 mr-2" />}
            <span>Buat Prompt</span>
          </button>
        </div>

        {generatedAssistantPrompt && (
          // <--- PERUBAHAN: Tambahkan dark:bg-dark-bg dan dark:shadow-dark-neumorphic-inset
          <div className="mt-4 p-4 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Prompt Hasil AI:</label> {/* <--- PERUBAHAN */}
            <textarea
              readOnly
              className={`${textareaStyle}`}
              value={generatedAssistantPrompt}
            />
            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={handleCopyAssistantPrompt}
                // <--- PERUBAHAN: Tambahkan dark:bg-gray-700, dark:text-gray-200, dark:active:shadow-dark-neumorphic-inset, dark:hover:bg-gray-600
                className={`inline-flex items-center px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all ${isAssistantPromptCopied ? '!bg-green-200 text-green-700' : ''} hover:bg-gray-400 dark:hover:bg-gray-600`} // <--- PERUBAHAN
              >
                {isAssistantPromptCopied ? <><Check size={16} className="mr-2" />Tersalin!</> : <><Copy size={16} className="mr-2" />Salin Prompt</>}
              </button>
              <button
                onClick={handleUseAssistantPrompt}
                // <--- PERUBAHAN: Tambahkan dark:active:shadow-dark-neumorphic-inset
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset"
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