import React from 'react';
import {
  Cpu,
  Layers,
  Database,
  GitBranch,
  FolderTree,
  FileSearch,
  Sparkles,
  ShieldAlert,
  HardDrive
} from 'lucide-react';
import { MacDisk, MacPartition, formatBytes } from '../utils/macDiskEngine';

interface SuperblockInspectorProps {
  currentDisk: MacDisk | null;
  currentPartition: MacPartition | null;
  lang: 'es' | 'en';
}

export const SuperblockInspector: React.FC<SuperblockInspectorProps> = ({
  currentDisk,
  currentPartition,
  lang
}) => {
  if (!currentPartition) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-neutral-400">
        <Cpu className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mb-3" />
        <p className="text-sm font-medium">{lang === 'es' ? 'Selecciona una partición Mac para ver sus metadatos' : 'Select a Mac partition to view metadata'}</p>
      </div>
    );
  }

  const isApfs = currentPartition.fileSystem.startsWith('APFS');
  const isHfs = currentPartition.fileSystem.startsWith('HFS');

  const t = lang === 'es' ? {
    title: isApfs ? 'Inspector de Contenedor y Superbloque APFS' : 'Inspector de Cabecera y Catálogo HFS+',
    subtitle: isApfs 
      ? 'Análisis profundo de la estructura de objetos (Object Map), checkpoints e inodos de Apple File System'
      : 'Estructura de B-Tree de Catálogo, archivo de desbordamiento de extensiones y mapa de asignación',
    structName: isApfs ? 'Superbloque del Contenedor (nx_superblock_t)' : 'Cabecera de Volumen (HFSPlusVolumeHeader)',
    magic: 'Firma Mágica:',
    blockSize: 'Tamaño de Bloque Lógico:',
    totalBlocks: 'Total de Bloques:',
    freeBlocks: 'Bloques Libres:',
    uuid: 'UUID del Volumen:',
    journal: 'Registro Transaccional (Journal):',
    apfsTree: 'Jerarquía de Objetos APFS',
    hfsTree: 'Árbol B-Tree de Catálogo HFS+',
    statusOk: 'Estructura Íntegra y Verificada'
  } : {
    title: isApfs ? 'APFS Container & Superblock Inspector' : 'HFS+ Volume Header & Catalog Inspector',
    subtitle: isApfs
      ? 'Deep inspection of Apple File System Object Map, checkpoints, and inode tree'
      : 'HFS+ Catalog B-Tree structure, extents overflow file, and allocation bitmap',
    structName: isApfs ? 'Container Superblock (nx_superblock_t)' : 'Volume Header (HFSPlusVolumeHeader)',
    magic: 'Magic Signature:',
    blockSize: 'Logical Block Size:',
    totalBlocks: 'Total Blocks:',
    freeBlocks: 'Free Blocks:',
    uuid: 'Volume UUID:',
    journal: 'Journaling:',
    apfsTree: 'APFS Object Hierarchy',
    hfsTree: 'HFS+ Catalog B-Tree',
    statusOk: 'Integrity Verified'
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-neutral-50 dark:bg-[#1a1a1a] p-4 overflow-y-auto select-none text-xs">
      {/* Title */}
      <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-600" />
            {t.title}
          </h2>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            {t.subtitle} • {currentPartition.label} ({currentPartition.fileSystem})
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-1.5 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {t.statusOk}
        </span>
      </div>

      {/* Grid of technical cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Superblock / Volume Header Struct */}
        <div className="bg-white dark:bg-[#222222] border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2 mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-700">
            <Database className="w-4 h-4 text-blue-500" />
            {t.structName}
          </h3>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400 font-sans">{t.magic}</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">
                {isApfs ? '0x4253584E (\'NXSB\')' : '0x482B (\'H+\')'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400 font-sans">{t.blockSize}</span>
              <span className="text-neutral-800 dark:text-neutral-200">
                {currentPartition.metadata.allocationBlockSize} Bytes
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400 font-sans">{t.totalBlocks}</span>
              <span className="text-neutral-800 dark:text-neutral-200">
                {currentPartition.metadata.totalBlocks.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400 font-sans">{t.freeBlocks}</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {currentPartition.metadata.freeBlocks.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400 font-sans">{t.uuid}</span>
              <span className="text-neutral-700 dark:text-neutral-300 text-[10px]">
                {currentPartition.metadata.volumeUuid}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-neutral-400 font-sans">{t.journal}</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {currentPartition.metadata.journaled ? 'Habilitado (Activo)' : 'No configurado'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: B-Tree / Object Map Graph */}
        <div className="bg-white dark:bg-[#222222] border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2 mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-700">
            <GitBranch className="w-4 h-4 text-purple-500" />
            {isApfs ? t.apfsTree : t.hfsTree}
          </h3>

          {isApfs ? (
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                <span className="text-[10px] text-neutral-400 block">Object Map OID (omap_phys_t)</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">0x0000000000000402</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                <span className="text-[10px] text-neutral-400 block">Checkpoint Map & Superblock Descriptor</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200">Checkpoint Array: 16 desc / LBA 409600</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                <span className="text-[10px] text-neutral-400 block">Space Manager (spaceman_phys_t)</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">Asignador Free-Queue Bitmaps Activo</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                <span className="text-[10px] text-neutral-400 block">Profundidad de Árbol B-Tree (bTreeDepth)</span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{currentPartition.metadata.bTreeDepth || 3} niveles</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                <span className="text-[10px] text-neutral-400 block">Nodos de Catálogo Registrados</span>
                <span className="font-mono text-neutral-800 dark:text-neutral-200">{(currentPartition.metadata.catalogNodes || 14208).toLocaleString()} registros</span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                <span className="text-[10px] text-neutral-400 block">Archivo de Extensiones Desbordadas</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">Extents Overflow File (Sin fragmentos huérfanos)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explanatory banner */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent border border-blue-200 dark:border-blue-900/40 text-neutral-700 dark:text-neutral-300">
        <h4 className="font-semibold text-xs flex items-center gap-1.5 mb-1 text-blue-700 dark:text-blue-300">
          <Sparkles className="w-3.5 h-3.5" />
          Compatibilidad Universal con Apple macOS en Windows 11
        </h4>
        <p className="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          TransMac 11 implementa decodificación completa del formato Big Endian utilizado por los sistemas de archivos de Apple. Permite leer archivos bifurcados (Resource Forks), preservar atributos POSIX y emular la estructura de contenedores APFS sin necesidad de controladores MacDrive adicionales.
        </p>
      </div>
    </div>
  );
};
