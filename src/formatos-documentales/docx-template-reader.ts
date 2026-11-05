import { inflateRawSync } from 'node:zlib';

export type DocxTemplateText = {
  paragraphs: string[];
  headersAndFooters: string;
};

function findEndOfCentralDirectory(buffer: Buffer): number {
  const minimumOffset = Math.max(0, buffer.length - 65_557);
  for (let offset = buffer.length - 22; offset >= minimumOffset; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) return offset;
  }
  throw new Error('El archivo DOCX no contiene un directorio ZIP válido');
}

function extractZipEntry(buffer: Buffer, targetName: string): Buffer {
  const endOffset = findEndOfCentralDirectory(buffer);
  const entryCount = buffer.readUInt16LE(endOffset + 10);
  let entryOffset = buffer.readUInt32LE(endOffset + 16);

  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(entryOffset) !== 0x02014b50) {
      throw new Error('Directorio ZIP DOCX inválido');
    }

    const compressionMethod = buffer.readUInt16LE(entryOffset + 10);
    const compressedSize = buffer.readUInt32LE(entryOffset + 20);
    const nameLength = buffer.readUInt16LE(entryOffset + 28);
    const extraLength = buffer.readUInt16LE(entryOffset + 30);
    const commentLength = buffer.readUInt16LE(entryOffset + 32);
    const localHeaderOffset = buffer.readUInt32LE(entryOffset + 42);
    const name = buffer.toString(
      'utf8',
      entryOffset + 46,
      entryOffset + 46 + nameLength,
    );

    if (name === targetName) {
      if (buffer.readUInt32LE(localHeaderOffset) !== 0x04034b50) {
        throw new Error(`Entrada ZIP DOCX inválida: ${targetName}`);
      }
      const localNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
      const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
      const dataOffset =
        localHeaderOffset + 30 + localNameLength + localExtraLength;
      const compressed = buffer.subarray(dataOffset, dataOffset + compressedSize);

      if (compressionMethod === 0) return Buffer.from(compressed);
      if (compressionMethod === 8) return inflateRawSync(compressed);
      throw new Error(
        `Método de compresión DOCX no soportado: ${compressionMethod}`,
      );
    }

    entryOffset += 46 + nameLength + extraLength + commentLength;
  }

  throw new Error(`El documento DOCX no contiene ${targetName}`);
}

function decodeXmlText(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_match, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&#([0-9]+);/g, (_match, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&');
}

function extractParagraphs(xml: string): string[] {
  return [...xml.matchAll(/<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g)]
    .map(([, paragraph]) => {
      const text = [...paragraph.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)]
        .map(([, value]) => decodeXmlText(value))
        .join('')
        .trim();
      return text;
    })
    .filter(Boolean);
}

export function readDocxTemplate(buffer: Buffer): DocxTemplateText {
  const documentXml = extractZipEntry(buffer, 'word/document.xml').toString('utf8');
  const metadataXml: string[] = [];
  const endOffset = findEndOfCentralDirectory(buffer);
  const entryCount = buffer.readUInt16LE(endOffset + 10);
  let entryOffset = buffer.readUInt32LE(endOffset + 16);

  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(entryOffset) !== 0x02014b50) {
      throw new Error('Directorio ZIP DOCX inválido');
    }
    const nameLength = buffer.readUInt16LE(entryOffset + 28);
    const extraLength = buffer.readUInt16LE(entryOffset + 30);
    const commentLength = buffer.readUInt16LE(entryOffset + 32);
    const name = buffer.toString(
      'utf8',
      entryOffset + 46,
      entryOffset + 46 + nameLength,
    );
    if (/^word\/(?:header|footer)\d+\.xml$/.test(name)) {
      metadataXml.push(extractZipEntry(buffer, name).toString('utf8'));
    }
    entryOffset += 46 + nameLength + extraLength + commentLength;
  }

  return {
    paragraphs: extractParagraphs(documentXml),
    headersAndFooters: metadataXml
      .flatMap(extractParagraphs)
      .join('\n'),
  };
}
