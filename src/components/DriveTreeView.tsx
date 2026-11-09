import React, { useState } from 'react';
import {
  HardDrive,
  Usb,
  Disc,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Plus,
  Flame,
  FileCode,
  ShieldCheck,
  UploadCloud
} from 'lucide-react';
import { MacDisk, MacPartition, formatBytes } from '../utils/macDiskEngine';

interface DriveTreeViewProps {
  disks: MacDisk[];
  selectedDiskId: string;
  selectedPartitionId: string;
  onSelectDisk: (diskId: string) => void;
  onSelectPartition: (diskId: string, partitionId: string) => void;
  onMountDmg: () => void;
  onCreateDmg: () => void;
  onFormatDisk: () => void;
  onRestoreDmg: () => void;
  onDiskProperties: () => void;
  onConnectPhysicalUsb?: () => void;
  onOpenDownloadApp?: () => void;
  onLoadDemoDisks?: () => void;
  onClearMockDisks?: () => void;
  isDemoMode?: boolean;
  lang: 'es' | 'en';
}

export const DriveTreeView: React.FC<DriveTreeViewProps> = ({
  disks,
  selectedDiskId,
  selectedPartitionId,
  onSelectDisk,
  onSelectPartition,
  onMountDmg,
  onCreateDmg,
  onFormatDisk,
  onRestoreDmg,
  onDiskProperties,
  onConnectPhysicalUsb,
  onOpenDownloadApp,
  onLoadDemoDisks,
  onClearMockDisks,
  isDemoMode,
  lang
}) => {
  const [expandedDisks, setExpandedDisks] = useState<Record<string, boolean>>({
    'disk-usb-sandisk-64gb': true,
    'disk-usb-wd-1tb': true,
    'disk-usb-kingston-32gb': true
  });

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    diskId: string;
    partitionId?: string;
  } | null>(null);

  const toggleDiskExpand = (diskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDisks(prev => ({ ...prev, [diskId]: !prev[diskId] }));
  };

  const handleContextMenu = (e: React.MouseEvent, diskId: string, partitionId?: string) => {
    e.preventDefault();
    onSelectDisk(diskId);
    if (partitionId) {
      onSelectPartition(diskId, partitionId);
    }
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      diskId,
      partitionId
    });
  };

  React.useEffect(() => {
    const handleClose = () => setContextMenu(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  const t = lang === 'es' ? {
    title: 'Unidades y Volúmenes Mac',
    openDmg: 'Montar DMG...',
    createDmg: 'Crear DMG...',
    format: 'Formatear Disco para Mac...',
    restore: 'Restaurar con Imagen DMG...',
    props: 'Propiedades de la Unidad...',
    bootable: 'Booteable',
    unformatted: 'Sin formato Mac',
    dropDmg: 'Arrastra un archivo .DMG aquí'
  } : {
    title: 'Mac Drives & Volumes',
    openDmg: 'Mount DMG...',
    createDmg: 'Create DMG...',
    format: 'Format Disk for Mac...',
    restore: 'Restore with Disk Image...',
    props: 'Drive Properties...',
    bootable: 'Bootable',
    unformatted: 'Unformatted for Mac',
    dropDmg: 'Drop a .DMG file here'
  };

  return (
    <aside className="w-80 h-full flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-neutral-100/70 dark:bg-[#1a1a1a]/80 select-none text-xs">
      {/* Header bar */}
      <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <span className="font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-[11px]">
          {t.title}
        </span>
        <div className="flex items-center gap-1">
          {onConnectPhysicalUsb && (
            <button
              onClick={onConnectPhysicalUsb}
              className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-emerald-600 dark:text-emerald-400 transition-colors"
              title={lang === 'es' ? 'Detectar / Conectar pendrive USB físico de Windows...' : 'Connect physical USB drive...'}
              aria-label="Conectar USB Físico"
            >
              <Usb className="w-3.5 h-3.5 text-emerald-500" />
            </button>
          )}
          <button
            onClick={onMountDmg}
            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
            title={t.openDmg}
            aria-label={t.openDmg}
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
          </button>
          <button
            onClick={onCreateDmg}
            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors"
            title={t.createDmg}
            aria-label={t.createDmg}
          >
            <Plus className="w-3.5 h-3.5 text-blue-500" />
          </button>
        </div>
      </div>

      {/* Tree list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {/* Notice for Mock / Demo Mode */}
        {isDemoMode && disks.length > 0 && (
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-600 dark:text-amber-300 space-y-1.5">
            <div className="font-bold flex items-center justify-between">
              <span>🧪 Modo Demo (Unidades Simuladas)</span>
              {onClearMockDisks && (
                <button
                  onClick={onClearMockDisks}
                  className="text-[10px] underline hover:text-amber-100 cursor-pointer"
                  title="Ocultar discos inventados"
                >
                  Ocultar
                </button>
              )}
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">
              Estas unidades son de muestra virtual para explorar el visor.
            </p>
            {onOpenDownloadApp && (
              <button
                onClick={onOpenDownloadApp}
                className="w-full py-1 px-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                📥 Descargar para leer mis discos C:, D:, E: reales
              </button>
            )}
          </div>
        )}

        {disks.length === 0 ? (
          <div className="p-4 text-center space-y-3 bg-neutral-100 dark:bg-neutral-800/50 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700">
            <div className="w-10 h-10 mx-auto rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                No hay unidades conectadas
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Por seguridad de Windows, este navegador no puede escanear tus discos físicos C:, D:, E: de forma oculta.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {onOpenDownloadApp && (
                <button
                  onClick={onOpenDownloadApp}
                  className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>📥 Descargar App Windows 11</span>
                </button>
              )}

              {onConnectPhysicalUsb && (
                <button
                  onClick={onConnectPhysicalUsb}
                  className="w-full py-1.5 px-3 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Usb className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Vincular Letra USB (E:\, D:\)</span>
                </button>
              )}

              {onLoadDemoDisks && (
                <button
                  onClick={onLoadDemoDisks}
                  className="w-full py-1 px-2 text-[10px] text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 underline cursor-pointer"
                >
                  O cargar unidades de demostración
                </button>
              )}
            </div>
          </div>
        ) : (
          disks.map((disk) => {
          const isDiskSelected = disk.id === selectedDiskId;
          const isExpanded = !!expandedDisks[disk.id];

          return (
            <div key={disk.id} className="rounded-md overflow-hidden">
              {/* Disk Item */}
              <div
                onClick={() => {
                  onSelectDisk(disk.id);
                  if (disk.partitions.length > 0) {
                    onSelectPartition(disk.id, disk.partitions[0].id);
                  }
                }}
                onContextMenu={(e) => handleContextMenu(e, disk.id)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  isDiskSelected
                    ? 'bg-blue-100/80 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 font-medium'
                    : 'hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                }`}
              >
                <button
                  onClick={(e) => toggleDiskExpand(disk.id, e)}
                  className="p-0.5 rounded hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-500"
                  aria-label="Expandir o contraer unidad"
                >
                  {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>

                {disk.busType === 'USB' ? (
                  <Usb className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                ) : disk.busType === 'Virtual DMG' ? (
                  <Disc className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                ) : (
                  <HardDrive className="w-4 h-4 text-neutral-600 dark:text-neutral-400 flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="truncate text-xs font-semibold leading-tight flex items-center gap-1.5">
                    <span className="truncate">{disk.model}</span>
                    {disk.isPhysical && (
                      <span className="px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold border border-emerald-500/30 flex-shrink-0">
                        🔌 Físico
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                    <span>{formatBytes(disk.capacityBytes)}</span>
                    <span>•</span>
                    <span className="font-mono">{disk.partitionScheme}</span>
                  </div>
                </div>
              </div>

              {/* Partitions beneath Disk */}
              {isExpanded && disk.partitions.length > 0 && (
                <div className="ml-5 pl-2 border-l border-neutral-300 dark:border-neutral-700 space-y-0.5 my-0.5">
                  {disk.partitions.map((part) => {
                    const isPartSelected = isDiskSelected && part.id === selectedPartitionId;
                    const isApfs = part.fileSystem.startsWith('APFS');
                    const isHfs = part.fileSystem.startsWith('HFS');
                    const isEfi = part.fileSystem.includes('EFI');

                    return (
                      <div
                        key={part.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDisk(disk.id);
                          onSelectPartition(disk.id, part.id);
                        }}
                        onContextMenu={(e) => handleContextMenu(e, disk.id, part.id)}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${
                          isPartSelected
                            ? 'bg-blue-600 text-white font-medium shadow-sm'
                            : 'hover:bg-neutral-200/70 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {isEfi ? (
                          <ShieldCheck className={`w-3.5 h-3.5 flex-shrink-0 ${isPartSelected ? 'text-white' : 'text-emerald-500'}`} />
                        ) : isApfs ? (
                          <Disc className={`w-3.5 h-3.5 flex-shrink-0 ${isPartSelected ? 'text-white' : 'text-purple-500'}`} />
                        ) : isHfs ? (
                          <Folder className={`w-3.5 h-3.5 flex-shrink-0 ${isPartSelected ? 'text-white' : 'text-blue-500'}`} />
                        ) : (
                          <HardDrive className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400" />
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="truncate text-xs leading-tight flex items-center justify-between">
                            <span className="truncate">{part.label || part.name}</span>
                            {part.isBootable && (
                              <span
                                className={`text-[9px] px-1 rounded flex-shrink-0 font-mono ml-1 ${
                                  isPartSelected
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300'
                                }`}
                              >
                                {t.bootable}
                              </span>
                            )}
                          </div>
                          <div
                            className={`text-[10px] truncate ${
                              isPartSelected ? 'text-blue-100' : 'text-neutral-500 dark:text-neutral-400'
                            }`}
                          >
                            <span>{part.fileSystem}</span>
                            <span> • {formatBytes(part.sizeBytes)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }))}
      </div>

      {/* Quick bottom card: drag & drop mount DMG */}
      <div className="p-2.5 m-2 bg-white/60 dark:bg-neutral-800/60 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg text-center">
        <button
          onClick={onMountDmg}
          className="w-full flex flex-col items-center justify-center gap-1 text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 py-1"
        >
          <UploadCloud className="w-4 h-4 text-blue-500" />
          <span>{t.dropDmg}</span>
        </button>
      </div>

      {/* Right-click Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white dark:bg-[#202020] border border-neutral-200 dark:border-neutral-700 rounded-md shadow-2xl py-1 z-50 text-xs w-56"
          style={{ left: Math.min(contextMenu.x, window.innerWidth - 230), top: Math.min(contextMenu.y, window.innerHeight - 200) }}
        >
          <button
            onClick={() => {
              onFormatDisk();
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <Disc className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.format}</span>
          </button>
          <button
            onClick={() => {
              onRestoreDmg();
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors font-semibold"
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>{t.restore}</span>
          </button>
          <div className="h-[1px] bg-neutral-200 dark:bg-neutral-700 my-1" />
          <button
            onClick={() => {
              onDiskProperties();
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <HardDrive className="w-3.5 h-3.5 text-neutral-500" />
            <span>{t.props}</span>
          </button>
        </div>
      )}
    </aside>
  );
};
