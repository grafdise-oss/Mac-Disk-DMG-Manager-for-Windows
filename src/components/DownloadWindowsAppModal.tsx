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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Option 1: Official Windows Installer */}
            <div className="p-5 rounded-xl bg-slate-800/90 border-2 border-emerald-500/70 hover:border-emerald-400 transition-all flex flex-col justify-between group relative overflow-hidden shadow-lg shadow-emerald-900/20">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                ⭐ Instalador Automático
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-600/20 text-emerald-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Instalador TransMac 11</h3>
                    <p className="text-xs text-emerald-300 font-mono">Instalador_TransMac_11.bat</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'es'
                    ? 'Instala la aplicación en tu sistema y crea un acceso directo en tu Escritorio de Windows 11 para abrir el programa en cualquier momento.'
                    : 'Installs TransMac to AppData and creates a Desktop shortcut.'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Crea icono en el Escritorio de Windows</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Desbloqueo automático de permisos UAC</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => {
                    const url = `/downloads/Instalador_TransMac_11.bat?t=${Date.now()}`;
                    fetch(url)
                      .then(res => res.blob())
                      .then(blob => {
                        const blobUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.download = 'Instalador_TransMac_11.bat';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(blobUrl);
                      })
                      .catch(() => { window.location.href = url; });
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  {lang === 'es' ? 'Descargar Instalador' : 'Download Installer'}
                </button>
              </div>
            </div>

            {/* Option 2: Standalone Portable .BAT */}
            <div className="p-5 rounded-xl bg-slate-800/80 border border-blue-500/50 hover:border-blue-400 transition-all flex flex-col justify-between group relative overflow-hidden">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-600/20 text-blue-400">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Ejecutable Portátil</h3>
                    <p className="text-xs text-blue-300 font-mono">TransMac_Portatil.bat</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'es'
                    ? 'Un único ejecutable sin instalación. Abre directamente la interfaz gráfica nativa con aislamiento goto :EOF.'
                    : 'Portable standalone executable file.'}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Detección automática de discos USB</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Soporte MacBook 2008 y OpenCore</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => {
                    const url = `/downloads/TransMac_Portatil.bat?t=${Date.now()}`;
                    fetch(url)
                      .then(res => res.blob())
                      .then(blob => {
                        const blobUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.download = 'TransMac_Portatil.bat';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(blobUrl);
                      })
                      .catch(() => { window.location.href = url; });
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  {lang === 'es' ? 'Descargar Portátil' : 'Download Portable'}
                </button>
              </div>
            </div>

            {/* Option 3: Complete ZIP Package */}
            <div className="p-5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-purple-600/20 text-purple-400">
                    <HardDrive className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Paquete ZIP Completo</h3>
                    <p className="text-xs text-purple-300 font-mono">TransMac_Desktop.zip</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'es'
                    ? 'Incluye todos los archivos: VBScript silencioso, script de PowerShell y lanzador de emergencia.'
                    : 'Includes all sources: VBScript, PowerShell, and batch files.'}
                </p>
                <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 text-[10px] space-y-1 font-mono text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <FileCode className="w-3 h-3 text-blue-400 shrink-0" />
                    <span className="truncate">Ejecutar_TransMac.vbs (ANSI)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">DESBLOQUEAR_Y_EJECUTAR.bat</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => {
                    const url = `/downloads/TransMac_Windows11_Desktop.zip?t=${Date.now()}`;
                    fetch(url)
                      .then(res => res.blob())
                      .then(blob => {
                        const blobUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.download = 'TransMac_Windows11_Desktop.zip';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(blobUrl);
                      })
                      .catch(() => { window.location.href = url; });
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  {lang === 'es' ? 'Descargar ZIP Completo' : 'Download ZIP Package'}
                </button>
              </div>
            </div>
          </div>

          {/* SmartScreen & Security Warning Helper */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/50 via-amber-950/40 to-slate-900 border border-amber-500/50 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px]">
                SOLUCIÓN IMPORTANTE
              </span>
              <span>{lang === 'es' ? 'Si Windows 11 o el navegador bloquean el archivo al descargar:' : 'If Windows 11 or browser blocks the file:'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-200">
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5">
                <p className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  {lang === 'es' ? '1. Si dice "Windows protegió su PC" (SmartScreen):' : '1. If Windows SmartScreen appears:'}
                </p>
                <ol className="list-decimal list-inside text-slate-300 space-y-1 text-[11px]">
                  <li>Haz clic en el enlace azul <strong className="text-white font-semibold">"Más información"</strong>.</li>
                  <li>Pulsa el botón <strong className="text-emerald-400 font-semibold">"Ejecutar de todos modos"</strong> que aparecerá en la parte inferior.</li>
                  <li>Acepta el permiso de Administrador de Windows.</li>
                </ol>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5">
                <p className="font-bold text-blue-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  {lang === 'es' ? '2. Si el navegador (Chrome/Edge) muestra aviso:' : '2. If browser shows a download warning:'}
                </p>
                <ol className="list-decimal list-inside text-slate-300 space-y-1 text-[11px]">
                  <li>En la barra de descargas, haz clic en los 3 puntos <strong className="text-white">⋮</strong> o la flecha.</li>
                  <li>Selecciona <strong className="text-blue-300">"Guardar de todos modos"</strong> (o "Keep").</li>
                  <li>O bien descarga el archivo <strong className="text-emerald-300">"DESBLOQUEAR_Y_EJECUTAR.bat"</strong> dentro del ZIP.</li>
                </ol>
              </div>
            </div>

            {/* Copy Unblock Command */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 text-[11px]">
                {lang === 'es'
                  ? '¿Prefieres desbloquearlo por comandos? Abre PowerShell y pega esto:'
                  : 'Or unblock via PowerShell command:'}
              </span>
              <button
                onClick={() => handleCopyCmd('Unblock-File -Path "$env:USERPROFILE\\Downloads\\TransMac_Portatil.bat"', 'ps-cmd')}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
              >
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>{copiedFile === 'ps-cmd' ? '¡Comando Copiado!' : 'Copiar Comando Unblock-File'}</span>
              </button>
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
