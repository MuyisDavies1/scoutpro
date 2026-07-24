# ScoutPro — Web Deployment & Mobile App Conversion Guide
**Version:** 1.0 | **Date:** June 2026

---

## PART 1: WEB DEPLOYMENT

### Option A: Netlify (Recommended — 5 Minutes)

**Step 1:** Go to [https://netlify.com](https://netlify.com) and create a free account.

**Step 2:** From your dashboard, click **"Add new site" → "Deploy manually"**.

**Step 3:** Drag and drop the `football-scouting-app/` folder into the upload zone.

**Step 4:** Netlify assigns a URL like `https://amazing-name-123.netlify.app`

**Step 5 (Optional):** Add a custom domain under **Site settings → Domain management**.

```bash
# Alternative: Deploy via Netlify CLI
npm install -g netlify-cli
netlify login
cd football-scouting-app
netlify deploy --prod --dir=.
```

---

### Option B: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to app folder
cd football-scouting-app

# Deploy (follow prompts)
vercel --prod

# Output: https://scoutpro.vercel.app
```

---

### Option C: GitHub Pages (Free Forever)

```bash
# Step 1: Create GitHub repository
git init
git add .
git commit -m "Initial ScoutPro deployment"
git remote add origin https://github.com/yourusername/scoutpro.git
git push -u origin main

# Step 2: Enable GitHub Pages
# Go to: Repository → Settings → Pages
# Source: Deploy from branch → main → / (root)
# URL: https://yourusername.github.io/scoutpro/
```

---

### Option D: Custom Linux Server (Nginx)

```bash
# Install Nginx
sudo apt update && sudo apt install nginx -y

# Upload files via SCP
scp -r football-scouting-app/ user@your-server:/var/www/scoutpro/

# Configure Nginx
sudo nano /etc/nginx/sites-available/scoutpro
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/scoutpro;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/html text/css application/javascript;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|ico)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/scoutpro /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# Add free SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## PART 2: PWA (PROGRESSIVE WEB APP) SETUP

PWA allows users to install ScoutPro directly from the browser — no App Store required.

### Step 1: Create manifest.json

Save this as `football-scouting-app/manifest.json`:

```json
{
  "name": "ScoutPro — Football Scouting Platform",
  "short_name": "ScoutPro",
  "description": "Professional football player scouting and evaluation platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#00D4AA",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["sports", "productivity", "business"],
  "screenshots": [],
  "shortcuts": [
    {
      "name": "Add Player",
      "url": "/?action=add-player",
      "description": "Quickly add a new player"
    },
    {
      "name": "View Dashboard",
      "url": "/?page=dashboard",
      "description": "View scouting dashboard"
    }
  ]
}
```

### Step 2: Create Service Worker (sw.js)

Save this as `football-scouting-app/sw.js`:

```javascript
const CACHE_NAME = 'scoutpro-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/data.js',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install: Cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate: Clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// Fetch: Serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
```

### Step 3: Register Service Worker in index.html

Add before `</body>` in `index.html`:

```html
<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#00D4AA">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="ScoutPro">
<link rel="apple-touch-icon" href="/icons/icon-192x192.png">

<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('ScoutPro PWA: Service Worker registered'))
      .catch(err => console.log('SW Error:', err));
  }
</script>
```

---

## PART 3: MOBILE APP WITH CAPACITOR.JS

### Prerequisites

```bash
# Install Node.js (v18+) from https://nodejs.org
node --version   # Should be 18.x or higher
npm --version    # Should be 9.x or higher

# Install Capacitor CLI globally
npm install -g @capacitor/cli
```

### Step 1: Initialize Capacitor

```bash
cd football-scouting-app

# Initialize npm project
npm init -y

# Install Capacitor core
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor (follow prompts)
npx cap init "ScoutPro" "com.scoutpro.app" --web-dir "."
```

### Step 2: Add Platforms

```bash
# Add iOS platform (Mac only)
npm install @capacitor/ios
npx cap add ios

# Add Android platform (Windows/Mac/Linux)
npm install @capacitor/android
npx cap add android
```

### Step 3: Sync Web Assets

```bash
# Copy web files to native platforms
npx cap sync

# Open in native IDE
npx cap open ios      # Opens Xcode (Mac only)
npx cap open android  # Opens Android Studio
```

---

## PART 4: iOS APP STORE SUBMISSION

