#!/usr/bin/env bash
# =============================================================================
# deploy.sh — Zero-downtime deployment for La Terrasse Saint-Ferreol
#
# Usage:  ./scripts/deploy.sh
#
# Flow:  git pull → pnpm install → backup dist → build → pm2 restart
# On build failure the previous dist/ is restored.
# =============================================================================
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/laterrasse-saintferreol}"
LOG_FILE="${APP_DIR}/deploy.log"
PM2_APP_NAME="laterrasse"

log() {
  local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $*"
  echo "$msg"
  echo "$msg" >> "$LOG_FILE"
}

cd "$APP_DIR"

log "=== Deployment started ==="

# 1. Pull latest code
log "Pulling latest changes…"
git pull origin main

# 2. Install dependencies
log "Installing dependencies…"
pnpm install --frozen-lockfile

# 3. Backup current build
if [ -d "dist" ]; then
  log "Backing up current build…"
  rm -rf dist-prev
  mv dist dist-prev
fi

# 4. Build (Astro outputs to dist/)
log "Building site…"
if pnpm build; then
  log "Build succeeded."
  rm -rf dist-prev
else
  log "BUILD FAILED — rolling back to previous version."
  if [ -d "dist-prev" ]; then
    mv dist-prev dist
  fi
  exit 1
fi

# 5. Restart Node process via PM2
log "Restarting PM2 process…"
if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
  pm2 restart "$PM2_APP_NAME"
else
  pm2 start ecosystem.config.cjs
fi

log "=== Deployment completed successfully ==="
