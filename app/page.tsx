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
      "Example: You purchase an account size of 50 Lakhs for your evaluation. You need to pass both Phase 1 and Phase 2 to receive your funded account."
  },
  {
    step: "02",
    title: "Get Funded",
    description:
      "Receive your funded trading account with the same account size as of your evaluation and trade Nifty, Bank Nifty & More.",
    example:
      "Example: After you pass both phases, you will now receive Rs.50 Lakhs funded account, on which you can start trading."
  },
  {
    step: "03",
    title: "Get Rewarded",
    description:
      "Keep upto 85% of your profits with lightning-fast payouts within 24 hours. Receive rewards via UPI or Crypto or Bank transfers.",
    example:
      "Example: Lets say you made 5% in month 1 on this funded account, which is Rs.2.5L of profit, you will get Rs 2.12 Lakhs as rewards. If you make losses, you are not liable to pay for them"
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
      smoothWheel: true,
      smoothTouch: false
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
          <nav className="glass-pill flex items-center gap-6 rounded-full px-6 py-3 text-sm text-white/80 shadow-glass">
            <a className="transition hover:text-white" href="#how-it-works">
              How it Works
            </a>
            <a className="transition hover:text-white" href="#payouts">
              Payouts
            </a>
            <a className="transition hover:text-white" href="#insights">
              Insights
            </a>
            <button className="rounded-full bg-white/20 px-4 py-2 text-white transition hover:bg-white/30">
              Launch
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 h-[400vh]">
        <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-6 lg:flex-row lg:items-center">
            {/* Left Content */}
            <div className="flex-1 space-y-8">
              <div>
                <div className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70">
                  Guided sequence trading
                </div>
                <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Own the tape with a
                  <span className="gradient-text"> prop firm</span>
                  <br />
                  that scales with you.
                </h1>
              </div>

              {/* Dynamic Text Point */}
              <div className="relative h-32">
                {POINTS.map((point, i) => (
                  <div
                    key={point.title}
                    className={`absolute left-0 top-0 w-full transition-all duration-700 ease-in-out ${
                      i === activeIndex
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    }`}
                  >
                    <h3 className="text-2xl font-bold text-white">
                      {point.title}
                    </h3>
                    <p className="mt-2 text-lg text-white/70">{point.body}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:bg-white/90">
                  Start evaluation
                </button>
                <button className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/60 hover:text-white">
                  View plans
                </button>
              </div>
            </div>

            {/* Right Content - Sequence */}
            <div className="flex flex-1 items-center justify-center lg:justify-end">
              <div className="-mt-12 w-full max-w-lg lg:mt-[-10vh]">
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
        className="relative z-10 mx-auto max-w-6xl px-6 py-32"
      >
        <h2 className="mb-24 text-center text-4xl font-bold text-white md:text-5xl">
          How it Works
        </h2>
        <div className="flex flex-col gap-8 pb-32">
          {STEPS.map((step, i) => (
            <div
              key={step.step}
              className="glass-pill sticky top-32 flex flex-col gap-8 rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl md:flex-row md:items-start md:p-12 shadow-glass"
              style={{
                top: `calc(120px + ${i * 20}px)`
              }}
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold text-emerald-400">
                {step.step}
              </div>
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                <p className="text-lg text-white/80">{step.description}</p>
                <div className="mt-4 rounded-xl bg-white/5 p-4 text-sm text-white/60">
                  {step.example}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="insights" className="relative z-10 mx-auto max-w-6xl px-6 pb-32">
        <div className="grid gap-6 rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-glass lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Institutional-grade flow
            </h3>
            <p className="mt-2 text-sm text-white/60">
              Top-of-book routing, latency alerts, and AI-backed execution
              reviews.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Quant playbooks
            </h3>
            <p className="mt-2 text-sm text-white/60">
              Pre-built playbooks for scalps, swings, and news-driven
              volatility.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Community floor
            </h3>
            <p className="mt-2 text-sm text-white/60">
              Private rooms, live trade reviews, and weekly office hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
