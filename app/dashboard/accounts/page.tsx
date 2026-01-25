"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, LineData, Time, LineSeries } from 'lightweight-charts';
import { XIcon, ChevronLeftIcon, ChevronRightIcon, InfoIcon, CalendarIcon, TrendingUpIcon, TrendingDownIcon, TargetIcon, ClockIcon } from '@/components/dashboard/icons';

// --- Stagger Animation Hook ---
function useStaggerMount(itemCount: number, baseDelay = 80) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false));
  
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    for (let i = 0; i < itemCount; i++) {
      timers.push(setTimeout(() => {
        setVisibleItems(prev => { const next = [...prev]; next[i] = true; return next; });
      }, i * baseDelay));
    }
    return () => timers.forEach(clearTimeout);
  }, [itemCount, baseDelay]);
  
  return visibleItems;
}

const FadeInItem = ({ visible, children, className = "" }: { visible: boolean; children: React.ReactNode; className?: string }) => (
  <div className={`transition-all duration-[570ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'} ${className}`}>
    {children}
  </div>
);

// --- Mock Data ---
const ACCOUNT_DATA = {
  id: "1444096",
  accountSize: 100000.00,
  pnl: 3300.92,
  startDate: "Oct 21, 2024",
  endDate: "Nov 22, 2024",
  balance: 103300.92,
  equity: 103300.92,
  minBalance: 99405.00,
  minEquity: 99285.00,
  fpScore: 50,
  radarData: { consistency: 85, slUsage: 70, wr: 67, rr: 78 },
};

const TRADING_OBJECTIVES = {
  minTradingDays: { current: 2, target: 3, progress: 66.67 },
  maxDailyLoss: { allowed: 4132.04, remaining: 4132.04, startingEquity: 103300.92, threshold: 99168.88, resetTime: "09:16:57" },
  maxLoss: { allowed: 8000.00, remaining: 7285.00, threshold: 92000.00 },
  profitTarget: { current: 3300.92, target: 10000.00, progress: 33.01 },
  consistencyScore: { progress: 82.73, maxDailyProfit: 2730.92, maxAllowed: 45 },
};

const BALANCE_HISTORY: LineData[] = [
  { time: '2024-10-21' as Time, value: 100000 },
  { time: '2024-10-22' as Time, value: 100570 },
  { time: '2024-10-23' as Time, value: 103300 },
  { time: '2024-10-24' as Time, value: 103300 },
  { time: '2024-10-25' as Time, value: 103300 },
  { time: '2024-10-26' as Time, value: 103300 },
  { time: '2024-10-27' as Time, value: 103300 },
  { time: '2024-10-28' as Time, value: 103300 },
  { time: '2024-10-29' as Time, value: 103300 },
  { time: '2024-10-30' as Time, value: 103300 },
  { time: '2024-10-31' as Time, value: 103300 },
  { time: '2024-11-01' as Time, value: 103300 },
  { time: '2024-11-05' as Time, value: 103300 },
  { time: '2024-11-10' as Time, value: 103300 },
];

const WEEKLY_SUMMARY = [
  { week: "Week One", dateRange: "Sep 29 - Oct 5", pnl: null, trades: "No trades" },
  { week: "Week Two", dateRange: "Oct 6 - Oct 12", pnl: null, trades: "No trades" },
  { week: "Week Three", dateRange: "Oct 13 - Oct 19", pnl: null, trades: "No trades" },
  { week: "Week Four", dateRange: "Oct 20 - Oct 26", pnl: 3300.92, days: 2 },
  { week: "Week Five", dateRange: "Oct 27 - Nov 2", pnl: null, trades: "No trades" },
];

const TRADING_DAYS: Record<string, { profit: number; trades: number }> = {
  '2024-10-21': { profit: 570.00, trades: 2 },
  '2024-10-23': { profit: 2730.92, trades: 1 },
};

const TRADING_STATS = {
  numberOfDays: 2,
  totalTrades: 3,
  totalLots: 21.00,
  biggestWin: 2730.92,
  biggestLoss: -560.00,
  averageWin: 1930.46,
  winRatio: 66.67,
  averageLoss: -560.00,
  profitFactor: 6.89,
};

