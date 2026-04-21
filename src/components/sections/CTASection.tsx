'use client';

import { useFadeInUp } from '@/hooks/useGSAPAnimations';
import Link from 'next/link';

export default function CTASection() {
  const sectionRef = useFadeInUp();

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4 py-24"
    >
      <div className="container mx-auto text-center">
        <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
          Ready to Amplify Your Reach?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
          Join thousands of brands using Explicit Promotions to connect with their audience and
          drive measurable results.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/campaigns"
            className="rounded-full bg-white px-8 py-4 font-semibold text-indigo-600 transition-transform hover:scale-105 text-center"
          >
            Get Started Free
          </Link>
          <Link
            href="/contact"
            className="rounded-full border-2 border-white/50 px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10 text-center"
          >
            Schedule a Demo
          </Link>
        </div>

        <p className="mt-6 text-sm text-white/60">No credit card required. 14-day free trial.</p>
      </div>
    </section>
  );
}
