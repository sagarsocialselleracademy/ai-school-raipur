@echo off
SET "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%LOCALAPPDATA%\Programs\nodejs;%PATH%"
cd /d "%~dp0"

echo ========================================================
echo   Publishing AI School Raipur updates to GitHub...
echo ========================================================

call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed! Please fix any errors before pushing.
    pause
    exit /b 1
)

git add -A
set /p COMMIT_MSG="Enter a short description of your changes (or press Enter for 'Update landing page'): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Update landing page

git commit -m "%COMMIT_MSG%"
git push -u origin main

echo.
echo ========================================================
echo   Done! Your changes have been pushed to GitHub.
echo ========================================================
pause
