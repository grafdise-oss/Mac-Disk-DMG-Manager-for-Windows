import React from 'react';
import {
  FolderOpen,
  Disc,
  Flame,
  Save,
  Download,
  Upload,
  FolderPlus,
  Trash2,
  RefreshCw,
  List,
  Columns,
  Binary,
  Cpu,
  FileCheck2,
  Usb,
  Plug
} from 'lucide-react';

interface ToolbarProps {
  lang: 'es' | 'en';
  onOpenDmgFile: () => void;
  onFormatDisk: () => void;
  onRestoreDmg: () => void;
  onSaveAsDmg: () => void;
  onExportFile: () => void;
  onImportFile: () => void;
  onNewFolder: () => void;
  onDeleteSelected: () => void;
  onRefreshDrives: () => void;
  onConnectPhysicalUsb?: () => void;
  onOpenDownloadApp?: () => void;
  onOpenHackintosh?: () => void;
  onOpenTaskSelector?: () => void;
  onCheckFs: () => void;
  activeView: 'explorer' | 'partitions' | 'hex' | 'superblock';
  setActiveView: (view: 'explorer' | 'partitions' | 'hex' | 'superblock') => void;
  hasSelectedFile: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  lang,
  onOpenDmgFile,
  onFormatDisk,
  onRestoreDmg,
  onSaveAsDmg,
  onExportFile,
  onImportFile,
  onNewFolder,
  onDeleteSelected,
  onRefreshDrives,
  onConnectPhysicalUsb,
  onOpenDownloadApp,
  onOpenHackintosh,
  onOpenTaskSelector,
  onCheckFs,
  activeView,
  setActiveView,
  hasSelectedFile
}) => {
  const t = lang === 'es' ? {
    openDmg: 'Abrir DMG',
    format: 'Formatear Mac',
    restore: 'Restaurar a USB',
    saveDmg: 'Guardar DMG',
    copyToPc: 'Copiar a PC',
    addToMac: 'Añadir a Mac',
    newFolder: 'Nueva Carpeta',
    delete: 'Eliminar',
    checkFs: 'Verificar fsck',
    refresh: 'Actualizar',
    explorer: 'Archivos Mac',
    partitions: 'Particiones',
    hex: 'Sectores Hex',
    superblock: 'APFS / HFS+'
  } : {
    openDmg: 'Open DMG',
    format: 'Format Mac',
    restore: 'Restore to USB',
    saveDmg: 'Save DMG',
    copyToPc: 'Copy to PC',
    addToMac: 'Add to Mac',
    newFolder: 'New Folder',
    delete: 'Delete',
    checkFs: 'Verify fsck',
    refresh: 'Refresh',
    explorer: 'Mac Files',
    partitions: 'Partitions',
    hex: 'Hex Sectors',
    superblock: 'APFS / HFS+'
  };

  return (
    <div className="h-12 w-full select-none flex items-center justify-between px-3 bg-neutral-50/90 dark:bg-[#202020]/90 border-b border-neutral-200 dark:border-neutral-800 gap-2 overflow-x-auto text-xs">
      {/* Primary Actions Group */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={onOpenDmgFile}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-200 transition-colors font-medium border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
          title={t.openDmg}
        >
          <FolderOpen className="w-4 h-4 text-amber-500" />
          <span>{t.openDmg}</span>
        </button>

        <button
          onClick={onFormatDisk}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700/80 text-amber-700 dark:text-amber-400 transition-colors font-medium border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
          title={t.format}
        >
          <Disc className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>{t.format}</span>
        </button>

        <button
          onClick={onRestoreDmg}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors font-semibold shadow-sm hover:shadow"
          title={t.restore}
        >
          <Flame className="w-4 h-4 text-orange-300 animate-pulse" />
          <span>{t.restore}</span>
        </button>

        {onOpenHackintosh && (
          <button
            onClick={onOpenHackintosh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-600 hover:bg-purple-700 text-white transition-colors font-semibold shadow-sm hover:shadow cursor-pointer"
            title={lang === 'es' ? 'Crear USB Hackintosh para instalar macOS en PC con OpenCore' : 'Create Hackintosh PC USB with OpenCore'}
          >
            <Cpu className="w-4 h-4 text-purple-200" />
            <span>{lang === 'es' ? 'Hackintosh PC' : 'Hackintosh PC'}</span>
          </button>
        )}

        <button
          onClick={onSaveAsDmg}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-200 transition-colors border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
          title={t.saveDmg}
        >
          <Save className="w-4 h-4 text-emerald-500" />
          <span>{t.saveDmg}</span>
        </button>

        <div className="w-[1px] h-6 bg-neutral-300 dark:bg-neutral-700 mx-1" />

        {/* File Manipulation Actions */}
        <button
          onClick={onExportFile}
          disabled={!hasSelectedFile}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors border border-transparent ${
            hasSelectedFile
              ? 'hover:bg-neutral-200 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600 cursor-pointer'
              : 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
          }`}
          title={t.copyToPc}
        >
          <Download className="w-4 h-4 text-blue-500" />
          <span>{t.copyToPc}</span>
        </button>

        <button
          onClick={onImportFile}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-200 transition-colors border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
          title={t.addToMac}
        >
          <Upload className="w-4 h-4 text-emerald-500" />
          <span>{t.addToMac}</span>
        </button>

        <button
          onClick={onNewFolder}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-200 transition-colors border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
          title={t.newFolder}
        >
          <FolderPlus className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline">{t.newFolder}</span>
        </button>

        <button
          onClick={onDeleteSelected}
          disabled={!hasSelectedFile}
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-colors border border-transparent ${
            hasSelectedFile
              ? 'hover:bg-red-100 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 cursor-pointer'
              : 'text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50'
          }`}
          title={t.delete}
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">{t.delete}</span>
        </button>

        <div className="w-[1px] h-6 bg-neutral-300 dark:bg-neutral-700 mx-1" />

        <button
          onClick={onCheckFs}
          className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
          title={t.checkFs}
          aria-label={t.checkFs}
        >
          <FileCheck2 className="w-4 h-4 text-teal-500" />
        </button>

        <button
          onClick={onRefreshDrives}
          className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1"
          title={lang === 'es' ? 'Actualizar y buscar unidades conectadas' : 'Refresh and scan for connected drives'}
          aria-label={t.refresh}
        >
          <RefreshCw className="w-4 h-4 text-neutral-500" />
        </button>

        {onConnectPhysicalUsb && (
          <button
            onClick={onConnectPhysicalUsb}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 transition-colors font-medium text-xs shadow-xs"
            title={lang === 'es' ? 'Detectar y vincular pendrive USB físico de Windows' : 'Detect and link physical Windows USB pendrive'}
          >
            <Usb className="w-3.5 h-3.5 text-emerald-500" />
            <span>{lang === 'es' ? 'Conectar USB Físico' : 'Link Physical USB'}</span>
          </button>
        )}

        {onOpenDownloadApp && (
          <button
            onClick={onOpenDownloadApp}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-600/15 hover:bg-blue-600/25 text-blue-700 dark:text-blue-300 border border-blue-500/40 transition-colors font-medium text-xs shadow-xs"
            title={lang === 'es' ? 'Descargar aplicación nativa de escritorio para Windows 11 (detecta C:, D:, E: físicos)' : 'Download native desktop app for Windows 11'}
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>{lang === 'es' ? 'Descargar para Windows 11' : 'Download for Win 11'}</span>
          </button>
        )}
      </div>

      {/* Right: Windows 11 View Selector Segment Control */}
      <div className="flex items-center bg-neutral-200/80 dark:bg-neutral-800 p-0.5 rounded-lg flex-shrink-0">
        <button
          onClick={() => setActiveView('explorer')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            activeView === 'explorer'
              ? 'bg-white dark:bg-[#2b2b2b] text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>{t.explorer}</span>
        </button>

        <button
          onClick={() => setActiveView('partitions')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            activeView === 'partitions'
              ? 'bg-white dark:bg-[#2b2b2b] text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Columns className="w-3.5 h-3.5" />
          <span>{t.partitions}</span>
        </button>

        <button
          onClick={() => setActiveView('hex')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            activeView === 'hex'
              ? 'bg-white dark:bg-[#2b2b2b] text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Binary className="w-3.5 h-3.5" />
          <span>{t.hex}</span>
        </button>

        <button
          onClick={() => setActiveView('superblock')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
            activeView === 'superblock'
              ? 'bg-white dark:bg-[#2b2b2b] text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>{t.superblock}</span>
        </button>
      </div>
    </div>
  );
};
