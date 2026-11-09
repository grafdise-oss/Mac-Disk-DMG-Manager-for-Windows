import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createDefaultMacDisks,
  formatDiskForMac,
  restoreDiskWithDmg,
  MACOS_INSTALLER_PRESETS,
  generateMockSectorData,
  searchMacFiles,
  createVirtualDmgDisk,
  createPhysicalMacDiskFromHandle,
  generateWindowsFlashingScript
} from './macDiskEngine.js';

test('createDefaultMacDisks initializes 3 disks with proper partition schemes', () => {
  const disks = createDefaultMacDisks();
  assert.equal(disks.length, 3);
  assert.equal(disks[0].partitionScheme, 'GPT');
  assert.ok(disks[0].partitions.some(p => p.fileSystem === 'APFS'));
  assert.ok(disks[0].partitions.some(p => p.fileSystem === 'FAT32 (EFI)'));

  assert.equal(disks[1].partitionScheme, 'GPT');
  assert.ok(disks[1].partitions.some(p => p.fileSystem === 'HFS+ (Journaled)'));

  assert.equal(disks[2].partitionScheme, 'MBR');
});

test('formatDiskForMac creates GPT EFI and formatted APFS volume', () => {
  const disks = createDefaultMacDisks();
  const targetDisk = disks[2]; // Kingston 32GB
  
  const formatted = formatDiskForMac(targetDisk, {
    volumeLabel: 'Macintosh HD - Data',
    fileSystem: 'APFS',
    partitionScheme: 'GPT'
  });

  assert.equal(formatted.partitionScheme, 'GPT');
  assert.equal(formatted.partitions.length, 2);
  assert.equal(formatted.partitions[0].name, 'EFI System Partition');
  assert.equal(formatted.partitions[1].name, 'Macintosh HD - Data');
  assert.equal(formatted.partitions[1].fileSystem, 'APFS');
  assert.ok(formatted.partitions[1].rootDirectory.length > 0);
});

test('formatDiskForMac supports APM (Apple Partition Map) for vintage Mac', () => {
  const disks = createDefaultMacDisks();
  const targetDisk = disks[2];

  const formatted = formatDiskForMac(targetDisk, {
    volumeLabel: 'PowerMacintosh',
    fileSystem: 'HFS+ (Journaled)',
    partitionScheme: 'APM'
  });

  assert.equal(formatted.partitionScheme, 'APM');
  assert.equal(formatted.partitions[0].name, 'Apple_partition_map');
  assert.equal(formatted.partitions[1].name, 'PowerMacintosh');
  assert.equal(formatted.partitions[1].fileSystem, 'HFS+ (Journaled)');
});

test('restoreDiskWithDmg configures bootable macOS installer on target USB', () => {
  const disks = createDefaultMacDisks();
  const targetDisk = disks[2]; // Kingston 32GB USB
  const sonomaPreset = MACOS_INSTALLER_PRESETS.find(p => p.id === 'sonoma-14-7')!;

  const restored = restoreDiskWithDmg(targetDisk, sonomaPreset);

  assert.equal(restored.partitionScheme, 'GPT');
  assert.equal(restored.partitions.length, 2);
  // EFI partition has OpenCore bootloader
  const efiPart = restored.partitions[0];
  assert.equal(efiPart.fileSystem, 'FAT32 (EFI)');
  assert.equal(efiPart.isBootable, true);

  // Main partition has Install macOS Sonoma
  const mainPart = restored.partitions[1];
  assert.equal(mainPart.name, 'Install macOS Sonoma');
  assert.equal(mainPart.fileSystem, 'APFS');
  assert.equal(mainPart.isBootable, true);
  assert.ok(mainPart.usedBytes > 10000000000);
});

test('MACOS_INSTALLER_PRESETS contains comprehensive catalog of Apple operating systems', () => {
  // Verifies all requested OS versions are present
  const presetIds = MACOS_INSTALLER_PRESETS.map(p => p.id);
  assert.ok(presetIds.includes('sequoia-15-1'), 'Sequoia must be present');
  assert.ok(presetIds.includes('sonoma-14-7'), 'Sonoma must be present');
  assert.ok(presetIds.includes('ventura-13-7'), 'Ventura must be present');
  assert.ok(presetIds.includes('monterey-12-7'), 'Monterey must be present');
  assert.ok(presetIds.includes('bigsur-11-7'), 'Big Sur must be present');
  assert.ok(presetIds.includes('catalina-10-15'), 'Catalina must be present');
  assert.ok(presetIds.includes('mojave-10-14'), 'Mojave must be present');
  assert.ok(presetIds.includes('high-sierra-10-13'), 'High Sierra must be present');
  assert.ok(presetIds.includes('sierra-10-12'), 'Sierra must be present');
  assert.ok(presetIds.includes('el-capitan-10-11'), 'El Capitan must be present');
  assert.ok(presetIds.includes('yosemite-10-10'), 'Yosemite must be present');
  assert.ok(presetIds.includes('mavericks-10-9'), 'Mavericks must be present');
  assert.ok(presetIds.includes('mountain-lion-10-8'), 'Mountain Lion must be present');
  assert.ok(presetIds.includes('lion-10-7'), 'Lion must be present');
  assert.ok(presetIds.includes('snow-leopard-10-6'), 'Snow Leopard must be present');
  assert.ok(presetIds.includes('leopard-10-5'), 'Leopard must be present');
  assert.ok(presetIds.includes('tiger-10-4'), 'Tiger must be present');
});

