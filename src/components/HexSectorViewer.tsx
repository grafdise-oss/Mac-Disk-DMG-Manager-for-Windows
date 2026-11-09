import React, { useState, useMemo } from 'react';
import {
  Binary,
  ArrowLeft,
  ArrowRight,
  Search,
  Copy,
  Download,
  Check,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { MacDisk, MacPartition, generateMockSectorData } from '../utils/macDiskEngine';

interface HexSectorViewerProps {
  currentDisk: MacDisk | null;
  currentPartition: MacPartition | null;
  lang: 'es' | 'en';
}

export const HexSectorViewer: React.FC<HexSectorViewerProps> = ({
  currentDisk,
  currentPartition,
  lang
}) => {
  const [currentLba, setCurrentLba] = useState<number>(0);
  const [lbaInput, setLbaInput] = useState<string>('0');
  const [copied, setCopied] = useState(false);

  // When switching partition, we can jump to its start sector or keep LBA
  const sectorBytes = useMemo(() => {
    if (!currentDisk) return new Uint8Array(512);
    return generateMockSectorData(currentDisk, currentPartition, currentLba);
  }, [currentDisk, currentPartition, currentLba]);

  // Analyze sector signature
  const sectorAnalysis = useMemo(() => {
    if (currentLba === 0) {
      if (sectorBytes[510] === 0x55 && sectorBytes[511] === 0xAA) {
        return {
          title: lang === 'es' ? 'Sector de Arranque MBR Protector (LBA 0)' : 'Protective MBR Boot Sector (LBA 0)',
          badge: 'MBR 0x55AA',
          color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800',
          desc: lang === 'es' 
            ? 'Protective MBR con entrada 0xEE en offset 446 para prevenir sobreescritura accidental por herramientas MBR heredadas.'
            : 'Protective MBR with type 0xEE entry at offset 446 protecting GUID Partition Table from legacy tools.'
        };
      }
    } else if (currentLba === 1) {
      const sig = String.fromCharCode(...sectorBytes.slice(0, 8));
      if (sig === 'EFI PART') {
        return {
          title: lang === 'es' ? 'Cabecera Primaria GPT (LBA 1)' : 'Primary GPT Header (LBA 1)',
          badge: 'EFI PART',
          color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800',
          desc: lang === 'es'
            ? 'Cabecera de Tabla de Particiones GUID con firmas CRC32, GUID de disco y punteros a entradas de partición LBA 2-33.'
            : 'GUID Partition Table Header with CRC32 checksums, Disk GUID, and LBA 2-33 entry pointers.'
        };
      }
    } else if (currentPartition && currentLba === currentPartition.startSector + 2) {
      if (currentPartition.fileSystem.startsWith('HFS')) {
        return {
          title: lang === 'es' ? 'Cabecera de Volumen HFS+ (LBA Offset +2)' : 'HFS+ Volume Header (LBA Offset +2)',
          badge: 'HFS+ Signature 0x482B',
          color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800',
          desc: lang === 'es'
            ? 'Estructura HFSPlusVolumeHeader con punteros a Catalog B-Tree, Extents Overflow y mapa de bits de asignación.'
            : 'HFSPlusVolumeHeader struct containing Catalog B-Tree, Extents Overflow, and allocation bitmap pointers.'
        };
      } else if (currentPartition.fileSystem.startsWith('APFS')) {
        return {
          title: lang === 'es' ? 'Superbloque del Contenedor APFS (NXSB)' : 'APFS Container Superblock (NXSB)',
          badge: 'APFS NXSB',
          color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-800',
          desc: lang === 'es'
            ? 'Superbloque maestro del contenedor nx_superblock_t con Object Map OID, Checkpoint Map y Space Manager.'
            : 'Container master superblock nx_superblock_t with Object Map OID, Checkpoint Map, and Space Manager.'
        };
      }
    }

    return {
      title: `${lang === 'es' ? 'Sector de Datos LBA' : 'Data Sector LBA'} ${currentLba}`,
      badge: 'LBA ' + currentLba,
      color: 'text-neutral-500 bg-neutral-50 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700',
      desc: lang === 'es' 
        ? 'Bloque de almacenamiento de 512 bytes de datos de usuario y fragmentos del sistema de archivos.'
        : 'Standard 512-byte user data block and filesystem cluster fragments.'
    };
  }, [currentLba, sectorBytes, currentPartition, lang]);

  const handleLbaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(lbaInput, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      setCurrentLba(parsed);
    }
  };

  const jumpToLba = (lba: number) => {
    setCurrentLba(lba);
    setLbaInput(lba.toString());
  };

  const copyHexDump = () => {
    let dump = `--- LBA ${currentLba} Dump (512 Bytes) ---\n`;
    for (let row = 0; row < 32; row++) {
      const offset = (row * 16).toString(16).padStart(8, '0').toUpperCase();
      const rowBytes = Array.from(sectorBytes.slice(row * 16, (row + 1) * 16));
      const hex = rowBytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
      const ascii = rowBytes.map(b => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.')).join('');
      dump += `${offset}  ${hex.padEnd(48, ' ')}  |${ascii}|\n`;
    }
    navigator.clipboard.writeText(dump);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const t = lang === 'es' ? {
    title: 'Editor e Inspector Hexadecimal de Sectores LBA',
    subtitle: 'Lectura directa de bloques físicos, cabeceras GPT, APFS y HFS+',
    jumpPrompt: 'Saltar a Sector LBA:',
    go: 'Ir',
    jumpGptMbr: 'LBA 0: Protective MBR',
    jumpGptHeader: 'LBA 1: Cabecera GPT',
    jumpGptEntries: 'LBA 2: Entradas GPT',
    jumpVolHeader: 'Superbloque de Volumen',
    copy: 'Copiar Volcado Hex',
    copied: '¡Copiado!',
    offset: 'Offset',
    ascii: 'Decodificación ASCII'
  } : {
    title: 'LBA Hex Sector Editor & Inspector',
    subtitle: 'Direct inspection of raw disk blocks, GPT, APFS, and HFS+ headers',
    jumpPrompt: 'Jump to LBA Sector:',
    go: 'Go',
    jumpGptMbr: 'LBA 0: Protective MBR',
    jumpGptHeader: 'LBA 1: GPT Header',
    jumpGptEntries: 'LBA 2: GPT Entries',
    jumpVolHeader: 'Volume Superblock',
    copy: 'Copy Hex Dump',
    copied: 'Copied!',
    offset: 'Offset',
    ascii: 'ASCII Decoding'
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-neutral-900 text-neutral-200 select-none text-xs overflow-hidden font-mono">
      {/* Top Controls Toolbar */}
      <div className="p-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Binary className="w-4 h-4 text-cyan-400" />
          <span className="font-sans font-bold text-xs text-white">
            {t.title}
          </span>
        </div>

        {/* LBA Navigator Form */}
        <form onSubmit={handleLbaSubmit} className="flex items-center gap-1.5 font-sans">
          <button
            type="button"
            onClick={() => jumpToLba(Math.max(0, currentLba - 1))}
            className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            title="Sector Anterior"
            aria-label="Sector anterior"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <span className="text-neutral-400 text-xs">{t.jumpPrompt}</span>
          <input
            type="number"
            min="0"
            value={lbaInput}
            onChange={(e) => setLbaInput(e.target.value)}
            className="w-24 px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-center text-cyan-400 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
          <button
            type="submit"
            className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-xs font-semibold"
          >
            {t.go}
          </button>

          <button
            type="button"
            onClick={() => jumpToLba(currentLba + 1)}
            className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            title="Sector Siguiente"
            aria-label="Sector siguiente"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Copy / Export Button */}
        <button
          onClick={copyHexDump}
          className="flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded font-sans text-xs transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? t.copied : t.copy}</span>
        </button>
      </div>

      {/* Quick Jump Buttons Row */}
      <div className="px-3 py-1.5 bg-neutral-900 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto text-[11px] font-sans">
        <span className="text-neutral-500 font-medium">Atajos:</span>
        <button
          onClick={() => jumpToLba(0)}
          className={`px-2 py-0.5 rounded border transition-colors ${
            currentLba === 0 ? 'bg-cyan-950 text-cyan-300 border-cyan-600' : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
          }`}
        >
          {t.jumpGptMbr}
        </button>
        <button
          onClick={() => jumpToLba(1)}
          className={`px-2 py-0.5 rounded border transition-colors ${
            currentLba === 1 ? 'bg-cyan-950 text-cyan-300 border-cyan-600' : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
          }`}
        >
          {t.jumpGptHeader}
        </button>
        <button
          onClick={() => jumpToLba(2)}
          className={`px-2 py-0.5 rounded border transition-colors ${
            currentLba === 2 ? 'bg-cyan-950 text-cyan-300 border-cyan-600' : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
          }`}
        >
          {t.jumpGptEntries}
        </button>
        {currentPartition && (
          <button
            onClick={() => jumpToLba(currentPartition.startSector + 2)}
            className={`px-2 py-0.5 rounded border transition-colors ${
              currentLba === currentPartition.startSector + 2 ? 'bg-cyan-950 text-cyan-300 border-cyan-600' : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
            }`}
          >
            {t.jumpVolHeader} ({currentPartition.label})
          </button>
        )}
      </div>

      {/* Sector Structure Analysis Callout */}
      <div className={`mx-3 my-2 p-2.5 rounded-lg border font-sans ${sectorAnalysis.color} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 flex-shrink-0" />
          <div>
            <div className="font-bold text-xs flex items-center gap-2">
              <span>{sectorAnalysis.title}</span>
              <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-black/20">{sectorAnalysis.badge}</span>
            </div>
            <p className="text-[11px] opacity-90 mt-0.5">{sectorAnalysis.desc}</p>
          </div>
        </div>
      </div>

      {/* Hex Dump Viewport */}
      <div className="flex-1 overflow-y-auto px-4 py-2 font-mono text-xs select-text">
        <div className="text-neutral-500 pb-1 border-b border-neutral-800 flex justify-between select-none text-[11px]">
          <span>{t.offset}</span>
          <span className="pl-6">00 01 02 03 04 05 06 07  08 09 0A 0B 0C 0D 0E 0F</span>
          <span>{t.ascii}</span>
        </div>

        <div className="space-y-0.5 pt-1">
          {Array.from({ length: 32 }).map((_, row) => {
            const offsetHex = (row * 16).toString(16).padStart(8, '0').toUpperCase();
            const rowBytes = Array.from(sectorBytes.slice(row * 16, (row + 1) * 16));

            return (
              <div key={row} className="flex items-center hover:bg-neutral-800/50 py-0.5 px-1 rounded">
                {/* Offset */}
                <span className="text-neutral-500 w-20 flex-shrink-0">{offsetHex}</span>

                {/* Hex Bytes */}
                <div className="flex items-center gap-1.5 flex-1 pl-4">
                  <div className="flex items-center gap-1">
                    {rowBytes.slice(0, 8).map((b, i) => {
                      const isHighlit = (currentLba === 0 && row === 31 && (i === 6 || i === 7)) ||
                                        (currentLba === 1 && row === 0 && i < 8) ||
                                        (currentPartition && currentLba === currentPartition.startSector + 2 && row === 0 && i < 4);
                      return (
                        <span
                          key={i}
                          className={`w-5 text-center ${
                            isHighlit ? 'text-amber-300 font-bold bg-amber-950/60 px-0.5 rounded' : b === 0 ? 'text-neutral-600' : 'text-cyan-300'
                          }`}
                        >
                          {b.toString(16).padStart(2, '0').toUpperCase()}
                        </span>
                      );
                    })}
                  </div>
                  <span className="text-neutral-600 px-1">|</span>
                  <div className="flex items-center gap-1">
                    {rowBytes.slice(8, 16).map((b, i) => {
                      const isHighlit = (currentLba === 0 && row === 31 && (i === 6 || i === 7));
                      return (
                        <span
                          key={i}
                          className={`w-5 text-center ${
                            isHighlit ? 'text-amber-300 font-bold bg-amber-950/60 px-0.5 rounded' : b === 0 ? 'text-neutral-600' : 'text-cyan-300'
                          }`}
                        >
                          {b.toString(16).padStart(2, '0').toUpperCase()}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* ASCII Column */}
                <div className="text-neutral-300 pl-4 w-40 text-left font-mono">
                  {rowBytes.map((b, i) => {
                    const char = (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.';
                    return (
                      <span key={i} className={b >= 32 && b <= 126 ? 'text-emerald-400' : 'text-neutral-600'}>
                        {char}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
