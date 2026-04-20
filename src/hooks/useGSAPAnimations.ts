"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

let scrollTriggerRegistered = false;

function ensureScrollTrigger() {
  if (!scrollTriggerRegistered && typeof window !== "undefined") {
    const { ScrollTrigger } = require("gsap/ScrollTrigger");
    gsap.registerPlugin(ScrollTrigger);
    scrollTriggerRegistered = true;
  }
}

interface UseScrollAnimationOptions {
  trigger?: string | Element | null;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
}

export function useScrollAnimation(
  animationCallback: (tl: gsap.core.Timeline) => void,
  options: UseScrollAnimationOptions = {}
) {
  const elementRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    ensureScrollTrigger();
    const { ScrollTrigger } = require("gsap/ScrollTrigger");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: options.trigger || elementRef.current,
        start: options.start || "top 80%",
        end: options.end || "bottom 20%",
        scrub: options.scrub || false,
        markers: options.markers || false,
        onEnter: options.onEnter,
        onLeave: options.onLeave,
      },
    });

    timelineRef.current = tl;
    animationCallback(tl);

    return () => {
      tl.kill();
      const ST = require("gsap/ScrollTrigger").ScrollTrigger;
      type ScrollTriggerInstance = { trigger: Element | null; kill: () => void };
      ST.getAll().forEach((st: ScrollTriggerInstance) => {
        if (st.trigger === elementRef.current) {
          st.kill();
        }
      });
    };
  }, [animationCallback, options]);

  return elementRef;
}

export function useFadeInUp() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    ensureScrollTrigger();
    const { ScrollTrigger } = require("gsap/ScrollTrigger");

    gsap.set(elementRef.current, { opacity: 0, y: 30 });

    const animation = gsap.to(elementRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: elementRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      animation.kill();
    };
  }, []);

  return elementRef;
}
