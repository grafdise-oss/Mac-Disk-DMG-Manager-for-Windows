[CmdletBinding()]
param()

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

[System.Windows.Forms.Application]::EnableVisualStyles()

# Launch Edge App mode if msedge.exe is installed, loading exact HTML App
$appHtml = "$PSScriptRoot\TransMac_App.html"
if (-not (Test-Path $appHtml)) {
    $appHtml = "$env:TEMP\TransMac_App.html"
}

if (Test-Path $appHtml) {
    Start-Process -FilePath "msedge.exe" -ArgumentList "--app=`"file:///$appHtml`" --new-window" -ErrorAction SilentlyContinue
    exit
}

# Fallback WinForms runner if Edge is absent
$Form = New-Object System.Windows.Forms.Form
$Form.Text = "TransMac 11 Pro para Windows 11"
$Form.Size = New-Object System.Drawing.Size(960, 750)
$Form.StartPosition = "CenterScreen"
$Form.BackColor = [System.Drawing.Color]::FromArgb(15, 23, 42)

[void]$Form.ShowDialog()
