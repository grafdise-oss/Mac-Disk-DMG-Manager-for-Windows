import React, { useState } from 'react';
import {
  Columns,
  Disc,
  ShieldCheck,
  Plus,
  Trash2,
  Sliders,
  CheckCircle,
  HardDrive,
  Info,
  Layers,
  Sparkles,
  PieChart
} from 'lucide-react';
import { MacDisk, MacPartition, formatBytes, MacFileSystem } from '../utils/macDiskEngine';

interface PartitionManagerProps {
  currentDisk: MacDisk | null;
  selectedPartitionId: string;
  onSelectPartition: (partitionId: string) => void;
  onFormatPartition: (partition: MacPartition) => void;
  onDeletePartition: (partitionId: string) => void;
  onAddPartition: () => void;
  onCheckFs: () => void;
  lang: 'es' | 'en';
}

export const PartitionManager: React.FC<PartitionManagerProps> = ({
  currentDisk,
  selectedPartitionId,
  onSelectPartition,
  onFormatPartition,
  onDeletePartition,
  onAddPartition,
  onCheckFs,
  lang
}) => {
  const [showResizeModal, setShowResizeModal] = useState(false);
  const [targetResizeGb, setTargetResizeGb] = useState<number>(32);

  if (!currentDisk) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-neutral-400">
        <HardDrive className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mb-3" />
        <p className="text-sm font-medium">{lang === 'es' ? 'No hay disco seleccionado' : 'No disk selected'}</p>
      </div>
    );
  }

  const selectedPartition = currentDisk.partitions.find(p => p.id === selectedPartitionId) || currentDisk.partitions[0];

  // Calculate percentage widths for visual strip
  const totalCapacity = currentDisk.capacityBytes;
  let allocatedBytes = 0;
  currentDisk.partitions.forEach(p => allocatedBytes += p.sizeBytes);
  const freeBytes = Math.max(0, totalCapacity - allocatedBytes);

  const t = lang === 'es' ? {
    title: 'Gestor de Particiones HFS+ & APFS',
    subtitle: 'Distribución física de sectores y volúmenes de disco',
    totalCapacity: 'Capacidad Total:',
    scheme: 'Esquema de Particionado:',
    sectors: 'Sectores Totales:',
    sectorSize: 'Tamaño de Sector:',
    visualMap: 'Mapa Gráfico de Particiones del Disco',
    partDetails: 'Detalles del Volumen Seleccionado',
    formatVol: 'Formatear Volumen',
    addPart: 'Nueva Partición...',
    deletePart: 'Eliminar Partición',
    resizePart: 'Redimensionar / Reducir...',
    verifyFs: 'Verificar Sistema de Archivos',
    freeSpace: 'Espacio no asignado',
    name: 'Nombre de Partición',
    label: 'Etiqueta',
    fileSystem: 'Sistema de Archivos',
    size: 'Tamaño',
    used: 'Espacio Ocupado',
    free: 'Espacio Libre',
    startSector: 'Sector Inicial (LBA)',
    endSector: 'Sector Final (LBA)',
    typeGuid: 'GUID de Tipo de Partición',
    bootable: 'Arranque Booteable',
    yes: 'Sí (Activo)',
    no: 'No',
    resizeTitle: 'Redimensionar Partición APFS / HFS+',
    resizePrompt: 'Ajusta el nuevo tamaño deseado para el contenedor de volumen Mac:',
    apply: 'Aplicar Cambios',
    cancel: 'Cancelar'
  } : {
    title: 'HFS+ & APFS Partition Manager',
    subtitle: 'Physical sector allocation and disk volume map',
    totalCapacity: 'Total Capacity:',
    scheme: 'Partition Scheme:',
    sectors: 'Total Sectors:',
    sectorSize: 'Sector Size:',
    visualMap: 'Disk Visual Partition Map',
    partDetails: 'Selected Volume Details',
    formatVol: 'Format Volume',
    addPart: 'New Partition...',
    deletePart: 'Delete Partition',
    resizePart: 'Resize / Shrink...',
    verifyFs: 'Verify File System',
    freeSpace: 'Unallocated Space',
    name: 'Partition Name',
    label: 'Label',
    fileSystem: 'File System',
    size: 'Size',
    used: 'Used Space',
    free: 'Free Space',
    startSector: 'Start Sector (LBA)',
    endSector: 'End Sector (LBA)',
    typeGuid: 'Partition Type GUID',
    bootable: 'Bootable',
    yes: 'Yes (Active)',
    no: 'No',
    resizeTitle: 'Resize APFS / HFS+ Partition',
    resizePrompt: 'Adjust desired size for the Mac volume container:',
    apply: 'Apply Changes',
    cancel: 'Cancel'
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-neutral-50 dark:bg-[#1c1c1c] overflow-y-auto p-4 select-none text-xs">
      {/* Header section */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Columns className="w-4 h-4 text-blue-600" />
            {t.title}
          </h2>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            {t.subtitle} • {currentDisk.model}
          </p>
        </div>

        {/* Disk High-level Metrics */}
        <div className="flex items-center gap-4 bg-white dark:bg-[#252525] px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-xs">
          <div>
            <span className="text-neutral-400 block text-[10px]">{t.totalCapacity}</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{formatBytes(currentDisk.capacityBytes)}</span>
          </div>
          <div className="w-[1px] h-6 bg-neutral-200 dark:bg-neutral-700" />
          <div>
            <span className="text-neutral-400 block text-[10px]">{t.scheme}</span>
            <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{currentDisk.partitionScheme}</span>
          </div>
          <div className="w-[1px] h-6 bg-neutral-200 dark:bg-neutral-700" />
          <div>
            <span className="text-neutral-400 block text-[10px]">{t.sectorSize}</span>
            <span className="font-mono text-neutral-800 dark:text-neutral-200">{currentDisk.sectorSize} Bytes</span>
          </div>
        </div>
      </div>

      {/* Visual Graphical Partition Strip (Windows 11 Disk Management style) */}
      <div className="mt-4 bg-white dark:bg-[#222222] border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            {t.visualMap}
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">
            GUID: {currentDisk.guid}
          </span>
        </div>

        {/* The Partition Bar Strip */}
        <div className="h-16 w-full rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex overflow-hidden p-1 gap-1">
          {currentDisk.partitions.map((part) => {
            const isSelected = part.id === selectedPartition?.id;
            const widthPct = Math.max(8, (part.sizeBytes / totalCapacity) * 100);
            const isApfs = part.fileSystem.startsWith('APFS');
            const isHfs = part.fileSystem.startsWith('HFS');
            const isEfi = part.fileSystem.includes('EFI');

            let bgColor = 'bg-blue-500 hover:bg-blue-600';
            if (isEfi) bgColor = 'bg-teal-600 hover:bg-teal-700';
            else if (isApfs) bgColor = 'bg-purple-600 hover:bg-purple-700';
            else if (isHfs) bgColor = 'bg-blue-600 hover:bg-blue-700';

            return (
              <div
                key={part.id}
                onClick={() => onSelectPartition(part.id)}
                style={{ width: `${widthPct}%` }}
                className={`h-full rounded cursor-pointer transition-all flex flex-col justify-between p-1.5 text-white relative group ${bgColor} ${
                  isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900 shadow-md z-10' : 'opacity-90 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold leading-none truncate">
                  <span className="truncate">{part.label || part.name}</span>
                  {part.isBootable && (
                    <span className="text-[8px] px-1 bg-black/30 rounded font-mono">BOOT</span>
                  )}
                </div>

                <div className="text-[10px] opacity-90 truncate leading-none flex items-center justify-between">
                  <span>{part.fileSystem}</span>
                  <span className="font-mono">{formatBytes(part.sizeBytes, 1)}</span>
                </div>

                {/* Micro fill bar for used space */}
                <div className="w-full bg-black/20 h-1 rounded-full overflow-hidden mt-0.5">
                  <div
                    className="bg-white/70 h-full rounded-full"
                    style={{ width: `${Math.min(100, (part.usedBytes / part.sizeBytes) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}

          {/* Free Unallocated Space */}
          {freeBytes > 1024 * 1024 && (
            <div
              style={{ width: `${Math.max(5, (freeBytes / totalCapacity) * 100)}%` }}
              className="h-full rounded bg-neutral-200 dark:bg-neutral-800 border border-dashed border-neutral-400 dark:border-neutral-600 flex flex-col items-center justify-center text-neutral-500 p-1"
            >
              <span className="text-[10px] font-medium truncate">{t.freeSpace}</span>
              <span className="text-[9px] font-mono">{formatBytes(freeBytes, 1)}</span>
            </div>
          )}
        </div>

        {/* Color Legend */}
        <div className="mt-3 flex items-center gap-4 text-[11px] text-neutral-600 dark:text-neutral-400 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-purple-600" />
            <span>Apple APFS Container</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-blue-600" />
            <span>Mac OS Extended (HFS+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-teal-600" />
            <span>EFI System Partition (FAT32)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-neutral-300 dark:bg-neutral-700 border border-dashed border-neutral-400" />
            <span>{t.freeSpace}</span>
          </div>
        </div>
      </div>

      {/* Selected Partition Detailed Inspector */}
      {selectedPartition && (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Card 1: Partition Specifications */}
          <div className="lg:col-span-2 bg-white dark:bg-[#222222] border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700 mb-3">
              <div className="flex items-center gap-2">
                <Disc className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold text-neutral-900 dark:text-white">
                  {selectedPartition.label || selectedPartition.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                  {selectedPartition.fileSystem}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onFormatPartition(selectedPartition)}
                  className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors shadow-xs"
                >
                  {t.formatVol}
                </button>
                <button
                  onClick={() => setShowResizeModal(true)}
                  className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 transition-colors"
                >
                  {t.resizePart}
                </button>
                <button
                  onClick={onCheckFs}
                  className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 transition-colors"
                >
                  {t.verifyFs}
                </button>
                {currentDisk.partitions.length > 1 && (
                  <button
                    onClick={() => onDeletePartition(selectedPartition.id)}
                    className="p-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    title={t.deletePart}
                    aria-label={t.deletePart}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Spec grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-neutral-50 dark:bg-[#1a1a1a] rounded-lg border border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-400 block text-[10px]">{t.size}</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 font-mono">
                  {formatBytes(selectedPartition.sizeBytes)}
                </span>
              </div>
              <div className="p-2.5 bg-neutral-50 dark:bg-[#1a1a1a] rounded-lg border border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-400 block text-[10px]">{t.used}</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400 font-mono">
                  {formatBytes(selectedPartition.usedBytes)} ({((selectedPartition.usedBytes / selectedPartition.sizeBytes) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="p-2.5 bg-neutral-50 dark:bg-[#1a1a1a] rounded-lg border border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-400 block text-[10px]">{t.free}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                  {formatBytes(selectedPartition.sizeBytes - selectedPartition.usedBytes)}
                </span>
              </div>
              <div className="p-2.5 bg-neutral-50 dark:bg-[#1a1a1a] rounded-lg border border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-400 block text-[10px]">{t.startSector}</span>
                <span className="font-mono text-neutral-700 dark:text-neutral-300">
                  {selectedPartition.startSector.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 bg-neutral-50 dark:bg-[#1a1a1a] rounded-lg border border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-400 block text-[10px]">{t.endSector}</span>
                <span className="font-mono text-neutral-700 dark:text-neutral-300">
                  {(selectedPartition.startSector + selectedPartition.sectorCount - 1).toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 bg-neutral-50 dark:bg-[#1a1a1a] rounded-lg border border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-400 block text-[10px]">{t.bootable}</span>
                <span className={`font-semibold ${selectedPartition.isBootable ? 'text-emerald-600' : 'text-neutral-500'}`}>
                  {selectedPartition.isBootable ? t.yes : t.no}
                </span>
              </div>
            </div>

            {/* Partition Type GUID & UUID */}
            <div className="mt-3 p-2.5 bg-neutral-100 dark:bg-[#181818] rounded-lg font-mono text-[11px] text-neutral-600 dark:text-neutral-400 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">{t.typeGuid}:</span>
                <span className="text-neutral-800 dark:text-neutral-200">{selectedPartition.typeGuid || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">UUID de Volumen:</span>
                <span className="text-neutral-800 dark:text-neutral-200">{selectedPartition.metadata.volumeUuid}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Apple Filesystem Architecture summary */}
          <div className="bg-white dark:bg-[#222222] border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                {selectedPartition.fileSystem.startsWith('APFS') ? 'Estructura APFS' : 'Estructura HFS+'}
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3">
                {selectedPartition.fileSystem.startsWith('APFS')
                  ? 'Apple File System (APFS) utiliza una arquitectura de Contenedor flexible con mapa de objetos (Object Map), checkpoints clonados en árbol B y asignación dinámica de espacio (Space Sharing).'
                  : 'Mac OS Extended (HFS+) organiza los metadatos en un B-Tree Catalog file con nodos de hoja y clave, bitmap de asignación y bloque de Journaling con transacciones.'}
              </p>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-400">Tamaño de Bloque:</span>
                  <span className="font-mono text-neutral-700 dark:text-neutral-300">{selectedPartition.metadata.allocationBlockSize} Bytes</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-400">Bloques Asignados:</span>
                  <span className="font-mono text-neutral-700 dark:text-neutral-300">{selectedPartition.metadata.totalBlocks.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-400">Journaling (Diario):</span>
                  <span className="text-emerald-600 font-semibold">{selectedPartition.metadata.journaled ? 'Habilitado' : 'Deshabilitado'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onAddPartition}
              className="mt-4 w-full py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg font-medium flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addPart}</span>
            </button>
          </div>
        </div>
      )}

      {/* Resize Modal */}
      {showResizeModal && selectedPartition && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#202020] border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-2xl max-w-md w-full p-5 text-xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">
              {t.resizeTitle}
            </h3>
            <p className="text-neutral-500 mb-4">
              {t.resizePrompt}
            </p>

            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Capacidad Actual: {formatBytes(selectedPartition.sizeBytes)}</span>
                <span className="font-bold text-blue-600">{targetResizeGb} GB</span>
              </div>
              <input
                type="range"
                min="16"
                max={Math.floor(currentDisk.capacityBytes / (1024 * 1024 * 1024))}
                value={targetResizeGb}
                onChange={(e) => setTargetResizeGb(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>Mínimo: 16 GB</span>
                <span>Máximo: {Math.floor(currentDisk.capacityBytes / (1024 * 1024 * 1024))} GB</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowResizeModal(false)}
                className="px-4 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => {
                  setShowResizeModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {t.apply}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
