'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Grid,
  LineChart,
  RefreshCcw,
  Ruler,
  Settings2,
  Shapes,
  Sparkles,
  Type as TypeIcon,
} from 'lucide-react';
import opentype from 'opentype.js';
import toast from 'react-hot-toast';
import ButtonSpinner from '@/components/ButtonSpinner';

type GeneratorOptions = {
  fontName: string;
  weight: number;
  width: number;
  roundness: number;
  slant: number;
  letterSpacing: number;
  xHeight: number;
  serifStrength: number;
  baselineShift: number;
  contrast: number;
};

type FontMetrics = {
  unitsPerEm: number;
  ascender: number;
  descender: number;
  uppercaseTop: number;
  lowercaseTop: number;
  widthFactor: number;
  horizontalPadding: number;
  serifHeight: number;
  letterSpacingUnits: number;
  baselineShiftUnits: number;
  slantIntensity: number;
  roundness: number;
  serifStrength: number;
  verticalScale: number;
  horizontalScale: number;
  descenderDepth: number;
};

type GlyphBuildResult = {
  glyph: opentype.Glyph | null;
  anchors?: number[];
};

type FontBuildResult = {
  font: opentype.Font;
  glyphCount: number;
  supportedCharacters: string[];
};

const GRID_COLUMNS = 5;
const GRID_ROWS = 7;

const ASCENDER_LETTERS = new Set(['b', 'd', 'f', 'h', 'k', 'l', 't']);
const DESCENDER_LETTERS = new Set(['g', 'j', 'p', 'q', 'y']);

