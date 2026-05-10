'use client';

import { useState } from 'react';
import type { TemplateData } from '@/store/templates';

interface TemplateCardProps {
  template: TemplateData;
  onLoad: (template: TemplateData) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function TemplateCard({ template, onLoad, onDelete }: TemplateCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(template._id);
    setIsDeleting(false);
    setShowConfirm(false);
  };

  const typeLabels: Record<string, string> = {
    social: 'Social Media',
    influencer: 'Influencer',
    traditional: 'Traditional',
    mixed: 'Mixed',
  };

  const tierLabels: Record<string, string> = {
    basic: 'Basic',
    premium: 'Premium',
    enterprise: 'Enterprise',
  };

  return (
    <>
      <div
        onClick={() => onLoad(template)}
        className="group relative cursor-pointer rounded-2xl border-2 border-surface-200 bg-surface-0 p-6 transition-all duration-200 hover:border-primary-300 hover:shadow-md"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">{template.name}</h3>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            disabled={isDeleting}
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-danger-500/10 hover:text-danger-600 disabled:opacity-50"
            aria-label="Delete template"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
            {template.type ? typeLabels[template.type] || template.type : 'Unknown'}
          </span>
          <span className="rounded-full bg-surface-100 px-3 py-1 text-xs font-medium text-text-secondary">
            {template.tier ? tierLabels[template.tier] || template.tier : 'Unknown'}
          </span>
        </div>

        <div className="space-y-2 text-sm text-text-secondary">
          <div className="flex justify-between">
            <span>Budget</span>
            <span className="font-medium text-text-primary">${template.budget.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration</span>
            <span className="font-medium text-text-primary">{template.duration} days</span>
          </div>
          <div className="flex justify-between">
            <span>Audience</span>
            <span className="font-medium text-text-primary">
              Ages {template.targetAudience.ageRange.join('-')}, {template.targetAudience.gender}
            </span>
          </div>
        </div>

        <div className="mt-4 text-xs text-text-muted">
          Created {new Date(template.createdAt).toLocaleDateString()}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-danger-500/30 bg-surface-0 p-6 shadow-xl">
            <h2 className="mb-2 text-xl font-bold text-text-primary">Delete Template?</h2>
            <p className="mb-6 text-sm text-text-secondary">
              Are you sure you want to delete <strong>{template.name}</strong>? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-100 disabled:opacity-50"
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
      )}
    </>
  );
}
