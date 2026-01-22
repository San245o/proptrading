"use client";

import Link from "next/link";
import { FloatingCard } from "@/components/ui/FloatingCard";
import FloatingDashboardPreview from "./FloatingDashboardPreview";

export default function Hero() {
  return (
    <section className="relative z-10 min-h-screen overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pt-32 lg:flex-row lg:items-center lg:pt-20">
        {/* Left Content */}
        <div className="flex-1 space-y-8">
          {/* Badge */}

          {/* Headline */}
          <FloatingCard delay={300}>
            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Built to Fund
              <br />
              <span className="italic text-emerald-400">Skilled Traders</span>
            </h1>
          </FloatingCard>

          {/* Description */}
          <FloatingCard delay={500}>
            <p className="max-w-lg text-lg leading-relaxed text-white/60">
              Access up to ₹1 Crore in trading capital through our transparent, 
              simulation-based evaluation. No time limits. Clear rules. 
              80% profit split.
            </p>
          </FloatingCard>

          {/* CTA Button */}
          <FloatingCard delay={700}>
            <div className="flex flex-wrap items-center gap-6">
              <Link 
                href="/login"
                className="group flex items-center gap-3 rounded-xl bg-emerald-500 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-emerald-600 active:scale-95"
              >
                Start Challenge
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </FloatingCard>

          {/* Trust Signal */}
        </div>

        {/* Right Content - Floating Dashboard Cards */}
        <div className="relative mt-8 flex-1 lg:-mt-24">
          <FloatingDashboardPreview />
        </div>
      </div>

    </section>
  );
}
