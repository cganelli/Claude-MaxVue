// MaxVue Vision Correction Demo Service Worker
// Provides offline capabilities for PWA installation

const CACHE_NAME = 'maxvue-demo-v1';
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
        console.log('MaxVue SW: Installation complete');
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
        console.log('MaxVue SW: Activation complete');
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
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'vision-settings-sync') {
    console.log('MaxVue SW: Syncing vision settings');
    // Future: sync vision settings when back online
  }
});

console.log('MaxVue SW: Service worker loaded');