'use client';

import { create } from 'zustand';
import type { ISavedFilter } from '@/lib/models/SavedFilter';

export interface FiltersState {
  filters: ISavedFilter[];
  isFetchingList: boolean;
  pendingAction: 'create' | null;
  pendingById: Record<string, 'rename' | 'delete'>;
  error: string | null;

  fetchFilters: () => Promise<void>;
  createFilter: (name: string, query: string) => Promise<ISavedFilter | null>;
  updateFilter: (id: string, name: string) => Promise<ISavedFilter | null>;
  deleteFilter: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useFiltersStore = create<FiltersState>((set, get) => ({
  filters: [],
  isFetchingList: false,
  pendingAction: null,
  pendingById: {},
  error: null,

  fetchFilters: async () => {
    set({ isFetchingList: true, error: null });
    try {
      const res = await fetch('/api/filters');
      const data = await res.json();
      if (data.success) {
        set({ filters: data.data as ISavedFilter[], isFetchingList: false });
      } else {
        set({ error: data.error || 'Failed to fetch filters', isFetchingList: false });
      }
    } catch (err) {
      set({ error: (err as Error).message || 'Failed to fetch filters', isFetchingList: false });
    }
  },

  createFilter: async (name, query) => {
    set({ pendingAction: 'create', error: null });
    try {
      const res = await fetch('/api/filters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, query }),
      });
      const data = await res.json();
      if (data.success) {
        set((state) => ({
          filters: [data.data as ISavedFilter, ...state.filters],
          pendingAction: null,
        }));
        return data.data as ISavedFilter;
      } else {
        set({ error: data.error || 'Failed to create filter', pendingAction: null });
        return null;
      }
    } catch (err) {
      set({ error: (err as Error).message || 'Failed to create filter', pendingAction: null });
      return null;
    }
  },

  updateFilter: async (id, name) => {
    set((state) => ({
      pendingById: { ...state.pendingById, [id]: 'rename' },
      error: null,
    }));
    try {
      const res = await fetch(`/api/filters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.success) {
        set((state) => ({
          filters: state.filters.map((f) =>
            String(f._id) === id ? (data.data as ISavedFilter) : f,
          ),
          pendingById: Object.fromEntries(
            Object.entries(state.pendingById).filter(([key]) => key !== id),
          ),
        }));
        return data.data as ISavedFilter;
      } else {
        set((state) => ({
          error: data.error || 'Failed to update filter',
          pendingById: Object.fromEntries(
            Object.entries(state.pendingById).filter(([key]) => key !== id),
          ),
        }));
        return null;
      }
    } catch (err) {
      set((state) => ({
        error: (err as Error).message || 'Failed to update filter',
        pendingById: Object.fromEntries(
          Object.entries(state.pendingById).filter(([key]) => key !== id),
        ),
      }));
      return null;
    }
  },

  deleteFilter: async (id) => {
    set((state) => ({
      pendingById: { ...state.pendingById, [id]: 'delete' },
      error: null,
    }));
    try {
      const res = await fetch(`/api/filters/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        set((state) => ({
          filters: state.filters.filter((f) => String(f._id) !== id),
          pendingById: Object.fromEntries(
            Object.entries(state.pendingById).filter(([key]) => key !== id),
          ),
        }));
        return true;
      } else {
        set((state) => ({
          error: data.error || 'Failed to delete filter',
          pendingById: Object.fromEntries(
            Object.entries(state.pendingById).filter(([key]) => key !== id),
          ),
        }));
        return false;
      }
    } catch (err) {
      set((state) => ({
        error: (err as Error).message || 'Failed to delete filter',
        pendingById: Object.fromEntries(
          Object.entries(state.pendingById).filter(([key]) => key !== id),
        ),
      }));
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
