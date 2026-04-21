import CampaignBuilder from '@/components/campaign/CampaignBuilder';

export default function CampaignsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900">Create Campaign</h1>
        <p className="mt-4 text-lg text-gray-600">Build and manage your promotional campaigns</p>
      </div>
      <CampaignBuilder />
    </main>
  );
}
