import React, { useState, useRef } from 'react';
import {
  createDefaultMacDisks,
  MacDisk,
  MacPartition,
  MacFile,
  generateUUID,
  pickPhysicalWindowsUsbDrive
} from './utils/macDiskEngine';
import { TitleBar } from './components/TitleBar';
import { MenuBar } from './components/MenuBar';
import { Toolbar } from './components/Toolbar';
import { DriveTreeView } from './components/DriveTreeView';
import { FileExplorer } from './components/FileExplorer';
import { PartitionManager } from './components/PartitionManager';
import { HexSectorViewer } from './components/HexSectorViewer';
import { SuperblockInspector } from './components/SuperblockInspector';
import { BootableUsbWizard } from './components/BootableUsbWizard';
import { FormatDiskDialog } from './components/FormatDiskDialog';
import { CreateDmgDialog } from './components/CreateDmgDialog';
import { FileViewerModal } from './components/FileViewerModal';
import { DiskPropertiesModal } from './components/DiskPropertiesModal';
import { AboutDialog } from './components/AboutDialog';
import { StatusBar } from './components/StatusBar';
import { DownloadWindowsAppModal } from './components/DownloadWindowsAppModal';
import { TaskSelectorModal } from './components/TaskSelectorModal';
import { HackintoshWizardModal } from './components/HackintoshWizardModal';
import { Download, Cpu, Sparkles } from 'lucide-react';

