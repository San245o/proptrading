"use client";

import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}

export const Sparkline = ({ data, width = 50, height = 20, className = "" }: SparklineProps) => {
  if (data.length < 2) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  // Normalize data to fit in height
  const normalizedData = data.map(v => ((v - min) / range) * (height - 4) + 2);
  
  // Generate path
  const stepX = width / (data.length - 1);
  const pathData = normalizedData.map((y, i) => 
    `${i === 0 ? 'M' : 'L'} ${i * stepX} ${height - y}`
  ).join(' ');
  
  // Determine trend (up or down)
  const isUp = data[data.length - 1] >= data[0];
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      className={`sparkline ${className}`}
    >
      <path
        d={pathData}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isUp ? 'sparkline-up' : 'sparkline-down'}
      />
      {/* End dot */}
      <circle
        cx={(data.length - 1) * stepX}
        cy={height - normalizedData[normalizedData.length - 1]}
        r="2"
        className={isUp ? 'fill-emerald-500' : 'fill-red-500'}
      />
    </svg>
  );
};

// Generate mock sparkline data based on current value and trend
export const generateSparklineData = (currentValue: number, isPositive: boolean, points = 12): number[] => {
  const data: number[] = [];
  const volatility = Math.abs(currentValue) * 0.1 || 100;
  
  let value = currentValue - (isPositive ? volatility * 0.5 : -volatility * 0.5);
  
  for (let i = 0; i < points - 1; i++) {
    data.push(value);
    // Add some randomness but trend towards current value
    const trend = (currentValue - value) / (points - i);
    value += trend + (Math.random() - 0.5) * volatility * 0.3;
  }
  
  data.push(currentValue);
  return data;
};
