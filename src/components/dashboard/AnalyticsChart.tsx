'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { ICampaign } from '@/lib/models/Campaign';

export default function AnalyticsChart({ campaigns }: { campaigns: ICampaign[] }) {
  const data = campaigns.map((campaign) => {
    // Generate some estimated reach data based on tier & budget
    const multiplier = campaign.tier === 'enterprise' ? 5 : campaign.tier === 'premium' ? 2.5 : 1;

    const reach = Math.floor(campaign.budget * multiplier * 1.25);

    return {
      name: campaign.name,
      budget: campaign.budget,
      reach: reach,
    };
  });

  if (!campaigns || campaigns.length === 0) return null;

  return (
    <div className="mb-8 h-80 w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-800">
      <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
        Campaign Performance Overview
      </h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            yAxisId="left"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${val / 1000}k`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `${val / 1000}k`}
          />
          <Tooltip
            cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #374151',
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              color: '#f3f4f6',
              backdropFilter: 'blur(4px)',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Bar
            yAxisId="left"
            dataKey="budget"
            name="Budget (USD)"
            fill="#6366f1"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            yAxisId="right"
            dataKey="reach"
            name="Est. Reach"
            fill="#a855f7"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
