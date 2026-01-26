"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { createChart, ColorType, IChartApi, LineData, Time, LineSeries } from 'lightweight-charts';
import { useSimulation } from '@/app/context/SimulationContext';
import { TradingAccount, Trade } from '@/app/lib/simulation';
import { XIcon, ChevronLeftIcon, ChevronRightIcon, InfoIcon, CalendarIcon, TrendingUpIcon, TrendingDownIcon, TargetIcon, ClockIcon, PlusIcon } from '@/components/dashboard/icons';

// --- Stagger Animation Hook ---
function useStaggerMount(itemCount: number, baseDelay = 60) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false));
  
  useEffect(() => {
    setVisibleItems(new Array(itemCount).fill(false));
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

// --- Card Components ---
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 ${className}`}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />
    <div className="relative z-10 h-full">{children}</div>
  </div>
);

const GlassCard = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 transition-all hover:bg-white/5 ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </div>
);

const ProgressBar = ({ value, max, color = "bg-blue-500", showDanger = false }: { value: number; max: number; color?: string; showDanger?: boolean }) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const barColor = showDanger && percent > 80 ? 'bg-red-500' : showDanger && percent > 50 ? 'bg-amber-500' : color;
  return (
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
    </div>
  );
};

// --- Donut Chart Component ---
const DonutChart = ({ 
  value, 
  max, 
  size = 140, 
  strokeWidth = 12,
  primaryColor = "#10b981",
  secondaryColor = "#ef4444",
  centerValue,
  centerLabel 
}: { 
  value: number; 
  max: number; 
  size?: number; 
  strokeWidth?: number;
  primaryColor?: string;
  secondaryColor?: string;
  centerValue: string;
  centerLabel?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const primaryDash = (percentage / 100) * circumference;
  const secondaryDash = circumference - primaryDash;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={secondaryColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${secondaryDash} ${circumference}`}
            strokeDashoffset={-primaryDash}
            strokeLinecap="round"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={primaryColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${primaryDash} ${circumference}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerLabel && <span className="text-[10px] text-gray-500 uppercase tracking-wider">{centerLabel}</span>}
          <span className="text-2xl font-bold text-white">{centerValue}</span>
        </div>
      </div>
    </div>
  );
};

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

