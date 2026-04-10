@echo off
setlocal

cd /d "%~dp0"

set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"
if not exist "%NPM_CMD%" (
  echo [ERROR] Node.js not found at "%NPM_CMD%".
  echo Please install Node.js LTS first.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 set "PATH=C:\Program Files\nodejs;%PATH%"

if not exist "node_modules" (
  echo [INFO] node_modules not found. Installing dependencies...
  call "%NPM_CMD%" install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
)

echo [INFO] Starting app...
call "%NPM_CMD%" start
if errorlevel 1 (
  echo [ERROR] App failed to start.
  pause
  exit /b 1
)

endlocal
