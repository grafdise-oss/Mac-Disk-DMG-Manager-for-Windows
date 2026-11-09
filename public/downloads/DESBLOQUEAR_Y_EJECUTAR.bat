@echo off
chcp 65001 >nul
title Desbloquear y Ejecutar TransMac 11 Pro

echo ==============================================================================
echo   Desbloqueador de Restricciones Windows SmartScreen / ExecutionPolicy
echo ==============================================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem -LiteralPath '%~dp0' -Recurse | Unblock-File -ErrorAction SilentlyContinue"

echo [OK] Archivos desbloqueados.
echo.
echo Iniciando TransMac 11 Portatil...
echo.

set "TARGET_BAT=%~dp0TransMac_Portatil.bat"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath 'cmd.exe' -ArgumentList '/c ""%TARGET_BAT%""' -Verb RunAs"

exit /b 0
