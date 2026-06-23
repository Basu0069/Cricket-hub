#!/bin/bash
set -e

echo "=== Installing backend dependencies ==="
cd backend && npm install && cd ..

echo "=== Installing frontend dependencies ==="
cd frontend && npm install

echo "=== Building React frontend ==="
npm run build

echo "=== Build complete! ==="
