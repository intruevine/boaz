// Firebase 관련 타입 정의

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Firestore Timestamp 타입 (Firebase SDK의 FieldValue, Timestamp 등을 대체)
export type FirestoreTimestamp =
  | Date
  | null
  | { toMillis(): number }
  | { seconds: number; nanoseconds: number };

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: FirestoreTimestamp;
  lastLogin: FirestoreTimestamp;
}

export interface WorkLog {
  id?: string;
  date: string;
  name: string;
  client: string;
  place: string;
  supportType: string;
  departureTime: string;
  arrivalTime: string;
  startTime: string;
  endTime: string;
  supportHours: number;
  details: string;
  submittedBy: string;
  timestamp?: FirestoreTimestamp;
}

export interface Template {
  id?: string;
  name: string;
  client: string;
  place: string;
  supportType: string;
  details: string;
}

export interface SupportType {
  id: string;
  name: string;
}

export interface Announcement {
  message: string;
  active: boolean;
}

export interface AppConfig {
  logoUrl?: string;
}

export interface DashboardKPIs {
  hours: number;
  days: number;
  cases: number;
  clients: number;
}

export type ViewType = 'list' | 'calendar';
export type DashboardType = 'team' | 'personal';
export type ToastType = 'success' | 'error' | 'info';