const TRADING_HISTORY = [
  { id: 1, symbol: "AUDUSD", type: "Sell", openDate: "10/22/2024, 21:04", closedDate: "10/23/2024, 15:43", open: 0.66848, closed: 0.66387, tp: 0.66385, sl: 0.66976, lots: 6, commission: 42.00, profit: 2730.92 },
  { id: 2, symbol: "EURUSD", type: "Sell", openDate: "10/21/2024, 16:56", closedDate: "10/21/2024, 19:03", open: 1.08557, closed: 1.08324, tp: 1.08323, sl: 1.08613, lots: 5, commission: 35.00, profit: 1130.00 },
  { id: 3, symbol: "EURUSD", type: "Sell", openDate: "10/21/2024, 13:47", closedDate: "10/21/2024, 16:31", open: 1.08537, closed: 1.08586, tp: 1.08377, sl: 1.08586, lots: 10, commission: 70.00, profit: -560.00 },
];

const OPEN_POSITIONS = [
  { id: 1, symbol: "BTCUSD", type: "Buy", openDate: "10/26/2024, 15:30", open: 42350.00, current: 42500.00, tp: 43000.00, sl: 41500.00, lots: 0.5, profit: 75.00 },
];

// --- Radar Chart Component ---
const RadarChart = ({ data, score }: { data: { consistency: number; slUsage: number; wr: number; rr: number }; score: number }) => {
  const size = 180;
  const center = size / 2;
  const maxRadius = 60;
  const levels = 4;
  
  const axes = [
    { key: 'consistency', label: 'Consistency', angle: -90 },
    { key: 'slUsage', label: 'SL usage', angle: 0 },
    { key: 'wr', label: 'WR', angle: 180 },
    { key: 'rr', label: 'RR', angle: 90 },
  ];

  const getPoint = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return { x: center + radius * Math.cos(rad), y: center + radius * Math.sin(rad) };
  };

  const dataPoints = axes.map(axis => {
    const value = data[axis.key as keyof typeof data] / 100;
    return getPoint(axis.angle, value * maxRadius);
  });

  const polygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {Array.from({ length: levels }).map((_, i) => {
          const radius = ((i + 1) / levels) * maxRadius;
          const points = axes.map(axis => getPoint(axis.angle, radius));
          return <polygon key={i} points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />;
        })}
        {axes.map(axis => {
          const end = getPoint(axis.angle, maxRadius);
          return <line key={axis.key} x1={center} y1={center} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />;
        })}
        <polygon points={polygonPoints} fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="2" />
        {dataPoints.map((point, i) => <circle key={i} cx={point.x} cy={point.y} r="4" fill="white" />)}
      </svg>
      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-[10px] text-gray-400 font-medium">Consistency</span>
      <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 text-[10px] text-gray-400 font-medium">SL usage</span>
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-[10px] text-gray-400 font-medium">WR</span>
      <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 text-[10px] text-gray-400 font-medium">RR</span>
      <div className="absolute bottom-2 left-2">
        <div className="text-3xl font-bold text-white">{score}</div>
      </div>
    </div>
  );
};

// --- TradingView Chart Component ---
const BalanceChart = ({ data }: { data: LineData[] }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#6b7280' },
      grid: { vertLines: { color: 'rgba(255,255,255,0.03)' }, horzLines: { color: 'rgba(255,255,255,0.03)' } },
      width: chartContainerRef.current.clientWidth,
      height: 280,
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.1)' },
      timeScale: { borderColor: 'rgba(255,255,255,0.1)', timeVisible: true },
      crosshair: { horzLine: { color: 'rgba(59,130,246,0.3)' }, vertLine: { color: 'rgba(59,130,246,0.3)' } },
    });

    chartRef.current = chart;
    const lineSeries = chart.addSeries(LineSeries, { color: '#3b82f6', lineWidth: 2 });
    lineSeries.setData(data);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); chart.remove(); };
  }, [data]);

  return <div ref={chartContainerRef} className="w-full" />;
};

