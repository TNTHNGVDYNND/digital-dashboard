'use client';

import StatusFilter from './StatusFilter';
import DateRangeFilter from './DateRangeFilter';
import BudgetTierFilter from './BudgetTierFilter';
import SavedFiltersPopover from './SavedFiltersPopover';
import type { CampaignStatus, CampaignTier } from '@/lib/models/Campaign';
import type { ISavedFilter } from '@/lib/models/SavedFilter';

interface FilterToolbarProps {
  status: CampaignStatus | '';
  from: string;
  to: string;
  tier: CampaignTier | '';
  onStatusChange: (value: CampaignStatus | '') => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onTierChange: (value: CampaignTier | '') => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  onSaveClick: () => void;
  filters: ISavedFilter[];
  onApplyFilter: (query: string) => void;
  onRenameFilter: (id: string) => void;
  onDeleteFilter: (id: string) => void;
  pendingById: Record<string, 'rename' | 'delete'>;
  isPopoverOpen: boolean;
  onPopoverOpenChange: (open: boolean) => void;
}

export default function FilterToolbar({
  status,
  from,
  to,
  tier,
  onStatusChange,
  onFromChange,
  onToChange,
  onTierChange,
  onClearAll,
  hasActiveFilters,
  onSaveClick,
  filters,
  onApplyFilter,
  onRenameFilter,
  onDeleteFilter,
  pendingById,
  isPopoverOpen,
  onPopoverOpenChange,
}: FilterToolbarProps) {
  return (
    <div className="mb-6 rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <StatusFilter value={status} onChange={onStatusChange} />
        <DateRangeFilter from={from} to={to} onFromChange={onFromChange} onToChange={onToChange} />
        <BudgetTierFilter value={tier} onChange={onTierChange} />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-100 hover:text-text-primary"
          >
            Clear all
          </button>
        )}

        <button
          type="button"
          onClick={onSaveClick}
          className="rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-100"
        >
          Save current filters
        </button>

        <SavedFiltersPopover
          filters={filters}
          onApply={onApplyFilter}
          onRename={onRenameFilter}
          onDelete={onDeleteFilter}
          pendingById={pendingById}
          isOpen={isPopoverOpen}
          onToggle={() => onPopoverOpenChange(!isPopoverOpen)}
        />
      </div>
    </div>
  );
}
