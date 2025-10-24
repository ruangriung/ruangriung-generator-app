type PathCommand =
  | { type: 'M'; x: number; y: number }
  | { type: 'L'; x: number; y: number }
  | { type: 'Q'; x1: number; y1: number; x: number; y: number }
  | { type: 'Z' };

type ContourPoint = { x: number; y: number; onCurve: boolean };

type GlyphOptions = {
  name: string;
  unicode?: number;
  advanceWidth: number;
  path: Path;
};

type FontOptions = {
  familyName: string;
  styleName: string;
  unitsPerEm: number;
  ascender: number;
  descender: number;
  glyphs: Glyph[];
  xHeight?: number;
  capHeight?: number;
};

class BinaryWriter {
  private bytes: number[] = [];

  get length() {
    return this.bytes.length;
  }

  uint8(value: number) {
    this.bytes.push(value & 0xff);
  }

  int16(value: number) {
    const v = (value + 0x10000) & 0xffff;
    this.uint8((v >> 8) & 0xff);
    this.uint8(v & 0xff);
  }

  uint16(value: number) {
    const v = value & 0xffff;
    this.uint8((v >> 8) & 0xff);
    this.uint8(v & 0xff);
  }

  uint32(value: number) {
    const v = value >>> 0;
    this.uint8((v >>> 24) & 0xff);
    this.uint8((v >>> 16) & 0xff);
    this.uint8((v >>> 8) & 0xff);
    this.uint8(v & 0xff);
  }

  writeBytes(data: Uint8Array) {
    for (let i = 0; i < data.length; i += 1) {
      this.uint8(data[i]);
    }
  }

  pad(count: number) {
    for (let i = 0; i < count; i += 1) {
      this.uint8(0);
    }
  }

  alignTo4() {
    while (this.bytes.length % 4 !== 0) {
      this.uint8(0);
    }
  }

  toUint8Array() {
    return Uint8Array.from(this.bytes);
  }
}

function roundCoordinate(value: number) {
  return Math.round(value);
}

function align4(value: number) {
  return (value + 3) & ~3;
}

function calcChecksum(data: Uint8Array) {
  const paddedLength = align4(data.length);
  const padded = new Uint8Array(paddedLength);
  padded.set(data);
  let sum = 0;
  for (let i = 0; i < paddedLength; i += 4) {
    sum = (sum + ((padded[i] << 24) | (padded[i + 1] << 16) | (padded[i + 2] << 8) | padded[i + 3])) >>> 0;
  }
  return sum >>> 0;
}

function writeTag(writer: BinaryWriter, tag: string) {
  const padded = tag.padEnd(4, ' ');
  for (let i = 0; i < 4; i += 1) {
    writer.uint8(padded.charCodeAt(i));
  }
}

export class Path {
  commands: PathCommand[] = [];

  moveTo(x: number, y: number) {
    this.commands.push({ type: 'M', x, y });
  }

  lineTo(x: number, y: number) {
    this.commands.push({ type: 'L', x, y });
  }

  quadraticCurveTo(x1: number, y1: number, x: number, y: number) {
    this.commands.push({ type: 'Q', x1, y1, x, y });
  }

  closePath() {
    this.commands.push({ type: 'Z' });
  }
}

export class Glyph {
  name: string;
  unicode?: number;
  advanceWidth: number;
  path: Path;

  constructor({ name, unicode, advanceWidth, path }: GlyphOptions) {
    this.name = name;
    this.unicode = unicode;
    this.advanceWidth = advanceWidth;
    this.path = path;
  }
}

type GlyphContour = {
  points: ContourPoint[];
};

type GlyphData = {
  contours: GlyphContour[];
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  advanceWidth: number;
  leftSideBearing: number;
  unicode?: number;
  name: string;
};