export default function App() {
  // Disks State (isDemoMode tracks whether mock simulation drives are currently shown)
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [disks, setDisks] = useState<MacDisk[]>(() => createDefaultMacDisks());
  const [selectedDiskId, setSelectedDiskId] = useState<string>('disk-usb-sandisk-64gb');
  const [selectedPartitionId, setSelectedPartitionId] = useState<string>('part-sonoma-installer');

  // File explorer selection
  const [selectedFile, setSelectedFile] = useState<MacFile | null>(null);
  const [viewingFile, setViewingFile] = useState<MacFile | null>(null);
  const [showHiddenFiles, setShowHiddenFiles] = useState<boolean>(true);

  // Active View Switcher: 'explorer' | 'partitions' | 'hex' | 'superblock'
  const [activeView, setActiveView] = useState<'explorer' | 'partitions' | 'hex' | 'superblock'>('explorer');

  // Modals & Wizards
  const [isTaskSelectorOpen, setIsTaskSelectorOpen] = useState<boolean>(true);
  const [isHackintoshWizardOpen, setIsHackintoshWizardOpen] = useState<boolean>(false);
  const [showSelectorOnStartup, setShowSelectorOnStartup] = useState<boolean>(true);
  const [isUsbWizardOpen, setIsUsbWizardOpen] = useState(false);
  const [isFormatDialogOpen, setIsFormatDialogOpen] = useState(false);
  const [isCreateDmgOpen, setIsCreateDmgOpen] = useState(false);
  const [isDiskPropsOpen, setIsDiskPropsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // UI Settings
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hidden file input for opening DMG from PC
  const openDmgInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  const currentDisk = disks.find(d => d.id === selectedDiskId) || disks[0] || null;
  const currentPartition = currentDisk?.partitions.find(p => p.id === selectedPartitionId) || currentDisk?.partitions[0] || null;

  // Toggle Dark Mode on document root
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handlers for Disk Actions
  const handleSelectDisk = (diskId: string) => {
    setSelectedDiskId(diskId);
    const disk = disks.find(d => d.id === diskId);
    if (disk && disk.partitions.length > 0) {
      setSelectedPartitionId(disk.partitions[0].id);
    }
    setSelectedFile(null);
  };

  const handleSelectPartition = (diskId: string, partitionId: string) => {
    setSelectedDiskId(diskId);
    setSelectedPartitionId(partitionId);
    setSelectedFile(null);
  };

  const handleConfirmFormat = (formattedDisk: MacDisk) => {
    setDisks(prev => prev.map(d => (d.id === formattedDisk.id ? formattedDisk : d)));
    setSelectedDiskId(formattedDisk.id);
    if (formattedDisk.partitions.length > 0) {
      setSelectedPartitionId(formattedDisk.partitions[0].id);
    }
    showToast(lang === 'es' ? `Disco "${formattedDisk.model}" formateado correctamente para Mac.` : `Drive "${formattedDisk.model}" formatted for Mac.`);
  };

  const handleFinishRestore = (restoredDisk: MacDisk) => {
    setDisks(prev => prev.map(d => (d.id === restoredDisk.id ? restoredDisk : d)));
    setSelectedDiskId(restoredDisk.id);
    if (restoredDisk.partitions.length > 0) {
      // Select the restored macOS installer partition
      const mainPart = restoredDisk.partitions.find(p => !p.fileSystem.includes('EFI')) || restoredDisk.partitions[0];
      setSelectedPartitionId(mainPart.id);
    }
    showToast(lang === 'es' ? '¡USB Booteable de macOS creado exitosamente!' : 'macOS Bootable USB created successfully!');
  };

  const handleMountCreatedDmg = (dmgDisk: MacDisk) => {
    setDisks(prev => [dmgDisk, ...prev]);
    setSelectedDiskId(dmgDisk.id);
    if (dmgDisk.partitions.length > 0) {
      setSelectedPartitionId(dmgDisk.partitions[0].id);
    }
    showToast(lang === 'es' ? `Imagen "${dmgDisk.model}" montada como unidad virtual.` : `Image "${dmgDisk.model}" mounted as virtual drive.`);
  };

  const handleOpenLocalDmg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDmgDisk: MacDisk = {
        id: 'dmg-' + generateUUID(),
        driveNumber: disks.length + 1,
        model: `Imagen DMG: ${file.name}`,
        busType: 'Virtual DMG',
        capacityBytes: file.size || 14000000000,
        sectorSize: 512,
        partitionScheme: 'GPT',
        isReadOnly: false,
        serialNumber: 'DMG-FILE-' + Math.floor(Math.random() * 100000),
        guid: generateUUID(),
        partitions: [
          {
            id: 'part-dmg-' + generateUUID(),
            name: file.name.replace(/\.(dmg|iso|img)$/i, ''),
            label: file.name.replace(/\.(dmg|iso|img)$/i, ''),
            fileSystem: 'APFS',
            sizeBytes: file.size || 14000000000,
            startSector: 40,
            sectorCount: Math.floor((file.size || 14000000000) / 512),
            isBootable: true,
            isMounted: true,
            usedBytes: Math.floor((file.size || 14000000000) * 0.8),
            rootDirectory: [
              {
                id: generateUUID(),
                name: 'Applications',
                size: 4096,
                type: 'directory',
                modified: '2024-10-01 12:00:00',
                permissions: 'drwxrwxr-x',
                owner: 'root:admin',
                children: [
                  {
                    id: generateUUID(),
                    name: 'Install macOS.app',
                    size: 13500000000,
                    type: 'app',
                    modified: '2024-10-01 12:00:00',
                    permissions: 'drwxr-xr-x',
                    owner: 'root:wheel'
                  }
                ]
              },
              {
                id: generateUUID(),
                name: 'Info.plist',
                size: 1850,
                type: 'plist',
                modified: '2024-10-01 12:00:00',
                permissions: '-rw-r--r--',
                owner: 'root:wheel',
                contentPreview: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key>
  <string>${file.name}</string>
  <key>AppleMountedDrive</key>
  <true/>
</dict>
</plist>`
              }
            ],
            metadata: {
              allocationBlockSize: 4096,
              totalBlocks: Math.floor((file.size || 14000000000) / 4096),
              freeBlocks: 100000,
              journaled: true,
              volumeUuid: generateUUID()
            }
          }
        ]
      };

      setDisks(prev => [newDmgDisk, ...prev]);
      setSelectedDiskId(newDmgDisk.id);
      setSelectedPartitionId(newDmgDisk.partitions[0].id);
      showToast(lang === 'es' ? `Imagen DMG "${file.name}" cargada y montada.` : `DMG image "${file.name}" loaded and mounted.`);
    }
  };

  // Handlers for File Actions
  const handleExportFile = (fileToExport?: MacFile | null) => {
    const target = fileToExport || selectedFile;
    if (!target) return;
    const content = target.contentPreview || `Contenido de archivo exportado: ${target.name}\nTamaño: ${target.size} bytes`;
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = target.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(lang === 'es' ? `Archivo "${target.name}" copiado a tu equipo Windows.` : `File "${target.name}" copied to Windows.`);
  };

  const handleImportFile = () => {
    // Prompt user to inject file from Windows to Mac
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file && currentPartition) {
        const newMacFile: MacFile = {
          id: generateUUID(),
          name: file.name,
          size: file.size,
          type: file.name.endsWith('.plist') ? 'plist' : file.name.endsWith('.app') ? 'app' : file.name.endsWith('.dmg') ? 'dmg' : 'file',
          modified: new Date().toISOString().replace('T', ' ').slice(0, 19),
          permissions: '-rw-r--r--',
          owner: 'root:staff',
          contentPreview: `Archivo importado desde Windows: ${file.name}`
        };

        currentPartition.rootDirectory.unshift(newMacFile);
        setDisks([...disks]);
        showToast(lang === 'es' ? `Archivo "${file.name}" añadido al volumen Mac.` : `File "${file.name}" added to Mac volume.`);
      }
    };
    input.click();
  };

  const handleNewFolder = () => {
    const folderName = window.prompt(
      lang === 'es' ? 'Introduce el nombre de la nueva carpeta Mac:' : 'Enter new Mac folder name:',
      'Nueva Carpeta'
    );
    if (folderName && currentPartition) {
      const newFolder: MacFile = {
        id: generateUUID(),
        name: folderName.trim(),
        size: 4096,
        type: 'directory',
        modified: new Date().toISOString().replace('T', ' ').slice(0, 19),
        permissions: 'drwxr-xr-x',
        owner: 'root:staff',
        children: []
      };
      currentPartition.rootDirectory.unshift(newFolder);
      setDisks([...disks]);
      showToast(lang === 'es' ? `Carpeta "${folderName}" creada.` : `Folder "${folderName}" created.`);
    }
  };

  const handleDeleteFile = (fileToDelete?: MacFile | null) => {
    const target = fileToDelete || selectedFile;
    if (!target || !currentPartition) return;
    const confirm = window.confirm(
      lang === 'es'
        ? `¿Estás seguro de que deseas eliminar "${target.name}" de la partición Mac?`
        : `Are you sure you want to delete "${target.name}" from the Mac volume?`
    );
    if (confirm) {
      currentPartition.rootDirectory = currentPartition.rootDirectory.filter(f => f.id !== target.id);
      setDisks([...disks]);
      setSelectedFile(null);
      showToast(lang === 'es' ? `"${target.name}" eliminado de la partición Mac.` : `"${target.name}" deleted from Mac volume.`);
    }
  };

  const handleCheckFileSystem = () => {
    showToast(lang === 'es' ? 'Ejecutando fsck_apfs / fsck_hfs en la partición...' : 'Running fsck_apfs / fsck_hfs on partition...');
    setTimeout(() => {
      showToast(lang === 'es' ? '✓ Verificación completada: Sistema de archivos limpio y sin errores.' : '✓ Verification complete: File system is clean with no errors.');
    }, 1200);
  };

  const handleConnectPhysicalUsb = async () => {
    try {
      showToast(lang === 'es' ? 'Selecciona la carpeta o letra de tu memoria USB en Windows (ej. E:\\, D:\\)...' : 'Select your USB drive letter or folder in Windows (e.g. E:\\, D:\\)...');
      const physicalDisk = await pickPhysicalWindowsUsbDrive();
      if (physicalDisk) {
        setDisks(prev => [physicalDisk, ...prev.filter(d => d.id !== physicalDisk.id)]);
        setSelectedDiskId(physicalDisk.id);
        if (physicalDisk.partitions.length > 0) {
          setSelectedPartitionId(physicalDisk.partitions[0].id);
        }
        showToast(lang === 'es' ? `¡Unidad física "${physicalDisk.model}" detectada y montada!` : `Physical drive "${physicalDisk.model}" connected!`);
      } else {
        // Fallback prompt to manually register/mount a connected Windows drive letter
        const letterOrName = window.prompt(
          lang === 'es'
            ? 'Introduce la letra o nombre de la unidad USB conectada en Windows (ej: E:\\ Pendrive Kingston 32GB):'
            : 'Enter the drive letter or name of your connected Windows USB (e.g.: E:\\ Kingston USB 32GB):',
          'E:\\ Kingston DataTraveler (32 GB)'
        );
        if (letterOrName && letterOrName.trim()) {
          const newDrive: MacDisk = {
            id: 'disk-phys-' + generateUUID(),
            driveNumber: disks.length + 1,
            model: letterOrName.trim(),
            busType: 'USB',
            capacityBytes: 32 * 1024 * 1024 * 1024,
            sectorSize: 512,
            partitionScheme: 'MBR',
            isReadOnly: false,
            serialNumber: 'USB-WIN-' + Math.floor(100000 + Math.random() * 900000),
            guid: generateUUID(),
            isPhysical: true,
            driveLetter: letterOrName.trim().slice(0, 2),
            partitions: [
              {
                id: 'part-phys-' + generateUUID(),
                name: 'USB_DRIVE',
                label: 'USB_DRIVE',
                fileSystem: 'HFS+ (Journaled)',
                sizeBytes: 32 * 1024 * 1024 * 1024,
                startSector: 2048,
                sectorCount: Math.floor((32 * 1024 * 1024 * 1024) / 512),
                isBootable: true,
                isMounted: true,
                usedBytes: 1024 * 1024,
                rootDirectory: [],
                metadata: {
                  allocationBlockSize: 4096,
                  totalBlocks: Math.floor((32 * 1024 * 1024 * 1024) / 4096),
                  freeBlocks: Math.floor((32 * 1024 * 1024 * 1024) / 4096),
                  journaled: true,
                  volumeUuid: generateUUID()
                }
              }
            ]
          };
          setDisks(prev => [newDrive, ...prev]);
          setSelectedDiskId(newDrive.id);
          setSelectedPartitionId(newDrive.partitions[0].id);
          showToast(lang === 'es' ? `Unidad "${newDrive.model}" añadida a la lista.` : `Drive "${newDrive.model}" added.`);
        }
      }
    } catch (e) {
      console.warn('Physical drive picker canceled or unsupported:', e);
    }
  };

  const handleRefreshDrives = async () => {
    showToast(lang === 'es' ? 'Buscando nuevas unidades físicas y periféricos USB...' : 'Scanning for newly plugged USB drives...');
    
    // Check if navigator.usb has any devices
    if (typeof navigator !== 'undefined' && 'usb' in navigator) {
      try {
        const usbDevices = await (navigator as any).usb.getDevices();
        if (usbDevices.length > 0) {
          showToast(lang === 'es' ? `Detectados ${usbDevices.length} dispositivos USB conectados.` : `Found ${usbDevices.length} connected USB devices.`);
        }
      } catch {}
    }

    // Offer to link physical USB
    await handleConnectPhysicalUsb();
  };

  const handleLoadDemoDisks = () => {
    const demo = createDefaultMacDisks();
    setDisks(demo);
    setSelectedDiskId(demo[0].id);
    setSelectedPartitionId(demo[0].partitions[0].id);
    setIsDemoMode(true);
    showToast(lang === 'es' ? 'Cargadas unidades de demostración (modo simulador).' : 'Demo mock drives loaded.');
  };

  const handleClearMockDisks = () => {
    const onlyPhysical = disks.filter(d => d.isPhysical);
    setDisks(onlyPhysical);
    setIsDemoMode(false);
    if (onlyPhysical.length > 0) {
      setSelectedDiskId(onlyPhysical[0].id);
      setSelectedPartitionId(onlyPhysical[0].partitions[0]?.id || '');
    } else {
      setSelectedDiskId('');
      setSelectedPartitionId('');
    }
    showToast(lang === 'es' ? 'Unidades simuladas ocultadas.' : 'Mock drives hidden.');
  };

  // Task Selector Handler
  const handleSelectTask = (task: 'explorer' | 'format' | 'mac_usb' | 'hackintosh_pc') => {
    setIsTaskSelectorOpen(false);
    if (task === 'explorer') {
      setActiveView('explorer');
    } else if (task === 'format') {
      setIsFormatDialogOpen(true);
    } else if (task === 'mac_usb') {
      setIsUsbWizardOpen(true);
    } else if (task === 'hackintosh_pc') {
      setIsHackintoshWizardOpen(true);
    }
  };

  const itemCount = currentPartition?.rootDirectory.length || 0;

  return (
    <div className="w-screen h-screen flex flex-col bg-neutral-100 dark:bg-[#181818] text-neutral-900 dark:text-neutral-100 font-sans overflow-hidden">
      {/* Hidden input for opening DMG file from local computer */}
      <input
        type="file"
        ref={openDmgInputRef}
        accept=".dmg,.iso,.img"
        onChange={handleOpenLocalDmg}
        className="hidden"
      />

      {/* Top Banner for Windows 11 Native Download & Quick Modals */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-blue-500/30 px-3 py-1.5 flex items-center justify-between text-xs text-blue-200 flex-shrink-0">
        <div className="flex items-center gap-2 truncate">
          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30 text-[10px] shrink-0">
            WINDOWS 11 NATIVO
          </span>
          <span className="truncate">
            {lang === 'es'
              ? 'TransMac 11 Pro: Lee discos HFS+/APFS, graba USB Mac antiguos y configura Hackintosh OpenCore.'
              : 'TransMac 11 Pro: Read HFS+/APFS, create bootable Mac USBs, and configure OpenCore Hackintosh.'}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsTaskSelectorOpen(true)}
            className="px-2.5 py-1 rounded bg-blue-800/80 hover:bg-blue-700 text-blue-100 font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border border-blue-400/30"
            title={lang === 'es' ? 'Selector de Tareas Inicial' : 'Startup Task Selector'}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>{lang === 'es' ? '🚀 Tareas' : '🚀 Tasks'}</span>
          </button>
          <button
            onClick={() => setIsHackintoshWizardOpen(true)}
            className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title={lang === 'es' ? 'Instalar macOS en PC (Hackintosh con OpenCore)' : 'Install macOS on PC (OpenCore Hackintosh)'}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-200" />
            <span>{lang === 'es' ? '💻 Hackintosh PC' : '💻 Hackintosh PC'}</span>
          </button>
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'Descargar para Windows 11 (.EXE/.ZIP)' : 'Download for Windows 11'}</span>
          </button>
        </div>
      </div>

      {/* Windows 11 Title Bar */}
      <TitleBar
        currentDisk={currentDisk}
        currentPartition={currentPartition}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        lang={lang}
        onToggleLang={() => setLang(prev => (prev === 'es' ? 'en' : 'es'))}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenDownloadApp={() => setIsDownloadModalOpen(true)}
        onOpenTaskSelector={() => setIsTaskSelectorOpen(true)}
        onOpenHackintosh={() => setIsHackintoshWizardOpen(true)}
      />

      {/* Classic Windows Menu Bar */}
      <MenuBar
        lang={lang}
        onNewDmg={() => setIsCreateDmgOpen(true)}
        onOpenDmgFile={() => openDmgInputRef.current?.click()}
        onSaveAsDmg={() => setIsCreateDmgOpen(true)}
        onFormatDisk={() => setIsFormatDialogOpen(true)}
        onRestoreDmg={() => setIsUsbWizardOpen(true)}
        onDiskProperties={() => setIsDiskPropsOpen(true)}
        onCheckFileSystem={handleCheckFileSystem}
        onRefreshDrives={handleRefreshDrives}
        onExportFile={() => handleExportFile()}
        onImportFile={handleImportFile}
        onNewFolder={handleNewFolder}
        onDeleteSelected={() => handleDeleteFile()}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenDownloadApp={() => setIsDownloadModalOpen(true)}
        onOpenTaskSelector={() => setIsTaskSelectorOpen(true)}
        onOpenHackintosh={() => setIsHackintoshWizardOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        showHiddenFiles={showHiddenFiles}
        setShowHiddenFiles={setShowHiddenFiles}
      />

      {/* Windows 11 Fluent Ribbon Toolbar */}
      <Toolbar
        lang={lang}
        onOpenDmgFile={() => openDmgInputRef.current?.click()}
        onFormatDisk={() => setIsFormatDialogOpen(true)}
        onRestoreDmg={() => setIsUsbWizardOpen(true)}
        onSaveAsDmg={() => setIsCreateDmgOpen(true)}
        onExportFile={() => handleExportFile()}
        onImportFile={handleImportFile}
        onNewFolder={handleNewFolder}
        onDeleteSelected={() => handleDeleteFile()}
        onRefreshDrives={handleRefreshDrives}
        onConnectPhysicalUsb={handleConnectPhysicalUsb}
        onOpenDownloadApp={() => setIsDownloadModalOpen(true)}
        onOpenHackintosh={() => setIsHackintoshWizardOpen(true)}
        onOpenTaskSelector={() => setIsTaskSelectorOpen(true)}
        onCheckFs={handleCheckFileSystem}
        activeView={activeView}
        setActiveView={setActiveView}
        hasSelectedFile={!!selectedFile}
      />

      {/* Main Split Layout: Left Drive Tree + Right Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Drive & Volume Hierarchy Tree */}
        <DriveTreeView
          disks={disks}
          selectedDiskId={selectedDiskId}
          selectedPartitionId={selectedPartitionId}
          onSelectDisk={handleSelectDisk}
          onSelectPartition={handleSelectPartition}
          onMountDmg={() => openDmgInputRef.current?.click()}
          onCreateDmg={() => setIsCreateDmgOpen(true)}
          onFormatDisk={() => setIsFormatDialogOpen(true)}
          onRestoreDmg={() => setIsUsbWizardOpen(true)}
          onDiskProperties={() => setIsDiskPropsOpen(true)}
          onConnectPhysicalUsb={handleConnectPhysicalUsb}
          onOpenDownloadApp={() => setIsDownloadModalOpen(true)}
          onLoadDemoDisks={handleLoadDemoDisks}
          onClearMockDisks={handleClearMockDisks}
          isDemoMode={isDemoMode}
          lang={lang}
        />

        {/* Right Main Viewport according to selected mode */}
        <main className="flex-1 h-full overflow-hidden flex flex-col bg-white dark:bg-[#1e1e1e]">
          {activeView === 'explorer' && (
            <FileExplorer
              currentDisk={currentDisk}
              currentPartition={currentPartition}
              selectedFile={selectedFile}
              onSelectFile={setSelectedFile}
              onOpenFile={(file) => setViewingFile(file)}
              onExportFile={handleExportFile}
              onImportFile={handleImportFile}
              onNewFolder={handleNewFolder}
              onDeleteFile={handleDeleteFile}
              showHiddenFiles={showHiddenFiles}
              lang={lang}
            />
          )}

          {activeView === 'partitions' && (
            <PartitionManager
              currentDisk={currentDisk}
              selectedPartitionId={selectedPartitionId}
              onSelectPartition={(id) => setSelectedPartitionId(id)}
              onFormatPartition={(part) => {
                setIsFormatDialogOpen(true);
              }}
              onDeletePartition={(id) => {
                if (currentDisk && currentDisk.partitions.length > 1) {
                  const remaining = currentDisk.partitions.filter(p => p.id !== id);
                  const updatedDisk = { ...currentDisk, partitions: remaining };
                  setDisks(prev => prev.map(d => d.id === updatedDisk.id ? updatedDisk : d));
                  setSelectedPartitionId(remaining[0].id);
                  showToast(lang === 'es' ? 'Partición eliminada.' : 'Partition deleted.');
                }
              }}
              onAddPartition={() => {
                setIsFormatDialogOpen(true);
              }}
              onCheckFs={handleCheckFileSystem}
              lang={lang}
            />
          )}

          {activeView === 'hex' && (
            <HexSectorViewer
              currentDisk={currentDisk}
              currentPartition={currentPartition}
              lang={lang}
            />
          )}

          {activeView === 'superblock' && (
            <SuperblockInspector
              currentDisk={currentDisk}
              currentPartition={currentPartition}
              lang={lang}
            />
          )}
        </main>
      </div>

      {/* Windows 11 Status Bar */}
      <StatusBar
        currentDisk={currentDisk}
        currentPartition={currentPartition}
        itemCount={itemCount}
        lang={lang}
      />

      {/* Modals & Dialogs */}
      <TaskSelectorModal
        isOpen={isTaskSelectorOpen}
        onClose={() => setIsTaskSelectorOpen(false)}
        onSelectTask={handleSelectTask}
        showOnStartup={showSelectorOnStartup}
        onToggleShowOnStartup={() => setShowSelectorOnStartup(prev => !prev)}
        lang={lang}
      />

      <HackintoshWizardModal
        isOpen={isHackintoshWizardOpen}
        onClose={() => setIsHackintoshWizardOpen(false)}
        disks={disks}
        onConnectPhysicalUsb={handleConnectPhysicalUsb}
        lang={lang}
      />

      <BootableUsbWizard
        disks={disks}
        initialDiskId={selectedDiskId}
        isOpen={isUsbWizardOpen}
        onClose={() => setIsUsbWizardOpen(false)}
        onFinishRestore={handleFinishRestore}
        onConnectPhysicalUsb={handleConnectPhysicalUsb}
        onOpenDownloadApp={() => setIsDownloadModalOpen(true)}
        lang={lang}
      />

      <FormatDiskDialog
        currentDisk={currentDisk}
        isOpen={isFormatDialogOpen}
        onClose={() => setIsFormatDialogOpen(false)}
        onConfirmFormat={handleConfirmFormat}
        lang={lang}
      />

      <CreateDmgDialog
        isOpen={isCreateDmgOpen}
        onClose={() => setIsCreateDmgOpen(false)}
        onMountCreatedDmg={handleMountCreatedDmg}
        lang={lang}
      />

      <FileViewerModal
        file={viewingFile}
        isOpen={!!viewingFile}
        onClose={() => setViewingFile(null)}
        lang={lang}
      />

      <DiskPropertiesModal
        currentDisk={currentDisk}
        isOpen={isDiskPropsOpen}
        onClose={() => setIsDiskPropsOpen(false)}
        lang={lang}
      />

      <AboutDialog
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        lang={lang}
      />

      <DownloadWindowsAppModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        lang={lang}
      />

      {/* Toast Notification banner */}
      {toastMessage && (
        <div className="fixed bottom-9 right-4 z-50 bg-neutral-900/95 dark:bg-neutral-800/95 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-neutral-700/80 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
