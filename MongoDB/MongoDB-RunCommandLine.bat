@echo off
@setlocal enableextensions
@cd /d "%~dp0"

:: Run on the command-line (do NOT install the Windows Service).
set InstallWindowsService=false

@call MongoDB.bat

:: Press any key to continue...
pause
