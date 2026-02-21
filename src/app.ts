// 메인 앱 초기화 및 설정
import { registerServiceWorker, setupOfflineDetection } from './pwa.js';
import { setupGlobalErrorHandling } from './utils/errorHandler.js';
import { cacheManager } from './cache/index.js';
import { useAppStore } from './stores/index.js';

export class App {
  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    // 에러 핸들링 설정
    setupGlobalErrorHandling();

    // 캐시 초기화
    await cacheManager.init();

    // PWA 설정
    registerServiceWorker();

    // 오프라인 감지 설정
    const cleanup = setupOfflineDetection(
      () => {
        useAppStore.getState().setIsOffline(true);
        console.log('[App] Offline mode activated');
      },
      () => {
        useAppStore.getState().setIsOffline(false);
        console.log('[App] Online mode activated');
      },
    );

    // 페이지 언로드 시 클린업
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        cleanup();
      });
    }

    console.log('[App] Initialized successfully');
  }
}
