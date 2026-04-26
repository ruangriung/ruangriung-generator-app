// components/ControlPanel.tsx
'use client';

import { useState, useEffect, Dispatch, SetStateAction, useCallback, useMemo, memo, useRef } from 'react';
import { useSession } from 'next-auth/react';
import AdvancedSettings from './AdvancedSettings';
import ButtonSpinner from './ButtonSpinner';
import { Sparkles, X, Expand, Shuffle, Save, Wand2, Cpu, ArrowLeftRight, ArrowUpDown, Sprout, Settings, Image as ImageIcon, ChevronDown, Languages, Megaphone, Braces, FlaskConical, Shield, Info } from 'lucide-react';
import TextareaModal from './TextareaModal';
import Accordion from './Accordion';
import PromptAssistant from './PromptAssistant';
import TranslationAssistant from './TranslationAssistant';
import ImageAnalysisAssistant from './ImageAnalysisAssistant';
import LockedAccordion from './LockedAccordion';
import toast from 'react-hot-toast';
import { artStyles, ArtStyleCategory, ArtStyleOption } from '@/lib/artStyles';

// Hardcoded models removed in favor of dynamic API loading


export interface GeneratorSettings {
  prompt: string;
  negativePrompt: string;
  model: string;
  cfg_scale: number;
  width: number;
  height: number;
  seed: number;
  artStyle: string;
  batchSize: number;
  imageQuality: 'Standar' | 'HD' | 'Ultra';
  private: boolean;
  safe: boolean;
  transparent: boolean;
  inputImages: string[];
}

interface ControlPanelProps {
  settings: GeneratorSettings;
  setSettings: Dispatch<SetStateAction<GeneratorSettings>>;
  onGenerate: () => void;
  isLoading: boolean;
  models: string[];
  aspectRatio: 'Kotak' | 'Portrait' | 'Lansekap' | 'Custom';
  onAspectRatioChange: (preset: 'Kotak' | 'Portrait' | 'Lansekap') => void;
  onManualDimensionChange: (width: number, height: number) => void;
  onImageQualityChange: (quality: 'Standar' | 'HD' | 'Ultra') => void;
  onModelSelect: (model: string) => void;
  onSurpriseMe: () => void;
  onByopChange: () => void;
}

