import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { followupsApi } from '@/services/api';
import type {
  Followup,
  CreateFollowupDTO,
  UpdateFollowupDTO,
  PublishFollowupDTO,
} from '@meeting-followup/shared';

interface FollowupsState {
  followups: Followup[];
  currentFollowup: Followup | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    companyId?: string;
    sortBy?: string;
    sortOrder?: string;
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  // Actions
  fetchFollowups: (params?: {
    page?: number;
    pageSize?: number;
    companyId?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => Promise<void>;
  fetchFollowupById: (id: string, include?: boolean) => Promise<void>;
  createFollowup: (data: CreateFollowupDTO) => Promise<Followup>;
  updateFollowup: (id: string, data: UpdateFollowupDTO) => Promise<Followup>;
  publishFollowup: (id: string, data: PublishFollowupDTO) => Promise<Followup>;
  unpublishFollowup: (id: string) => Promise<Followup>;
  deleteFollowup: (id: string) => Promise<void>;
  setFilters: (filters: Partial<FollowupsState['filters']>) => void;
  clearError: () => void;
}

export const useFollowupsStore = create<FollowupsState>()(
  devtools(
    (set, get) => ({
      followups: [],
      currentFollowup: null,
      loading: false,
      error: null,
      filters: {},
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
      },

      fetchFollowups: async (params) => {
        set({ loading: true, error: null });
        try {
          const response = await followupsApi.getAll({
            ...get().filters,
            page: get().pagination.page,
            pageSize: get().pagination.pageSize,
            ...params,
          });

          set({
            followups: Array.isArray(response) ? response : response.data || [],
            pagination: {
              ...get().pagination,
              total: response.meta?.totalCount || 0,
            },
            loading: false,
          });
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch follow-ups', loading: false });
        }
      },

      fetchFollowupById: async (id, include) => {
        set({ loading: true, error: null });
        try {
          const followup = await followupsApi.getById(id, include);
          set({ currentFollowup: followup, loading: false });
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch follow-up', loading: false });
        }
      },

      createFollowup: async (data) => {
        set({ loading: true, error: null });
        try {
          const followup = await followupsApi.create(data);
          set((state) => ({
            followups: [followup, ...state.followups],
            currentFollowup: followup,
            loading: false,
          }));
          return followup;
        } catch (error: any) {
          set({ error: error.message || 'Failed to create follow-up', loading: false });
          throw error;
        }
      },

      updateFollowup: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const followup = await followupsApi.update(id, data);
          set((state) => ({
            followups: state.followups.map((f) => (f.id === id ? followup : f)),
            currentFollowup: state.currentFollowup?.id === id ? followup : state.currentFollowup,
            loading: false,
          }));
          return followup;
        } catch (error: any) {
          set({ error: error.message || 'Failed to update follow-up', loading: false });
          throw error;
        }
      },

      publishFollowup: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const followup = await followupsApi.publish(id, data);
          set((state) => ({
            followups: state.followups.map((f) => (f.id === id ? followup : f)),
            currentFollowup: state.currentFollowup?.id === id ? followup : state.currentFollowup,
            loading: false,
          }));
          return followup;
        } catch (error: any) {
          set({ error: error.message || 'Failed to publish follow-up', loading: false });
          throw error;
        }
      },

      unpublishFollowup: async (id) => {
        set({ loading: true, error: null });
        try {
          const followup = await followupsApi.unpublish(id);
          set((state) => ({
            followups: state.followups.map((f) => (f.id === id ? followup : f)),
            currentFollowup: state.currentFollowup?.id === id ? followup : state.currentFollowup,
            loading: false,
          }));
          return followup;
        } catch (error: any) {
          set({ error: error.message || 'Failed to unpublish follow-up', loading: false });
          throw error;
        }
      },

      deleteFollowup: async (id) => {
        set({ loading: true, error: null });
        try {
          await followupsApi.delete(id);
          set((state) => ({
            followups: state.followups.filter((f) => f.id !== id),
            currentFollowup: state.currentFollowup?.id === id ? null : state.currentFollowup,
            loading: false,
          }));
        } catch (error: any) {
          set({ error: error.message || 'Failed to delete follow-up', loading: false });
          throw error;
        }
      },

      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, page: 1 },
        }));
        // Auto-fetch with new filters
        get().fetchFollowups();
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'followups-store' }
  )
);
