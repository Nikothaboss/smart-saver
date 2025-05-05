#!/bin/bash

set -e

log() {
  echo -e "\n\033[1;34m🔹 $1\033[0m"
}

success() {
  echo -e "\n\033[1;32m✅ $1\033[0m"
}

warning() {
  echo -e "\n\033[1;33m⚠️  $1\033[0m"
}

error() {
  echo -e "\n\033[1;31m❌ $1\033[0m"
}

log "📦 Starting Docker containers (DB, etc)..."
docker compose up -d

log "📁 Installing dependencies..."
pnpm install

log "🔧 Generating Prisma client..."
pnpm dlx prisma generate

log "🗑️ Resetting the database (no prompt)..."
pnpm dlx prisma migrate reset --force --skip-seed

log "📚 Running database migration..."
pnpm dlx prisma migrate dev --name init

log "🌱 Seeding the database..."
pnpm seed

# log "🔍 Opening Prisma Studio..."
# pnpm dlx prisma studio

log "🚀 Starting Next.js app..."
warning "To inspect the database, run: pnpm studio"
pnpm dev

