'use client';

interface DateRangeFilterProps {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  error?: string | null;
}

export default function DateRangeFilter({
  from,
  to,
  onFromChange,
  onToChange,
  error,
}: DateRangeFilterProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-text-secondary">Date range</label>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="rounded-xl border border-surface-300 bg-surface-0 px-3 py-2 text-sm text-text-primary transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          aria-label="From date"
        />
        <span className="text-sm text-text-muted">to</span>
        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="rounded-xl border border-surface-300 bg-surface-0 px-3 py-2 text-sm text-text-primary transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          aria-label="To date"
        />
      </div>
      {error && (
        <p className="text-xs text-danger-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