function pathToContours(path: Path): GlyphContour[] {
  const contours: GlyphContour[] = [];
  let current: ContourPoint[] | null = null;

  const pushContour = () => {
    if (!current || current.length === 0) {
      current = null;
      return;
    }

    if (!current[0].onCurve) {
      const firstOnCurveIndex = current.findIndex(point => point.onCurve);
      if (firstOnCurveIndex > 0) {
        const rotated = current.slice(firstOnCurveIndex);
        rotated.push(...current.slice(0, firstOnCurveIndex));
        current = rotated;
      }
    }

    const first = current[0];
    const last = current[current.length - 1];
    if (last && (last.x !== first.x || last.y !== first.y || last.onCurve !== first.onCurve)) {
      current.push({ ...first });
    }

    if (current.length > 1) {
      const maybeDuplicate = current[current.length - 1];
      if (maybeDuplicate.x === current[0].x && maybeDuplicate.y === current[0].y) {
        current.pop();
      }
    }

    if (current.length >= 2) {
      contours.push({ points: current });
    }

    current = null;
  };

  for (const command of path.commands) {
    switch (command.type) {
      case 'M': {
        if (current && current.length) {
          pushContour();
        }
        current = [{ x: command.x, y: command.y, onCurve: true }];
        break;
      }
      case 'L': {
        if (!current) {
          current = [{ x: command.x, y: command.y, onCurve: true }];
        } else {
          current.push({ x: command.x, y: command.y, onCurve: true });
        }
        break;
      }
      case 'Q': {
        if (!current) {
          current = [{ x: command.x, y: command.y, onCurve: true }];
        }
        current.push({ x: command.x1, y: command.y1, onCurve: false });
        current.push({ x: command.x, y: command.y, onCurve: true });
        break;
      }
      case 'Z': {
        pushContour();
        break;
      }
      default:
        break;
    }
  }

  if (current && current.length) {
    pushContour();
  }

  return contours;
}

function buildGlyphData(glyph: Glyph): GlyphData {
  const contours = pathToContours(glyph.path);

  if (contours.length === 0) {
    return {
      contours,
      xMin: 0,
      xMax: 0,
      yMin: 0,
      yMax: 0,
      advanceWidth: Math.round(glyph.advanceWidth),
      leftSideBearing: 0,
      unicode: glyph.unicode,
      name: glyph.name,
    };
  }

  let xMin = Infinity;
  let xMax = -Infinity;
  let yMin = Infinity;
  let yMax = -Infinity;

  for (const contour of contours) {
    for (const point of contour.points) {
      xMin = Math.min(xMin, point.x);
      xMax = Math.max(xMax, point.x);
      yMin = Math.min(yMin, point.y);
      yMax = Math.max(yMax, point.y);
    }
  }

  const roundedXMin = roundCoordinate(xMin);
  const roundedXMax = roundCoordinate(xMax);
  const roundedYMin = roundCoordinate(yMin);
  const roundedYMax = roundCoordinate(yMax);

  return {
    contours,
    xMin: roundedXMin,
    xMax: roundedXMax,
    yMin: roundedYMin,
    yMax: roundedYMax,
    advanceWidth: Math.round(glyph.advanceWidth),
    leftSideBearing: Math.round(roundedXMin),
    unicode: glyph.unicode,
    name: glyph.name,
  };
}


function encodeGlyph(glyph: GlyphData) {
  const writer = new BinaryWriter();

  if (glyph.contours.length === 0) {
    writer.int16(0);
    writer.int16(glyph.xMin);
    writer.int16(glyph.yMin);
    writer.int16(glyph.xMax);
    writer.int16(glyph.yMax);
    writer.uint16(0);
    return writer.toUint8Array();
  }

  const endPoints: number[] = [];
  const flags: number[] = [];
  const xCoords: number[] = [];
  const yCoords: number[] = [];

  let pointIndex = 0;
  let lastX = 0;
  let lastY = 0;

  for (const contour of glyph.contours) {
    for (const point of contour.points) {
      const roundedX = roundCoordinate(point.x);
      const roundedY = roundCoordinate(point.y);
      const flag = point.onCurve ? 0x01 : 0x00;
      flags.push(flag);
      xCoords.push(roundedX - lastX);
      yCoords.push(roundedY - lastY);
      lastX = roundedX;
      lastY = roundedY;
      pointIndex += 1;
    }
    endPoints.push(pointIndex - 1);
  }

  writer.int16(glyph.contours.length);
  writer.int16(glyph.xMin);
  writer.int16(glyph.yMin);
  writer.int16(glyph.xMax);
  writer.int16(glyph.yMax);

  for (const endPoint of endPoints) {
    writer.uint16(endPoint);
  }

  writer.uint16(0);

  for (const flag of flags) {
    writer.uint8(flag);
  }

  for (const deltaX of xCoords) {
    writer.int16(deltaX);
  }

  for (const deltaY of yCoords) {
    writer.int16(deltaY);
  }

  return writer.toUint8Array();
}

