"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { TrophyIcon, PlusIcon, ChevronRightIcon, TrendingUpIcon, TrendingDownIcon } from '@/components/dashboard/icons';
import { useSimulation } from '@/app/context/SimulationContext';
import { Sparkline, generateSparklineData } from '@/components/dashboard/Sparkline';
import { FancyButton, PlusIconButton, WalletIconButton } from '@/components/dashboard/FancyButton';

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

const ProgressBar = ({ progress, color = "bg-emerald-600" }: { progress: number; color?: string }) => (
  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mt-2">
    <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${Math.min(100, progress)}%` }} />
  </div>
);

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

  // Calculate top instruments from real trade data
  const instrumentStats = useMemo(() => {
    const allTrades = accounts.flatMap(acc => acc.trades);
    if (allTrades.length === 0) {
      return [
        { name: "NIFTY50", volume: 0, color: "bg-blue-500" },
        { name: "BANKNIFTY", volume: 0, color: "bg-emerald-500" },
        { name: "FINNIFTY", volume: 0, color: "bg-purple-500" },
      ];
    }
    
    const grouped: Record<string, number> = {};
    allTrades.forEach(t => {
      grouped[t.symbol] = (grouped[t.symbol] || 0) + t.lots;
    });
    
    const totalLots = Object.values(grouped).reduce((a, b) => a + b, 0);
    const colors = ["bg-yellow-500", "bg-emerald-500", "bg-purple-500", "bg-blue-500", "bg-pink-500"];
    
    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, lots], i) => ({
        name,
        volume: totalLots > 0 ? Math.round((lots / totalLots) * 100) : 0,
        color: colors[i % colors.length],
      }));
  }, [accounts]);

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
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Dashboard Overview
            </h1>
            <p className="text-gray-400 mt-2">Welcome back, {state.userProfile.name}.</p>
          </div>
          <FancyButton href="/dashboard/new-challenge" icon={<PlusIconButton />}>
            New Challenge
          </FancyButton>
        </header>
      </FadeInItem>
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FadeInItem visible={visible[1]}>
          <CardInner className="!p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400 mb-1">Total Balance</div>
              <Sparkline data={generateSparklineData(totalBalance, true)} width={40} height={16} />
            </div>
            <div className="text-2xl font-bold text-white">{formatCurrency(totalBalance)}</div>
            <div className="text-xs text-gray-500 mt-1">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</div>
          </CardInner>
        </FadeInItem>

        <FadeInItem visible={visible[2]}>
          <CardInner className="!p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400 mb-1">Total P&L</div>
              <Sparkline data={generateSparklineData(totalPnL, totalPnL >= 0)} width={40} height={16} />
            </div>
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
            </div>
            <div className="text-xs text-gray-500 mt-1">{totalTrades} total trades</div>
          </CardInner>
        </FadeInItem>

        <FadeInItem visible={visible[3]}>
          <CardInner className="!p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400 mb-1">Win Rate</div>
              <Sparkline data={generateSparklineData(overallWinRate, overallWinRate >= 50)} width={40} height={16} />
            </div>
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition-colors"
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
                <FancyButton 
                  href="/dashboard/profile" 
                  className="w-full justify-center"
                  icon={<WalletIconButton />}
                >
                  Request Payout
                </FancyButton>
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
                <div key={trade.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
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
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{trade.symbol}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          trade.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {trade.type === 'buy' ? '↑ LONG' : '↓ SHORT'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{trade.lots} lots</div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <Sparkline data={generateSparklineData(trade.pnl, trade.pnl >= 0, 8)} width={36} height={14} />
                    <div>
                      <div className={`font-bold flex items-center gap-1 ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trade.pnl >= 0 ? (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                        ) : (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        )}
                        {formatCurrency(Math.abs(trade.pnl))}
                      </div>
                      <div className="text-xs text-gray-500">{trade.accountName}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardOuter>
        </FadeInItem>
      )}

      {/* Bottom Section: Top Instruments */}
      <FadeInItem visible={visible[9]}>
        <CardInner>
          <h3 className="text-lg font-bold text-white mb-4">Top Instruments</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {instrumentStats.map((inst) => (
              <div key={inst.name} className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{inst.name}</span>
                  <span className="text-gray-400 font-mono text-sm">{inst.volume}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${inst.color} rounded-full transition-all duration-500`} style={{ width: `${Math.max(inst.volume, 5)}%` }} />
                </div>
              </div>
            ))}
          </div>
          {instrumentStats.length === 0 && (
            <div className="text-gray-500 text-sm text-center py-4">No trades yet</div>
          )}
        </CardInner>
      </FadeInItem>
    </div>
  );
}
