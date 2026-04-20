"use client";

import { useFadeInUp } from "@/hooks/useGSAPAnimations";

const features = [
  {
    title: "Campaign Builder",
    description:
      "4-step wizard to create targeted promotions with customizable tiers and reach calculations.",
    icon: "🎯",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Real-time insights into campaign performance, audience engagement, and conversion metrics.",
    icon: "📊",
  },
  {
    title: "Social Proof Engine",
    description:
      "Showcase client logos, testimonials, and case studies to build trust with prospects.",
    icon: "⭐",
  },
  {
    title: "Multi-Platform Reach",
    description:
      "Distribute campaigns across Instagram, YouTube, TikTok, and traditional media channels.",
    icon: "🚀",
  },
];

export default function FeaturesSection() {
  const sectionRef = useFadeInUp();

  return (
    <section
      ref={sectionRef}
      className="bg-gray-50 px-4 py-24 dark:bg-gray-900"
    >
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Everything You Need to Promote
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
            A complete toolkit for creating, managing, and analyzing your
            promotional campaigns.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const cardRef = useFadeInUp();

  return (
    <div
      ref={cardRef}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="mb-4 text-4xl">{feature.icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        {feature.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
    </div>
  );
}
