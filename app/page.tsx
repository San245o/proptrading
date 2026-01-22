"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Tooltip descriptions for pricing table
const PRICING_TOOLTIPS: Record<string, string> = {
  profitShare: "The percentage of profits you keep from your funded account. You earn 80% of all profits generated.",
  profitTarget: "The profit goal you need to achieve to pass the evaluation and get funded.",
  step2Goal: "The profit target for Step 2 in the 2-Step evaluation model.",
  dailyLoss: "Maximum loss allowed in a single trading day. Exceeding this limit will breach your account.",
  maxDrawdown: "Maximum overall loss allowed from your peak balance. This protects your account from excessive losses."
};

// Floating Card Component with staggered fade-in animation
function FloatingCard({ 
  children, 
  className = "", 
  delay = 0,
  rotate = "0deg"
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
  rotate?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-all duration-700 ease-out ${className} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transform: `rotate(${rotate})` }}
    >
      {children}
    </div>
  );
}

// Mini Chart Component for Dashboard Cards
function MiniLineChart() {
  return (
    <svg viewBox="0 0 100 40" className="h-full w-full">
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M 0 35 Q 15 30, 25 25 T 50 20 T 75 12 T 100 8"
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
      />
      <path
        d="M 0 35 Q 15 30, 25 25 T 50 20 T 75 12 T 100 8 L 100 40 L 0 40 Z"
        fill="url(#chartGradient)"
      />
    </svg>
  );
}

