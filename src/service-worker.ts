/// <reference lib="webworker" />

// Service Worker 전용 타입 선언
declare const self: ServiceWorkerGlobalScope;

interface ExtendableEvent extends Event {
  waitUntil(fn: Promise<unknown>): void;
}

interface FetchEvent extends ExtendableEvent {
  readonly request: Request;
  readonly clientId: string;
  readonly handled: Promise<undefined>;
  readonly preloadResponse: Promise<Response | undefined>;
  respondWith(response: Promise<Response> | Response): void;
}

interface SyncEvent extends ExtendableEvent {
  readonly tag: string;
  readonly lastChance: boolean;
}

const CACHE_NAME = 'intruevine-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// 설치 시 정적 자산 캐싱
self.addEventListener('install', ((event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
}) as EventListener);

// 활성화 시 이전 캐시 정리
self.addEventListener('activate', ((event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
}) as EventListener);

// fetch 이벤트 처리
self.addEventListener('fetch', ((event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // API 요청은 네트워크 우선
  if (url.pathname.startsWith('/api/') || url.hostname.includes('firebase')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // 정적 자산은 캐시 우선
  event.respondWith(cacheFirst(request));
}) as EventListener);

async function cacheFirst(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request: Request): Promise<Response> {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    throw error;
  }
}

// 백그라운드 동기화
self.addEventListener('sync', ((event: SyncEvent) => {
  if (event.tag === 'sync-worklogs') {
    event.waitUntil(syncWorkLogs());
  }
}) as EventListener);

async function syncWorkLogs(): Promise<void> {
  // IndexedDB에서 동기화 대기 중인 데이터 가져오기
  // Firebase에 동기화 수행
  console.log('[Service Worker] Syncing work logs...');
}

export {};
