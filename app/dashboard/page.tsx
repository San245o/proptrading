"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrophyIcon, PlusIcon, ChevronRightIcon, TrendingUpIcon, TrendingDownIcon } from '@/components/dashboard/icons';
import { useSimulation } from '@/app/context/SimulationContext';

// --- Stagger Animation Hook ---
function useStaggerMount(itemCount: number, baseDelay = 80) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false));
  
  useEffect(() => {
    setVisibleItems(new Array(itemCount).fill(false));
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

// --- Card Components ---
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
    <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${Math.min(100, progress)}%` }} />
  </div>
);

// --- Static Data ---
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
  const { accounts, formatCurrency, getProgress, isLoading, state } = useSimulation();
  const visible = useStaggerMount(10, 80);

  // Calculate totals from all accounts
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalPnL = accounts.reduce((sum, acc) => sum + acc.pnl, 0);
  const totalTrades = accounts.reduce((sum, acc) => sum + acc.totalTrades, 0);
  const totalWins = accounts.reduce((sum, acc) => sum + acc.winningTrades, 0);
  const overallWinRate = totalTrades > 0 ? (totalWins / totalTrades) * 100 : 0;
  
  // Get active accounts (not breached)
  const activeAccounts = accounts.filter(acc => acc.status !== 'breached');
  const evaluationAccounts = accounts.filter(acc => acc.status === 'evaluation');
  const fundedAccounts = accounts.filter(acc => acc.status === 'funded' || acc.status === 'passed');

  // Recent trades from all accounts
  const recentTrades = accounts
    .flatMap(acc => acc.trades.map(t => ({ ...t, accountName: acc.name })))
    .sort((a, b) => new Date(b.closeTime || b.openTime).getTime() - new Date(a.closeTime || a.openTime).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <FadeInItem visible={visible[0]}>
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Dashboard Overview
            </h1>
            <p className="text-gray-400 mt-2">Welcome back, {state.userProfile.name}.</p>
          </div>
          <Link
            href="/dashboard/new-challenge"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            New Challenge
          </Link>
        </header>
      </FadeInItem>
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FadeInItem visible={visible[1]}>
          <CardInner className="!p-5">
            <div className="text-sm text-gray-400 mb-1">Total Balance</div>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalBalance)}</div>
            <div className="text-xs text-gray-500 mt-1">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</div>
          </CardInner>
        </FadeInItem>

        <FadeInItem visible={visible[2]}>
          <CardInner className="!p-5">
            <div className="text-sm text-gray-400 mb-1">Total P&L</div>
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
            </div>
            <div className="text-xs text-gray-500 mt-1">{totalTrades} total trades</div>
          </CardInner>
        </FadeInItem>

        <FadeInItem visible={visible[3]}>
          <CardInner className="!p-5">
            <div className="text-sm text-gray-400 mb-1">Win Rate</div>
            <div className="text-2xl font-bold text-white">{overallWinRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 mt-1">{totalWins} wins / {totalTrades - totalWins} losses</div>
          </CardInner>
        </FadeInItem>

        <FadeInItem visible={visible[4]}>
          <CardInner className="!p-5">
            <div className="text-sm text-gray-400 mb-1">Active Accounts</div>
            <div className="text-2xl font-bold text-white">{activeAccounts.length}</div>
            <div className="text-xs text-gray-500 mt-1">{evaluationAccounts.length} eval, {fundedAccounts.length} funded</div>
          </CardInner>
        </FadeInItem>
      </div>

      {/* Accounts Overview */}
      <FadeInItem visible={visible[5]}>
        <CardOuter>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">My Accounts</h3>
            <Link href="/dashboard/accounts" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View All <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>
          
          {accounts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <TrendingUpIcon className="w-8 h-8 text-gray-500" />
              </div>
              <h4 className="text-white font-medium mb-2">No accounts yet</h4>
              <p className="text-gray-400 text-sm mb-4">Start your trading journey with a new challenge</p>
              <Link
                href="/dashboard/new-challenge"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Start Challenge
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.slice(0, 3).map(account => {
                const progress = getProgress(account);
                return (
                  <Link key={account.id} href="/dashboard/accounts">
                    <CardInner className="!p-5 hover:border-blue-500/30 transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-white">{account.name}</h4>
                          <p className="text-xs text-gray-500">#{account.id.slice(0, 8)}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          account.status === 'evaluation' ? 'bg-blue-500/20 text-blue-400' :
                          account.status === 'passed' || account.status === 'funded' ? 'bg-emerald-500/20 text-emerald-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {account.status === 'evaluation' ? 'Evaluation' : 
                           account.status === 'passed' ? 'Passed' :
                           account.status === 'funded' ? 'Funded' : 'Breached'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-400 text-sm">Balance</span>
                        <span className="font-bold text-white">{formatCurrency(account.balance)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-400 text-sm">P&L</span>
                        <span className={`font-bold ${account.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {account.pnl >= 0 ? '+' : ''}{formatCurrency(account.pnl)}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Profit Progress</span>
                          <span>{progress.profitProgress.toFixed(1)}%</span>
                        </div>
                        <ProgressBar progress={progress.profitProgress} color="bg-emerald-500" />
                      </div>
                    </CardInner>
                  </Link>
                );
              })}
            </div>
          )}
        </CardOuter>
      </FadeInItem>

      {/* Middle Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Trading Style */}
        <FadeInItem visible={visible[6]}>
          <CardOuter>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Trading Style</h3>
              <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs border border-emerald-500/20">
                {totalPnL >= 0 ? 'Bullish' : 'Bearish'}
              </span>
            </div>
            <div className="relative h-24 flex items-center justify-center">
              <div className="flex gap-2 items-end">
                <div className="w-4 h-12 bg-emerald-500/20 rounded-t" />
                <div className="w-4 h-16 bg-emerald-500/40 rounded-t" />
                <div className="w-4 h-10 bg-red-500/20 rounded-t" />
                <div className="w-4 h-20 bg-emerald-500 rounded-t shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2 text-center">
              {totalTrades > 0 ? `${totalTrades} trades executed` : 'No trades yet'}
            </p>
          </CardOuter>
        </FadeInItem>

        {/* Trader Level */}
        <FadeInItem visible={visible[7]}>
          <CardOuter className="!border-yellow-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Trader Level</h3>
              <TrophyIcon className="text-yellow-500 w-6 h-6" />
            </div>
            <div className="text-3xl font-bold text-yellow-500 mb-1">
              {state.userProfile.totalPayouts >= 50000 ? 'Gold' : 
               state.userProfile.totalPayouts >= 10000 ? 'Silver' : 'Bronze'}
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {state.userProfile.totalPayouts >= 50000 ? 'Elite trader status' :
               state.userProfile.totalPayouts >= 10000 ? 'Unlock Gold at ₹50,000' : 'Unlock Silver at ₹10,000'}
            </p>
            <ProgressBar 
              progress={state.userProfile.totalPayouts >= 50000 ? 100 : (state.userProfile.totalPayouts / 500) * 100} 
              color="bg-gradient-to-r from-yellow-600 to-yellow-400" 
            />
          </CardOuter>
        </FadeInItem>

        {/* Rewards */}
        <FadeInItem visible={visible[8]}>
          <CardInner>
            <h3 className="text-lg font-bold text-white mb-4">Rewards</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Withdrawn</span>
                <span className="font-mono font-bold text-white">{formatCurrency(state.userProfile.totalPayouts)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Pending Payouts</span>
                <span className="font-mono text-amber-400 font-bold">{formatCurrency(state.userProfile.pendingPayouts)}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <Link href="/dashboard/profile">
                  <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors text-white">
                    Request Payout
                  </button>
                </Link>
              </div>
            </div>
          </CardInner>
        </FadeInItem>
      </div>

      {/* Recent Trades */}
      {recentTrades.length > 0 && (
        <FadeInItem visible={visible[9]}>
          <CardOuter>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Recent Trades</h3>
              <Link href="/dashboard/accounts" className="text-sm text-blue-400 hover:text-blue-300">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentTrades.map(trade => (
                <div key={trade.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      trade.pnl >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}>
                      {trade.pnl >= 0 ? (
                        <TrendingUpIcon className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <TrendingDownIcon className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">{trade.symbol}</div>
                      <div className="text-xs text-gray-500">
                        {trade.type.toUpperCase()} • {trade.lots} lots
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                    </div>
                    <div className="text-xs text-gray-500">{trade.accountName}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardOuter>
        </FadeInItem>
      )}

      {/* Bottom Section: Instruments & Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FadeInItem visible={visible[9]}>
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

        <FadeInItem visible={visible[9]} className="col-span-1 md:col-span-2">
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
