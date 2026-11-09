import React, { useState } from 'react';
import {
  Disc,
  AlertTriangle,
  HardDrive,
  X,
  CheckCircle2
} from 'lucide-react';
import {
  MacDisk,
  MacFileSystem,
  PartitionScheme,
  formatBytes,
  formatDiskForMac
} from '../utils/macDiskEngine';

interface FormatDiskDialogProps {
  currentDisk: MacDisk | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmFormat: (formattedDisk: MacDisk) => void;
  lang: 'es' | 'en';
}

export const FormatDiskDialog: React.FC<FormatDiskDialogProps> = ({
  currentDisk,
  isOpen,
  onClose,
  onConfirmFormat,
  lang
}) => {
  const [volumeLabel, setVolumeLabel] = useState('Macintosh HD');
  const [fileSystem, setFileSystem] = useState<MacFileSystem>('APFS');
  const [partitionScheme, setPartitionScheme] = useState<PartitionScheme>('GPT');
  const [allocationBlockSize, setAllocationBlockSize] = useState<number>(4096);
  const [isFormatting, setIsFormatting] = useState(false);

  if (!isOpen || !currentDisk) return null;

  const handleFormat = () => {
    setIsFormatting(true);
    setTimeout(() => {
      const formatted = formatDiskForMac(currentDisk, {
        volumeLabel: volumeLabel.trim() || 'Macintosh HD',
        fileSystem,
        partitionScheme,
        allocationBlockSize
      });
      setIsFormatting(false);
      onConfirmFormat(formatted);
      onClose();
    }, 800);
  };

  const t = lang === 'es' ? {
    title: 'Formatear Disco para Mac (TransMac)',
    subtitle: 'Crea particiones compatibles con Apple macOS HFS+ o APFS',
    diskName: 'Unidad de Disco Destino:',
    capacity: 'Capacidad:',
    labelPrompt: 'Etiqueta del Volumen:',
    fsPrompt: 'Sistema de Archivos Mac:',
    schemePrompt: 'Esquema de Particionado:',
    blockSizePrompt: 'Tamaño de Unidad de Asignación:',
    warnText: 'ADVERTENCIA: Esta operación eliminará todas las particiones existentes y sus archivos en este disco.',
    formatBtn: 'Formatear Disco',
    formattingBtn: 'Escribiendo Estructura Mac...',
    cancelBtn: 'Cancelar',
    gptDesc: 'GPT (GUID Partition Table) - Recomendado para Intel y Apple Silicon',
    apmDesc: 'APM (Apple Partition Map) - Para Mac OS X clásico y PowerPC',
    mbrDesc: 'MBR (Master Boot Record) - Particionado estándar heredado'
  } : {
    title: 'Format Disk for Mac (TransMac)',
    subtitle: 'Create Apple macOS compatible HFS+ or APFS partitions',
    diskName: 'Target Disk Drive:',
    capacity: 'Capacity:',
    labelPrompt: 'Volume Label:',
    fsPrompt: 'Mac File System:',
    schemePrompt: 'Partition Scheme:',
    blockSizePrompt: 'Allocation Unit Size:',
    warnText: 'WARNING: Formatting will completely erase all existing partitions and files on this drive.',
    formatBtn: 'Format Disk',
    formattingBtn: 'Writing Mac Structures...',
    cancelBtn: 'Cancel',
    gptDesc: 'GPT (GUID Partition Table) - Recommended for Intel & Apple Silicon',
    apmDesc: 'APM (Apple Partition Map) - For vintage PowerPC & classic OS X',
    mbrDesc: 'MBR (Master Boot Record) - Standard legacy MBR'
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 select-none text-xs">
      <div className="bg-white dark:bg-[#202020] border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-neutral-100 dark:bg-[#1a1a1a] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Disc className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                {t.title}
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {t.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {/* Target disk info card */}
          <div className="p-3 bg-neutral-50 dark:bg-[#181818] rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <HardDrive className="w-4 h-4 text-neutral-500" />
              <div>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 block">
                  {currentDisk.model}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {t.capacity} {formatBytes(currentDisk.capacityBytes)} • Bus: {currentDisk.busType}
                </span>
              </div>
            </div>
          </div>

          {/* Volume Label Input */}
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              {t.labelPrompt}
            </label>
            <input
              type="text"
              value={volumeLabel}
              onChange={(e) => setVolumeLabel(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Macintosh HD"
            />
          </div>

          {/* File System Selection */}
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              {t.fsPrompt}
            </label>
            <select
              value={fileSystem}
              onChange={(e) => setFileSystem(e.target.value as MacFileSystem)}
              className="w-full px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="APFS">APFS (Apple File System) - macOS High Sierra en adelante</option>
              <option value="APFS (Case-sensitive)">APFS (Distinguir mayúsculas/minúsculas)</option>
              <option value="HFS+ (Journaled)">Mac OS Extended con registro (HFS+ Journaled)</option>
              <option value="HFS+">Mac OS Extended estándar (HFS+)</option>
            </select>
          </div>

          {/* Partition Scheme Selection */}
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              {t.schemePrompt}
            </label>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 p-2 rounded border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
                <input
                  type="radio"
                  name="scheme"
                  value="GPT"
                  checked={partitionScheme === 'GPT'}
                  onChange={() => setPartitionScheme('GPT')}
                  className="text-blue-600"
                />
                <div>
                  <span className="font-semibold block">{t.gptDesc}</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2 rounded border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
                <input
                  type="radio"
                  name="scheme"
                  value="APM"
                  checked={partitionScheme === 'APM'}
                  onChange={() => setPartitionScheme('APM')}
                  className="text-blue-600"
                />
                <div>
                  <span className="font-semibold block">{t.apmDesc}</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2 rounded border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
                <input
                  type="radio"
                  name="scheme"
                  value="MBR"
                  checked={partitionScheme === 'MBR'}
                  onChange={() => setPartitionScheme('MBR')}
                  className="text-blue-600"
                />
                <div>
                  <span className="font-semibold block">{t.mbrDesc}</span>
                </div>
              </label>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg flex items-start gap-2.5 text-red-800 dark:text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              {t.warnText}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-100 dark:bg-[#1a1a1a] border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isFormatting}
            className="px-4 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
          >
            {t.cancelBtn}
          </button>
          <button
            onClick={handleFormat}
            disabled={isFormatting}
            className="px-5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Disc className={`w-3.5 h-3.5 ${isFormatting ? 'animate-spin' : ''}`} />
            <span>{isFormatting ? t.formattingBtn : t.formatBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