const ControlPanel = memo(({ settings, setSettings, onGenerate, isLoading, models, aspectRatio, onAspectRatioChange, onManualDimensionChange, onImageQualityChange, onModelSelect, onSurpriseMe, onByopChange }: ControlPanelProps) => {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [editingField, setEditingField] = useState<null | 'prompt' | 'negativePrompt'>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);
  const [isGeneratingJson, setIsGeneratingJson] = useState(false);
  const [enhancementModels, setEnhancementModels] = useState<{ id: string; name: string }[]>([]);
  const [selectedEnhancementModel, setSelectedEnhancementModel] = useState('openai');
  const [isBrainAssistOpen, setIsBrainAssistOpen] = useState(false);
  const [hasByopKey, setHasByopKey] = useState(false);
  const brainAssistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasByopKey(!!localStorage.getItem('pollinations_api_key'));
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchModels = async () => {
      try {
        const response = await fetch('/api/pollinations/models/text', {
          signal: controller.signal
        });
        if (!response.ok) throw new Error('Failed to fetch text models');
        const data = await response.json();

        let relevantModels: { id: string; name: string }[] = [];
        if (Array.isArray(data)) {
          relevantModels = data.map((m: any) => {
            if (typeof m === 'string') return { id: m, name: m };
            return { id: m.id || m.name, name: m.id || m.name };
          });
        }

        if (relevantModels.length > 0) {
          setEnhancementModels(relevantModels);
          if (relevantModels.some(m => m.id === 'openai')) {
            setSelectedEnhancementModel('openai');
          } else {
            setSelectedEnhancementModel(relevantModels[0].id);
          }
        } else {
          throw new Error('No models found');
        }

      } catch (error: any) {
        if (error.name === 'AbortError') return;
        
        console.warn("Could not fetch dynamic models, using high-quality defaults.", error);
        const fallbackModels = [
          { id: 'openai', name: 'OpenAI GPT-4o Mini' },
          { id: 'mistral', name: 'Mistral Small 3.1 24B' },
          { id: 'grok', name: 'xAI Grok-3 Mini' },
          { id: 'deepseek', name: 'DeepSeek V3' },
        ];
        setEnhancementModels(fallbackModels);
        setSelectedEnhancementModel('openai');
      }
    };

    fetchModels();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    try {
      const storedPrompts = localStorage.getItem('ruangriung_saved_prompts');
      if (storedPrompts) {
        setSavedPrompts(JSON.parse(storedPrompts));
      }
    } catch (error) {
      console.error("Gagal memuat prompt tersimpan:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ruangriung_saved_prompts', JSON.stringify(savedPrompts));
    } catch (error) {
      console.error("Gagal menyimpan prompt:", error);
    }
  }, [savedPrompts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      if (brainAssistRef.current && !brainAssistRef.current.contains(targetNode)) {
        setIsBrainAssistOpen(false);
      }
    };

    if (isBrainAssistOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBrainAssistOpen]);

  const handleClearPrompt = useCallback(() => {
    setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: '' }));
  }, [setSettings]);

  const handleClearNegativePrompt = useCallback(() => {
    setSettings((prev: GeneratorSettings) => ({ ...prev, negativePrompt: '' }));
  }, [setSettings]);

  const callPromptApi = async (promptForApi: string, temperature = 0.5) => {
    try {
      // Support BYOP
      const byopKey = localStorage.getItem('pollinations_api_key');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (byopKey) {
        headers['Authorization'] = `Bearer ${byopKey}`;
      }

      const response = await fetch('/api/pollinations/text', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: selectedEnhancementModel,
          prompt: promptForApi,
          temperature: temperature,
          json: false
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API merespons dengan status ${response.status}. Isi: ${errorBody}`);
      }

      // If proxy returns text directly (which it does for GET-based backend)
      // We need to handle text response.
      const aiContent = await response.text();
      // const result = await response.json(); // Old logic
      // const aiContent = result?.choices?.[0]?.message?.content ?? ''; // Old logic

      const trimmedContent = aiContent.trim();

      let cleanedContent = trimmedContent;
      if (trimmedContent.length >= 2) {
        const firstChar = trimmedContent[0];
        const lastChar = trimmedContent[trimmedContent.length - 1];
        if ((firstChar === '"' || firstChar === '\'') && lastChar === firstChar) {
          cleanedContent = trimmedContent.slice(1, -1).trim();
        }
      }

      return cleanedContent || trimmedContent;
    } catch (error: any) {
      console.error("Gagal memanggil API prompt:", error);
      toast.error(`Terjadi kesalahan saat berkomunikasi dengan AI: ${error.message}`);
      throw error;
    }
  };

  const mergePromptWithEnhancement = useCallback((originalPrompt: string, enhancedPrompt: string) => {
    const trimmedOriginal = originalPrompt.trim();
    const trimmedEnhanced = enhancedPrompt.trim();

    if (!trimmedOriginal) return trimmedEnhanced;
    if (!trimmedEnhanced) return trimmedOriginal;

    const normalizedOriginal = trimmedOriginal.toLowerCase();
    const normalizedEnhanced = trimmedEnhanced.toLowerCase();

    if (normalizedEnhanced.includes(normalizedOriginal)) return trimmedEnhanced;
    if (normalizedOriginal.includes(normalizedEnhanced)) return trimmedOriginal;

    return `${trimmedOriginal}\n\n${trimmedEnhanced}`;
  }, []);

  const handleRandomPrompt = async () => {
    setIsRandomizing(true);

    const randomThemes = [
      'science fiction', 'spiderman', 'sports', 'surreal', 'vintage', 'wild nature', 'fantasy', 'photography', 'caricature', 'digital art', 'steampunk', 'cyberpunk', 'retro-futuristic', 'abstract', 'minimalist', 'cosmic horror', 'fairy tale', 'dystopian', 'utopian', 'mythology', 'ancient', 'modern', 'post-apocalyptic', 'galaxy war', 'classical painting', 'pop art', 'street art', 'traditional art', 'contemporary art', 'conceptual art', 'installation art', 'sculpture', 'textile art', 'ceramic art', 'graphic art', 'collage art', 'mixed media', '3D art', 'VR art', 'AR art', 'AI art', 'generative art', 'participatory art', 'art', 'graffiti', 'mural art', 'wall painting', 'fine art', 'modern sculpture', 'classical sculpture', 'abstract sculpture', 'figurative sculpture', 'installation sculpture', 'kinetic sculpture', 'interactive sculpture', 'digital sculpture'
    ];

    const selectedTheme = randomThemes[Math.floor(Math.random() * randomThemes.length)];

    const randomPromptInstruction = `
        You are a conceptual artist who provides unexpected ideas.
        Give me ONE truly random image prompt idea, with a touch of the "${selectedTheme}" theme.
        Combine two or more unusual concepts.
        Make it visually descriptive, concise, and DO NOT use quotation marks in your response.
    `;

    const randomPromptPromise = callPromptApi(randomPromptInstruction, 0.10).then((newPrompt) => {
      setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: newPrompt }));
      return newPrompt;
    });

    toast.promise(
      randomPromptPromise,
      {
        loading: 'Finding a random prompt idea...',
        success: 'Random prompt created successfully!',
        error: 'Failed to create a random prompt.',
      }
    );

    randomPromptPromise.finally(() => setIsRandomizing(false));
  };

  const handleEnhancePrompt = async () => {
    if (!settings.prompt) {
      toast.error("Write a prompt first to enhance it!");
      return;
    }
    setIsEnhancing(true);
    const originalPrompt = settings.prompt;

    const enhancePromise = callPromptApi(
      `Enhance and add more visual details to the following image prompt, but keep it concise: "${settings.prompt}". Do not use or remove quotation marks in your response.`
    ).then((enhancedPrompt) => {
      const mergedPrompt = mergePromptWithEnhancement(originalPrompt, enhancedPrompt);
      setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: mergedPrompt }));
      return mergedPrompt;
    });

    toast.promise(
      enhancePromise,
      {
        loading: 'Enhancing prompt...',
        success: 'Prompt enhanced successfully!',
        error: 'Failed to enhance prompt.',
      }
    );

    enhancePromise
      .catch(() => {
        setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: originalPrompt }));
      })
      .finally(() => setIsEnhancing(false));
  };

  const handleSavePrompt = () => {
    if (!settings.prompt) {
      toast.error("Tidak ada prompt untuk disimpan!");
      return;
    }
    setIsSaving(true);
    try {
      setSavedPrompts((prev: string[]) => {
        const updatedPrompts = new Set([settings.prompt, ...prev]);
        return Array.from(updatedPrompts).slice(0, 50);
      });
      toast.success("Prompt berhasil disimpan!");
    } catch (error) {
      toast.error("Gagal menyimpan prompt.");
      console.error("Error saving prompt:", error);
    } finally {
      setTimeout(() => setIsSaving(false), 1500);
    }
  };

  const handleSelectSavedPrompt = (prompt: string) => {
    setSettings((prev: GeneratorSettings) => ({ ...prev, prompt }));
    toast.success("Prompt dimuat dari riwayat!");
  };

  const handleDeleteSavedPrompt = (promptToDelete: string) => {
    if (window.confirm("Yakin ingin menghapus prompt ini?")) {
      setSavedPrompts((prev: string[]) => prev.filter(p => p !== promptToDelete));
      toast.success("Prompt berhasil dihapus!");
    }
  };

  const handleClearAllSavedPrompts = () => {
    if (window.confirm("Yakin ingin menghapus semua prompt yang disimpan?")) {
      setSavedPrompts([]);
      toast.success("Semua prompt tersimpan berhasil dihapus!");
    }
  };

  const addNegativePreset = (preset: 'kualitas' | 'anatomi' | 'teks' | 'cacat') => {
    const presetMap = {
      kualitas: ['low quality', 'blurry', 'jpeg artifacts', 'worst quality', 'lowres'],
      anatomi: ['deformed', 'disfigured', 'bad anatomy', 'extra limbs', 'missing fingers', 'bad hands', 'malformed limbs'],
      teks: ['text', 'watermark', 'signature', 'username', 'logo', 'UI', 'user interface'],
      cacat: ['duplicate', 'cloned face', 'cropped', 'out of frame', 'tiling', 'grid', 'mutilated']
    };

    const presetsToAdd = presetMap[preset];

    setSettings(prev => {
      const currentNegatives = prev.negativePrompt
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const newNegatives = new Set([...currentNegatives, ...presetsToAdd]);

      return {
        ...prev,
        negativePrompt: Array.from(newNegatives).join(', ')
      };
    });
    toast.success(`Preset negatif "${preset}" ditambahkan!`);
  };

  const handleGenerateJsonPrompt = async () => {
    if (!settings.prompt) {
      toast.error("Tulis prompt utama terlebih dahulu untuk menghasilkan JSON!");
      return;
    }
    setIsGeneratingJson(true);
    const jsonInstruction = `
      Based on the following prompt: "${settings.prompt}", generate a concise JSON object.
      The JSON should describe key elements, themes, or attributes extracted from the prompt, suitable for data processing or further analysis.
      For example, if the prompt is "A serene forest with magical creatures under a starry night", the JSON could be:
      {"setting": "serene forest", "elements": ["magical creatures", "starry night"], "mood": "fantasy"}
      Please ensure the output is valid JSON and nothing else.
    `;
    const jsonPromptPromise = callPromptApi(jsonInstruction, 0.2).then((newPrompt) => {
      setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: newPrompt }));
      return newPrompt;
    });

    toast.promise(
      jsonPromptPromise,
      {
        loading: 'Generating JSON from prompt...',
        success: 'JSON generated successfully!',
        error: 'Failed to generate JSON.',
      }
    );

    jsonPromptPromise.finally(() => setIsGeneratingJson(false));
  };


  const featureButtonStyle = "glass-button flex-1 min-w-[140px]";

  return (
    <>
      <div className="w-full space-y-8 relative">
        {/* Advanced Settings Accordion */}
        <div className="glass rounded-[2rem] overflow-visible border border-white/20 dark:border-white/10 shadow-xl relative">
          <details className="w-full group overflow-visible" suppressHydrationWarning>
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-x-3">
                <div className="h-10 w-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white">Pengaturan Lanjutan</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Konfigurasi Model & Output</p>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full glass flex items-center justify-center group-open:rotate-180 transition-transform duration-500">
                <ChevronDown className="w-5 h-5 text-primary-500" />
              </div>
            </summary>
            <div className="p-6 pt-8 border-t border-white/10 bg-white/5 overflow-visible">
              {!isAuthenticated && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-3">
                  <Shield size={16} />
                  Anda belum masuk. Beberapa fitur premium mungkin terkunci.
                </div>
              )}
              <AdvancedSettings
                settings={settings}
                setSettings={setSettings}
                models={models}
                aspectRatio={aspectRatio}
                onAspectRatioChange={onAspectRatioChange}
                onManualDimensionChange={onManualDimensionChange}
                onImageQualityChange={onImageQualityChange}
                onModelSelect={onModelSelect}
                onByopChange={onByopChange}
              />
            </div>
          </details>
        </div>

        {/* Prompt Input Section */}
        <div className="glass-card relative z-[0]">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <label htmlFor="prompt" className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                  Deskripsikan Imajinasi Anda
                </label>
                <div className="flex gap-2">
                   {settings.prompt && (
                    <button type="button" onClick={handleClearPrompt} className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Hapus">
                      <X size={16} />
                    </button>
                  )}
                  <button onClick={() => setEditingField('prompt')} className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white transition-all shadow-sm" title="Perbesar">
                    <Expand size={16} />
                  </button>
                </div>
              </div>
              <div className="relative group">
                <textarea
                  id="prompt"
                  className="w-full p-6 bg-slate-950/5 dark:bg-black/40 backdrop-blur-md rounded-[2rem] border-2 border-slate-200 dark:border-white/10 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all duration-500 resize-none h-[180px] text-slate-800 dark:text-slate-100 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner"
                  value={settings.prompt}
                  onChange={(e) => setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Ketikkan imajinasimu di sini... (Contoh: Kucing astronot di planet Mars, gaya sinematik)"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <label htmlFor="negative-prompt" className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                  Negative Prompt <span className="text-slate-400 dark:text-slate-500 font-bold ml-1">(Hal yang dihindari)</span>
                </label>
                <div className="flex gap-2">
                  {settings.negativePrompt && (
                    <button type="button" onClick={handleClearNegativePrompt} className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Hapus">
                      <X size={16} />
                    </button>
                  )}
                  <button type="button" onClick={() => setEditingField('negativePrompt')} className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white transition-all shadow-sm" title="Perbesar">
                    <Expand size={16} />
                  </button>
                </div>
              </div>
              <textarea
                id="negative-prompt"
                className="w-full p-4 bg-slate-950/5 dark:bg-black/40 backdrop-blur-md rounded-2xl border-2 border-slate-200 dark:border-white/10 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all duration-500 resize-none h-[100px] text-slate-800 dark:text-slate-100 font-medium text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-inner"
                value={settings.negativePrompt}
                onChange={(e) => setSettings((prev: GeneratorSettings) => ({ ...prev, negativePrompt: e.target.value }))}
                placeholder="blurry, ugly, watermark, text, low quality..."
              />
              <div className="flex flex-wrap gap-2 mt-4">
                {[
                  { id: 'kualitas', label: 'Kualitas Buruk' },
                  { id: 'anatomi', label: 'Anatomi Buruk' },
                  { id: 'teks', label: 'Teks/Logo' },
                  { id: 'cacat', label: 'Cacat/Grid' },
                ].map((preset) => (
                  <button 
                    key={preset.id}
                    type="button"
                    onClick={() => addNegativePreset(preset.id as any)} 
                    className="px-4 py-2 rounded-xl glass text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary-500 hover:border-primary-500/30 transition-all"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col items-center gap-6">
            <button
              type="button"
              onClick={onGenerate}
              className="btn-primary w-full max-w-md h-16 text-lg tracking-widest"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ButtonSpinner />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>GENERATE {settings.batchSize > 1 ? `(${settings.batchSize})` : ''}</span>
                </>
              )}
            </button>

            <div className="flex flex-wrap justify-center gap-3 w-full">
              <button
                type="button"
                onClick={handleRandomPrompt}
                className={featureButtonStyle}
                disabled={isRandomizing || isEnhancing || isGeneratingJson}
              >
                {isRandomizing ? <ButtonSpinner className="text-primary-500" /> : <Shuffle size={18} />} <span>Acak Idea</span>
              </button>
              <button
                type="button"
                onClick={onSurpriseMe}
                className={featureButtonStyle}
                disabled={isLoading || isRandomizing || isEnhancing || isGeneratingJson}
              >
                <FlaskConical size={18} /> <span>Surprise!</span>
              </button>
              <button
                type="button"
                onClick={handleEnhancePrompt}
                className={featureButtonStyle}
                disabled={isRandomizing || isEnhancing || isGeneratingJson || !settings.prompt}
              >
                {isEnhancing ? <ButtonSpinner className="text-primary-500" /> : <Wand2 size={18} />} <span>Sempurnakan</span>
              </button>
              <button
                type="button"
                onClick={handleGenerateJsonPrompt}
                className={featureButtonStyle}
                disabled={isRandomizing || isEnhancing || isGeneratingJson || !settings.prompt}
              >
                {isGeneratingJson ? <ButtonSpinner className="text-primary-500" /> : <Braces size={18} />} <span>Prompt JSON</span>
              </button>
              <button
                type="button"
                onClick={handleSavePrompt}
                className={`${featureButtonStyle} ${isSaving ? 'text-green-500' : ''}`}
                disabled={isSaving || !settings.prompt}
              >
                <Save size={18} /> <span>{isSaving ? 'Tersimpan' : 'Simpan Idea'}</span>
              </button>
            </div>

            <div className="w-full max-w-md relative" id="brain-assist-dropdown" ref={brainAssistRef}>
              <div className="flex items-center gap-2 mb-3 px-1">
                <Cpu size={14} className="text-primary-500" />
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  AI Brain Assist
                </label>
                {hasByopKey && (
                  <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[8px] font-black uppercase tracking-widest border border-yellow-500/20">
                    Premium Active
                  </span>
                )}
              </div>
              
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setIsBrainAssistOpen(!isBrainAssistOpen)}
                  className="w-full flex items-center justify-between p-4 bg-slate-950/5 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 hover:border-primary-500/30 transition-all text-sm font-bold text-slate-800 dark:text-slate-200"
                  disabled={enhancementModels.length === 0}
                >
                  <span className="truncate">
                    {enhancementModels.find(m => m.id === selectedEnhancementModel)?.name || 'Memuat Model...'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-all ${isBrainAssistOpen ? 'rotate-180' : ''}`} />
                </button>

                {isBrainAssistOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-[80] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-60 overflow-y-auto p-2">
                      {enhancementModels.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedEnhancementModel(model.id);
                            setIsBrainAssistOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-bold transition-all ${
                            selectedEnhancementModel === model.id
                            ? 'bg-primary-500/10 text-primary-500'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className={`h-2 w-2 rounded-full ${selectedEnhancementModel === model.id ? 'bg-primary-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
                          {model.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Assistants Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-visible">
          <PromptAssistant
            onUsePrompt={(newPrompt) => setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: newPrompt }))}
          />
          <TranslationAssistant
            onUsePrompt={(newPrompt) => setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: newPrompt }))}
          />
          <ImageAnalysisAssistant
            onUsePrompt={(newPrompt) => setSettings((prev: GeneratorSettings) => ({ ...prev, prompt: newPrompt }))}
          />
        </div>

        {savedPrompts.length > 0 && (
          <div className="glass rounded-[2rem] overflow-hidden border border-white/20 dark:border-white/10 shadow-xl mt-8">
            <Accordion
              title={
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500">
                    <Save size={18} />
                  </div>
                  <span className="font-black">Prompt Tersimpan ({savedPrompts.length})</span>
                </div>
              }
            >
              <div className="p-4 space-y-4">
                <div className="flex justify-end">
                  <button onClick={handleClearAllSavedPrompts} className="text-xs font-black uppercase tracking-widest text-red-500 hover:opacity-70 transition-opacity">
                    Hapus Semua
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedPrompts.map((prompt, index) => (
                    <div key={index} className="group relative flex items-center justify-between p-4 glass rounded-2xl hover:border-primary-500/30 transition-all cursor-pointer">
                      <p onClick={() => handleSelectSavedPrompt(prompt)} className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate pr-8">
                        {prompt}
                      </p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteSavedPrompt(prompt); }} 
                        className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Accordion>
          </div>
        )}
      </div>

      <TextareaModal
        isOpen={editingField !== null}
        onClose={() => setEditingField(null)}
        value={editingField === 'prompt' ? settings.prompt : settings.negativePrompt || ''}
        onChange={(newValue) => {
          if (editingField === 'prompt') {
            setSettings((prev) => ({ ...prev, prompt: newValue }));
          } else if (editingField === 'negativePrompt') {
            setSettings((prev) => ({ ...prev, negativePrompt: newValue }));
          }
        }}
        title={editingField === 'prompt' ? 'Edit Prompt Utama' : 'Edit Negative Prompt'}
      />
    </>
  );
});

ControlPanel.displayName = 'ControlPanel';

export default ControlPanel;