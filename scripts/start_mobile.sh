#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR/mobile"

if [[ ! -f .env ]]; then
  echo "❌ mobile/.env is missing. Run: cp mobile/.env.example mobile/.env"
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "ℹ️ Installing mobile dependencies..."
  npm install
fi

echo "✅ Starting Expo"
npm run start
