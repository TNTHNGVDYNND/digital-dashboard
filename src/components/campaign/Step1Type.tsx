"use client";

import { useCampaignStore, CampaignType } from "@/store/campaign";

const campaignTypes: { type: CampaignType; label: string; description: string; icon: string }[] = [
  {
    type: "social",
    label: "Social Media",
    description: "Promote on Instagram, Facebook, Twitter, and LinkedIn",
    icon: "📱",
  },
  {
    type: "influencer",
    label: "Influencer Marketing",
    description: "Partner with content creators and influencers",
    icon: "⭐",
  },
  {
    type: "traditional",
    label: "Traditional Media",
    description: "TV, radio, print, and outdoor advertising",
    icon: "📺",
  },
  {
    type: "mixed",
    label: "Mixed Campaign",
    description: "Combine multiple channels for maximum reach",
    icon: "🚀",
  },
];

export default function Step1Type() {
  const { campaignData, updateCampaignData, nextStep } = useCampaignStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Choose Campaign Type</h2>
      <p className="text-gray-600">Select the type of promotion that best fits your goals.</p>

      <div className="grid gap-4 md:grid-cols-2">
        {campaignTypes.map((item) => (
          <button
            key={item.type}
            type="button"
            aria-pressed={campaignData.type === item.type}
            onClick={() => updateCampaignData({ type: item.type })}
            className={`rounded-xl border-2 p-6 text-left transition-all ${
              campaignData.type === item.type
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-300"
            }`}
          >
            <div className="mb-3 text-3xl">{item.icon}</div>
            <h3 className="mb-1 font-semibold text-gray-900">{item.label}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={nextStep}
          disabled={!campaignData.type}
          className="w-full sm:w-auto rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
