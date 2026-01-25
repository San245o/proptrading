"use client";

import React, { useState, useEffect, Children, cloneElement, isValidElement } from 'react';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number; // ms between each child
}

export default function StaggerContainer({ 
  children, 
  className = "",
  staggerDelay = 80 
}: StaggerContainerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay to ensure CSS is ready
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={className}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;
        
        return (
          <div
            key={index}
            className={`
              transition-all
              duration-[570ms]
              ease-[cubic-bezier(0.22,1,0.36,1)]
              ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-[0.98]'}
            `}
            style={{ 
              transitionDelay: mounted ? `${index * staggerDelay}ms` : '0ms'
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
