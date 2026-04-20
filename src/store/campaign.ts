"use client";

import { create } from "zustand";
import { createCampaign } from "@/hooks/useCampaigns";

export type CampaignType = "social" | "influencer" | "traditional" | "mixed";

export interface CampaignData {
  name: string;
  type: CampaignType | null;
  targetAudience: {
    ageRange: [number, number];
    gender: "all" | "male" | "female" | "other";
    interests: string[];
    locations: string[];
  };
  budget: number;
  tier: "basic" | "premium" | "enterprise";
  duration: number;
  startDate: string | null;
}

export interface CampaignState {
  stepIndex: number;
  campaignData: CampaignData;
  isSubmitting: boolean;
  error: string | null;

  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateCampaignData: (data: Partial<CampaignData>) => void;
  updateTargetAudience: (data: Partial<CampaignData["targetAudience"]>) => void;
  submitCampaign: () => Promise<void>;
  reset: () => void;
  setError: (error: string | null) => void;
  setSubmitting: (isSubmitting: boolean) => void;
}

const initialCampaignData: CampaignData = {
  name: "",
  type: null,
  targetAudience: {
    ageRange: [18, 65],
    gender: "all",
    interests: [],
    locations: [],
  },
  budget: 1000,
  tier: "basic",
  duration: 7,
  startDate: null,
};

export const useCampaignStore = create<CampaignState>((set, get) => ({
  stepIndex: 0,
  campaignData: initialCampaignData,
  isSubmitting: false,
  error: null,

  nextStep: () => {
    set((state) => ({
      stepIndex: Math.min(state.stepIndex + 1, 3),
    }));
  },

  prevStep: () => {
    set((state) => ({
      stepIndex: Math.max(state.stepIndex - 1, 0),
    }));
  },

  goToStep: (step) => {
    set({ stepIndex: Math.max(0, Math.min(step, 3)) });
  },

  updateCampaignData: (data) => {
    set((state) => ({
      campaignData: { ...state.campaignData, ...data },
    }));
  },

  updateTargetAudience: (data) => {
    set((state) => ({
      campaignData: {
        ...state.campaignData,
        targetAudience: { ...state.campaignData.targetAudience, ...data },
      },
    }));
  },

  submitCampaign: async () => {
    const { campaignData } = get();

    set({ isSubmitting: true, error: null });

    try {
      await createCampaign(campaignData);

      set({
        stepIndex: 0,
        campaignData: initialCampaignData,
        isSubmitting: false,
      });
    } catch {
      set({ error: "Failed to submit campaign. Please try again." });
      set({ isSubmitting: false });
    }
  },

  reset: () => {
    set({
      stepIndex: 0,
      campaignData: initialCampaignData,
      isSubmitting: false,
      error: null,
    });
  },

  setError: (error) => set({ error }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
}));
