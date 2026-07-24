#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  ScoutPro — First-Time Platform Setup Script                            ║
# ║  Run once after cloning the repository to initialise iOS & Android.     ║
# ║  Usage: ./scripts/setup.sh                                              ║
# ╚══════════════════════════════════════════════════════════════════════════╝
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
ok()    { echo -e "${GREEN}✔  $*${NC}"; }
info()  { echo -e "${CYAN}ℹ  $*${NC}"; }
warn()  { echo -e "${YELLOW}⚠  $*${NC}"; }
err()   { echo -e "${RED}✖  $*${NC}"; exit 1; }
step()  { echo -e "\n${CYAN}━━━ $* ━━━${NC}"; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   ScoutPro — First-time Setup Script     ║"
echo "╚══════════════════════════════════════════╝"

# ── Prerequisites check ──────────────────────────────────────────────────────
step "Checking prerequisites"

command -v node  &>/dev/null || err "Node.js ≥18 required: https://nodejs.org"
command -v npm   &>/dev/null || err "npm required"
command -v git   &>/dev/null || warn "git not found (optional but recommended)"

NODE_MAJOR=$(node -e "process.stdout.write(process.versions.node.split('.')[0])")
if [ "$NODE_MAJOR" -lt 18 ]; then err "Node.js 18+ required (found $(node -v))"; fi
ok "Node $(node -v) / npm $(npm -v)"

# ── Install dependencies ─────────────────────────────────────────────────────
step "Installing npm dependencies"
npm install
ok "Dependencies installed"

# ── TypeScript compile ───────────────────────────────────────────────────────
step "Compiling capacitor.config.ts → capacitor.config.json"
npx tsc --target ES2020 --module commonjs --esModuleInterop \
        --outDir .cap_tmp capacitor.config.ts 2>/dev/null || true

# Capacitor CLI can also read the .ts directly in v6 — just run sync
ok "Config ready"

# ── Doctor check ─────────────────────────────────────────────────────────────
step "Running Capacitor doctor"
npx cap doctor || warn "Doctor reported warnings — review above before proceeding"

# ── Add platforms ────────────────────────────────────────────────────────────
step "Adding platforms"

if [ -d "$ROOT/ios" ] && ls "$ROOT/ios/App/"*.xcworkspace &>/dev/null 2>&1; then
    ok "iOS platform already added — skipping"
else
    info "Adding iOS platform..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        npx cap add ios
        ok "iOS platform added"
    else
        warn "iOS platform can only be added on macOS. Skipping."
    fi
fi

if [ -d "$ROOT/android/app/build.gradle" ] || [ -f "$ROOT/android/gradlew" ]; then
    ok "Android platform already added — skipping"
else
    info "Adding Android platform..."
    npx cap add android
    ok "Android platform added"
fi

# ── Initial sync ─────────────────────────────────────────────────────────────
step "Syncing web assets to native platforms"
npx cap sync
ok "Sync complete"

# ── Summary ──────────────────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete!                                   ║"
echo "╠══════════════════════════════════════════════════════════════════════╣"
echo "║  Next steps:                                                         ║"
echo "║                                                                      ║"
echo "║  iOS (macOS only):                                                   ║"
echo "║    npx cap open ios        → Opens in Xcode                         ║"
echo "║    npx cap run ios         → Runs on simulator / device             ║"
echo "║                                                                      ║"
echo "║  Android:                                                            ║"
echo "║    npx cap open android    → Opens in Android Studio                ║"
echo "║    npx cap run android     → Runs on emulator / device              ║"
echo "║                                                                      ║"
echo "║  After code changes:                                                 ║"
echo "║    npx cap sync            → Copy latest web files + update plugins ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
