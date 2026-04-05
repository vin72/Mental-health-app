#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR/backend"

if [[ ! -f .env ]]; then
  echo "❌ backend/.env is missing. Run: cp backend/.env.example backend/.env"
  exit 1
fi

if [[ ! -d .venv ]]; then
  echo "ℹ️ Creating backend virtual env..."
  python -m venv .venv
fi

# shellcheck disable=SC1091
source .venv/bin/activate

if ! python -c "import fastapi" >/dev/null 2>&1; then
  echo "ℹ️ Installing backend dependencies..."
  pip install -e .[dev]
fi

echo "✅ Starting backend on http://localhost:8000"
uvicorn app.main:app --reload
