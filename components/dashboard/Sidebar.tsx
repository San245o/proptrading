"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  DashboardIcon, 
  PlusIcon, 
  BriefcaseIcon, 
  UserIcon
} from './icons';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, isActive }: SidebarItemProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  
  const handleClick = () => {
    setIsClicked(true);
    setShowRipple(true);
    setTimeout(() => setIsClicked(false), 300);
    setTimeout(() => setShowRipple(false), 600);
  };

  return (
    <Link 
      href={href}
      onClick={handleClick}
      className={`
        relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group overflow-hidden
        ${isActive ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}
      `}
    >
      {/* Ripple Effect */}
      {showRipple && <div className="sidebar-ripple" />}
      
      <Icon className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${isClicked ? 'sidebar-icon-click' : ''}`} />
      
      {/* Tooltip / Popup Text */}
      <span className="
        absolute left-full ml-4 px-3 py-1.5 
        bg-[#1a1c22] border border-white/10 text-white text-sm rounded-lg font-medium
        opacity-0 translate-x-[-10px] pointer-events-none
        group-hover:opacity-100 group-hover:translate-x-0
        transition-all duration-200 z-50 whitespace-nowrap
        shadow-lg shadow-black/20
      ">
        {label}
      </span>
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: DashboardIcon, label: "Dashboard", href: "/dashboard" },
    { icon: PlusIcon, label: "New Challenge", href: "/dashboard/new-challenge" },
    { icon: BriefcaseIcon, label: "Accounts", href: "/dashboard/accounts" },
    { icon: UserIcon, label: "Profile", href: "/dashboard/profile" },
  ];

  return (
    <>
      {/* Sidebar Container - Hidden on mobile */}
      <aside className={`
        fixed top-0 left-0 h-screen w-20 
        bg-[#0f1013] border-r border-white/5
        hidden md:flex flex-col items-center py-8 z-40
        transition-transform duration-300
      `}>
        {/* Logo Placeholder - Hidden on mobile */}
        <div className="mb-12">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">
            P
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-6 w-full items-center">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        {/* Bottom Actions if needed */}
        <div className="mt-auto mb-4">
           {/* Maybe Settings or Logout */}
        </div>
      </aside>
      
      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0f1013]/95 backdrop-blur-lg border-t border-white/10 flex items-center justify-around px-4 z-50 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-300
                ${isActive 
                  ? 'text-emerald-400' 
                  : 'text-gray-500 hover:text-gray-300'
                }
              `}
            >
              <div className={`
                relative p-2 rounded-xl transition-all duration-300
                ${isActive ? 'bg-emerald-500/20' : ''}
              `}>
                <Icon className="w-5 h-5" />
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-emerald-500/20 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
