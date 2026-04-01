#!/bin/bash

echo "============================================"
echo "Production Race Visualizer - Setup Script"
echo "============================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js found:"
node --version
echo ""

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "WARNING: ffmpeg is not installed"
    echo "Video export will not work without ffmpeg"
    echo "Install via: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)"
    echo ""
else
    echo "ffmpeg found:"
    ffmpeg -version | head -n 1
    echo ""
fi

echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi
cd ..

echo ""
echo "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "To start the application:"
echo ""
echo "  Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm start"
echo ""
echo "  Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Frontend will open at http://localhost:3000"
echo "Backend runs on http://localhost:5000"
echo ""
