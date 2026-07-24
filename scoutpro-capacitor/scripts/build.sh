#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  ScoutPro — Master Build & Sync Script                                  ║
# ║  Usage: ./scripts/build.sh [ios|android|all]                            ║
# ╚══════════════════════════════════════════════════════════════════════════╝
set -euo pipefail

PLATFORM="${1:-all}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# ── Colour helpers ───────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✔  $*${NC}"; }
warn() { echo -e "${YELLOW}⚠  $*${NC}"; }
err()  { echo -e "${RED}✖  $*${NC}"; exit 1; }

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   ScoutPro Capacitor Build Script    ║"
echo "╚══════════════════════════════════════╝"
echo ""

cd "$ROOT"

# ── 1. Node dependency check ─────────────────────────────────────────────────
if ! command -v node &>/dev/null; then err "Node.js not found. Install from https://nodejs.org (≥18)"; fi
if ! command -v npm  &>/dev/null; then err "npm not found."; fi
ok "Node $(node -v) / npm $(npm -v)"

# ── 2. Install dependencies ──────────────────────────────────────────────────
echo ""
echo "▶ Installing npm dependencies..."
npm install
ok "npm install complete"

# ── 3. Validate www/ folder ──────────────────────────────────────────────────
echo ""
echo "▶ Checking www/ assets..."
if [ ! -f "$ROOT/www/index.html" ]; then
    err "www/index.html not found. Make sure your web app files are in www/"
fi
ok "www/index.html found"

# ── 4. Capacitor sync ────────────────────────────────────────────────────────
echo ""
echo "▶ Running: npx cap sync"
npx cap sync
ok "Capacitor sync complete"

# ── 5. Platform-specific builds ──────────────────────────────────────────────
build_ios() {
    echo ""
    echo "▶ Building iOS..."
    if ! command -v xcodebuild &>/dev/null; then
        warn "Xcode not found. Skipping iOS build. (macOS + Xcode required)"
        echo "   → To open manually: npx cap open ios"
        return
    fi
    npx cap build ios --configuration release
    ok "iOS build complete"
    echo "   → Archive in Xcode: Product → Archive → Distribute App → App Store Connect"
}

build_android() {
    echo ""
    echo "▶ Building Android..."
    if [ ! -d "$ROOT/android" ]; then
        err "android/ folder missing. Run: npx cap add android"
    fi
    cd "$ROOT/android"
    if [ ! -f "./gradlew" ]; then
        err "gradlew not found. Run: npx cap add android"
    fi
    chmod +x ./gradlew
    ./gradlew bundleRelease
    AAB_PATH="$ROOT/android/app/build/outputs/bundle/release/app-release.aab"
    if [ -f "$AAB_PATH" ]; then
        ok "Android AAB built: $AAB_PATH"
        echo "   → Upload this .aab file to Google Play Console"
    else
        warn "AAB not found at expected path. Check Gradle output above."
    fi
    cd "$ROOT"
}

case "$PLATFORM" in
    ios)     build_ios     ;;
    android) build_android ;;
    all)     build_ios; build_android ;;
    *)       err "Unknown platform: $PLATFORM. Use ios | android | all" ;;
esac

echo ""
ok "ScoutPro build script finished."
echo ""
