# ScoutPro — Capacitor.js Mobile Wrapper

## Overview
This project wraps the ScoutPro football scouting web app as a native iOS and Android application using Capacitor.js v6.

**Live web app:** https://bzu6wxst.scispace.co
**Bundle ID:** `com.scoutpro.app`

---

## Prerequisites

| Tool | Version | Required For |
|------|---------|--------------|
| Node.js | ≥18.0 | All platforms |
| npm | ≥9.0 | All platforms |
| Xcode | ≥15 | iOS only (macOS) |
| CocoaPods | Latest | iOS only (macOS) |
| Android Studio | Electric Eel+ | Android |
| JDK | 17 | Android |

---

## Quick Start

```bash
# 1. First-time setup
bash scripts/setup.sh

# 2. Open in Xcode (macOS)
npx cap open ios

# 3. Open in Android Studio
npx cap open android

# 4. After any web code change
npx cap sync
```

---

## Project Structure

```
scoutpro-capacitor/
├── capacitor.config.ts          # App config (ID, plugins, server)
├── package.json                 # Dependencies
├── www/                         # ScoutPro web app
├── ios/                         # iOS native project
│   └── App/App/
│       ├── AppDelegate.swift    # Push, deep links
│       ├── Info.plist           # Privacy strings
│       └── Assets.xcassets/     # App icons (13 sizes)
├── android/                     # Android native project
│   └── app/src/main/
│       ├── AndroidManifest.xml  # Permissions, deep links
│       ├── java/.../MainActivity.java
│       └── res/                 # Icons, strings, styles
└── scripts/
    ├── setup.sh                 # First-time init
    └── build.sh                 # Release builder
```

---

## Building for Release

### iOS
```bash
# In Xcode: Product → Archive → Distribute App → App Store Connect
npx cap build ios --configuration release
```

### Android
```bash
cd android && ./gradlew bundleRelease
# Output: app/build/outputs/bundle/release/app-release.aab
```

---

## Scoring Formula (embedded in www/data.js)

```
Overall = (Technical × 28%) + (Tactical × 27%) + (Physical × 25%) + (Psychological × 20%)

Tier Classification:
  Elite:          ≥ 85
  High Prospect:  75–84
  Development:    65–74
  Monitor:        < 65
```

---

## App Store Requirements

### Apple App Store
- Apple Developer account: $99/year
- Review time: 1–3 business days
- Required: Privacy policy URL, 6.5" screenshots

### Google Play Store
- Google Play Developer account: $25 one-time
- Review time: 3–7 days (new apps)
- Required: Privacy policy URL, 512×512 icon, feature graphic

---

## Capacitor Plugins Included

| Plugin | Purpose |
|--------|---------|
| @capacitor/splash-screen | Branded loading screen |
| @capacitor/status-bar | Dark status bar theme |
| @capacitor/keyboard | Keyboard resize handling |
| @capacitor/local-notifications | Outreach reminders |
| @capacitor/push-notifications | Server push alerts |
| @capacitor/share | Share scouting reports |
| @capacitor/clipboard | Copy email templates |
| @capacitor/network | Offline detection |
| @capacitor/preferences | Secure key-value storage |

---

## Login Credentials (Demo)
- Email: `admin@scoutpro.com`
- Password: `admin123`
