import React from 'react';
import {
  HardDrive,
  Disc,
  Flame,
  CheckCircle,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'es' | 'en';
}

export const AboutDialog: React.FC<AboutDialogProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 select-none text-xs">
      <div className="bg-white dark:bg-[#202020] border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-2xl max-w-md w-full flex flex-col overflow-hidden">
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white flex flex-col items-center text-center relative">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg border border-white/20 mb-3">
            <HardDrive className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">TransMac 11</h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Mac Disk &amp; DMG Manager for Windows 11
          </p>
          <span className="mt-2 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono font-medium">
            Versión 14.6 Pro (Build 2026.11)
          </span>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 text-xs text-neutral-700 dark:text-neutral-300">
          <p className="leading-relaxed">
            {lang === 'es'
              ? 'TransMac 11 permite leer y escribir unidades de disco, memorias USB, discos duros externos y archivos DMG formateados en Mac OS X / macOS (sistemas de archivos APFS y HFS+) directamente en Microsoft Windows 11.'
              : 'TransMac 11 allows reading and writing Mac-formatted hard drives, flash drives, and DMG images (HFS+ and APFS filesystems) natively on Microsoft Windows 11.'}
          </p>

          <div className="space-y-1.5 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>{lang === 'es' ? 'Lectura y escritura completa HFS+ (Mac OS Extended)' : 'Full HFS+ read and write support'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>{lang === 'es' ? 'Soporte de contenedores Apple APFS y mapas de objetos' : 'Apple APFS Container and object map support'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>{lang === 'es' ? 'Creación de USBs booteables con instaladores macOS (Sonoma, Ventura, etc.)' : 'Bootable USB creator for macOS DMG installers'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>{lang === 'es' ? 'Particionador GPT y APM con inyección UEFI Apple EFI' : 'GPT & APM partitioner with Apple EFI UEFI injection'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span>{lang === 'es' ? 'Inspector Hexadecimal de sectores LBA y superbloques' : 'LBA Hex Sector inspector & superblock explorer'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-100 dark:bg-[#1a1a1a] border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-[11px] text-neutral-400">
          <span>Licencia: Profesional Activada</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-xs"
          >
            {lang === 'es' ? 'Aceptar' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};
