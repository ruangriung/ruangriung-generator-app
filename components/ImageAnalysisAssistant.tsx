// components/ImageAnalysisAssistant.tsx
'use client';

import { useState, useRef } from 'react'; // Import useRef
import { Image, Copy, Check, Sparkles, Wand2, Upload } from 'lucide-react';
import Accordion from './Accordion';
import ButtonSpinner from './ButtonSpinner';
import toast from 'react-hot-toast';

interface ImageAnalysisAssistantProps {
  onUsePrompt: (prompt: string) => void;
}

export default function ImageAnalysisAssistant({ onUsePrompt }: ImageAnalysisAssistantProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Untuk menampilkan pratinjau gambar
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref untuk input file

  const inputStyle = "w-full p-3 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-gray-800 dark:text-gray-200";
  const textareaStyle = `${inputStyle} resize-none`;

  const LabelWithIcon = ({ icon: Icon, text, htmlFor }: { icon: React.ElementType, text: string, htmlFor: string }) => (
    <div className="flex items-center gap-x-2 mb-2">
      <Icon className="h-4 w-4 text-purple-600" />
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-600 dark:text-gray-300">
        {text}
      </label>
    </div>
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAnalysisResult(''); // Clear previous analysis
      setIsCopied(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
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
    setIsCopied(false);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile); // Read file as Base64

    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const analyzePromise = new Promise<string>(async (resolve, reject) => {
        try {
          const response = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'openai', // or 'openai-large', 'claude-hybridspace'
              messages: [
                {
                  "role": "user",
                  "content": [
                    { "type": "text", "text": "Jelaskan gambar ini secara ringkas namun detail, fokus pada subjek utama, gaya, dan elemen penting lainnya. Format output sebagai potensi prompt untuk generator gambar." },
                    { "type": "image_url", "image_url": { "url": base64String } }
                  ]
                }
              ],
              max_tokens: 300 // Batasi panjang respons
            }),
          });

          if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API merespons dengan status ${response.status}. Isi: ${errorBody}`);
          }

          const result = await response.json();
          const description = result.choices?.[0]?.message?.content?.trim();
          if (description) {
            setAnalysisResult(description);
            resolve("Analisis gambar berhasil dibuat!");
          } else {
            reject("API tidak memberikan deskripsi gambar.");
            setAnalysisResult("Gagal menganalisis gambar. API tidak memberikan deskripsi.");
          }

        } catch (error: any) {
          console.error("Gagal menganalisis gambar:", error);
          reject(`Terjadi kesalahan saat menganalisis gambar: ${error.message}`);
          setAnalysisResult("Gagal menganalisis gambar. Silakan coba lagi.");
        } finally {
          setIsLoading(false);
        }
      });

      toast.promise(analyzePromise, {
        loading: 'Menganalisis gambar...',
        success: (message: string) => message,
        error: (message: string) => message,
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
          <LabelWithIcon icon={Upload} text="Unggah Gambar" htmlFor="image-upload-hidden" /> {/* htmlFor menunjuk ke input yang tersembunyi */}
          <input
            type="file"
            id="image-upload-hidden" // ID ini akan dihubungkan dengan label
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef} // Tambahkan ref
            className="hidden" // Sembunyikan input file bawaan
          />
          {/* Tombol kustom yang akan terlihat oleh pengguna */}
          <label
            htmlFor="image-upload-hidden"
            className="inline-flex items-center justify-center px-4 py-3 bg-light-bg dark:bg-dark-bg text-gray-700 dark:text-gray-200 font-bold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all duration-150 cursor-pointer w-full" /* <-- PERUBAHAN DI SINI: Menambahkan kelas w-full */
          >
            <Upload className="w-5 h-5 mr-2" />
            <span>Pilih Gambar</span>
          </label>

          {selectedFile && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              File terpilih: <span className="font-semibold">{selectedFile.name}</span>
            </p>
          )}

          {previewUrl && (
            <div className="mt-4 p-2 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset flex justify-center items-center">
              <img src={previewUrl} alt="Pratinjau Gambar" className="max-h-64 max-w-full object-contain rounded-md" />
            </div>
          )}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={handleAnalyzeImage}
            disabled={isLoading || !selectedFile}
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg active:shadow-inner dark:active:shadow-dark-neumorphic-button-active disabled:bg-purple-400 disabled:cursor-not-allowed transition-all duration-150"
          >
            {isLoading ? <ButtonSpinner /> : <Sparkles className="w-5 h-5 mr-2" />}
            <span>Analisis Gambar</span>
          </button>
        </div>

        {analysisResult && (
          <div className="mt-4 p-4 bg-light-bg dark:bg-dark-bg rounded-lg shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Hasil Analisis AI:</label>
            <textarea
              readOnly
              className={`${textareaStyle} h-64`}
              value={analysisResult}
            />
            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={handleCopyAnalysis}
                className={`inline-flex items-center px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg shadow-neumorphic-button dark:shadow-dark-neumorphic-button active:shadow-neumorphic-inset dark:active:shadow-dark-neumorphic-inset transition-all ${isCopied ? '!bg-green-200 text-green-700' : ''} hover:bg-gray-400 dark:hover:bg-gray-600`}
              >
                {isCopied ? <><Check size={16} className="mr-2" />Tersalin!</> : <><Copy size={16} className="mr-2" />Salin Hasil</>}
              </button>
              <button
                onClick={handleUseAnalysisAsPrompt}
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