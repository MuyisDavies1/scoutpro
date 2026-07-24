package com.scoutpro.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

/**
 * ScoutPro — MainActivity
 *
 * Extends BridgeActivity (Capacitor's WebView bridge).
 * All plugin registration is handled automatically via @CapacitorPlugin annotations.
 *
 * Add any native Android startup logic here — e.g. requesting
 * runtime permissions, setting up deep link handling, etc.
 */
public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // ScoutPro custom startup code (if any) goes here
    }
}
