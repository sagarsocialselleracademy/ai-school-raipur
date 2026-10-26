@echo off
SET "GH_BIN=%LOCALAPPDATA%\Programs\gh\bin"
SET "GIT_CMD=%LOCALAPPDATA%\Programs\MinGit\cmd"
SET "PATH=%GH_BIN%;%GIT_CMD%;%LOCALAPPDATA%\Programs\nodejs;%PATH%"
cd /d "%~dp0"

echo ========================================================
echo   Publishing AI School Raipur updates to GitHub...
echo ========================================================

git add -A
git diff --cached --quiet
if %ERRORLEVEL% NEQ 0 (
    git commit -m "Update AI School Raipur landing page"
)

echo.
echo [1/2] Pushing source code to 'main' branch...
git push -u origin main

echo.
echo [2/2] Building and pushing static site to 'hostinger-deploy' branch...
node deploy-dist.cjs

echo.
echo ========================================================
echo   Done! Both 'main' and 'hostinger-deploy' are updated!
echo ========================================================
pause
