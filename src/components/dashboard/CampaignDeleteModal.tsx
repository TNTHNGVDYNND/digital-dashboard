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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-red-200 bg-white p-6 shadow-xl dark:border-red-900/30 dark:bg-gray-800">
        <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Delete Campaign?</h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete <strong>{campaign.name}</strong>? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
