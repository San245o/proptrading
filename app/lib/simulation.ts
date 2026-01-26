// Trading Simulation Engine - Session Storage Based

export interface TradingAccount {
  id: string;
  name: string;
  type: 'one-step' | 'two-step';
  accountSize: number;
  balance: number;
  equity: number;
  pnl: number;
  status: 'evaluation' | 'funded' | 'breached' | 'passed';
  phase: number; // 1 or 2 for two-step
  createdAt: string;
  startDate: string;
  
  // Objectives
  profitTarget: number;
  profitTargetPercent: number;
  maxDailyLoss: number;
  maxDailyLossPercent: number;
  maxTotalLoss: number;
  maxTotalLossPercent: number;
  minTradingDays: number;
  tradingDaysCompleted: number;
  
  // Stats
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalLots: number;
  biggestWin: number;
  biggestLoss: number;
  
  // Daily tracking
  dailyPnL: number;
  dailyStartEquity: number;
  lastTradeDate: string | null;
  tradingDays: Record<string, { pnl: number; trades: number }>;
  
  // Trade history
  trades: Trade[];
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  lots: number;
  entryPrice: number;
  exitPrice: number | null;
  stopLoss: number;
  takeProfit: number;
  openTime: string;
  closeTime: string | null;
  pnl: number;
  status: 'open' | 'closed';
  commission: number;
}

export interface SimulationState {
  accounts: TradingAccount[];
  selectedAccountId: string | null;
  userProfile: {
    name: string;
    email: string;
    totalPayouts: number;
    pendingPayouts: number;
  };
}

// Market data simulation - Indian Index Instruments
export const SYMBOLS = [
  { symbol: 'NIFTY50', pip: 0.05, spread: 0.5, volatility: 25 },
  { symbol: 'BANKNIFTY', pip: 0.05, spread: 1.0, volatility: 60 },
  { symbol: 'FINNIFTY', pip: 0.05, spread: 0.8, volatility: 40 },
  { symbol: 'MIDCPNIFTY', pip: 0.05, spread: 1.5, volatility: 50 },
  { symbol: 'SENSEX', pip: 0.05, spread: 1.0, volatility: 80 },
  { symbol: 'BANKEX', pip: 0.05, spread: 1.2, volatility: 70 },
];

export const ACCOUNT_CONFIGS = {
  '50000': { fee: 1000, oneStep: { target: 8, daily: 4, max: 6 }, twoStep: { target1: 8, target2: 5, daily: 4, max: 8 } },
  '100000': { fee: 2000, oneStep: { target: 8, daily: 4, max: 6 }, twoStep: { target1: 8, target2: 5, daily: 4, max: 8 } },
  '250000': { fee: 4000, oneStep: { target: 8, daily: 4, max: 6 }, twoStep: { target1: 8, target2: 5, daily: 4, max: 8 } },
  '500000': { fee: 8000, oneStep: { target: 8, daily: 4, max: 6 }, twoStep: { target1: 8, target2: 5, daily: 4, max: 8 } },
  '1000000': { fee: 15000, oneStep: { target: 8, daily: 4, max: 6 }, twoStep: { target1: 8, target2: 5, daily: 4, max: 8 } },
  '2500000': { fee: 35000, oneStep: { target: 8, daily: 4, max: 6 }, twoStep: { target1: 8, target2: 5, daily: 4, max: 8 } },
};

const STORAGE_KEY = 'elite_prop_simulation';

// Initialize default state
function getDefaultState(): SimulationState {
  return {
    accounts: [],
    selectedAccountId: null,
    userProfile: {
      name: 'Prajwal Mohan',
      email: '8prajwal.mohan8@gmail.com',
      totalPayouts: 0,
      pendingPayouts: 0,
    },
  };
}

// Load state from session storage
export function loadSimulationState(): SimulationState {
  if (typeof window === 'undefined') return getDefaultState();
  
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return getDefaultState();
    }
  }
  return getDefaultState();
}

