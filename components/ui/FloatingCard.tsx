"use client";

import { useEffect, useState } from "react";

// Floating Card Component with staggered fade-in animation
export function FloatingCard({ 
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
      className={`transition-all duration-500 ease-[linear(0,0.045,0.15,0.284,0.425,0.557,0.674,0.772,0.85,0.909,0.953,0.983,1.003,1.015,1.021,1.023,1.022,1.02,1.017,1.014,1.01,1.008,1.005,1.004,1.002,1.001,1,1,1,1,0.999,0.999,1,1,1)] ${className} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transform: `rotate(${rotate})` }}
    >
      {children}
    </div>
  );
}
