import React, { useState } from 'react';
import { 
  Download, 
  HardDrive, 
  CheckCircle2, 
  Terminal, 
  FileCode, 
  ExternalLink, 
  X, 
  Sparkles,
  Info
} from 'lucide-react';

interface DownloadWindowsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'es' | 'en';
}

export const DownloadWindowsAppModal: React.FC<DownloadWindowsAppModalProps> = ({
  isOpen,
  onClose,
  lang = 'es'
}) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyCmd = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(id);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 id="download-modal-title" className="text-lg font-bold text-white flex items-center gap-2">
                {lang === 'es' 
                  ? 'Descargar TransMac 11 Nativo para Windows 11' 
                  : 'Download TransMac 11 Native for Windows 11'}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Acceso a Discos Físicos Reales
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'es'
                  ? 'Lee automáticamente las letras de unidad (D:, E:, F:) y graba en el sector LBA 0 físico de tu PC.'
                  : 'Scans real Windows drive letters (D:, E:, F:) and writes directly to physical LBA 0.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={lang === 'es' ? 'Cerrar' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Explanation Box */}
          <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-600/40 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/90 space-y-1">
              <p className="font-semibold text-amber-200">
                {lang === 'es' 
                  ? '¿Por qué en el navegador web no se leen tus discos automáticamente?'
                  : 'Why cannot a web browser scan your physical drives silently?'}
              </p>
              <p>
                {lang === 'es'
                  ? 'Por seguridad de Windows, los navegadores (Chrome, Edge, Firefox) tienen estrictamente prohibido escanear la lista de discos físicos (C:, D:, E:) o escribir en el sector LBA 0 de tu hardware sin un programa ejecutable con permisos de Administrador. Para interactuar directamente con tu pendrive real, descarga esta herramienta nativa:'
                  : 'Due to Windows security sandboxing, web browsers are strictly isolated from querying raw SCSI/USB disk geometry or modifying sector 0 without an elevated desktop binary.'}
              </p>
            </div>
          </div>

          {/* Download Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option 1: Standalone Portable .BAT */}
            <div className="p-5 rounded-xl bg-slate-800/80 border-2 border-blue-500/60 hover:border-blue-400 transition-all flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                ⭐ Más Rápido (1 Clic)
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-600/20 text-blue-400">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">TransMac Portátil (.BAT)</h3>
                    <p className="text-xs text-blue-300 font-mono">TransMac_Portatil.bat (19 KB)</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'es'
                    ? 'Un único archivo ejecutable. Lo descargas, haces doble clic (o clic derecho > "Ejecutar como administrador") y se abre de inmediato la interfaz gráfica nativa de TransMac 11 en tu escritorio de Windows 11. No requiere descomprimir nada.'
                    : 'A single self-contained executable file. Just download and double click to run TransMac desktop app.'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Detección automática de pendrives USB reales</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Protección del disco C:\ de Windows</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Esquema MBR con Partición Activa (0x80) para MacBook 2008</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-700/60">
                <a
                  href="/downloads/TransMac_Portatil.bat"
                  download="TransMac_Portatil.bat"
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  {lang === 'es' ? 'Descargar TransMac_Portatil.bat' : 'Download Portable .BAT'}
                </a>
              </div>
            </div>

            {/* Option 2: Complete ZIP Package */}
            <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-600/20 text-emerald-400">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Paquete Completo Windows (.ZIP)</h3>
                    <p className="text-xs text-emerald-300 font-mono">TransMac_Windows11_Desktop.zip (45 KB)</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'es'
                    ? 'Contiene el script nativo de PowerShell (TransMac_GUI.ps1), el lanzador con elevación de permisos (TransMac_Win11.bat) y la guía detallada de instrucciones (LEEME_INSTRUCCIONES.txt).'
                    : 'Contains the complete suite: PowerShell GUI, Administrator batch launcher, and instructions.'}
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-[11px] space-y-1 font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-blue-400" />
                    <span>TransMac_GUI.ps1 (Interfaz Windows Forms)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>TransMac_Win11.bat (Lanzador con Elevación)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    <span>LEEME_INSTRUCCIONES.txt (Manual en Español)</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-700/60">
                <a
                  href="/downloads/TransMac_Windows11_Desktop.zip"
                  download="TransMac_Windows11_Desktop.zip"
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  {lang === 'es' ? 'Descargar Paquete ZIP Completo' : 'Download Full ZIP Package'}
                </a>
              </div>
            </div>
          </div>

          {/* Quick 3-Step Guide */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {lang === 'es' ? 'Cómo usar el programa en tu ordenador Windows 11:' : 'How to run on Windows 11:'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-blue-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">1</span>
                  {lang === 'es' ? 'Descargar y Ejecutar' : 'Download & Run'}
                </div>
                <p className="text-slate-400 text-[11px]">
                  {lang === 'es'
                    ? 'Haz clic derecho sobre TransMac_Portatil.bat y selecciona "Ejecutar como administrador".'
                    : 'Right click TransMac_Portatil.bat and select Run as Administrator.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">2</span>
                  {lang === 'es' ? 'Seleccionar tu USB' : 'Select your USB'}
                </div>
                <p className="text-slate-400 text-[11px]">
                  {lang === 'es'
                    ? 'Tu pendrive físico (D:, E:, F:) aparecerá automáticamente en la lista con su tamaño real.'
                    : 'Your real USB stick will appear in the dropdown with its real Windows drive letter.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">3</span>
                  {lang === 'es' ? 'Grabar y Arrancar (Alt)' : 'Burn & Boot (Alt)'}
                </div>
                <p className="text-slate-400 text-[11px]">
                  {lang === 'es'
                    ? 'Elige Snow Leopard, MBR Activo y pulsa Grabar. Luego arranca tu MacBook 2008 pulsando la tecla Alt.'
                    : 'Choose Snow Leopard, MBR Active, and burn. Then boot MacBook 2008 with Alt key.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {lang === 'es'
              ? 'Compatible con Windows 11, Windows 10 y Windows Server (PowerShell nativo).'
              : 'Compatible with Windows 11, 10 and Server.'}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            {lang === 'es' ? 'Cerrar' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
