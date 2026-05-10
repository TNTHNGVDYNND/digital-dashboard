import CampaignBuilder from '@/components/campaign/CampaignBuilder';

export default function CampaignsPage() {
  return (
    <main className="min-h-screen bg-surface-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center sm:mb-12">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">Create Campaign</h1>
          <p className="mt-3 text-base text-text-secondary sm:mt-4 sm:text-lg">
            Build and manage your promotional campaigns
          </p>
        </div>
        <CampaignBuilder />
      </div>
    </main>
  );
}
