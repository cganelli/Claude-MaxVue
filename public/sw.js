// MaxVue Vision Correction Demo Service Worker
// Provides offline capabilities for PWA installation

// CRITICAL FIX: Update cache version to force cache invalidation for new deployment
// This timestamp ensures all cached content is refreshed with new fixes
const CACHE_VERSION = '2025-07-06-03-25'; // Updated for calibration and camera fixes
const CACHE_NAME = `maxvue-demo-v${CACHE_VERSION}`;

// Build timestamp for cache busting
const BUILD_TIMESTAMP = Date.now();
const VERSION_INFO = {
  version: CACHE_VERSION,
  buildTime: BUILD_TIMESTAMP,
  description: 'Fixed calibration loading and image processing loops'
};
const STATIC_CACHE_URLS = [
  '/',
  '/demo',
  '/vision-calibration',
  '/manifest.json',
  '/maxvue_logo_transparent_bg.png'
];

// Cache external image URLs for demo
const DEMO_IMAGE_URLS = [
  'https://picsum.photos/400/300?random=1',
  'https://picsum.photos/400/300?random=2'
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('MaxVue SW: Installing service worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('MaxVue SW: Caching static resources');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        // Pre-cache demo images
        return caches.open(CACHE_NAME);
      })
      .then((cache) => {
        console.log('MaxVue SW: Caching demo images');
        return Promise.allSettled(
          DEMO_IMAGE_URLS.map(url => 
            fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response);
              }
            }).catch(err => {
              console.warn('MaxVue SW: Failed to cache image:', url, err);
            })
          )
        );
      })
      .then(() => {
        console.log(`MaxVue SW: Installation complete - Version ${CACHE_VERSION}`);
        console.log('MaxVue SW: This version includes calibration and camera fixes');
        // CRITICAL FIX: Force immediate activation to bypass cache
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('MaxVue SW: Activating service worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('MaxVue SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log(`MaxVue SW: Activation complete - Version ${CACHE_VERSION}`);
        console.log('MaxVue SW: All old caches cleared, serving fresh content');
        // CRITICAL FIX: Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip camera/media requests
  if (request.url.includes('mediaDevices') || request.url.includes('getUserMedia')) {
    return;
  }
  
  // Handle different types of requests
  if (url.origin === location.origin) {
    // Same-origin requests - cache first strategy
    event.respondWith(handleSameOriginRequest(request));
  } else if (url.hostname === 'picsum.photos') {
    // Demo images - cache first with network fallback
    event.respondWith(handleDemoImageRequest(request));
  } else {
    // External requests - network first
    event.respondWith(handleExternalRequest(request));
  }
});

// Handle same-origin requests (app shell, static assets)
async function handleSameOriginRequest(request) {
  try {
    // CRITICAL FIX: For deployment with fixes, prefer network over cache for JS/CSS
    const url = new URL(request.url);
    const isStaticAsset = url.pathname.includes('.js') || url.pathname.includes('.css') || url.pathname.includes('.html');
    
    if (isStaticAsset) {
      // For static assets, try network first to get latest fixes
      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
          console.log('MaxVue SW: Serving fresh content from network:', request.url);
          return networkResponse;
        }
      } catch (networkError) {
        console.log('MaxVue SW: Network failed, falling back to cache:', request.url);
      }
    }
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('MaxVue SW: Serving from cache:', request.url);
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('MaxVue SW: Failed to fetch same-origin request:', error);
    
    // Fallback for navigation requests
    if (request.mode === 'navigate') {
      const cachedIndex = await caches.match('/');
      if (cachedIndex) {
        return cachedIndex;
      }
    }
    
    throw error;
  }
}

// Handle demo image requests
async function handleDemoImageRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('MaxVue SW: Serving demo image from cache:', request.url);
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('MaxVue SW: Failed to fetch demo image:', request.url, error);
    
    // Return a fallback image or transparent pixel
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f3f4f6"/><text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="#6b7280">Demo Image Unavailable</text></svg>',
      { 
        headers: { 
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'max-age=86400'
        } 
      }
    );
  }
}

// Handle external requests
async function handleExternalRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.warn('MaxVue SW: Failed to fetch external request:', request.url, error);
    throw error;
  }
}

// Handle messages from the app
self.addEventListener('message', (event) => {
  const { data } = event;
  
  if (data && data.type === 'SKIP_WAITING') {
    console.log('MaxVue SW: Received skip waiting message');
    self.skipWaiting();
  }
  
  if (data && data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ 
      version: CACHE_NAME,
      versionInfo: VERSION_INFO,
      cacheCleared: true
    });
  }
  
  // CRITICAL FIX: Force cache refresh message
  if (data && data.type === 'FORCE_CACHE_REFRESH') {
    console.log('MaxVue SW: Forcing cache refresh for new deployment');
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('MaxVue SW: Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        console.log('MaxVue SW: All caches cleared, reloading clients');
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'CACHE_CLEARED' });
          });
        });
      })
    );
  }
});

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'vision-settings-sync') {
    console.log('MaxVue SW: Syncing vision settings');
    // Future: sync vision settings when back online
  }
});

console.log(`MaxVue SW: Service worker loaded - Version ${CACHE_VERSION}`);
console.log('MaxVue SW: This deployment includes calibration and camera fixes');
console.log('MaxVue SW: Cache invalidated for fresh content delivery');