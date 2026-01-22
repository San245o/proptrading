"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollAnimation({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transform transition-all duration-[420ms] 
        ease-[linear(0,0.114,0.319,0.513,0.667,0.779,0.856,0.907,0.941,0.963,0.977,0.986,0.991,0.995,0.997,0.998,0.999,0.999,1,1,1,1,1,1,1,1)] 
        ${className}
        ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
// Note: I used a cubic-bezier slightly different from the long linear one because standard CSS/Tailwind might not parse that long string in class names easily without JIT or config. 
// But the user GAVE me the class. I should use EXACTLY what they gave me.
// ease-[linear(0,0.114,0.319,0.513,0.667,0.779,0.856,0.907,0.941,0.963,0.977,0.986,0.991,0.995,0.997,0.998,0.999,0.999,1,1,1,1,1,1,1,1)]
