// const CACHE_NAME = 'bevcan-v1';

// // Install event: Cache necessary files
// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(async (cache) => {
//       const coreUrls = [
//         '/',                  // Root page
//         '/index.html',        // Main HTML file
//         '/sw.js',             // Service Worker itself
//         '/manifest.json',     // PWA manifest
//         '/favicon.png',       // Favicon
//         '/images/logo/wyze.png', // Explicitly cache logo 
//       ];

//       try {
//         // Fetch `index.html` to get latest asset references
//         const response = await fetch('/index.html');
//         const text = await response.text();

//         // Extract built JS & CSS from index.html
//         const assetMatches = [...text.matchAll(/\/assets\/[a-zA-Z0-9\-_]+\.(?:js|css|png|jpg|svg)/g)];
//         const assetUrls = assetMatches.map(match => match[0]);

//         // Add extracted asset URLs to the cache list
//         coreUrls.push(...assetUrls);

//         console.log('Caching assets:', coreUrls);
//         return cache.addAll(coreUrls);
//       } catch (error) {
//         console.error('Error caching assets:', error);
//       }
//     })
//   );
//   self.skipWaiting();
// });

// // Activate Service Worker: Cleanup old caches
// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     caches.keys().then((keys) => {
//       return Promise.all(
//         keys.map((key) => {
//           if (key !== CACHE_NAME) {
//             console.log('Deleting old cache:', key);
//             return caches.delete(key);
//           }
//         })
//       );
//     })
//   );
//   self.clients.claim();
// });

// // Fetch event: Serve from cache when offline
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       return cachedResponse || fetch(event.request).catch(() => {
//         if (event.request.destination === 'image') {
//           return caches.match('/images/logo/wyze.png'); // Serve logo if offline ✅
//         }
//         return caches.match('/index.html');
//       });
//     })
//   );
// });


const CACHE_NAME = 'bevcan-v1';

// Install event: Cache necessary files
self.addEventListener('install', (event) => {
    console.log('Service Worker Installed');
    event.waitUntil(
      caches.open(CACHE_NAME).then(async (cache) => {
        const coreUrls = [
            '/', '/index.html', '/sw.js', '/manifest.json', '/favicon.ico', '/images/logo/wyze.png',
            '/images/logo/w-48.png', '/images/logo/wyze-96.png', '/images/logo/wyze_144.png', '/images/logo/wyze-192.png',
            '/images/screenshots/screen-wide.png', '/images/screenshots/scr-mobile.png', // Add these to cache
            '/assets/main.js', '/assets/styles.css' 
          ];
           
        try {
          const response = await fetch('/index.html');
          const text = await response.text();
          const assetMatches = [...text.matchAll(/\/assets\/[a-zA-Z0-9\-_]+\.(?:js|css|png|jpg|svg)/g)];
          const assetUrls = assetMatches.map(match => match[0]);
          coreUrls.push(...assetUrls);
  
          console.log('Caching assets:', coreUrls);
          return cache.addAll(coreUrls);
        } catch (error) {
          console.error('Error caching assets:', error);
        }
      })
    );
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service Worker Activated');
    event.waitUntil(
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('Deleting old cache:', key);
              return caches.delete(key);
            }
          })
        );
      })
    );
    self.clients.claim();
  });
  

// Fetch event: Serve from cache or network
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/users') || event.request.url.includes('/posts') || event.request.url.includes('/comments')) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || fetch(event.request).then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse; // Return the network response
            });
          }).catch(() => {
            return caches.match('/index.html'); // Serve fallback page when offline
          });
        })
      );
    } else {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || fetch(event.request).catch(() => {
            if (event.request.destination === 'image') {
              return caches.match('/images/logo/wyze.png'); // Fallback for images when offline
            }
            return caches.match('/index.html'); // Fallback for other resources
          });
        })
      );
    }
  });

  self.addEventListener("push", (event) => {
    if (event.data) {
      const payload = event.data.json();
  
      const options = {
        body: payload.body,
        icon: "/images/logo/wyze-192.png",
        badge: "/images/logo/wyze-96.png",
        vibrate: [200, 100, 200],
        data: payload.data || {},
        actions: [
          { action: "open_app", title: "Open App" },
          { action: "dismiss", title: "Dismiss" },
        ],
      };
  
      event.waitUntil(self.registration.showNotification(payload.title, options));
    }
  });
  
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    if (event.action === "open_app") {
      event.waitUntil(clients.openWindow("/"));
    }
  });


  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "LOCAL_NOTIFICATION") {
      self.registration.showNotification(event.data.title, {
        body: event.data.body,
        icon: "/icon.png",
        badge: "/badge.png", 
        vibrate: [200, 100, 200],
      });
    }
  });
  
  

  
  
  


