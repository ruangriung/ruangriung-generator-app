'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Copy, Download, RefreshCcw, Sparkles, Type as TypeIcon } from 'lucide-react';
import { Font, Glyph, Path } from '@/lib/simple-opentype';
import toast from 'react-hot-toast';
import ButtonSpinner from '@/components/ButtonSpinner';
import {
  ASCENDER_LETTERS,
  BLUEPRINTS,
  DESCENDER_LETTERS,
  GRID_COLUMNS,
  GRID_ROWS,
} from './blueprints';

type GeneratorOptions = {
  fontName: string;
  weight: number;
  width: number;
  roundness: number;
  slant: number;
  letterSpacing: number;
  xHeight: number;
  serifStrength: number;
};

type GeneratedFontState = {
  blobUrl: string;
  fileName: string;
  cssSnippet: string;
  glyphCount: number;
  supportedCharacters: string;
  previewFamily: string;
};

type FontMetrics = {
  unitsPerEm: number;
  ascender: number;
  descender: number;
  baseline: number;
  capHeight: number;
  xHeight: number;
  baseWidth: number;
  sideBearing: number;
  serifHeight: number;
  overshoot: number;
  slantAllowance: number;
};

type FontBuildResult = {
  font: Font;
  glyphCount: number;
  supportedCharacters: string[];
};

const DEFAULT_OPTIONS: GeneratorOptions = {
  fontName: 'RuangRiung Custom',
  weight: 520,
  width: 1,
  roundness: 0.2,
  slant: 0,
  letterSpacing: 0,
  xHeight: 0.58,
  serifStrength: 0.25,
};

const SLIDER_CONFIG: Array<{
  key: keyof Omit<GeneratorOptions, 'fontName'>;
  label: string;
  min: number;
  max: number;
  step: number;
  format?: (value: number) => string;
}> = [
  {
    key: 'weight',
    label: 'Ketebalan',
    min: 320,
    max: 780,
    step: 10,
    format: value => Math.round(value).toString(),
  },
  {
    key: 'width',
    label: 'Lebar',
    min: 0.8,
    max: 1.3,
    step: 0.01,
    format: value => value.toFixed(2),
  },
  {
    key: 'roundness',
    label: 'Kebulatan Sudut',
    min: 0,
    max: 1,
    step: 0.01,
    format: value => `${Math.round(value * 100)}%`,
  },
  {
    key: 'slant',
    label: 'Kemiringan',
    min: -12,
    max: 12,
    step: 0.5,
    format: value => `${value.toFixed(1)}°`,
  },
  {
    key: 'letterSpacing',
    label: 'Tracking',
    min: -80,
    max: 160,
    step: 5,
    format: value => `${Math.round(value)} units`,
  },
  {
    key: 'xHeight',
    label: 'X-height',
    min: 0.46,
    max: 0.72,
    step: 0.01,
    format: value => `${Math.round(value * 100)}%`,
  },
  {
    key: 'serifStrength',
    label: 'Serif',
    min: 0,
    max: 0.8,
    step: 0.02,
    format: value => `${Math.round((value / 0.8) * 100)}%`,
  },
];

function slugifyName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function buildFont(options: GeneratorOptions): FontBuildResult {
  const unitsPerEm = 1000;
  const ascender = 760;
  const descender = -240;
  const baseline = 0;
  const capHeight = ascender;
  const lowercaseHeight = baseline + (capHeight - baseline) * clamp(options.xHeight, 0.3, 0.85);
  const baseWidth = 540 * options.width;
  const sideBearing = 80;
  const serifHeight = 36 + options.serifStrength * 60;
  const overshoot = 18;
  const slantFactor = Math.tan((options.slant * Math.PI) / 180) * 0.4;
  const verticalSpan = ascender - descender;
  const slantAllowance = Math.abs(slantFactor) * verticalSpan * 0.4;

  const metrics: FontMetrics = {
    unitsPerEm,
    ascender,
    descender,
    baseline,
    capHeight,
    xHeight: lowercaseHeight,
    baseWidth,
    sideBearing,
    serifHeight,
    overshoot,
    slantAllowance,
  };

  const glyphs: Glyph[] = [
    new Glyph({
      name: '.notdef',
      unicode: 0,
      advanceWidth: baseWidth,
      path: new Path(),
    }),
  ];

  const supportedCharacters: string[] = [];

  for (const [character, blueprint] of Object.entries(BLUEPRINTS)) {
    if (character === ' ') {
      const advanceWidth = Math.round(baseWidth + sideBearing * 2 + options.letterSpacing + slantAllowance * 2);
      glyphs.push(
        new Glyph({
          name: 'space',
          unicode: 32,
          advanceWidth,
          path: new Path(),
        }),
      );
      supportedCharacters.push(' ');
      continue;
    }

    const glyph = buildGlyphFromBlueprint(character, blueprint, metrics, options, slantFactor);

    if (glyph) {
      glyphs.push(glyph);
      supportedCharacters.push(character);
    }
  }

  const font = new Font({
    familyName: options.fontName || 'RuangRiung Custom',
    styleName: 'Regular',
    unitsPerEm,
    ascender,
    descender,
    glyphs,
    xHeight: metrics.xHeight,
    capHeight: metrics.capHeight,
  });

  return {
    font,
    glyphCount: glyphs.length - 1,
    supportedCharacters,
  };
}

