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

VAULT_ADDR_VALUE=$(grep -E '^VAULT_ADDR=' "$ENV_FILE" | cut -d= -f2-)
PROMETHEUS_TARGET=$(echo "$VAULT_ADDR_VALUE" | sed -e 's#^[a-zA-Z]*://##')
export PROMETHEUS_TARGET

echo "Starting services with docker-compose..."
docker-compose up -d --build
