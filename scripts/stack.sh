#!/usr/bin/env bash
# Deploy script for Vault Adoption Dashboard
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

STACK_JSON="/Users/zarkesh/Documents/GitHub/vault-stack/vault10-init.json"

if [ ! -f "$STACK_JSON" ]; then
  echo "Vault stack init file not found: $STACK_JSON" >&2
  exit 1
fi

ROOT_TOKEN=$(grep -o '"root_token"[^"]*"[^"]*"' "$STACK_JSON" | sed -E 's/.*"root_token"[^"]*"([^"]*)"/\1/')

if [ -z "$ROOT_TOKEN" ]; then
  echo "Could not extract root_token from $STACK_JSON" >&2
  exit 1
fi

ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
  cp .env.example "$ENV_FILE"
fi

if grep -q '^VAULT_TOKEN=' "$ENV_FILE"; then
  sed -i.bak "s/^VAULT_TOKEN=.*/VAULT_TOKEN=$ROOT_TOKEN/" "$ENV_FILE"
else
  echo "VAULT_TOKEN=$ROOT_TOKEN" >> "$ENV_FILE"
fi

rm -f "$ENV_FILE.bak"

echo "Installing dependencies and building the dashboard..."
npm install
npm run build

echo "Starting services with docker-compose..."
docker-compose up -d --build
