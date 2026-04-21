"use client";

import { useFadeInUp } from "@/hooks/useGSAPAnimations";

const clients = [
  { name: "Spotify", color: "#1DB954" },
  { name: "Netflix", color: "#E50914" },
  { name: "Airbnb", color: "#FF5A5F" },
  { name: "Slack", color: "#4A154B" },
  { name: "Stripe", color: "#635BFF" },
  { name: "Notion", color: "#000000" },
  { name: "Figma", color: "#F24E1E" },
  { name: "Discord", color: "#5865F2" },
];

export default function SocialProofSection() {
  const sectionRef = useFadeInUp();

  return (
    <section ref={sectionRef} className="bg-white px-4 py-16 dark:bg-gray-800">
      <div className="container mx-auto text-center">
        <p className="mb-8 text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Trusted by leading brands
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {clients.map((client) => (
            <div
              key={client.name}
              className="flex items-center gap-2 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            >
              <div
                className="h-8 w-8 rounded-full"
                style={{ backgroundColor: client.color }}
                suppressHydrationWarning
              />
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
