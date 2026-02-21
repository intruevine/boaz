// 로딩 상태 관리
export class LoadingState {
  private static instance: LoadingState;
  private loadingSet = new Set<string>();
  private listeners: ((isLoading: boolean, key: string) => void)[] = [];

  static getInstance(): LoadingState {
    if (!LoadingState.instance) {
      LoadingState.instance = new LoadingState();
    }
    return LoadingState.instance;
  }

  start(key: string): void {
    this.loadingSet.add(key);
    this.notify(key, true);
  }

  end(key: string): void {
    this.loadingSet.delete(key);
    this.notify(key, false);
  }

  isLoading(key?: string): boolean {
    if (key) {
      return this.loadingSet.has(key);
    }
    return this.loadingSet.size > 0;
  }

  onLoadingChange(callback: (isLoading: boolean, key: string) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notify(key: string, isLoading: boolean): void {
    this.listeners.forEach((listener) => {
      try {
        listener(isLoading, key);
      } catch (e) {
        console.error('Error in loading listener:', e);
      }
    });
  }
}

// 로딩 래퍼 함수
export async function withLoading<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  const loadingState = LoadingState.getInstance();
  loadingState.start(key);
  
  try {
    return await fn();
  } finally {
    loadingState.end(key);
  }
}

// 진행률 트래킹
export class ProgressTracker {
  private progress = 0;
  private listeners: ((progress: number) => void)[] = [];

  setProgress(value: number): void {
    this.progress = Math.max(0, Math.min(100, value));
    this.notify();
  }

  increment(by: number): void {
    this.setProgress(this.progress + by);
  }

  getProgress(): number {
    return this.progress;
  }

  onProgress(callback: (progress: number) => void): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.progress);
      } catch (e) {
        console.error('Error in progress listener:', e);
      }
    });
  }
}
