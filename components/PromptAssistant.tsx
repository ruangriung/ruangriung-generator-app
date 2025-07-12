// components/PromptAssistant.tsx
'use client';

import { useState } from 'react';
import { Sparkles, Wand2, MessageSquarePlus, Copy, Check, Megaphone, X } from 'lucide-react';
import Accordion from './Accordion';
import ButtonSpinner from './ButtonSpinner';

interface PromptAssistantProps {
  onUsePrompt: (prompt: string) => void; // Callback untuk menggunakan prompt di kolom utama
}

export default function PromptAssistant({ onUsePrompt }: PromptAssistantProps) {
  const [assistantSubject, setAssistantSubject] = useState('');
  const [assistantDetails, setAssistantDetails] = useState('');
  const [generatedAssistantPrompt, setGeneratedAssistantPrompt] = useState('');
  const [isGeneratingAssistantPrompt, setIsGeneratingAssistantPrompt] = useState(false);
  const [isAssistantPromptCopied, setIsAssistantPromptCopied] = useState(false);

  const inputStyle = "w-full p-3 bg-light-bg rounded-lg shadow-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow";
  const textareaStyle = `${inputStyle} resize-none`;

  // Helper untuk label dengan ikon
  const LabelWithIcon = ({ icon: Icon, text, htmlFor }: { icon: React.ElementType, text: string, htmlFor: string }) => (
    <div className="flex items-center gap-x-2 mb-2">
      <Icon className="h-4 w-4 text-purple-600" />
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-600">
        {text}
      </label>
    </div>
  );

  const handleGenerateAssistantPrompt = async () => {
    if (!assistantSubject) {
      alert("Subjek tidak boleh kosong untuk Asisten Prompt!");
      return;
    }

    setIsGeneratingAssistantPrompt(true);
    setGeneratedAssistantPrompt(''); // Bersihkan hasil sebelumnya
    setIsAssistantPromptCopied(false); // Reset status copy

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
          model: 'openai', 
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
    } catch (error: any) {
      console.error("Gagal membuat prompt dengan Asisten Prompt:", error);
      alert(`Terjadi kesalahan dengan Asisten Prompt: ${error.message}`);
      setGeneratedAssistantPrompt("Gagal menghasilkan prompt. Silakan coba lagi.");
    } finally {
      setIsGeneratingAssistantPrompt(false);
    }
  };

  const handleCopyAssistantPrompt = () => {
    if (generatedAssistantPrompt) {
      navigator.clipboard.writeText(generatedAssistantPrompt);
      setIsAssistantPromptCopied(true);
      setTimeout(() => setIsAssistantPromptCopied(false), 2000);
    }
  };

  const handleUseAssistantPrompt = () => {
    if (generatedAssistantPrompt) {
      onUsePrompt(generatedAssistantPrompt); // Menggunakan callback prop
      alert("Prompt telah digunakan di kolom utama!");
    }
  };

  return (
    <Accordion title={<div className="flex items-center gap-2"><Megaphone className="text-purple-600" />Asisten Prompt</div>} className="mt-6">
      <div className="space-y-4">
        <div>
          <LabelWithIcon icon={MessageSquarePlus} text="Subjek Utama Prompt (Wajib)" htmlFor="assistant-subject" />
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
            disabled={isGeneratingAssistantPrompt || !assistantSubject}
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-150"
          >
            {isGeneratingAssistantPrompt ? <ButtonSpinner /> : <Wand2 className="w-5 h-5 mr-2" />}
            <span>Buat Prompt</span>
          </button>
        </div>

        {generatedAssistantPrompt && (
          <div className="mt-4 p-4 bg-light-bg rounded-lg shadow-neumorphic-inset">
            <label className="block text-sm font-medium text-gray-600 mb-2">Prompt Hasil AI:</label>
            <textarea
              readOnly
              value={generatedAssistantPrompt}
              className={`${textareaStyle} h-32`}
            />
            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={handleCopyAssistantPrompt}
                className={`inline-flex items-center px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-neumorphic-button active:shadow-neumorphic-inset transition-all ${isAssistantPromptCopied ? '!bg-green-200 text-green-700' : ''}`}
              >
                {isAssistantPromptCopied ? <><Check size={16} className="mr-2" />Tersalin!</> : <><Copy size={16} className="mr-2" />Salin Prompt</>}
              </button>
              <button
                onClick={handleUseAssistantPrompt}
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