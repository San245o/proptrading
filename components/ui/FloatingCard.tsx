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
      className={`transition-all duration-700 ease-out ${className} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transform: `rotate(${rotate})` }}
    >
      {children}
    </div>
  );
}