function buildGlyfTable(glyphs: GlyphData[]) {
  const loca: number[] = [];
  const glyfWriter = new BinaryWriter();

  for (const glyph of glyphs) {
    loca.push(glyfWriter.length);
    const glyphBytes = encodeGlyph(glyph);
    glyfWriter.writeBytes(glyphBytes);
    glyfWriter.alignTo4();
  }

  loca.push(glyfWriter.length);

  return {
    glyf: glyfWriter.toUint8Array(),
    loca,
  };
}

function buildLocaTable(loca: number[]) {
  const writer = new BinaryWriter();
  for (const offset of loca) {
    writer.uint32(offset);
  }
  return writer.toUint8Array();
}

function buildHeadTable(
  unitsPerEm: number,
  ascender: number,
  descender: number,
  xMin: number,
  yMin: number,
  xMax: number,
  yMax: number,
) {
  const writer = new BinaryWriter();
  writer.uint32(0x00010000);
  writer.uint32(0x00010000);
  writer.uint32(0);
  writer.uint32(0x5f0f3cf5);
  writer.uint16(0b0000000000000011);
  writer.uint16(unitsPerEm);
  writer.uint32(0);
  writer.uint32(0);
  writer.int16(xMin);
  writer.int16(yMin);
  writer.int16(xMax);
  writer.int16(yMax);
  writer.uint16(0);
  writer.uint16(0);
  writer.int16(ascender);
  writer.int16(descender);
  writer.int16(0);
  writer.int16(1);
  writer.int16(0);
  writer.int16(0);
  writer.int16(0);
  writer.int16(0);
  writer.int16(0);
  writer.int16(0);
  writer.int16(0);
  writer.uint16(1);
  writer.int16(0);
  writer.int16(0);
  return writer.toUint8Array();
}

function buildHheaTable(
  ascender: number,
  descender: number,
  advanceWidthMax: number,
  minLeftSideBearing: number,
  minRightSideBearing: number,
  xMaxExtent: number,
  numGlyphs: number,
) {
  const writer = new BinaryWriter();
  writer.uint32(0x00010000);
  writer.int16(ascender);
  writer.int16(descender);
  writer.int16(0);
  writer.uint16(advanceWidthMax);
  writer.int16(minLeftSideBearing);
  writer.int16(minRightSideBearing);
  writer.int16(xMaxExtent);
  writer.int16(1);
  writer.int16(0);
  writer.int16(0);
  writer.int16(0);
  writer.int16(0);
  writer.int16(0);
  writer.int16(0);
  writer.int16(0);
  writer.uint16(numGlyphs);
  return writer.toUint8Array();
}

function buildHmtxTable(glyphs: GlyphData[]) {
  const writer = new BinaryWriter();
  for (const glyph of glyphs) {
    writer.uint16(glyph.advanceWidth);
    writer.int16(glyph.leftSideBearing);
  }
  return writer.toUint8Array();
}

function buildMaxpTable(glyphs: GlyphData[]) {
  let maxPoints = 0;
  let maxContours = 0;

  for (const glyph of glyphs) {
    const contourPoints = glyph.contours.reduce((sum, contour) => sum + contour.points.length, 0);
    maxPoints = Math.max(maxPoints, contourPoints);
    maxContours = Math.max(maxContours, glyph.contours.length);
  }

  const writer = new BinaryWriter();
  writer.uint32(0x00010000);
  writer.uint16(glyphs.length);
  writer.uint16(maxPoints);
  writer.uint16(maxContours);
  writer.uint16(0);
  writer.uint16(0);
  writer.uint16(0);
  writer.uint16(0);
  writer.uint16(0);
  writer.uint16(0);
  writer.uint16(0);
  writer.uint16(0);
  writer.uint16(0);
  writer.uint16(0);
  return writer.toUint8Array();
}

function buildPostTable() {
  const writer = new BinaryWriter();
  writer.uint32(0x00030000);
  writer.uint32(0);
  writer.uint32(0);
  writer.uint32(0);
  writer.uint32(0);
  writer.uint32(0);
  writer.uint32(0);
  writer.uint16(0);
  writer.uint16(0);
  writer.uint16(0);
  writer.uint16(0);
  return writer.toUint8Array();
}

