"use client";

import { useState } from "react";
import Link from "next/link";
import { ACCOUNT_SIZES, PRICING_DATA, PRICING_TOOLTIPS } from "@/app/data/pricing";

export default function Pricing() {
  const [selectedAccount, setSelectedAccount] = useState("500000");

  return (
    <section id="pricing" className="relative z-10 w-full py-20 lg:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Choose Your <span className="text-emerald-400">Account Size</span>
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Same fee for both 1-Step and 2-Step evaluation models
          </p>
        </div>

        {/* Account Size Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-black/50 p-2">
          {ACCOUNT_SIZES.map((account) => (
            <button
              key={account.value}
              onClick={() => setSelectedAccount(account.value)}
              className={`relative rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                selectedAccount === account.value
                  ? "bg-emerald-500 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {account.label}
              {account.popular && selectedAccount !== account.value && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400" />
              )}
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-white/5">
            <div className="p-4" />
            <div className="border-l border-white/10 p-4 text-center">
              <h3 className="text-2xl font-black italic text-white">1-STEP</h3>
            </div>
            <div className="border-l border-white/10 p-4 text-center">
              <h3 className="text-2xl font-black italic text-white">2-STEP</h3>
            </div>
          </div>

          {/* Table Rows */}
          {[
            { label: "Your Profit Share", key: "profitShare" },
            { label: "Profit Target", key: "profitTarget" },
            { label: "Step 2 Goal", key: "step2Goal" },
            { label: "Max. Daily Loss", key: "dailyLoss" },
            { label: "Max. Drawdown", key: "maxDrawdown" },
          ].map((row, i) => (
            <div
              key={row.key}
              className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}`}
            >
              <div className="flex items-center gap-2 p-4">
                <span className="text-sm font-medium text-white/70">{row.label}</span>
                <div className="group relative">
                  <span className="flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-white/20 text-[10px] text-white/40 transition hover:border-emerald-500/50 hover:text-emerald-400">?</span>
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-xl border border-white/10 bg-[#1a1a1a] p-3 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                    <p className="text-xs leading-relaxed text-white/70">{PRICING_TOOLTIPS[row.key]}</p>
                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-[#1a1a1a]" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center border-l border-white/10 p-4">
                <span className="text-sm font-semibold text-white">{PRICING_DATA[selectedAccount].oneStep[row.key as keyof typeof PRICING_DATA["50000"]["oneStep"]]}</span>
              </div>
              <div className="flex items-center justify-center border-l border-white/10 p-4">
                <span className="text-sm font-semibold text-white">{PRICING_DATA[selectedAccount].twoStep[row.key as keyof typeof PRICING_DATA["50000"]["twoStep"]]}</span>
              </div>
            </div>
          ))}

          {/* Fee Row - Centered */}
          <div className="grid grid-cols-1 border-t border-white/10 bg-gradient-to-r from-emerald-900/20 via-emerald-900/10 to-emerald-900/20">
            <div className="flex flex-col items-center justify-center p-6">
              <span className="text-sm font-medium text-white/60 mb-2">Fee</span>
              <span className="text-4xl font-black text-emerald-400">{ACCOUNT_SIZES.find(a => a.value === selectedAccount)?.fee}</span>
              <span className="text-xs text-white/40 mt-1">One-time payment</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="border-t border-white/10 bg-black/30 p-4">
            <Link href="/login" className="block w-full rounded-lg bg-emerald-500 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-600">
              Start Challenge
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-900/20 to-transparent p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
                <span className="text-lg font-bold text-emerald-400">1</span>
              </div>
              <h4 className="text-xl font-bold text-white">One-Step Challenge</h4>
            </div>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span><strong className="text-white/80">10% profit target</strong> to pass and get funded</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span><strong className="text-white/80">6% trailing drawdown</strong> — locks at starting balance once reached</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span><strong className="text-white/80">4% daily loss limit</strong> — calculated on daily balance close</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span><strong className="text-white/80">Minimum 3 trading days</strong> — no maximum time limit</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span><strong className="text-white/80">Max 3% risk per trade</strong> — 20% total exposure</span>
              </li>
            </ul>
            <div className="mt-4 rounded-lg bg-emerald-500/10 p-3">
              <p className="text-xs text-emerald-400/80"><strong>Best for:</strong> Traders who want a faster path to funding with a single evaluation phase.</p>
            </div>
          </div>
          <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-transparent p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                <span className="text-lg font-bold text-blue-400">2</span>
              </div>
              <h4 className="text-xl font-bold text-white">Two-Step Challenge</h4>
            </div>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span><strong className="text-white/80">Step 1: 8%</strong> profit target | <strong className="text-white/80">Step 2: 6%</strong> target</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span><strong className="text-white/80">8% static drawdown</strong> — does not trail, fixed from start</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span><strong className="text-white/80">4% daily loss limit</strong> — calculated on daily balance close</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span><strong className="text-white/80">Minimum 3 trading days per step</strong> — no time limit</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span><strong className="text-white/80">Max 3% risk per trade</strong> — across all open positions</span>
              </li>
            </ul>
            <div className="mt-4 rounded-lg bg-blue-500/10 p-3">
              <p className="text-xs text-blue-400/80"><strong>Best for:</strong> Traders who prefer lower targets per phase with a fixed drawdown structure.</p>
            </div>
          </div>
        </div>

        {/* Trading Rules Summary */}
        <div className="mx-auto mt-12 max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-8 transition-all hover:bg-white/5">
          <h4 className="mb-8 text-center text-2xl font-bold text-white">Trading Rules Summary</h4>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <h5 className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <span>✓</span> Allowed
              </h5>
              <ul className="space-y-3 text-sm text-white/60">
                <li>News trading</li>
                <li>Expert Advisors (EAs)</li>
                <li>Manual & systematic strategies</li>
                <li>Copy trading (own accounts only)</li>
              </ul>
            </div>
            <div className="flex flex-col items-center text-center">
              <h5 className="mb-4 flex items-center gap-2 text-sm font-semibold text-red-400">
                <span>✗</span> Prohibited
              </h5>
              <ul className="space-y-3 text-sm text-white/60">
                <li>Overnight holding</li>
                <li>Weekend holding</li>
                <li>Cross-account hedging</li>
                <li>HFT & latency arbitrage</li>
              </ul>
            </div>
            <div className="flex flex-col items-center text-center">
              <h5 className="mb-4 text-sm font-semibold text-white/90">Funded Phase</h5>
              <ul className="space-y-3 text-sm text-white/60">
                <li>80% profit split</li>
                <li>8% trailing drawdown</li>
                <li>30-day payout cycle (14-day add-on)</li>
                <li>No consistency rule</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
