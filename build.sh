#!/data/data/com.termux/files/usr/bin/bash
set -e

echo "🚀 Starting build for Rivio E-commerce Store..."

# Ensure pnpm is available
if ! command -v pnpm &> /dev/null
then
    echo "❌ pnpm not found. Installing..."
    npm install -g pnpm
fi

# Build FRONTEND
echo "📦 Building Frontend..."
cd ~/rivio-ecommerce-store/frontend
pnpm install
pnpm build

# Build BACKEND
echo "📦 Building Backend..."
cd ~/rivio-ecommerce-store/backend
pnpm install
pnpm build

echo "✅ Build complete!"
echo ""
echo "👉 Run backend: cd ~/rivio-ecommerce-store/backend && pnpm start"
echo "👉 Run frontend: cd ~/rivio-ecommerce-store/frontend && pnpm start"
