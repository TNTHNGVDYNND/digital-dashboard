'use client';

import { useState } from 'react';
import type { ICampaign } from '@/lib/models/Campaign';

interface CampaignEditModalProps {
  campaign: ICampaign;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, name: string) => Promise<void>;
}

export default function CampaignEditModal({
  campaign,
  isOpen,
  onClose,
  onSave,
}: CampaignEditModalProps) {
  const [name, setName] = useState(campaign.name);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(campaign._id as unknown as string, name);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-surface-200 bg-surface-0 p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-text-primary">Edit Campaign</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-surface-300 px-4 py-2 text-text-primary focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-text-inverse hover:bg-primary-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
