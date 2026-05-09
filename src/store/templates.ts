'use client';

import { create } from 'zustand';
import type { CampaignData } from './campaign';

export interface TemplateData {
  _id: string;
  name: string;
  type: CampaignData['type'];
  targetAudience: CampaignData['targetAudience'];
  budget: number;
  tier: CampaignData['tier'];
  duration: number;
  startDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TemplatesState {
  templates: TemplateData[];
  isLoading: boolean;
  error: string | null;

  fetchTemplates: () => Promise<void>;
  createTemplate: (name: string, campaignData: CampaignData) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  loadTemplate: (id: string) => Promise<CampaignData | null>;
  setError: (error: string | null) => void;
}

export const useTemplatesStore = create<TemplatesState>((set, get) => ({
  templates: [],
  isLoading: false,
  error: null,

  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/templates');
      if (!res.ok) throw new Error('Failed to fetch templates');
      const json = await res.json();
      set({ templates: json.data || [], isLoading: false });
    } catch {
      set({ error: 'Failed to load templates', isLoading: false });
    }
  },

  createTemplate: async (name, campaignData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          type: campaignData.type,
          targetAudience: campaignData.targetAudience,
          budget: campaignData.budget,
          tier: campaignData.tier,
          duration: campaignData.duration,
          startDate: campaignData.startDate,
        }),
      });
      if (!res.ok) throw new Error('Failed to create template');
      const json = await res.json();
      set((state) => ({
        templates: [json.data, ...state.templates],
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to save template', isLoading: false });
    }
  },

  deleteTemplate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete template');
      set((state) => ({
        templates: state.templates.filter((t) => t._id !== id),
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to delete template', isLoading: false });
    }
  },

  loadTemplate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`/api/templates/${id}`);
      if (!res.ok) throw new Error('Failed to load template');
      const json = await res.json();
      const template = json.data as TemplateData;
      const campaignData: CampaignData = {
        name: template.name,
        type: template.type,
        targetAudience: template.targetAudience,
        budget: template.budget,
        tier: template.tier,
        duration: template.duration,
        startDate: template.startDate ?? null,
      };
      set({ isLoading: false });
      return campaignData;
    } catch {
      set({ error: 'Failed to load template', isLoading: false });
      return null;
    }
  },

  setError: (error) => set({ error }),
}));
