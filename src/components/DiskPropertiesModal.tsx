import React from 'react';
import {
  HardDrive,
  ShieldCheck,
  Activity,
  Layers,
  X,
  Cpu
} from 'lucide-react';
import { MacDisk, formatBytes } from '../utils/macDiskEngine';

interface DiskPropertiesModalProps {
  currentDisk: MacDisk | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'es' | 'en';
}

export const DiskPropertiesModal: React.FC<DiskPropertiesModalProps> = ({
  currentDisk,
  isOpen,
  onClose,
  lang
}) => {
  if (!isOpen || !currentDisk) return null;

  const totalSectors = Math.floor(currentDisk.capacityBytes / currentDisk.sectorSize);

  const t = lang === 'es' ? {
    title: 'Propiedades de la Unidad de Disco',
    general: 'General',
    smart: 'Salud S.M.A.R.T.',
    hardware: 'Hardware y Geometría',
    model: 'Modelo de la Unidad:',
    serial: 'Número de Serie:',
    bus: 'Tipo de Interfaz (Bus):',
    capacity: 'Capacidad Total:',
    sectors: 'Sectores Lógicos Totales:',
    sectorSize: 'Tamaño de Sector Físico:',
    scheme: 'Esquema de Particionado:',
    guid: 'GUID del Disco:',
    smartStatus: 'Estado de Salud S.M.A.R.T.:',
    smartGood: 'BUENO (100% Sin sectores reasignados)',
    temp: 'Temperatura de Operación:',
    rwStatus: 'Acceso de Lectura/Escritura:',
    rwOk: 'Lectura y Escritura HFS+/APFS Habilitada',
    close: 'Cerrar'
  } : {
    title: 'Disk Drive Properties',
    general: 'General',
    smart: 'S.M.A.R.T. Health',
    hardware: 'Hardware & Geometry',
    model: 'Drive Model:',
    serial: 'Serial Number:',
    bus: 'Interface (Bus):',
    capacity: 'Total Capacity:',
    sectors: 'Total Logical Sectors:',
    sectorSize: 'Physical Sector Size:',
    scheme: 'Partition Scheme:',
    guid: 'Disk GUID:',
    smartStatus: 'S.M.A.R.T. Health Status:',
    smartGood: 'GOOD (100% No reallocated sectors)',
    temp: 'Operating Temperature:',
    rwStatus: 'Read/Write Access:',
    rwOk: 'HFS+/APFS Read & Write Enabled',
    close: 'Close'
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 select-none text-xs">
      <div className="bg-white dark:bg-[#202020] border border-neutral-300 dark:border-neutral-700 rounded-xl shadow-2xl max-w-md w-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-neutral-100 dark:bg-[#1a1a1a] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              {t.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 font-sans">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400">{t.model}</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">{currentDisk.model}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400">{t.serial}</span>
              <span className="font-mono text-neutral-800 dark:text-neutral-200">{currentDisk.serialNumber}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400">{t.bus}</span>
              <span className="font-semibold text-cyan-600 dark:text-cyan-400">{currentDisk.busType} 3.2 Gen 2</span>
            </div>

            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400">{t.capacity}</span>
              <span className="font-bold text-neutral-900 dark:text-white font-mono">{formatBytes(currentDisk.capacityBytes)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400">{t.sectors}</span>
              <span className="font-mono text-neutral-700 dark:text-neutral-300">{totalSectors.toLocaleString()}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400">{t.sectorSize}</span>
              <span className="font-mono text-neutral-700 dark:text-neutral-300">{currentDisk.sectorSize} Bytes / Sector</span>
            </div>

            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400">{t.scheme}</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{currentDisk.partitionScheme}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-400">{t.smartStatus}</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.smartGood}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-neutral-400">{t.rwStatus}</span>
              <span className="text-emerald-600 font-semibold">{t.rwOk}</span>
            </div>
          </div>

          <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg font-mono text-[10px] text-neutral-500 break-all">
            GUID: {currentDisk.guid}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-neutral-100 dark:bg-[#1a1a1a] border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
