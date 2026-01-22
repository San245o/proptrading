"use client";

import Header from "@/components/layout/Header";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/layout/Footer";
import ChatBot from "@/components/chat/ChatBot";

export default function HomePage() {
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
      
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
      <ChatBot />
    </div>
  );
}
