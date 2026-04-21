'use client';

import { useCampaignStore } from '@/store/campaign';
import PricingCard from '@/components/ui/PricingCard';

const tiers = [
  {
    id: 'basic' as const,
    title: 'Basic',
    price: 999,
    features: ['Up to 50K reach', '1 social platform', 'Basic analytics', 'Email support'],
    recommended: false,
  },
  {
    id: 'premium' as const,
    title: 'Premium',
    price: 2499,
    features: [
      'Up to 200K reach',
      '3 social platforms',
      'Advanced analytics',
      'Priority support',
      'A/B testing',
    ],
    recommended: true,
  },
  {
    id: 'enterprise' as const,
    title: 'Enterprise',
    price: 4999,
    features: [
      'Unlimited reach',
      'All platforms',
      'Real-time analytics',
      'Dedicated manager',
      'Custom integrations',
    ],
    recommended: false,
  },
];

export default function Step3Budget() {
  const { campaignData, updateCampaignData, nextStep, prevStep } = useCampaignStore();

  const estimatedReach =
    campaignData.budget *
    (campaignData.tier === 'enterprise' ? 150 : campaignData.tier === 'premium' ? 100 : 50);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Set Budget & Reach</h2>
      <p className="text-gray-600">Choose your campaign tier and budget.</p>

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <PricingCard
            key={tier.id}
            title={tier.title}
            price={tier.price}
            features={tier.features}
            isSelected={campaignData.tier === tier.id}
            onSelect={() => updateCampaignData({ tier: tier.id })}
            recommended={tier.recommended}
          />
        ))}
      </div>

      <div className="rounded-xl bg-gray-50 p-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Campaign Duration (days)
        </label>
        <input
          type="range"
          aria-label="Campaign duration in days"
          min="7"
          max="90"
          value={campaignData.duration}
          onChange={(e) => updateCampaignData({ duration: parseInt(e.target.value) })}
          className="w-full accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        />
        <div className="mt-2 text-center font-semibold text-indigo-600">
          {campaignData.duration} days
        </div>
      </div>

      <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Estimated Reach</h3>
        <div className="text-4xl font-bold text-indigo-600">
          {estimatedReach.toLocaleString()} people
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Based on your {campaignData.tier} tier selection
        </p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="w-full sm:w-auto rounded-full border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="w-full sm:w-auto rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Review Campaign
        </button>
      </div>
    </div>
  );
}
