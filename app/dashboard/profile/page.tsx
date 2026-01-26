"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CalendarIcon, TargetIcon } from '@/components/dashboard/icons';
import { FancyButton, WalletIconButton } from '@/components/dashboard/FancyButton';

// Local CheckIcon since it's not exported from the icons module
const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

// --- Stagger Animation Hook ---
function useStaggerMount(itemCount: number, baseDelay = 60) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false));
  
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    for (let i = 0; i < itemCount; i++) {
      timers.push(setTimeout(() => {
        setVisibleItems(prev => { const next = [...prev]; next[i] = true; return next; });
      }, i * baseDelay));
    }
    return () => timers.forEach(clearTimeout);
  }, [itemCount, baseDelay]);
  
  return visibleItems;
}

const FadeInItem = ({ visible, children, className = "" }: { visible: boolean; children: React.ReactNode; className?: string }) => (
  <div className={`transition-all duration-[570ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'} ${className}`}>
    {children}
  </div>
);

// --- Mock User Data ---
const USER_DATA = {
  name: "Prajwal Mohan",
  email: "8prajwal.mohan8@gmail.com",
  phone: "+91 98765 43210",
  country: "India",
  joinedDate: "January 15, 2025",
  kycStatus: "verified",
  tradingExperience: "2-5 years",
  preferredPlatform: "MetaTrader 5",
};

const ACCOUNT_STATS = {
  totalChallenges: 3,
  passedChallenges: 2,
  activeChallenges: 1,
  totalPayout: 45000,
  pendingPayout: 12500,
};

const PAYOUT_HISTORY = [
  { id: 1, date: "Jan 20, 2025", amount: 25000, status: "completed", method: "Bank Transfer" },
  { id: 2, date: "Jan 10, 2025", amount: 20000, status: "completed", method: "UPI" },
  { id: 3, date: "Jan 25, 2025", amount: 12500, status: "pending", method: "Bank Transfer" },
];

const CERTIFICATES = [
  { id: 1, title: "₹5,00,000 Challenge Passed", date: "Jan 8, 2025", type: "challenge" },
  { id: 2, title: "₹1,00,000 Challenge Passed", date: "Dec 20, 2024", type: "challenge" },
];

// --- Card Components ---
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 ${className}`}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />
    <div className="relative z-10 h-full">{children}</div>
  </div>
);

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-6 transition-all hover:bg-white/5 ${className}`}>
    {children}
  </div>
);

