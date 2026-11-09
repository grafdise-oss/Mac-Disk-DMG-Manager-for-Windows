import React from 'react';
import { 
  FolderSearch, 
  Disc, 
  Flame, 
  Cpu, 
  Sparkles, 
  Laptop, 
  ArrowRight, 
  X, 
  HelpCircle,
  HardDrive
} from 'lucide-react';

interface TaskSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTask: (task: 'explorer' | 'format' | 'mac_usb' | 'hackintosh_pc') => void;
  showOnStartup: boolean;
  onToggleShowOnStartup: () => void;
  lang: 'es' | 'en';
}

export const TaskSelectorModal: React.FC<TaskSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectTask,
  showOnStartup,
  onToggleShowOnStartup,
  lang = 'es'
}) => {
  if (!isOpen) return null;

  const tasks = [
    {
      id: 'explorer' as const,
      title: lang === 'es' ? '1. Visualizar y Gestionar Archivos Mac' : '1. Browse & Manage Mac Files',
      badge: lang === 'es' ? 'Sin Formatear' : 'Non-destructive',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: FolderSearch,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      description: lang === 'es'
        ? 'Explora particiones HFS+, APFS y copias de seguridad Time Machine. Abre y monta imágenes .DMG para copiar archivos entre Windows y Mac.'
        : 'Explore HFS+, APFS partitions and Time Machine volumes. Mount and browse .DMG images without altering data.',
      actionText: lang === 'es' ? 'Abrir Explorador Mac' : 'Open Mac Explorer'
    },
    {
      id: 'format' as const,
      title: lang === 'es' ? '2. Formatear Unidad USB para Mac' : '2. Format USB Drive for Mac',
      badge: lang === 'es' ? 'APFS / HFS+ / MBR' : 'APFS / HFS+ / MBR',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: Disc,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: lang === 'es'
        ? 'Prepara pendrives y discos externos con el sistema de archivos de Apple. Permite elegir esquema MBR (para Mac antiguo) o GPT (para Mac moderno).'
        : 'Format flash drives in APFS, HFS+ Journaled or exFAT with MBR or GPT partition scheme.',
      actionText: lang === 'es' ? 'Formatear USB' : 'Format USB'
    },
    {
      id: 'mac_usb' as const,
      title: lang === 'es' ? '3. Crear USB Booteable de macOS (Mac Original)' : '3. Create macOS Bootable USB (Apple Mac)',
      badge: lang === 'es' ? 'MacBook 2006-2024 • Tecla Alt' : 'MacBook 2006-2024 • Alt Key',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: Flame,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description: lang === 'es'
        ? 'Graba instaladores oficiales de Apple (Snow Leopard, Leopard, Lion, Sonoma, etc.). Incluye Modo MBR con Partición Activa (0x80) para arrancar MacBook 2008 con la tecla Alt.'
        : 'Burn official Apple installer images. Includes MBR Active flag 0x80 for 2008 MacBook Alt-boot.',
      actionText: lang === 'es' ? 'Crear USB para Mac' : 'Create Mac USB'
    },
    {
      id: 'hackintosh_pc' as const,
      title: lang === 'es' ? '4. Instalar macOS en PC (Hackintosh OpenCore)' : '4. Install macOS on PC (Hackintosh OpenCore)',
      badge: lang === 'es' ? '⭐ NUEVO • Detección PC & Drivers' : '⭐ NEW • Auto PC Detection',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      icon: Cpu,
      iconColor: 'text-purple-400 bg-purple-500/20 border-purple-500/40',
      description: lang === 'es'
        ? '¡Convierte tu PC Windows en un Mac! Escanea automáticamente tu CPU, GPU y placa base, te recomienda la mejor versión de macOS y genera la carpeta OpenCore EFI con todos los drivers (Lilu, VirtualSMC, WhateverGreen, AppleALC).'
        : 'Install macOS on any standard PC with OpenCore. Detects your hardware, recommends best OS and injects full Kext suite.',
      actionText: lang === 'es' ? 'Iniciar Creador Hackintosh PC' : 'Launch PC Hackintosh'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-selector-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="task-selector-title" className="text-lg font-bold text-white flex items-center gap-2">
                {lang === 'es' ? '¿Qué deseas hacer hoy en TransMac?' : 'What would you like to do in TransMac?'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'es'
                  ? 'Selecciona una tarea para abrir directamente el asistente correspondiente'
                  : 'Select an action to launch the appropriate wizard'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={lang === 'es' ? 'Cerrar' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Cards Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => {
              const Icon = task.icon;
              const isHackintosh = task.id === 'hackintosh_pc';

              return (
                <div
                  key={task.id}
                  onClick={() => {
                    onSelectTask(task.id);
                  }}
                  className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                    isHackintosh
                      ? 'bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border-purple-500/40 hover:border-purple-400 shadow-lg shadow-purple-900/20'
                      : 'bg-slate-800/60 border-slate-700/70 hover:border-blue-500/60 hover:bg-slate-800/90 shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl border ${task.iconColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${task.badgeColor}`}>
                        {task.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
                        {task.title}
                      </h3>
                      <p className="text-xs text-slate-300/80 mt-1.5 leading-relaxed">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs font-semibold">
                    <span className={isHackintosh ? 'text-purple-300' : 'text-blue-400'}>
                      {task.actionText}
                    </span>
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isHackintosh ? 'text-purple-400' : 'text-blue-400'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOnStartup}
              onChange={onToggleShowOnStartup}
              className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 focus:ring-offset-0"
            />
            <span>
              {lang === 'es' ? 'Mostrar este selector al abrir el programa' : 'Show this selector on startup'}
            </span>
          </label>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            {lang === 'es' ? 'Explorar TransMac' : 'Explore TransMac'}
          </button>
        </div>
      </div>
    </div>
  );
};
