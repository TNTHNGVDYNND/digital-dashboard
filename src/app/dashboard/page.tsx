"use client";

import { useCampaigns } from "@/hooks/useCampaigns";
import type { ICampaign } from "@/lib/models/Campaign";

export default function DashboardPage() {
  const { campaigns, isLoading, isError } = useCampaigns();

  const hasCampaigns = campaigns && campaigns.length > 0;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Overview of your active campaigns and performance.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
            Failed to load campaigns. Please try again.
          </div>
        ) : hasCampaigns ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-800">
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Your Campaigns</h2>
            <div className="grid gap-4">
              {campaigns.map((campaign: ICampaign) => (
                <div key={campaign._id as unknown as string} className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{campaign.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{campaign.type} • {campaign.tier} tier</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-indigo-600">${campaign.budget.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{campaign.duration} days</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-24 text-center dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-2xl text-indigo-600 dark:bg-indigo-900/20">
              📊
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No campaigns yet
            </h2>
            <p className="mb-6 max-w-sm text-sm text-gray-600 dark:text-gray-400">
              You haven't created any promotional campaigns yet. Start your first campaign to see analytics here.
            </p>
            <a
              href="/campaigns"
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Create Campaign
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
