'use client';

import { useScrollAnimation } from '@/hooks/useGSAPAnimations';
import gsap from 'gsap';

export default function AnalyticsMapSection() {
  const sectionRef = useScrollAnimation((tl) => {
    tl.fromTo(
      '.map-container',
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
    );
  });

  return (
    <section ref={sectionRef} className="bg-gray-900 px-4 py-24 text-white">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Global Reach Analytics</h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Track your campaign performance across regions and demographics in real-time.
          </p>
        </div>

        <div className="map-container rounded-2xl border border-gray-700 bg-gray-800 p-8">
          <div className="grid gap-8 md:grid-cols-3">
            <StatCard label="Total Reach" value="2.4M" change="+12%" />
            <StatCard label="Active Campaigns" value="47" change="+8%" />
            <StatCard label="Conversion Rate" value="4.2%" change="+23%" />
          </div>

          <div className="mt-8 rounded-xl bg-gray-700/50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-400">Campaign Map</span>
              <span className="text-sm text-indigo-400">Live Updates</span>
            </div>
            <div className="grid grid-cols-6 gap-4 md:grid-cols-12">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded bg-gradient-to-br from-indigo-500/20 to-purple-500/20"
                  style={{ opacity: 0.3 + (i % 5) * 0.1 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6 text-center">
      <div className="mb-1 text-3xl font-bold text-white">{value}</div>
      <div className="mb-2 text-sm text-gray-400">{label}</div>
      <div className="text-sm font-medium text-green-400">{change}</div>
    </div>
  );
}
