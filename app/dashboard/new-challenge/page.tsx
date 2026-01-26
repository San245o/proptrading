"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { InfoIcon, TargetIcon, CalendarIcon, TrendingUpIcon } from '@/components/dashboard/icons';
import { useSimulation } from '@/app/context/SimulationContext';
import { FancyButton, CreditCardIcon } from '@/components/dashboard/FancyButton';

// --- Stagger Animation Hook ---
function useStaggerMount(itemCount: number, baseDelay = 60) {
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

// --- Data ---
const CHALLENGE_TYPES = [
  { id: 'one-step', label: 'One Step', description: 'Single phase evaluation with 10% profit target' },
  { id: 'two-step', label: 'Two Step', description: 'Two phase evaluation with lower targets per phase' },
  { id: 'zero', label: 'Zero', description: 'Instant funding with strict rules (Coming Soon)', disabled: true },
];

const MODELS = [
  { id: 'elite-prop', label: 'Elite Prop India', description: 'Standard evaluation model' },
  { id: 'elite-pro', label: 'Elite Prop Pro', description: 'Advanced model with scaling', disabled: true },
];

const PROFIT_TARGETS = [
  { id: '8', label: '8%', price: 0, isDefault: true },
  { id: '10', label: '10%', price: -40 },
];

const ACCOUNT_SIZES = [
  { value: '50000', label: '₹50,000', fee: 1000 },
  { value: '100000', label: '₹1,00,000', fee: 2000 },
  { value: '250000', label: '₹2,50,000', fee: 4000 },
  { value: '500000', label: '₹5,00,000', fee: 8000, popular: true },
  { value: '1000000', label: '₹10,00,000', fee: 15000 },
  { value: '2500000', label: '₹25,00,000', fee: 35000 },
];

const PRICING_DETAILS: Record<string, Record<string, { oneStep: Record<string, string>; twoStep: Record<string, string> }>> = {
  '8': {
    '50000': {
      oneStep: { profitTarget: '₹4,000', dailyLoss: '₹2,000 (4%)', maxDrawdown: '₹3,000 (6%)', minDays: '3 days' },
      twoStep: { profitTarget: '₹4,000 / ₹2,500', dailyLoss: '₹2,000 (4%)', maxDrawdown: '₹4,000 (8%)', minDays: '3 days' },
    },
    '100000': {
      oneStep: { profitTarget: '₹8,000', dailyLoss: '₹4,000 (4%)', maxDrawdown: '₹6,000 (6%)', minDays: '3 days' },
      twoStep: { profitTarget: '₹8,000 / ₹5,000', dailyLoss: '₹4,000 (4%)', maxDrawdown: '₹8,000 (8%)', minDays: '3 days' },
    },
    '250000': {
      oneStep: { profitTarget: '₹20,000', dailyLoss: '₹10,000 (4%)', maxDrawdown: '₹15,000 (6%)', minDays: '3 days' },
      twoStep: { profitTarget: '₹20,000 / ₹12,500', dailyLoss: '₹10,000 (4%)', maxDrawdown: '₹20,000 (8%)', minDays: '3 days' },
    },
    '500000': {
      oneStep: { profitTarget: '₹40,000', dailyLoss: '₹20,000 (4%)', maxDrawdown: '₹30,000 (6%)', minDays: '3 days' },
      twoStep: { profitTarget: '₹40,000 / ₹25,000', dailyLoss: '₹20,000 (4%)', maxDrawdown: '₹40,000 (8%)', minDays: '3 days' },
    },
    '1000000': {
      oneStep: { profitTarget: '₹80,000', dailyLoss: '₹40,000 (4%)', maxDrawdown: '₹60,000 (6%)', minDays: '3 days' },
      twoStep: { profitTarget: '₹80,000 / ₹50,000', dailyLoss: '₹40,000 (4%)', maxDrawdown: '₹80,000 (8%)', minDays: '3 days' },
    },
    '2500000': {
      oneStep: { profitTarget: '₹2,00,000', dailyLoss: '₹1,00,000 (4%)', maxDrawdown: '₹1,50,000 (6%)', minDays: '3 days' },
      twoStep: { profitTarget: '₹2,00,000 / ₹1,25,000', dailyLoss: '₹1,00,000 (4%)', maxDrawdown: '₹2,00,000 (8%)', minDays: '3 days' },
    },
  },
  '10': {
    '50000': {
      oneStep: { profitTarget: '₹5,000', dailyLoss: '₹2,000 (4%)', maxDrawdown: '₹3,000 (6%)', minDays: '3 days' },
      twoStep: { profitTarget: '₹5,000 / ₹3,000', dailyLoss: '₹2,000 (4%)', maxDrawdown: '₹4,000 (8%)', minDays: '3 days' },
    },
    '100000': {
      oneStep: { profitTarget: '₹10,000', dailyLoss: '₹4,000 (4%)', maxDrawdown: '₹6,000 (6%)', minDays: '3 days' },
      twoStep: { profitTarget: '₹10,000 / ₹6,000', dailyLoss: '₹4,000 (4%)', maxDrawdown: '₹8,000 (8%)', minDays: '3 days' },
    },
    '250000': {
      oneStep: { profitTarget: '₹25,000', dailyLoss: '₹10,000 (4%)', maxDrawdown: '₹15,000 (6%)', minDays: '3 days' },
      twoStep: { profitTarget: '₹25,000 / ₹15,000', dailyLoss: '₹10,000 (4%)', maxDrawdown: '₹20,000 (8%)', minDays: '3 days' },
    },
    '500000': {
      oneStep: { profitTarget: '₹50,000', dailyLoss: '₹20,000 (4%)', maxDrawdown: '₹30,000 (6%)', minDays: '3 days' },
      twoStep: { profitTarget: '₹50,000 / ₹30,000', dailyLoss: '₹20,000 (4%)', maxDrawdown: '₹40,000 (8%)', minDays: '3 days' },
    },
    '1000000': {
      oneStep: { profitTarget: '₹1,00,000', dailyLoss: '₹40,000 (4%)', maxDrawdown: '₹60,000 (6%)', minDays: '3 days' },
      twoStep: { profitTarget: '₹1,00,000 / ₹60,000', dailyLoss: '₹40,000 (4%)', maxDrawdown: '₹80,000 (8%)', minDays: '3 days' },
    },
    '2500000': {
      oneStep: { profitTarget: '₹2,50,000', dailyLoss: '₹1,00,000 (4%)', maxDrawdown: '₹1,50,000 (6%)', minDays: '3 days' },
      twoStep: { profitTarget: '₹2,50,000 / ₹1,50,000', dailyLoss: '₹1,00,000 (4%)', maxDrawdown: '₹2,00,000 (8%)', minDays: '3 days' },
    },
  },
};

// --- Card Components ---
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] ${className}`}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />
    <div className="relative z-10 h-full">{children}</div>
  </div>
);

const SelectionCard = ({ 
  selected, 
  onClick, 
  disabled = false, 
  children, 
  className = "" 
}: { 
  selected: boolean; 
  onClick: () => void; 
  disabled?: boolean; 
  children: React.ReactNode; 
  className?: string 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`relative flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
      disabled 
        ? 'cursor-not-allowed opacity-50 border-white/5 bg-white/5' 
        : selected 
          ? 'border-blue-500/50 bg-blue-500/10' 
          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
    } ${className}`}
  >
    <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
      selected ? 'border-blue-500 bg-blue-500' : 'border-white/30'
    }`}>
      {selected && <div className="h-2 w-2 rounded-full bg-white" />}
    </div>
    {children}
  </button>
);

