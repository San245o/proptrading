"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";

const POINTS = [
  {
    title: "Instant challenge start",
    body: "Funded pathways from $10K to $300K with one-click reset."
  },
  {
    title: "Risk engine",
    body: "Dynamic drawdown, real-time limits, and smart leverage caps."
  },
  {
    title: "Weekly payouts",
    body: "Fast settlement with flexible scaling and elite trader perks."
  },
  {
    title: "Pro analytics",
    body: "Session heatmaps, edge scoring, and trade journaling built in."
  }
];

const STEPS = [
  {
    step: "01",
    title: "Pass the Evaluation",
    description:
      "Pick your account type and size. Hit the profit targets in both Phase 1 & Phase 2 while following all risk management rules.",
    example:
      "Example: You purchase an account size of 50 Lakhs for your evaluation. You need to pass both Phase 1 and Phase 2 to receive your funded account.",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2000&auto=format&fit=crop"
  },
  {
    step: "02",
    title: "Get Funded",
    description:
      "Receive your funded trading account with the same account size as of your evaluation and trade Nifty, Bank Nifty & More.",
    example:
      "Example: After you pass both phases, you will now receive Rs.50 Lakhs funded account, on which you can start trading.",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2000&auto=format&fit=crop"
  },
  {
    step: "03",
    title: "Get Rewarded",
    description:
      "Keep upto 85% of your profits with lightning-fast payouts within 24 hours. Receive rewards via UPI or Crypto or Bank transfers.",
    example:
      "Example: Lets say you made 5% in month 1 on this funded account, which is Rs.2.5L of profit, you will get Rs 2.12 Lakhs as rewards. If you make losses, you are not liable to pay for them",
    image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=2000&auto=format&fit=crop"
  }
];

const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0.00",
    period: "/month",
    description: "Great for trying out Finament and for tiny teams",
    button: "Start for Free",
    highlight: false,
    features: [
      "Account Aggregation",
      "Expense Tracking",
      "Budgeting Tools",
      "Transaction Insights",
      "Basic Security",
    ],
  },
  {
    name: "Professional",
    price: "$98.00",
    period: "/month",
    description: "Best for growing startups and growth companies",
    button: "Sign Up with Professional",
    highlight: true,
    tag: "Most Popular",
    features: [
      "Everything in Free",
      "Customizable Dashboards",
      "Advanced Budgeting",
      "Investment Tracking",
      "Enhanced Security",
    ],
  },
  {
    name: "Enterprise",
    price: "$160.00",
    period: "/month",
    description: "Best for large companies and teams requiring high security",
    button: "Sign Up with Enterprise",
    highlight: false,
    features: [
      "Financial Planning Tools",
      "Priority Support",
      "Premium Widgets",
      "Advanced Security",
      "Integration with 3rd-Party Services",
    ],
  },
];