### Requirements
- Mac computer with macOS 13+ (Ventura or later)
- Xcode 15+ (free from App Store)
- Apple Developer Program membership ($99/year)
- [enroll at developer.apple.com](https://developer.apple.com/programs/)

### Step 1: Configure in Xcode

```
1. Open ios/App/App.xcworkspace in Xcode
2. Select "App" target → Signing & Capabilities
3. Set Bundle Identifier: com.scoutpro.app
4. Select your Apple Developer Team
5. Enable Automatic Signing
```

### Step 2: App Icons

Create icons at these exact sizes (PNG, no transparency for App Store):
- 1024×1024 (App Store listing)
- 180×180 (iPhone @3x)
- 120×120 (iPhone @2x)
- 167×167 (iPad Pro)
- 152×152 (iPad @2x)

Use [appicon.co](https://appicon.co) to generate all sizes from a single 1024×1024 image.

### Step 3: Build & Archive

```
1. In Xcode: Product → Archive
2. Organizer window opens automatically
3. Click "Distribute App" → "App Store Connect"
4. Follow wizard to upload to App Store Connect
```

### Step 4: App Store Connect Setup

```
1. Go to https://appstoreconnect.apple.com
2. Create new app: My Apps → (+) → New App
3. Fill in:
   - Name: ScoutPro
   - Bundle ID: com.scoutpro.app
   - SKU: scoutpro-001
   - Primary Language: English
4. Add screenshots (6.7" iPhone required)
5. Write App Description (max 4000 chars)
6. Set Category: Sports
7. Set Age Rating: 4+
8. Submit for Review
```

**Apple Review Timeline:** 1–3 business days

---

## PART 5: GOOGLE PLAY STORE SUBMISSION

### Requirements
- Android Studio (free, Windows/Mac/Linux)
- Google Play Developer account ($25 one-time fee)
- [register at play.google.com/apps/publish](https://play.google.com/apps/publish)

### Step 1: Configure in Android Studio

```
1. Open android/ folder in Android Studio
2. Edit android/app/src/main/res/values/strings.xml:
   <string name="app_name">ScoutPro</string>
3. Edit android/app/build.gradle:
   applicationId "com.scoutpro.app"
   versionCode 1
   versionName "1.0.0"
```

### Step 2: App Icons

```bash
# Generate icons using Android Asset Studio
# or use appicon.co → Android option
# Place in: android/app/src/main/res/mipmap-*/
# Required: mdpi(48), hdpi(72), xhdpi(96), xxhdpi(144), xxxhdpi(192)
```

### Step 3: Generate Signed APK/AAB

```
1. Build → Generate Signed Bundle/APK
2. Choose: Android App Bundle (.aab) — required for Play Store
3. Create new keystore:
   - Key store path: scoutpro-release.jks
   - Password: (strong password — SAVE THIS!)
   - Key alias: scoutpro-key
4. Build → Release
5. Output: android/app/release/app-release.aab
```

### Step 4: Google Play Console

```
1. Go to https://play.google.com/apps/publish
2. Create application → Select language → Enter title: ScoutPro
3. Fill in Store listing:
   - Short description (80 chars): Professional football player scouting platform
   - Full description (4000 chars): ...
   - Category: Sports
   - Content rating: Everyone
4. Upload screenshots (phone required + 7" tablet recommended)
5. Upload app-release.aab to Production track
6. Set countries/regions
7. Submit for review
```

**Google Play Review Timeline:** 3–7 days for new apps, 1–3 days for updates

---

## PART 6: DEPLOYMENT COMPARISON

| Platform         | Cost         | Setup Time  | Custom Domain | Offline | App Store | Best For               |
|------------------|--------------|-------------|---------------|---------|-----------|------------------------|
| Netlify          | Free         | 5 minutes   | ✅ (free SSL) | ❌      | ❌        | Quick web deployment   |
| Vercel           | Free         | 10 minutes  | ✅ (free SSL) | ❌      | ❌        | Developer-friendly     |
| GitHub Pages     | Free         | 15 minutes  | ✅ (custom)   | ❌      | ❌        | Open source projects   |
| Custom Server    | ~$5-20/mo    | 1-2 hours   | ✅ (full)     | ❌      | ❌        | Full control           |
| PWA              | Free         | 30 minutes  | ✅            | ✅      | ❌        | Install from browser   |
| iOS App Store    | $99/year     | 1-2 days    | N/A           | ✅      | ✅ iOS    | Maximum iOS reach      |
| Google Play      | $25 one-time | 1-2 days    | N/A           | ✅      | ✅ Android| Maximum Android reach  |

---

## RECOMMENDED DEPLOYMENT PATH

### Phase 1 — Today (5 minutes)
```
Deploy to Netlify → Live web app accessible worldwide
URL: https://scoutpro.netlify.app
```

### Phase 2 — This Week (2 hours)
```
Add PWA support → Users can install from browser on iOS and Android
No App Store review required — instant availability
```

### Phase 3 — This Month (1-2 weeks)
```
Submit to App Stores via Capacitor.js
iOS App Store + Google Play Store
Maximum reach and professional credibility
```

---

*ScoutPro Deployment Guide — FIFA-Licensed Football Agent Platform*
