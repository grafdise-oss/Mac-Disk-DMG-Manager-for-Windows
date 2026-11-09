import React, { useState, useRef, useEffect } from 'react';
import {
  FilePlus,
  FolderOpen,
  HardDrive,
  Save,
  Download,
  Upload,
  FolderPlus,
  Trash2,
  List,
  Columns,
  Binary,
  Cpu,
  Flame,
  CheckCircle,
  HelpCircle,
  Info,
  RefreshCw,
  Eye,
  Sliders,
  Disc
} from 'lucide-react';

interface MenuBarProps {
  lang: 'es' | 'en';
  onNewDmg: () => void;
  onOpenDmgFile: () => void;
  onSaveAsDmg: () => void;
  onFormatDisk: () => void;
  onRestoreDmg: () => void;
  onDiskProperties: () => void;
  onCheckFileSystem: () => void;
  onRefreshDrives: () => void;
  onExportFile: () => void;
  onImportFile: () => void;
  onNewFolder: () => void;
  onDeleteSelected: () => void;
  onOpenAbout: () => void;
  onOpenDownloadApp?: () => void;
  onOpenTaskSelector?: () => void;
  onOpenHackintosh?: () => void;
  activeView: 'explorer' | 'partitions' | 'hex' | 'superblock';
  setActiveView: (view: 'explorer' | 'partitions' | 'hex' | 'superblock') => void;
  showHiddenFiles: boolean;
  setShowHiddenFiles: (show: boolean | ((prev: boolean) => boolean)) => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  lang,
  onNewDmg,
  onOpenDmgFile,
  onSaveAsDmg,
  onFormatDisk,
  onRestoreDmg,
  onDiskProperties,
  onCheckFileSystem,
  onRefreshDrives,
  onExportFile,
  onImportFile,
  onNewFolder,
  onDeleteSelected,
  onOpenAbout,
  onOpenDownloadApp,
  onOpenTaskSelector,
  onOpenHackintosh,
  activeView,
  setActiveView,
  showHiddenFiles,
  setShowHiddenFiles
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Close open dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuBarRef.current && !menuBarRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const handleAction = (action: () => void) => {
    action();
    setOpenMenu(null);
  };

  const labels = lang === 'es' ? {
    file: 'Archivo',
    edit: 'Edición',
    view: 'Ver',
    drives: 'Unidades',
    tools: 'Herramientas',
    help: 'Ayuda',
    newDmg: 'Nueva Imagen DMG en blanco...',
    openDmg: 'Abrir Imagen DMG (.dmg, .iso)...',
    saveDmg: 'Guardar Partición como DMG...',
    diskProps: 'Propiedades del Disco...',
    exit: 'Salir de TransMac',
    export: 'Copiar a PC (Exportar archivo)...',
    import: 'Añadir a Mac (Desde PC)...',
    newFolder: 'Nueva Carpeta Mac...',
    delete: 'Eliminar elemento seleccionado',
    viewExplorer: 'Explorador de Archivos Mac',
    viewPartitions: 'Gestor Visual de Particiones',
    viewHex: 'Editor Hexadecimal de Sectores LBA',
    viewSuperblock: 'Inspector B-Tree y APFS Superblock',
    showHidden: 'Mostrar Archivos Ocultos de Mac (.DS_Store)',
    formatMac: 'Formatear Disco para Mac (HFS+ / APFS)...',
    restoreDmg: 'Restaurar con Imagen DMG (Crear USB Booteable)...',
    checkFs: 'Comprobar Sistema de Archivos Mac (fsck)...',
    refreshDrives: 'Actualizar Unidades (F5)',
    wizardUsb: 'Asistente de Instalador USB macOS...',
    smartHealth: 'Diagnóstico de Salud S.M.A.R.T....',
    guide: 'Guía de Creación de USBs Booteables Apple...',
    about: 'Acerca de TransMac 11...'
  } : {
    file: 'File',
    edit: 'Edit',
    view: 'View',
    drives: 'Drives',
    tools: 'Tools',
    help: 'Help',
    newDmg: 'New Blank DMG Image...',
    openDmg: 'Open DMG Image (.dmg, .iso)...',
    saveDmg: 'Save Partition as DMG...',
    diskProps: 'Drive Properties...',
    exit: 'Exit TransMac',
    export: 'Copy to PC (Export file)...',
    import: 'Add to Mac (From PC)...',
    newFolder: 'New Mac Folder...',
    delete: 'Delete Selected Item',
    viewExplorer: 'Mac File Explorer',
    viewPartitions: 'Visual Partition Manager',
    viewHex: 'LBA Hex Sector Editor',
    viewSuperblock: 'B-Tree & APFS Superblock Inspector',
    showHidden: 'Show Mac Hidden Files (.DS_Store)',
    formatMac: 'Format Disk for Mac (HFS+ / APFS)...',
    restoreDmg: 'Restore with Disk Image (Create Bootable USB)...',
    checkFs: 'Check Mac File System (fsck)...',
    refreshDrives: 'Refresh Drives (F5)',
    wizardUsb: 'macOS Bootable USB Wizard...',
    smartHealth: 'S.M.A.R.T. Drive Health...',
    guide: 'Apple Bootable USB Creation Guide...',
    about: 'About TransMac 11...'
  };

