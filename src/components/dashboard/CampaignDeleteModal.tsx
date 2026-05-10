'use client';

import { useState } from 'react';
import type { ICampaign } from '@/lib/models/Campaign';

interface CampaignDeleteModalProps {
  campaign: ICampaign;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export default function CampaignDeleteModal({
  campaign,
  isOpen,
  onClose,
  onConfirm,
}: CampaignDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    await onConfirm(campaign._id as unknown as string);
    setIsDeleting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-danger-500/30 bg-surface-0 p-6 shadow-xl">
        <h2 className="mb-2 text-xl font-bold text-text-primary">Delete Campaign?</h2>
        <p className="mb-6 text-sm text-text-secondary">
          Are you sure you want to delete <strong>{campaign.name}</strong>? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg bg-danger-600 px-4 py-2 text-sm font-medium text-text-inverse hover:bg-danger-600 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