function buildGlyphFromBlueprint(
  character: string,
  blueprint: string[],
  metrics: FontMetrics,
  options: GeneratorOptions,
  slantFactor: number,
) {
  const path = new Path();
  const isLowercase = character >= 'a' && character <= 'z';
  const hasAscender = ASCENDER_LETTERS.has(character);
  const hasDescender = DESCENDER_LETTERS.has(character);

  const top = isLowercase ? (hasAscender ? metrics.ascender : metrics.xHeight) : metrics.capHeight;
  const bottom = hasDescender ? metrics.descender : metrics.baseline - metrics.overshoot;

  const cellHeight = (top - bottom) / GRID_ROWS;
  const cellWidth = metrics.baseWidth / GRID_COLUMNS;
  const weightRatio = clamp((options.weight - 320) / (780 - 320), 0, 1);
  const insetX = cellWidth * (0.32 - weightRatio * 0.22);
  const insetY = cellHeight * (0.32 - weightRatio * 0.22);
  const roundness = Math.min(cellWidth, cellHeight) * options.roundness * 0.45;
  const advanceWidth = Math.round(
    metrics.baseWidth + metrics.sideBearing * 2 + options.letterSpacing + metrics.slantAllowance * 2,
  );
  const leftOffset = metrics.sideBearing + metrics.slantAllowance;
  const serifRadius = roundness * 0.65;

  const applySlant = (x: number, y: number) => x + (y - metrics.descender) * slantFactor;

  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let column = 0; column < GRID_COLUMNS; column += 1) {
      if (blueprint[row][column] !== '1') continue;

      const rowTop = top - row * cellHeight;
      const rowBottom = rowTop - cellHeight;

      const x1 = leftOffset + column * cellWidth + insetX;
      const x2 = leftOffset + (column + 1) * cellWidth - insetX;
      const y1 = rowBottom + insetY;
      const y2 = rowTop - insetY;

      if (x2 <= x1 || y2 <= y1) {
        continue;
      }

      addRoundedRect(path, x1, y1, x2, y2, roundness, applySlant);
    }
  }

  if (options.serifStrength > 0 && /[A-Za-z0-9]/.test(character)) {
    const serifWidth = metrics.baseWidth * (0.42 + options.serifStrength * 0.35);
    const serifLeft = (advanceWidth - serifWidth) / 2;
    const serifRight = serifLeft + serifWidth;
    const serifTop = metrics.baseline + metrics.serifHeight * 0.45;
    const serifBottom = metrics.baseline - metrics.serifHeight * (0.55 + options.serifStrength * 0.4);
    addRoundedRect(path, serifLeft, serifBottom, serifRight, serifTop, serifRadius, applySlant);

    if (!hasDescender && (!isLowercase || hasAscender)) {
      const upperSerifBottom = top - metrics.serifHeight * 0.35;
      const upperSerifTop = top + metrics.serifHeight * 0.1;
      addRoundedRect(path, serifLeft, upperSerifBottom, serifRight, upperSerifTop, serifRadius, applySlant);
    }
  }

  if (!path.commands.length) {
    return null;
  }

  return new Glyph({
    name: character,
    unicode: character.charCodeAt(0),
    advanceWidth,
    path,
  });
}