// Mini Bar Chart Component
function MiniBarChart() {
  const bars = [40, 65, 45, 80, 55, 90, 70];
  return (
    <div className="flex h-full items-end gap-1">
      {bars.map((height, i) => (
        <div 
          key={i}
          className="flex-1 rounded-t bg-emerald-500/80"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

// Donut Chart Component
function DonutChart() {
  return (
    <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3" />
      <circle 
        cx="18" cy="18" r="15.9" fill="none" 
        stroke="#10b981" strokeWidth="3" 
        strokeDasharray="75 25"
      />
      <circle 
        cx="18" cy="18" r="15.9" fill="none" 
        stroke="#3b82f6" strokeWidth="3" 
        strokeDasharray="20 80"
        strokeDashoffset="-75"
      />
    </svg>
  );
}

const STEPS = [
  {
    step: "01",
    title: "Choose Your Challenge",
    description:
      "Select your account size and evaluation model. One-Step or Two-Step challenge based on your trading style.",
    example:
      "Example: Choose a ₹5,00,000 account with the One-Step Challenge. Hit 10% profit target while respecting 4% daily and 6% max drawdown.",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2000&auto=format&fit=crop"
  },
  {
    step: "02",
    title: "Pass & Get Funded",
    description:
      "Trade under predefined risk rules with no minimum trading days. Pass the evaluation and receive your funded account.",
    example:
      "Example: After passing, receive your ₹5,00,000 funded account. Trade Indian equities and F&O using MT4/MT5 platforms.",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2000&auto=format&fit=crop"
  },
  {
    step: "03",
    title: "Earn Rewards",
    description:
      "Keep 80% of your profits with bi-weekly payouts. Withdraw via UPI, Bank Transfer, or Crypto. Minimum payout just ₹100.",
    example:
      "Example: Make ₹50,000 profit on your funded account. You keep ₹40,000 (80%). Payouts processed within 24-48 hours.",
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=2000&auto=format&fit=crop"
  }
];

const ACCOUNT_SIZES = [
  { label: "₹50K", value: "50000", fee: "₹1,000" },
  { label: "₹1L", value: "100000", fee: "₹2,000" },
  { label: "₹5L", value: "500000", fee: "₹5,000", popular: true },
  { label: "₹10L", value: "1000000", fee: "₹10,000" },
  { label: "₹25L", value: "2500000", fee: "₹25,000" },
  { label: "₹50L", value: "5000000", fee: "₹50,000" },
  { label: "₹1Cr", value: "10000000", fee: "₹1,00,000" },
];

const PRICING_DATA: Record<string, { oneStep: Record<string, string>; twoStep: Record<string, string> }> = {
  "50000": {
    oneStep: { profitShare: "80%", profitTarget: "₹5,000 (10%)", step2Goal: "—", dailyLoss: "₹2,000 (4%)", maxDrawdown: "₹3,000 (6%)" },
    twoStep: { profitShare: "80%", profitTarget: "₹4,000 (8%)", step2Goal: "₹3,000 (6%)", dailyLoss: "₹2,000 (4%)", maxDrawdown: "₹4,000 (8%)" }
  },
  "100000": {
    oneStep: { profitShare: "80%", profitTarget: "₹10,000 (10%)", step2Goal: "—", dailyLoss: "₹4,000 (4%)", maxDrawdown: "₹6,000 (6%)" },
    twoStep: { profitShare: "80%", profitTarget: "₹8,000 (8%)", step2Goal: "₹6,000 (6%)", dailyLoss: "₹4,000 (4%)", maxDrawdown: "₹8,000 (8%)" }
  },
  "500000": {
    oneStep: { profitShare: "80%", profitTarget: "₹50,000 (10%)", step2Goal: "—", dailyLoss: "₹20,000 (4%)", maxDrawdown: "₹30,000 (6%)" },
    twoStep: { profitShare: "80%", profitTarget: "₹40,000 (8%)", step2Goal: "₹30,000 (6%)", dailyLoss: "₹20,000 (4%)", maxDrawdown: "₹40,000 (8%)" }
  },
  "1000000": {
    oneStep: { profitShare: "80%", profitTarget: "₹1,00,000 (10%)", step2Goal: "—", dailyLoss: "₹40,000 (4%)", maxDrawdown: "₹60,000 (6%)" },
    twoStep: { profitShare: "80%", profitTarget: "₹80,000 (8%)", step2Goal: "₹60,000 (6%)", dailyLoss: "₹40,000 (4%)", maxDrawdown: "₹80,000 (8%)" }
  },
  "2500000": {
    oneStep: { profitShare: "80%", profitTarget: "₹2,50,000 (10%)", step2Goal: "—", dailyLoss: "₹1,00,000 (4%)", maxDrawdown: "₹1,50,000 (6%)" },
    twoStep: { profitShare: "80%", profitTarget: "₹2,00,000 (8%)", step2Goal: "₹1,50,000 (6%)", dailyLoss: "₹1,00,000 (4%)", maxDrawdown: "₹2,00,000 (8%)" }
  },
  "5000000": {
    oneStep: { profitShare: "80%", profitTarget: "₹5,00,000 (10%)", step2Goal: "—", dailyLoss: "₹2,00,000 (4%)", maxDrawdown: "₹3,00,000 (6%)" },
    twoStep: { profitShare: "80%", profitTarget: "₹4,00,000 (8%)", step2Goal: "₹3,00,000 (6%)", dailyLoss: "₹2,00,000 (4%)", maxDrawdown: "₹4,00,000 (8%)" }
  },
  "10000000": {
    oneStep: { profitShare: "80%", profitTarget: "₹10,00,000 (10%)", step2Goal: "—", dailyLoss: "₹4,00,000 (4%)", maxDrawdown: "₹6,00,000 (6%)" },
    twoStep: { profitShare: "80%", profitTarget: "₹8,00,000 (8%)", step2Goal: "₹6,00,000 (6%)", dailyLoss: "₹4,00,000 (4%)", maxDrawdown: "₹8,00,000 (8%)" }
  }
};

const GUIDELINES = [
  {
    id: "evaluation",
    title: "What are the evaluation models?",
    content: "<strong>One-Step Challenge:</strong> 10% profit target, 4% daily drawdown, 6% trailing max drawdown. <strong>Two-Step Challenge:</strong> Step 1 is 8% target, Step 2 is 6% target, 4% daily drawdown, 8% static max drawdown. <strong>No time limit</strong> and <strong>no minimum trading days</strong> for both."
  },
  {
    id: "funded-rules",
    title: "What are the funded account rules?",
    content: "<strong>80% profit split</strong> to trader. Scaling plan available. <strong>News trading allowed.</strong> Weekend holding not allowed. Copy trading allowed within your own accounts only. Maximum combined allocation: <strong>₹1 Crore</strong>. HFT and latency arbitrage strictly prohibited."
  },
  {
    id: "payouts",
    title: "How do payouts work?",
    content: "<strong>Bi-weekly payouts</strong> (weekly available as add-on). Minimum payout: <strong>₹100</strong>. Payment methods: <strong>UPI, Bank Transfer, and Crypto</strong>. No tax deducted at source - traders are responsible for their own tax compliance."
  },
  {
    id: "platforms",
    title: "What platforms are supported?",
    content: "Trade using professional platforms like <strong>MT4 and MT5</strong>. All trading takes place in a <strong>fully simulated environment</strong> using live market data. Trade <strong>Indian equities and F&O</strong> instruments."
  },
  {
    id: "support",
    title: "How can I get support?",
    content: "Support available via <strong>Email, WhatsApp, and Live Chat</strong> during business hours. Join our <strong>Discord community</strong> for trader discussions and updates."
  },
  {
    id: "risk",
    title: "What is the risk disclosure?",
    content: "Prop India is <strong>not a broker</strong> and does not provide investment advice. All trading takes place in a <strong>simulated environment</strong> using live market data. Trading involves risk and <strong>past performance does not guarantee future results</strong>."
  },
];

export default function HomePage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [selectedAccount, setSelectedAccount] = useState("500000");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full">
      {/* Dark Dot Matrix Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundColor: '#0a0a0a',
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
            radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
          imageRendering: 'pixelated' as const,
        }}
      />

      <header className="fixed top-6 z-50 flex w-full justify-center px-6">
        <div className="flex w-full max-w-6xl items-center justify-between">
          <Link href="/" className="glass-pill flex items-center gap-3 rounded-full px-5 py-3 shadow-glass">
            <span className="text-sm font-bold tracking-wide text-white">
              PROP INDIA
            </span>
          </Link>
          <nav className="glass-pill hidden items-center gap-6 rounded-full px-6 py-3 text-sm text-white/80 shadow-glass md:flex">
            <a className="transition hover:text-white" href="#how-it-works">
              How it Works
            </a>
            <a className="transition hover:text-white" href="#features">
              Features
            </a>
            <a className="transition hover:text-white" href="#pricing">
              Pricing
            </a>
            <a className="transition hover:text-white" href="#faq">
              FAQ
            </a>
            <Link href="/login" className="rounded-full bg-emerald-500 px-4 py-2 text-white transition hover:bg-emerald-600">
              Get Started
            </Link>
          </nav>
          {/* Hamburger Menu Button for Mobile */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="glass-pill flex h-11 w-11 items-center justify-center rounded-full text-white md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <div className={`fixed inset-x-0 top-20 z-40 px-6 transition-all duration-300 md:hidden ${
        mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}>
        <nav className="glass-pill flex flex-col gap-2 rounded-2xl p-4 shadow-glass">
          <a 
            href="#how-it-works" 
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            How it Works
          </a>
          <a 
            href="#features" 
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Features
          </a>
          <a 
            href="#pricing" 
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Pricing
          </a>
          <a 
            href="#faq" 
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            FAQ
          </a>
          <Link 
            href="/login" 
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Get Started
          </Link>
        </nav>
      </div>

      {/* Hero Section - New Design */}
      <section className="relative z-10 min-h-screen overflow-hidden">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pt-32 lg:flex-row lg:items-center lg:pt-20">
          {/* Left Content */}
          <div className="flex-1 space-y-8">
            {/* Badge */}

            {/* Headline */}
            <FloatingCard delay={300}>
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Built to Fund
                <br />
                <span className="italic text-emerald-400">Skilled Traders</span>
              </h1>
            </FloatingCard>

            {/* Description */}
            <FloatingCard delay={500}>
              <p className="max-w-lg text-lg leading-relaxed text-white/60">
                Access up to ₹1 Crore in trading capital through our transparent, 
                simulation-based evaluation. No time limits. Clear rules. 
                80% profit split.
              </p>
            </FloatingCard>

            {/* CTA Button */}
            <FloatingCard delay={700}>
              <div className="flex flex-wrap items-center gap-6">
                <Link 
                  href="/login"
                  className="group flex items-center gap-3 rounded-xl bg-emerald-500 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-emerald-600 active:scale-95"
                >
                  Start Challenge
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </FloatingCard>

            {/* Trust Signal */}
          </div>

          {/* Right Content - Floating Dashboard Cards */}
          <div className="relative mt-8 flex-1 lg:-mt-24">
            <div className="relative mx-auto h-[350px] w-full max-w-[400px] sm:h-[420px] lg:mx-0 lg:h-[480px] lg:max-w-none">
              {/* Main Dashboard Card */}
              <FloatingCard 
                delay={200} 
                className="absolute left-1/2 top-[45%] z-20 w-[260px] -translate-x-1/2 -translate-y-1/2 sm:w-[280px] lg:left-[40%] lg:w-[340px]"
                rotate="-3deg"
              >
                <div className="overflow-hidden rounded-2xl border border-white/20 p-5 shadow-2xl backdrop-blur-xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                  {/* Card Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-white/50">Total P&L</span>
                      <span className="text-xs text-emerald-400">Live</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-white/20" />
                      <span className="h-2 w-2 rounded-full bg-white/20" />
                      <span className="h-2 w-2 rounded-full bg-white/20" />
                    </div>
                  </div>
                  {/* P&L Value */}
                  <div className="mb-1">
                    <span className="text-3xl font-bold text-white">₹4,82,350</span>
                  </div>
                  <div className="mb-5 flex items-center gap-2">
                    <span className="flex items-center text-sm font-medium text-emerald-400">
                      <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      +12.4%
                    </span>
                    <span className="text-xs text-white/40">this month</span>
                  </div>
                  {/* Chart */}
                  <div className="h-24">
                    <MiniLineChart />
                  </div>
                </div>
              </FloatingCard>

              {/* Top Right Card - Trading Stats */}
              <FloatingCard 
                delay={400} 
                className="absolute left-0 top-0 z-30 w-[180px] sm:right-4 sm:top-8 sm:w-[200px] lg:right-8 lg:top-4 lg:w-[220px]"
                rotate="-2deg"
              >
                <div className="overflow-hidden rounded-xl border border-white/20 p-4 shadow-xl backdrop-blur-xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Win Rate */}
                    <div className="rounded-lg bg-white/5 p-2.5">
                      <div className="mb-1 flex items-center gap-1.5">
                        <div className="h-6 w-6">
                          <DonutChart />
                        </div>
                        <span className="text-[10px] text-white/40">Win Rate</span>
                      </div>
                      <div className="text-lg font-bold text-white">75%</div>
                    </div>
                    {/* Profit */}
                    <div className="rounded-lg bg-white/5 p-2.5">
                      <div className="mb-1 text-[10px] text-white/40">Profit</div>
                      <div className="text-lg font-bold text-emerald-400">₹48K</div>
                    </div>
                    {/* Target */}
                    <div className="rounded-lg bg-white/5 p-2.5">
                      <div className="mb-1 text-[10px] text-white/40">Target</div>
                      <div className="text-lg font-bold text-white">₹50K</div>
                    </div>
                    {/* Trades */}
                    <div className="rounded-lg bg-white/5 p-2.5">
                      <div className="mb-1 text-[10px] text-white/40">Trades</div>
                      <div className="text-lg font-bold text-white">127</div>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[10px]">
                      <span className="text-white/40">Progress</span>
                      <span className="text-emerald-400">96%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
                    </div>
                  </div>
                </div>
              </FloatingCard>

              {/* Bottom Card - Bar Chart */}
              <FloatingCard 
                delay={600} 
                className="absolute bottom-12 left-0 z-30 w-[160px] sm:bottom-20 sm:left-4 sm:w-[180px] lg:bottom-16 lg:left-0 lg:w-[200px]"
                rotate="6deg"
              >
                <div className="overflow-hidden rounded-xl border border-white/20 p-4 shadow-xl backdrop-blur-xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-white/50">Weekly Trades</span>
                    <span className="text-xs text-white/30">Jan 2026</span>
                  </div>
                  <div className="h-16">
                    <MiniBarChart />
                  </div>
                </div>
              </FloatingCard>

              {/* Floating Stats Badge */}
              <FloatingCard 
                delay={800} 
                className="absolute bottom-0 right-0 z-30 sm:bottom-4 sm:right-4 lg:bottom-8 lg:right-8"
                rotate="4deg"
              >
                <div className="flex items-center gap-3 rounded-2xl border border-white/20 px-4 py-3 shadow-lg backdrop-blur-xl" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/30">
                    <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">₹1Cr+</div>
                    <div className="text-[10px] text-white/40">Capital Deployed</div>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>

      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className="relative z-10 w-full py-10 lg:py-20"
      >
        <h2 className="mb-10 text-center text-5xl font-bold tracking-tighter text-white md:text-7xl lg:mb-16">
          How it Works
        </h2>



        {/* Detailed Steps */}
        <div className="flex flex-col pb-12">
          {STEPS.map((step, i) => (
            <div
              key={step.step}
              className="group sticky left-0 w-full border-t border-white/20 bg-black py-12 lg:py-16"
              style={{
                top: `calc(10vh + ${i * 64}px)`
              }}
            >
              <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 lg:flex-row lg:items-center">
                {/* Left: Text */}
                <div className="flex flex-1 flex-row items-center gap-6 lg:gap-8">
                  <span className="text-6xl font-black text-white/20 lg:text-8xl">
                    {step.step}
                  </span>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
                      {step.title}
                    </h3>
                    <ul className="mt-8 space-y-6 text-xl text-white/70">
                      <li>{step.description}</li>
                      <li className="border-l-2 border-emerald-500/30 pl-4 text-base font-medium text-white/50">
                        {step.example}
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right: Image */}
                <div className="flex-1">
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-white/5 grayscale transition-all duration-500 group-hover:grayscale-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={step.image}
                      alt={step.title}
                      className="h-full w-full object-cover opacity-80"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section - Bento Grid */}
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
          {/* Main Feature: 80% Profit Split */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/30 to-transparent p-8 transition-all hover:border-emerald-500/50 md:col-span-2 md:row-span-2">
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

          {/* Feature: No Time Limits */}
          <div className="group relative flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 text-center transition-all hover:bg-white/5 md:col-span-1 md:row-span-1">
            <svg className="mb-3 h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-white">No Time</h3>
            <h3 className="text-2xl font-bold text-white">Limits</h3>
            <p className="mt-2 text-xs font-medium text-white/40">Trade at your pace</p>
          </div>

          {/* Feature: News Trading */}
          <div className="group relative flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 text-center transition-all hover:bg-white/5 md:col-span-1 md:row-span-1">
            <svg className="mb-3 h-8 w-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="text-xl font-bold text-white">News Trading</h3>
            <p className="mt-1 text-sm text-emerald-400 font-semibold">Allowed ✓</p>
          </div>

          {/* Feature: Evaluation Models */}
          <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] p-6 md:col-span-2 md:row-span-1">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-4 flex items-center gap-4">
                <div className="rounded-lg bg-emerald-500/20 px-4 py-2 text-center">
                  <div className="text-lg font-bold text-emerald-400">1-Step</div>
                  <div className="text-[10px] text-white/50">10% Target</div>
                </div>
                <div className="text-white/30">or</div>
                <div className="rounded-lg bg-blue-500/20 px-4 py-2 text-center">
                  <div className="text-lg font-bold text-blue-400">2-Step</div>
                  <div className="text-[10px] text-white/50">8% + 5%</div>
                </div>
              </div>
              <p className="text-sm font-medium text-white/60">Choose Your Evaluation Model</p>
            </div>
          </div>

          {/* Feature: Scaling */}
          <div className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 transition-all hover:bg-white/5 md:col-span-1 md:row-span-1">
            <div>
              <h3 className="text-lg font-bold text-white">Scale to</h3>
              <h3 className="text-3xl font-black text-emerald-400">₹1 Crore</h3>
            </div>
            <p className="text-xs text-white/50">Grow your account through consistent performance</p>
          </div>

          {/* Feature: Payouts */}
          <div className="group relative flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 text-center transition-all hover:bg-white/5 md:col-span-1 md:row-span-1">
            <h3 className="text-3xl font-black text-white">Bi-Weekly</h3>
            <p className="mt-1 text-sm font-medium text-white/50">Payouts</p>
            <p className="mt-2 text-xs text-emerald-400">Every 14 days</p>
          </div>

          {/* Feature: Platforms */}
          <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 text-center transition-all hover:bg-white/5 md:col-span-2 md:row-span-1">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-black text-white">MT4</div>
                <div className="text-[10px] text-white/40">MetaTrader 4</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-black text-white">MT5</div>
                <div className="text-[10px] text-white/40">MetaTrader 5</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/50">Industry-Standard Platforms</p>
          </div>
        </div>

      </section>

      {/* Pricing Section */}
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
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h4 className="mb-3 text-lg font-bold text-white">1-Step Challenge</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span><strong className="text-white/80">10% profit target</strong> to pass</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span><strong className="text-white/80">6% trailing max drawdown</strong> (balance-based, EOD)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span>No time limit. No minimum trading days.</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h4 className="mb-3 text-lg font-bold text-white">2-Step Challenge</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span><strong className="text-white/80">Step 1: 8%</strong> | <strong className="text-white/80">Step 2: 6%</strong> targets</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span><strong className="text-white/80">8% static max drawdown</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span>No time limit. No minimum trading days.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 w-full py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <p className="text-2xl text-white md:text-3xl">
              Need <span className="font-bold">more answers?</span> Our FAQ page
            </p>
            <p className="text-2xl text-white md:text-3xl">
              has got you covered
            </p>
          </div>

          <div className="divide-y divide-white/10">
            {GUIDELINES.map((item, index) => (
              <div key={index}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                  className="flex w-full items-center justify-between py-6 text-left"
                >
                  <span className="text-lg text-white/90 pr-4">{item.title}</span>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 transition-all duration-500 ease-out ${openAccordion === index ? "rotate-[135deg] border-emerald-500/50 bg-emerald-500/10" : "hover:border-white/50 hover:bg-white/5"}`}>
                    <svg className="h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ease-out ${
                    openAccordion === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pb-6">
                    <p className="text-base leading-relaxed text-white/60" dangerouslySetInnerHTML={{ __html: item.content }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/10 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-lg font-bold text-white">PROP INDIA</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/60 transition hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a href="mailto:support@propindia.com" className="text-white/60 transition hover:text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a href="#" className="text-white/60 transition hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Risk Disclaimer */}
          <div className="mt-8 border-t border-white/10 pt-8">
            <p className="text-center text-xs leading-relaxed text-white/40">
              <strong className="text-white/60">Risk Disclaimer:</strong> Prop India is a simulation-based proprietary trading program. 
              All trading activities are conducted on simulated accounts for skill assessment purposes only. 
              No real money is at risk during the evaluation phase. Past performance does not guarantee future results. 
              Trading involves significant risk of loss and is not suitable for all investors.
            </p>
            <p className="mt-4 text-center text-xs text-white/30">
              © 2024 Prop India. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