function buildNameRecord(platformID: number, encodingID: number, languageID: number, nameID: number, text: string) {
  const isUnicode = platformID === 0 || platformID === 3;
  let bytes: Uint8Array;

  if (isUnicode) {
    const buffer = new Uint8Array(text.length * 2);
    for (let i = 0; i < text.length; i += 1) {
      const code = text.charCodeAt(i);
      buffer[i * 2] = (code >> 8) & 0xff;
      buffer[i * 2 + 1] = code & 0xff;
    }
    bytes = buffer;
  } else {
    bytes = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i += 1) {
      bytes[i] = Math.min(0xff, text.charCodeAt(i));
    }
  }

  return { platformID, encodingID, languageID, nameID, bytes };
}

function buildNameTable(familyName: string, styleName: string) {
  const records = [
    buildNameRecord(0, 3, 0, 1, familyName),
    buildNameRecord(0, 3, 0, 2, styleName),
    buildNameRecord(0, 3, 0, 4, `${familyName} ${styleName}`.trim()),
    buildNameRecord(0, 3, 0, 6, `${familyName.replace(/\s+/g, '')}-${styleName.replace(/\s+/g, '')}`),
    buildNameRecord(3, 1, 0x0409, 1, familyName),
    buildNameRecord(3, 1, 0x0409, 2, styleName),
    buildNameRecord(3, 1, 0x0409, 4, `${familyName} ${styleName}`.trim()),
    buildNameRecord(3, 1, 0x0409, 6, `${familyName.replace(/\s+/g, '')}-${styleName.replace(/\s+/g, '')}`),
  ];

  const writer = new BinaryWriter();
  writer.uint16(0);
  writer.uint16(records.length);
  writer.uint16(6 + records.length * 12);

  let offset = 0;
  for (const record of records) {
    writer.uint16(record.platformID);
    writer.uint16(record.encodingID);
    writer.uint16(record.languageID);
    writer.uint16(record.nameID);
    writer.uint16(record.bytes.length);
    writer.uint16(offset);
    offset += record.bytes.length;
  }

  for (const record of records) {
    writer.writeBytes(record.bytes);
  }

  writer.alignTo4();
  return writer.toUint8Array();
}

function buildCmapTable(glyphs: GlyphData[]) {
  const glyphIndexMap = new Uint8Array(256);
  glyphIndexMap.fill(0);

  glyphs.forEach((glyph, index) => {
    if (glyph.unicode !== undefined && glyph.unicode >= 0 && glyph.unicode < 256) {
      glyphIndexMap[glyph.unicode] = index;
    }
  });

  const subtableLength = 6 + glyphIndexMap.length;
  const writer = new BinaryWriter();
  writer.uint16(0);
  writer.uint16(2);
  writer.uint16(0);
  writer.uint16(3);
  writer.uint32(12);
  writer.uint16(3);
  writer.uint16(1);
  writer.uint32(12 + subtableLength);

  const subtableWriter = new BinaryWriter();
  subtableWriter.uint16(0);
  subtableWriter.uint16(subtableLength);
  subtableWriter.uint16(0);
  subtableWriter.writeBytes(glyphIndexMap);

  const subtableWriter2 = new BinaryWriter();
  subtableWriter2.uint16(0);
  subtableWriter2.uint16(subtableLength);
  subtableWriter2.uint16(0);
  subtableWriter2.writeBytes(glyphIndexMap);

  writer.writeBytes(subtableWriter.toUint8Array());
  writer.writeBytes(subtableWriter2.toUint8Array());

  writer.alignTo4();
  return writer.toUint8Array();
}

