@echo off
echo ============================================
echo Production Race Visualizer - Setup Script
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found: 
node --version
echo.

REM Check if ffmpeg is installed
ffmpeg -version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: ffmpeg is not installed or not in PATH
    echo Video export will not work without ffmpeg
    echo Download from: https://ffmpeg.org/download.html
    echo.
) else (
    echo ffmpeg found:
    ffmpeg -version | findstr "version"
    echo.
)

echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo To start the application:
echo.
echo   Terminal 1 - Backend:
echo   cd backend
echo   npm start
echo.
echo   Terminal 2 - Frontend:
echo   cd frontend
echo   npm start
echo.
echo Frontend will open at http://localhost:3000
echo Backend runs on http://localhost:5000
echo.
pause
