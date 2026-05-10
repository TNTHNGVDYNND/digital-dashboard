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
      <label className="text-xs font-medium text-text-secondary">Budget tier</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CampaignTier | '')}
        className="rounded-xl border border-surface-300 bg-surface-0 px-3 py-2 text-sm text-text-primary transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
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