function addRoundedRect(
  path: Path,
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number,
  radius: number,
  slant: (x: number, y: number) => number,
) {
  if (xMax <= xMin || yMax <= yMin) return;
  const r = Math.max(0, Math.min(radius, (xMax - xMin) / 2, (yMax - yMin) / 2));

  const move = (x: number, y: number) => path.moveTo(slant(x, y), y);
  const line = (x: number, y: number) => path.lineTo(slant(x, y), y);
  const quad = (cx: number, cy: number, x: number, y: number) =>
    path.quadraticCurveTo(slant(cx, cy), cy, slant(x, y), y);

  move(xMin + r, yMax);
  line(xMax - r, yMax);
  if (r > 0) {
    quad(xMax, yMax, xMax, yMax - r);
  } else {
    line(xMax, yMax);
  }

  line(xMax, yMin + r);
  if (r > 0) {
    quad(xMax, yMin, xMax - r, yMin);
  } else {
    line(xMax, yMin);
  }

  line(xMin + r, yMin);
  if (r > 0) {
    quad(xMin, yMin, xMin, yMin + r);
  } else {
    line(xMin, yMin);
  }

  line(xMin, yMax - r);
  if (r > 0) {
    quad(xMin, yMax, xMin + r, yMax);
  } else {
    line(xMin, yMax);
  }

  path.closePath();
}

function createCssSnippet(fontName: string, fileName: string) {
  const safeFontName = fontName || 'RuangRiung Custom';
  return `@font-face {\n  font-family: '${safeFontName}';\n  src: url('./${fileName}') format('truetype');\n  font-weight: 400;\n  font-style: normal;\n}\n\n.preview-text {\n  font-family: '${safeFontName}', sans-serif;\n}`;
}

