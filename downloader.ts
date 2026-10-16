import JSZip from 'jszip';

export const downloadAndroidApp = async (e?: React.MouseEvent) => {
  if (e) e.preventDefault();
  try {
    const res = await fetch('/standalone.html');
    if (!res.ok) throw new Error('File fetch failed');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vedic_pandit_android_app.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch {
    const a = document.createElement('a');
    a.href = '/standalone.html';
    a.download = 'vedic_pandit_android_app.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

export const downloadRealZip = async (e?: React.MouseEvent) => {
  if (e) e.preventDefault();

  // Method 1: Fetch the pre-built real zip file directly
  try {
    const res = await fetch('/vedic_pandit_app.zip');
    if (res.ok) {
      const blob = await res.blob();
      if (blob.size > 1000) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vedic_pandit_app.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return;
      }
    }
  } catch (err) {
    console.warn('Direct zip fetch failed, falling back to JSZip generator:', err);
  }

  // Method 2: Dynamic JSZip generation in memory
  try {
    const zip = new JSZip();

    let htmlContent = '';
    try {
      const res = await fetch('/standalone.html');
      if (res.ok) {
        htmlContent = await res.text();
      }
    } catch {
      // fallback
    }

    if (!htmlContent) {
      htmlContent = document.documentElement.outerHTML;
    }

    // Add standalone HTML for Android
    zip.file('vedic_pandit_android_app.html', htmlContent);
    // Add index.html for instant opening on Desktop/Web
    zip.file('index.html', htmlContent);

    // Add Android PWA Manifest
    zip.file(
      'manifest.json',
      JSON.stringify(
        {
          short_name: 'Vedic Pandit',
          name: 'Vedic Pandit — Acharya Jitender Shastri (Android App)',
          description: 'Vedic Astrology, Daily Rashifal, Pooja Booking & Certified Gem Consultant',
          start_url: '/',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#0a0518',
          theme_color: '#0a0518',
        },
        null,
        2
      )
    );

    // Add Instructions
    zip.file(
      'README_ANDROID_INSTRUCTIONS.txt',
      `======================================================
VEDIC PANDIT — ACHARYA JITENDER SHASTRI
OFFLINE ANDROID & WEB APP BUNDLE
======================================================

Thank you for downloading the official Vedic Pandit App!

HOW TO USE ON ANDROID PHONES & TABLETS:
------------------------------------------------------
Method 1 (Instant Offline Use):
1. Extract this zip file on your Android phone (using Files by Google, My Files, or any zip extractor).
2. Tap on 'vedic_pandit_android_app.html' or 'index.html'.
3. Open with Chrome, Samsung Internet, Brave, or Kiwi Browser.
4. The entire Vedic astrology app runs 100% offline without needing internet!

Method 2 (Install as Android App on Home Screen):
1. In Chrome or Samsung Internet browser, tap the three dots menu (⋮).
2. Tap 'Add to Home screen' or 'Install App'.
3. The Vedic Pandit icon will be placed directly on your phone's Home Screen and launches full-screen!

HOW TO USE ON PC / LAPTOP (Windows / Mac):
------------------------------------------------------
1. Double-click 'index.html' or 'vedic_pandit_android_app.html'.
2. Runs offline in any web browser.

FEATURES:
------------------------------------------------------
- Daily 12 Rashi Rashifal
- Planetary Transits & Panchang
- Vedic Pooja & Yagya Consultation
- Acharya Jitender Shastri Official Darshan
- Offline Calendar Scheduling & Reminder generation (.ics)

Acharya Jitender Shastri | Vedic Astrologer & Gem Consultant
======================================================`
    );

    // Add Service worker
    zip.file(
      'sw.js',
      `// Vedic Pandit Offline Service Worker
const CACHE_NAME = 'vedic-pandit-v1';
const ASSETS = ['./', './index.html', './vedic_pandit_android_app.html', './manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});
`
    );

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vedic_pandit_app.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch {
    // Method 3: Fallback plain link
    const a = document.createElement('a');
    a.href = '/vedic_pandit_app.zip';
    a.download = 'vedic_pandit_app.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};