'use client';

import Link from 'next/link';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignName: string;
}

export default function SuccessModal({ isOpen, onClose, campaignName }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Campaign Created!</h2>
        <p className="mb-6 text-gray-600">
          Your campaign &quot;{campaignName}&quot; has been successfully launched.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700"
            onClick={onClose}
          >
            View in Dashboard
          </Link>
          <button
            onClick={onClose}
            className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Create Another
          </button>
        </div>
      </div>
    </div>
  );
}
