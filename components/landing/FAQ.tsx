"use client";

import { useState } from "react";
import { GUIDELINES } from "@/app/data/faq";

export default function FAQ() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  return (
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
  );
}
