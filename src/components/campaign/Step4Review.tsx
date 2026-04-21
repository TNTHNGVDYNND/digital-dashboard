'use client';

import { useState } from 'react';
import { useCampaignStore } from '@/store/campaign';
import SuccessModal from './SuccessModal';

export default function Step4Review() {
  const { campaignData, submitCampaign, prevStep, isSubmitting, error, reset } = useCampaignStore();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    await submitCampaign();
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    reset();
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
          disabled={isSubmitting}
          className="w-full sm:w-auto rounded-full border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Launching...' : 'Launch Campaign'}
        </button>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleCloseSuccess}
        campaignName={campaignData.name}
      />
    </div>
  );
}
