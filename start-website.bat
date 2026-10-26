@echo off
SET "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
cd /d "%~dp0"
echo Starting AI School Raipur Website on http://localhost:5174 ...
start "" "http://localhost:5174"
node dev-server.mjs
pause
