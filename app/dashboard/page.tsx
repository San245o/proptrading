"use client";

import React, { useState, useEffect } from 'react';
import { TrophyIcon } from '@/components/dashboard/icons';

// --- Stagger Animation Hook ---
function useStaggerMount(itemCount: number, baseDelay = 80) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false));
  
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    for (let i = 0; i < itemCount; i++) {
      timers.push(
        setTimeout(() => {
          setVisibleItems(prev => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * baseDelay)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [itemCount, baseDelay]);
  
  return visibleItems;
}

// --- Animation Wrapper ---
const FadeInItem = ({ 
  visible, 
  children, 
  className = "" 
}: { 
  visible: boolean; 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div 
    className={`
      transition-all
      duration-[570ms]
      ease-[cubic-bezier(0.22,1,0.36,1)]
      ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-[0.98]'}
      ${className}
    `}
  >
    {children}
  </div>
);

// --- Simple Card Components (no external deps) ---
const CardOuter = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] p-6 ${className}`}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
    <div className="relative z-10 h-full">{children}</div>
  </div>
);

const CardInner = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 transition-all hover:bg-white/5 ${className}`}>
    {children}
  </div>
);

const ProgressBar = ({ progress, color = "bg-blue-600" }: { progress: number; color?: string }) => (
  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mt-2">
    <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${progress}%` }} />
  </div>
);

// --- Activity Data (inline, no external fetch) ---
const ACTIVITY_DATA = [
  { day: "Today", pnl: "+$340.50", type: "win" },
  { day: "Yesterday", pnl: "-$120.00", type: "loss" },
  { day: "Oct 22", pnl: "+$550.20", type: "win" },
];

const INSTRUMENTS = [
  { name: "XAUUSD", volume: "45%", color: "bg-yellow-500" },
  { name: "EURUSD", volume: "30%", color: "bg-blue-500" },
  { name: "US30", volume: "25%", color: "bg-purple-500" },
];

const SESSIONS = [
  { session: "London", rate: "72%", active: true },
  { session: "New York", rate: "65%", active: true },
  { session: "Asian", rate: "40%", active: false },
];

export default function DashboardPage() {
  // 8 items to stagger: header, 3 top cards, performance section, 3 bottom items
  const visible = useStaggerMount(8, 80);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <FadeInItem visible={visible[0]}>
        <header className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-2">Welcome back, Trader.</p>
        </header>
      </FadeInItem>
      
      {/* Top Section: Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FadeInItem visible={visible[1]}>
          <CardOuter>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Trading Style</h3>
              <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs border border-emerald-500/20">Bullish</span>
            </div>
            <div className="relative h-24 flex items-center justify-center">
              <div className="flex gap-2 items-end">
                <div className="w-4 h-12 bg-emerald-500/20 rounded-t" />
                <div className="w-4 h-16 bg-emerald-500/40 rounded-t" />
                <div className="w-4 h-10 bg-red-500/20 rounded-t" />
                <div className="w-4 h-20 bg-emerald-500 rounded-t shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2 text-center">Primarily Long Positions</p>
          </CardOuter>
        </FadeInItem>

        <FadeInItem visible={visible[2]}>
          <CardOuter className="!border-yellow-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Trader Level</h3>
              <TrophyIcon className="text-yellow-500 w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-yellow-500 mb-1">Bronze</div>
            <p className="text-sm text-gray-400 mb-4">Unlock Silver at $2,000 withdrawn</p>
            <ProgressBar progress={45} color="bg-gradient-to-r from-yellow-600 to-yellow-400" />
          </CardOuter>
        </FadeInItem>

        <FadeInItem visible={visible[3]}>
          <CardInner>
            <h3 className="text-lg font-bold text-white mb-4">Rewards</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Withdrawn</span>
                <span className="font-mono font-bold text-white">$1,250.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Highest Payout</span>
                <span className="font-mono text-emerald-400 font-bold">$850.00</span>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors text-white">
                  Request Payout
                </button>
              </div>
            </div>
          </CardInner>
        </FadeInItem>
      </div>

      {/* Middle Section: Performance */}
      <FadeInItem visible={visible[4]}>
        <CardOuter className="!p-8">
          <h3 className="text-lg font-bold text-white mb-6">Performance Intelligence</h3>
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <CardInner className="flex-1">
              <div className="text-lg font-bold text-white mb-6">Win Rate Analysis</div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 h-32 w-32 relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-500/5" />
                  <span className="text-4xl font-bold text-emerald-400 z-10">68%</span>
                  <span className="text-xs text-gray-400 mt-2 z-10">Win Rate</span>
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">Total Trades</h4>
                    <div className="text-2xl font-bold text-white">142</div>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">Profit Factor</h4>
                    <div className="text-2xl font-bold text-white">2.4</div>
                    <div className="text-xs text-gray-500 mt-1">Healthy &gt; 1.5</div>
                  </div>
                </div>
              </div>
            </CardInner>

            <CardInner className="flex-1">
              <div className="text-lg font-bold text-white mb-6">Recent Daily P&L</div>
              <div className="space-y-4">
                {ACTIVITY_DATA.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                    <span className="text-sm font-medium text-gray-300">{item.day}</span>
                    <span className={`font-mono font-bold ${item.type === 'win' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.pnl}
                    </span>
                  </div>
                ))}
              </div>
            </CardInner>
          </div>
        </CardOuter>
      </FadeInItem>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FadeInItem visible={visible[5]}>
          <CardInner>
            <h3 className="text-lg font-bold text-white mb-4">Top Instruments</h3>
            <div className="space-y-3">
              {INSTRUMENTS.map((inst) => (
                <div key={inst.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{inst.name}</span>
                    <span className="text-gray-400 font-mono">{inst.volume}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${inst.color}`} style={{ width: inst.volume }} />
                  </div>
                </div>
              ))}
            </div>
          </CardInner>
        </FadeInItem>

        <FadeInItem visible={visible[6]} className="col-span-1 md:col-span-2">
          <CardOuter>
            <h3 className="text-lg font-bold text-white mb-4">Session Win Rates</h3>
            <div className="grid grid-cols-3 gap-4">
              {SESSIONS.map((s) => (
                <div key={s.session} className={`p-4 rounded-2xl border transition-all ${s.active ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 bg-white/5'}`}>
                  <div className="text-sm text-gray-400 mb-2 font-medium">{s.session}</div>
                  <div className={`text-2xl font-bold ${s.active ? 'text-white' : 'text-gray-500'}`}>{s.rate}</div>
                </div>
              ))}
            </div>
          </CardOuter>
        </FadeInItem>
      </div>
    </div>
  );
}
