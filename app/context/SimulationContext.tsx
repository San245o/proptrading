"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SimulationState,
  TradingAccount,
  loadSimulationState,
  saveSimulationState,
  createAccount,
  simulateQuickTrade,
  formatCurrency,
  getAccountProgress,
  SYMBOLS,
} from '@/app/lib/simulation';

interface SimulationContextType {
  state: SimulationState;
  isLoading: boolean;
  
  // Account management
  accounts: TradingAccount[];
  selectedAccount: TradingAccount | null;
  selectAccount: (id: string | null) => void;
  createNewAccount: (size: number, type: 'one-step' | 'two-step', name?: string) => TradingAccount;
  deleteAccount: (id: string) => void;
  
  // Trading
  executeTrade: (symbol: string, type: 'buy' | 'sell', lots: number, outcome?: 'win' | 'loss' | 'random') => void;
  
  // Utils
  formatCurrency: typeof formatCurrency;
  getProgress: (account: TradingAccount) => ReturnType<typeof getAccountProgress>;
  symbols: typeof SYMBOLS;
  
  // Reset
  resetSimulation: () => void;
}

const SimulationContext = createContext<SimulationContextType | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SimulationState>({
    accounts: [],
    selectedAccountId: null,
    userProfile: {
      name: 'Prajwal Mohan',
      email: '8prajwal.mohan8@gmail.com',
      totalPayouts: 0,
      pendingPayouts: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load state from session storage on mount
  useEffect(() => {
    const loadedState = loadSimulationState();
    setState(loadedState);
    setIsLoading(false);
  }, []);

  // Save state to session storage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveSimulationState(state);
    }
  }, [state, isLoading]);

  const selectedAccount = state.accounts.find(a => a.id === state.selectedAccountId) || null;

  const selectAccount = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedAccountId: id }));
  }, []);

  const createNewAccount = useCallback((size: number, type: 'one-step' | 'two-step', name?: string) => {
    const newAccount = createAccount(size, type, name);
    setState(prev => ({
      ...prev,
      accounts: [...prev.accounts, newAccount],
      selectedAccountId: newAccount.id,
    }));
    return newAccount;
  }, []);

  const deleteAccount = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      accounts: prev.accounts.filter(a => a.id !== id),
      selectedAccountId: prev.selectedAccountId === id ? null : prev.selectedAccountId,
    }));
  }, []);

  const executeTrade = useCallback((
    symbol: string,
    type: 'buy' | 'sell',
    lots: number,
    outcome: 'win' | 'loss' | 'random' = 'random'
  ) => {
    if (!state.selectedAccountId) return;
    
    setState(prev => {
      const accountIndex = prev.accounts.findIndex(a => a.id === prev.selectedAccountId);
      if (accountIndex === -1) return prev;
      
      const account = prev.accounts[accountIndex];
      if (account.status === 'breached' || account.status === 'passed') return prev;
      
      const updatedAccount = simulateQuickTrade(account, symbol, type, lots, outcome);
      const newAccounts = [...prev.accounts];
      newAccounts[accountIndex] = updatedAccount;
      
      return { ...prev, accounts: newAccounts };
    });
  }, [state.selectedAccountId]);

  const resetSimulation = useCallback(() => {
    const defaultState: SimulationState = {
      accounts: [],
      selectedAccountId: null,
      userProfile: {
        name: 'Prajwal Mohan',
        email: '8prajwal.mohan8@gmail.com',
        totalPayouts: 0,
        pendingPayouts: 0,
      },
    };
    setState(defaultState);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('elite_prop_simulation');
    }
  }, []);

  const getProgress = useCallback((account: TradingAccount) => {
    return getAccountProgress(account);
  }, []);

  return (
    <SimulationContext.Provider value={{
      state,
      isLoading,
      accounts: state.accounts,
      selectedAccount,
      selectAccount,
      createNewAccount,
      deleteAccount,
      executeTrade,
      formatCurrency,
      getProgress,
      symbols: SYMBOLS,
      resetSimulation,
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
