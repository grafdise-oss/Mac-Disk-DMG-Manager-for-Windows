import React, { useState, useMemo } from 'react';
import {
  Folder,
  FolderOpen,
  File,
  FileCode,
  FileText,
  Binary,
  Disc,
  Shield,
  ArrowLeft,
  ArrowUp,
  Search,
  Download,
  Upload,
  FolderPlus,
  Trash2,
  ExternalLink,
  Info,
  ChevronRight,
  HardDrive
} from 'lucide-react';
import { MacDisk, MacPartition, MacFile, formatBytes } from '../utils/macDiskEngine';

interface FileExplorerProps {
  currentDisk: MacDisk | null;
  currentPartition: MacPartition | null;
  selectedFile: MacFile | null;
  onSelectFile: (file: MacFile | null) => void;
  onOpenFile: (file: MacFile) => void;
  onExportFile: (file: MacFile) => void;
  onImportFile: () => void;
  onNewFolder: () => void;
  onDeleteFile: (file: MacFile) => void;
  showHiddenFiles: boolean;
  lang: 'es' | 'en';
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  currentDisk,
  currentPartition,
  selectedFile,
  onSelectFile,
  onOpenFile,
  onExportFile,
  onImportFile,
  onNewFolder,
  onDeleteFile,
  showHiddenFiles,
  lang
}) => {
  const [currentPathStack, setCurrentPathStack] = useState<MacFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'size' | 'modified' | 'type'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; file: MacFile } | null>(null);

  // Close context menu on outside click
  React.useEffect(() => {
    const handleClose = () => setContextMenu(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  // When switching partition, reset path to root
  React.useEffect(() => {
    setCurrentPathStack([]);
    onSelectFile(null);
  }, [currentPartition?.id]);

  // Current folder files
  const currentDirectoryFiles: MacFile[] = useMemo(() => {
    if (!currentPartition) return [];
    if (currentPathStack.length === 0) {
      return currentPartition.rootDirectory;
    }
    const currentFolder = currentPathStack[currentPathStack.length - 1];
    return currentFolder.children || [];
  }, [currentPartition, currentPathStack]);

  // Filter and sort files
  const displayedFiles = useMemo(() => {
    let list = [...currentDirectoryFiles];

    // Filter hidden files
    if (!showHiddenFiles) {
      list = list.filter(f => !f.name.startsWith('.') && (!f.attributes || !f.attributes.includes('Hidden')));
    }

    // Filter search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(f => f.name.toLowerCase().includes(q));
    }

    // Sort: directories first, then by field
    list.sort((a, b) => {
      const aIsDir = a.type === 'directory' || a.type === 'app';
      const bIsDir = b.type === 'directory' || b.type === 'app';
      if (aIsDir !== bIsDir) {
        return aIsDir ? -1 : 1;
      }

      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'size') {
        comparison = a.size - b.size;
      } else if (sortField === 'modified') {
        comparison = a.modified.localeCompare(b.modified);
      } else if (sortField === 'type') {
        comparison = a.type.localeCompare(b.type);
      }

      return sortAsc ? comparison : -comparison;
    });

    return list;
  }, [currentDirectoryFiles, showHiddenFiles, searchQuery, sortField, sortAsc]);

  const handleNavigateInto = (item: MacFile) => {
    if (item.type === 'directory' || item.type === 'app') {
      setCurrentPathStack(prev => [...prev, item]);
      onSelectFile(null);
    } else {
      onOpenFile(item);
    }
  };

  const handleNavigateUp = () => {
    if (currentPathStack.length > 0) {
      setCurrentPathStack(prev => prev.slice(0, prev.length - 1));
      onSelectFile(null);
    }
  };

  const handleNavigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      setCurrentPathStack([]);
    } else {
      setCurrentPathStack(prev => prev.slice(0, index + 1));
    }
    onSelectFile(null);
  };

  const toggleSort = (field: 'name' | 'size' | 'modified' | 'type') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getFileIcon = (file: MacFile) => {
    switch (file.type) {
      case 'directory':
        return <Folder className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      case 'app':
        return <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[9px] text-white font-bold flex-shrink-0 shadow-xs">A</div>;
      case 'plist':
        return <FileCode className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
      case 'dmg':
        return <Disc className="w-4 h-4 text-purple-500 flex-shrink-0" />;
      case 'efi':
        return <Shield className="w-4 h-4 text-teal-500 flex-shrink-0" />;
      case 'pkg':
        return <FolderOpen className="w-4 h-4 text-yellow-600 flex-shrink-0" />;
      default:
        return <File className="w-4 h-4 text-neutral-400 flex-shrink-0" />;
    }
  };

  const getFileTypeName = (file: MacFile) => {
    switch (file.type) {
      case 'directory':
        return lang === 'es' ? 'Carpeta de archivos' : 'File Folder';
      case 'app':
        return lang === 'es' ? 'Aplicación macOS (.app)' : 'macOS Application (.app)';
      case 'plist':
        return lang === 'es' ? 'Lista de Propiedades Apple (.plist)' : 'Apple Property List (.plist)';
      case 'dmg':
        return lang === 'es' ? 'Imagen de Disco Mac (.dmg)' : 'Mac Disk Image (.dmg)';
      case 'efi':
        return lang === 'es' ? 'Cargador de Arranque UEFI (.efi)' : 'UEFI Bootloader (.efi)';
      case 'pkg':
        return lang === 'es' ? 'Paquete Instalador Apple (.pkg)' : 'Apple Installer Package (.pkg)';
      default:
        return lang === 'es' ? 'Archivo Mac' : 'Mac File';
    }
  };

  const t = lang === 'es' ? {
    noPartition: 'No hay ninguna partición seleccionada',
    selectPrompt: 'Selecciona una partición en el panel izquierdo para explorar su contenido HFS+ o APFS.',
    colName: 'Nombre',
    colSize: 'Tamaño',
    colType: 'Tipo',
    colDate: 'Fecha de Modificación',
    colPerms: 'Permisos',
    colOwner: 'Propietario',
    colAttrs: 'Atributos Mac',
    emptyFolder: 'Esta carpeta está vacía',
    searchPlaceholder: 'Buscar archivos en esta partición...',
    open: 'Abrir / Inspeccionar',
    export: 'Copiar a PC (Exportar)',
    delete: 'Eliminar de Mac',
    dropZone: 'Arrastra y suelta archivos desde Windows para inyectarlos en esta partición Mac',
    itemsCount: 'elementos'
  } : {
    noPartition: 'No partition selected',
    selectPrompt: 'Select a partition in the left tree to explore its HFS+ or APFS filesystem.',
    colName: 'Name',
    colSize: 'Size',
    colType: 'Type',
    colDate: 'Date Modified',
    colPerms: 'Permissions',
    colOwner: 'Owner',
    colAttrs: 'Mac Attributes',
    emptyFolder: 'This folder is empty',
    searchPlaceholder: 'Search files in this partition...',
    open: 'Open / Inspect',
    export: 'Copy to PC (Export)',
    delete: 'Delete from Mac',
    dropZone: 'Drag and drop files from Windows to inject into this Mac partition',
    itemsCount: 'items'
  };

  if (!currentPartition) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-neutral-400 select-none">
        <HardDrive className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mb-4 animate-bounce" />
        <h3 className="text-base font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
          {t.noPartition}
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm text-center">
          {t.selectPrompt}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-white dark:bg-[#1e1e1e] select-none text-xs overflow-hidden">
      {/* Windows 11 Explorer Navigation & Breadcrumb Bar */}
      <div className="h-11 px-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2 bg-neutral-50/70 dark:bg-[#232323]/70">
        <div className="flex items-center gap-1">
          <button
            onClick={handleNavigateUp}
            disabled={currentPathStack.length === 0}
            className={`p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors ${
              currentPathStack.length === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
            }`}
            title="Subir de nivel"
            aria-label="Subir un nivel"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Breadcrumb Path Box */}
        <div className="flex-1 flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-700 rounded-md overflow-x-auto text-xs shadow-inner">
          <button
            onClick={() => handleNavigateToBreadcrumb(-1)}
            className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline flex-shrink-0"
          >
            <HardDrive className="w-3.5 h-3.5 text-neutral-500" />
            <span>{currentPartition.label || currentPartition.name}</span>
          </button>

          {currentPathStack.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <ChevronRight className="w-3 h-3 text-neutral-400 flex-shrink-0" />
              <button
                onClick={() => handleNavigateToBreadcrumb(index)}
                className={`flex-shrink-0 hover:underline ${
                  index === currentPathStack.length - 1
                    ? 'font-semibold text-neutral-900 dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-56 flex-shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-8 pr-2 py-1 text-xs bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Explorer Table Header */}
      <div className="grid grid-cols-12 px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-[#252525] text-neutral-600 dark:text-neutral-400 font-medium text-[11px]">
        <div
          onClick={() => toggleSort('name')}
          className="col-span-4 flex items-center gap-1 cursor-pointer hover:text-neutral-900 dark:hover:text-white"
        >
          <span>{t.colName}</span>
          {sortField === 'name' && <span>{sortAsc ? '▲' : '▼'}</span>}
        </div>
        <div
          onClick={() => toggleSort('size')}
          className="col-span-2 flex items-center justify-end gap-1 cursor-pointer hover:text-neutral-900 dark:hover:text-white pr-4"
        >
          <span>{t.colSize}</span>
          {sortField === 'size' && <span>{sortAsc ? '▲' : '▼'}</span>}
        </div>
        <div
          onClick={() => toggleSort('type')}
          className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-neutral-900 dark:hover:text-white"
        >
          <span>{t.colType}</span>
          {sortField === 'type' && <span>{sortAsc ? '▲' : '▼'}</span>}
        </div>
        <div
          onClick={() => toggleSort('modified')}
          className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-neutral-900 dark:hover:text-white"
        >
          <span>{t.colDate}</span>
          {sortField === 'modified' && <span>{sortAsc ? '▲' : '▼'}</span>}
        </div>
        <div className="col-span-1 text-center">
          <span>{t.colPerms}</span>
        </div>
        <div className="col-span-1 text-right">
          <span>{t.colOwner}</span>
        </div>
      </div>

      {/* File List Content */}
      <div className="flex-1 overflow-y-auto">
        {displayedFiles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-neutral-400">
            <FolderOpen className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mb-2" />
            <p className="text-xs">{t.emptyFolder}</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/40">
            {displayedFiles.map((file) => {
              const isSelected = selectedFile?.id === file.id;

              return (
                <div
                  key={file.id}
                  onClick={() => onSelectFile(file)}
                  onDoubleClick={() => handleNavigateInto(file)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onSelectFile(file);
                    setContextMenu({ x: e.clientX, y: e.clientY, file });
                  }}
                  className={`grid grid-cols-12 px-3 py-1.5 items-center cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 font-medium'
                      : 'hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  {/* Name + icon */}
                  <div className="col-span-4 flex items-center gap-2 min-w-0 pr-2">
                    {getFileIcon(file)}
                    <span className="truncate">{file.name}</span>
                    {file.attributes?.map(attr => (
                      <span
                        key={attr}
                        className="text-[9px] px-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded font-mono flex-shrink-0"
                      >
                        {attr}
                      </span>
                    ))}
                  </div>

                  {/* Size */}
                  <div className="col-span-2 text-right pr-4 text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">
                    {file.type === 'directory' ? '--' : formatBytes(file.size)}
                  </div>

                  {/* Type */}
                  <div className="col-span-2 text-neutral-500 dark:text-neutral-400 truncate text-[11px]">
                    {getFileTypeName(file)}
                  </div>

                  {/* Date Modified */}
                  <div className="col-span-2 text-neutral-500 dark:text-neutral-400 text-[11px] truncate">
                    {file.modified}
                  </div>

                  {/* Permissions */}
                  <div className="col-span-1 text-center font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                    {file.permissions}
                  </div>

                  {/* Owner */}
                  <div className="col-span-1 text-right text-neutral-500 dark:text-neutral-400 text-[10px] truncate">
                    {file.owner}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Drag & Drop Injection Area at bottom */}
      <div
        onClick={onImportFile}
        className="p-2 border-t border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-[#1a1a1a]/50 text-center hover:bg-blue-50 dark:hover:bg-blue-950/20 cursor-pointer transition-colors"
      >
        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-blue-500" />
          {t.dropZone}
        </span>
      </div>

      {/* Right-click Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white dark:bg-[#222222] border border-neutral-200 dark:border-neutral-700 rounded-md shadow-2xl py-1 z-50 text-xs w-52"
          style={{ left: Math.min(contextMenu.x, window.innerWidth - 220), top: Math.min(contextMenu.y, window.innerHeight - 180) }}
        >
          <button
            onClick={() => {
              handleNavigateInto(contextMenu.file);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
            <span>{t.open}</span>
          </button>

          <button
            onClick={() => {
              onExportFile(contextMenu.file);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.export}</span>
          </button>

          <div className="h-[1px] bg-neutral-200 dark:bg-neutral-700 my-1" />

          <button
            onClick={() => {
              onDeleteFile(contextMenu.file);
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-red-600 hover:text-white text-red-600 dark:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.delete}</span>
          </button>
        </div>
      )}
    </div>
  );
};