  return (
    <nav ref={menuBarRef} className="h-7 w-full select-none flex items-center px-2 bg-neutral-100 dark:bg-[#181818] border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 relative z-40">
      {/* Archivo / File */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('file')}
          className={`px-2.5 py-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors ${openMenu === 'file' ? 'bg-neutral-200 dark:bg-neutral-800 text-blue-600 dark:text-blue-400' : ''}`}
        >
          {labels.file}
        </button>
        {openMenu === 'file' && (
          <div className="absolute left-0 top-full mt-1 w-64 bg-white dark:bg-[#202020] border border-neutral-200 dark:border-neutral-700 rounded-md shadow-xl py-1 z-50 text-xs">
            <button
              onClick={() => handleAction(onNewDmg)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <FilePlus className="w-3.5 h-3.5 text-blue-500" />
              <span>{labels.newDmg}</span>
            </button>
            <button
              onClick={() => handleAction(onOpenDmgFile)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>{labels.openDmg}</span>
            </button>
            <button
              onClick={() => handleAction(onSaveAsDmg)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-emerald-500" />
              <span>{labels.saveDmg}</span>
            </button>
            <button
              onClick={() => handleAction(onDiskProperties)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <HardDrive className="w-3.5 h-3.5 text-purple-500" />
              <span>{labels.diskProps}</span>
            </button>
            {onOpenDownloadApp && (
              <>
                <div className="h-[1px] bg-neutral-200 dark:bg-neutral-700 my-1" />
                <button
                  onClick={() => handleAction(onOpenDownloadApp)}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors font-medium text-blue-600 dark:text-blue-400"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'es' ? 'Descargar Programa Nativo Windows 11...' : 'Download Native Windows 11 App...'}</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Edición / Edit */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('edit')}
          className={`px-2.5 py-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors ${openMenu === 'edit' ? 'bg-neutral-200 dark:bg-neutral-800 text-blue-600 dark:text-blue-400' : ''}`}
        >
          {labels.edit}
        </button>
        {openMenu === 'edit' && (
          <div className="absolute left-0 top-full mt-1 w-64 bg-white dark:bg-[#202020] border border-neutral-200 dark:border-neutral-700 rounded-md shadow-xl py-1 z-50 text-xs">
            <button
              onClick={() => handleAction(onExportFile)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              <span>{labels.export}</span>
            </button>
            <button
              onClick={() => handleAction(onImportFile)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-500" />
              <span>{labels.import}</span>
            </button>
            <button
              onClick={() => handleAction(onNewFolder)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
              <span>{labels.newFolder}</span>
            </button>
            <div className="h-[1px] bg-neutral-200 dark:bg-neutral-700 my-1" />
            <button
              onClick={() => handleAction(onDeleteSelected)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-red-600 hover:text-white transition-colors text-red-600 dark:text-red-400"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{labels.delete}</span>
            </button>
          </div>
        )}
      </div>

      {/* Ver / View */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('view')}
          className={`px-2.5 py-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors ${openMenu === 'view' ? 'bg-neutral-200 dark:bg-neutral-800 text-blue-600 dark:text-blue-400' : ''}`}
        >
          {labels.view}
        </button>
        {openMenu === 'view' && (
          <div className="absolute left-0 top-full mt-1 w-68 bg-white dark:bg-[#202020] border border-neutral-200 dark:border-neutral-700 rounded-md shadow-xl py-1 z-50 text-xs">
            <button
              onClick={() => handleAction(() => setActiveView('explorer'))}
              className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-blue-600 hover:text-white transition-colors ${activeView === 'explorer' ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}
            >
              <div className="flex items-center gap-2">
                <List className="w-3.5 h-3.5" />
                <span>{labels.viewExplorer}</span>
              </div>
              {activeView === 'explorer' && <CheckCircle className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => handleAction(() => setActiveView('partitions'))}
              className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-blue-600 hover:text-white transition-colors ${activeView === 'partitions' ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}
            >
              <div className="flex items-center gap-2">
                <Columns className="w-3.5 h-3.5" />
                <span>{labels.viewPartitions}</span>
              </div>
              {activeView === 'partitions' && <CheckCircle className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => handleAction(() => setActiveView('hex'))}
              className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-blue-600 hover:text-white transition-colors ${activeView === 'hex' ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}
            >
              <div className="flex items-center gap-2">
                <Binary className="w-3.5 h-3.5" />
                <span>{labels.viewHex}</span>
              </div>
              {activeView === 'hex' && <CheckCircle className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => handleAction(() => setActiveView('superblock'))}
              className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-blue-600 hover:text-white transition-colors ${activeView === 'superblock' ? 'font-semibold text-blue-600 dark:text-blue-400' : ''}`}
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" />
                <span>{labels.viewSuperblock}</span>
              </div>
              {activeView === 'superblock' && <CheckCircle className="w-3.5 h-3.5" />}
            </button>
            <div className="h-[1px] bg-neutral-200 dark:bg-neutral-700 my-1" />
            <button
              onClick={() => handleAction(() => setShowHiddenFiles(p => !p))}
              className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-blue-600 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-neutral-500" />
                <span>{labels.showHidden}</span>
              </div>
              {showHiddenFiles && <CheckCircle className="w-3.5 h-3.5 text-blue-600" />}
            </button>
          </div>
        )}
      </div>

      {/* Unidades / Drives */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('drives')}
          className={`px-2.5 py-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors ${openMenu === 'drives' ? 'bg-neutral-200 dark:bg-neutral-800 text-blue-600 dark:text-blue-400' : ''}`}
        >
          {labels.drives}
        </button>
        {openMenu === 'drives' && (
          <div className="absolute left-0 top-full mt-1 w-72 bg-white dark:bg-[#202020] border border-neutral-200 dark:border-neutral-700 rounded-md shadow-xl py-1 z-50 text-xs">
            <button
              onClick={() => handleAction(onFormatDisk)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors font-medium text-amber-600 dark:text-amber-400"
            >
              <Disc className="w-3.5 h-3.5" />
              <span>{labels.formatMac}</span>
            </button>
            <button
              onClick={() => handleAction(onRestoreDmg)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors font-semibold text-blue-600 dark:text-blue-400"
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>{labels.restoreDmg}</span>
            </button>
            <div className="h-[1px] bg-neutral-200 dark:bg-neutral-700 my-1" />
            <button
              onClick={() => handleAction(onCheckFileSystem)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>{labels.checkFs}</span>
            </button>
            <button
              onClick={() => handleAction(onRefreshDrives)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
              <span>{labels.refreshDrives}</span>
            </button>
          </div>
        )}
      </div>

      {/* Herramientas / Tools */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('tools')}
          className={`px-2.5 py-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors ${openMenu === 'tools' ? 'bg-neutral-200 dark:bg-neutral-800 text-blue-600 dark:text-blue-400' : ''}`}
        >
          {labels.tools}
        </button>
        {openMenu === 'tools' && (
          <div className="absolute left-0 top-full mt-1 w-64 bg-white dark:bg-[#202020] border border-neutral-200 dark:border-neutral-700 rounded-md shadow-xl py-1 z-50 text-xs">
            {onOpenTaskSelector && (
              <button
                onClick={() => handleAction(onOpenTaskSelector)}
                className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <span>🚀</span>
                <span>{lang === 'es' ? 'Selector de Tareas de Inicio...' : 'Startup Task Selector...'}</span>
              </button>
            )}
            <button
              onClick={() => handleAction(onRestoreDmg)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>{labels.wizardUsb}</span>
            </button>
            {onOpenHackintosh && (
              <button
                onClick={() => handleAction(onOpenHackintosh)}
                className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-purple-600 hover:text-white transition-colors font-medium text-purple-600 dark:text-purple-400"
              >
                <span>💻</span>
                <span>{lang === 'es' ? 'Crear USB Hackintosh PC (OpenCore)...' : 'Create PC Hackintosh USB (OpenCore)...'}</span>
              </button>
            )}
            <button
              onClick={() => handleAction(onNewDmg)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <FilePlus className="w-3.5 h-3.5 text-blue-500" />
              <span>{labels.newDmg}</span>
            </button>
            <button
              onClick={() => handleAction(onDiskProperties)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-500" />
              <span>{labels.smartHealth}</span>
            </button>
            {onOpenDownloadApp && (
              <>
                <div className="h-[1px] bg-neutral-200 dark:bg-neutral-700 my-1" />
                <button
                  onClick={() => handleAction(onOpenDownloadApp)}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors font-medium text-blue-600 dark:text-blue-400"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'es' ? 'Descargar Programa Nativo Windows 11...' : 'Download Native Windows 11 App...'}</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Ayuda / Help */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('help')}
          className={`px-2.5 py-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors ${openMenu === 'help' ? 'bg-neutral-200 dark:bg-neutral-800 text-blue-600 dark:text-blue-400' : ''}`}
        >
          {labels.help}
        </button>
        {openMenu === 'help' && (
          <div className="absolute left-0 top-full mt-1 w-68 bg-white dark:bg-[#202020] border border-neutral-200 dark:border-neutral-700 rounded-md shadow-xl py-1 z-50 text-xs">
            <button
              onClick={() => handleAction(onOpenAbout)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>{labels.guide}</span>
            </button>
            <button
              onClick={() => handleAction(onOpenAbout)}
              className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-indigo-500" />
              <span>{labels.about}</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
