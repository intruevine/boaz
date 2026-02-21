import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyCIb844beb3XzyxeGNrwPSJvSS5dWCMst8',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'intruevine-c6933.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'intruevine-c6933',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'intruevine-c6933.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '183011672834',
  appId: process.env.FIREBASE_APP_ID || '1:183011672834:web:6ff1376919cc2bf427781b',
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'G-XN72K3G9YH',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics는 선택적
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// 개발 환경에서 에뮬레이터 연결
if (process.env.NODE_ENV === 'development' && process.env.USE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export { app };
