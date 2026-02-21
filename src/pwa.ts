// Service Worker 등록
export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('[PWA] Service Worker registered:', registration.scope);

        // 업데이트 확인
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // 새 버전 설치됨 - 사용자에게 알림
                showUpdateNotification();
              }
            });
          }
        });
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    });
  }
}

// 백그라운드 동기화 등록
export async function registerBackgroundSync(): Promise<void> {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    try {
      // @ts-ignore - SyncManager 타입이 navigator에 없을 수 있음
      await (
        registration as ServiceWorkerRegistration & {
          sync: { register(tag: string): Promise<void> };
        }
      ).sync.register('sync-worklogs');
      console.log('[PWA] Background sync registered');
    } catch (error) {
      console.error('[PWA] Background sync registration failed:', error);
    }
  }
}

// 오프라인 상태 모니터링
export function setupOfflineDetection(onOffline: () => void, onOnline: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOffline = () => {
    console.log('[PWA] App is offline');
    onOffline();
  };

  const handleOnline = () => {
    console.log('[PWA] App is online');
    onOnline();
    // 동기화 트리거
    registerBackgroundSync();
  };

  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);

  // 초기 상태 확인
  if (!navigator.onLine) {
    handleOffline();
  }

  return () => {
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('online', handleOnline);
  };
}

// 업데이트 알림 표시
function showUpdateNotification(): void {
  if (typeof window === 'undefined') return;
  // 커스텀 이벤트 발생
  const event = new CustomEvent('app-update-available');
  window.dispatchEvent(event);
}

// 앱 설치 프롬프트
let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function setupInstallPrompt(
  onInstallable: (prompt: () => Promise<void>) => void,
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleBeforeInstallPrompt = (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;

    onInstallable(async () => {
      if (!deferredPrompt) return;

      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('[PWA] User accepted install prompt');
      } else {
        console.log('[PWA] User dismissed install prompt');
      }

      deferredPrompt = null;
    });
  };

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

  return () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  };
}

// BeforeInstallPromptEvent 타입 선언
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
