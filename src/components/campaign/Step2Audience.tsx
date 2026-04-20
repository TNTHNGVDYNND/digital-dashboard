"use client";

import { useCampaignStore } from "@/store/campaign";

const interests = [
  "Technology",
  "Fashion",
  "Food & Dining",
  "Travel",
  "Fitness",
  "Entertainment",
  "Sports",
  "Finance",
  "Education",
  "Gaming",
];

const locations = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Global",
];

export default function Step2Audience() {
  const { campaignData, updateCampaignData, updateTargetAudience, nextStep, prevStep } =
    useCampaignStore();

  const toggleInterest = (interest: string) => {
    const current = campaignData.targetAudience.interests;
    const updated = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    updateTargetAudience({ interests: updated });
  };

  const toggleLocation = (location: string) => {
    const current = campaignData.targetAudience.locations;
    const updated = current.includes(location)
      ? current.filter((l) => l !== location)
      : [...current, location];
    updateTargetAudience({ locations: updated });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Define Target Audience</h2>
      <p className="text-gray-600">Who do you want to reach with this campaign?</p>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Campaign Name</label>
          <input
            type="text"
            value={campaignData.name}
            onChange={(e) => updateCampaignData({ name: e.target.value })}
            placeholder="e.g., Summer Sale 2024"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Age Range</label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                aria-label="Minimum age"
                min="13"
                max="100"
                value={campaignData.targetAudience.ageRange[0]}
                onChange={(e) =>
                  updateTargetAudience({
                    ageRange: [parseInt(e.target.value), campaignData.targetAudience.ageRange[1]],
                  })
                }
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                aria-label="Maximum age"
                min="13"
                max="100"
                value={campaignData.targetAudience.ageRange[1]}
                onChange={(e) =>
                  updateTargetAudience({
                    ageRange: [campaignData.targetAudience.ageRange[0], parseInt(e.target.value)],
                  })
                }
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Gender</label>
            <select
              value={campaignData.targetAudience.gender}
              onChange={(e) => updateTargetAudience({ gender: e.target.value as typeof campaignData.targetAudience.gender })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Interests</label>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <button
                key={interest}
                type="button"
                aria-pressed={campaignData.targetAudience.interests.includes(interest)}
                onClick={() => toggleInterest(interest)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  campaignData.targetAudience.interests.includes(interest)
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Locations</label>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <button
                key={location}
                type="button"
                aria-pressed={campaignData.targetAudience.locations.includes(location)}
                onClick={() => toggleLocation(location)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  campaignData.targetAudience.locations.includes(location)
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="w-full sm:w-auto rounded-full border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={!campaignData.name || campaignData.targetAudience.interests.length === 0}
          className="w-full sm:w-auto rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
