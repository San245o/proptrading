"use client";

import { ScrollAnimation } from "@/components/ui/ScrollAnimation";

export default function Features() {
  return (
    <section id="features" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 lg:py-10">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl">
          Why Choose
          <span className="ml-2 text-emerald-400">Prop India?</span>
        </h2>
        <p className="mt-4 text-lg text-white/60">
          Built for Indian traders. Designed for success.
        </p>
      </div>

      <div className="grid auto-rows-[minmax(160px,auto)] grid-cols-1 gap-4 md:grid-cols-4">
        {/* Row 1 */}
        {/* Main Feature: 80% Profit Split */}
        <ScrollAnimation className="md:col-span-2 md:row-span-2 h-full" delay={0}>
          <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/30 to-transparent p-8 transition-all hover:border-emerald-500/50">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Maximum Returns
              </div>
              <h3 className="text-6xl font-black tracking-tighter text-white lg:text-8xl">
                80%
              </h3>
              <p className="mt-2 text-2xl font-bold text-white">
                Profit Split
              </p>
            </div>
            <p className="mt-6 max-w-md text-base text-white/60">
              Keep 80% of the profits you generate in your funded account. 
              Your skills, your rewards. Bi-weekly payouts directly to your bank.
            </p>
            <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px] transition-all group-hover:bg-emerald-500/20" />
          </div>
        </ScrollAnimation>

        {/* Feature: No Time Limits */}
        <ScrollAnimation className="md:col-span-1 md:row-span-1 h-full" delay={0}>
          <div className="group relative flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 transition-all hover:bg-white/5">
            <div className="flex items-center gap-3 mb-3">
              <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold text-white">No Time Limits</h3>
            </div>
            <p className="text-sm text-white/50">Take as long as you need. No pressure, no rushing. Trade responsibly at your own pace.</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-400">Unlimited Duration</span>
            </div>
          </div>
        </ScrollAnimation>

        {/* Feature: News Trading */}
        <ScrollAnimation className="md:col-span-1 md:row-span-1 h-full" delay={0}>
          <div className="group relative flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 transition-all hover:bg-white/5">
            <div className="flex items-center gap-3 mb-3">
              <svg className="h-8 w-8 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="text-xl font-bold text-white">News Trading</h3>
            </div>
            <p className="text-sm text-white/50">Trade during major news events. No restrictions on economic announcements.</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-400">Allowed ✓</span>
            </div>
          </div>
        </ScrollAnimation>

        {/* Row 2 */}
        {/* Feature: Evaluation Models */}
        <ScrollAnimation className="md:col-span-2 md:row-span-1 h-full" delay={150}>
          <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-4">Choose Your Evaluation Model</h3>
              <div className="flex flex-col md:flex-row items-stretch gap-4">
                <div className="group relative flex-1 flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 transition-all hover:bg-white/5">
                  <div className="text-lg font-bold text-white mb-2">1-Step Challenge</div>
                  <ul className="space-y-2 text-xs text-white/60">
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                      10% Profit Target
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                      6% Trailing Drawdown
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                      4% Daily Loss Limit
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                      Min 3 Trading Days
                    </li>
                  </ul>
                </div>
                <div className="group relative flex-1 flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 transition-all hover:bg-white/5">
                  <div className="text-lg font-bold text-white mb-2">2-Step Challenge</div>
                  <ul className="space-y-2 text-xs text-white/60">
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                      Step 1: 8% | Step 2: 6%
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                      8% Static Drawdown
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                      4% Daily Loss Limit
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                      Min 3 Trading Days
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* Feature: Scaling */}
        <ScrollAnimation className="md:col-span-1 md:row-span-1 h-full" delay={150}>
          <div className="group relative flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 transition-all hover:bg-white/5">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Scale to</h3>
              <h3 className="text-3xl font-black text-emerald-400">₹5 Crore</h3>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-white/50">Path: ₹1Cr → ₹2Cr → ₹4Cr → ₹5Cr</p>
              <p className="text-[10px] text-white/40">Requires 3 profitable months @ 10%+</p>
            </div>
          </div>
        </ScrollAnimation>

        {/* Feature: Payouts */}
        <ScrollAnimation className="md:col-span-1 md:row-span-1 h-full" delay={150}>
          <div className="group relative flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 transition-all hover:bg-white/5">
            <div>
              <h3 className="text-3xl font-black text-white">30 Days</h3>
              <p className="text-sm font-medium text-white/50">Standard Payout Cycle</p>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-emerald-400">14-day add-on available</p>
              <p className="text-[10px] text-white/40">UPI • Bank Transfer • Crypto</p>
            </div>
          </div>
        </ScrollAnimation>

        {/* Row 3 */}
        {/* Feature: EAs Allowed */}
        <ScrollAnimation className="md:col-span-1 md:row-span-1 h-full" delay={300}>
          <div className="group relative flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 transition-all hover:bg-white/5">
            <div className="flex items-center gap-3 mb-3">
              <svg className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-bold text-white">EAs Allowed</h3>
            </div>
            <p className="text-sm text-white/50">Expert Advisors and automated trading strategies are fully supported.</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-medium text-purple-400">Bots Welcome</span>
            </div>
          </div>
        </ScrollAnimation>

        {/* Feature: SEBI Instruments */}
        <ScrollAnimation className="md:col-span-1 md:row-span-1 h-full" delay={300}>
          <div className="group relative flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 transition-all hover:bg-white/5">
            <div className="flex items-center gap-3 mb-3">
              <svg className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-xl font-bold text-white">SEBI Approved</h3>
            </div>
            <p className="text-sm text-white/50">Trade only SEBI-approved instruments. NSE stocks, Nifty & Bank Nifty F&O.</p>
          </div>
        </ScrollAnimation>

        {/* Feature: Platforms */}
        <ScrollAnimation className="md:col-span-2 md:row-span-1 h-full" delay={300}>
          <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 transition-all hover:bg-white/5">
            <h3 className="text-lg font-bold text-white mb-4">Industry-Standard Platforms</h3>
            <div className="flex items-center gap-6">
              <div className="text-center flex-1">
                <div className="text-3xl font-black text-white">MT5</div>
                <div className="text-xs text-white/40 mt-1">MetaTrader 5</div>
                <p className="text-[10px] text-white/30 mt-2">Primary Platform</p>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="flex-1 text-left">
                <p className="text-sm text-white/60">Professional-grade charting, advanced order types, and seamless execution in a simulated environment with real market data.</p>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