function buildOs2Table(
  unitsPerEm: number,
  ascender: number,
  descender: number,
  glyphs: GlyphData[],
  xHeight?: number,
  capHeight?: number,
) {
  const writer = new BinaryWriter();
  writer.uint16(1);
  const averageWidth = glyphs.reduce((sum, glyph) => sum + glyph.advanceWidth, 0) / glyphs.length;
  writer.int16(Math.round(averageWidth));
  writer.uint16(400);
  writer.uint16(5);
  writer.int16(0);
  writer.int16(Math.round(unitsPerEm * 0.45));
  writer.int16(Math.round(unitsPerEm * 0.45));
  writer.int16(0);
  writer.int16(Math.round(unitsPerEm * 0.05));
  writer.int16(Math.round(unitsPerEm * 0.6));
  writer.int16(Math.round(unitsPerEm * 0.6));
  writer.int16(0);
  writer.int16(Math.round(unitsPerEm * 0.35));
  writer.int16(Math.round(unitsPerEm * 0.05));
  writer.int16(Math.round(unitsPerEm * 0.3));
  writer.int16(0);
  const panose = [2, 11, 6, 4, 2, 2, 2, 2, 2, 2];
  for (const value of panose) {
    writer.uint8(value);
  }
  writer.uint32(0x00000001);
  writer.uint32(0);
  writer.uint32(0);
  writer.uint32(0);
  writeTag(writer, 'RRUI');
  writer.uint16(0x0040);
  const unicodeValues = glyphs
    .map(glyph => glyph.unicode)
    .filter((value): value is number => typeof value === 'number' && value > 0);
  const firstChar = unicodeValues.length ? Math.min(...unicodeValues) : 0;
  const lastChar = unicodeValues.length ? Math.max(...unicodeValues) : 0;
  writer.uint16(firstChar);
  writer.uint16(lastChar);
  writer.int16(ascender);
  writer.int16(descender);
  writer.int16(0);
  writer.uint16(ascender);
  writer.uint16(Math.abs(descender));
  writer.uint32(0x00000001);
  writer.uint32(0);
  writer.int16(Math.round(xHeight ?? unitsPerEm * 0.5));
  writer.int16(Math.round(capHeight ?? ascender));
  writer.uint16(0);
  writer.uint16(32);
  writer.uint16(2);
  return writer.toUint8Array();
}

function computeSearchParams(numTables: number) {
  const maxPower = Math.floor(Math.log2(numTables));
  const searchRange = Math.pow(2, maxPower) * 16;
  const entrySelector = maxPower;
  const rangeShift = numTables * 16 - searchRange;
  return { searchRange, entrySelector, rangeShift };
}

export class Font {
  private familyName: string;
  private styleName: string;
  private unitsPerEm: number;
  private ascender: number;
  private descender: number;
  private glyphs: Glyph[];
  private xHeight?: number;
  private capHeight?: number;

  constructor(options: FontOptions) {
    this.familyName = options.familyName;
    this.styleName = options.styleName;
    this.unitsPerEm = options.unitsPerEm;
    this.ascender = options.ascender;
    this.descender = options.descender;
    this.glyphs = options.glyphs;
    this.xHeight = options.xHeight;
    this.capHeight = options.capHeight;
  }

