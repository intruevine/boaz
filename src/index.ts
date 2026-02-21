// 메인 애플리케이션 진입점
// @ts-ignore - Firebase CDN 모듈은 타입 정의를 제공하지 않음
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js';
// @ts-ignore
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';
// @ts-ignore
import { getFirestore, collection, addDoc, query, onSnapshot, orderBy, doc, deleteDoc, setDoc, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js';

import { FirebaseConfig, UserData, WorkLog, Template, SupportType, Announcement, AppConfig, ToastType, ViewType, DashboardType } from './types/index.js';
import { UserModel, WorkLogModel, TemplateModel } from './models/index.js';
import { CONFIG } from './config/index.js';
import { Utils } from './utils/index.js';
import { AppState } from './state/AppState.js';

// Firebase 설정
const firebaseConfig: FirebaseConfig = {
  apiKey: 'AIzaSyCIb844beb3XzyxeGNrwPSJvSS5dWCMst8',
  authDomain: 'intruevine-c6933.firebaseapp.com',
  projectId: 'intruevine-c6933',
  storageBucket: 'intruevine-c6933.appspot.com',
  messagingSenderId: '183011672834',
  appId: '1:183011672834:web:6ff1376919cc2bf427781b'
};

// 서비스 레이어
class AuthService {
  static login(email: string, password: string) {
    return signInWithEmailAndPassword(AppState.auth, email, password);
  }

  static signup(email: string, password: string) {
    return createUserWithEmailAndPassword(AppState.auth, email, password);
  }

  static signOut() {
    return signOut(AppState.auth);
  }

  static watchAuthState(callback: (user: any) => void) {
    return onAuthStateChanged(AppState.auth, callback);
  }
}

class UserService {
  static getUserDocRef(uid: string) {
    return doc(AppState.db, 'users', uid);
  }

  static upsertUser(uid: string, userData: any, options: { merge?: boolean } = { merge: true }) {
    return setDoc(this.getUserDocRef(uid), userData, options);
  }

  static watchUser(uid: string, onNext: (doc: any) => void, onError?: (error: Error) => void) {
    return onSnapshot(this.getUserDocRef(uid), onNext, onError);
  }

  static fetchAll() {
    return getDocs(collection(AppState.db, 'users'));
  }

  static updateUser(userId: string, updateData: Partial<UserData>) {
    return updateDoc(doc(AppState.db, 'users', userId), updateData);
  }
}

class WorkLogService {
  static getCollection() {
    return collection(AppState.db, 'work_logs');
  }

  static watchAll(onNext: (snapshot: any) => void, onError?: (error: Error) => void) {
    return onSnapshot(query(this.getCollection(), orderBy('timestamp', 'desc')), onNext, onError);
  }

  static create(recordData: any) {
    return addDoc(this.getCollection(), recordData);
  }

  static update(recordId: string, recordData: any, options: { merge?: boolean } = { merge: true }) {
    return setDoc(doc(AppState.db, 'work_logs', recordId), recordData, options);
  }

  static delete(recordId: string) {
    return deleteDoc(doc(AppState.db, 'work_logs', recordId));
  }
}

class TemplateService {
  static getCollection(uid: string) {
    return collection(AppState.db, 'users', uid, 'templates');
  }

  static fetchAll(uid: string) {
    return getDocs(query(this.getCollection(uid), orderBy('name')));
  }

  static save(uid: string, templateId: string | null, templateData: any) {
    if (templateId) {
      return setDoc(doc(AppState.db, 'users', uid, 'templates', templateId), templateData, { merge: true });
    }
    return addDoc(this.getCollection(uid), templateData);
  }

  static delete(uid: string, templateId: string) {
    return deleteDoc(doc(AppState.db, 'users', uid, 'templates', templateId));
  }
}

class SettingsService {
  static watchSupportTypes(onNext: (snapshot: any) => void) {
    return onSnapshot(collection(AppState.db, 'settings', 'appConfig', 'supportTypes'), onNext);
  }

  static watchAppConfig(onNext: (doc: any) => void) {
    return onSnapshot(doc(AppState.db, 'settings', 'appConfig'), onNext);
  }

  static watchAnnouncement(onNext: (doc: any) => void) {
    return onSnapshot(doc(AppState.db, 'settings', 'announcement'), onNext);
  }
}

// 애플리케이션 클래스
class App {
  constructor(private firebaseConfig: FirebaseConfig) {}

  initFirebase(): void {
    const firebaseApp = initializeApp(this.firebaseConfig);
    AppState.db = getFirestore(firebaseApp);
    AppState.auth = getAuth(firebaseApp);
  }

  start(): void {
    this.initFirebase();
    console.log('애플리케이션이 시작되었습니다.');
  }
}

// DOM이 로드되면 앱 시작
document.addEventListener('DOMContentLoaded', () => {
  const app = new App(firebaseConfig);
  app.start();
});

// 타입 낵스포트
export {
  FirebaseConfig,
  UserData,
  WorkLog,
  Template,
  SupportType,
  Announcement,
  AppConfig,
  ToastType,
  ViewType,
  DashboardType,
  UserModel,
  WorkLogModel,
  TemplateModel,
  CONFIG,
  Utils,
  AppState,
  AuthService,
  UserService,
  WorkLogService,
  TemplateService,
  SettingsService
};
