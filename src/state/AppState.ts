// 애플리케이션 상태 관리
import { UserData, WorkLog } from '../types/index.js';

export interface ChartInstances {
  [key: string]: any;
}

export interface AppStateType {
  db: any;
  auth: any;
  currentUser: UserData | null;
  currentPage: number;
  userListenerUnsubscribe: (() => void) | null;
  editingRecordId: string | null;
  allRecords: WorkLog[];
  chartInstances: ChartInstances;
  appEventListenersAttached: boolean;
  calendar: any;
  datePicker: any;
  appConfigListenerUnsubscribe: (() => void) | null;
  announcementListenerUnsubscribe: (() => void) | null;
  supportTypesListenerUnsubscribe: (() => void) | null;
  recordsListenerUnsubscribe: (() => void) | null;
}

class AppStateManager implements AppStateType {
  private _db: any = null;
  private _auth: any = null;
  private _currentUser: UserData | null = null;
  private _currentPage: number = 1;
  private _userListenerUnsubscribe: (() => void) | null = null;
  private _editingRecordId: string | null = null;
  private _allRecords: WorkLog[] = [];
  private _chartInstances: ChartInstances = {};
  private _appEventListenersAttached: boolean = false;
  private _calendar: any = null;
  private _datePicker: any = null;
  private _appConfigListenerUnsubscribe: (() => void) | null = null;
  private _announcementListenerUnsubscribe: (() => void) | null = null;
  private _supportTypesListenerUnsubscribe: (() => void) | null = null;
  private _recordsListenerUnsubscribe: (() => void) | null = null;

  get db(): any { return this._db; }
  set db(value: any) { this._db = value; }

  get auth(): any { return this._auth; }
  set auth(value: any) { this._auth = value; }

  get currentUser(): UserData | null { return this._currentUser; }
  set currentUser(value: UserData | null) { this._currentUser = value; }

  get currentPage(): number { return this._currentPage; }
  set currentPage(value: number) { this._currentPage = value; }

  get userListenerUnsubscribe(): (() => void) | null { return this._userListenerUnsubscribe; }
  set userListenerUnsubscribe(value: (() => void) | null) { this._userListenerUnsubscribe = value; }

  get editingRecordId(): string | null { return this._editingRecordId; }
  set editingRecordId(value: string | null) { this._editingRecordId = value; }

  get allRecords(): WorkLog[] { return this._allRecords; }
  set allRecords(value: WorkLog[]) { this._allRecords = value; }

  get chartInstances(): ChartInstances { return this._chartInstances; }
  set chartInstances(value: ChartInstances) { this._chartInstances = value; }

  get appEventListenersAttached(): boolean { return this._appEventListenersAttached; }
  set appEventListenersAttached(value: boolean) { this._appEventListenersAttached = value; }

  get calendar(): any { return this._calendar; }
  set calendar(value: any) { this._calendar = value; }

  get datePicker(): any { return this._datePicker; }
  set datePicker(value: any) { this._datePicker = value; }

  get appConfigListenerUnsubscribe(): (() => void) | null { return this._appConfigListenerUnsubscribe; }
  set appConfigListenerUnsubscribe(value: (() => void) | null) { this._appConfigListenerUnsubscribe = value; }

  get announcementListenerUnsubscribe(): (() => void) | null { return this._announcementListenerUnsubscribe; }
  set announcementListenerUnsubscribe(value: (() => void) | null) { this._announcementListenerUnsubscribe = value; }

  get supportTypesListenerUnsubscribe(): (() => void) | null { return this._supportTypesListenerUnsubscribe; }
  set supportTypesListenerUnsubscribe(value: (() => void) | null) { this._supportTypesListenerUnsubscribe = value; }

  get recordsListenerUnsubscribe(): (() => void) | null { return this._recordsListenerUnsubscribe; }
  set recordsListenerUnsubscribe(value: (() => void) | null) { this._recordsListenerUnsubscribe = value; }

  resetPagination(): void {
    this._currentPage = 1;
  }
}

export const AppState = new AppStateManager();
