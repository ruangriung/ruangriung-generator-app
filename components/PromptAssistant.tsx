// components/PromptAssistant.tsx
'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Wand2, Copy, Check, Megaphone, Cpu, ChevronDown, Star, Expand, X } from 'lucide-react';
import Accordion from './Accordion';
import ButtonSpinner from './ButtonSpinner';
import toast from 'react-hot-toast';
import TextareaModal from './TextareaModal';

interface PromptAssistantProps {
  onUsePrompt: (prompt: string) => void;
}

const LabelWithIcon = ({ icon: Icon, text, htmlFor, colorClass }: { icon: React.ElementType, text: string, htmlFor: string, colorClass?: string }) => (
    <div className="flex items-center gap-x-2 mb-2">
      <Icon className={`h-4 w-4 ${colorClass || 'text-purple-600'}`} />
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-600 dark:text-gray-300">
        {text}
      </label>
    </div>
);

const inputStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-gray-800 dark:text-gray-200";
const textareaStyle = `${inputStyle} resize-none`;
const selectStyle = `${inputStyle} appearance-none`;

export default function PromptAssistant({ onUsePrompt }: PromptAssistantProps) {
  const [assistantSubject, setAssistantSubject] = useState('');
  const [assistantDetails, setAssistantDetails] = useState('');
  const [generatedAssistantPrompt, setGeneratedAssistantPrompt] = useState('');
  const [isGeneratingAssistantPrompt, setIsGeneratingAssistantPrompt] = useState(false);
  const [isAssistantPromptCopied, setIsAssistantPromptCopied] = useState(false);
  
  const [models, setModels] = useState<{name: string, description: string}[]>([]);
  const [selectedModel, setSelectedModel] = useState('openai');
  const [editingField, setEditingField] = useState<null | 'subject' | 'details'>(null);

  // --- PERUBAHAN LOGIKA FETCH DIMULAI DI SINI ---
  useEffect(() => {
    const fetchTextModels = async () => {
      try {
        // Data model langsung dari informasi yang Anda berikan
        const modelData = [
          {"name": "deepseek", "description": "DeepSeek V3", "input_modalities": ["text"], "output_modalities": ["text"]},
          {"name": "deepseek-reasoning", "description": "DeepSeek R1 0528", "input_modalities": ["text"], "output_modalities": ["text"]},
          {"name": "grok", "description": "xAI Grok-3 Mini", "input_modalities": ["text"], "output_modalities": ["text"]},
          {"name": "llamascout", "description": "Llama 4 Scout 17B", "input_modalities": ["text"], "output_modalities": ["text"]},
          {"name": "mistral", "description": "Mistral Small 3.1 24B", "input_modalities": ["text", "image"], "output_modalities": ["text"]},
          {"name": "openai", "description": "OpenAI GPT-4o Mini", "input_modalities": ["text", "image"], "output_modalities": ["text"]},
          {"name": "openai-fast", "description": "OpenAI GPT-4.1 Nano", "input_modalities": ["text", "image"], "output_modalities": ["text"]},
          {"name": "openai-large", "description": "OpenAI GPT-4.1", "input_modalities": ["text", "image"], "output_modalities": ["text"]},
          {"name": "phi", "description": "Phi-4 Mini Instruct", "input_modalities": ["text", "image", "audio"], "output_modalities": ["text"]},
          {"name": "rtist", "description": "Rtist", "input_modalities": ["text"], "output_modalities": ["text"]},
          {"name": "midijourney", "description": "MIDIjourney", "input_modalities": ["text"], "output_modalities": ["text"]}
        ];

        // Filter model yang relevan untuk Asisten Prompt (inputnya teks, outputnya teks)
        const relevantModels = modelData.filter(model => 
          model.input_modalities.includes('text') && model.output_modalities.includes('text')
        ).map(model => ({ name: model.name, description: model.description }));

        if (relevantModels.length > 0) {
          setModels(relevantModels);
          // Set 'openai' sebagai default jika tersedia
          if (relevantModels.some(m => m.name === 'openai')) {
            setSelectedModel('openai');
          } else {
            setSelectedModel(relevantModels[0].name);
          }
        } else {
           // Fallback jika tidak ada model yang cocok
           throw new Error('Tidak ada model teks yang relevan ditemukan');
        }
      } catch (error) {
          console.error("Gagal memproses daftar model:", error);
          // Daftar fallback yang solid jika terjadi kesalahan
          const fallbackModels = [
              { name: 'openai', description: 'OpenAI GPT-4o Mini' },
              { name: 'mistral', description: 'Mistral Small 3.1 24B' },
              { name: 'grok', description: 'xAI Grok-3 Mini' },
              { name: 'deepseek', description: 'DeepSeek V3' }
          ];
          setModels(fallbackModels);
          setSelectedModel('openai');
      }
    };
    
    fetchTextModels();
  }, []);
  // --- AKHIR PERUBAHAN LOGIKA FETCH ---

  const handleGenerateAssistantPrompt = async () => {
    if (!assistantSubject) {
      toast.error("Subjek tidak boleh kosong!");
      return;
    }

    setIsGeneratingAssistantPrompt(true);
    setGeneratedAssistantPrompt('');
    setIsAssistantPromptCopied(false);

    const fullPromptInstruction = `Kembangkan subjek berikut untuk prompt pembuatan gambar yang kreatif dan deskriptif secara visual. Jadikan ringkas dan jangan gunakan tanda kutip dalam respons Anda.`;
    const subjectContent = `Subjek: ${assistantSubject}`;
    const detailsContent = assistantDetails ? `Detail tambahan: ${assistantDetails}` : '';
    const combinedPrompt = `${fullPromptInstruction}\n${subjectContent}\n${detailsContent}`;
    
    const apiPromise = fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: 'user', content: combinedPrompt }],
      }),
    })
    .then(res => {
      if (!res.ok) throw new Error('Respons API tidak baik');
      return res.json();
    })
    .then(result => {
      const newPrompt = result.choices[0].message.content.replace(/"/g, '').trim();
      setGeneratedAssistantPrompt(newPrompt);
      return "Prompt berhasil dibuat oleh asisten!";
    })
    .catch(err => {
      setGeneratedAssistantPrompt("Gagal menghasilkan prompt. Silakan coba lagi.");
      throw new Error("Gagal membuat prompt dengan asisten.");
    })
    .finally(() => {
      setIsGeneratingAssistantPrompt(false);
    });

    toast.promise(apiPromise, {
        loading: 'Asisten AI sedang bekerja...',
        success: (message) => message,
        error: (errorMessage) => errorMessage.toString(),
    });
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
    <>
    <Accordion title={<div className="flex items-center gap-2"><Megaphone className="text-purple-600" />Asisten Prompt</div>} className="mt-6">
      <div className="space-y-4">
        <div>
          <LabelWithIcon icon={Cpu} text="Pilih Model Asisten" htmlFor="assistant-model" />
          <div className="relative">
            <select id="assistant-model" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className={selectStyle} disabled={models.length === 0}>
                {models.length > 0 ? models.map(model => (
                  <option key={model.name} value={model.name} className="bg-white dark:bg-gray-700">
                    {model.description} ({model.name})
                  </option>
                )) : <option>Memuat...</option>}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-300 pointer-events-none" />
          </div>
        </div>

        <div>
          <LabelWithIcon icon={Star} text="Subjek Utama Prompt (Wajib)" htmlFor="assistant-subject" colorClass="text-red-600" />
          <div className="relative w-full">
            <textarea id="assistant-subject" value={assistantSubject} onChange={(e) => setAssistantSubject(e.target.value)} placeholder="Misal: Pemandangan kota futuristik" className={`${textareaStyle} h-24 pr-20`} required />
            <div className="absolute top-2 right-2 flex gap-x-1">
              {assistantSubject && (
                <button onClick={() => setAssistantSubject('')} className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Hapus">
                  <X size={18} />
                </button>
              )}
              <button onClick={() => setEditingField('subject')} className="p-1.5 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Perbesar">
                <Expand size={18} />
              </button>
            </div>
          </div>
        </div>

        <div>
          <LabelWithIcon icon={Sparkles} text="Detail Tambahan (Opsional)" htmlFor="assistant-details" />
          <div className="relative w-full">
            <textarea id="assistant-details" rows={3} value={assistantDetails} onChange={(e) => setAssistantDetails(e.target.value)} placeholder="Misal: dengan mobil terbang, pencahayaan neon" className={`${textareaStyle} pr-20`} />
            <div className="absolute top-2 right-2 flex gap-x-1">
              {assistantDetails && (
                <button onClick={() => setAssistantDetails('')} className="p-1.5 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Hapus">
                  <X size={18} />
                </button>
              )}
              <button onClick={() => setEditingField('details')} className="p-1.5 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Perbesar">
                <Expand size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <button onClick={handleGenerateAssistantPrompt} disabled={isGeneratingAssistantPrompt || !assistantSubject} className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner dark:active:shadow-dark-neumorphic-button-active disabled:bg-purple-400 disabled:cursor-not-allowed">
            {isGeneratingAssistantPrompt ? <ButtonSpinner /> : <Wand2 className="w-5 h-5 mr-2" />}
            <span>Buat Prompt</span>
          </button>
        </div>

        {generatedAssistantPrompt && (
          <div className="mt-4 p-4 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Prompt Hasil AI:</label>
            <textarea readOnly value={generatedAssistantPrompt} className={`${textareaStyle} h-40`} />
            <div className="flex justify-end gap-3 mt-3">
              <button onClick={handleCopyAssistantPrompt} className={`inline-flex items-center px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all ${isAssistantPromptCopied ? '!bg-green-200 text-green-700' : ''} hover:bg-gray-400 dark:hover:bg-gray-600`}>
                {isAssistantPromptCopied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />} {isAssistantPromptCopied ? 'Tersalin!' : 'Salin'}
              </button>
              <button onClick={handleUseAssistantPrompt} className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset">
                <Sparkles size={16} className="mr-2" />Gunakan
              </button>
            </div>
          </div>
        )}
      </div>
    </Accordion>
    <TextareaModal
      isOpen={editingField !== null}
      onClose={() => setEditingField(null)}
      title={editingField === 'subject' ? 'Edit Subjek Utama' : 'Edit Detail Tambahan'}
      value={editingField === 'subject' ? assistantSubject : editingField === 'details' ? assistantDetails : ''}
      onChange={(newValue) => {
        if (editingField === 'subject') {
          setAssistantSubject(newValue);
        } else if (editingField === 'details') {
          setAssistantDetails(newValue);
        }
      }}
    />
    </>
  );
}