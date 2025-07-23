#!/bin/bash

# Exit on any error
set -e

echo "🚀 Production Build for Render Deployment"

# Set production environment
export NODE_ENV=production
export VITE_API_URL=""

echo "🔧 Installing frontend dependencies..."
cd frontend
npm install --production=false
echo "✅ Frontend dependencies installed"

echo "🏗️  Building frontend for production..."
npm run build
echo "✅ Frontend built successfully"

# Verify build output
if [ -d "dist" ]; then
    echo "📦 Build output verified in frontend/dist"
    ls -la dist/
    echo "📁 Contents of dist/assets:"
    ls -la dist/assets/ || echo "No assets directory found"
else
    echo "❌ Build failed - no dist folder found"
    exit 1
fi

echo "🔧 Installing backend dependencies..."
cd ../backend
npm install --production=true
echo "✅ Backend dependencies installed"

echo "🚀 Production build completed successfully!"
echo "📁 Frontend build will be served from backend at /frontend/dist"

# Verify that the built files are correct
cd ../frontend/dist
if [ -f "index.html" ]; then
    echo "📄 Checking index.html for production build markers..."
    if grep -q "/@vite/client" index.html; then
        echo "⚠️  WARNING: Development Vite client found in build!"
        echo "This suggests the build is not in production mode."
    else
        echo "✅ Production build verified - no development scripts found"
    fi
fi