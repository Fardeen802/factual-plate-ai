#!/bin/bash

# Exit on any error
set -e

echo "🔧 Installing frontend dependencies..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"

echo "🏗️  Building frontend for production..."
npm run build
echo "✅ Frontend built successfully"

# Verify build output
if [ -d "dist" ]; then
    echo "📦 Build output verified in frontend/dist"
    ls -la dist/
else
    echo "❌ Build failed - no dist folder found"
    exit 1
fi

cd ../backend
echo "🔧 Installing backend dependencies..."
npm install
echo "✅ Backend dependencies installed"

echo "🚀 Build completed successfully!"
echo "📁 Frontend build will be served from backend at /frontend/dist"