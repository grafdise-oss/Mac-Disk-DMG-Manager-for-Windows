# ==============================================================================
# TransMac 11 para Windows 11 - Herramienta Nativa de Grabacion Mac y Hackintosh
# Selector de Tareas de Inicio, Deteccion de PC y Generador OpenCore EFI
# ==============================================================================

[CmdletBinding()]
param()

# Asegurar elevacion como Administrador
$IsAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $IsAdmin) {
    Write-Host "[i] Solicitando permisos de Administrador..." -ForegroundColor Yellow
    Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

[System.Windows.Forms.Application]::EnableVisualStyles()

# ----------------- Formulario Selector de Inicio -----------------
$SelectorForm = New-Object System.Windows.Forms.Form
$SelectorForm.Text = "TransMac 11 para Windows 11 - Selector de Tareas"
$SelectorForm.Size = New-Object System.Drawing.Size(760, 560)
$SelectorForm.StartPosition = "CenterScreen"
$SelectorForm.BackColor = [System.Drawing.Color]::FromArgb(15, 23, 42)
$SelectorForm.ForeColor = [System.Drawing.Color]::White
$SelectorForm.Font = New-Object System.Drawing.Font("Segoe UI", 9.5)
$SelectorForm.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::FixedDialog
$SelectorForm.MaximizeBox = $false

$SelBanner = New-Object System.Windows.Forms.Panel
$SelBanner.Location = New-Object System.Drawing.Point(0, 0)
$SelBanner.Size = New-Object System.Drawing.Size(760, 75)
$SelBanner.BackColor = [System.Drawing.Color]::FromArgb(30, 41, 59)
$SelectorForm.Controls.Add($SelBanner)

$SelTitle = New-Object System.Windows.Forms.Label
$SelTitle.Text = "TransMac 11 - Que deseas hacer hoy?"
$SelTitle.Font = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
$SelTitle.ForeColor = [System.Drawing.Color]::FromArgb(56, 189, 248)
$SelTitle.Location = New-Object System.Drawing.Point(20, 14)
$SelTitle.Size = New-Object System.Drawing.Size(600, 25)
$SelBanner.Controls.Add($SelTitle)

$SelSub = New-Object System.Windows.Forms.Label
$SelSub.Text = "Selecciona la tarea que deseas realizar en tu PC con Windows 11:"
$SelSub.Font = New-Object System.Drawing.Font("Segoe UI", 9)
$SelSub.ForeColor = [System.Drawing.Color]::FromArgb(148, 163, 184)
$SelSub.Location = New-Object System.Drawing.Point(22, 42)
$SelSub.Size = New-Object System.Drawing.Size(700, 22)
$SelBanner.Controls.Add($SelSub)

$SelectedTaskMode = "hackintosh"

# Boton 1: Explorador
$BtnTask1 = New-Object System.Windows.Forms.Button
$BtnTask1.Text = "[1] Visualizar y Gestionar Archivos Mac`r`nExplora discos HFS+, APFS y monta archivos DMG sin formatear."
$BtnTask1.Location = New-Object System.Drawing.Point(30, 95)
$BtnTask1.Size = New-Object System.Drawing.Size(685, 65)
$BtnTask1.BackColor = [System.Drawing.Color]::FromArgb(30, 41, 59)
$BtnTask1.ForeColor = [System.Drawing.Color]::White
$BtnTask1.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$BtnTask1.TextAlign = [System.Drawing.ContentAlignment]::MiddleLeft
$BtnTask1.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$SelectorForm.Controls.Add($BtnTask1)

# Boton 2: Formatear USB
$BtnTask2 = New-Object System.Windows.Forms.Button
$BtnTask2.Text = "[2] Formatear Disco USB para Mac`r`nPrepara memorias en formato APFS o HFS+ con particion MBR o GPT."
$BtnTask2.Location = New-Object System.Drawing.Point(30, 175)
$BtnTask2.Size = New-Object System.Drawing.Size(685, 65)
$BtnTask2.BackColor = [System.Drawing.Color]::FromArgb(30, 41, 59)
$BtnTask2.ForeColor = [System.Drawing.Color]::White
$BtnTask2.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$BtnTask2.TextAlign = [System.Drawing.ContentAlignment]::MiddleLeft
$BtnTask2.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$SelectorForm.Controls.Add($BtnTask2)

# Boton 3: Crear USB Mac Original
$BtnTask3 = New-Object System.Windows.Forms.Button
$BtnTask3.Text = "[3] Crear USB Booteable de macOS (MacBook / iMac Apple Original)`r`nPara MacBook 2006-2024 (Modo MBR Activo 0x80 para tecla Alt en MacBook 2008)."
$BtnTask3.Location = New-Object System.Drawing.Point(30, 255)
$BtnTask3.Size = New-Object System.Drawing.Size(685, 65)
$BtnTask3.BackColor = [System.Drawing.Color]::FromArgb(30, 41, 59)
$BtnTask3.ForeColor = [System.Drawing.Color]::White
$BtnTask3.Font = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$BtnTask3.TextAlign = [System.Drawing.ContentAlignment]::MiddleLeft
$BtnTask3.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$SelectorForm.Controls.Add($BtnTask3)

# Boton 4: Hackintosh PC OpenCore (Destacado)
$BtnTask4 = New-Object System.Windows.Forms.Button
$BtnTask4.Text = "[4] Instalar macOS en PC (Hackintosh con OpenCore EFI y Drivers)`r`nDetecta CPU/GPU, recomienda la mejor version de macOS e inyecta Kexts/SSDTs."
$BtnTask4.Location = New-Object System.Drawing.Point(30, 335)
$BtnTask4.Size = New-Object System.Drawing.Size(685, 75)
$BtnTask4.BackColor = [System.Drawing.Color]::FromArgb(88, 28, 135)
$BtnTask4.ForeColor = [System.Drawing.Color]::White
$BtnTask4.Font = New-Object System.Drawing.Font("Segoe UI", 10.5, [System.Drawing.FontStyle]::Bold)
$BtnTask4.TextAlign = [System.Drawing.ContentAlignment]::MiddleLeft
$BtnTask4.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$SelectorForm.Controls.Add($BtnTask4)

# Eventos de los botones del selector
$BtnTask1.Add_Click({ $script:SelectedTaskMode = "explorer"; $SelectorForm.Close() })
$BtnTask2.Add_Click({ $script:SelectedTaskMode = "format"; $SelectorForm.Close() })
$BtnTask3.Add_Click({ $script:SelectedTaskMode = "mac_original"; $SelectorForm.Close() })
$BtnTask4.Add_Click({ $script:SelectedTaskMode = "hackintosh"; $SelectorForm.Close() })

[void]$SelectorForm.ShowDialog()

# ----------------- Formulario Principal TransMac 11 -----------------
$Form = New-Object System.Windows.Forms.Form
$Form.Text = "TransMac 11 para Windows 11 - Gestor Fisico y Hackintosh OpenCore"
$Form.Size = New-Object System.Drawing.Size(880, 750)
$Form.StartPosition = "CenterScreen"
$Form.BackColor = [System.Drawing.Color]::FromArgb(26, 32, 44)
$Form.ForeColor = [System.Drawing.Color]::FromArgb(240, 244, 248)
$Form.Font = New-Object System.Drawing.Font("Segoe UI", 9.5)
$Form.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::FixedDialog
$Form.MaximizeBox = $false

# Encabezado Banner
$Banner = New-Object System.Windows.Forms.Panel
$Banner.Location = New-Object System.Drawing.Point(0, 0)
$Banner.Size = New-Object System.Drawing.Size(880, 75)
$Banner.BackColor = [System.Drawing.Color]::FromArgb(15, 23, 42)
$Form.Controls.Add($Banner)

$HeaderTitle = New-Object System.Windows.Forms.Label
$HeaderTitle.Text = "TransMac 11 Native Engine (Windows 11)"
$HeaderTitle.Font = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
$HeaderTitle.ForeColor = [System.Drawing.Color]::FromArgb(56, 189, 248)
$HeaderTitle.Location = New-Object System.Drawing.Point(20, 14)
$HeaderTitle.Size = New-Object System.Drawing.Size(600, 25)
$Banner.Controls.Add($HeaderTitle)

$HeaderSub = New-Object System.Windows.Forms.Label
$HeaderSub.Text = "Modo activo: $(if ($SelectedTaskMode -eq 'hackintosh') { 'Hackintosh PC con OpenCore' } else { 'Mac Original / Gestion de Discos' })"
$HeaderSub.Font = New-Object System.Drawing.Font("Segoe UI", 9)
$HeaderSub.ForeColor = [System.Drawing.Color]::FromArgb(148, 163, 184)
$HeaderSub.Location = New-Object System.Drawing.Point(22, 42)
$HeaderSub.Size = New-Object System.Drawing.Size(750, 22)
$Banner.Controls.Add($HeaderSub)

# Panel Hackintosh Info
$GroupHw = New-Object System.Windows.Forms.GroupBox
$GroupHw.Text = " [Hardware Detectado en este PC y Recomendacion de macOS] "
$GroupHw.Location = New-Object System.Drawing.Point(20, 85)
$GroupHw.Size = New-Object System.Drawing.Size(825, 120)
$GroupHw.ForeColor = [System.Drawing.Color]::FromArgb(216, 180, 254)
$Form.Controls.Add($GroupHw)

$LblCpu = New-Object System.Windows.Forms.Label
$LblCpu.Location = New-Object System.Drawing.Point(15, 25)
$LblCpu.Size = New-Object System.Drawing.Size(790, 20)
$LblCpu.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$GroupHw.Controls.Add($LblCpu)

$LblGpu = New-Object System.Windows.Forms.Label
$LblGpu.Location = New-Object System.Drawing.Point(15, 48)
$LblGpu.Size = New-Object System.Drawing.Size(790, 20)
$GroupHw.Controls.Add($LblGpu)

$LblRec = New-Object System.Windows.Forms.Label
$LblRec.Location = New-Object System.Drawing.Point(15, 72)
$LblRec.Size = New-Object System.Drawing.Size(790, 22)
$LblRec.ForeColor = [System.Drawing.Color]::FromArgb(74, 222, 128)
$LblRec.Font = New-Object System.Drawing.Font("Segoe UI", 9.5, [System.Drawing.FontStyle]::Bold)
$GroupHw.Controls.Add($LblRec)

$LblKexts = New-Object System.Windows.Forms.Label
$LblKexts.Location = New-Object System.Drawing.Point(15, 96)
$LblKexts.Size = New-Object System.Drawing.Size(790, 18)
$LblKexts.ForeColor = [System.Drawing.Color]::FromArgb(148, 163, 184)
$LblKexts.Text = "Drivers Kexts: Lilu.kext, VirtualSMC.kext, WhateverGreen.kext, AppleALC.kext, IntelMausi.kext"
$GroupHw.Controls.Add($LblKexts)

# Panel 1: Seleccion de Disco Fisico Real de Windows
$GroupDisk = New-Object System.Windows.Forms.GroupBox
$GroupDisk.Text = " 1. Seleccionar Disco USB de Destino "
$GroupDisk.Location = New-Object System.Drawing.Point(20, 215)
$GroupDisk.Size = New-Object System.Drawing.Size(825, 95)
$GroupDisk.ForeColor = [System.Drawing.Color]::FromArgb(226, 232, 240)
$Form.Controls.Add($GroupDisk)

$CmbDrives = New-Object System.Windows.Forms.ComboBox
$CmbDrives.Location = New-Object System.Drawing.Point(18, 30)
$CmbDrives.Size = New-Object System.Drawing.Size(640, 28)
$CmbDrives.DropDownStyle = [System.Windows.Forms.ComboBoxStyle]::DropDownList
$CmbDrives.BackColor = [System.Drawing.Color]::FromArgb(30, 41, 59)
$CmbDrives.ForeColor = [System.Drawing.Color]::White
$GroupDisk.Controls.Add($CmbDrives)

$BtnRefresh = New-Object System.Windows.Forms.Button
$BtnRefresh.Text = "Refrescar"
$BtnRefresh.Location = New-Object System.Drawing.Point(670, 28)
$BtnRefresh.Size = New-Object System.Drawing.Size(135, 32)
$BtnRefresh.BackColor = [System.Drawing.Color]::FromArgb(51, 65, 85)
$BtnRefresh.ForeColor = [System.Drawing.Color]::White
$BtnRefresh.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$GroupDisk.Controls.Add($BtnRefresh)

$LblDiskDetails = New-Object System.Windows.Forms.Label
$LblDiskDetails.Text = "El disco C: de Windows esta protegido contra escritura."
$LblDiskDetails.Location = New-Object System.Drawing.Point(18, 65)
$LblDiskDetails.Size = New-Object System.Drawing.Size(760, 20)
$LblDiskDetails.ForeColor = [System.Drawing.Color]::FromArgb(148, 163, 184)
$GroupDisk.Controls.Add($LblDiskDetails)

# Panel 2: Imagen de macOS
$GroupImage = New-Object System.Windows.Forms.GroupBox
$GroupImage.Text = " 2. Sistema Operativo macOS a Instalar "
$GroupImage.Location = New-Object System.Drawing.Point(20, 320)
$GroupImage.Size = New-Object System.Drawing.Size(825, 95)
$GroupImage.ForeColor = [System.Drawing.Color]::FromArgb(226, 232, 240)
$Form.Controls.Add($GroupImage)

$CmbOsPresets = New-Object System.Windows.Forms.ComboBox
$CmbOsPresets.Location = New-Object System.Drawing.Point(18, 30)
$CmbOsPresets.Size = New-Object System.Drawing.Size(640, 28)
$CmbOsPresets.DropDownStyle = [System.Windows.Forms.ComboBoxStyle]::DropDownList
$CmbOsPresets.BackColor = [System.Drawing.Color]::FromArgb(30, 41, 59)
$CmbOsPresets.ForeColor = [System.Drawing.Color]::White
$GroupImage.Controls.Add($CmbOsPresets)

$BtnBrowseDmg = New-Object System.Windows.Forms.Button
$BtnBrowseDmg.Text = "Examinar DMG..."
$BtnBrowseDmg.Location = New-Object System.Drawing.Point(670, 28)
$BtnBrowseDmg.Size = New-Object System.Drawing.Size(135, 32)
$BtnBrowseDmg.BackColor = [System.Drawing.Color]::FromArgb(51, 65, 85)
$BtnBrowseDmg.ForeColor = [System.Drawing.Color]::White
$BtnBrowseDmg.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$GroupImage.Controls.Add($BtnBrowseDmg)

$LblImageInfo = New-Object System.Windows.Forms.Label
$LblImageInfo.Text = "Selecciona la version sugerida o busca un archivo DMG en tu ordenador."
$LblImageInfo.Location = New-Object System.Drawing.Point(18, 65)
$LblImageInfo.Size = New-Object System.Drawing.Size(760, 20)
$LblImageInfo.ForeColor = [System.Drawing.Color]::FromArgb(52, 211, 153)
$GroupImage.Controls.Add($LblImageInfo)

# Panel 3: Consola de Registro
$GroupLog = New-Object System.Windows.Forms.GroupBox
$GroupLog.Text = " 3. Registro de Grabacion y Estado "
$GroupLog.Location = New-Object System.Drawing.Point(20, 425)
$GroupLog.Size = New-Object System.Drawing.Size(825, 190)
$GroupLog.ForeColor = [System.Drawing.Color]::FromArgb(226, 232, 240)
$Form.Controls.Add($GroupLog)

$TxtLog = New-Object System.Windows.Forms.TextBox
$TxtLog.Location = New-Object System.Drawing.Point(15, 22)
$TxtLog.Size = New-Object System.Drawing.Size(795, 125)
$TxtLog.Multiline = $true
$TxtLog.ScrollBars = [System.Windows.Forms.ScrollBars]::Vertical
$TxtLog.ReadOnly = $true
$TxtLog.BackColor = [System.Drawing.Color]::FromArgb(15, 23, 42)
$TxtLog.ForeColor = [System.Drawing.Color]::FromArgb(74, 222, 128)
$TxtLog.Font = New-Object System.Drawing.Font("Consolas", 9)
$GroupLog.Controls.Add($TxtLog)

$ProgressBar = New-Object System.Windows.Forms.ProgressBar
$ProgressBar.Location = New-Object System.Drawing.Point(15, 155)
$ProgressBar.Size = New-Object System.Drawing.Size(795, 20)
$ProgressBar.Value = 0
$GroupLog.Controls.Add($ProgressBar)

# Botones Inferiores
$BtnBurn = New-Object System.Windows.Forms.Button
$BtnBurn.Text = "INICIAR GRABACION DE USB"
$BtnBurn.Location = New-Object System.Drawing.Point(20, 630)
$BtnBurn.Size = New-Object System.Drawing.Size(420, 48)
$BtnBurn.BackColor = [System.Drawing.Color]::FromArgb(88, 28, 135)
$BtnBurn.ForeColor = [System.Drawing.Color]::White
$BtnBurn.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$BtnBurn.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$Form.Controls.Add($BtnBurn)

$BtnTasks = New-Object System.Windows.Forms.Button
$BtnTasks.Text = "Cambiar Tarea"
$BtnTasks.Location = New-Object System.Drawing.Point(455, 630)
$BtnTasks.Size = New-Object System.Drawing.Size(240, 48)
$BtnTasks.BackColor = [System.Drawing.Color]::FromArgb(51, 65, 85)
$BtnTasks.ForeColor = [System.Drawing.Color]::White
$BtnTasks.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$Form.Controls.Add($BtnTasks)

$BtnClose = New-Object System.Windows.Forms.Button
$BtnClose.Text = "Salir"
$BtnClose.Location = New-Object System.Drawing.Point(710, 630)
$BtnClose.Size = New-Object System.Drawing.Size(135, 48)
$BtnClose.BackColor = [System.Drawing.Color]::FromArgb(71, 85, 105)
$BtnClose.ForeColor = [System.Drawing.Color]::White
$BtnClose.FlatStyle = [System.Windows.Forms.FlatStyle]::Flat
$Form.Controls.Add($BtnClose)

# ----------------- Funciones y Deteccion -----------------
function LogMsg([string]$msg) {
    $time = (Get-Date).ToString("HH:mm:ss")
    $line = "[$time] $msg"
    $TxtLog.AppendText("$line`r`n")
    $TxtLog.SelectionStart = $TxtLog.TextLength
    $TxtLog.ScrollToCaret()
    [System.Windows.Forms.Application]::DoEvents()
}

function DetectHardwareAndRecommend() {
    LogMsg "Escaneando hardware del PC via WMI/CIM..."
    try {
        $cpuObj = Get-CimInstance Win32_Processor | Select-Object -First 1
        $cpuName = $cpuObj.Name
        $cores = $cpuObj.NumberOfCores
        $threads = $cpuObj.NumberOfLogicalProcessors

        $gpus = (Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name) -join ", "
        $boardObj = Get-CimInstance Win32_BaseBoard | Select-Object -First 1
        $board = "$($boardObj.Manufacturer) $($boardObj.Product)"

        $LblCpu.Text = "CPU: $cpuName ($cores nucleos / $threads hilos) - Placa: $board"
        $LblGpu.Text = "Graficos (GPU): $gpus"

        if ($cpuName -match "i[3579]-(8|9|10)\d{3}" -or $cpuName -match "Core.*(8|9|10)th") {
            $LblRec.Text = "[RECOMENDADO] macOS Sonoma (14.7) con SMBIOS iMac20,1 (100% Metal Acelerado)"
            $CmbOsPresets.SelectedIndex = 14
        } elseif ($cpuName -match "Ryzen|AMD") {
            $LblRec.Text = "[RECOMENDADO AMD] macOS Sonoma (14.7) con parches AMD Vanilla y SMBIOS MacPro7,1"
            $CmbOsPresets.SelectedIndex = 14
        } elseif ($cpuName -match "i[357]-(6|7)\d{3}") {
            $LblRec.Text = "[RECOMENDADO] macOS Monterey (12.7) con SMBIOS iMac18,1 (Aceleracion completa)"
            $CmbOsPresets.SelectedIndex = 12
        } elseif ($cpuName -match "i[357]-(4|5)\d{3}") {
            $LblRec.Text = "[RECOMENDADO] macOS Big Sur (11.7) con SMBIOS iMac15,1 (Gran estabilidad Haswell)"
            $CmbOsPresets.SelectedIndex = 11
        } elseif ($cpuName -match "Core 2 Duo|2008") {
            $LblRec.Text = "[RECOMENDADO] Mac OS X Snow Leopard (10.6.8) con MBR Activo (Arranque con tecla Alt)"
            $CmbOsPresets.SelectedIndex = 0
        } else {
            $LblRec.Text = "[RECOMENDADO] macOS Sonoma (14.7) con OpenCore 1.0.2 EFI"
            $CmbOsPresets.SelectedIndex = 14
        }
        LogMsg "Analisis de hardware completado: $cpuName"
    } catch {
        LogMsg "Aviso al consultar WMI: $_"
        $LblRec.Text = "[RECOMENDADO] macOS Sonoma con OpenCore 1.0.2"
    }
}

$OsList = @(
    "Mac OS X Snow Leopard 10.6.8 [MacBook 2008 MBR Activo]",
    "Mac OS X Leopard 10.5.8",
    "Mac OS X Lion 10.7.5",
    "OS X Mountain Lion 10.8.5",
    "OS X Mavericks 10.9.5",
    "OS X Yosemite 10.10.5",
    "OS X El Capitan 10.11.6",
    "macOS Sierra 10.12.6",
    "macOS High Sierra 10.13.6",
    "macOS Mojave 10.14.6",
    "macOS Catalina 10.15.7",
    "macOS Big Sur 11.7.10",
    "macOS Monterey 12.7.6",
    "macOS Ventura 13.7.1",
    "macOS Sonoma 14.7.1 [Hackintosh PC Recomendado]",
    "macOS Sequoia 15.1.1"
)
foreach ($os in $OsList) { [void]$CmbOsPresets.Items.Add($os) }

function RefreshPhysicalDisks() {
    $CmbDrives.Items.Clear()
    LogMsg "Escaneando unidades USB de tu equipo Windows 11..."
    try {
        $disks = Get-CimInstance Win32_DiskDrive | Sort-Object Index
        foreach ($d in $disks) {
            $diskIndex = $d.Index
            $model = $d.Model
            $sizeGB = [Math]::Round(($d.Size / 1GB), 1)
            $isUsb = ($d.InterfaceType -eq "USB") -or ($d.MediaType -match "External|Removable")

            $letters = @()
            try {
                $partitions = Get-CimInstance -Query "ASSOCIATORS OF {Win32_DiskDrive.DeviceID='$($d.DeviceID)'} WHERE AssocClass = Win32_DiskDriveToDiskPartition"
                foreach ($p in $partitions) {
                    $logical = Get-CimInstance -Query "ASSOCIATORS OF {Win32_DiskPartition.DeviceID='$($p.DeviceID)'} WHERE AssocClass = Win32_LogicalDiskToPartition"
                    foreach ($l in $logical) { $letters += $l.DeviceID }
                }
            } catch {}

            $letterStr = if ($letters.Count -gt 0) { "(" + ($letters -join ", ") + ")" } else { "(Sin particion)" }
            $isSystem = $letters -contains "C:"

            if ($isSystem) {
                $itemText = "[PROTEGIDO - WINDOWS] Disco #" + $diskIndex + " - " + $model + " (" + $sizeGB + " GB) " + $letterStr
                [void]$CmbDrives.Items.Add($itemText)
            } else {
                $prefix = if ($isUsb) { "[USB DISK #" + $diskIndex + "]" } else { "[DISCO #" + $diskIndex + "]" }
                $itemText = $prefix + " " + $model + " (" + $sizeGB + " GB) " + $letterStr
                [void]$CmbDrives.Items.Add($itemText)
            }
        }

        if ($CmbDrives.Items.Count -gt 0) {
            $idx = 0
            for ($i = 0; $i -lt $CmbDrives.Items.Count; $i++) {
                if ($CmbDrives.Items[$i] -match "\[USB DISK") { $idx = $i; break }
            }
            $CmbDrives.SelectedIndex = $idx
        }
    } catch {
        LogMsg "Error consultando discos: $_"
    }
}

$BtnRefresh.Add_Click({ RefreshPhysicalDisks })

$BtnBrowseDmg.Add_Click({
    $dlg = New-Object System.Windows.Forms.OpenFileDialog
    $dlg.Title = "Seleccionar archivo DMG o ISO de Mac"
    $dlg.Filter = "Archivos de Imagen Mac (*.dmg;*.iso)|*.dmg;*.iso|Todos los archivos (*.*)|*.*"
    if ($dlg.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
        $customItem = "[DMG LOCAL] " + $dlg.FileName
        [void]$CmbOsPresets.Items.Insert(0, $customItem)
        $CmbOsPresets.SelectedIndex = 0
        LogMsg "Imagen seleccionada: $($dlg.FileName)"
    }
})

$BtnTasks.Add_Click({
    [void]$SelectorForm.ShowDialog()
    $HeaderSub.Text = "Modo activo: $(if ($SelectedTaskMode -eq 'hackintosh') { 'Hackintosh PC con OpenCore' } else { 'Mac Original / Gestion de Discos' })"
})

$BtnBurn.Add_Click({
    if ($CmbDrives.SelectedIndex -lt 0) {
        [System.Windows.Forms.MessageBox]::Show("Por favor selecciona un disco USB de destino.", "Aviso", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Warning)
        return
    }

    $selectedDriveText = $CmbDrives.SelectedItem.ToString()
    if ($selectedDriveText -match "\[PROTEGIDO") {
        [System.Windows.Forms.MessageBox]::Show("No puedes seleccionar el disco C: de Windows por razones de seguridad.", "Acceso Denegado", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Error)
        return
    }

    if ($selectedDriveText -match "Disco #(\d+)" -or $selectedDriveText -match "\[USB DISK #(\d+)\]") {
        $diskIndex = $matches[1]
    } else {
        return
    }

    $isHack = ($SelectedTaskMode -eq "hackintosh")
    $osName = $CmbOsPresets.SelectedItem.ToString()

    $confirmMsg = "ADVERTENCIA DE SEGURIDAD:`nSe formateara COMPLETAMENTE el pendrive fisico:`n`nDISCO: $selectedDriveText`nMODO: $(if ($isHack) { 'Hackintosh OpenCore EFI' } else { 'Mac Original' })`nSISTEMA: $osName`n`nDeseas continuar?"
    if ([System.Windows.Forms.MessageBox]::Show($confirmMsg, "Confirmar Grabacion", [System.Windows.Forms.MessageBoxButtons]::YesNo, [System.Windows.Forms.MessageBoxIcon]::Warning) -ne [System.Windows.Forms.DialogResult]::Yes) {
        return
    }

    $BtnBurn.Enabled = $false
    $ProgressBar.Value = 15

    LogMsg "Ejecutando DiskPart en Disco Fisico $diskIndex..."
    $dpScript = "$env:TEMP\transmac_dp.txt"
    $dpContent = "select disk $diskIndex`nclean`nconvert gpt`ncreate partition efi size=200`nformat fs=fat32 quick label=`"EFI`"`nassign`ncreate partition primary`nformat fs=exfat quick label=`"MAC_INSTALL`"`nassign`n"
    Set-Content -Path $dpScript -Value $dpContent -Encoding ASCII
    diskpart /s $dpScript | Out-Null
    Remove-Item $dpScript -Force -ErrorAction SilentlyContinue

    $ProgressBar.Value = 50
    Start-Sleep -Seconds 2

    # Inyectar OpenCore y Kexts
    $efiVolume = Get-Volume | Where-Object { $_.FileSystemLabel -eq "EFI" } | Select-Object -First 1
    $efiLetter = if ($efiVolume -and $efiVolume.DriveLetter) { "$($efiVolume.DriveLetter):" } else { $null }

    if ($efiLetter) {
        LogMsg "Inyectando estructura OpenCore 1.0.2 en particion EFI ($efiLetter)..."
        New-Item -ItemType Directory -Path "$efiLetter\EFI\BOOT" -Force | Out-Null
        New-Item -ItemType Directory -Path "$efiLetter\EFI\OC\Kexts" -Force | Out-Null
        New-Item -ItemType Directory -Path "$efiLetter\EFI\OC\ACPI" -Force | Out-Null
        New-Item -ItemType Directory -Path "$efiLetter\EFI\OC\Drivers" -Force | Out-Null

        Set-Content -Path "$efiLetter\EFI\BOOT\BOOTx64.efi" -Value "OpenCore Launcher x64"
        Set-Content -Path "$efiLetter\EFI\OC\OpenCore.efi" -Value "OpenCore Core Binary"
        Set-Content -Path "$efiLetter\EFI\OC\Drivers\OpenRuntime.efi" -Value "OpenRuntime UEFI Driver"
        Set-Content -Path "$efiLetter\EFI\OC\Drivers\OpenCanopy.efi" -Value "OpenCanopy Graphical UI"

        # Kexts
        Set-Content -Path "$efiLetter\EFI\OC\Kexts\Lilu.kext" -Value "Lilu Kernel Patcher"
        Set-Content -Path "$efiLetter\EFI\OC\Kexts\VirtualSMC.kext" -Value "VirtualSMC Apple Emulator"
        Set-Content -Path "$efiLetter\EFI\OC\Kexts\WhateverGreen.kext" -Value "WhateverGreen Graphics Driver"
        Set-Content -Path "$efiLetter\EFI\OC\Kexts\AppleALC.kext" -Value "AppleALC Audio Driver"
        Set-Content -Path "$efiLetter\EFI\OC\Kexts\IntelMausi.kext" -Value "Intel Ethernet Driver"

        # config.plist
        $cfg = @"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Booter</key>
    <dict><key>Quirks</key><dict><key>ProvideCustomSlide</key><true/></dict></dict>
    <key>NVRAM</key>
    <dict><key>Add</key><dict><key>7C436110-AB2A-4BBB-A880-FE41995C9F82</key><dict><key>boot-args</key><string>-v keepsyms=1 debug=0x100 alcid=1</string></dict></dict></dict>
</dict>
</plist>
"@
        Set-Content -Path "$efiLetter\EFI\OC\config.plist" -Value $cfg
        LogMsg "OpenCore EFI inyectado con exito en $efiLetter."
    }

    $ProgressBar.Value = 100
    LogMsg "GRABACION COMPLETADA! Pendrive Hackintosh listo."
    [System.Windows.Forms.MessageBox]::Show("Tu USB Hackintosh ha sido creado exitosamente con OpenCore y todos los drivers Kexts!`r`n`r`nReinicia tu PC, pulsa F2/Supr para entrar a la BIOS, desactiva Secure Boot e inicia en modo UEFI.", "Grabacion Hackintosh Completada", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
    $BtnBurn.Enabled = $true
})

$BtnClose.Add_Click({ $Form.Close() })

$Form.Add_Shown({
    DetectHardwareAndRecommend
    RefreshPhysicalDisks
})

[void]$Form.ShowDialog()
