'use client';

import type { CampaignTier } from '@/lib/models/Campaign';

interface BudgetTierFilterProps {
  value: CampaignTier | '';
  onChange: (value: CampaignTier | '') => void;
}

const TIER_OPTIONS: { value: CampaignTier | ''; label: string }[] = [
  { value: '', label: 'All tiers' },
  { value: 'basic', label: 'Basic' },
  { value: 'premium', label: 'Premium' },
  { value: 'enterprise', label: 'Enterprise' },
];

export default function BudgetTierFilter({ value, onChange }: BudgetTierFilterProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
        Budget tier
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CampaignTier | '')}
        className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
      >
        {TIER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