const Tooltip = ({ content }: { content: string }) => (
  <div className="group relative inline-block">
    <InfoIcon className="w-4 h-4 text-gray-500 cursor-help" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
      <div className="rounded-lg bg-gray-900 border border-white/10 px-3 py-2 text-xs text-gray-300 whitespace-nowrap shadow-xl">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  </div>
);

// --- Main Page ---
export default function NewChallengePage() {
  const router = useRouter();
  const { createNewAccount } = useSimulation();
  const [challengeType, setChallengeType] = useState('two-step');
  const [model, setModel] = useState('elite-prop');
  const [profitTarget, setProfitTarget] = useState('8');
  const [accountSize, setAccountSize] = useState('500000');
  const [couponCode, setCouponCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const visible = useStaggerMount(8, 60);

  const selectedSize = ACCOUNT_SIZES.find(s => s.value === accountSize);
  const baseFee = selectedSize?.fee || 0;
  const targetAdjustment = PROFIT_TARGETS.find(t => t.id === profitTarget)?.price || 0;
  const totalFee = baseFee + targetAdjustment;

  const pricingDetails = PRICING_DETAILS[profitTarget]?.[accountSize]?.[challengeType === 'one-step' ? 'oneStep' : 'twoStep'];

  const handlePayment = async () => {
    if (!agreedToTerms) return;
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create the account in the simulation
    const type = challengeType as 'one-step' | 'two-step';
    const size = parseInt(accountSize);
    const accountName = `${selectedSize?.label} ${challengeType === 'one-step' ? 'One Step' : 'Two Step'} Challenge`;
    
    createNewAccount(size, type, accountName);
    
    setIsProcessing(false);
    
    // Redirect to accounts page
    router.push('/dashboard/accounts');
  };

  return (
    <div className="relative min-h-screen text-white pb-12">
      {/* Dark Dot Matrix Background */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundColor: '#0a0a0a',
        backgroundImage: `radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px), radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)`,
        backgroundSize: '10px 10px',
      }} />

      <div className="relative z-10">
        <FadeInItem visible={visible[0]}>
          <h1 className="text-3xl font-bold text-white mb-8">New Challenge</h1>
        </FadeInItem>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-8">
            {/* Challenge Type */}
            <FadeInItem visible={visible[1]}>
              <Card className="p-6">
                <h2 className="font-semibold text-white mb-2">Challenge Type</h2>
                <p className="text-sm text-gray-400 mb-4">Choose the type of challenge you want to take</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CHALLENGE_TYPES.map(type => (
                    <SelectionCard
                      key={type.id}
                      selected={challengeType === type.id}
                      onClick={() => !type.disabled && setChallengeType(type.id)}
                      disabled={type.disabled}
                    >
                      <span className="font-medium text-white">{type.label}</span>
                    </SelectionCard>
                  ))}
                </div>
              </Card>
            </FadeInItem>

            {/* Model */}
            <FadeInItem visible={visible[2]}>
              <Card className="p-6">
                <h2 className="font-semibold text-white mb-2">Model</h2>
                <p className="text-sm text-gray-400 mb-4">Choose the trading model</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MODELS.map(m => (
                    <SelectionCard
                      key={m.id}
                      selected={model === m.id}
                      onClick={() => !m.disabled && setModel(m.id)}
                      disabled={m.disabled}
                    >
                      <span className="font-medium text-white">{m.label}</span>
                    </SelectionCard>
                  ))}
                </div>
              </Card>
            </FadeInItem>

            {/* Customise Trading Rules */}
            <FadeInItem visible={visible[3]}>
              <Card className="p-6 border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-transparent">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">Customise Trading Rules</h2>
                    <p className="text-sm text-gray-400">Adjust your challenge parameters to match your trading style</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-medium text-white">Profit Target</h3>
                      <Tooltip content="Higher profit target = lower fee" />
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Choose options for profit target</p>
                    <div className="grid grid-cols-2 gap-3">
                      {PROFIT_TARGETS.map(target => (
                        <SelectionCard
                          key={target.id}
                          selected={profitTarget === target.id}
                          onClick={() => setProfitTarget(target.id)}
                        >
                          <div className="flex-1 flex items-center justify-between">
                            <span className="font-medium text-white">{target.label}</span>
                            {target.isDefault ? (
                              <span className="text-xs text-gray-500">Default</span>
                            ) : (
                              <span className="text-xs text-emerald-400">{target.price > 0 ? `+₹${target.price}` : `-₹${Math.abs(target.price)}`}</span>
                            )}
                          </div>
                        </SelectionCard>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </FadeInItem>

            {/* Account Size */}
            <FadeInItem visible={visible[4]}>
              <Card className="p-6">
                <h2 className="font-semibold text-white mb-2">Account Size</h2>
                <p className="text-sm text-gray-400 mb-4">Choose your preferred account size</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ACCOUNT_SIZES.map(size => (
                    <SelectionCard
                      key={size.value}
                      selected={accountSize === size.value}
                      onClick={() => setAccountSize(size.value)}
                      className={size.popular ? 'ring-1 ring-blue-500/30' : ''}
                    >
                      <div className="flex-1">
                        <span className="font-medium text-white">{size.label}</span>
                        {size.popular && (
                          <span className="ml-2 text-[10px] font-semibold text-blue-400 bg-blue-500/20 px-1.5 py-0.5 rounded">POPULAR</span>
                        )}
                      </div>
                    </SelectionCard>
                  ))}
                </div>
              </Card>
            </FadeInItem>

            {/* Trading Rules Summary */}
            <FadeInItem visible={visible[5]}>
              <Card className="p-6">
                <h2 className="font-semibold text-white mb-4">Trading Rules Summary</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: <TargetIcon className="w-5 h-5" />, label: 'Profit Target', value: pricingDetails?.profitTarget || '-' },
                    { icon: <TrendingUpIcon className="w-5 h-5" />, label: 'Daily Loss Limit', value: pricingDetails?.dailyLoss || '-' },
                    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>, label: 'Max Drawdown', value: pricingDetails?.maxDrawdown || '-' },
                    { icon: <CalendarIcon className="w-5 h-5" />, label: 'Min Trading Days', value: pricingDetails?.minDays || '-' },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-blue-400 mb-2">{item.icon}</div>
                      <div className="text-xs text-gray-500 mb-1">{item.label}</div>
                      <div className="font-semibold text-white text-sm">{item.value}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </FadeInItem>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <FadeInItem visible={visible[6]}>
              <div className="sticky top-4 space-y-6">
                {/* Billing Details */}
                <Card className="p-6">
                  <h2 className="font-semibold text-white mb-2">Billing Details</h2>
                  <p className="text-sm text-gray-400 mb-4">Enter your billing information for the challenge purchase</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Coupon Code</label>
                      <p className="text-xs text-gray-500 mb-2">Enter a coupon code to get a discount on your challenge</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500/50"
                        />
                        <button className="px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-gray-400 hover:bg-white/10 transition-colors">
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Order Summary */}
                <Card className="p-6 bg-gradient-to-br from-blue-900/30 to-transparent border-blue-500/20">
                  <h2 className="font-semibold text-white mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-white">{selectedSize?.label} — {challengeType === 'one-step' ? 'One Step' : 'Two Step'} Elite Prop</div>
                        <div className="text-xs text-gray-500">Platform: MetaTrader 5</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">₹{baseFee.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    {targetAdjustment !== 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{profitTarget}% Profit Target Adjustment</span>
                        <span className={targetAdjustment > 0 ? 'text-red-400' : 'text-emerald-400'}>
                          {targetAdjustment > 0 ? '+' : '-'}₹{Math.abs(targetAdjustment)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/10 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-white">Total</span>
                      <span className="text-2xl font-bold text-white">₹{totalFee.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50"
                      />
                      <span className="text-xs text-gray-400 leading-relaxed">
                        I agree with all the following terms:
                        <ul className="mt-2 space-y-1 list-disc list-inside text-gray-500">
                          <li>I have read and agreed to the <a href="/terms" className="text-blue-400 hover:underline">Terms of Use</a>.</li>
                          <li>All information provided is correct and matches government-issued ID.</li>
                          <li>I have read and agree with the <a href="/terms" className="text-blue-400 hover:underline">Terms & Conditions</a>.</li>
                          <li>I confirm that I am not a U.S. citizen or resident.</li>
                        </ul>
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={!agreedToTerms || isProcessing}
                    className={`btn-fancy btn-fancy-blue w-full justify-center ${
                      !agreedToTerms || isProcessing ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <span className="btn-ball">
                      {isProcessing ? (
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <CreditCardIcon />
                      )}
                    </span>
                    <span className="relative z-10 font-medium">
                      {isProcessing ? 'Processing...' : 'Continue to Payment'}
                    </span>
                  </button>
                </Card>

                {/* Secure Payment Note */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure payment powered by Razorpay</span>
                </div>
              </div>
            </FadeInItem>
          </div>
        </div>

        {/* Important Disclosures */}
        <FadeInItem visible={visible[7]}>
          <Card className="p-6 mt-8">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <InfoIcon className="w-5 h-5 text-amber-400" />
              Important Disclosures
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
              <ul className="space-y-2 list-disc list-inside">
                <li>Elite Prop India does not provide investment services, brokerage services, or financial advice.</li>
                <li>All evaluation accounts are simulated trading environments. No real money trading takes place.</li>
                <li>The evaluation fee is not a deposit, investment, or capital contribution.</li>
              </ul>
              <ul className="space-y-2 list-disc list-inside">
                <li>Funded phase accounts are also simulated accounts. No real capital is allocated.</li>
                <li>Performance-based rewards are not guaranteed and are issued at Elite Prop India&apos;s discretion.</li>
                <li>Simulated performance does not guarantee real-world results.</li>
              </ul>
            </div>
          </Card>
        </FadeInItem>
      </div>
    </div>
  );
}
