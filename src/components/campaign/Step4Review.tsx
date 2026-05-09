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
      <h2 className="text-2xl font-bold text-gray-900">Review & Confirm</h2>
      <p className="text-gray-600">Double-check your campaign details before launching.</p>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Campaign Summary</h3>

        <div className="space-y-4">
          <div className="flex justify-between border-b border-gray-100 py-3">
            <span className="text-gray-600">Campaign Name</span>
            <span className="font-medium text-gray-900">{campaignData.name}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 py-3">
            <span className="text-gray-600">Type</span>
            <span className="font-medium text-gray-900 capitalize">{campaignData.type}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 py-3">
            <span className="text-gray-600">Target Audience</span>
            <span className="font-medium text-gray-900">
              Ages {campaignData.targetAudience.ageRange.join('-')},{' '}
              {campaignData.targetAudience.gender}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-100 py-3">
            <span className="text-gray-600">Tier</span>
            <span className="font-medium capitalize text-gray-900">{campaignData.tier}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 py-3">
            <span className="text-gray-600">Duration</span>
            <span className="font-medium text-gray-900">{campaignData.duration} days</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 py-3">
            <span className="text-gray-600">Interests</span>
            <span className="font-medium text-gray-900">
              {campaignData.targetAudience.interests.join(', ')}
            </span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-600">Locations</span>
            <span className="font-medium text-gray-900">
              {campaignData.targetAudience.locations.join(', ')}
            </span>
          </div>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-8">
        <button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting || templateSaving}
          className="w-full sm:w-auto rounded-full border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Back
        </button>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => setShowSaveTemplate(true)}
            disabled={isSubmitting || templateSaving}
            className="w-full sm:w-auto rounded-full border-2 border-indigo-600 px-6 py-3 font-semibold text-indigo-600 transition-colors hover:bg-indigo-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {templateSaving ? 'Saving...' : 'Save as Template'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || templateSaving}
            className="w-full sm:w-auto rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isSubmitting ? 'Launching...' : 'Launch Campaign'}
          </button>
        </div>
      </div>

      {showSaveTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-gray-900">Save as Template</h3>
            <p className="mb-4 text-sm text-gray-600">
              Give your template a name so you can reuse this configuration later.
            </p>
            {templateSaved ? (
              <div className="rounded-lg bg-green-50 p-4 text-green-700">Template saved successfully!</div>
            ) : (
              <>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Summer Sale Template"
                  className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSaveTemplate(false);
                      setTemplateName('');
                    }}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTemplate}
                    disabled={!templateName.trim() || templateSaving}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
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
