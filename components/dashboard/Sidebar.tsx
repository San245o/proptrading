"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  DashboardIcon, 
  PlusIcon, 
  BriefcaseIcon, 
  UserIcon,
  MenuIcon,
  XIcon
} from './icons';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, isActive }: SidebarItemProps) => {
  return (
    <Link 
      href={href}
      className={`
        relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 group
        ${isActive ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}
      `}
    >
      <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
      
      {/* Tooltip / Popup Text */}
      <span className="
        absolute left-full ml-4 px-3 py-1.5 
        bg-[#1a1c22] border border-white/10 text-white text-sm rounded-lg 
        opacity-0 translate-x-[-10px] pointer-events-none
        group-hover:opacity-100 group-hover:translate-x-0
        transition-all duration-200 z-50 whitespace-nowrap
      ">
        {label}
      </span>
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: DashboardIcon, label: "Dashboard", href: "/dashboard" },
    { icon: PlusIcon, label: "New Challenge", href: "/dashboard/new-challenge" },
    { icon: BriefcaseIcon, label: "Accounts", href: "/dashboard/accounts" },
    { icon: UserIcon, label: "Profile", href: "/dashboard/profile" },
  ];

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-[#101114] border border-white/10 rounded-lg text-white"
        >
          {isOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-screen w-20 
        bg-[#0f1013] border-r border-white/5
        flex flex-col items-center py-8 z-40
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Placeholder */}
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
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
