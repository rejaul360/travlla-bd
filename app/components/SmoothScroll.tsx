"use client";

import { useEffect, ReactNode } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Lenis smooth scroll configuration
    const lenis = new Lenis({
      duration: 1.2, // স্ক্রোল কতক্ষণ স্মুথভাবে চলবে (১.২ সেকেন্ড স্ট্যান্ডার্ড)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // প্রিমিয়াম মোমেন্টাম ইজিং কার্ভ
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1, // মাউস হুইল সেন্সিটিভিটি
      touchMultiplier: 2,
    });

    // Request Animation Frame লুপ
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}