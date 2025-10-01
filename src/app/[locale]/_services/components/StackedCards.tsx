"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Advantages from "./Advantages";
import Subscriptions from "./Subscriptions";
import Testimonials from "./Testimonials";

gsap.registerPlugin(ScrollTrigger);

const StackedCards = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia(); // responsive: disable pin on small screens
    const ctx = gsap.context(() => {
      mm.add("(min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".stack-card");

        // Initial stacked layout
        gsap.set(cards, {
          yPercent: (i) => i * 4,           // small vertical offset between cards
          scale: (i) => 1 - i * 0.04,       // subtle scale difference
          zIndex: (i) => 10 - i,            // keep top card clickable
          transformOrigin: "center top",
          borderRadius: 24,
          boxShadow: "0 20px 40px rgba(48,27,105,0.08)",
          willChange: "transform",
        });

        // Pin container and animate cards as you scroll
        const tl = gsap.timeline({
          defaults: { ease: "power2.out", duration: 1 },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=300%",          // scroll distance through all cards
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // For each step: push current card up, lift next to the front
        for (let i = 0; i < cards.length - 1; i++) {
          tl.to(
            cards[i],
            {
              yPercent: -120 - i * 5, // move out of view upward
              scale: 0.9 - i * 0.04,
              opacity: 0.7,
              boxShadow: "0 10px 24px rgba(48,27,105,0.06)",
            },
            "+=0.2"
          ).to(
            cards[i + 1],
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              zIndex: 10,
            },
            "<" // run in parallel with previous tween
          );
        }

        return () => tl.kill();
      });
    }, containerRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-[130vh] w-full my-12">
      {/* Card 1 */}
        <Advantages />

      {/* Card 2 */}
        <Subscriptions />

      {/* Card 3 */}
        <Testimonials />
    </section>
  );
};

export default StackedCards;