// --- Calendar Component ---
const Calendar = ({ currentDate, onDateChange, tradingDays, onDayClick }: { 
  currentDate: Date; onDateChange: (date: Date) => void;
  tradingDays: Record<string, { profit: number; trades: number }>; onDayClick: (date: string) => void;
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const formatDateKey = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-20 border-r border-b border-white/5" />);
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(day);
    const dayData = tradingDays[dateKey];
    days.push(
      <div key={day} onClick={() => dayData && onDayClick(dateKey)}
        className={`h-20 border-r border-b border-white/5 p-2 relative transition-colors ${dayData ? 'cursor-pointer hover:bg-white/5' : ''} ${dayData && dayData.profit > 0 ? 'bg-emerald-500/5' : ''} ${dayData && dayData.profit < 0 ? 'bg-red-500/5' : ''}`}>
        <span className={`text-sm ${dayData ? 'text-white font-medium' : 'text-gray-600'}`}>{day}</span>
        {dayData && (
          <div className="absolute bottom-2 right-2 text-right">
            <div className="text-[10px] text-gray-500">{dayData.trades} ⇌</div>
            <div className={`text-xs font-bold font-mono ${dayData.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${Math.abs(dayData.profit).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A]">
      <div className="flex items-center gap-4 p-4 border-b border-white/10">
        <button onClick={() => onDateChange(new Date(year, month - 1, 1))} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
        </button>
        <button onClick={() => onDateChange(new Date(year, month + 1, 1))} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
        </button>
        <h3 className="text-lg font-semibold text-white">{monthNames[month]} {year}</h3>
        <button onClick={() => onDateChange(new Date())} className="ml-auto px-4 py-2 text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" /> Today
        </button>
      </div>
      <div className="grid grid-cols-7 bg-white/5">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-b border-white/5">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">{days}</div>
    </div>
  );
};

// --- Donut Chart Component ---
const DonutChart = ({ value, total, label, centerLabel }: { value: number; total: number; label: string; centerLabel: string }) => {
  const percentage = (value / total) * 100;
  const circumference = 2 * Math.PI * 45;
  const greenStroke = (percentage / 100) * circumference;
  const redStroke = circumference - greenStroke;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" strokeWidth="8" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="8" 
            strokeDasharray={`${greenStroke} ${redStroke}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] text-gray-500 uppercase">{label}</span>
          <span className="text-xl font-bold text-white">{centerLabel}</span>
        </div>
      </div>
    </div>
  );
};

// --- Card Components ---
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] p-6 ${className}`}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
    <div className="relative z-10 h-full">{children}</div>
  </div>
);

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 transition-all hover:bg-white/5 ${className}`}>
    {children}
  </div>
);

const ObjectiveCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl p-5 border border-white/10 bg-[#0A0A0A] ${className}`}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50 pointer-events-none rounded-xl" />
    {children}
  </div>
);

const ProgressBar = ({ value, max, color = "bg-blue-500" }: { value: number; max: number; color?: string }) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
    </div>
  );
};