// Save state to session storage
export function saveSimulationState(state: SimulationState): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Create a new trading account
export function createAccount(
  accountSize: number,
  type: 'one-step' | 'two-step',
  name?: string
): TradingAccount {
  const config = ACCOUNT_CONFIGS[accountSize.toString() as keyof typeof ACCOUNT_CONFIGS];
  const isOneStep = type === 'one-step';
  
  const targetPercent = isOneStep ? config.oneStep.target : config.twoStep.target1;
  const dailyPercent = isOneStep ? config.oneStep.daily : config.twoStep.daily;
  const maxPercent = isOneStep ? config.oneStep.max : config.twoStep.max;
  
  const account: TradingAccount = {
    id: generateId(),
    name: name || `${type === 'one-step' ? 'One Step' : 'Two Step'} ₹${(accountSize / 100000).toFixed(0)}L`,
    type,
    accountSize,
    balance: accountSize,
    equity: accountSize,
    pnl: 0,
    status: 'evaluation',
    phase: 1,
    createdAt: new Date().toISOString(),
    startDate: new Date().toISOString(),
    
    profitTarget: accountSize * (targetPercent / 100),
    profitTargetPercent: targetPercent,
    maxDailyLoss: accountSize * (dailyPercent / 100),
    maxDailyLossPercent: dailyPercent,
    maxTotalLoss: accountSize * (maxPercent / 100),
    maxTotalLossPercent: maxPercent,
    minTradingDays: 3,
    tradingDaysCompleted: 0,
    
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    totalLots: 0,
    biggestWin: 0,
    biggestLoss: 0,
    
    dailyPnL: 0,
    dailyStartEquity: accountSize,
    lastTradeDate: null,
    tradingDays: {},
    
    trades: [],
  };
  
  return account;
}

// Get current market price (simulated)
export function getMarketPrice(symbol: string): { bid: number; ask: number } {
  const symbolData = SYMBOLS.find(s => s.symbol === symbol) || SYMBOLS[0];
  
  // Base prices - Indian Index values
  const basePrices: Record<string, number> = {
    'NIFTY50': 24500.00,
    'BANKNIFTY': 52000.00,
    'FINNIFTY': 23800.00,
    'MIDCPNIFTY': 12500.00,
    'SENSEX': 81000.00,
    'BANKEX': 56000.00,
  };
  
  const basePrice = basePrices[symbol] || 1.0000;
  const randomMove = (Math.random() - 0.5) * symbolData.volatility;
  const currentPrice = basePrice + randomMove;
  
  return {
    bid: currentPrice,
    ask: currentPrice + (symbolData.spread * symbolData.pip),
  };
}

// Calculate PnL for a trade
export function calculatePnL(trade: Trade, currentPrice: number): number {
  if (!trade.exitPrice && trade.status === 'open') {
    // Calculate floating PnL
    const priceDiff = trade.type === 'buy' 
      ? currentPrice - trade.entryPrice 
      : trade.entryPrice - currentPrice;
    
    const symbolData = SYMBOLS.find(s => s.symbol === trade.symbol);
    const pipValue = symbolData?.pip || 0.0001;
    const pips = priceDiff / pipValue;
    
    // Simplified: $10 per pip per lot for most pairs
    return pips * 10 * trade.lots - trade.commission;
  }
  return trade.pnl;
}

// Open a new trade
export function openTrade(
  account: TradingAccount,
  symbol: string,
  type: 'buy' | 'sell',
  lots: number,
  stopLoss: number,
  takeProfit: number
): { account: TradingAccount; trade: Trade } {
  const price = getMarketPrice(symbol);
  const entryPrice = type === 'buy' ? price.ask : price.bid;
  const commission = lots * 7; // $7 per lot
  
  const trade: Trade = {
    id: generateId(),
    symbol,
    type,
    lots,
    entryPrice,
    exitPrice: null,
    stopLoss,
    takeProfit,
    openTime: new Date().toISOString(),
    closeTime: null,
    pnl: -commission,
    status: 'open',
    commission,
  };
  
  const updatedAccount = {
    ...account,
    trades: [...account.trades, trade],
    totalTrades: account.totalTrades + 1,
    totalLots: account.totalLots + lots,
  };
  
  return { account: updatedAccount, trade };
}

