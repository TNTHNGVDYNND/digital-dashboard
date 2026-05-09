'use client';

import { useEffect, useState } from 'react';
import { useCampaignStore, CampaignType } from '@/store/campaign';
import { useTemplatesStore } from '@/store/templates';

const campaignTypes: { type: CampaignType; label: string; description: string; icon: string }[] = [
  {
    type: 'social',
    label: 'Social Media',
    description: 'Promote on Instagram, Facebook, Twitter, and LinkedIn',
    icon: '📱',
  },
  {
    type: 'influencer',
    label: 'Influencer Marketing',
    description: 'Partner with content creators and influencers',
    icon: '⭐',
  },
  {
    type: 'traditional',
    label: 'Traditional Media',
    description: 'TV, radio, print, and outdoor advertising',
    icon: '📺',
  },
  {
    type: 'mixed',
    label: 'Mixed Campaign',
    description: 'Combine multiple channels for maximum reach',
    icon: '🚀',
  },
];

export default function Step1Type() {
  const { campaignData, updateCampaignData, nextStep, goToStep } = useCampaignStore();
  const { templates, isLoading: templatesLoading, fetchTemplates, loadTemplate } = useTemplatesStore();
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleTemplateSelect = async (id: string) => {
    setSelectedTemplateId(id);
    if (!id) return;
    const data = await loadTemplate(id);
    if (data) {
      updateCampaignData(data);
      goToStep(3); // Jump to review since template has all data
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Choose Campaign Type</h2>
      <p className="text-gray-600">Select the type of promotion that best fits your goals.</p>

      {templates.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Load from Template</label>
          <select
            value={selectedTemplateId}
            onChange={(e) => handleTemplateSelect(e.target.value)}
            disabled={templatesLoading}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-50"
          >
            <option value="">Select a saved template...</option>
            {templates.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} — {t.type} (${t.budget.toLocaleString()})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {campaignTypes.map((item) => (
          <button
            key={item.type}
            type="button"
            aria-pressed={campaignData.type === item.type}
            onClick={() => updateCampaignData({ type: item.type })}
            className={`rounded-xl border-2 p-6 text-left transition-all ${
              campaignData.type === item.type
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <div className="mb-3 text-3xl">{item.icon}</div>
            <h3 className="mb-1 font-semibold text-gray-900">{item.label}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={nextStep}
          disabled={!campaignData.type}
          className="w-full sm:w-auto rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
