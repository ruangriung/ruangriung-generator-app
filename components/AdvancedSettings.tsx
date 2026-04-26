'use client';

import { memo, useCallback, useState, useEffect } from 'react';

import { GeneratorSettings } from './ControlPanel';
import { Palette, Cpu, ArrowLeftRight, ArrowUpDown, Sparkles, ImageIcon, Sprout, ChevronDown, Lock, Shield, EyeOff, Link2, Plus, X, Info } from 'lucide-react';
import { artStyles, ArtStyleCategory, ArtStyleOption } from '@/lib/artStyles';
import BYOPHandler from './BYOPHandler';
import toast from 'react-hot-toast';

interface AdvancedSettingsProps {
  settings: GeneratorSettings;
  setSettings: React.Dispatch<React.SetStateAction<GeneratorSettings>>;
  models: string[];
  aspectRatio: 'Kotak' | 'Portrait' | 'Lansekap' | 'Custom';
  onAspectRatioChange: (preset: 'Kotak' | 'Portrait' | 'Lansekap') => void;
  onManualDimensionChange: (width: number, height: number) => void;
  onImageQualityChange: (quality: 'Standar' | 'HD' | 'Ultra') => void;
  className?: string;
  onModelSelect: (model: string) => void;
  onByopChange?: () => void;
}

