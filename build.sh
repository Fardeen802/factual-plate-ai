#!/bin/bash

# Exit on any error
set -e

echo "🔧 Installing frontend dependencies..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"

echo "🏗️  Building frontend..."
npm run build
echo "✅ Frontend built successfully"

cd ../backend
echo "🔧 Installing backend dependencies..."
npm install
echo "✅ Backend dependencies installed"

echo "🚀 Build completed successfully!"