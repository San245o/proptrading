"use client";

import { STEPS } from "@/app/data/steps";

export default function HowItWorks() {
  return (
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
  );
}