  toArrayBuffer() {
    const glyphData = this.glyphs.map(buildGlyphData);
    const { glyf, loca } = buildGlyfTable(glyphData);
    const locaTable = buildLocaTable(loca);

    const xMin = Math.min(...glyphData.map(glyph => glyph.xMin));
    const xMax = Math.max(...glyphData.map(glyph => glyph.xMax));
    const yMin = Math.min(...glyphData.map(glyph => glyph.yMin));
    const yMax = Math.max(...glyphData.map(glyph => glyph.yMax));
    const advanceWidthMax = Math.max(...glyphData.map(glyph => glyph.advanceWidth));
    const minLeftSideBearing = Math.min(...glyphData.map(glyph => glyph.leftSideBearing));
    const minRightSideBearing = Math.min(
      ...glyphData.map(glyph => glyph.advanceWidth - glyph.leftSideBearing - (glyph.xMax - glyph.xMin)),
    );
    const xMaxExtent = Math.max(...glyphData.map(glyph => glyph.leftSideBearing + (glyph.xMax - glyph.xMin)));

    const head = buildHeadTable(
      this.unitsPerEm,
      this.ascender,
      this.descender,
      xMin,
      yMin,
      xMax,
      yMax,
    );
    const hhea = buildHheaTable(
      this.ascender,
      this.descender,
      advanceWidthMax,
      minLeftSideBearing,
      minRightSideBearing,
      xMaxExtent,
      glyphData.length,
    );
    const hmtx = buildHmtxTable(glyphData);
    const maxp = buildMaxpTable(glyphData);
    const post = buildPostTable();
    const name = buildNameTable(this.familyName, this.styleName);
    const cmap = buildCmapTable(glyphData);
    const os2 = buildOs2Table(
      this.unitsPerEm,
      this.ascender,
      this.descender,
      glyphData,
      this.xHeight,
      this.capHeight,
    );

    const tables = [
      { tag: 'cmap', data: cmap },
      { tag: 'glyf', data: glyf },
      { tag: 'head', data: head },
      { tag: 'hhea', data: hhea },
      { tag: 'hmtx', data: hmtx },
      { tag: 'loca', data: locaTable },
      { tag: 'maxp', data: maxp },
      { tag: 'name', data: name },
      { tag: 'OS/2', data: os2 },
      { tag: 'post', data: post },
    ];

    const tableRecords = tables.map(table => ({
      tag: table.tag,
      data: table.data,
      checksum: calcChecksum(table.data),
      length: table.data.length,
      offset: 0,
    }));

    const { searchRange, entrySelector, rangeShift } = computeSearchParams(tableRecords.length);

    let offset = 12 + tableRecords.length * 16;
    for (const record of tableRecords) {
      offset = align4(offset);
      record.offset = offset;
      offset += align4(record.length);
    }

    const writer = new BinaryWriter();
    writer.uint32(0x00010000);
    writer.uint16(tableRecords.length);
    writer.uint16(searchRange);
    writer.uint16(entrySelector);
    writer.uint16(rangeShift);

    tableRecords.forEach(record => {
      writeTag(writer, record.tag);
      writer.uint32(record.checksum);
      writer.uint32(record.offset);
      writer.uint32(record.length);
    });

    for (const record of tableRecords) {
      if (writer.length < record.offset) {
        writer.pad(record.offset - writer.length);
      }
      writer.writeBytes(record.data);
      writer.pad(align4(record.length) - record.length);
    }

    const fontData = writer.toUint8Array();

    const totalChecksum = calcChecksum(fontData);
    const adjustment = (0xb1b0afba - totalChecksum) >>> 0;

    const headIndex = tableRecords.findIndex(record => record.tag === 'head');
    if (headIndex >= 0) {
      const headRecord = tableRecords[headIndex];
      const adjustmentOffset = headRecord.offset + 8;
      fontData[adjustmentOffset] = (adjustment >>> 24) & 0xff;
      fontData[adjustmentOffset + 1] = (adjustment >>> 16) & 0xff;
      fontData[adjustmentOffset + 2] = (adjustment >>> 8) & 0xff;
      fontData[adjustmentOffset + 3] = adjustment & 0xff;

      const headData = fontData.slice(headRecord.offset, headRecord.offset + headRecord.length);
      const newHeadChecksum = calcChecksum(headData);
      const checksumPosition = 12 + headIndex * 16 + 4;
      fontData[checksumPosition] = (newHeadChecksum >>> 24) & 0xff;
      fontData[checksumPosition + 1] = (newHeadChecksum >>> 16) & 0xff;
      fontData[checksumPosition + 2] = (newHeadChecksum >>> 8) & 0xff;
      fontData[checksumPosition + 3] = newHeadChecksum & 0xff;
    }

    return fontData.buffer.slice(0);
  }
}

export class Font {
  private familyName: string;
  private styleName: string;
  private unitsPerEm: number;
  private ascender: number;
  private descender: number;
  private glyphs: Glyph[];
  private xHeight?: number;
  private capHeight?: number;

  constructor(options: FontOptions) {
    this.familyName = options.familyName;
    this.styleName = options.styleName;
    this.unitsPerEm = options.unitsPerEm;
    this.ascender = options.ascender;
    this.descender = options.descender;
    this.glyphs = options.glyphs;
    this.xHeight = options.xHeight;
    this.capHeight = options.capHeight;
  }