const AdvancedSettings = memo(({ settings, setSettings, models, aspectRatio, onAspectRatioChange, onManualDimensionChange, onImageQualityChange, className, onModelSelect, onByopChange }: AdvancedSettingsProps) => {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [hasByopKey, setHasByopKey] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('image-model-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };

    if (isModelDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModelDropdownOpen]);

  useEffect(() => {
    setHasByopKey(!!localStorage.getItem('pollinations_api_key'));
  }, []);

  const handleSettingChange = useCallback((field: keyof GeneratorSettings, value: string | number | boolean) => {
    if (field === 'model') {
      const proModels = ['flux-pro', 'openai', 'flux-realism', 'flux-anime'];
      const isPro = proModels.includes((value as string).toLowerCase());
      const hasApiKey = !!localStorage.getItem('pollinations_api_key');

      if (isPro && !hasApiKey) {
        toast.error('Model PRO memerlukan koneksi Pollinations atau Kredit Pro.');
        // Kita bisa membiarkan user memilih tapi akan ada peringatan saat generate
      }
      onModelSelect(value as string);
    } else if (field === 'private' || field === 'safe' || field === 'transparent') {
      setSettings(prev => ({ ...prev, [field]: value as boolean }));
    } else if (field === 'width' || field === 'height' || field === 'batchSize' || field === 'seed') {
      const parsedValue = parseInt(value as string, 10);
      const numValue = isNaN(parsedValue) ? 0 : parsedValue;

      if (field === 'width' || field === 'height') {
        onManualDimensionChange(
          field === 'width' ? numValue : settings.width,
          field === 'height' ? numValue : settings.height
        );
      } else {
        setSettings(prev => ({ ...prev, [field]: numValue }));
      }
    } else {
      setSettings(prev => ({ ...prev, [field]: value }));
    }
  }, [onModelSelect, setSettings, onManualDimensionChange, settings.width, settings.height]);

  const inputStyle = "w-full p-3 bg-slate-950/5 dark:bg-black/20 backdrop-blur-md rounded-xl border-2 border-slate-200 dark:border-white/20 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all text-slate-800 dark:text-slate-200 font-bold text-sm";
  const selectStyle = `${inputStyle} appearance-none cursor-pointer`;
  const checkboxContainerStyle = "flex items-center gap-3 p-4 glass rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group";
  
  const LabelWithIcon = ({ icon: Icon, text, htmlFor }: { icon: React.ElementType, text: string, htmlFor?: string }) => (
    <div className="flex items-center gap-x-2 mb-3 px-1">
      <Icon className="h-4 w-4 text-primary-500" />
      <label htmlFor={htmlFor} className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">
        {text}
      </label>
    </div>
  );

  const isImageToImageModel = (modelName: string): boolean => {
    const normalized = modelName.toLowerCase();
    const specificModels = ['nanobanana', 'seedream', 'kontext', 'upscale', 'edit'];
    return specificModels.includes(normalized) || 
           normalized.includes('edit') || 
           normalized.includes('image-to-image') ||
           normalized.includes('img2img');
  };

  const isI2I = isImageToImageModel(settings.model);
  const MAX_REFERENCE_IMAGES = 4;

  const handleReferenceImageChange = useCallback((index: number, url: string) => {
    setSettings(prev => {
      const updated = [...(prev.inputImages ?? [])];
      updated[index] = url;
      return { ...prev, inputImages: updated };
    });
  }, [setSettings]);

  const handleAddReferenceImage = useCallback(() => {
    setSettings(prev => {
      const currentImages = prev.inputImages ?? [];
      if (currentImages.length >= MAX_REFERENCE_IMAGES) return prev;
      return { ...prev, inputImages: [...currentImages, ''] };
    });
  }, [setSettings]);

  const handleRemoveReferenceImage = useCallback((index: number) => {
    setSettings(prev => {
      const currentImages = prev.inputImages ?? [];
      if (currentImages.length === 0) return prev;
      const updated = currentImages.filter((_, i) => i !== index);
      return { ...prev, inputImages: updated.length ? updated : [''] };
    });
  }, [setSettings]);

  const referenceImagesRaw = settings.inputImages ?? [];
  const filledReferenceCount = referenceImagesRaw.filter(url => url.trim().length > 0).length;
  const referenceImages = referenceImagesRaw.length ? referenceImagesRaw : [''];

  return (
    <div className={`space-y-8 overflow-visible ${className || ''}`}>
        {/* BYOP Section */}
        <div className="w-full">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Shield className="h-4 w-4 text-primary-500" />
              <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Koneksi Provider (BYOP)</h4>
            </div>
          <BYOPHandler onKeyChange={onByopChange} />
        </div>

        <div>
          <label className="block text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Preset Aspek Rasio</label>
          <div className="flex justify-center gap-3">
            {[
              { id: 'Kotak', label: 'Kotak', ratio: '1:1' },
              { id: 'Portrait', label: 'Portrait', ratio: '9:16' },
              { id: 'Lansekap', label: 'Lansekap', ratio: '16:9' },
            ].map((preset) => (
              <button 
                key={preset.id}
                onClick={() => onAspectRatioChange(preset.id as any)} 
                className={`flex-1 flex flex-col items-center gap-1 p-4 rounded-2xl transition-all duration-300 border ${
                  aspectRatio === preset.id 
                  ? 'bg-primary-500/10 border-primary-500/50 shadow-lg shadow-primary-500/10' 
                  : 'glass border-white/10 hover:border-white/30'
                }`}
              >
                <span className={`text-sm font-black ${aspectRatio === preset.id ? 'text-primary-500' : 'text-slate-600 dark:text-slate-300'}`}>
                  {preset.label}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{preset.ratio}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-visible">
          <div className="glass-inset p-4">
            <LabelWithIcon icon={Sparkles} text="Guidance Scale (CFG)" htmlFor="cfg-scale" />
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="cfg-scale"
                min="1"
                max="20"
                step="0.5"
                value={settings.cfg_scale}
                onChange={(e) => handleSettingChange('cfg_scale', parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <div className="h-10 w-12 glass flex items-center justify-center rounded-xl font-black text-primary-500 text-sm">
                {settings.cfg_scale}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-3">Rendah: Kreatif • Tinggi: Patuh Prompt</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <LabelWithIcon icon={ArrowLeftRight} text="Lebar" htmlFor="width" />
              <input type="number" id="width" value={settings.width} onChange={(e) => handleSettingChange('width', e.target.value)} className={inputStyle} />
            </div>
            <div>
              <LabelWithIcon icon={ArrowUpDown} text="Tinggi" htmlFor="height" />
              <input type="number" id="height" value={settings.height} onChange={(e) => handleSettingChange('height', e.target.value)} className={inputStyle} />
            </div>
          </div>
          
          <div>
            <LabelWithIcon icon={Sparkles} text="Kualitas Gambar" htmlFor="imageQuality" />
            <div className="relative group">
              <select id="imageQuality" value={settings.imageQuality} onChange={(e) => onImageQualityChange(e.target.value as 'Standar' | 'HD' | 'Ultra')} className={selectStyle}>
                <option value="Standar" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Standar (Cepat)</option>
                <option value="HD" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">High Definition</option>
                <option value="Ultra" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Ultra Realistic</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary-500 transition-colors">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>

          <div>
            <LabelWithIcon icon={Palette} text="Gaya Seni" htmlFor="artStyle" />
            <div className="relative group">
              <select id="artStyle" value={settings.artStyle} onChange={(e) => handleSettingChange('artStyle', e.target.value)} className={selectStyle}>
                {artStyles.map((category: ArtStyleCategory) => (
                  <optgroup key={category.label} label={category.label} className="bg-white dark:bg-slate-900 text-primary-500 font-black">
                    {category.options.map((style: ArtStyleOption) => (
                      <option key={style.value} value={style.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">
                        {style.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary-500 transition-colors">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>

          <div className="relative" id="image-model-dropdown">
            <LabelWithIcon icon={Cpu} text="Mesin AI" htmlFor="model" />
            <div className="relative group">
              <button
                type="button"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="w-full flex items-center justify-between p-4 bg-slate-950/5 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 hover:border-primary-500/30 transition-all text-sm font-bold text-slate-800 dark:text-slate-200"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="uppercase">{settings.model}</span>
                  {['flux-pro', 'openai', 'flux-realism', 'flux-anime'].includes(settings.model.toLowerCase()) && (
                    <span className="px-1.5 py-0.5 rounded-md bg-primary-500/10 text-primary-500 text-[8px] font-black uppercase">PRO</span>
                  )}
                </div>
                <ChevronDown 
                  size={18} 
                  className={`text-slate-400 transition-transform duration-300 ${isModelDropdownOpen ? 'rotate-180 text-primary-500' : ''}`} 
                />
              </button>

              {isModelDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-[90] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="max-h-64 overflow-y-auto p-2">
                    {models.length > 0 ? (
                      models.map((model) => {
                        const isPro = ['flux-pro', 'openai', 'flux-realism', 'flux-anime'].includes(model.toLowerCase());
                        const isSelected = settings.model.toLowerCase() === model.toLowerCase();
                        
                        return (
                          <button
                            key={model}
                            onClick={() => {
                              handleSettingChange('model', model);
                              setIsModelDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                              isSelected 
                                ? 'bg-primary-500/10 text-primary-500' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold uppercase ${isSelected ? 'text-primary-500' : ''}`}>
                                {model}
                              </span>
                              {isPro && (
                                <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase ${
                                  isSelected ? 'bg-primary-500/20' : 'bg-slate-100 dark:bg-white/5'
                                }`}>
                                  PRO
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <div className="flex items-center gap-2">
                                {isPro && hasByopKey && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                                )}
                                <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                              </div>
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500 italic">Memuat Model...</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <LabelWithIcon icon={ImageIcon} text="Batch" htmlFor="batchSize" />
              <input type="number" id="batchSize" min="1" max="10" value={settings.batchSize} onChange={(e) => handleSettingChange('batchSize', e.target.value)} className={inputStyle} />
            </div>
            <div>
              <LabelWithIcon icon={Sprout} text="Seed" htmlFor="seed" />
              <input type="number" id="seed" value={settings.seed} onChange={(e) => handleSettingChange('seed', e.target.value)} className={inputStyle} />
            </div>
          </div>

          {isI2I && (
            <div className="md:col-span-2 glass-inset p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-primary-500" />
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Gambar Referensi</span>
                </div>
                <span className="text-[10px] font-black text-primary-500 bg-primary-500/10 px-2 py-1 rounded-full uppercase">{filledReferenceCount}/{MAX_REFERENCE_IMAGES}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {referenceImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="glass-card !bg-white/5 border-dashed border-2 border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:border-primary-500/50 transition-all min-h-[120px]">
                      {url ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                          <img src={url} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <button
                              type="button"
                              onClick={() => handleRemoveReferenceImage(index)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:scale-110 transition-transform"
                              title="Hapus"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            id={`file-upload-${index}`}
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 2 * 1024 * 1024) {
                                  toast.error("File terlalu besar (Maks 2MB). Gunakan link untuk file besar.");
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => handleReferenceImageChange(index, reader.result as string);
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <label
                            htmlFor={`file-upload-${index}`}
                            className="flex flex-col items-center cursor-pointer"
                          >
                            <Plus className="w-8 h-8 text-slate-400 group-hover:text-primary-500 transition-colors mb-2" />
                            <span className="text-[10px] font-bold text-slate-500">UNGGAH GAMBAR</span>
                          </label>
                          <div className="w-full flex items-center gap-2 mt-2">
                            <div className="h-px bg-white/10 flex-1" />
                            <span className="text-[8px] font-bold text-slate-600">ATAU</span>
                            <div className="h-px bg-white/10 flex-1" />
                          </div>
                          <input
                            type="text"
                            placeholder="Tempel link gambar..."
                            className="w-full bg-transparent border-b border-white/10 text-[10px] py-1 text-center focus:border-primary-500 outline-none"
                            onBlur={(e) => handleReferenceImageChange(index, e.target.value)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {referenceImages.length < MAX_REFERENCE_IMAGES && (
                  <button
                    type="button"
                    onClick={handleAddReferenceImage}
                    className="glass-card !bg-white/5 border-dashed border-2 border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary-500/50 transition-all opacity-60 hover:opacity-100"
                  >
                    <Plus className="w-6 h-6 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500">TAMBAH SLOT</span>
                  </button>
                )}
              </div>
              
              <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-primary-500/5 border border-primary-500/10">
                <Sparkles size={14} className="text-primary-500 shrink-0 mt-0.5" />
                <p className="text-[9px] font-medium text-slate-500 leading-relaxed italic">
                  Tips: Gunakan model seperti <span className="text-primary-500 font-bold">Nanobanana</span> untuk mengubah gambar asli Anda menjadi gaya lain. Mendukung upload file langsung (Maks 2MB) atau link URL.
                </p>
              </div>
            </div>
          )}

          <div className={checkboxContainerStyle} onClick={() => handleSettingChange('private', !settings.private)}>
            <div className={`h-6 w-11 rounded-full transition-all duration-300 relative ${settings.private ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
              <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-all duration-300 ${settings.private ? 'translate-x-5' : ''}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800 dark:text-slate-200">Mode Privat</span>
              <span className="text-[10px] font-bold text-slate-400">Sembunyikan dari galeri publik</span>
            </div>
          </div>

          <div className={checkboxContainerStyle} onClick={() => handleSettingChange('safe', !settings.safe)}>
            <div className={`h-6 w-11 rounded-full transition-all duration-300 relative ${settings.safe ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
              <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-all duration-300 ${settings.safe ? 'translate-x-5' : ''}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800 dark:text-slate-200">Filter NSFW</span>
              <span className="text-[10px] font-bold text-slate-400">Keamanan konten ketat</span>
            </div>
          </div>

          <div 
            className={`${checkboxContainerStyle} ${settings.model.toLowerCase().includes('gptimage') ? 'ring-2 ring-primary-500/50' : ''}`} 
            onClick={() => handleSettingChange('transparent', !settings.transparent)}
          >
            <div className={`h-6 w-11 rounded-full transition-all duration-300 relative ${settings.transparent ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
              <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-all duration-300 ${settings.transparent ? 'translate-x-5' : ''}`} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-800 dark:text-slate-200">Latar Transparan</span>
                {settings.model.toLowerCase().includes('gptimage') && (
                  <span className="animate-pulse flex h-2 w-2 rounded-full bg-primary-500" />
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-400">Hapus latar belakang (khusus gptimage)</span>
            </div>
          </div>
        </div>
    </div>
  );
});

AdvancedSettings.displayName = 'AdvancedSettings';

export default AdvancedSettings;