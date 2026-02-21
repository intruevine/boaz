import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { WorkLog, Template, User } from '../validators/index.js';

interface IntruevineDB extends DBSchema {
  workLogs: {
    key: string;
    value: WorkLog & { synced: boolean; _id: string };
    indexes: { 'by-date': string; 'by-submittedBy': string };
  };
  templates: {
    key: string;
    value: Template & { userId: string };
  };
  users: {
    key: string;
    value: User;
  };
  pendingChanges: {
    key: number;
    value: {
      id: number;
      type: 'create' | 'update' | 'delete';
      collection: string;
      data: unknown;
      timestamp: number;
    };
  };
}

const DB_NAME = 'intruevine-db';
const DB_VERSION = 1;

class CacheManager {
  private db: IDBPDatabase<IntruevineDB> | null = null;

  async init(): Promise<void> {
    this.db = await openDB<IntruevineDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // WorkLogs store
        if (!db.objectStoreNames.contains('workLogs')) {
          const workLogStore = db.createObjectStore('workLogs', { keyPath: '_id' });
          workLogStore.createIndex('by-date', 'date');
          workLogStore.createIndex('by-submittedBy', 'submittedBy');
        }

        // Templates store
        if (!db.objectStoreNames.contains('templates')) {
          db.createObjectStore('templates', { keyPath: 'id' });
        }

        // Users store
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'uid' });
        }

        // Pending changes store
        if (!db.objectStoreNames.contains('pendingChanges')) {
          db.createObjectStore('pendingChanges', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      },
    });
  }

  // WorkLogs
  async getWorkLogs(): Promise<(WorkLog & { synced: boolean; _id: string })[]> {
    if (!this.db) await this.init();
    return this.db!.getAll('workLogs');
  }

  async getWorkLogsByDate(date: string): Promise<(WorkLog & { synced: boolean; _id: string })[]> {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex('workLogs', 'by-date', date);
  }

  async getWorkLogsByUser(userId: string): Promise<(WorkLog & { synced: boolean; _id: string })[]> {
    if (!this.db) await this.init();
    return this.db!.getAllFromIndex('workLogs', 'by-submittedBy', userId);
  }

  async saveWorkLog(workLog: WorkLog & { synced?: boolean; _id: string }): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('workLogs', { ...workLog, synced: workLog.synced ?? true });
  }

  async saveWorkLogs(workLogs: (WorkLog & { _id: string })[]): Promise<void> {
    if (!this.db) await this.init();
    const tx = this.db!.transaction('workLogs', 'readwrite');
    await Promise.all(workLogs.map((log) => tx.store.put({ ...log, synced: true })));
    await tx.done;
  }

  async deleteWorkLog(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('workLogs', id);
  }

  async clearWorkLogs(): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.clear('workLogs');
  }

  // Templates
  async getTemplates(): Promise<(Template & { userId: string })[]> {
    if (!this.db) await this.init();
    return this.db!.getAll('templates');
  }

  async saveTemplate(template: Template & { userId: string }): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('templates', template);
  }

  async deleteTemplate(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('templates', id);
  }

  // Users
  async getUser(uid: string): Promise<User | undefined> {
    if (!this.db) await this.init();
    return this.db!.get('users', uid);
  }

  async saveUser(user: User): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put('users', user);
  }

  // Pending changes (for offline sync)
  async addPendingChange(
    type: 'create' | 'update' | 'delete',
    collection: string,
    data: unknown
  ): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.add('pendingChanges', {
      type,
      collection,
      data,
      timestamp: Date.now(),
    } as any);
  }

  async getPendingChanges(): Promise<IntruevineDB['pendingChanges']['value'][]> {
    if (!this.db) await this.init();
    return this.db!.getAll('pendingChanges');
  }

  async removePendingChange(id: number): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('pendingChanges', id);
  }

  async clearPendingChanges(): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.clear('pendingChanges');
  }

  // Sync status
  async markAsSynced(id: string): Promise<void> {
    if (!this.db) await this.init();
    const workLog = await this.db!.get('workLogs', id);
    if (workLog) {
      await this.db!.put('workLogs', { ...workLog, synced: true });
    }
  }

  async markAsUnsynced(id: string): Promise<void> {
    if (!this.db) await this.init();
    const workLog = await this.db!.get('workLogs', id);
    if (workLog) {
      await this.db!.put('workLogs', { ...workLog, synced: false });
    }
  }

  async getUnsyncedWorkLogs(): Promise<(WorkLog & { synced: boolean; _id: string })[]> {
    if (!this.db) await this.init();
    const allLogs = await this.db!.getAll('workLogs');
    return allLogs.filter((log) => !log.synced);
  }
}

export const cacheManager = new CacheManager();
