"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
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
    </>
  );
}
