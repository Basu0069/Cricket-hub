#!/bin/bash
set -e

echo "=== Installing backend dependencies ==="
cd backend && npm install && cd ..

echo "=== Installing frontend dependencies ==="
cd frontend && npm install

echo "=== Building React frontend ==="
# Bake Google OAuth client ID into the frontend bundle (Render exposes GOOGLE_CLIENT_ID at build time)
export REACT_APP_GOOGLE_CLIENT_ID="${REACT_APP_GOOGLE_CLIENT_ID:-$GOOGLE_CLIENT_ID}"
export REACT_APP_BACKEND_URL="${REACT_APP_BACKEND_URL:-}"
npm run build

echo "=== Build complete! ==="
