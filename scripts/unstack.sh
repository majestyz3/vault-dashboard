#!/usr/bin/env bash
# Cleanup script for the Vault Adoption Dashboard
# Stops and removes the Docker container and image built for the dashboard.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

if [ -f docker-compose.yml ]; then
  echo "Stopping and removing containers via docker-compose..."
  docker-compose down --volumes --remove-orphans --rmi local
else
  echo "docker-compose.yml not found. Attempting manual cleanup..."
  if docker ps -a --format '{{.Names}}' | grep -q '^vault-dashboard$'; then
    docker rm -f vault-dashboard
  fi
  if docker images --format '{{.Repository}}:{{.Tag}}' | grep -q '^vault-dashboard:latest$'; then
    docker rmi -f vault-dashboard:latest
  fi
fi

# Remove dangling images if any
if command -v docker >/dev/null 2>&1; then
  docker image prune -f >/dev/null 2>&1 || true
fi

echo "Cleanup complete."
