// Mini Chart Component for Dashboard Cards
export function MiniLineChart() {
  return (
    <svg viewBox="0 0 100 40" className="h-full w-full">
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M 0 35 Q 15 30, 25 25 T 50 20 T 75 12 T 100 8"
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
      />
      <path
        d="M 0 35 Q 15 30, 25 25 T 50 20 T 75 12 T 100 8 L 100 40 L 0 40 Z"
        fill="url(#chartGradient)"
      />
    </svg>
  );
}

// Mini Bar Chart Component
export function MiniBarChart() {
  const bars = [40, 65, 45, 80, 55, 90, 70];
  return (
    <div className="flex h-full items-end gap-1">
      {bars.map((height, i) => (
        <div 
          key={i}
          className="flex-1 rounded-t bg-emerald-500/80"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

// Donut Chart Component
export function DonutChart() {
  return (
    <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3" />
      <circle 
        cx="18" cy="18" r="15.9" fill="none" 
        stroke="#10b981" strokeWidth="3" 
        strokeDasharray="75 25"
      />
      <circle 
        cx="18" cy="18" r="15.9" fill="none" 
        stroke="#3b82f6" strokeWidth="3" 
        strokeDasharray="20 80"
        strokeDashoffset="-75"
      />
    </svg>
  );
}
