'use client';

// Tipe data untuk semua pengaturan yang akan kita kirim ke komponen
export interface GeneratorSettings {
  prompt: string;
  model: string;
  width: number;
  height: number;
  seed: number;
  artStyle: string;
}

// Tipe data untuk props komponen ini
interface ControlPanelProps {
  settings: GeneratorSettings;
  setSettings: React.Dispatch<React.SetStateAction<GeneratorSettings>>;
  onGenerate: () => void;
  isLoading: boolean;
}

// Daftar model yang bisa dipilih (bisa diperbarui sesuai dokumentasi Pollinations)
const models = ['dall-e-3', 'stable-diffusion-xl', 'pollinations-v4', 'sdxl-lightning'];
const artStyles = [
  { name: 'Default', value: '' },
  { name: 'Fotorealistis', value: ', photorealistic, 4k, hyper-detailed' },
  { name: 'Lukisan Cat Minyak', value: ', oil painting, masterpiece' },
  { name: 'Gaya Anime', value: ', anime style, trending on artstation' },
  { name: 'Seni Digital', value: ', digital art, smooth, sharp focus' },
  { name: 'Konsep Seni', value: ', concept art, intricate details' },
];

export default function ControlPanel({ settings, setSettings, onGenerate, isLoading }: ControlPanelProps) {
  
  // Fungsi helper untuk update state
  const handleSettingChange = (field: keyof GeneratorSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-4xl p-6 md:p-8 bg-gray-200 rounded-2xl shadow-neumorphic">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom Kiri: Prompt dan Gaya */}
        <div className="flex flex-col gap-6">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-600 mb-2">Prompt Utama</label>
            <textarea
              id="prompt"
              rows={4}
              value={settings.prompt}
              onChange={(e) => handleSettingChange('prompt', e.target.value)}
              placeholder="Contoh: seekor rubah di hutan bersalju"
              className="w-full p-3 bg-gray-200 rounded-lg shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
          <div>
            <label htmlFor="artStyle" className="block text-sm font-medium text-gray-600 mb-2">Gaya Seni</label>
            <select
              id="artStyle"
              value={settings.artStyle}
              onChange={(e) => handleSettingChange('artStyle', e.target.value)}
              className="w-full p-3 bg-gray-200 rounded-lg shadow-neumorphic-inset appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            >
              {artStyles.map(style => (
                <option key={style.name} value={style.value}>{style.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Kolom Kanan: Pengaturan Teknis */}
        <div className="flex flex-col gap-6">
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-600 mb-2">Model AI</label>
            <select
              id="model"
              value={settings.model}
              onChange={(e) => handleSettingChange('model', e.target.value)}
              className="w-full p-3 bg-gray-200 rounded-lg shadow-neumorphic-inset appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            >
              {models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-600 mb-2">Lebar</label>
              <input type="number" id="width" value={settings.width} onChange={(e) => handleSettingChange('width', parseInt(e.target.value))} className="w-full p-3 bg-gray-200 rounded-lg shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-600 mb-2">Tinggi</label>
              <input type="number" id="height" value={settings.height} onChange={(e) => handleSettingChange('height', parseInt(e.target.value))} className="w-full p-3 bg-gray-200 rounded-lg shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
            </div>
          </div>
           <div>
            <label htmlFor="seed" className="block text-sm font-medium text-gray-600 mb-2">Seed (opsional)</label>
            <input type="number" id="seed" value={settings.seed} onChange={(e) => handleSettingChange('seed', parseInt(e.target.value))} placeholder="Angka acak" className="w-full p-3 bg-gray-200 rounded-lg shadow-neumorphic-inset focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
          </div>
        </div>
      </div>

      {/* Tombol Generate */}
      <div className="mt-8 text-center">
        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="px-8 py-4 bg-gray-200 text-blue-600 font-bold rounded-xl shadow-neumorphic-button active:shadow-neumorphic-inset disabled:shadow-neumorphic-inset disabled:text-gray-400 transition-all duration-150"
        >
          {isLoading ? 'Sedang Membuat...' : 'Buat Gambar'}
        </button>
      </div>
    </div>
  );
}