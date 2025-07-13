// components/Chatbot.tsx
'use client';

import { useState, useEffect } from 'react';
import { Bot, User, Send, Trash2, Copy, Check, Sparkles, ChevronDown } from 'lucide-react';
import ButtonSpinner from './ButtonSpinner';
import toast from 'react-hot-toast';

export default function Chatbot() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('openai');
  const [isCopied, setIsCopied] = useState(false);

  const textareaStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-gray-800 dark:text-gray-200 resize-none";
  const selectStyle = `${textareaStyle} appearance-none`;

  // --- PERBAIKAN LOGIKA FETCH MODEL ---
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
            // Filter sederhana untuk memastikan itu adalah model teks
            return typeof modelDetails === 'object' && modelDetails !== null &&
                   !modelDetails.capabilities?.includes('audio-text') &&
                   !modelDetails.capabilities?.includes('vision');
          });
        }

        const validModels = extractedModels.filter(name => typeof name === 'string' && name.length > 0 && !name.includes('audio'));

        if (validModels.length > 0) {
          setModels(validModels);
          if (validModels.includes('openai')) {
            setSelectedModel('openai');
          } else {
            setSelectedModel(validModels[0]);
          }
        } else {
          throw new Error("Tidak ada model teks yang valid ditemukan dari API.");
        }
      } catch (error) {
        console.error("Error mengambil model teks:", error);
        toast.error("Gagal memuat model AI. Menggunakan model default.");
        setModels(['openai', 'mistral', 'google']);
        setSelectedModel('openai');
      }
    };

    fetchTextModels();
  }, []);
  // --- AKHIR PERBAIKAN LOGIKA FETCH MODEL ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Pertanyaan tidak boleh kosong!");
      return;
    }

    setIsLoading(true);
    setResponse('');
    setIsCopied(false);

    const apiPromise = fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    .then(res => {
        if (!res.ok) throw new Error(`Respons API tidak baik (${res.status})`);
        return res.json();
    })
    .then(result => {
        const content = result.choices[0].message.content;
        setResponse(content);
        return 'Jawaban berhasil diterima!';
    })
    .catch(err => {
        console.error('Error:', err);
        setResponse('Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi.');
        throw new Error('Gagal mendapatkan respons dari AI.');
    })
    .finally(() => {
        setIsLoading(false);
    });

    toast.promise(apiPromise, {
        loading: 'AI sedang berpikir...',
        success: (message) => message,
        error: (errorMessage) => errorMessage.toString(),
    });
  };

  const handleCopyResponse = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setIsCopied(true);
    toast.success("Respons berhasil disalin!");
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleClear = () => {
      setPrompt('');
      setResponse('');
      setIsCopied(false);
  }

  return (
    <div className="w-full p-6 md:p-8 bg-light-bg dark:bg-dark-bg rounded-2xl shadow-neumorphic dark:shadow-dark-neumorphic">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="model-select" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2"><Sparkles size={16} className="text-purple-600"/>Pilih Model AI</label>
          <div className="relative">
             <select id="model-select" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className={selectStyle}>
                {models.length > 0 ? (
                  models.map((modelName) => (
                    <option key={modelName} value={modelName} className="bg-white dark:bg-gray-700">
                      {modelName}
                    </option>
                  ))
                ) : (
                  <option disabled>Memuat...</option>
                )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 dark:text-gray-300 pointer-events-none" />
          </div>
        </div>
        
        <div>
          <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2"><User size={16} className="text-purple-600"/>Pertanyaan Anda</label>
          <textarea
            id="prompt-input"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Tanyakan apa saja kepada AI..."
            className={textareaStyle}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex-1 inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner dark:active:shadow-dark-neumorphic-button-active disabled:bg-purple-400 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? <ButtonSpinner /> : <Send className="w-5 h-5 mr-2" />}
              <span>Kirim</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-200 font-bold rounded-xl shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              <span>Bersihkan</span>
            </button>
        </div>

        {response && (
           <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2"><Bot size={16} className="text-purple-600"/>Jawaban AI</label>
                <div className="relative p-4 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset">
                    <textarea
                      readOnly
                      value={response}
                      className="w-full h-48 bg-transparent border-0 resize-none text-gray-800 dark:text-gray-200 focus:outline-none"
                    />
                    <button 
                        onClick={handleCopyResponse}
                        className="absolute top-3 right-3 p-2 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset"
                    >
                        {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                </div>
           </div>
        )}
      </form>
    </div>
  );
}