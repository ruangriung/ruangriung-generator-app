// components/ImageAnalysisAssistant.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Image, Copy, Check, Sparkles, Upload, Cpu, ChevronDown, RefreshCw, Loader } from 'lucide-react';
import Accordion from './Accordion';
import ButtonSpinner from './ButtonSpinner';
import toast from 'react-hot-toast';

interface ImageAnalysisAssistantProps {
  onUsePrompt: (prompt: string) => void;
}

const LabelWithIcon = ({ icon: Icon, text, htmlFor }: { icon: React.ElementType, text: string, htmlFor: string }) => (
  <div className="flex items-center gap-x-2 mb-2">
    <Icon className="h-4 w-4 text-purple-600" />
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-600 dark:text-gray-300">
      {text}
    </label>
  </div>
);

const inputStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-gray-800 dark:text-gray-200";
const textareaStyle = `${inputStyle} resize-none`;
const selectStyle = `${inputStyle} appearance-none`;

export default function ImageAnalysisAssistant({ onUsePrompt }: ImageAnalysisAssistantProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [models, setModels] = useState<{ name: string, description: string }[]>([]);
  const [selectedModel, setSelectedModel] = useState('openai');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- PERUBAHAN LOGIKA MODEL DIMULAI DI SINI ---
  // --- PERUBAHAN LOGIKA MODEL DIMULAI DI SINI ---
  useEffect(() => {
    const fetchModels = async () => {
      try {
        // Kita coba fetch semua model text, karena biasanya endpoint text juga memuat info vision di metadata
        // Atau jika endpoint terpisah belum ada, kita pakai asumsi atau fetch dari text endpoint
        const response = await fetch('/api/pollinations/models/text');
        if (response.ok) {
          const data = await response.json();
          let allModels: any[] = [];
          if (Array.isArray(data)) allModels = data;

          // Jika API mengembalikan data lengkap, kita filter yang vision-capable
          // Jika hanya string array, kita tidak tahu mana yang vision.
          // Fallback: jika string, anggap 'openai' dan 'mistral' support.
          // Tapi baiknya jika data object: check .vision atau input_modalities

          const visionModels = allModels.filter((m: any) => {
            if (typeof m === 'string') {
              return ['openai', 'mistral', 'gpt-4o', 'gpt-4o-mini'].some(v => m.includes(v));
            }
            return m.vision === true || (m.input_modalities && m.input_modalities.includes('image'));
          }).map((m: any) => {
            if (typeof m === 'string') return { name: m, description: m };
            return { name: m.name, description: m.description || m.name };
          });

          if (visionModels.length > 0) {
            setModels(visionModels);
            setSelectedModel(visionModels[0].name);
          } else {
            // Fallback visual list if API doesn't specify vision explicitly or is minimal
            setModels([
              { name: 'openai', description: 'OpenAI GPT-4o Mini' },
              { name: 'mistral', description: 'Mistral Small' },
            ]);
          }
        }
      } catch (e) {
        console.error("Failed to fetch models for analysis", e);
        setModels([
          { name: 'openai', description: 'OpenAI GPT-4o Mini' },
        ]);
      }
    };

    fetchModels();
  }, []);
  // --- AKHIR PERUBAHAN LOGIKA MODEL ---

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAnalysisResult('');
      setIsCopied(false);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedFile) {
      toast.error("Silakan unggah gambar terlebih dahulu!");
      return;
    }
    setIsLoading(true);
    setAnalysisResult('');
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const analyzePromise = fetch('/api/pollinations/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': ... handled by proxy
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ "role": "user", "content": [{ "type": "text", "text": "Jelaskan gambar ini secara ringkas namun detail, fokus pada subjek utama, gaya, dan elemen penting lainnya. Format output sebagai potensi prompt untuk generator gambar." }, { "type": "image_url", "image_url": { "url": base64String } }] }],
          max_tokens: 300,
          json: false
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorBody = await res.text();
            throw new Error(`Gagal menganalisis gambar. Status: ${res.status}. Pesan: ${errorBody}`);
          }
          // Proxy returns text
          return res.text();
        })
        .then(description => {
          if (!description) throw new Error("API tidak memberikan deskripsi yang valid.");
          setAnalysisResult(description);
          return "Analisis gambar berhasil!";
        })
        .catch(err => {
          setAnalysisResult("Gagal menganalisis gambar. Periksa konsol untuk detail.");
          throw err;
        })
        .finally(() => {
          setIsLoading(false);
        });

      toast.promise(analyzePromise, {
        loading: 'Menganalisis gambar...',
        success: (message: string) => message,
        error: (err) => `Error: ${err.message || 'Terjadi kesalahan tidak diketahui.'}`,
      });
    };
  };

  const handleCopyAnalysis = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(analysisResult);
      setIsCopied(true);
      toast.success("Hasil analisis berhasil disalin!");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleUseAnalysisAsPrompt = () => {
    if (analysisResult) {
      onUsePrompt(analysisResult);
      toast.success("Hasil analisis telah digunakan di kolom utama!");
    }
  };

  return (
    <Accordion title={<div className="flex items-center gap-2"><Image className="text-purple-600" />Asisten Analisis Gambar</div>} className="mt-6">
      <div className="space-y-4">
        <div>
          <LabelWithIcon icon={Cpu} text="Pilih Model Analisis" htmlFor="analysis-model" />
          <div className="relative">
            <select id="analysis-model" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className={selectStyle} disabled={models.length === 0}>
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
          <LabelWithIcon icon={Upload} text="Unggah Gambar" htmlFor="image-upload-hidden" />
          <input type="file" id="image-upload-hidden" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
          <label htmlFor="image-upload-hidden" className="inline-flex items-center justify-center px-4 py-3 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-200 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all duration-150 cursor-pointer w-full">
            <Upload className="w-5 h-5 mr-2" />
            <span>Pilih Gambar</span>
          </label>
          {selectedFile && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">File terpilih: <span className="font-semibold">{selectedFile.name}</span></p>}
          {previewUrl && <div className="mt-4 p-2 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset flex justify-center items-center"><img src={previewUrl} alt="Pratinjau" className="max-h-64 max-w-full object-contain rounded-md" /></div>}
        </div>

        <div className="text-center pt-2">
          <button onClick={handleAnalyzeImage} disabled={isLoading || !selectedFile} className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner dark:active:shadow-dark-neumorphic-button-active disabled:bg-purple-400 disabled:cursor-not-allowed">
            {isLoading ? <ButtonSpinner /> : <Sparkles className="w-5 h-5 mr-2" />}
            <span>Analisis Gambar</span>
          </button>
        </div>

        {analysisResult && (
          <div className="mt-4 p-4 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Hasil Analisis AI:</label>
            <textarea readOnly className={`${textareaStyle} h-64`} value={analysisResult} />
            <div className="flex justify-end gap-3 mt-3">
              <button onClick={handleCopyAnalysis} className={`inline-flex items-center px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all ${isCopied ? '!bg-green-200 text-green-700' : ''} hover:bg-gray-400 dark:hover:bg-gray-600`}>
                {isCopied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />} {isCopied ? 'Tersalin!' : 'Salin'}
              </button>
              <button onClick={handleUseAnalysisAsPrompt} className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset">
                <Sparkles size={16} className="mr-2" />Gunakan
              </button>
            </div>
          </div>
        )}
      </div>
    </Accordion>
  );
}