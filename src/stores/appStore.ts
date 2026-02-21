import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, WorkLog, Template } from '../validators/index.js';

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Data
  workLogs: WorkLog[];
  templates: Template[];
  filteredWorkLogs: WorkLog[];

  // UI State
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  showOnlyMyRecords: boolean;
  selectedDashboard: 'team' | 'personal';
  currentView: 'list' | 'calendar';
  editingRecordId: string | null;

  // Loading States
  isSyncing: boolean;
  isOffline: boolean;
  lastSyncTime: number | null;

  // Actions
  setCurrentUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;

  setWorkLogs: (logs: WorkLog[]) => void;
  addWorkLog: (log: WorkLog) => void;
  updateWorkLog: (id: string, log: Partial<WorkLog>) => void;
  deleteWorkLog: (id: string) => void;

  setTemplates: (templates: Template[]) => void;
  addTemplate: (template: Template) => void;
  updateTemplate: (id: string, template: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;

  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setShowOnlyMyRecords: (value: boolean) => void;
  setSelectedDashboard: (dashboard: 'team' | 'personal') => void;
  setCurrentView: (view: 'list' | 'calendar') => void;
  setEditingRecordId: (id: string | null) => void;

  setIsSyncing: (value: boolean) => void;
  setIsOffline: (value: boolean) => void;
  setLastSyncTime: (time: number) => void;

  // Filtered data getter
  getFilteredWorkLogs: () => WorkLog[];
  getPaginatedWorkLogs: () => WorkLog[];
  getTotalPages: () => number;

  // Reset
  reset: () => void;
}

const initialState: Omit<
  AppState,
  | 'setCurrentUser'
  | 'setAuthenticated'
  | 'setLoading'
  | 'setWorkLogs'
  | 'addWorkLog'
  | 'updateWorkLog'
  | 'deleteWorkLog'
  | 'setTemplates'
  | 'addTemplate'
  | 'updateTemplate'
  | 'deleteTemplate'
  | 'setCurrentPage'
  | 'setSearchQuery'
  | 'setShowOnlyMyRecords'
  | 'setSelectedDashboard'
  | 'setCurrentView'
  | 'setEditingRecordId'
  | 'setIsSyncing'
  | 'setIsOffline'
  | 'setLastSyncTime'
  | 'getFilteredWorkLogs'
  | 'getPaginatedWorkLogs'
  | 'getTotalPages'
  | 'reset'
> = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  workLogs: [],
  templates: [],
  filteredWorkLogs: [],
  currentPage: 1,
  itemsPerPage: 10,
  searchQuery: '',
  showOnlyMyRecords: false,
  selectedDashboard: 'personal' as const,
  currentView: 'list' as const,
  editingRecordId: null,
  isSyncing: false,
  isOffline: false,
  lastSyncTime: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentUser: (user) => set({ currentUser: user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (value) => set({ isLoading: value }),

      setWorkLogs: (logs) => {
        set({ workLogs: logs });
        // Apply filters
        const { searchQuery, showOnlyMyRecords, currentUser } = get();
        let filtered = [...logs];

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (log) =>
              log.client?.toLowerCase().includes(query) ||
              log.name?.toLowerCase().includes(query) ||
              log.details?.toLowerCase().includes(query),
          );
        }

        if (showOnlyMyRecords && currentUser) {
          filtered = filtered.filter((log) => log.submittedBy === currentUser.uid);
        }

        // Sort by date desc, then by timestamp desc
        filtered.sort((a, b) => {
          if (a.date !== b.date) {
            return b.date.localeCompare(a.date);
          }
          const timeA =
            a.timestamp && typeof a.timestamp === 'object' && 'getTime' in a.timestamp
              ? (a.timestamp as Date).getTime()
              : 0;
          const timeB =
            b.timestamp && typeof b.timestamp === 'object' && 'getTime' in b.timestamp
              ? (b.timestamp as Date).getTime()
              : 0;
          return timeB - timeA;
        });

        set({ filteredWorkLogs: filtered, currentPage: 1 });
      },

      addWorkLog: (log) => {
        const { workLogs } = get();
        const updated = [log, ...workLogs];
        set({ workLogs: updated });
        get().setWorkLogs(updated);
      },

      updateWorkLog: (id, updatedLog) => {
        const { workLogs } = get();
        const updated = workLogs.map((log) => (log.id === id ? { ...log, ...updatedLog } : log));
        set({ workLogs: updated });
        get().setWorkLogs(updated);
      },

      deleteWorkLog: (id) => {
        const { workLogs } = get();
        const filtered = workLogs.filter((log) => log.id !== id);
        set({ workLogs: filtered });
        get().setWorkLogs(filtered);
      },

      setTemplates: (templates) => set({ templates }),
      addTemplate: (template) => {
        const { templates } = get();
        set({ templates: [...templates, template] });
      },
      updateTemplate: (id, updatedTemplate) => {
        const { templates } = get();
        set({
          templates: templates.map((t) => (t.id === id ? { ...t, ...updatedTemplate } : t)),
        });
      },
      deleteTemplate: (id) => {
        const { templates } = get();
        set({ templates: templates.filter((t) => t.id !== id) });
      },

      setCurrentPage: (page) => set({ currentPage: page }),
      setSearchQuery: (query) => {
        set({ searchQuery: query });
        get().setWorkLogs(get().workLogs);
      },
      setShowOnlyMyRecords: (value) => {
        set({ showOnlyMyRecords: value });
        get().setWorkLogs(get().workLogs);
      },
      setSelectedDashboard: (dashboard: 'team' | 'personal') =>
        set({ selectedDashboard: dashboard }),
      setCurrentView: (view: 'list' | 'calendar') => set({ currentView: view }),
      setEditingRecordId: (id) => set({ editingRecordId: id }),

      setIsSyncing: (value) => set({ isSyncing: value }),
      setIsOffline: (value) => set({ isOffline: value }),
      setLastSyncTime: (time) => set({ lastSyncTime: time }),

      getFilteredWorkLogs: () => get().filteredWorkLogs,

      getPaginatedWorkLogs: () => {
        const { filteredWorkLogs, currentPage, itemsPerPage } = get();
        const start = (currentPage - 1) * itemsPerPage;
        return filteredWorkLogs.slice(start, start + itemsPerPage);
      },

      getTotalPages: () => {
        const { filteredWorkLogs, itemsPerPage } = get();
        return Math.ceil(filteredWorkLogs.length / itemsPerPage) || 1;
      },

      reset: () => set(initialState as AppState),
    }),
    {
      name: 'intruevine-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : (null as unknown as Storage),
      ),
      partialize: (state) => ({
        selectedDashboard: state.selectedDashboard,
        currentView: state.currentView,
        itemsPerPage: state.itemsPerPage,
      }),
    },
  ),
);