const UPPERCASE_BLUEPRINTS: Record<string, string[]> = {
  A: ['00100', '01010', '10001', '10001', '11111', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
  J: ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10001', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '01010', '01010', '00100'],
  W: ['10001', '10001', '10001', '10001', '10101', '11011', '10001'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
};

const LOWERCASE_BLUEPRINTS: Record<string, string[]> = {
  a: ['00000', '00000', '01110', '00001', '01111', '10001', '01111'],
  b: ['10000', '10000', '11110', '10001', '10001', '10001', '11110'],
  c: ['00000', '00000', '01110', '10001', '10000', '10001', '01110'],
  d: ['00001', '00001', '01111', '10001', '10001', '10001', '01111'],
  e: ['00000', '00000', '01110', '10001', '11111', '10000', '01110'],
  f: ['00110', '01001', '01000', '11110', '01000', '01000', '01000'],
  g: ['00000', '00000', '01111', '10001', '10001', '01111', '00001'],
  h: ['10000', '10000', '11110', '10001', '10001', '10001', '10001'],
  i: ['00100', '00000', '01100', '00100', '00100', '00100', '01110'],
  j: ['00010', '00000', '00110', '00010', '00010', '10010', '01100'],
  k: ['10000', '10000', '10010', '10100', '11000', '10100', '10010'],
  l: ['01100', '00100', '00100', '00100', '00100', '00100', '01110'],
  m: ['00000', '00000', '11010', '10101', '10101', '10101', '10101'],
  n: ['00000', '00000', '11110', '10001', '10001', '10001', '10001'],
  o: ['00000', '00000', '01110', '10001', '10001', '10001', '01110'],
  p: ['00000', '00000', '11110', '10001', '10001', '11110', '10000'],
  q: ['00000', '00000', '01111', '10001', '10001', '01111', '00001'],
  r: ['00000', '00000', '10110', '11001', '10000', '10000', '10000'],
  s: ['00000', '00000', '01111', '10000', '01110', '00001', '11110'],
  t: ['00100', '00100', '11110', '00100', '00100', '00100', '00011'],
  u: ['00000', '00000', '10001', '10001', '10001', '10011', '01101'],
  v: ['00000', '00000', '10001', '10001', '01010', '01010', '00100'],
  w: ['00000', '00000', '10001', '10101', '10101', '11011', '10001'],
  x: ['00000', '00000', '10001', '01010', '00100', '01010', '10001'],
  y: ['00000', '00000', '10001', '10001', '01111', '00001', '01110'],
  z: ['00000', '00000', '11111', '00010', '00100', '01000', '11111'],
};

const DIGIT_BLUEPRINTS: Record<string, string[]> = {
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11110', '00001', '00001', '00110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
};

const SYMBOL_BLUEPRINTS: Record<string, string[]> = {
  '!': ['00100', '00100', '00100', '00100', '00100', '00000', '00100'],
  '?': ['01110', '10001', '00001', '00110', '00100', '00000', '00100'],
  '.': ['00000', '00000', '00000', '00000', '00000', '00100', '00100'],
  ',': ['00000', '00000', '00000', '00000', '00100', '00100', '01000'],
  ':': ['00000', '00100', '00100', '00000', '00100', '00100', '00000'],
  ';': ['00000', '00100', '00100', '00000', '00100', '00100', '01000'],
  '-': ['00000', '00000', '00000', '01110', '00000', '00000', '00000'],
  '+': ['00000', '00100', '00100', '11111', '00100', '00100', '00000'],
  '/': ['00001', '00010', '00100', '01000', '10000', '00000', '00000'],
  '*': ['00000', '01010', '00100', '11111', '00100', '01010', '00000'],
  "'": ['00100', '00100', '00000', '00000', '00000', '00000', '00000'],
  '"': ['01010', '01010', '00000', '00000', '00000', '00000', '00000'],
  '(': ['00010', '00100', '01000', '01000', '01000', '00100', '00010'],
  ')': ['01000', '00100', '00010', '00010', '00010', '00100', '01000'],
  '[': ['01110', '01000', '01000', '01000', '01000', '01000', '01110'],
  ']': ['01110', '00010', '00010', '00010', '00010', '00010', '01110'],
  '{': ['00110', '00100', '00100', '01000', '00100', '00100', '00110'],
  '}': ['01100', '00100', '00100', '00010', '00100', '00100', '01100'],
  '_': ['00000', '00000', '00000', '00000', '00000', '00000', '11111'],
  '=': ['00000', '00000', '11111', '00000', '11111', '00000', '00000'],
  '@': ['01110', '10001', '10011', '10101', '10111', '10000', '01111'],
  '#': ['01010', '11111', '01010', '11111', '01010', '01010', '01010'],
  '&': ['01100', '10010', '10100', '01000', '10101', '10010', '01101'],
  '%': ['11001', '11010', '00100', '01000', '10110', '01110', '00000'],
};

const CHARACTER_SET = Array.from(
  new Set([
    ...Object.keys(UPPERCASE_BLUEPRINTS),
    ...Object.keys(LOWERCASE_BLUEPRINTS),
    ...Object.keys(DIGIT_BLUEPRINTS),
    ...Object.keys(SYMBOL_BLUEPRINTS),
    ' ',
  ]),
);

const DEFAULT_PREVIEW_TEXT = `RuangRiung Typeface Lab
ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz
0123456789 !?.,-+`;

const FONT_ID_PREFIX = 'rrg-font-lab';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const slugifyFontName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const getBlueprintForChar = (char: string) => {
  if (LOWERCASE_BLUEPRINTS[char]) {
    return LOWERCASE_BLUEPRINTS[char];
  }

  if (UPPERCASE_BLUEPRINTS[char]) {
    return UPPERCASE_BLUEPRINTS[char];
  }

  if (DIGIT_BLUEPRINTS[char]) {
    return DIGIT_BLUEPRINTS[char];
  }

  if (SYMBOL_BLUEPRINTS[char]) {
    return SYMBOL_BLUEPRINTS[char];
  }

  const upper = char.toUpperCase();
  if (UPPERCASE_BLUEPRINTS[upper]) {
    return UPPERCASE_BLUEPRINTS[upper];
  }

  return undefined;
};

const addRoundedRect = (
  path: opentype.Path,
  left: number,
  top: number,
  right: number,
  bottom: number,
  radius: number,
) => {
  if (top <= bottom) {
    return;
  }

  const width = Math.abs(right - left);
  const height = Math.abs(top - bottom);
  const clampedRadius = clamp(radius, 0, Math.min(width, height) / 2);

  path.moveTo(left + clampedRadius, top);
  path.lineTo(right - clampedRadius, top);

  if (clampedRadius > 0) {
    path.quadraticCurveTo(right, top, right, top - clampedRadius);
  } else {
    path.lineTo(right, top);
  }

  path.lineTo(right, bottom + clampedRadius);

  if (clampedRadius > 0) {
    path.quadraticCurveTo(right, bottom, right - clampedRadius, bottom);
  } else {
    path.lineTo(right, bottom);
  }

  path.lineTo(left + clampedRadius, bottom);

  if (clampedRadius > 0) {
    path.quadraticCurveTo(left, bottom, left, bottom + clampedRadius);
  } else {
    path.lineTo(left, bottom);
  }

  path.lineTo(left, top - clampedRadius);

  if (clampedRadius > 0) {
    path.quadraticCurveTo(left, top, left + clampedRadius, top);
  } else {
    path.lineTo(left, top);
  }

  path.close();
};

const createGlyphForChar = (
  char: string,
  blueprint: string[],
  metrics: FontMetrics,
  options: GeneratorOptions,
): GlyphBuildResult => {
  const rows = blueprint.length;
  const cols = blueprint[0]?.length ?? GRID_COLUMNS;

  if (rows === 0 || cols === 0) {
    return { glyph: null };
  }

  const classification: 'uppercase' | 'lowercase' | 'digit' | 'symbol' =
    DIGIT_BLUEPRINTS[char]
      ? 'digit'
      : SYMBOL_BLUEPRINTS[char]
      ? 'symbol'
      : char === char.toLowerCase() && LOWERCASE_BLUEPRINTS[char]
      ? 'lowercase'
      : 'uppercase';

  const usesAscender =
    classification === 'uppercase' ||
    classification === 'digit' ||
    classification === 'symbol' ||
    ASCENDER_LETTERS.has(char);

  const targetTop = usesAscender ? metrics.uppercaseTop : metrics.lowercaseTop;
  const cellHeight = targetTop / rows;
  const cellWidth = cellHeight * metrics.widthFactor;
  const innerHeight = cellHeight * metrics.verticalScale;
  const innerWidth = cellWidth * metrics.horizontalScale;
  const innerOffsetY = (cellHeight - innerHeight) / 2;
  const innerOffsetX = (cellWidth - innerWidth) / 2;
  const topHeight = targetTop + 2 * innerOffsetY;
  const horizontalPadding = metrics.horizontalPadding * metrics.widthFactor;
  const path = new opentype.Path();
  const bottomAnchors: number[] = [];

  for (let row = 0; row < rows; row += 1) {
    const rowPattern = blueprint[row];

    for (let col = 0; col < cols; col += 1) {
      const cell = rowPattern[col];

      if (cell !== '1') {
        continue;
      }

      const slantOffset = metrics.slantIntensity * ((rows - row - 0.5) / rows) * cellHeight;
      const rawTop = topHeight - row * cellHeight;
      const rawBottom = topHeight - (row + 1) * cellHeight;
      const xLeft = horizontalPadding + col * cellWidth + innerOffsetX + slantOffset;
      const xRight = xLeft + innerWidth;
      const yTop = rawTop - 2 * innerOffsetY + metrics.baselineShiftUnits;
      const yBottom = rawBottom + metrics.baselineShiftUnits;
      const radius = Math.min(innerWidth, innerHeight) * metrics.roundness * 0.5;

      addRoundedRect(path, xLeft, yTop, xRight, yBottom, radius);

      if (metrics.serifStrength > 0 && row === rows - 1) {
        const serifWidth = innerWidth + cellWidth * 0.5 * metrics.serifStrength;
        const center = (xLeft + xRight) / 2;
        const serifLeft = center - serifWidth / 2;
        const serifRight = center + serifWidth / 2;
        const serifHeightTop = metrics.serifHeight * (0.6 + 0.4 * metrics.serifStrength);
        const serifRadius = Math.min(serifWidth, serifHeightTop) * metrics.roundness * 0.3;
        addRoundedRect(
          path,
          serifLeft,
          metrics.baselineShiftUnits + serifHeightTop,
          serifRight,
          metrics.baselineShiftUnits - serifHeightTop * 0.2,
          serifRadius,
        );
      }

      if (metrics.serifStrength > 0 && row === 0) {
        const serifWidthTop = innerWidth + cellWidth * 0.4 * metrics.serifStrength;
        const centerTop = (xLeft + xRight) / 2;
        const serifLeftTop = centerTop - serifWidthTop / 2;
        const serifRightTop = centerTop + serifWidthTop / 2;
        const serifHeightTop = metrics.serifHeight * (0.5 + 0.5 * metrics.serifStrength);
        const serifRadiusTop = Math.min(serifWidthTop, serifHeightTop) * metrics.roundness * 0.3;
        addRoundedRect(
          path,
          serifLeftTop,
          yTop + serifHeightTop * 0.8,
          serifRightTop,
          yTop - serifHeightTop * 0.2,
          serifRadiusTop,
        );
      }

      if (row === rows - 1) {
        bottomAnchors.push((xLeft + xRight) / 2);
      }
    }
  }

  if (DESCENDER_LETTERS.has(char) && bottomAnchors.length > 0) {
    const anchor = bottomAnchors.reduce((acc, value) => acc + value, 0) / bottomAnchors.length;
    const descWidth = innerWidth + cellWidth * 0.4;
    const descLeft = anchor - descWidth / 2;
    const descRight = anchor + descWidth / 2;
    const tailTop = metrics.baselineShiftUnits + metrics.serifHeight * 0.6;
    const tailBottom = metrics.baselineShiftUnits + metrics.descender;
    const tailRadius = Math.min(descWidth, Math.abs(tailTop - tailBottom)) * metrics.roundness * 0.3;
    addRoundedRect(path, descLeft, tailTop, descRight, tailBottom, tailRadius);
  }

  if (path.commands.length === 0) {
    return { glyph: null };
  }

  const baseAdvance = horizontalPadding * 2 + cols * cellWidth;
  const advanceWidth = Math.max(baseAdvance + metrics.letterSpacingUnits, metrics.unitsPerEm * 0.2);
  const unicode = char.codePointAt(0);

  if (unicode === undefined) {
    return { glyph: null };
  }

  const glyph = new opentype.Glyph({
    name: `glyph_${unicode}`,
    unicode,
    advanceWidth,
    path,
  });

  return { glyph };
};

const buildFont = (options: GeneratorOptions): FontBuildResult => {
  const unitsPerEm = 1000;
  const ascender = 760;
  const descender = -240;
  const xHeightRatio = clamp(options.xHeight, 0.45, 0.9);
  const widthFactor = clamp(options.width, 0.75, 1.35);
  const slantIntensity = clamp(options.slant, -0.6, 0.6);
  const roundness = clamp(options.roundness, 0, 1);
  const serifStrength = clamp(options.serifStrength, 0, 1);
  const letterSpacingUnits = clamp(options.letterSpacing, -0.15, 0.35) * unitsPerEm;
  const baselineShiftUnits = clamp(options.baselineShift, -0.15, 0.15) * unitsPerEm;
  const contrast = clamp(options.contrast, -0.6, 0.6);
  const weightBase = clamp(0.45 + options.weight * 0.45, 0.3, 1);
  const verticalScale = clamp(weightBase + contrast * 0.4, 0.25, 1);
  const horizontalScale = clamp(weightBase - contrast * 0.4, 0.25, 1);

  const metrics: FontMetrics = {
    unitsPerEm,
    ascender,
    descender,
    uppercaseTop: ascender,
    lowercaseTop: ascender * xHeightRatio,
    widthFactor,
    horizontalPadding: unitsPerEm * 0.08,
    serifHeight: unitsPerEm * 0.045,
    letterSpacingUnits,
    baselineShiftUnits,
    slantIntensity,
    roundness,
    serifStrength,
    verticalScale,
    horizontalScale,
    descenderDepth: Math.abs(descender),
  };

  const glyphs: opentype.Glyph[] = [
    new opentype.Glyph({ name: '.notdef', unicode: 0, advanceWidth: unitsPerEm * 0.5 }),
  ];

  const supportedCharacters: string[] = [];

  for (const char of CHARACTER_SET) {
    if (char === ' ') {
      const advanceWidth = Math.max(unitsPerEm * 0.35 + letterSpacingUnits, unitsPerEm * 0.2);
      glyphs.push(new opentype.Glyph({ name: 'space', unicode: 32, advanceWidth }));
      supportedCharacters.push(char);
      continue;
    }

    const blueprint = getBlueprintForChar(char);

    if (!blueprint) {
      continue;
    }

    const result = createGlyphForChar(char, blueprint, metrics, options);

    if (!result.glyph) {
      continue;
    }

    glyphs.push(result.glyph);
    supportedCharacters.push(char);
  }

  const font = new opentype.Font({
    familyName: options.fontName || 'RRG Custom Font',
    styleName: 'Regular',
    unitsPerEm,
    ascender,
    descender,
    glyphs,
  });

  return {
    font,
    glyphCount: supportedCharacters.length,
    supportedCharacters,
  };
};

const buildCssSnippet = (fontFamily: string, fileName: string) => `@font-face {
  font-family: '${fontFamily}';
  src: url('./${fileName}') format('truetype');
  font-weight: 400;
  font-style: normal;
}

body {
  font-family: '${fontFamily}', system-ui, sans-serif;
}`;

const formatNumber = (value: number, fractionDigits = 2) =>
  Number.parseFloat(value.toFixed(fractionDigits)).toString();

const FontGeneratorClient = () => {
  const [fontName, setFontName] = useState('RuangRiung Custom');
  const [weight, setWeight] = useState(0.55);
  const [width, setWidth] = useState(1);
  const [roundness, setRoundness] = useState(0.25);
  const [slant, setSlant] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [letterSpacing, setLetterSpacing] = useState(0.02);
  const [xHeight, setXHeight] = useState(0.68);
  const [serifStrength, setSerifStrength] = useState(0);
  const [baselineShift, setBaselineShift] = useState(0);
  const [previewText, setPreviewText] = useState(DEFAULT_PREVIEW_TEXT);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fontUrl, setFontUrl] = useState<string | null>(null);
  const [fontVersion, setFontVersion] = useState(1);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const [generatedInfo, setGeneratedInfo] = useState<
    | {
        glyphCount: number;
        fileSize: number;
        cssSnippet: string;
        fontFileName: string;
        supportedCharacters: string[];
      }
    | null
  >(null);

  const fontFaceRef = useRef<FontFace | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const normalizedFontName = useMemo(() => fontName.trim() || 'RRG Custom Font', [fontName]);

  const options = useMemo<GeneratorOptions>(
    () => ({
      fontName: normalizedFontName,
      weight,
      width,
      roundness,
      slant,
      letterSpacing,
      xHeight,
      serifStrength,
      baselineShift,
      contrast,
    }),
    [normalizedFontName, weight, width, roundness, slant, letterSpacing, xHeight, serifStrength, baselineShift, contrast],
  );

  const previewFamily = useMemo(() => `${FONT_ID_PREFIX}-${fontVersion}`, [fontVersion]);

  const markDirty = useCallback(() => {
    if (!autoGenerate) {
      setHasUnsavedChanges(true);
    }
  }, [autoGenerate]);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setCopyState('idle');

    try {
      const { font, glyphCount, supportedCharacters } = buildFont(options);
      const arrayBuffer = font.toArrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'font/ttf' });
      const objectUrl = URL.createObjectURL(blob);

      setFontUrl(previous => {
        if (previous) {
          URL.revokeObjectURL(previous);
        }
        return objectUrl;
      });

      const nextVersion = fontVersion + 1;
      setFontVersion(nextVersion);

      const baseName = slugifyFontName(options.fontName) || FONT_ID_PREFIX;
      const fileName = `${baseName}-v${nextVersion}.ttf`;

      setGeneratedInfo({
        glyphCount,
        fileSize: arrayBuffer.byteLength,
        cssSnippet: buildCssSnippet(options.fontName, fileName),
        fontFileName: fileName,
        supportedCharacters,
      });

      setPreviewReady(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Gagal membangun font', error);
      toast.error('Gagal membuat font .ttf. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  }, [fontVersion, options]);

  useEffect(() => {
    if (autoGenerate) {
      handleGenerate();
    } else {
      setHasUnsavedChanges(true);
    }
  }, [autoGenerate, handleGenerate]);

  useEffect(() => {
    if (!fontUrl) {
      setPreviewReady(false);
      return;
    }

    const face = new FontFace(previewFamily, `url(${fontUrl})`);
    let cancelled = false;

    face
      .load()
      .then(loaded => {
        if (cancelled) {
          return;
        }
        if (fontFaceRef.current) {
          document.fonts.delete(fontFaceRef.current);
        }
        document.fonts.add(loaded);
        fontFaceRef.current = loaded;
        setPreviewReady(true);
      })
      .catch(error => {
        if (!cancelled) {
          console.error('Font gagal dimuat', error);
          toast.error('Font berhasil dibuat, tetapi pratinjau gagal dimuat.');
          setPreviewReady(false);
        }
      });

    return () => {
      cancelled = true;
      if (fontFaceRef.current) {
        document.fonts.delete(fontFaceRef.current);
        fontFaceRef.current = null;
      }
    };
  }, [fontUrl, previewFamily]);

  useEffect(() => () => {
    if (fontUrl) {
      URL.revokeObjectURL(fontUrl);
    }
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
  }, [fontUrl]);

  const handleCopyCss = useCallback(() => {
    if (!generatedInfo) {
      toast.error('Bangun font terlebih dahulu untuk menyalin snippet.');
      return;
    }

    navigator.clipboard
      .writeText(generatedInfo.cssSnippet)
      .then(() => {
        setCopyState('copied');
        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current);
        }
        copyTimeoutRef.current = setTimeout(() => setCopyState('idle'), 1600);
      })
      .catch(() => {
        toast.error('Gagal menyalin snippet CSS.');
      });
  }, [generatedInfo]);

  const supportedGroups = useMemo(() => {
    if (!generatedInfo) {
      return [] as { label: string; value: string }[];
    }

    const uppercase = generatedInfo.supportedCharacters.filter(char => /[A-Z]/.test(char));
    const lowercase = generatedInfo.supportedCharacters.filter(char => /[a-z]/.test(char));
    const digits = generatedInfo.supportedCharacters.filter(char => /[0-9]/.test(char));
    const symbols = generatedInfo.supportedCharacters
      .filter(char => !/[A-Za-z0-9]/.test(char))
      .map(char => (char === ' ' ? '␠' : char));

    return [
      { label: 'Huruf kapital', value: uppercase.join(' ') },
      { label: 'Huruf kecil', value: lowercase.join(' ') },
      { label: 'Angka', value: digits.join(' ') },
      { label: 'Simbol & spasi', value: symbols.join(' ') },
    ].filter(group => group.value.trim().length > 0);
  }, [generatedInfo]);

  const previewStyle = useMemo(
    () => ({
      fontFamily: previewReady && fontUrl ? `'${previewFamily}', system-ui, sans-serif` : 'system-ui, sans-serif',
    }),
    [previewFamily, previewReady, fontUrl],
  );

  const fileSizeLabel = generatedInfo ? `${formatNumber(generatedInfo.fileSize / 1024, 1)} KB` : '--';

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-purple-100 p-2 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
            <TypeIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 sm:text-3xl">
              Laboratorium Font Generator
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Rancang, pratinjau, dan unduh file .ttf kustom langsung dari browser Anda.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              checked={autoGenerate}
              onChange={event => setAutoGenerate(event.target.checked)}
            />
            Otomatis bangun ulang
          </label>
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-700 shadow-sm transition hover:border-purple-300 hover:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:border-purple-800/60 dark:bg-gray-900 dark:text-purple-300 dark:hover:border-purple-700"
            disabled={isGenerating}
          >
            {isGenerating ? <ButtonSpinner className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            {isGenerating ? 'Memproses font...' : 'Bangun font sekarang'}
          </button>
        </div>
      </div>

      {hasUnsavedChanges && !autoGenerate && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          Perubahan parameter belum diterapkan. Klik "Bangun font sekarang" untuk menghasilkan versi terbaru.
        </div>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Shapes className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-semibold">Identitas font</h2>
            </div>
            <div className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nama font
                <input
                  type="text"
                  value={fontName}
                  onChange={event => {
                    setFontName(event.target.value);
                    markDirty();
                  }}
                  placeholder="Contoh: RuangRiung Sans"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                    <span>Ketebalan stroke</span>
                    <span>{formatNumber(weight * 100, 0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={weight}
                    onChange={event => {
                      setWeight(Number.parseFloat(event.target.value));
                      markDirty();
                    }}
                    className="mt-2 w-full accent-purple-600"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                    <span>Lebar huruf</span>
                    <span>{formatNumber(width, 2)}×</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.35"
                    step="0.01"
                    value={width}
                    onChange={event => {
                      setWidth(Number.parseFloat(event.target.value));
                      markDirty();
                    }}
                    className="mt-2 w-full accent-purple-600"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                    <span>Rounding sudut</span>
                    <span>{formatNumber(roundness * 100, 0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={roundness}
                    onChange={event => {
                      setRoundness(Number.parseFloat(event.target.value));
                      markDirty();
                    }}
                    className="mt-2 w-full accent-purple-600"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                    <span>Kemiringan</span>
                    <span>{formatNumber(slant * 45, 0)}°</span>
                  </div>
                  <input
                    type="range"
                    min="-0.6"
                    max="0.6"
                    step="0.01"
                    value={slant}
                    onChange={event => {
                      setSlant(Number.parseFloat(event.target.value));
                      markDirty();
                    }}
                    className="mt-2 w-full accent-purple-600"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Settings2 className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-semibold">Pengaturan bentuk</h2>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                  <span>Kontras vertikal/horizontal</span>
                  <span>{formatNumber(contrast * 100, 0)}%</span>
                </div>
                <input
                  type="range"
                  min="-0.5"
                  max="0.5"
                  step="0.01"
                  value={contrast}
                  onChange={event => {
                    setContrast(Number.parseFloat(event.target.value));
                    markDirty();
                  }}
                  className="mt-2 w-full accent-purple-600"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                  <span>Kekuatan serif</span>
                  <span>{formatNumber(serifStrength * 100, 0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={serifStrength}
                  onChange={event => {
                    setSerifStrength(Number.parseFloat(event.target.value));
                    markDirty();
                  }}
                  className="mt-2 w-full accent-purple-600"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                  <span>Jarak huruf (tracking)</span>
                  <span>{formatNumber(letterSpacing, 2)} em</span>
                </div>
                <input
                  type="range"
                  min="-0.1"
                  max="0.25"
                  step="0.01"
                  value={letterSpacing}
                  onChange={event => {
                    setLetterSpacing(Number.parseFloat(event.target.value));
                    markDirty();
                  }}
                  className="mt-2 w-full accent-purple-600"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                  <span>x-height</span>
                  <span>{formatNumber(xHeight * 100, 0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="0.85"
                  step="0.01"
                  value={xHeight}
                  onChange={event => {
                    setXHeight(Number.parseFloat(event.target.value));
                    markDirty();
                  }}
                  className="mt-2 w-full accent-purple-600"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                  <span>Posisi baseline</span>
                  <span>{formatNumber(baselineShift * 100, 1)}%</span>
                </div>
                <input
                  type="range"
                  min="-0.1"
                  max="0.1"
                  step="0.005"
                  value={baselineShift}
                  onChange={event => {
                    setBaselineShift(Number.parseFloat(event.target.value));
                    markDirty();
                  }}
                  className="mt-2 w-full accent-purple-600"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between text-gray-900 dark:text-gray-100">
              <div className="flex items-center gap-2">
                <Grid className="h-5 w-5 text-purple-500" />
                <h2 className="text-lg font-semibold">Pratinjau langsung</h2>
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{previewFamily}</span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,240px)_1fr]">
              <label className="flex flex-col text-xs font-medium text-gray-600 dark:text-gray-400">
                Teks pratinjau
                <textarea
                  value={previewText}
                  onChange={event => setPreviewText(event.target.value)}
                  className="mt-2 h-32 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                />
              </label>
              <div
                className="rounded-xl border border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white p-4 text-gray-900 shadow-inner dark:border-gray-700 dark:from-gray-950 dark:to-gray-900"
                style={previewStyle}
              >
                <div className="min-h-[160px] whitespace-pre-wrap text-lg leading-relaxed sm:text-xl">
                  {previewText}
                </div>
                {!previewReady && (
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    Font sedang dimuat untuk pratinjau. Jika tidak tampil, unduh file .ttf untuk memeriksa hasilnya.
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={fontUrl ?? '#'}
                download={generatedInfo?.fontFileName ?? `${slugifyFontName(normalizedFontName) || FONT_ID_PREFIX}.ttf`}
                onClick={event => {
                  if (!fontUrl) {
                    event.preventDefault();
                    toast.error('Belum ada file font yang dapat diunduh.');
                  }
                }}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  fontUrl
                    ? 'border border-purple-200 bg-purple-600 text-white shadow-sm hover:bg-purple-500'
                    : 'cursor-not-allowed border border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500'
                }`}
              >
                <Download className="h-4 w-4" />
                Unduh file .ttf
              </a>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {generatedInfo ? `${generatedInfo.glyphCount} glif · ${fileSizeLabel}` : 'Bangun font untuk melihat detail file.'}
              </span>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <LineChart className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-semibold">Ringkasan metrik</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Jumlah glif</div>
                <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {generatedInfo ? generatedInfo.glyphCount : '--'}
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Ukuran file</div>
                <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{fileSizeLabel}</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Units per em</div>
                <div className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">1000</div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Ascender 760 · Descender -240</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-950">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Parameter aktif</div>
                <ul className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  <li>Ketebalan: {formatNumber(weight * 100, 0)}%</li>
                  <li>Serif: {formatNumber(serifStrength * 100, 0)}%</li>
                  <li>Tracking: {formatNumber(letterSpacing, 2)} em</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between text-gray-900 dark:text-gray-100">
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-purple-500" />
                <h2 className="text-lg font-semibold">Snippet @font-face</h2>
              </div>
              <button
                type="button"
                onClick={handleCopyCss}
                disabled={!generatedInfo}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  generatedInfo
                    ? 'border-purple-200 text-purple-700 hover:border-purple-300 dark:border-purple-800/60 dark:text-purple-200'
                    : 'cursor-not-allowed border-gray-300 text-gray-400 dark:border-gray-700 dark:text-gray-500'
                }`}
              >
                {copyState === 'copied' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copyState === 'copied' ? 'Disalin' : 'Salin CSS'}
              </button>
            </div>
            <pre className="mt-4 max-h-64 overflow-auto rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-800 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200">
              {generatedInfo ? generatedInfo.cssSnippet : `@font-face {\n  /* Bangun font untuk mendapatkan snippet otomatis */\n}`}
            </pre>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <RefreshCcw className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-semibold">Karakter yang tersedia</h2>
            </div>
            {supportedGroups.length > 0 ? (
              <div className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                {supportedGroups.map(group => (
                  <div key={group.label}>
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {group.label}
                    </div>
                    <div className="mt-1 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 font-mono text-sm dark:border-gray-700 dark:bg-gray-950">
                      {group.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Bangun font untuk melihat daftar karakter yang disertakan.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default FontGeneratorClient;
