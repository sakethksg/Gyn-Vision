#!/usr/bin/env bash
# Gyn-Vision — start backend + frontend
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "========================================="
echo "  Gyn-Vision Dev Server"
echo "========================================="

# ── Backend ──────────────────────────────────
echo ""
echo "▶ Starting backend (port 8000)..."
cd "$ROOT/backend"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "  Backend PID: $BACKEND_PID"

# ── Frontend ─────────────────────────────────
echo ""
echo "▶ Starting frontend (port 3000)..."
cd "$ROOT/frontend"
npm run dev &
FRONTEND_PID=$!
echo "  Frontend PID: $FRONTEND_PID"

echo ""
echo "========================================="
echo "  Backend  → http://localhost:8000"
echo "  Docs     → http://localhost:8000/docs"
echo "  Frontend → http://localhost:3000"
echo "========================================="
echo "  Press Ctrl+C to stop both servers"
echo ""

# Graceful shutdown on Ctrl+C
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

wait
