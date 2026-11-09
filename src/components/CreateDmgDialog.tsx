import React, { useState } from 'react';
import {
  FilePlus,
  Disc,
  Download,
  X,
  Sparkles,
  HardDrive
} from 'lucide-react';
import {
  MacFileSystem,
  PartitionScheme,
  createVirtualDmgDisk,
  generateDmgBlob,
  MacDisk
} from '../utils/macDiskEngine';

interface CreateDmgDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMountCreatedDmg: (disk: MacDisk) => void;
  lang: 'es' | 'en';
}

export const CreateDmgDialog: React.FC<CreateDmgDialogProps> = ({
  isOpen,
  onClose,
  onMountCreatedDmg,
  lang
}) => {
  const [imageName, setImageName] = useState('Nueva_Imagen_Mac.dmg');
  const [sizePreset, setSizePreset] = useState<number>(4700000000); // 4.7 GB
  const [fileSystem, setFileSystem] = useState<MacFileSystem>('HFS+ (Journaled)');
  const [partitionScheme, setPartitionScheme] = useState<PartitionScheme>('GPT');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCreateAndMount = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const cleanName = imageName.endsWith('.dmg') ? imageName : `${imageName}.dmg`;
      const newVirtualDisk = createVirtualDmgDisk(cleanName, sizePreset, fileSystem, partitionScheme);
      setIsProcessing(false);
      onMountCreatedDmg(newVirtualDisk);
      onClose();
    }, 600);
  };

  const handleDownloadDmgFile = () => {
    const cleanName = imageName.endsWith('.dmg') ? imageName : `${imageName}.dmg`;
    const blob = generateDmgBlob(cleanName, fileSystem);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cleanName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const t = lang === 'es' ? {
    title: 'Crear Nueva Imagen de Disco Mac (.DMG)',
    subtitle: 'Genera imágenes de disco virtuales compatibles con macOS, Disk Utility y TransMac',
    namePrompt: 'Nombre del archivo DMG:',
    sizePrompt: 'Capacidad de la Imagen:',
    fsPrompt: 'Sistema de Archivos:',
    schemePrompt: 'Esquema de Particionado:',
    mountBtn: 'Crear y Montar en TransMac',
    downloadBtn: 'Descargar archivo .DMG a PC',
    cancel: 'Cancelar'
  } : {
    title: 'Create New Mac Disk Image (.DMG)',
    subtitle: 'Generate virtual disk images compatible with macOS, Disk Utility, and TransMac',
    namePrompt: 'DMG File Name:',
    sizePrompt: 'Image Capacity:',
    fsPrompt: 'File System:',
    schemePrompt: 'Partition Scheme:',
    mountBtn: 'Create & Mount in TransMac',
    downloadBtn: 'Download .DMG to PC',
    cancel: 'Cancel'
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 select-none text-xs">
      <div className="bg-white dark:bg-[#202020] border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-2xl max-w-md w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-neutral-100 dark:bg-[#1a1a1a] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <FilePlus className="w-4 h-4" />
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
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              {t.namePrompt}
            </label>
            <input
              type="text"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              className="w-full px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              {t.sizePrompt}
            </label>
            <select
              value={sizePreset}
              onChange={(e) => setSizePreset(Number(e.target.value))}
              className="w-full px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={500 * 1024 * 1024}>500 MB (Compacto)</option>
              <option value={1024 * 1024 * 1024}>1 GB (Unidad Flash USB pequeña)</option>
              <option value={4700000000}>4.7 GB (DVD estándar)</option>
              <option value={8500000000}>8.5 GB (DVD Doble Capa)</option>
              <option value={16 * 1024 * 1024 * 1024}>16 GB (Instalador macOS Sonoma / Ventura)</option>
              <option value={32 * 1024 * 1024 * 1024}>32 GB (Unidad Flash USB estándar)</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              {t.fsPrompt}
            </label>
            <select
              value={fileSystem}
              onChange={(e) => setFileSystem(e.target.value as MacFileSystem)}
              className="w-full px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="HFS+ (Journaled)">Mac OS Extended con registro (HFS+ Journaled)</option>
              <option value="APFS">APFS (Apple File System)</option>
              <option value="APFS (Case-sensitive)">APFS (Distinguir mayúsculas/minúsculas)</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1">
              {t.schemePrompt}
            </label>
            <select
              value={partitionScheme}
              onChange={(e) => setPartitionScheme(e.target.value as PartitionScheme)}
              className="w-full px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="GPT">GUID Partition Table (GPT) - Estándar Mac</option>
              <option value="APM">Apple Partition Map (APM) - Mac OS X clásico</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-neutral-100 dark:bg-[#1a1a1a] border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <button
            onClick={handleDownloadDmgFile}
            className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium flex items-center gap-1.5"
            title="Descargar archivo .dmg generado"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.downloadBtn}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleCreateAndMount}
              disabled={isProcessing}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Disc className="w-3.5 h-3.5" />
              <span>{t.mountBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
