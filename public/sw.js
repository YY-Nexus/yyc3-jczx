const CACHE_VERSION = "v1"
const CACHE_NAME = `yyc3-integration-center-${CACHE_VERSION}`

const STATIC_CACHE_URLS = ["/", "/marketplace", "/favorites", "/ai-assistant", "/about", "/offline"]

const DYNAMIC_CACHE_NAME = `yyc3-dynamic-${CACHE_VERSION}`

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...")

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching static assets")
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        return self.skipWaiting()
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name.startsWith("yyc3-") && name !== CACHE_NAME && name !== DYNAMIC_CACHE_NAME
            })
            .map((name) => {
              console.log("[Service Worker] Deleting old cache:", name)
              return caches.delete(name)
            }),
        )
      })
      .then(() => {
        return self.clients.claim()
      }),
  )
})

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }

  // API requests - network only
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ error: "您当前处于离线状态，此功能需要网络连接" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        })
      }),
    )
    return
  }

  // Static assets and pages - cache first, fallback to network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === "error") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Cache dynamic content
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (request.mode === "navigate") {
            return caches.match("/offline")
          }
          return new Response("离线状态", { status: 503 })
        })
    }),
  )
})

// Background sync
self.addEventListener("sync", (event) => {
  console.log("[Service Worker] Background sync:", event.tag)

  if (event.tag === "sync-favorites") {
    event.waitUntil(syncFavorites())
  }
})

async function syncFavorites() {
  try {
    const response = await fetch("/api/favorites/sync", {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error("Sync failed")
    }

    console.log("[Service Worker] Favorites synced successfully")
  } catch (error) {
    console.error("[Service Worker] Sync failed:", error)
    throw error
  }
}

// Push notifications
self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push received")

  let notificationData = {
    title: "YYC³ 集成中心",
    body: "您有新的通知",
    icon: "/images/logo.png",
    badge: "/images/logo.png",
    tag: "default",
  }

  if (event.data) {
    try {
      notificationData = { ...notificationData, ...event.data.json() }
    } catch (e) {
      notificationData.body = event.data.text()
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: false,
      actions: [
        { action: "view", title: "查看" },
        { action: "close", title: "关闭" },
      ],
    }),
  )
})

// Notification click
self.addEventListener("notificationclick", (event) => {
  console.log("[Service Worker] Notification clicked:", event.action)

  event.notification.close()

  if (event.action === "view") {
    event.waitUntil(clients.openWindow("/"))
  }
})

// Message handling
self.addEventListener("message", (event) => {
  console.log("[Service Worker] Message received:", event.data)

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
