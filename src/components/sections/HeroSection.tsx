'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import HeroScene from '../canvas/HeroScene';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titleRef.current || !subtitleRef.current || !ctaRef.current) return;

    const tl = gsap.timeline({ delay: 0.3 });

    const titleWords = titleRef.current.querySelectorAll('.word');
    tl.fromTo(
      titleWords,
      { opacity: 0, y: 40, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      },
    );

    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.3',
    );

    tl.fromTo(
      ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.3',
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
    >
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-20">
        <div className="z-10 text-center">
          <h1
            ref={titleRef}
            className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl"
            style={{ perspective: '1000px' }}
          >
            <span className="word inline-block">Amplify</span>{' '}
            <span className="word inline-block">Your</span>{' '}
            <span className="word inline-block text-indigo-400">Brand</span>
            <br />
            <span className="word inline-block">With</span>{' '}
            <span className="word inline-block">Strategic</span>{' '}
            <span className="word inline-block text-indigo-400">Promotions</span>
          </h1>

          <p ref={subtitleRef} className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 md:text-xl">
            Campaign management and promotions analytics dashboard for modern marketing teams
          </p>

          <div ref={ctaRef} className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/campaigns"
              className="rounded-full bg-indigo-600 px-8 py-4 font-semibold text-white transition-transform hover:scale-105 hover:bg-indigo-700 text-center"
            >
              Start Your Campaign
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border-2 border-white/30 px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10 text-center"
            >
              View Analytics Demo
            </Link>
          </div>
        </div>

        <div className="mt-12 w-full max-w-3xl">
          <div className="rounded-2xl border border-gray-700 bg-gray-900/50 p-6 backdrop-blur-sm">
            <HeroScene />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)]" />
    </section>
  );
}
