#!/usr/bin/env bash
# Deploy script for Vault Adoption Dashboard
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
  cp .env.example "$ENV_FILE"
fi

echo "Installing dependencies and building the dashboard..."
npm install
npm run build

echo "Starting services with docker-compose..."
docker-compose up -d --build