// --- Main Page ---
export default function AccountsPage() {
  const [calendarDate, setCalendarDate] = useState(new Date(2024, 9, 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'positions'>('history');
  const visible = useStaggerMount(16, 60);

  return (
    <div className="relative min-h-screen text-white space-y-8 pb-12">
      {/* Dark Dot Matrix Background */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundColor: '#0a0a0a',
        backgroundImage: `radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px), radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)`,
        backgroundSize: '10px 10px',
      }} />

      <div className="relative z-10 space-y-8">
        {/* Top Stats Row */}
        <FadeInItem visible={visible[0]}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: "$", label: "Account Size", value: `$${ACCOUNT_DATA.accountSize.toLocaleString()}`, color: "text-blue-400" },
              { icon: <TrendingUpIcon className="w-4 h-4" />, label: "PnL", value: `$${ACCOUNT_DATA.pnl.toLocaleString()}`, color: "text-emerald-400" },
              { icon: <CalendarIcon className="w-4 h-4" />, label: "Start Date", value: ACCOUNT_DATA.startDate, color: "text-white" },
              { icon: <CalendarIcon className="w-4 h-4" />, label: "End Date", value: ACCOUNT_DATA.endDate, color: "text-white" },
            ].map((item, i) => (
              <GlassCard key={i}>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <span className="text-blue-400">{item.icon}</span> {item.label}
                </div>
                <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              </GlassCard>
            ))}
          </div>
        </FadeInItem>

        {/* Score and Balance Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <FadeInItem visible={visible[1]} className="lg:col-span-4">
            <Card className="h-full bg-gradient-to-br from-blue-900/30 to-transparent !border-blue-500/20">
              <div className="flex items-center gap-2 mb-4">
                <TargetIcon className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-white">Score</span>
              </div>
              <div className="flex-1 flex items-center justify-center py-4">
                <RadarChart data={ACCOUNT_DATA.radarData} score={ACCOUNT_DATA.fpScore} />
              </div>
            </Card>
          </FadeInItem>

          <FadeInItem visible={visible[2]} className="lg:col-span-8">
            <Card className="h-full">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-gray-400 text-sm mb-2">Balance</div>
                  <div className="text-3xl font-bold text-white mb-3">${ACCOUNT_DATA.balance.toLocaleString()}</div>
                  <ProgressBar value={100} max={100} color="bg-blue-500" />
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span className="text-emerald-400">Min ${ACCOUNT_DATA.minBalance.toLocaleString()}</span>
                    <span className="text-blue-400">${ACCOUNT_DATA.balance.toLocaleString()} Max</span>
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-2">Equity</div>
                  <div className="text-3xl font-bold text-white mb-3">${ACCOUNT_DATA.equity.toLocaleString()}</div>
                  <ProgressBar value={100} max={100} color="bg-blue-500" />
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span className="text-emerald-400">Min ${ACCOUNT_DATA.minEquity.toLocaleString()}</span>
                    <span className="text-blue-400">${ACCOUNT_DATA.equity.toLocaleString()} Max</span>
                  </div>
                </div>
              </div>
            </Card>
          </FadeInItem>
        </div>

        {/* Account Balance Chart */}
        <FadeInItem visible={visible[3]}>
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Account Balance</h3>
            <BalanceChart data={BALANCE_HISTORY} />
          </Card>
        </FadeInItem>

        {/* Trading Objectives */}
        <FadeInItem visible={visible[4]}>
          <h2 className="text-xl font-bold text-white mb-4">Trading Objectives</h2>
          <div className="space-y-4">
            <ObjectiveCard>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Minimum Trading Days</span>
                  <InfoIcon className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm text-gray-400">Progress: <span className="font-semibold text-white">{TRADING_OBJECTIVES.minTradingDays.progress.toFixed(2)}%</span></span>
              </div>
              <ProgressBar value={TRADING_OBJECTIVES.minTradingDays.current} max={TRADING_OBJECTIVES.minTradingDays.target} color="bg-blue-500" />
              <div className="mt-2 text-sm text-gray-500">{TRADING_OBJECTIVES.minTradingDays.current} of {TRADING_OBJECTIVES.minTradingDays.target}.0 Trading Days Completed</div>
            </ObjectiveCard>

            <ObjectiveCard>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Maximum Daily Loss</span>
                  <InfoIcon className="w-4 h-4 text-gray-500" />
                  <span className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                    <ClockIcon className="w-3 h-3" /> Resets In: {TRADING_OBJECTIVES.maxDailyLoss.resetTime}
                  </span>
                </div>
                <span className="text-sm text-gray-400">Remaining: <span className="font-semibold text-white">${TRADING_OBJECTIVES.maxDailyLoss.remaining.toLocaleString()}</span></span>
              </div>
              <ProgressBar value={0} max={100} color="bg-blue-500" />
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                <span>Max Allowed: <span className="text-white">${TRADING_OBJECTIVES.maxDailyLoss.allowed.toLocaleString()}</span></span>
                <span>Starting Equity: <span className="text-white">${TRADING_OBJECTIVES.maxDailyLoss.startingEquity.toLocaleString()}</span></span>
                <span>Threshold: <span className="text-white">${TRADING_OBJECTIVES.maxDailyLoss.threshold.toLocaleString()}</span></span>
              </div>
            </ObjectiveCard>

            <ObjectiveCard>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Maximum Loss</span>
                  <InfoIcon className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm text-gray-400">Remaining: <span className="font-semibold text-white">${TRADING_OBJECTIVES.maxLoss.remaining.toLocaleString()}</span></span>
              </div>
              <ProgressBar value={715} max={8000} color="bg-blue-500" />
              <div className="mt-2 flex gap-4 text-sm text-gray-500">
                <span>Max Allowed: <span className="text-white">${TRADING_OBJECTIVES.maxLoss.allowed.toLocaleString()}</span></span>
                <span>Threshold: <span className="text-white">${TRADING_OBJECTIVES.maxLoss.threshold.toLocaleString()}</span></span>
              </div>
            </ObjectiveCard>

            <ObjectiveCard>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Profit Target</span>
                  <InfoIcon className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm text-gray-400">Progress: <span className="font-semibold text-white">{TRADING_OBJECTIVES.profitTarget.progress.toFixed(2)}%</span></span>
              </div>
              <ProgressBar value={TRADING_OBJECTIVES.profitTarget.current} max={TRADING_OBJECTIVES.profitTarget.target} color="bg-blue-500" />
              <div className="mt-2 text-sm text-gray-500">${TRADING_OBJECTIVES.profitTarget.current.toLocaleString()} of ${TRADING_OBJECTIVES.profitTarget.target.toLocaleString()} Profit Achieved</div>
            </ObjectiveCard>

            <ObjectiveCard>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Consistency Score</span>
                  <InfoIcon className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-sm text-gray-400">Progress: <span className="font-semibold text-white">{TRADING_OBJECTIVES.consistencyScore.progress.toFixed(2)}%</span></span>
              </div>
              <ProgressBar value={TRADING_OBJECTIVES.consistencyScore.progress} max={100} color="bg-blue-500" />
              <div className="mt-2 flex gap-4 text-sm text-gray-500">
                <span>Max Daily Profit: <span className="text-white">${TRADING_OBJECTIVES.consistencyScore.maxDailyProfit.toLocaleString()}</span></span>
                <span>Max Allowed: <span className="text-white">{TRADING_OBJECTIVES.consistencyScore.maxAllowed}%</span></span>
              </div>
            </ObjectiveCard>
          </div>
        </FadeInItem>

        {/* Daily Summary Section */}
        <FadeInItem visible={visible[5]}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Daily Summary</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-400">PnL: <span className="font-semibold text-emerald-400">${ACCOUNT_DATA.pnl.toLocaleString()}</span></span>
              <span className="text-gray-400">Days: <span className="font-semibold text-white">2</span></span>
            </div>
          </div>
        </FadeInItem>

        <FadeInItem visible={visible[6]}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Calendar currentDate={calendarDate} onDateChange={setCalendarDate} tradingDays={TRADING_DAYS} onDayClick={setSelectedDay} />
            </div>
            <div className="lg:col-span-1">
              <Card className="h-full">
                <h3 className="font-semibold text-white mb-4">Weekly Summary</h3>
                <div className="space-y-4">
                  {WEEKLY_SUMMARY.map((week, i) => (
                    <div key={i} className={`pb-4 ${i < WEEKLY_SUMMARY.length - 1 ? 'border-b border-white/10' : ''}`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-white">{week.week}</span>
                        <span className="text-xs text-gray-500">{week.dateRange}</span>
                      </div>
                      {week.pnl ? (
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-400 font-semibold">PnL: ${week.pnl.toLocaleString()}</span>
                          <span className="text-xs text-gray-500">Days: {week.days}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">{week.trades}</span>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </FadeInItem>

        {/* Stats Row */}
        <FadeInItem visible={visible[7]}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: <CalendarIcon className="w-4 h-4" />, label: "Number of days", value: TRADING_STATS.numberOfDays },
              { icon: "#", label: "Total Trades Taken", value: TRADING_STATS.totalTrades },
              { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, label: "Total Lots Used", value: TRADING_STATS.totalLots.toFixed(2) },
              { icon: <TrendingUpIcon className="w-4 h-4 text-emerald-400" />, label: "Biggest Win", value: `$${TRADING_STATS.biggestWin.toLocaleString()}`, color: "text-emerald-400" },
              { icon: <TrendingDownIcon className="w-4 h-4 text-red-400" />, label: "Biggest Loss", value: `-$${Math.abs(TRADING_STATS.biggestLoss).toLocaleString()}`, color: "text-red-400" },
            ].map((item, i) => (
              <GlassCard key={i}>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">{item.icon} {item.label}</div>
                <div className={`text-xl font-bold ${item.color || 'text-white'}`}>{item.value}</div>
              </GlassCard>
            ))}
          </div>
        </FadeInItem>

        {/* Analysis Section */}
        <FadeInItem visible={visible[8]}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-white mb-6">Short Analysis</h3>
              <div className="flex justify-center mb-6">
                <DonutChart value={66.67} total={100} label="Profit" centerLabel={`$${ACCOUNT_DATA.pnl.toLocaleString()}`} />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div><div className="text-gray-500">Wins (2)</div><div className="text-emerald-400 font-semibold">$3,860.92</div></div>
                <div><div className="text-gray-500">Win Rate</div><div className="text-white font-semibold">66.67%</div></div>
                <div><div className="text-gray-500">Losses (1)</div><div className="text-red-400 font-semibold">$560.00</div></div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-white mb-6">Profitability</h3>
              <div className="flex justify-center mb-6">
                <DonutChart value={66.67} total={100} label="Total Trades" centerLabel="3" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div><div className="text-gray-500">66.67%</div><div className="text-white">Wins: 2</div></div>
                <div><div className="text-gray-500">33.33%</div><div className="text-white">Losses: 1</div></div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-white mb-6">Long Analysis</h3>
              <div className="flex flex-col items-center justify-center h-40">
                <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-gray-500 text-sm">Profit</div>
                <div className="text-white">Start trading to see analysis</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div><div className="text-gray-500">Wins (0)</div><div className="text-emerald-400 font-semibold">$3,860.92</div></div>
                <div><div className="text-gray-500">Win Rate</div><div className="text-white font-semibold">0%</div></div>
                <div><div className="text-gray-500">Losses (0)</div><div className="text-red-400 font-semibold">$560.00</div></div>
              </div>
            </Card>
          </div>
        </FadeInItem>

        {/* Instrument Analysis */}
        <FadeInItem visible={visible[9]}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-white mb-6">Instrument Profit Analysis</h3>
              <div className="space-y-4">
                {[
                  { name: 'EURUSD', value: 570, color: 'bg-emerald-500' },
                  { name: 'AUDUSD', value: 2730.92, color: 'bg-emerald-500' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 w-16">{item.name}</span>
                    <div className="flex-1 h-10 bg-white/5 rounded relative overflow-hidden flex items-end">
                      <div className={`${item.color} rounded w-12`} style={{ height: `${(item.value / 3000) * 100}%` }} />
                    </div>
                    <span className="text-sm font-mono text-white w-20 text-right">${item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-white mb-6">Instrument Volume Analysis</h3>
              <div className="space-y-4">
                {[
                  { name: 'EURUSD', value: 15, color: 'bg-emerald-500' },
                  { name: 'AUDUSD', value: 6, color: 'bg-emerald-500' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <span className="text-sm text-gray-400 w-16">{item.name}</span>
                    <div className="flex-1 h-10 bg-white/5 rounded relative overflow-hidden flex items-end">
                      <div className={`${item.color} rounded w-12`} style={{ height: `${(item.value / 20) * 100}%` }} />
                    </div>
                    <span className="text-sm font-mono text-white w-20 text-right">{item.value} lots</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </FadeInItem>

        {/* Trading History Table */}
        <FadeInItem visible={visible[10]}>
          <Card className="!p-0 overflow-hidden">
            <div className="flex gap-1 p-4 border-b border-white/10">
              <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'history' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
                Trading History
              </button>
              <button onClick={() => setActiveTab('positions')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'positions' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
                Open Positions
              </button>
            </div>
            <div className="overflow-x-auto">
              {activeTab === 'history' ? (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="p-4 font-medium text-gray-400">Share</th>
                      <th className="p-4 font-medium text-gray-400">Symbol</th>
                      <th className="p-4 font-medium text-gray-400">Type</th>
                      <th className="p-4 font-medium text-gray-400">Open Date</th>
                      <th className="p-4 font-medium text-gray-400">Closed Date</th>
                      <th className="p-4 font-medium text-gray-400">Open</th>
                      <th className="p-4 font-medium text-gray-400">Closed</th>
                      <th className="p-4 font-medium text-gray-400">TP</th>
                      <th className="p-4 font-medium text-gray-400">SL</th>
                      <th className="p-4 font-medium text-gray-400">Lots</th>
                      <th className="p-4 font-medium text-gray-400">Commission</th>
                      <th className="p-4 font-medium text-gray-400 text-right">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TRADING_HISTORY.map((trade) => (
                      <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4"><button className="text-gray-500 hover:text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></button></td>
                        <td className="p-4 font-medium text-white">{trade.symbol}</td>
                        <td className="p-4"><span className={`${trade.type === 'Buy' ? 'text-emerald-400' : 'text-red-400'}`}>{trade.type}</span></td>
                        <td className="p-4 text-gray-400">{trade.openDate}</td>
                        <td className="p-4 text-gray-400">{trade.closedDate}</td>
                        <td className="p-4 font-mono text-gray-400">{trade.open}</td>
                        <td className="p-4 font-mono text-gray-400">{trade.closed}</td>
                        <td className="p-4 font-mono text-gray-400">{trade.tp}</td>
                        <td className="p-4 font-mono text-gray-400">{trade.sl}</td>
                        <td className="p-4 font-mono text-white">{trade.lots}</td>
                        <td className="p-4 font-mono text-gray-400">${trade.commission.toFixed(2)}</td>
                        <td className={`p-4 font-mono font-bold text-right ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {trade.profit >= 0 ? '' : '-'}${Math.abs(trade.profit).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="p-4 font-medium text-gray-400">Symbol</th>
                      <th className="p-4 font-medium text-gray-400">Type</th>
                      <th className="p-4 font-medium text-gray-400">Open Date</th>
                      <th className="p-4 font-medium text-gray-400">Entry</th>
                      <th className="p-4 font-medium text-gray-400">Current</th>
                      <th className="p-4 font-medium text-gray-400">TP</th>
                      <th className="p-4 font-medium text-gray-400">SL</th>
                      <th className="p-4 font-medium text-gray-400">Lots</th>
                      <th className="p-4 font-medium text-gray-400 text-right">Floating P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OPEN_POSITIONS.map((pos) => (
                      <tr key={pos.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 font-medium text-white">{pos.symbol}</td>
                        <td className="p-4"><span className={`${pos.type === 'Buy' ? 'text-emerald-400' : 'text-red-400'}`}>{pos.type}</span></td>
                        <td className="p-4 text-gray-400">{pos.openDate}</td>
                        <td className="p-4 font-mono text-gray-400">{pos.open}</td>
                        <td className="p-4 font-mono text-white">{pos.current}</td>
                        <td className="p-4 font-mono text-gray-400">{pos.tp}</td>
                        <td className="p-4 font-mono text-gray-400">{pos.sl}</td>
                        <td className="p-4 font-mono text-white">{pos.lots}</td>
                        <td className={`p-4 font-mono font-bold text-right ${pos.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {pos.profit >= 0 ? '+' : '-'}${Math.abs(pos.profit).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </FadeInItem>
      </div>

      {/* Day Detail Modal */}
      {selectedDay && TRADING_DAYS[selectedDay] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedDay(null)}>
          <div className="bg-[#1a1d24] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedDay}</h3>
                <p className="text-gray-400 text-sm">Daily Trading Summary</p>
              </div>
              <button onClick={() => setSelectedDay(null)} className="text-gray-400 hover:text-white"><XIcon /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-gray-500 uppercase mb-1">Trades</div>
                <div className="text-xl font-bold text-white">{TRADING_DAYS[selectedDay].trades}</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-gray-500 uppercase mb-1">Profit</div>
                <div className={`text-xl font-bold ${TRADING_DAYS[selectedDay].profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ${TRADING_DAYS[selectedDay].profit.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
