import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { SimulationProvider } from '@/app/context/SimulationContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SimulationProvider>
      <div className="relative min-h-screen w-full flex text-white overflow-x-hidden">
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

        <Sidebar />
        <main className="relative z-10 flex-1 transition-all duration-300 md:ml-20 p-4 md:p-8 pt-16 md:pt-8 min-w-0">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </SimulationProvider>
  );
}