test('Snow Leopard, Leopard, Lion, and Mountain Lion are configured with GPT and MacBook 2008 compatibility', () => {
  const snowLeopard = MACOS_INSTALLER_PRESETS.find(p => p.id === 'snow-leopard-10-6')!;
  const leopard = MACOS_INSTALLER_PRESETS.find(p => p.id === 'leopard-10-5')!;
  const lion = MACOS_INSTALLER_PRESETS.find(p => p.id === 'lion-10-7')!;
  const mountainLion = MACOS_INSTALLER_PRESETS.find(p => p.id === 'mountain-lion-10-8')!;

  assert.equal(snowLeopard.requiredScheme, 'GPT');
  assert.equal(snowLeopard.targetFileSystem, 'HFS+ (Journaled)');
  assert.equal(snowLeopard.macbook2008Compatible, true);

  assert.equal(leopard.requiredScheme, 'GPT');
  assert.equal(leopard.targetFileSystem, 'HFS+ (Journaled)');
  assert.equal(leopard.macbook2008Compatible, true);

  assert.equal(lion.requiredScheme, 'GPT');
  assert.equal(lion.targetFileSystem, 'HFS+ (Journaled)');
  assert.equal(lion.macbook2008Compatible, true);

  assert.equal(mountainLion.requiredScheme, 'GPT');
  assert.equal(mountainLion.targetFileSystem, 'HFS+ (Journaled)');
  assert.equal(mountainLion.macbook2008Compatible, true);
});

test('restoreDiskWithDmg with Snow Leopard generates EFI32/64 boot files and mach_kernel for MacBook 2008', () => {
  const disks = createDefaultMacDisks();
  const targetDisk = disks[2];
  const snowLeopardPreset = MACOS_INSTALLER_PRESETS.find(p => p.id === 'snow-leopard-10-6')!;

  const restored = restoreDiskWithDmg(targetDisk, snowLeopardPreset, {
    enableMacBook2008LegacyPatch: true
  });

  assert.equal(restored.partitionScheme, 'GPT');
  assert.equal(restored.partitions.length, 2);

  // Check EFI partition contains both 32-bit and 64-bit EFI bootloaders
  const efiPart = restored.partitions[0];
  const efiDir = efiPart.rootDirectory.find(f => f.name === 'EFI');
  assert.ok(efiDir, 'EFI directory must exist in EFI partition');
  const bootDir = efiDir.children?.find(f => f.name === 'BOOT');
  assert.ok(bootDir, 'BOOT directory must exist in EFI');
  
  const hasBootIa32 = bootDir.children?.some(f => f.name === 'BOOTIA32.EFI');
  const hasBootX64 = bootDir.children?.some(f => f.name === 'BOOTX64.EFI');
  assert.ok(hasBootIa32, 'BOOTIA32.EFI is required for 2008 MacBook 32-bit EFI firmware');
  assert.ok(hasBootX64, 'BOOTX64.EFI must be present for 64-bit EFI Macs');

  // Check HFS+ partition contains mach_kernel and OSInstall.mpkg
  const mainPart = restored.partitions[1];
  assert.equal(mainPart.fileSystem, 'HFS+ (Journaled)');
  const hasMachKernel = mainPart.rootDirectory.some(f => f.name === 'mach_kernel');
  assert.ok(hasMachKernel, 'mach_kernel must be in root for Snow Leopard Alt-boot');
});

