import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  /**
   * ─── App Identity ──────────────────────────────────────────────────────────
   * appId:   Reverse-domain bundle identifier.
   *          Must match exactly what is set in Xcode (iOS) and build.gradle (Android).
   * appName: Display name shown on the device home screen.
   */
  appId:   'com.scoutpro.app',
  appName: 'ScoutPro',

  /**
   * ─── Web Source ────────────────────────────────────────────────────────────
   * Points to the folder containing your built web assets (index.html etc.).
   * After `npm run build` these are copied here by Capacitor's sync command.
   */
  webDir: 'www',

  /**
   * ─── Server Configuration ──────────────────────────────────────────────────
   * During `npx cap run ios/android`, Capacitor can hot-reload from a live URL.
   * Comment out `url` for production builds so the app is fully bundled.
   */
  server: {
    // url: 'http://192.168.1.x:3000',   // ← uncomment for live-reload dev
    androidScheme: 'https',               // keeps localStorage accessible on Android
    cleartext: false,                     // disallow plain HTTP in production
    allowNavigation: [],                  // restrict external navigations
  },

  /**
   * ─── iOS Platform Config ───────────────────────────────────────────────────
   */
  ios: {
    contentInset:           'always',
    allowsLinkPreview:      false,
    scrollEnabled:          true,
    backgroundColor:        '#0f172a',
    preferredContentMode:   'mobile',
    /**
     * Minimum iOS version: 14.0
     * Required by WebKit features used in the app (localStorage, service workers).
     */
    minVersion: '14.0',
  },

  /**
   * ─── Android Platform Config ───────────────────────────────────────────────
   */
  android: {
    backgroundColor:  '#0f172a',
    allowMixedContent: false,
    captureInput:      true,
    webContentsDebuggingEnabled: false,  // set true only during development
    /**
     * Minimum SDK: 26 (Android 8.0 Oreo)
     * Target  SDK: 34 (Android 14) — required for Play Store submissions from Aug 2024
     */
    minWebViewVersion: 60,
  },

  /**
   * ─── Plugins Configuration ─────────────────────────────────────────────────
   */
  plugins: {
    /**
     * SplashScreen — shown while the WebView loads.
     * Replace android/app/src/main/res/drawable/splash.png with your custom art.
     */
    SplashScreen: {
      launchShowDuration:      2000,       // ms
      launchAutoHide:          true,
      backgroundColor:         '#0f172a',
      androidSplashResourceName: 'splash',
      androidScaleType:        'CENTER_CROP',
      showSpinner:             false,
      iosSpinnerStyle:         'large',
      spinnerColor:            '#10b981',
      splashFullScreen:        true,
      splashImmersive:         true,
    },

    /**
     * StatusBar — matches the app dark theme.
     */
    StatusBar: {
      style:           'DARK',
      backgroundColor: '#0f172a',
      overlaysWebView: false,
    },

    /**
     * Keyboard — push the WebView up when the keyboard appears.
     */
    Keyboard: {
      resize:             'body',
      style:              'DARK',
      resizeOnFullScreen: true,
    },

    /**
     * LocalNotifications — used for outreach reminders (optional).
     */
    LocalNotifications: {
      smallIcon:       'ic_stat_icon_config_sample',
      iconColor:       '#10b981',
      sound:           'beep.wav',
    },

    /**
     * PushNotifications — placeholder; configure with FCM/APNs credentials.
     */
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
