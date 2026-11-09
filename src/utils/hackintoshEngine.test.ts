import { test } from 'node:test';
import assert from 'node:assert';
import {
  detectLocalPcHardware,
  getHackintoshRecommendation,
  generateOpenCoreConfigPlist,
  PC_CPU_ARCHITECTURES
} from './hackintoshEngine';

test('detectLocalPcHardware returns valid default PC profile', () => {
  const hw = detectLocalPcHardware();
  assert.ok(hw.cpuModel.length > 0);
  assert.ok(hw.cpuCores > 0);
  assert.ok(hw.gpuModel.length > 0);
  assert.ok(hw.motherboard.length > 0);
});

test('getHackintoshRecommendation for Comet Lake recommends Sonoma and provides Lilu/VirtualSMC', () => {
  const hw = detectLocalPcHardware();
  hw.cpuArchitecture = 'coffee_comet';
  hw.ethernetCard = 'Intel I219-V';
  hw.wifiCard = 'Intel AX200';

  const rec = getHackintoshRecommendation(hw);
  assert.strictEqual(rec.versionName, 'macOS Sonoma');
  assert.strictEqual(rec.status, 'perfect');
  assert.ok(rec.compatibilityScore >= 95);
  assert.strictEqual(rec.smbiosModel, 'iMac20,1');

  // Verify essential kexts
  const kextNames = rec.essentialKexts.map(k => k.name);
  assert.ok(kextNames.includes('Lilu.kext'));
  assert.ok(kextNames.includes('VirtualSMC.kext'));
  assert.ok(kextNames.includes('WhateverGreen.kext'));
  assert.ok(kextNames.includes('AppleALC.kext'));
  assert.ok(kextNames.includes('IntelMausi.kext'));
  assert.ok(kextNames.includes('AirportItlwm.kext'));
});

test('getHackintoshRecommendation for Ryzen sets MacPro7,1 and notes dGPU requirement', () => {
  const hw = detectLocalPcHardware();
  hw.cpuArchitecture = 'ryzen';
  hw.gpuType = 'amd_polaris';

  const rec = getHackintoshRecommendation(hw);
  assert.strictEqual(rec.smbiosModel, 'MacPro7,1');
  assert.strictEqual(rec.status, 'needs_dgpu');
  assert.ok(rec.bootArgs.includes('agdpmod=pikera'));
});

test('generateOpenCoreConfigPlist outputs well-formed OpenCore XML with boot-args and Kexts', () => {
  const hw = detectLocalPcHardware();
  const rec = getHackintoshRecommendation(hw);
  const plist = generateOpenCoreConfigPlist(rec, hw);

  assert.ok(plist.includes('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.ok(plist.includes('<key>ACPI</key>'));
  assert.ok(plist.includes('<key>Kernel</key>'));
  assert.ok(plist.includes('Lilu.kext'));
  assert.ok(plist.includes('VirtualSMC.kext'));
  assert.ok(plist.includes(rec.smbiosModel));
  assert.ok(plist.includes(rec.bootArgs));
});
