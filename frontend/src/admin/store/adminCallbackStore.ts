import { create } from 'zustand';
 
export interface CallbackNotification {
  id: number;
  user_id: number | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}
 
interface AdminCallbackStore {
  callbacks: CallbackNotification[];
  pendingCount: number;
  loading: boolean;
  error: string | null;
  fetchPendingCallbacks: () => Promise<void>;
  updateCallbackStatus: (id: number, status: string) => Promise<void>;
  addCallback: (callback: CallbackNotification) => void;
}
 
export const useAdminCallbackStore = create<AdminCallbackStore>((set, get) => ({
  callbacks: [],
  pendingCount: 0,
  loading: false,
  error: null,
 
  fetchPendingCallbacks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('http://localhost:8000/api/v1/callback/pending', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
 
      if (response.ok) {
        const data = await response.json();
        // Filter to show only non-resolved callbacks
        const activeCallbacks = data.filter((cb: CallbackNotification) => cb.status !== 'resolved');
        set({
          callbacks: activeCallbacks,
          pendingCount: activeCallbacks.length,
          loading: false
        });
      } else {
        set({
          error: 'Failed to fetch callbacks',
          loading: false
        });
      }
    } catch (error) {
      set({
        error: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        loading: false
      });
    }
  },
 
  updateCallbackStatus: async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/callback/${id}/status`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
 
      if (response.ok) {
        // Remove resolved callbacks from the list
        set((state) => ({
          callbacks: state.callbacks.filter((cb) => cb.id !== id),
          pendingCount: state.pendingCount - 1,
        }));
      }
    } catch (error) {
      console.error('Error updating callback status:', error);
    }
  },
 
  addCallback: (callback: CallbackNotification) => {
    set((state) => ({
      callbacks: [callback, ...state.callbacks],
      pendingCount: state.pendingCount + 1,
    }));
  },
}));
 
 