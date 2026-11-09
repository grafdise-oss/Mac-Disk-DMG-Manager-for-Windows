import React from 'react';
import { Minus, Square, X, HardDrive, Moon, Sun, Languages, HelpCircle } from 'lucide-react';
import { MacDisk, MacPartition } from '../utils/macDiskEngine';

interface TitleBarProps {
  currentDisk: MacDisk | null;
  currentPartition: MacPartition | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  lang: 'es' | 'en';
  onToggleLang: () => void;
  onOpenAbout: () => void;
  onOpenDownloadApp: () => void;
  onOpenTaskSelector?: () => void;
  onOpenHackintosh?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  currentDisk,
  currentPartition,
  isDarkMode,
  onToggleDarkMode,
  lang,
  onToggleLang,
  onOpenAbout,
  onOpenDownloadApp,
  onOpenTaskSelector,
  onOpenHackintosh
}) => {
  const diskTitle = currentDisk
    ? `[Unidad ${currentDisk.driveNumber}: ${currentDisk.model} - ${currentPartition ? `${currentPartition.label} (${currentPartition.fileSystem})` : currentDisk.partitionScheme}]`
    : `[Sin unidad seleccionada]`;

  return (
    <header className="h-10 w-full select-none flex items-center justify-between px-3 border-b transition-colors bg-white dark:bg-[#1f1f1f] border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200">
      {/* Left: Window Identity & Title */}
      <div className="flex items-center gap-2 overflow-hidden mr-4">
        <div className="w-5 h-5 rounded flex items-center justify-center bg-blue-600 text-white shadow-sm flex-shrink-0">
          <HardDrive className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-semibold tracking-wide text-neutral-900 dark:text-white flex-shrink-0">
          TransMac 11
        </span>
        <span className="text-xs text-neutral-400 dark:text-neutral-500 font-normal">|</span>
        <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate font-mono">
          {diskTitle}
        </span>
      </div>

      {/* Right: Quick actions & Window Controls */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {onOpenTaskSelector && (
          <button
            onClick={onOpenTaskSelector}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
            title={lang === 'es' ? 'Selector de Tareas de Inicio' : 'Startup Task Selector'}
          >
            <span>🚀 {lang === 'es' ? 'Tareas' : 'Tasks'}</span>
          </button>
        )}

        {onOpenHackintosh && (
          <button
            onClick={onOpenHackintosh}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-purple-600/20 hover:bg-purple-600/30 text-purple-600 dark:text-purple-300 border border-purple-500/30 transition-colors cursor-pointer"
            title={lang === 'es' ? 'Crear USB Hackintosh para PC con OpenCore' : 'Create PC Hackintosh USB with OpenCore'}
          >
            <span>💻 Hackintosh PC</span>
          </button>
        )}

        {/* Prominent Native App Download Button */}
        <button
          onClick={onOpenDownloadApp}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all animate-pulse hover:animate-none cursor-pointer"
          title={lang === 'es' ? 'Descargar aplicación nativa para Windows 11 (lectura de discos físicos)' : 'Download native Windows 11 app'}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>{lang === 'es' ? '📥 Descargar para Windows 11' : '📥 Download for Windows 11'}</span>
        </button>

        {/* Language switch */}
        <button
          onClick={onToggleLang}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
          title={lang === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'}
          aria-label="Cambiar idioma"
        >
          <Languages className="w-3.5 h-3.5" />
          <span className="font-semibold uppercase">{lang}</span>
        </button>

        {/* Dark/Light mode */}
        <button
          onClick={onToggleDarkMode}
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
          title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
          aria-label="Cambiar modo claro u oscuro"
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Help / About quick button */}
        <button
          onClick={onOpenAbout}
          className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
          title={lang === 'es' ? 'Acerca de TransMac' : 'About TransMac'}
          aria-label="Acerca de TransMac"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-neutral-300 dark:bg-neutral-700 mx-1" />

        {/* Windows 11 Standard Window Controls */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
          title="Minimizar"
          aria-label="Minimizar ventana"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
          title="Maximizar"
          aria-label="Maximizar ventana"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-600 hover:text-white text-neutral-600 dark:text-neutral-400 transition-colors"
          title="Cerrar"
          aria-label="Cerrar ventana"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
