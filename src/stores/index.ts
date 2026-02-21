import { useAppStore } from './appStore.js';

// Re-export all stores
export { useAppStore };

// Store hooks for easier access
export const useAuth = () => {
  const store = useAppStore();
  return {
    currentUser: store.currentUser,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    setCurrentUser: store.setCurrentUser,
    setAuthenticated: store.setAuthenticated,
    setLoading: store.setLoading,
  };
};

export const useWorkLogs = () => {
  const store = useAppStore();
  return {
    workLogs: store.workLogs,
    filteredWorkLogs: store.filteredWorkLogs,
    setWorkLogs: store.setWorkLogs,
    addWorkLog: store.addWorkLog,
    updateWorkLog: store.updateWorkLog,
    deleteWorkLog: store.deleteWorkLog,
    getFilteredWorkLogs: store.getFilteredWorkLogs,
    getPaginatedWorkLogs: store.getPaginatedWorkLogs,
    getTotalPages: store.getTotalPages,
  };
};

export const useUI = () => {
  const store = useAppStore();
  return {
    currentPage: store.currentPage,
    itemsPerPage: store.itemsPerPage,
    searchQuery: store.searchQuery,
    showOnlyMyRecords: store.showOnlyMyRecords,
    selectedDashboard: store.selectedDashboard,
    currentView: store.currentView,
    editingRecordId: store.editingRecordId,
    setCurrentPage: store.setCurrentPage,
    setSearchQuery: store.setSearchQuery,
    setShowOnlyMyRecords: store.setShowOnlyMyRecords,
    setSelectedDashboard: store.setSelectedDashboard,
    setCurrentView: store.setCurrentView,
    setEditingRecordId: store.setEditingRecordId,
  };
};

export const useSync = () => {
  const store = useAppStore();
  return {
    isSyncing: store.isSyncing,
    isOffline: store.isOffline,
    lastSyncTime: store.lastSyncTime,
    setIsSyncing: store.setIsSyncing,
    setIsOffline: store.setIsOffline,
    setLastSyncTime: store.setLastSyncTime,
  };
};
