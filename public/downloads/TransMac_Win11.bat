@echo off
:: ==============================================================================
:: TransMac 11 para Windows 11 - Lanzador con Privilegios de Administrador
:: ==============================================================================
setlocal EnableDelayedExpansion
title TransMac 11 para Windows 11 - Iniciando...

echo ==============================================================================
echo   TransMac 11 Engine para Windows 11 (Lectura de Discos Fisicos)
echo ==============================================================================
echo.

:: Comprobar privilegios de Administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [i] Solicitando permisos de Administrador para acceder a discos fisicos USB...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process cmd -ArgumentList '/c `\"%~f0`\"' -Verb RunAs"
    exit /b
)

:: Cambiar al directorio del script
cd /d "%~dp0"

echo [i] Privilegios de Administrador confirmados.
echo [i] Abriendo interfaz grafica nativa de TransMac 11...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0TransMac_GUI.ps1"

if %errorLevel% neq 0 (
    echo.
    echo Ocurrio un error al ejecutar TransMac_GUI.ps1.
    echo Asegurate de que Windows PowerShell este habilitado.
    pause
)
