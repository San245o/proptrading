"use client";

import { FloatingCard } from "@/components/ui/FloatingCard";
import { MiniLineChart, MiniBarChart, DonutChart } from "@/components/ui/Charts";

export default function FloatingDashboardPreview() {
  return (
    <div className="relative mx-auto h-[350px] w-full max-w-[400px] sm:h-[420px] lg:mx-0 lg:h-[480px] lg:max-w-none">
      {/* Main Dashboard Card */}
      <FloatingCard 
        delay={200} 
        className="absolute left-1/2 top-[45%] z-20 w-[260px] -translate-x-1/2 -translate-y-1/2 sm:w-[280px] lg:left-[40%] lg:w-[340px]"
        rotate="-3deg"
      >
        <div className="overflow-hidden rounded-2xl border border-white/20 p-5 shadow-2xl backdrop-blur-xl" style={{ background: 'linear-gradient(145deg, rgba(40,40,40,0.6) 0%, rgba(20,20,20,0.8) 50%, rgba(30,30,30,0.6) 100%)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)' }}>
          {/* Card Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-white/50">Total P&L</span>
              <span className="text-xs text-emerald-400">Live</span>
            </div>
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
            </div>
          </div>
          {/* P&L Value */}
          <div className="mb-1">
            <span className="text-3xl font-bold text-white">₹4,82,350</span>
          </div>
          <div className="mb-5 flex items-center gap-2">
            <span className="flex items-center text-sm font-medium text-emerald-400">
              <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              +12.4%
            </span>
            <span className="text-xs text-white/40">this month</span>
          </div>
          {/* Chart */}
          <div className="h-24">
            <MiniLineChart />
          </div>
        </div>
      </FloatingCard>

      {/* Top Right Card - Trading Stats */}
      <FloatingCard 
        delay={400} 
        className="absolute left-0 top-0 z-30 w-[300px] sm:right-4 sm:top-8 sm:w-[380px] lg:right-8 lg:top-4 lg:w-[420px]"
        rotate="-2deg"
      >
        <div className="overflow-hidden rounded-xl border border-white/20 p-4 shadow-xl backdrop-blur-xl" style={{ background: 'linear-gradient(145deg, rgba(40,40,40,0.6) 0%, rgba(20,20,20,0.8) 50%, rgba(30,30,30,0.6) 100%)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)' }}>
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* Win Rate */}
            <div className="rounded-lg bg-white/5 p-2.5">
              <div className="mb-1 flex items-center gap-1.5">
                <div className="h-6 w-6">
                  <DonutChart />
                </div>
                <span className="text-[10px] text-white/40">Win Rate</span>
              </div>
              <div className="text-lg font-bold text-white">75%</div>
            </div>
            {/* Profit */}
            <div className="rounded-lg bg-white/5 p-2.5">
              <div className="mb-1 text-[10px] text-white/40">Profit</div>
              <div className="text-lg font-bold text-emerald-400">₹48K</div>
            </div>
            {/* Target */}
            <div className="rounded-lg bg-white/5 p-2.5">
              <div className="mb-1 text-[10px] text-white/40">Target</div>
              <div className="text-lg font-bold text-white">₹50K</div>
            </div>
            {/* Trades */}
            <div className="rounded-lg bg-white/5 p-2.5">
              <div className="mb-1 text-[10px] text-white/40">Trades</div>
              <div className="text-lg font-bold text-white">127</div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[10px]">
              <span className="text-white/40">Progress</span>
              <span className="text-emerald-400">96%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
            </div>
          </div>
        </div>
      </FloatingCard>

      {/* Bottom Card - Bar Chart */}
      <FloatingCard 
        delay={600} 
        className="absolute bottom-12 left-0 z-30 w-[160px] sm:bottom-20 sm:left-4 sm:w-[180px] lg:bottom-16 lg:left-0 lg:w-[200px]"
        rotate="6deg"
      >
        <div className="overflow-hidden rounded-xl border border-white/20 p-4 shadow-xl backdrop-blur-xl" style={{ background: 'linear-gradient(145deg, rgba(40,40,40,0.6) 0%, rgba(20,20,20,0.8) 50%, rgba(30,30,30,0.6) 100%)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)' }}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-white/50">Weekly Trades</span>
            <span className="text-xs text-white/30">Jan 2026</span>
          </div>
          <div className="h-16">
            <MiniBarChart />
          </div>
        </div>
      </FloatingCard>

      {/* Floating Stats Badge */}
      <FloatingCard 
        delay={800} 
        className="absolute bottom-0 right-0 z-30 sm:bottom-4 sm:right-4 lg:bottom-8 lg:right-8"
        rotate="4deg"
      >
        <div className="flex items-center gap-3 rounded-2xl border border-white/20 px-4 py-3 shadow-lg backdrop-blur-xl" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/30">
            <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">₹1Cr+</div>
            <div className="text-[10px] text-white/40">Capital Deployed</div>
          </div>
        </div>
      </FloatingCard>
    </div>
  );
}