// --- Main Page ---
export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'payouts' | 'settings'>('profile');
  const visible = useStaggerMount(10, 60);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen text-white pb-12">
      {/* Dark Dot Matrix Background */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundColor: '#0a0a0a',
        backgroundImage: `radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px), radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)`,
        backgroundSize: '10px 10px',
      }} />

      <div className="relative z-10">
        {/* Header */}
        <FadeInItem visible={visible[0]}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <div className="flex gap-2">
              {(['profile', 'payouts', 'settings'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </FadeInItem>

        {activeTab === 'profile' && (
          <>
            {/* Profile Header Card */}
            <FadeInItem visible={visible[1]}>
              <Card className="mb-8">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-3xl font-bold text-white">
                      {USER_DATA.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {USER_DATA.kycStatus === 'verified' && (
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-[#0A0A0A]">
                        <CheckIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">{USER_DATA.name}</h2>
                      {USER_DATA.kycStatus === 'verified' && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          KYC Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 mb-3">{USER_DATA.email}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" /> Joined {USER_DATA.joinedDate}
                      </span>
                      <span>📍 {USER_DATA.country}</span>
                      <span>📊 {USER_DATA.tradingExperience} experience</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Link href="/dashboard/new-challenge">
                      <button className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
                        New Challenge
                      </button>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </Card>
            </FadeInItem>

            {/* Stats Grid */}
            <FadeInItem visible={visible[2]}>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {[
                  { label: "Total Challenges", value: ACCOUNT_STATS.totalChallenges, color: "text-white" },
                  { label: "Passed", value: ACCOUNT_STATS.passedChallenges, color: "text-emerald-400" },
                  { label: "Active", value: ACCOUNT_STATS.activeChallenges, color: "text-blue-400" },
                  { label: "Total Payout", value: `₹${ACCOUNT_STATS.totalPayout.toLocaleString()}`, color: "text-emerald-400" },
                  { label: "Pending", value: `₹${ACCOUNT_STATS.pendingPayout.toLocaleString()}`, color: "text-amber-400" },
                ].map((stat, i) => (
                  <GlassCard key={i} className="!p-4">
                    <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  </GlassCard>
                ))}
              </div>
            </FadeInItem>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <FadeInItem visible={visible[3]}>
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Full Name", value: USER_DATA.name },
                      { label: "Email Address", value: USER_DATA.email },
                      { label: "Phone Number", value: USER_DATA.phone },
                      { label: "Country", value: USER_DATA.country },
                      { label: "Trading Platform", value: USER_DATA.preferredPlatform },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                        <span className="text-gray-400 text-sm">{item.label}</span>
                        <span className="text-white font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-6 w-full py-2.5 rounded-lg border border-white/10 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                    Edit Information
                  </button>
                </Card>
              </FadeInItem>

              {/* Achievements & Certificates */}
              <FadeInItem visible={visible[4]}>
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Achievements & Certificates
                  </h3>
                  <div className="space-y-4">
                    {CERTIFICATES.map(cert => (
                      <div key={cert.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center">
                          <TargetIcon className="w-6 h-6 text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white">{cert.title}</div>
                          <div className="text-sm text-gray-500">{cert.date}</div>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg bg-white/5 text-xs font-medium text-gray-400 hover:bg-white/10 transition-colors">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              </FadeInItem>
            </div>
          </>
        )}

        {activeTab === 'payouts' && (
          <>
            {/* Payout Summary */}
            <FadeInItem visible={visible[1]}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <GlassCard className="bg-gradient-to-br from-emerald-900/30 to-transparent border-emerald-500/20">
                  <div className="text-sm text-gray-400 mb-1">Total Earned</div>
                  <div className="text-3xl font-bold text-emerald-400">₹{ACCOUNT_STATS.totalPayout.toLocaleString()}</div>
                </GlassCard>
                <GlassCard className="bg-gradient-to-br from-amber-900/30 to-transparent border-amber-500/20">
                  <div className="text-sm text-gray-400 mb-1">Pending Payout</div>
                  <div className="text-3xl font-bold text-amber-400">₹{ACCOUNT_STATS.pendingPayout.toLocaleString()}</div>
                </GlassCard>
                <GlassCard>
                  <div className="text-sm text-gray-400 mb-1">Next Payout Cycle</div>
                  <div className="text-3xl font-bold text-white">Feb 1, 2025</div>
                </GlassCard>
              </div>
            </FadeInItem>

            {/* Payout History */}
            <FadeInItem visible={visible[2]}>
              <Card>
                <h3 className="text-lg font-semibold text-white mb-6">Payout History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="pb-4 font-medium text-gray-400">Date</th>
                        <th className="pb-4 font-medium text-gray-400">Amount</th>
                        <th className="pb-4 font-medium text-gray-400">Method</th>
                        <th className="pb-4 font-medium text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PAYOUT_HISTORY.map(payout => (
                        <tr key={payout.id} className="border-b border-white/5">
                          <td className="py-4 text-gray-400">{payout.date}</td>
                          <td className="py-4 font-semibold text-white">₹{payout.amount.toLocaleString()}</td>
                          <td className="py-4 text-gray-400">{payout.method}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payout.status === 'completed' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </FadeInItem>

            {/* Request Payout */}
            <FadeInItem visible={visible[3]}>
              <Card className="mt-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">Request Payout</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Eligible traders may request payouts according to the payout cycle associated with their account. 
                      Payouts are subject to verification and compliance checks.
                    </p>
                    <FancyButton icon={<WalletIconButton />} variant="blue">
                      Request Payout
                    </FancyButton>
                  </div>
                </div>
              </Card>
            </FadeInItem>
          </>
        )}

        {activeTab === 'settings' && (
          <>
            {/* Account Settings */}
            <FadeInItem visible={visible[1]}>
              <Card className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Notifications</label>
                    <div className="space-y-3">
                      {[
                        { id: 'trade', label: 'Trade notifications', checked: true },
                        { id: 'payout', label: 'Payout updates', checked: true },
                        { id: 'news', label: 'News and announcements', checked: false },
                        { id: 'tips', label: 'Trading tips and insights', checked: false },
                      ].map(item => (
                        <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={item.checked}
                            className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50"
                          />
                          <span className="text-sm text-gray-300">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </FadeInItem>

            {/* Security */}
            <FadeInItem visible={visible[2]}>
              <Card className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-6">Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <div>
                      <div className="font-medium text-white">Password</div>
                      <div className="text-sm text-gray-500">Last changed 30 days ago</div>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-gray-400 hover:bg-white/5 transition-colors">
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/5">
                    <div>
                      <div className="font-medium text-white">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-500">Add an extra layer of security</div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 transition-colors">
                      Enable
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium text-white">Active Sessions</div>
                      <div className="text-sm text-gray-500">Manage your active sessions</div>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-gray-400 hover:bg-white/5 transition-colors">
                      View All
                    </button>
                  </div>
                </div>
              </Card>
            </FadeInItem>

            {/* Danger Zone */}
            <FadeInItem visible={visible[3]}>
              <Card className="border-red-500/20">
                <h3 className="text-lg font-semibold text-red-400 mb-6">Danger Zone</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Delete Account</div>
                    <div className="text-sm text-gray-500">Permanently delete your account and all data</div>
                  </div>
                  <button className="px-4 py-2 rounded-lg border border-red-500/30 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                    Delete Account
                  </button>
                </div>
              </Card>
            </FadeInItem>
          </>
        )}
      </div>
    </div>
  );
}
