import React from 'react';
import {
  HardDrive,
  Disc,
  ShieldCheck,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { MacDisk, MacPartition, formatBytes } from '../utils/macDiskEngine';

interface StatusBarProps {
  currentDisk: MacDisk | null;
  currentPartition: MacPartition | null;
  itemCount: number;
  lang: 'es' | 'en';
}

export const StatusBar: React.FC<StatusBarProps> = ({
  currentDisk,
  currentPartition,
  itemCount,
  lang
}) => {
  const t = lang === 'es' ? {
    noDisk: 'Sin disco seleccionado',
    rwStatus: 'Acceso Mac HFS+/APFS: Activo (Lectura/Escritura)',
    items: 'elementos'
  } : {
    noDisk: 'No disk selected',
    rwStatus: 'Mac HFS+/APFS Access: Active (Read/Write)',
    items: 'items'
  };

  return (
    <footer className="h-6 w-full select-none flex items-center justify-between px-3 bg-neutral-100 dark:bg-[#181818] border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 overflow-hidden font-sans">
      {/* Left side metrics */}
      <div className="flex items-center gap-3 truncate">
        {currentDisk ? (
          <>
            <div className="flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200 truncate">
              <HardDrive className="w-3 h-3 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
              <span className="truncate">{currentDisk.model}</span>
            </div>

            <span className="text-neutral-300 dark:text-neutral-700">|</span>

            {currentPartition && (
              <div className="flex items-center gap-1 truncate text-neutral-700 dark:text-neutral-300">
                <Disc className="w-3 h-3 text-purple-500 flex-shrink-0" />
                <span className="font-semibold truncate">{currentPartition.label}</span>
                <span className="font-mono text-[10px]">({currentPartition.fileSystem})</span>
              </div>
            )}

            <span className="text-neutral-300 dark:text-neutral-700">|</span>

            {currentPartition && (
              <div className="text-[10px] font-mono">
                {formatBytes(currentPartition.usedBytes)} / {formatBytes(currentPartition.sizeBytes)}
              </div>
            )}
          </>
        ) : (
          <span>{t.noDisk}</span>
        )}
      </div>

      {/* Right side status indicators */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-1">
          <FolderOpen className="w-3 h-3 text-amber-500" />
          <span>{itemCount} {t.items}</span>
        </div>

        <span className="text-neutral-300 dark:text-neutral-700">|</span>

        {currentDisk && (
          <span className="font-mono text-[10px] text-neutral-500">
            {currentDisk.partitionScheme} • {currentDisk.sectorSize}B
          </span>
        )}

        <span className="text-neutral-300 dark:text-neutral-700">|</span>

        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t.rwStatus}</span>
        </div>
      </div>
    </footer>
  );
};