// Close a trade
export function closeTrade(
  account: TradingAccount,
  tradeId: string,
  exitPrice?: number
): TradingAccount {
  const tradeIndex = account.trades.findIndex(t => t.id === tradeId);
  if (tradeIndex === -1) return account;
  
  const trade = account.trades[tradeIndex];
  if (trade.status === 'closed') return account;
  
  const price = exitPrice || getMarketPrice(trade.symbol).bid;
  const finalExitPrice = trade.type === 'buy' ? price : getMarketPrice(trade.symbol).ask;
  
  const priceDiff = trade.type === 'buy'
    ? finalExitPrice - trade.entryPrice
    : trade.entryPrice - finalExitPrice;
  
  const symbolData = SYMBOLS.find(s => s.symbol === trade.symbol);
  const pipValue = symbolData?.pip || 0.0001;
  const pips = priceDiff / pipValue;
  const tradePnL = pips * 10 * trade.lots - trade.commission;
  
  const updatedTrade: Trade = {
    ...trade,
    exitPrice: finalExitPrice,
    closeTime: new Date().toISOString(),
    pnl: tradePnL,
    status: 'closed',
  };
  
  const today = new Date().toISOString().split('T')[0];
  const isNewTradingDay = account.lastTradeDate !== today;
  
  const updatedTradingDays = { ...account.tradingDays };
  if (!updatedTradingDays[today]) {
    updatedTradingDays[today] = { pnl: 0, trades: 0 };
  }
  updatedTradingDays[today].pnl += tradePnL;
  updatedTradingDays[today].trades += 1;
  
  const newTradingDaysCompleted = Object.keys(updatedTradingDays).length;
  const newDailyPnL = isNewTradingDay ? tradePnL : account.dailyPnL + tradePnL;
  const newDailyStartEquity = isNewTradingDay ? account.equity : account.dailyStartEquity;
  
  const newPnL = account.pnl + tradePnL;
  const newBalance = account.balance + tradePnL;
  const newEquity = newBalance;
  
  // Check for breach conditions
  let newStatus = account.status;
  
  // Daily loss breach
  if (newDailyPnL <= -account.maxDailyLoss) {
    newStatus = 'breached';
  }
  
  // Total loss breach
  if (newPnL <= -account.maxTotalLoss) {
    newStatus = 'breached';
  }
  
  // Check if passed
  if (newPnL >= account.profitTarget && newTradingDaysCompleted >= account.minTradingDays && newStatus !== 'breached') {
    if (account.type === 'two-step' && account.phase === 1) {
      newStatus = 'evaluation'; // Move to phase 2
    } else {
      newStatus = 'passed';
    }
  }
  
  const updatedTrades = [...account.trades];
  updatedTrades[tradeIndex] = updatedTrade;
  
  return {
    ...account,
    trades: updatedTrades,
    pnl: newPnL,
    balance: newBalance,
    equity: newEquity,
    dailyPnL: newDailyPnL,
    dailyStartEquity: newDailyStartEquity,
    lastTradeDate: today,
    tradingDays: updatedTradingDays,
    tradingDaysCompleted: newTradingDaysCompleted,
    winningTrades: tradePnL > 0 ? account.winningTrades + 1 : account.winningTrades,
    losingTrades: tradePnL < 0 ? account.losingTrades + 1 : account.losingTrades,
    biggestWin: tradePnL > account.biggestWin ? tradePnL : account.biggestWin,
    biggestLoss: tradePnL < account.biggestLoss ? tradePnL : account.biggestLoss,
    status: newStatus,
  };
}