export default function FontGeneratorClient() {
  const [options, setOptions] = useState<GeneratorOptions>(DEFAULT_OPTIONS);
  const [previewText, setPreviewText] = useState('RuangRiung AI Font — 0123456789 !?');
  const [generated, setGenerated] = useState<GeneratedFontState | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleGenerate = useCallback((current: GeneratorOptions) => {
    setIsGenerating(true);
    let success = false;

    try {
      const { font, glyphCount, supportedCharacters } = buildFont(current);
      const arrayBuffer = font.toArrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'font/ttf' });
      const blobUrl = URL.createObjectURL(blob);
      const stamp = Date.now().toString(36);
      const fileName = `${slugifyName(current.fontName) || 'ruangriung-font'}-${stamp}.ttf`;
      const cssSnippet = createCssSnippet(current.fontName, fileName);
      const previewFamily = `${current.fontName || 'RuangRiung Custom'} Preview ${stamp}`;

      setGenerated(prev => {
        if (prev?.blobUrl) {
          URL.revokeObjectURL(prev.blobUrl);
        }

        return {
          blobUrl,
          fileName,
          cssSnippet,
          glyphCount,
          supportedCharacters: supportedCharacters.join(''),
          previewFamily,
        };
      });

      setGenerationError(null);
      success = true;
    } catch (error) {
      console.error('Failed to generate font', error);
      setGenerationError('Terjadi kesalahan saat membuat font. Coba ubah parameter atau muat ulang halaman.');
    } finally {
      setIsGenerating(false);
    }

    return success;
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => handleGenerate(options), 150);
    return () => clearTimeout(timeout);
  }, [options, handleGenerate]);

  useEffect(() => {
    return () => {
      setGenerated(prev => {
        if (prev?.blobUrl) {
          URL.revokeObjectURL(prev.blobUrl);
        }
        return prev;
      });
    };
  }, []);

  const previewStyle = useMemo(() => {
    if (!generated) return undefined;
    return `@font-face {\n  font-family: '${generated.previewFamily}';\n  src: url('${generated.blobUrl}') format('truetype');\n  font-weight: 400;\n  font-style: normal;\n}`;
  }, [generated]);

  const handleOptionChange = <K extends keyof GeneratorOptions>(key: K, value: GeneratorOptions[K]) => {
    setOptions(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCopyCss = async () => {
    if (!generated) {
      toast.error('Buat font terlebih dahulu sebelum menyalin CSS.');
      return;
    }

    try {
      await navigator.clipboard.writeText(generated.cssSnippet);
      toast.success('Snippet CSS berhasil disalin.');
    } catch (error) {
      console.error('Failed to copy CSS', error);
      toast.error('Gagal menyalin CSS. Salin manual dari panel preview.');
    }
  };

  const handleDownload = () => {
    if (!generated) {
      toast.error('Tidak ada font yang bisa diunduh.');
      return;
    }

    const link = document.createElement('a');
    link.href = generated.blobUrl;
    link.download = generated.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Font .ttf berhasil diunduh.');
  };

  const handleManualGenerate = () => {
    const success = handleGenerate(options);
    if (success) {
      toast.success('Font diperbarui dengan pengaturan terbaru.');
    } else {
      toast.error('Regenerasi gagal. Silakan cek parameter Anda.');
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
      <style>{previewStyle}</style>
      <header className="rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 via-white to-purple-50 p-6 shadow-sm dark:border-purple-900/40 dark:from-purple-950/40 dark:via-gray-950 dark:to-purple-950/40">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-300">
              <Sparkles className="h-4 w-4" /> RuangRiung Font Lab
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Generator Font .TTF Kustom</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Rancang typeface sederhana langsung di browser. Atur ketebalan, lebar huruf, x-height, kemiringan, dan detail serif
              kemudian unduh file <code className="rounded bg-purple-100 px-1 py-0.5 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">.ttf</code> untuk dipakai di brand atau produk digital Anda.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleManualGenerate}
              className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm transition hover:border-purple-300 hover:text-purple-800 dark:border-purple-800/60 dark:bg-purple-950/40 dark:text-purple-200 dark:hover:border-purple-700 dark:hover:text-purple-100"
            >
              <RefreshCcw className="h-4 w-4" /> Regenerasi
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:bg-purple-500 dark:hover:bg-purple-400"
            >
              {isGenerating ? <ButtonSpinner className="text-white" /> : <Download className="h-4 w-4" />}
              Unduh .ttf
            </button>
          </div>
        </div>
        {generationError ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
            {generationError}
          </p>
        ) : (
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Font akan diperbarui otomatis saat Anda mengubah parameter. Klik <span className="font-semibold">Regenerasi</span> jika ingin memastikan file terbaru.
          </p>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
        <section className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
          <div>
            <label htmlFor="font-name" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Nama font
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-purple-400 dark:border-slate-700 dark:bg-slate-800">
              <TypeIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <input
                id="font-name"
                type="text"
                value={options.fontName}
                onChange={event => handleOptionChange('fontName', event.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                placeholder="Masukkan nama keluarga font"
              />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {SLIDER_CONFIG.map(({ key, label, min, max, step, format }) => (
              <div key={key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-100">{label}</span>
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-300">
                    {format ? format(options[key] as number) : options[key]}
                  </span>
                </div>
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={options[key] as number}
                  onChange={event => handleOptionChange(key, Number(event.target.value))}
                  className="accent-purple-600"
                />
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <p className="font-semibold text-slate-700 dark:text-slate-100">Tips Penggunaan</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Sesuaikan <strong>Ketebalan</strong> untuk gaya teks ringan hingga display.</li>
              <li><strong>Lebar</strong> mempengaruhi kesan condensed atau extended pada huruf.</li>
              <li>Aktifkan <strong>Serif</strong> untuk menambah kaki huruf pada baseline dan ascender.</li>
              <li>Gunakan <strong>Tracking</strong> negatif untuk judul, positif untuk tampilan modern.</li>
            </ul>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Pratinjau Langsung</h2>
              <button
                type="button"
                onClick={handleCopyCss}
                className="inline-flex items-center gap-2 rounded-lg border border-purple-200 px-3 py-1.5 text-xs font-semibold text-purple-700 transition hover:border-purple-300 hover:text-purple-800 dark:border-purple-800/60 dark:text-purple-200 dark:hover:text-purple-100"
              >
                <Copy className="h-3.5 w-3.5" /> Salin CSS
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <label htmlFor="preview-text" className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Teks pratinjau
              </label>
              <textarea
                id="preview-text"
                value={previewText}
                onChange={event => setPreviewText(event.target.value)}
                className="mt-2 h-24 w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-inner focus:border-purple-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div
              className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 text-lg leading-relaxed text-slate-900 shadow-inner dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              style={generated ? { fontFamily: `'${generated.previewFamily}', sans-serif` } : undefined}
            >
              {previewText || 'Contoh teks font'}
            </div>

            <div className="mt-4 grid gap-3 text-xs text-slate-600 dark:text-slate-300 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Statistik</p>
                <ul className="mt-2 space-y-1">
                  <li>
                    Glyph yang dibuat:{' '}
                    <span className="font-semibold text-slate-900 dark:text-white">{generated?.glyphCount ?? 0}</span>
                  </li>
                  <li>
                    Nama file:{' '}
                    <span className="font-semibold text-slate-900 dark:text-white">{generated?.fileName ?? 'Belum ada'}</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Karakter didukung</p>
                <p className="mt-2 break-words font-mono text-[11px] leading-5 text-slate-700 dark:text-slate-200">
                  {generated?.supportedCharacters || 'Belum ada glyph yang dibuat.'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
              <Sparkles className="h-4 w-4 text-purple-500" /> Integrasi Cepat
            </h3>
            <p className="mt-2 text-sm">
              Simpan file font yang diunduh ke folder proyek Anda, kemudian gunakan snippet CSS berikut untuk memuatnya:
            </p>
            <pre className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
              <code>{generated?.cssSnippet || createCssSnippet(options.fontName, `${slugifyName(options.fontName) || 'ruangriung-font'}.ttf`)}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}