// --- TradingView Chart Component with Balance & Equity ---
const BalanceEquityChart = ({ account }: { account: TradingAccount }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipData, setTooltipData] = useState<{ balance: number; equity: number; pnl: number; time: string; x: number; y: number } | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#6b7280' },
      grid: { vertLines: { color: 'rgba(255,255,255,0.03)' }, horzLines: { color: 'rgba(255,255,255,0.03)' } },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.1)' },
      timeScale: { borderColor: 'rgba(255,255,255,0.1)', timeVisible: true, secondsVisible: false },
      crosshair: { 
        horzLine: { color: 'rgba(59,130,246,0.3)', labelVisible: false }, 
        vertLine: { color: 'rgba(59,130,246,0.3)', labelVisible: true } 
      },
    });

    chartRef.current = chart;
    
    // Build balance history directly from trades
    const balancePoints: { time: number; value: number }[] = [];
    const equityPoints: { time: number; value: number }[] = [];
    
    // Start with initial account size
    const startTime = new Date(account.startDate).getTime();
    balancePoints.push({ time: startTime, value: account.accountSize });
    equityPoints.push({ time: startTime, value: account.accountSize });
    
    // Build running balance from each trade
    let runningBalance = account.accountSize;
    const sortedTrades = [...account.trades].sort((a, b) => 
      new Date(a.closeTime || a.openTime).getTime() - new Date(b.closeTime || b.openTime).getTime()
    );
    
    for (const trade of sortedTrades) {
      runningBalance += trade.pnl;
      const tradeTime = new Date(trade.closeTime || trade.openTime).getTime();
      balancePoints.push({ time: tradeTime, value: runningBalance });
      equityPoints.push({ time: tradeTime, value: runningBalance });
    }
    
    // Add current point if different from last
    const now = Date.now();
    if (balancePoints.length === 1 || balancePoints[balancePoints.length - 1].time < now - 60000) {
      balancePoints.push({ time: now, value: account.balance });
      equityPoints.push({ time: now, value: account.equity });
    }
    
    // Convert to LineData format with unique timestamps (use seconds)
    const seenTimes = new Set<number>();
    const balanceData: LineData[] = balancePoints
      .map(p => ({ time: Math.floor(p.time / 1000) as Time, value: p.value }))
      .filter(p => {
        const t = p.time as number;
        if (seenTimes.has(t)) return false;
        seenTimes.add(t);
        return true;
      });
    
    seenTimes.clear();
    const equityData: LineData[] = equityPoints
      .map(p => ({ time: Math.floor(p.time / 1000) as Time, value: p.value }))
      .filter(p => {
        const t = p.time as number;
        if (seenTimes.has(t)) return false;
        seenTimes.add(t);
        return true;
      });
    
    // Balance line (blue)
    const balanceSeries = chart.addSeries(LineSeries, { 
      color: '#3b82f6', 
      lineWidth: 2,
      lastValueVisible: true,
      priceLineVisible: false,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 5,
    });
    balanceSeries.setData(balanceData);
    
    // Equity line (cyan)
    const equitySeries = chart.addSeries(LineSeries, { 
      color: '#06b6d4', 
      lineWidth: 2,
      lineStyle: 0,
      lastValueVisible: true,
      priceLineVisible: false,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 5,
    });
    equitySeries.setData(equityData);
    
    // Subscribe to crosshair move for tooltip
    chart.subscribeCrosshairMove((param) => {
      if (!param.point || !param.time || !chartContainerRef.current) {
        setTooltipData(null);
        return;
      }
      
      const balanceValue = param.seriesData.get(balanceSeries) as LineData | undefined;
      const equityValue = param.seriesData.get(equitySeries) as LineData | undefined;
      
      if (balanceValue && equityValue) {
        const balance = balanceValue.value;
        const equity = equityValue.value;
        const pnl = balance - account.accountSize;
        const time = new Date((param.time as number) * 1000).toLocaleString();
        
        setTooltipData({
          balance,
          equity,
          pnl,
          time,
          x: param.point.x,
          y: param.point.y,
        });
      }
    });
    
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); chart.remove(); };
  }, [account]);

  const formatCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Account Balance</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-500" />
            <span className="text-xs text-gray-400">Balance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-cyan-500" />
            <span className="text-xs text-gray-400">Equity</span>
          </div>
        </div>
      </div>
      <div className="relative">
        <div ref={chartContainerRef} className="w-full" />
        
        {/* Custom Tooltip */}
        {tooltipData && (
          <div 
            ref={tooltipRef}
            className="absolute z-20 pointer-events-none bg-[#1a1c22] border border-white/10 rounded-lg p-3 shadow-xl"
            style={{
              left: Math.min(tooltipData.x, (chartContainerRef.current?.clientWidth || 300) - 160),
              top: Math.max(10, tooltipData.y - 80),
            }}
          >
            <div className="text-xs text-gray-400 mb-2">{tooltipData.time}</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-blue-400">Balance:</span>
                <span className="text-xs font-bold text-white">{formatCurrency(tooltipData.balance)}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-cyan-400">Equity:</span>
                <span className="text-xs font-bold text-white">{formatCurrency(tooltipData.equity)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/10">
                <span className="text-xs text-gray-400">P&L:</span>
                <span className={`text-xs font-bold ${tooltipData.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tooltipData.pnl >= 0 ? '+' : ''}{formatCurrency(tooltipData.pnl)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// --- Daily Summary Calendar Component ---
const DailySummaryCalendar = ({ account, formatCurrency }: { account: TradingAccount; formatCurrency: (n: number) => string }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  
  // Initialize selectedDay to today's date
  const [selectedDay, setSelectedDay] = useState<{ date: number; dateStr: string; pnl: number; trades: number } | null>(() => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const dayData = account.tradingDays[dateStr];
    return {
      date: today.getDate(),
      dateStr,
      pnl: dayData?.pnl || 0,
      trades: dayData?.trades || 0,
    };
  });

  const { weeklyData, monthDays, totalPnL, totalDays } = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    // Generate calendar days array
    const days: Array<{ date: number | null; pnl: number; trades: number; dateStr: string }> = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ date: null, pnl: 0, trades: 0, dateStr: '' });
    }
    
    // Add days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayData = account.tradingDays[dateStr];
      days.push({
        date: d,
        pnl: dayData?.pnl || 0,
        trades: dayData?.trades || 0,
        dateStr,
      });
    }

    // Calculate 4 weeks (Week 1-4)
    const weeks: Array<{ name: string; dateRange: string; pnl: number; trades: number; days: number }> = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const weekRanges = [
      { start: 1, end: 7 },
      { start: 8, end: 14 },
      { start: 15, end: 21 },
      { start: 22, end: daysInMonth },
    ];
    
    weekRanges.forEach((range, i) => {
      let weekPnL = 0;
      let weekTrades = 0;
      let tradingDays = 0;
      
      for (let d = range.start; d <= range.end; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        if (account.tradingDays[dateStr]) {
          weekPnL += account.tradingDays[dateStr].pnl;
          weekTrades += account.tradingDays[dateStr].trades;
          tradingDays++;
        }
      }
      
      weeks.push({
        name: `Week ${['One', 'Two', 'Three', 'Four'][i]}`,
        dateRange: `${monthNames[month]} ${range.start} - ${monthNames[month]} ${range.end}`,
        pnl: weekPnL,
        trades: weekTrades,
        days: tradingDays,
      });
    });

    let totalPnL = 0;
    let totalDays = 0;
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      if (account.tradingDays[dateStr]) {
        totalPnL += account.tradingDays[dateStr].pnl;
        totalDays++;
      }
    }

    return { weeklyData: weeks, monthDays: days, totalPnL, totalDays };
  }, [currentMonth, account.tradingDays]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const goToToday = () => setCurrentMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  const handleDayClick = (day: { date: number | null; pnl: number; trades: number; dateStr: string }) => {
    if (day.date !== null) {
      setSelectedDay({ date: day.date, dateStr: day.dateStr, pnl: day.pnl, trades: day.trades });
    }
  };

  // Get trades for selected day
  const selectedDayTrades = selectedDay 
    ? account.trades.filter(t => {
        const tradeDate = new Date(t.closeTime || t.openTime).toISOString().split('T')[0];
        return tradeDate === selectedDay.dateStr;
      })
    : [];

  return (
    <Card className="!p-0 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Daily Summary</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2 p-4 md:p-6 lg:border-r border-white/10">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-1 md:gap-2">
              <button onClick={prevMonth} className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              </button>
              <button onClick={nextMonth} className="p-1.5 md:p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              </button>
            </div>
            <h4 className="text-sm md:text-lg font-semibold text-white">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>
            <button onClick={goToToday} className="px-2 py-1 md:px-3 md:py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs md:text-sm text-gray-400 transition-colors">
              Today
            </button>
          </div>

          {/* Summary Header */}
          <div className="flex items-center gap-2 md:gap-4 mb-4 text-xs md:text-sm">
            <span className="text-gray-400">PnL:</span>
            <span className={`font-bold ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatCurrency(totalPnL)}
            </span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">Days:</span>
            <span className="text-white font-bold">{totalDays}</span>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day, i) => (
              <div key={day} className="text-center text-[10px] md:text-xs text-gray-500 py-1 md:py-2">
                <span className="hidden md:inline">{day}</span>
                <span className="md:hidden">{dayNamesShort[i]}</span>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((day, i) => (
              <button
                key={i}
                onClick={() => handleDayClick(day)}
                disabled={day.date === null}
                className={`
                  calendar-day aspect-square p-1 md:p-2 rounded-lg text-center flex flex-col justify-between min-h-[48px] md:min-h-[70px]
                  ${day.date === null ? 'bg-transparent cursor-default' : 'bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors'}
                  ${day.trades > 0 ? 'border-emerald-500/30' : ''}
                  ${selectedDay?.date === day.date ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                {day.date !== null && (
                  <>
                    <span className={`text-xs md:text-sm font-medium ${day.pnl > 0 ? 'text-emerald-400' : day.pnl < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                      {day.date}
                    </span>
                    {day.trades > 0 && (
                      <div className="text-[8px] md:text-[10px] space-y-0.5">
                        <div className="text-gray-500 hidden md:block">{day.trades} ↕</div>
                        <div className={`${day.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'} truncate`}>
                          <span className="hidden md:inline">{formatCurrency(day.pnl)}</span>
                          <span className="md:hidden">{day.pnl >= 0 ? '+' : '-'}</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Summary - Right side on desktop */}
        <div className="p-4 md:p-6 weekly-summary">
          <h4 className="text-sm text-gray-400 font-medium mb-4">Weekly Summary</h4>
          <div className="space-y-4">
            {weeklyData.map((week, i) => (
              <div key={i} className="pb-4 border-b border-white/5 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-white text-sm">{week.name}</span>
                  <span className="text-[10px] md:text-xs text-gray-500">{week.dateRange}</span>
                </div>
                {week.trades > 0 ? (
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className={`font-bold ${week.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      PnL: {formatCurrency(week.pnl)}
                    </span>
                    <span className="text-gray-400">Days: {week.days}</span>
                  </div>
                ) : (
                  <span className="text-gray-500 text-xs md:text-sm">No trades</span>
                )}
              </div>
            ))}
          </div>

          {/* Day Details - Inline below weekly summary */}
          {selectedDay && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm text-gray-400 font-medium mb-3">
                {new Date(selectedDay.dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </h4>
              
              {/* Day Summary */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Day P&L</div>
                  <div className={`text-lg font-bold ${selectedDay.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedDay.pnl >= 0 ? '+' : ''}{formatCurrency(selectedDay.pnl)}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Trades</div>
                  <div className="text-lg font-bold text-white">{selectedDay.trades}</div>
                </div>
              </div>

              {/* Trades List */}
              {selectedDayTrades.length > 0 ? (
                <div>
                  <h5 className="text-xs font-medium text-gray-500 mb-2">Trade History</h5>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {selectedDayTrades.map(trade => (
                      <div key={trade.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded flex items-center justify-center ${
                            trade.pnl >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
                          }`}>
                            {trade.pnl >= 0 ? (
                              <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                            ) : (
                              <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-white text-xs">{trade.symbol}</div>
                            <div className="text-[10px] text-gray-500">{trade.type.toUpperCase()} • {trade.lots}L</div>
                          </div>
                        </div>
                        <div className={`font-bold text-xs ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No trades on this day
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// --- Analysis Card Component (Short/Long Analysis) ---
const AnalysisCard = ({ 
  title, 
  trades, 
  formatCurrency 
}: { 
  title: string; 
  trades: Trade[]; 
  formatCurrency: (n: number) => string;
}) => {
  const wins = trades.filter(t => t.pnl > 0);
  const losses = trades.filter(t => t.pnl < 0);
  const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
  const totalWins = wins.reduce((sum, t) => sum + t.pnl, 0);
  const totalLosses = Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0));
  const winRate = trades.length > 0 ? (wins.length / trades.length) * 100 : 0;

  if (trades.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
            <span className="text-gray-500 text-xl">📊</span>
          </div>
          <span className="text-gray-500 text-sm">Profit</span>
          <span className="text-gray-400 text-sm mt-2">Start trading to see analysis</span>
        </div>
        <div className="flex justify-between text-sm mt-4 pt-4 border-t border-white/5">
          <div className="text-center">
            <div className="text-gray-500">Wins (0)</div>
            <div className="text-emerald-400 font-semibold">{formatCurrency(0)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">Win Rate</div>
            <div className="text-white font-semibold">0%</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500">Losses (0)</div>
            <div className="text-red-400 font-semibold">{formatCurrency(0)}</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="flex items-center justify-center py-4">
        <DonutChart
          value={totalWins}
          max={totalWins + totalLosses}
          centerValue={formatCurrency(totalPnL)}
          centerLabel="PROFIT"
          primaryColor="#10b981"
          secondaryColor="#ef4444"
        />
      </div>
      <div className="flex justify-between text-sm mt-4 pt-4 border-t border-white/5">
        <div className="text-center">
          <div className="text-gray-500">Wins ({wins.length})</div>
          <div className="text-emerald-400 font-semibold">{formatCurrency(totalWins)}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">Win Rate</div>
          <div className="text-white font-semibold">{winRate.toFixed(2)}%</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">Losses ({losses.length})</div>
          <div className="text-red-400 font-semibold">{formatCurrency(totalLosses)}</div>
        </div>
      </div>
    </Card>
  );
};

// --- Profitability Card ---
const ProfitabilityCard = ({ trades }: { trades: Trade[] }) => {
  const wins = trades.filter(t => t.pnl > 0).length;
  const losses = trades.filter(t => t.pnl < 0).length;
  const total = trades.length;
  const winRate = total > 0 ? (wins / total) * 100 : 0;
  const lossRate = total > 0 ? (losses / total) * 100 : 0;

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Profitability</h3>
      <div className="flex items-center justify-center py-4">
        <DonutChart
          value={wins}
          max={total || 1}
          centerValue={total.toString()}
          centerLabel="TOTAL TRADES"
          primaryColor="#10b981"
          secondaryColor="#ef4444"
        />
      </div>
      <div className="flex justify-between text-sm mt-4 pt-4 border-t border-white/5">
        <div className="text-center">
          <div className="text-gray-500">{winRate.toFixed(2)}%</div>
          <div className="text-white font-medium">Wins: {wins}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">{lossRate.toFixed(2)}%</div>
          <div className="text-white font-medium">Losses: {losses}</div>
        </div>
      </div>
    </Card>
  );
};

// --- Instrument Analysis Card ---
const InstrumentAnalysisCard = ({ 
  title, 
  trades, 
  mode,
  formatCurrency 
}: { 
  title: string; 
  trades: Trade[];
  mode: 'profit' | 'volume';
  formatCurrency: (n: number) => string;
}) => {
  const instrumentData = useMemo(() => {
    const grouped: Record<string, { pnl: number; lots: number }> = {};
    trades.forEach(t => {
      if (!grouped[t.symbol]) grouped[t.symbol] = { pnl: 0, lots: 0 };
      grouped[t.symbol].pnl += t.pnl;
      grouped[t.symbol].lots += t.lots;
    });
    return Object.entries(grouped)
      .map(([symbol, data]) => ({ symbol, ...data }))
      .sort((a, b) => mode === 'profit' ? b.pnl - a.pnl : b.lots - a.lots)
      .slice(0, 5);
  }, [trades, mode]);

  const maxValue = mode === 'profit' 
    ? Math.max(...instrumentData.map(d => Math.abs(d.pnl)), 1)
    : Math.max(...instrumentData.map(d => d.lots), 1);

  if (instrumentData.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">No trading data available</div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-4">
        {instrumentData.map(item => {
          const value = mode === 'profit' ? item.pnl : item.lots;
          const displayValue = mode === 'profit' ? formatCurrency(item.pnl) : `${item.lots.toFixed(0)} lots`;
          const barWidth = (Math.abs(value) / maxValue) * 100;
          const isNegative = mode === 'profit' && item.pnl < 0;
          
          return (
            <div key={item.symbol} className="flex items-center gap-4">
              <div className="w-16 text-sm text-gray-400">{item.symbol}</div>
              <div className="flex-1 h-6 bg-white/5 rounded overflow-hidden relative">
                <div 
                  className={`h-full ${isNegative ? 'bg-red-500' : 'bg-emerald-500'} rounded transition-all duration-500`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className={`w-24 text-right text-sm font-medium ${isNegative ? 'text-red-400' : 'text-white'}`}>
                {displayValue}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// --- Stats Row Component ---
const StatsRow = ({ account, formatCurrency }: { account: TradingAccount; formatCurrency: (n: number) => string }) => {
  const stats = [
    { icon: CalendarIcon, label: 'Number of days', value: account.tradingDaysCompleted.toString() },
    { label: '# Total Trades Taken', value: account.totalTrades.toString() },
    { label: 'Total Lots Used', value: account.totalLots.toFixed(2) },
    { icon: TrendingUpIcon, label: 'Biggest Win', value: formatCurrency(account.biggestWin), color: 'text-emerald-400' },
    { icon: TrendingDownIcon, label: 'Biggest Loss', value: formatCurrency(account.biggestLoss), color: 'text-red-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, i) => (
        <GlassCard key={i} className="!p-4">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            {stat.icon && <stat.icon className="w-4 h-4" />}
            <span>{stat.label}</span>
          </div>
          <div className={`text-xl font-bold ${stat.color || 'text-white'}`}>{stat.value}</div>
        </GlassCard>
      ))}
    </div>
  );
};

// --- Account Selection View ---
const AccountSelector = ({ accounts, onSelect, onCreateNew }: { 
  accounts: TradingAccount[]; 
  onSelect: (id: string) => void;
  onCreateNew: () => void;
}) => {
  const visible = useStaggerMount(accounts.length + 2, 60);
  const { formatCurrency, getProgress } = useSimulation();

  const getStatusColor = (status: TradingAccount['status']) => {
    switch (status) {
      case 'evaluation': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'funded': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'passed': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'breached': return 'text-red-400 bg-red-500/20 border-red-500/30';
    }
  };

  const getStatusLabel = (status: TradingAccount['status']) => {
    switch (status) {
      case 'evaluation': return 'In Evaluation';
      case 'funded': return 'Funded';
      case 'passed': return 'Challenge Passed';
      case 'breached': return 'Breached';
    }
  };

  return (
    <div className="space-y-8">
      <FadeInItem visible={visible[0]}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">My Accounts</h1>
            <p className="text-gray-400 mt-1">Select an account to view details and trade</p>
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            New Challenge
          </button>
        </div>
      </FadeInItem>

      {accounts.length === 0 ? (
        <FadeInItem visible={visible[1]}>
          <Card className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <TargetIcon className="w-10 h-10 text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Accounts Yet</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Start your trading journey by creating your first evaluation account. 
              Choose from various account sizes and challenge types.
            </p>
            <button
              onClick={onCreateNew}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Start New Challenge
            </button>
          </Card>
        </FadeInItem>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account, i) => {
            const progress = getProgress(account);
            return (
              <FadeInItem key={account.id} visible={visible[i + 1]}>
                <GlassCard 
                  onClick={() => onSelect(account.id)}
                  className="hover:border-blue-500/30 hover:scale-[1.02] transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white">{account.name}</h3>
                      <p className="text-sm text-gray-500">ID: #{account.id.slice(0, 8)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(account.status)}`}>
                      {getStatusLabel(account.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Balance</span>
                      <span className="font-bold text-white">{formatCurrency(account.balance)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
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
                      <ProgressBar value={progress.profitProgress} max={100} color="bg-emerald-500" />
                    </div>

                    <div className="pt-3 border-t border-white/5 flex justify-between text-xs text-gray-500">
                      <span>{account.totalTrades} trades</span>
                      <span>{account.tradingDaysCompleted}/{account.minTradingDays} days</span>
                      <span>{account.type === 'one-step' ? 'One Step' : 'Two Step'}</span>
                    </div>
                  </div>
                </GlassCard>
              </FadeInItem>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- Trading Panel ---
const TradingPanel = ({ account, onTrade }: { 
  account: TradingAccount; 
  onTrade: (symbol: string, type: 'buy' | 'sell', lots: number, outcome: 'win' | 'loss' | 'random') => void;
}) => {
  const { symbols } = useSimulation();
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0].symbol);
  const [lots, setLots] = useState(1);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  if (account.status === 'breached' || account.status === 'passed') {
    return (
      <Card>
        <h3 className="font-semibold text-white mb-4">Trading Panel</h3>
        <div className="text-center py-8">
          <div className={`text-lg font-semibold mb-2 ${account.status === 'passed' ? 'text-emerald-400' : 'text-red-400'}`}>
            {account.status === 'passed' ? '🎉 Challenge Completed!' : '⚠️ Account Breached'}
          </div>
          <p className="text-gray-400 text-sm">
            {account.status === 'passed' 
              ? 'Congratulations! You have successfully completed this challenge.' 
              : 'This account has been breached due to violating trading rules.'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUpIcon className="w-5 h-5 text-blue-400" />
        Quick Trade Simulator
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Symbol</label>
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-blue-500/50"
          >
            {symbols.map(s => (
              <option key={s.symbol} value={s.symbol} className="bg-gray-900">{s.symbol}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Position Size (Lots)</label>
          <input
            type="number"
            min={0.1}
            max={10}
            step={0.1}
            value={lots}
            onChange={(e) => setLots(parseFloat(e.target.value) || 0.1)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-blue-500/50"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Direction</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTradeType('buy')}
              className={`py-2.5 rounded-lg font-medium transition-colors ${
                tradeType === 'buy' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Buy / Long
            </button>
            <button
              onClick={() => setTradeType('sell')}
              className={`py-2.5 rounded-lg font-medium transition-colors ${
                tradeType === 'sell' ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              Sell / Short
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <label className="block text-sm text-gray-400 mb-2">Simulate Outcome</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onTrade(selectedSymbol, tradeType, lots, 'win')}
              className="py-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-medium hover:bg-emerald-500/30 transition-colors"
            >
              Win Trade
            </button>
            <button
              onClick={() => onTrade(selectedSymbol, tradeType, lots, 'random')}
              className="py-2.5 rounded-lg bg-blue-500/20 text-blue-400 font-medium hover:bg-blue-500/30 transition-colors"
            >
              Random
            </button>
            <button
              onClick={() => onTrade(selectedSymbol, tradeType, lots, 'loss')}
              className="py-2.5 rounded-lg bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-colors"
            >
              Loss Trade
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

// --- Account Details View ---
const AccountDetails = ({ account, onBack }: { account: TradingAccount; onBack: () => void }) => {
  const { formatCurrency, getProgress, executeTrade, deleteAccount } = useSimulation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const visible = useStaggerMount(15, 50);
  const progress = getProgress(account);

  // Generate balance and equity history with unique, sorted timestamps
  const { balanceHistory, equityHistory } = useMemo(() => {
    const startDateStr = account.startDate.split('T')[0];
    const balanceMap = new Map<string, number>();
    const equityMap = new Map<string, number>();
    
    balanceMap.set(startDateStr, account.accountSize);
    equityMap.set(startDateStr, account.accountSize);
    
    let runningPnL = 0;
    const sortedDates = Object.keys(account.tradingDays).sort();
    for (const date of sortedDates) {
      const dayData = account.tradingDays[date];
      runningPnL += dayData.pnl;
      const balance = account.accountSize + runningPnL;
      balanceMap.set(date, balance);
      // Equity varies slightly from balance (simulating open position fluctuation)
      equityMap.set(date, balance + (Math.random() - 0.5) * balance * 0.002);
    }
    
    const sortedEntries = Array.from(balanceMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    
    return {
      balanceHistory: sortedEntries.map(([date, value]) => ({ time: date as Time, value })),
      equityHistory: Array.from(equityMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, value]) => ({ time: date as Time, value })),
    };
  }, [account.startDate, account.accountSize, account.tradingDays]);

  // Open positions (simulated - in real app these would be actual open trades)
  const openPositions = useMemo(() => {
    // For demo purposes, show some "open" positions if there are recent trades
    if (account.status === 'breached' || account.status === 'passed') return [];
    // Simulate 0-2 open positions based on account activity
    return [];
  }, [account.status]);

  // Split trades by type
  const shortTrades = useMemo(() => account.trades.filter(t => t.type === 'sell'), [account.trades]);
  const longTrades = useMemo(() => account.trades.filter(t => t.type === 'buy'), [account.trades]);

  // Calculate radar data
  const winRate = account.totalTrades > 0 ? (account.winningTrades / account.totalTrades) * 100 : 0;
  const avgWin = account.winningTrades > 0 ? account.biggestWin / account.winningTrades : 0;
  const avgLoss = account.losingTrades > 0 ? Math.abs(account.biggestLoss) / account.losingTrades : 0;
  const riskReward = avgLoss > 0 ? (avgWin / avgLoss) * 50 : 50;
  const radarData = useMemo(() => ({
    consistency: Math.min(100, progress.profitProgress),
    slUsage: 70 + Math.random() * 20,
    wr: winRate,
    rr: Math.min(100, riskReward),
  }), [progress.profitProgress, winRate, riskReward]);
  const fpScore = Math.round((radarData.consistency + radarData.slUsage + radarData.wr + radarData.rr) / 4);

  const handleTrade = (symbol: string, type: 'buy' | 'sell', lots: number, outcome: 'win' | 'loss' | 'random') => {
    executeTrade(symbol, type, lots, outcome);
  };

  const handleDelete = () => {
    deleteAccount(account.id);
    onBack();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeInItem visible={visible[0]}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{account.name}</h1>
              <p className="text-gray-400 text-sm">Account #{account.id.slice(0, 8)} • {account.type === 'one-step' ? 'One Step' : 'Two Step'} Challenge</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
              account.status === 'evaluation' ? 'text-blue-400 bg-blue-500/20 border-blue-500/30' :
              account.status === 'passed' ? 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' :
              account.status === 'funded' ? 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' :
              'text-red-400 bg-red-500/20 border-red-500/30'
            }`}>
              {account.status === 'evaluation' ? 'In Evaluation' : 
               account.status === 'passed' ? 'Passed' :
               account.status === 'funded' ? 'Funded' : 'Breached'}
            </span>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </FadeInItem>

      {/* Top Stats Row */}
      <FadeInItem visible={visible[1]}>
        <StatsRow account={account} formatCurrency={formatCurrency} />
      </FadeInItem>

      {/* Analysis Cards Row */}
      <FadeInItem visible={visible[2]}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnalysisCard title="Short Analysis" trades={shortTrades} formatCurrency={formatCurrency} />
          <ProfitabilityCard trades={account.trades} />
          <AnalysisCard title="Long Analysis" trades={longTrades} formatCurrency={formatCurrency} />
        </div>
      </FadeInItem>

      {/* Instrument Analysis Row */}
      <FadeInItem visible={visible[3]}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InstrumentAnalysisCard title="Instrument Profit Analysis" trades={account.trades} mode="profit" formatCurrency={formatCurrency} />
          <InstrumentAnalysisCard title="Instrument Volume Analysis" trades={account.trades} mode="volume" formatCurrency={formatCurrency} />
        </div>
      </FadeInItem>

      {/* Balance Stats Row */}
      <FadeInItem visible={visible[4]}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Account Size", value: formatCurrency(account.accountSize), color: "text-blue-400" },
            { label: "Balance", value: formatCurrency(account.balance), color: "text-white" },
            { label: "P&L", value: `${account.pnl >= 0 ? '+' : ''}${formatCurrency(account.pnl)}`, color: account.pnl >= 0 ? "text-emerald-400" : "text-red-400" },
            { label: "Equity", value: formatCurrency(account.equity), color: "text-white" },
          ].map((item, i) => (
            <GlassCard key={i}>
              <div className="text-sm text-gray-400 mb-1">{item.label}</div>
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
            </GlassCard>
          ))}
        </div>
      </FadeInItem>

      {/* FP Score + Trading Objectives + Trading Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* FP Score and Trading Objectives side by side */}
          <FadeInItem visible={visible[5]}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-900/30 to-transparent !border-blue-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <TargetIcon className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold text-white">FP Score</span>
                </div>
                <div className="flex items-center justify-center py-2">
                  <RadarChart data={radarData} score={fpScore} />
                </div>
              </Card>

              <Card className="md:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-6">Trading Objectives</h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">Profit Target</span>
                        <span className="text-xs text-gray-500">({account.profitTargetPercent}%)</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{progress.profitProgress.toFixed(1)}%</span>
                    </div>
                    <ProgressBar value={Math.max(0, account.pnl)} max={account.profitTarget} color="bg-emerald-500" />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>{formatCurrency(Math.max(0, account.pnl))}</span>
                      <span>{formatCurrency(account.profitTarget)}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">Daily Loss</span>
                        <span className="text-xs text-gray-500">({account.maxDailyLossPercent}% max)</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{progress.dailyLossUsed.toFixed(1)}%</span>
                    </div>
                    <ProgressBar value={progress.dailyLossUsed} max={100} color="bg-blue-500" showDanger />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">Total Loss</span>
                        <span className="text-xs text-gray-500">({account.maxTotalLossPercent}% max)</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{progress.totalLossUsed.toFixed(1)}%</span>
                    </div>
                    <ProgressBar value={progress.totalLossUsed} max={100} color="bg-blue-500" showDanger />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">Trading Days</span>
                      <span className="text-sm font-semibold text-white">{account.tradingDaysCompleted}/{account.minTradingDays}</span>
                    </div>
                    <ProgressBar value={account.tradingDaysCompleted} max={account.minTradingDays} color="bg-blue-500" />
                  </div>
                </div>
              </Card>
            </div>
          </FadeInItem>
        </div>

        {/* Right Column - Trading Panel */}
        <FadeInItem visible={visible[5]}>
          <TradingPanel account={account} onTrade={handleTrade} />
        </FadeInItem>
      </div>

      {/* Full Width Balance/Equity Chart */}
      <FadeInItem visible={visible[6]}>
        <BalanceEquityChart account={account} />
      </FadeInItem>

      {/* Daily Summary Calendar */}
      <FadeInItem visible={visible[7]}>
        <DailySummaryCalendar account={account} formatCurrency={formatCurrency} />
      </FadeInItem>

      {/* Trade History with Open Positions - LAST */}
      <FadeInItem visible={visible[8]}>
        <Card className="!p-0 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="font-semibold text-white">Trade History & Open Positions</h3>
          </div>
          
          {/* Open Positions Section */}
          {openPositions.length > 0 && (
            <div className="border-b border-white/10">
              <div className="p-4 bg-blue-500/10">
                <h4 className="text-sm font-medium text-blue-400 mb-3">Open Positions ({openPositions.length})</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="pb-2 font-medium">Symbol</th>
                        <th className="pb-2 font-medium">Type</th>
                        <th className="pb-2 font-medium">Lots</th>
                        <th className="pb-2 font-medium">Entry</th>
                        <th className="pb-2 font-medium text-right">Floating P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {openPositions.map((pos: any) => (
                        <tr key={pos.id} className="border-t border-white/5">
                          <td className="py-2 font-medium text-white">{pos.symbol}</td>
                          <td className="py-2">
                            <span className={pos.type === 'buy' ? 'text-emerald-400' : 'text-red-400'}>
                              {pos.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2 text-gray-400">{pos.lots}</td>
                          <td className="py-2 font-mono text-gray-400">{pos.entryPrice.toFixed(5)}</td>
                          <td className={`py-2 font-mono font-bold text-right ${pos.floatingPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {pos.floatingPnL >= 0 ? '+' : ''}{formatCurrency(pos.floatingPnL)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Closed Trades */}
          {account.trades.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No trades yet. Use the trading panel to simulate trades.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="p-4 font-medium text-gray-400">Symbol</th>
                    <th className="p-4 font-medium text-gray-400">Type</th>
                    <th className="p-4 font-medium text-gray-400">Lots</th>
                    <th className="p-4 font-medium text-gray-400">Entry</th>
                    <th className="p-4 font-medium text-gray-400">Exit</th>
                    <th className="p-4 font-medium text-gray-400">Status</th>
                    <th className="p-4 font-medium text-gray-400 text-right">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {account.trades.slice().reverse().slice(0, 15).map(trade => (
                    <tr key={trade.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 font-medium text-white">{trade.symbol}</td>
                      <td className="p-4">
                        <span className={trade.type === 'buy' ? 'text-emerald-400' : 'text-red-400'}>
                          {trade.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">{trade.lots}</td>
                      <td className="p-4 font-mono text-gray-400">{trade.entryPrice.toFixed(5)}</td>
                      <td className="p-4 font-mono text-gray-400">{trade.exitPrice?.toFixed(5) || '-'}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400">Closed</span>
                      </td>
                      <td className={`p-4 font-mono font-bold text-right ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </FadeInItem>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Delete Account?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this account? This action cannot be undone and all trading history will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// --- Main Page ---
export default function AccountsPage() {
  const { accounts, selectedAccount, selectAccount, isLoading } = useSimulation();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (selectedAccount) {
    return <AccountDetails account={selectedAccount} onBack={() => selectAccount(null)} />;
  }

  return (
    <>
      <AccountSelector 
        accounts={accounts} 
        onSelect={selectAccount}
        onCreateNew={() => setShowCreateModal(true)}
      />
      
      {showCreateModal && (
        <CreateAccountModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  );
}

// --- Create Account Modal ---
const CreateAccountModal = ({ onClose }: { onClose: () => void }) => {
  const { createNewAccount } = useSimulation();
  const [type, setType] = useState<'one-step' | 'two-step'>('two-step');
  const [size, setSize] = useState(500000);
  const [name, setName] = useState('');

  const sizes = [
    { value: 50000, label: '₹50,000', fee: '₹1,000' },
    { value: 100000, label: '₹1,00,000', fee: '₹2,000' },
    { value: 250000, label: '₹2,50,000', fee: '₹4,000' },
    { value: 500000, label: '₹5,00,000', fee: '₹8,000' },
    { value: 1000000, label: '₹10,00,000', fee: '₹15,000' },
    { value: 2500000, label: '₹25,00,000', fee: '₹35,000' },
  ];

  const handleCreate = () => {
    createNewAccount(size, type, name || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Create New Account</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Account Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Account Name (Optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Trading Account"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Challenge Type */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Challenge Type</label>
            <div className="grid grid-cols-2 gap-3">
              {(['one-step', 'two-step'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`p-4 rounded-xl border transition-all ${
                    type === t 
                      ? 'border-blue-500/50 bg-blue-500/10' 
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="font-medium text-white">{t === 'one-step' ? 'One Step' : 'Two Step'}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {t === 'one-step' ? '8% target, 6% max DD' : '8%/5% targets, 8% max DD'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Account Size */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Account Size</label>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map(s => (
                <button
                  key={s.value}
                  onClick={() => setSize(s.value)}
                  className={`p-3 rounded-xl border transition-all text-center ${
                    size === s.value 
                      ? 'border-blue-500/50 bg-blue-500/10' 
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="font-medium text-white text-sm">{s.label}</div>
                  <div className="text-xs text-gray-500">{s.fee}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
