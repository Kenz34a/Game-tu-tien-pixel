@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Can cai Node.js LTS 22.13 tro len tu https://nodejs.org
  pause
  exit /b 1
)
call npm run play
if errorlevel 1 (
  echo Game chua khoi dong duoc. Xem loi ben tren.
  pause
  exit /b 1
)