const HIGHLIGHTS = [
  {
    title: "15% Performance Reward",
    description: "The only trading prop firm that offers a 15% performance reward from the Challenge Phase rewards.",
    icon: (
      <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    title: "No Time Limits",
    description: "HELIX puts traders in control, providing full trading freedom with no time limits to worry about.",
    icon: (
      <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Daily News Trading",
    description: "Make rewards quickly by utilizing big market movements when a high-impact news is announced.",
    icon: (
      <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    )
  },
  {
    title: "Competitive Spreads",
    description: "With spreads starting from 0.0 pips and a leverage of up to 1:100, unmatched trading experience.",
    icon: (
      <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: "Reset",
    description: "Reset your account to restart your trading journey, even if you've violated any rules.",
    icon: (
      <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  },
  {
    title: "Monthly Competition",
    description: "FundedNext hosts free monthly competitions where you can compete for exclusive rewards.",
    icon: (
      <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    )
  }
];

export default function HomePage() {
  const [progress, setProgress] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const frameCount = 40;
  const frameList = useMemo(
    () =>
      Array.from({ length: frameCount }, (_, index) => {
        const padded = String(index + 1).padStart(3, "0");
        return `ezgif-frame-${padded}.jpg`;
      }),
    []
  );

  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ({ scroll }) => {
      // Hero is 400vh -> ~4 * window.innerHeight
      const heroHeight = window.innerHeight * 4;
      // Clamp scroll to hero section
      const heroScroll = Math.min(scroll, heroHeight);
      const nextProgress =
        heroHeight === 0 ? 0 : Math.min(1, heroScroll / heroHeight);

      setProgress(nextProgress);
      const nextFrame = Math.min(
        frameCount - 1,
        Math.floor(nextProgress * (frameCount - 1))
      );
      setFrameIndex(nextFrame);
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    let loaded = 0;
    imagesRef.current = frameList.map((frame) => {
      const img = new Image();
      img.src = `/api/sequence/${frame}`;
      img.onload = () => {
        loaded += 1;
        if (loaded === frameCount) {
          setIsLoaded(true);
        }
      };
      return img;
    });
  }, [frameList]);

  // Determine active point index based on progress (0 to 1)
  // Divide progress into equal segments for the points
  const activeIndex = Math.min(
    POINTS.length - 1,
    Math.floor(progress * POINTS.length)
  );

  return (
    <div className="relative bg-ink">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/bg.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <header className="fixed top-6 z-50 flex w-full justify-center px-6">
        <div className="flex w-full max-w-6xl items-center justify-between">
          <div className="glass-pill flex items-center gap-2 rounded-full px-5 py-3 shadow-glass">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-semibold tracking-[0.3em] text-white/70">
              HELIX
            </span>
          </div>
          <nav className="glass-pill hidden items-center gap-6 rounded-full px-6 py-3 text-sm text-white/80 shadow-glass md:flex">
            <a className="transition hover:text-white" href="#how-it-works">
              How it Works
            </a>
            <a className="transition hover:text-white" href="#insights">
              Insights
            </a>
            <a className="transition hover:text-white" href="#pricing">
              Pricing
            </a>
            <a className="transition hover:text-white" href="#payouts">
              Payouts
            </a>
            <button className="rounded-full bg-white/20 px-4 py-2 text-white transition hover:bg-white/30">
              Launch
            </button>
          </nav>
          <button className="glass-pill rounded-full px-4 py-2 text-sm font-semibold text-white md:hidden">
            Launch
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 h-[400vh]">
        <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center gap-4 px-6 pt-20 lg:flex-row lg:items-center lg:gap-8 lg:pt-0">
            {/* Left Content */}
            <div className="flex-1 space-y-4 lg:space-y-6">
              <div>
                <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:mt-6 lg:text-7xl">
                  Skip the Wait.
                  <br />
                  Start Trading
                  <span className="gradient-text"> Live Capital.</span>
                </h1>
              </div>

              {/* Dynamic Text Point */}
              <div className="relative h-28 lg:h-32">
                {POINTS.map((point, i) => (
                  <div
                    key={point.title}
                    className={`absolute left-0 top-0 w-full transition-all duration-500 ${
                      i === activeIndex
                        ? "translate-y-0 opacity-100 blur-0"
                        : "translate-y-8 opacity-0 blur-sm"
                    }`}
                  >
                    <h3 className="text-2xl font-bold text-white lg:text-4xl">
                      {point.title}
                    </h3>
                    <p className="mt-2 text-lg text-white/80 lg:text-xl">
                      {point.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 lg:gap-4">
                <button className="group flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-ink transition-all duration-300 hover:bg-emerald-400 active:scale-95 lg:px-6 lg:py-3 lg:text-sm">
                  Start evaluation
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
                <button className="group flex items-center gap-2 rounded-xl border border-white/30 px-5 py-2.5 text-xs font-semibold text-white/80 transition-all duration-300 hover:border-white hover:bg-white/10 hover:text-white active:scale-95 lg:px-6 lg:py-3 lg:text-sm">
                  View plans
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Content - Sequence */}
            <div className="flex flex-1 items-center justify-center lg:justify-end">
              <div className="mt-0 w-full max-w-sm lg:mt-[-10vh] lg:max-w-lg">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    src={`/api/sequence/${frameList[frameIndex]}`}
                    alt="Trading sequence"
                    className={`h-full w-full object-cover transition-opacity duration-500 ${
                      isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className="relative z-10 w-full py-10 lg:py-20"
      >
        <h2 className="mb-10 text-center text-5xl font-bold tracking-tighter text-white md:text-7xl lg:mb-20">
          How it Works
        </h2>
        <div className="flex flex-col pb-12">
          {STEPS.map((step, i) => (
            <div
              key={step.step}
              className="sticky left-0 w-full border-t border-white/20 bg-black py-12 lg:py-16"
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
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-white/5 grayscale transition-all duration-500 hover:grayscale-0">
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

      {/* Insights Section - Bento Grid */}
      <section id="insights" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 lg:py-32">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold leading-tight text-white md:text-6xl">
            Engineered for top
            <br />
            <span className="gradient-text">performance.</span>
          </h2>
          <p className="mt-6 text-xl text-white/60">
            Helix provides the infrastructure you need to scale.
          </p>
        </div>

        <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-4">
          {/* Main Feature: 15% Reward */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-8 transition-all hover:bg-white/5 md:col-span-2 md:row-span-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Industry First
              </div>
              <h3 className="text-6xl font-black tracking-tighter text-white lg:text-8xl">
                15%
              </h3>
              <p className="mt-2 text-2xl font-bold text-white">
                Performance Reward
              </p>
            </div>
            <p className="mt-8 max-w-md text-lg text-white/60">
              The only prop firm that pays you 15% of profits generated during
              the challenge phase, straight to your wallet.
            </p>
            {/* Decoration */}
            <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px] transition-all group-hover:bg-emerald-500/20" />
          </div>

          {/* Feature: No Time Limits */}
          <div className="group relative flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-8 text-center transition-all hover:bg-white/5 md:col-span-1 md:row-span-1">
            <h3 className="text-3xl font-bold text-white">
              No Time
              <br />
              Limits
            </h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-white/40">
              Trade Freedom
            </p>
          </div>

          {/* Feature: News Trading */}
          <div className="group relative flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-8 text-center transition-all hover:bg-white/5 md:col-span-1 md:row-span-1">
            <svg
              className="mb-4 h-10 w-10 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <h3 className="text-xl font-bold text-white">News Trading</h3>
            <p className="mt-1 text-sm text-white/50">Allowed</p>
          </div>

          {/* Feature: Helix Specs (Centerpiece) */}
          <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] p-8 md:col-span-2 md:row-span-1">
            {/* Radial Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />
            
            <div className="relative z-10 flex flex-col items-center">
               <div className="mb-6 flex items-center gap-3">
                 <span className="text-5xl font-black tracking-tighter text-white">HELIX</span>
                 <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">Core</span>
               </div>
               
               <div className="grid w-full grid-cols-3 gap-4 border-t border-white/10 pt-6">
                 <div className="text-center">
                    <div className="text-xl font-bold text-white">0.0</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Spreads</div>
                 </div>
                 <div className="text-center border-l border-white/10">
                    <div className="text-xl font-bold text-white">30ms</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Latency</div>
                 </div>
                 <div className="text-center border-l border-white/10">
                    <div className="text-xl font-bold text-white">1:100</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Leverage</div>
                 </div>
               </div>
            </div>
          </div>

          {/* Feature: Reset */}
          <div className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 transition-all hover:bg-white/5 md:col-span-1 md:row-span-1">
            <div>
              <h3 className="text-lg font-bold text-white">Instant Reset</h3>
              <p className="mt-1 text-xs text-white/50">
                Violated rules? Start fresh instantly.
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-white/20">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Feature: Monthly Comp */}
          <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 text-center transition-all hover:bg-white/5 md:col-span-1 md:row-span-1">
             <div className="absolute inset-0 bg-blue-500/5 transition-opacity group-hover:opacity-20" />
             <h3 className="relative z-10 text-4xl font-black text-blue-400/20 group-hover:text-blue-400/40 transition-colors">
               COMP
             </h3>
             <p className="relative z-10 -mt-2 text-lg font-bold text-white">
               Monthly Events
             </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 w-full pb-32 pt-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Simple and Affordable Pricing Plans
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Start tracking and improving your finance management
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col rounded-2xl border p-8 transition-all hover:bg-white/10 ${
                  plan.highlight
                    ? "border-emerald-500/50 bg-gradient-to-b from-white/10 to-transparent shadow-2xl shadow-emerald-900/20"
                    : "border-white/10 bg-gradient-to-b from-white/10 to-transparent shadow-glass"
                }`}
              >
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <h3 className="hover-underline text-3xl font-bold text-white/90">
                      {plan.name}
                    </h3>
                    {plan.tag && (
                      <span className="rounded-full bg-white/20 px-3 py-1 text-xs text-white">
                        {plan.tag}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="ml-1 text-sm text-white/50">
                      {plan.period}
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-white/60">
                    {plan.description}
                  </p>
                </div>

                {/* Button */}
                <button
                  className={`mb-6 w-full rounded-lg py-3 text-sm font-semibold transition ${
                    plan.highlight
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:opacity-90"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {plan.button}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 pb-6 text-[10px] font-bold tracking-widest text-white/40">
                  <div className="h-px flex-1 bg-white/10"></div>
                  FEATURES
                  <div className="h-px flex-1 bg-white/10"></div>
                </div>

                {/* Features */}
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
