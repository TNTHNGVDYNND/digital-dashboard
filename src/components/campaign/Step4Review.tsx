'use client';

import { useState } from 'react';
import { useCampaignStore } from '@/store/campaign';
import { useTemplatesStore } from '@/store/templates';
import SuccessModal from './SuccessModal';

export default function Step4Review() {
  const { campaignData, submitCampaign, prevStep, isSubmitting, error, reset } = useCampaignStore();
  const { createTemplate, isLoading: templateSaving } = useTemplatesStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateSaved, setTemplateSaved] = useState(false);

  const handleSubmit = async () => {
    await submitCampaign();
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    reset();
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) return;
    await createTemplate(templateName.trim(), campaignData);
    setTemplateSaved(true);
    setTemplateName('');
    setTimeout(() => {
      setTemplateSaved(false);
      setShowSaveTemplate(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">Review & Confirm</h2>
      <p className="text-text-secondary">Double-check your campaign details before launching.</p>

      <div className="rounded-xl border border-surface-200 bg-surface-0 p-6">
        <h3 className="mb-4 text-lg font-semibold text-text-primary">Campaign Summary</h3>

        <div className="space-y-4">
          <div className="flex justify-between border-b border-surface-100 py-3">
            <span className="text-text-secondary">Campaign Name</span>
            <span className="font-medium text-text-primary">{campaignData.name}</span>
          </div>
          <div className="flex justify-between border-b border-surface-100 py-3">
            <span className="text-text-secondary">Type</span>
            <span className="font-medium text-text-primary capitalize">{campaignData.type}</span>
          </div>
          <div className="flex justify-between border-b border-surface-100 py-3">
            <span className="text-text-secondary">Target Audience</span>
            <span className="font-medium text-text-primary">
              Ages {campaignData.targetAudience.ageRange.join('-')},{' '}
              {campaignData.targetAudience.gender}
            </span>
          </div>
          <div className="flex justify-between border-b border-surface-100 py-3">
            <span className="text-text-secondary">Tier</span>
            <span className="font-medium capitalize text-text-primary">{campaignData.tier}</span>
          </div>
          <div className="flex justify-between border-b border-surface-100 py-3">
            <span className="text-text-secondary">Duration</span>
            <span className="font-medium text-text-primary">{campaignData.duration} days</span>
          </div>
          <div className="flex justify-between border-b border-surface-100 py-3">
            <span className="text-text-secondary">Interests</span>
            <span className="font-medium text-text-primary">
              {campaignData.targetAudience.interests.join(', ')}
            </span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-text-secondary">Locations</span>
            <span className="font-medium text-text-primary">
              {campaignData.targetAudience.locations.join(', ')}
            </span>
          </div>
        </div>
      </div>

      {error && <div className="rounded-lg bg-danger-500/10 p-4 text-danger-600">{error}</div>}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-8">
        <button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting || templateSaving}
          className="w-full sm:w-auto rounded-full border-2 border-surface-300 px-6 py-3 font-semibold text-text-secondary transition-colors hover:bg-surface-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Back
        </button>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => setShowSaveTemplate(true)}
            disabled={isSubmitting || templateSaving}
            className="w-full sm:w-auto rounded-full border-2 border-primary-600 px-6 py-3 font-semibold text-primary-600 transition-colors hover:bg-primary-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {templateSaving ? 'Saving...' : 'Save as Template'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || templateSaving}
            className="w-full sm:w-auto rounded-full bg-primary-600 px-6 py-3 font-semibold text-text-inverse transition-colors hover:bg-primary-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {isSubmitting ? 'Launching...' : 'Launch Campaign'}
          </button>
        </div>
      </div>

      {showSaveTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-surface-200 bg-surface-0 p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-text-primary">Save as Template</h3>
            <p className="mb-4 text-sm text-text-secondary">
              Give your template a name so you can reuse this configuration later.
            </p>
            {templateSaved ? (
              <div className="rounded-lg bg-success-500/10 p-4 text-success-600">
                Template saved successfully!
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Summer Sale Template"
                  className="mb-4 w-full rounded-lg border border-surface-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSaveTemplate(false);
                      setTemplateName('');
                    }}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTemplate}
                    disabled={!templateName.trim() || templateSaving}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-text-inverse hover:bg-primary-700 disabled:opacity-50"
                  >
                    {templateSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleCloseSuccess}
        campaignName={campaignData.name}
      />
    </div>
  );
}