  toArrayBuffer() {
    const glyphData = this.glyphs.map(buildGlyphData);
    const { glyf, loca } = buildGlyfTable(glyphData);
    const locaTable = buildLocaTable(loca);

    const xMin = Math.min(...glyphData.map(glyph => glyph.xMin));
    const xMax = Math.max(...glyphData.map(glyph => glyph.xMax));
    const yMin = Math.min(...glyphData.map(glyph => glyph.yMin));
    const yMax = Math.max(...glyphData.map(glyph => glyph.yMax));
    const advanceWidthMax = Math.max(...glyphData.map(glyph => glyph.advanceWidth));
    const minLeftSideBearing = Math.min(...glyphData.map(glyph => glyph.leftSideBearing));
    const minRightSideBearing = Math.min(
      ...glyphData.map(glyph => glyph.advanceWidth - glyph.leftSideBearing - (glyph.xMax - glyph.xMin)),
    );
    const xMaxExtent = Math.max(...glyphData.map(glyph => glyph.leftSideBearing + (glyph.xMax - glyph.xMin)));

    const head = buildHeadTable(
      this.unitsPerEm,
      this.ascender,
      this.descender,
      xMin,
      yMin,
      xMax,
      yMax,
    );
    const hhea = buildHheaTable(
      this.ascender,
      this.descender,
      advanceWidthMax,
      minLeftSideBearing,
      minRightSideBearing,
      xMaxExtent,
      glyphData.length,
    );
    const hmtx = buildHmtxTable(glyphData);
    const maxp = buildMaxpTable(glyphData);
    const post = buildPostTable();
    const name = buildNameTable(this.familyName, this.styleName);
    const cmap = buildCmapTable(glyphData);
    const os2 = buildOs2Table(
      this.unitsPerEm,
      this.ascender,
      this.descender,
      glyphData,
      this.xHeight,
      this.capHeight,
    );

    const tables = [
      { tag: 'cmap', data: cmap },
      { tag: 'glyf', data: glyf },
      { tag: 'head', data: head },
      { tag: 'hhea', data: hhea },
      { tag: 'hmtx', data: hmtx },
      { tag: 'loca', data: locaTable },
      { tag: 'maxp', data: maxp },
      { tag: 'name', data: name },
      { tag: 'OS/2', data: os2 },
      { tag: 'post', data: post },
    ];

    const tableRecords = tables.map(table => ({
      tag: table.tag,
      data: table.data,
      checksum: calcChecksum(table.data),
      length: table.data.length,
      offset: 0,
    }));

    const { searchRange, entrySelector, rangeShift } = computeSearchParams(tableRecords.length);

    let offset = 12 + tableRecords.length * 16;
    for (const record of tableRecords) {
      offset = align4(offset);
      record.offset = offset;
      offset += align4(record.length);
    }

    const writer = new BinaryWriter();
    writer.uint32(0x00010000);
    writer.uint16(tableRecords.length);
    writer.uint16(searchRange);
    writer.uint16(entrySelector);
    writer.uint16(rangeShift);

    tableRecords.forEach(record => {
      writeTag(writer, record.tag);
      writer.uint32(record.checksum);
      writer.uint32(record.offset);
      writer.uint32(record.length);
    });

    for (const record of tableRecords) {
      if (writer.length < record.offset) {
        writer.pad(record.offset - writer.length);
      }
      writer.writeBytes(record.data);
      writer.pad(align4(record.length) - record.length);
    }

    const fontData = writer.toUint8Array();

    const totalChecksum = calcChecksum(fontData);
    const adjustment = (0xb1b0afba - totalChecksum) >>> 0;

    const headIndex = tableRecords.findIndex(record => record.tag === 'head');
    if (headIndex >= 0) {
      const headRecord = tableRecords[headIndex];
      const adjustmentOffset = headRecord.offset + 8;
      fontData[adjustmentOffset] = (adjustment >>> 24) & 0xff;
      fontData[adjustmentOffset + 1] = (adjustment >>> 16) & 0xff;
      fontData[adjustmentOffset + 2] = (adjustment >>> 8) & 0xff;
      fontData[adjustmentOffset + 3] = adjustment & 0xff;

      const headData = fontData.slice(headRecord.offset, headRecord.offset + headRecord.length);
      const newHeadChecksum = calcChecksum(headData);
      const checksumPosition = 12 + headIndex * 16 + 4;
      fontData[checksumPosition] = (newHeadChecksum >>> 24) & 0xff;
      fontData[checksumPosition + 1] = (newHeadChecksum >>> 16) & 0xff;
      fontData[checksumPosition + 2] = (newHeadChecksum >>> 8) & 0xff;
      fontData[checksumPosition + 3] = newHeadChecksum & 0xff;
    }

    return fontData.buffer.slice(0);
  }
}
