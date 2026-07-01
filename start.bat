@echo off
REM ============================================================
REM  Zenorio - arranque rapido (Windows)
REM  Doble clic en este archivo para abrir la web.
REM ============================================================
setlocal
set "PATH=%PATH%;C:\Program Files\nodejs"
cd /d "%~dp0"

if not exist "node_modules\" (
  echo Instalando dependencias por primera vez...
  call npm install --no-audit --no-fund
)

echo.
echo   Zenorio sirviendo en  http://localhost:3000
echo   (Cierra esta ventana para detener el servidor)
echo.
start "" http://localhost:3000
node server.js
endlocal
