import useSWR from "swr";
import { CampaignData } from "@/store/campaign";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCampaigns() {
  const { data, error, isLoading, mutate } = useSWR("/api/campaigns", fetcher);

  return {
    campaigns: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useCampaign(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/campaigns/${id}` : null,
    fetcher
  );

  return {
    campaign: data?.data || null,
    isLoading,
    isError: error,
    mutate,
  };
}

export async function createCampaign(campaignData: CampaignData) {
  const res = await fetch("/api/campaigns", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(campaignData),
  });

  if (!res.ok) {
    throw new Error("Failed to create campaign");
  }

  return res.json();
}

export async function updateCampaign(id: string, updateData: Partial<CampaignData>) {
  const res = await fetch(`/api/campaigns/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!res.ok) {
    throw new Error("Failed to update campaign");
  }

  return res.json();
}

export async function deleteCampaign(id: string) {
  const res = await fetch(`/api/campaigns/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete campaign");
  }

  return res.json();
}
