// 에러 처리 클래스
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public originalError?: Error,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields: Record<string, string[]>,
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, code: string) {
    super(message, code, 401);
    this.name = 'AuthError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(message, 'NETWORK_ERROR', 0, originalError);
    this.name = 'NetworkError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource}을(를) 찾을 수 없습니다.`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

// 에러 핸들러
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: ((error: AppError) => void)[] = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  onError(callback: (error: AppError) => void): () => void {
    this.errorListeners.push(callback);
    return () => {
      const index = this.errorListeners.indexOf(callback);
      if (index > -1) {
        this.errorListeners.splice(index, 1);
      }
    };
  }

  handle(error: unknown): AppError {
    const appError = this.normalizeError(error);

    // 로깅
    console.error('[ErrorHandler]', appError);

    // 리스너에게 알림
    this.errorListeners.forEach((listener) => {
      try {
        listener(appError);
      } catch (e) {
        console.error('Error in error listener:', e);
      }
    });

    return appError;
  }

  private normalizeError(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      // Firebase Auth 에러
      if (error.name === 'FirebaseError') {
        return this.handleFirebaseError(error);
      }

      // 네트워크 에러
      if (error.message?.includes('network') || error.message?.includes('offline')) {
        return new NetworkError('네트워크 연결을 확인해주세요.', error);
      }

      return new AppError(error.message, 'UNKNOWN_ERROR', undefined, error);
    }

    return new AppError('알 수 없는 오류가 발생했습니다.', 'UNKNOWN_ERROR');
  }

  private handleFirebaseError(error: Error): AppError {
    const message = error.message;

    if (message.includes('auth/user-not-found') || message.includes('auth/wrong-password')) {
      return new AuthError('이메일 또는 비밀번호가 올바르지 않습니다.', 'INVALID_CREDENTIALS');
    }

    if (message.includes('auth/email-already-in-use')) {
      return new AuthError('이미 사용 중인 이메일입니다.', 'EMAIL_IN_USE');
    }

    if (message.includes('auth/weak-password')) {
      return new AuthError('비밀번호는 6자 이상이어야 합니다.', 'WEAK_PASSWORD');
    }

    if (message.includes('auth/invalid-email')) {
      return new AuthError('유효하지 않은 이메일 주소입니다.', 'INVALID_EMAIL');
    }

    if (message.includes('auth/requires-recent-login')) {
      return new AuthError('보안을 위해 다시 로그인해주세요.', 'REAUTH_REQUIRED');
    }

    if (message.includes('permission-denied')) {
      return new AuthError('권한이 없습니다.', 'PERMISSION_DENIED');
    }

    return new AppError(message, 'FIREBASE_ERROR', undefined, error);
  }
}

// 비동기 함수 래퍼
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage?: string,
): Promise<{ success: true; data: T } | { success: false; error: AppError }> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    const appError = ErrorHandler.getInstance().handle(error);
    if (errorMessage) {
      appError.message = errorMessage;
    }
    return { success: false, error: appError };
  }
}

// 재시도 로직
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    backoff?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {},
): Promise<T> {
  const { maxAttempts = 3, delay = 1000, backoff = 2, shouldRetry } = options;

  let lastError: unknown;
  let currentDelay = delay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        break;
      }

      if (shouldRetry && !shouldRetry(error)) {
        throw error;
      }

      await sleep(currentDelay);
      currentDelay *= backoff;
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 전역 에러 핸들러 설정
export function setupGlobalErrorHandling(): void {
  if (typeof window === 'undefined') return;

  // 처리되지 않은 Promise rejection
  window.addEventListener('unhandledrejection', (event) => {
    ErrorHandler.getInstance().handle(event.reason);
  });

  // 처리되지 않은 에러
  window.addEventListener('error', (event) => {
    ErrorHandler.getInstance().handle(event.error);
  });
}