// Simulate a quick trade (for demo purposes)
export function simulateQuickTrade(
  account: TradingAccount,
  symbol: string,
  type: 'buy' | 'sell',
  lots: number,
  outcome: 'win' | 'loss' | 'random'
): TradingAccount {
  const symbolData = SYMBOLS.find(s => s.symbol === symbol) || SYMBOLS[0];
  const price = getMarketPrice(symbol);
  const entryPrice = type === 'buy' ? price.ask : price.bid;
  const commission = lots * 7;
  
  // Determine outcome
  let isWin: boolean;
  if (outcome === 'random') {
    isWin = Math.random() > 0.4; // 60% win rate
  } else {
    isWin = outcome === 'win';
  }
  
  // Calculate pip movement (20-80 pips)
  const pipMove = 20 + Math.random() * 60;
  const priceDiff = pipMove * symbolData.pip * (isWin ? 1 : -1);
  
  const exitPrice = type === 'buy' 
    ? entryPrice + priceDiff 
    : entryPrice - priceDiff;
  
  const tradePnL = pipMove * 10 * lots * (isWin ? 1 : -1) - commission;
  
  const trade: Trade = {
    id: generateId(),
    symbol,
    type,
    lots,
    entryPrice,
    exitPrice,
    stopLoss: type === 'buy' ? entryPrice - 50 * symbolData.pip : entryPrice + 50 * symbolData.pip,
    takeProfit: type === 'buy' ? entryPrice + 80 * symbolData.pip : entryPrice - 80 * symbolData.pip,
    openTime: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    closeTime: new Date().toISOString(),
    pnl: tradePnL,
    status: 'closed',
    commission,
  };
  
  const today = new Date().toISOString().split('T')[0];
  const isNewTradingDay = account.lastTradeDate !== today;
  
  const updatedTradingDays = { ...account.tradingDays };
  if (!updatedTradingDays[today]) {
    updatedTradingDays[today] = { pnl: 0, trades: 0 };
  }
  updatedTradingDays[today].pnl += tradePnL;
  updatedTradingDays[today].trades += 1;
  
  const newTradingDaysCompleted = Object.keys(updatedTradingDays).length;
  const newDailyPnL = isNewTradingDay ? tradePnL : account.dailyPnL + tradePnL;
  const newDailyStartEquity = isNewTradingDay ? account.equity : account.dailyStartEquity;
  
  const newPnL = account.pnl + tradePnL;
  const newBalance = account.balance + tradePnL;
  const newEquity = newBalance;
  
  // Check for breach conditions
  let newStatus = account.status;
  
  if (newDailyPnL <= -account.maxDailyLoss || newPnL <= -account.maxTotalLoss) {
    newStatus = 'breached';
  }
  
  if (newPnL >= account.profitTarget && newTradingDaysCompleted >= account.minTradingDays && newStatus !== 'breached') {
    if (account.type === 'two-step' && account.phase === 1) {
      // Would advance to phase 2
    } else {
      newStatus = 'passed';
    }
  }
  
  return {
    ...account,
    trades: [...account.trades, trade],
    pnl: newPnL,
    balance: newBalance,
    equity: newEquity,
    dailyPnL: newDailyPnL,
    dailyStartEquity: newDailyStartEquity,
    lastTradeDate: today,
    tradingDays: updatedTradingDays,
    tradingDaysCompleted: newTradingDaysCompleted,
    totalTrades: account.totalTrades + 1,
    totalLots: account.totalLots + lots,
    winningTrades: isWin ? account.winningTrades + 1 : account.winningTrades,
    losingTrades: !isWin ? account.losingTrades + 1 : account.losingTrades,
    biggestWin: tradePnL > account.biggestWin ? tradePnL : account.biggestWin,
    biggestLoss: tradePnL < account.biggestLoss ? tradePnL : account.biggestLoss,
    status: newStatus,
  };
}

// Reset daily stats (call at day change)
export function resetDailyStats(account: TradingAccount): TradingAccount {
  return {
    ...account,
    dailyPnL: 0,
    dailyStartEquity: account.equity,
  };
}

// Format currency
export function formatCurrency(amount: number, currency = '₹'): string {
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  return `${amount < 0 ? '-' : ''}${currency}${formatted}`;
}

// Get account progress percentage
export function getAccountProgress(account: TradingAccount): {
  profitProgress: number;
  dailyLossUsed: number;
  totalLossUsed: number;
  tradingDaysProgress: number;
} {
  return {
    profitProgress: Math.min(100, Math.max(0, (account.pnl / account.profitTarget) * 100)),
    dailyLossUsed: Math.min(100, Math.max(0, (Math.abs(Math.min(0, account.dailyPnL)) / account.maxDailyLoss) * 100)),
    totalLossUsed: Math.min(100, Math.max(0, (Math.abs(Math.min(0, account.pnl)) / account.maxTotalLoss) * 100)),
    tradingDaysProgress: Math.min(100, (account.tradingDaysCompleted / account.minTradingDays) * 100),
  };
}