test('restoreDiskWithDmg with enableLegacyMbrBiosMode configures MBR scheme, active partition, and Darwin /boot loader', () => {
  const disks = createDefaultMacDisks();
  const targetDisk = disks[2];
  const snowLeopardPreset = MACOS_INSTALLER_PRESETS.find(p => p.id === 'snow-leopard-10-6')!;

  const restored = restoreDiskWithDmg(targetDisk, snowLeopardPreset, {
    enableLegacyMbrBiosMode: true
  });

  // Must be MBR scheme
  assert.equal(restored.partitionScheme, 'MBR');
  assert.equal(restored.partitions.length, 1);
  const part = restored.partitions[0];
  assert.equal(part.isBootable, true, 'Partition must be marked as bootable (active flag)');
  assert.equal(part.fileSystem, 'HFS+ (Journaled)');

  // Must contain Darwin legacy bootloader stage 2
  const hasBoot = part.rootDirectory.some(f => f.name === 'boot');
  assert.ok(hasBoot, 'Darwin /boot stage 2 loader must be present in MBR mode');
  const hasKernel = part.rootDirectory.some(f => f.name === 'mach_kernel');
  assert.ok(hasKernel, 'mach_kernel must be in root');

  // Sector 0 (LBA 0) MBR must have active boot flag 0x80 at offset 446 (0x1BE) and type 0xAF
  const lba0 = generateMockSectorData(restored, null, 0);
  assert.equal(lba0[446], 0x80, 'MBR Partition 1 must have active boot flag 0x80');
  assert.equal(lba0[450], 0xAF, 'MBR Partition 1 must be Apple HFS type 0xAF');
  assert.equal(lba0[510], 0x55);
  assert.equal(lba0[511], 0xAA);
});

test('restoreDiskWithDmg allows explicit user choice between MBR and GPT partition schemes', () => {
  const disks = createDefaultMacDisks();
  const diskA = disks[1];
  const diskB = disks[2];
  const lionPreset = MACOS_INSTALLER_PRESETS.find(p => p.id === 'lion-10-7')!;

  // Explicitly choose MBR
  const restoredMbr = restoreDiskWithDmg(diskA, lionPreset, {
    partitionScheme: 'MBR'
  });
  assert.equal(restoredMbr.partitionScheme, 'MBR');
  assert.equal(restoredMbr.partitions[0].isBootable, true);
  assert.ok(restoredMbr.partitions[0].rootDirectory.some(f => f.name === 'boot'));

  // Explicitly choose GPT
  const restoredGpt = restoreDiskWithDmg(diskB, lionPreset, {
    partitionScheme: 'GPT'
  });
  assert.equal(restoredGpt.partitionScheme, 'GPT');
  assert.equal(restoredGpt.partitions.length, 2);
  assert.equal(restoredGpt.partitions[0].name, 'EFI System Partition');
});

test('generateMockSectorData generates correct MBR and GPT headers', () => {
  const disks = createDefaultMacDisks();
  const disk = disks[0];

  // LBA 0 must end with MBR signature 0x55 0xAA
  const lba0 = generateMockSectorData(disk, null, 0);
  assert.equal(lba0[510], 0x55);
  assert.equal(lba0[511], 0xAA);
  assert.equal(lba0[450], 0xEE); // GPT Protective type

  // LBA 1 must start with "EFI PART"
  const lba1 = generateMockSectorData(disk, null, 1);
  const sig = String.fromCharCode(...lba1.slice(0, 8));
  assert.equal(sig, 'EFI PART');
});

test('searchMacFiles finds files by query case-insensitively', () => {
  const disks = createDefaultMacDisks();
  const files = disks[0].partitions[1].rootDirectory;

  const results = searchMacFiles(files, 'sonoma');
  assert.ok(results.length > 0);
  assert.ok(results.some(r => r.file.name.includes('Sonoma')));

  const plistResults = searchMacFiles(files, 'plist');
  assert.ok(plistResults.length > 0);
  assert.ok(plistResults.some(r => r.file.name.endsWith('.plist')));
});

test('createVirtualDmgDisk initializes virtual mounted drive', () => {
  const dmg = createVirtualDmgDisk('Mac_OS_X_Install.dmg', 16 * 1024 * 1024 * 1024, 'HFS+ (Journaled)', 'GPT');
  assert.equal(dmg.busType, 'Virtual DMG');
  assert.equal(dmg.partitions.length, 2);
  assert.equal(dmg.partitions[1].fileSystem, 'HFS+ (Journaled)');
});

test('createPhysicalMacDiskFromHandle creates physical MacDisk model with MBR scheme', async () => {
  const mockHandle = {
    name: 'E:\\ KINGSTON'
  };
  const physDisk = await createPhysicalMacDiskFromHandle(mockHandle, 'E:');
  assert.equal(physDisk.isPhysical, true);
  assert.equal(physDisk.driveLetter, 'E:');
  assert.equal(physDisk.partitionScheme, 'MBR');
  assert.equal(physDisk.partitions[0].isBootable, true);
});

test('generateWindowsFlashingScript generates diskpart batch script with MBR and active flag 0x80', () => {
  const preset = MACOS_INSTALLER_PRESETS.find(p => p.id === 'snow-leopard-10-6')!;
  const script = generateWindowsFlashingScript(preset, 'MBR');
  assert.ok(script.includes('convert mbr'));
  assert.ok(script.includes('active'));
  assert.ok(script.includes('diskpart'));
  assert.ok(script.includes('Snow Leopard'));
});

