'use client';

import type { CampaignStatus } from '@/lib/models/Campaign';

interface StatusFilterProps {
  value: CampaignStatus | '';
  onChange: (value: CampaignStatus | '') => void;
}

const STATUS_OPTIONS: { value: CampaignStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
];

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-text-secondary">Status</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CampaignStatus | '')}
        className="rounded-xl border border-surface-300 bg-surface-0 px-3 py-2 text-sm text-text-primary transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
