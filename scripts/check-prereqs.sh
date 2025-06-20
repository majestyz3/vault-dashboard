#!/usr/bin/env bash
# Simple prerequisite check script for Vault Adoption Dashboard

# check node installation
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required but was not found. Please install Node.js >= 18." >&2
  exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
REQUIRED_MAJOR=18
MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)

if [ "$MAJOR" -lt "$REQUIRED_MAJOR" ]; then
  echo "Node.js version $NODE_VERSION detected. Please upgrade to >= 18." >&2
  exit 1
fi

echo "All prerequisites satisfied. Node.js version $NODE_VERSION found."

