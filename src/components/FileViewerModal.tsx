import React, { useState } from 'react';
import {
  FileCode,
  Download,
  X,
  Binary,
  FileText,
  Copy,
  Check,
  ShieldCheck
} from 'lucide-react';
import { MacFile, formatBytes } from '../utils/macDiskEngine';

interface FileViewerModalProps {
  file: MacFile | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'es' | 'en';
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({
  file,
  isOpen,
  onClose,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'hex' | 'info'>('content');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !file) return null;

  const contentText = file.contentPreview || (
    file.type === 'efi'
      ? `[Apple EFI 64-bit Mach-O Binary Executable: ${file.name}]\nUUID Architecture: x86_64 / ARM64e Universal 2\nBlessed by Apple CoreServices Bless Utility`
      : `[Archivo binario de Apple macOS: ${file.name}]\nTamaño: ${formatBytes(file.size)}\nAtributos: ${file.attributes?.join(', ') || 'Estándar'}`
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(contentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadToWindows = () => {
    const blob = new Blob([contentText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const t = lang === 'es' ? {
    title: 'Visor de Archivos Apple Mac',
    tabContent: 'Contenido / Plist',
    tabHex: 'Vista Hexadecimal',
    tabInfo: 'Metadatos Mac',
    download: 'Exportar a PC Windows',
    copy: 'Copiar Texto',
    copied: '¡Copiado!',
    close: 'Cerrar'
  } : {
    title: 'Apple Mac File Viewer',
    tabContent: 'Content / Plist',
    tabHex: 'Hex View',
    tabInfo: 'Mac Metadata',
    download: 'Export to Windows PC',
    copy: 'Copy Text',
    copied: 'Copied!',
    close: 'Close'
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 select-none text-xs">
      <div className="bg-white dark:bg-[#202020] border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-3 bg-neutral-100 dark:bg-[#1a1a1a] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-500" />
            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                {file.name}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {formatBytes(file.size)} • {file.permissions} • {file.owner}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#252525] flex items-center gap-2">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'content'
                ? 'bg-blue-600 text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 inline mr-1" />
            {t.tabContent}
          </button>

          <button
            onClick={() => setActiveTab('hex')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'hex'
                ? 'bg-blue-600 text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Binary className="w-3.5 h-3.5 inline mr-1" />
            {t.tabHex}
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'info'
                ? 'bg-blue-600 text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
            {t.tabInfo}
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 flex-1 overflow-y-auto">
          {activeTab === 'content' && (
            <pre className="font-mono text-xs bg-neutral-900 text-emerald-400 p-3 rounded-lg overflow-x-auto whitespace-pre leading-relaxed select-text shadow-inner">
              {contentText}
            </pre>
          )}

          {activeTab === 'hex' && (
            <div className="font-mono text-xs bg-neutral-900 text-cyan-400 p-3 rounded-lg select-text shadow-inner space-y-1">
              <div>00000000  43 46 42 75 6E 64 6C 65  49 64 65 6E 74 69 66 69  |CFBundleIdentifi|</div>
              <div>00000010  65 72 00 00 14 07 01 00  00 00 20 44 61 72 77 69  |er........ Darwi|</div>
              <div>00000020  6E 20 4B 65 72 6E 65 6C  20 56 65 72 73 69 6F 6E  |n Kernel Version|</div>
              <div>00000030  23 2E 36 2E 30 00 00 00  00 00 00 00 00 00 00 00  |23.6.0..........|</div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded bg-neutral-100 dark:bg-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Permisos POSIX:</span>
                  <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{file.permissions}</span>
                </div>
                <div className="p-2.5 rounded bg-neutral-100 dark:bg-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Propietario / Grupo:</span>
                  <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{file.owner}</span>
                </div>
                <div className="p-2.5 rounded bg-neutral-100 dark:bg-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Última Modificación:</span>
                  <span className="font-mono text-neutral-800 dark:text-neutral-200">{file.modified}</span>
                </div>
                <div className="p-2.5 rounded bg-neutral-100 dark:bg-neutral-800">
                  <span className="text-[10px] text-neutral-400 block">Atributos Mac:</span>
                  <span className="font-mono text-neutral-800 dark:text-neutral-200">{file.attributes?.join(', ') || 'Ninguno'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-100 dark:bg-[#1a1a1a] border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadToWindows}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.download}</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.copied : t.copy}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
