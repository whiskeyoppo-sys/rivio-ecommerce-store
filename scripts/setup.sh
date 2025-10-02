#!/bin/bash
# Fully conceptualized - Project setup script
# Design choice: Automated setup for quick onboarding

set -e

echo "🚀 Setting up Rivio E-Commerce Store..."

# Check requirements
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "PNPM is required but not installed. Installing..."; npm install -g pnpm; }

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Setup environment
if [ ! -f .env ]; then
    echo "🔧 Setting up environment..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi

# Start services
echo "🐳 Starting Docker services..."
docker-compose up -d postgres redis

# Wait for services
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run migrations
echo "🗄️ Running database migrations..."
cd backend && pnpm prisma migrate dev && cd ..

# Seed database
echo "🌱 Seeding database..."
cd backend && pnpm prisma db seed && cd ..

echo "✅ Setup complete! Run 'pnpm dev' to start the development server."
