'use client';

import { useState } from 'react';
import { useTheme, useThemeClasses } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { OnboardingDashboard } from '@/components/onboarding/OnboardingDashboard';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { LayoutDashboard, Truck, ListTodo, Users, Bell, Activity, Settings, MessageSquare, AlertCircle, TrendingUp } from 'lucide-react';

// Custom nav items for the onboarding page (minimal version)
const ONBOARDING_NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'onboarding', label: 'Driver Onboarding', icon: Truck },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'agents', label: 'Agents', icon: Users },
  { id: 'approvals', label: 'Approvals', icon: AlertCircle },
];

export default function OnboardingPage() {
  const { theme, toggle, isDark } = useTheme();
  const classes = useThemeClasses(isDark);

  const [view, setView] = useState('onboarding');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // For this standalone page, we just show the onboarding view
  // In a full integration, this would connect to the main dashboard

  return (
    <div className={cn("flex h-screen font-sans", isDark ? 'bg-[#09090B] text-neutral-300' : 'bg-[#FAFAFA] text-neutral-700')}>
      {/* Minimal Sidebar */}
      <nav className={cn(
        "fixed md:relative z-50 md:z-auto w-[220px] shrink-0 flex flex-col h-screen transition-transform duration-300 -translate-x-full md:translate-x-0",
        isDark ? "bg-[#0a0e1a]" : "bg-white", "border-r", isDark ? "border-neutral-800" : "border-neutral-200", isSidebarOpen && "translate-x-0"
      )}>
        {/* Logo */}
        <div className={cn("h-14 flex items-center px-4 border-b shrink-0", isDark ? "border-neutral-800" : "border-neutral-200")}>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center text-white">
              <Truck className="w-3.5 h-3.5" />
            </div>
            <span className={cn("font-bold text-[13px]", isDark ? "text-white" : "text-neutral-900")}>Mission Ctrl</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto custom-scroll px-3 py-4 space-y-1">
          {ONBOARDING_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'dashboard') {
                    // Navigate to main dashboard
                    window.location.href = '/';
                  } else if (item.id !== 'onboarding') {
                    // Just set view for now (these would be separate pages)
                    setView(item.id);
                  } else {
                    setView(item.id);
                  }
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-md text-[12px] font-medium transition-all",
                  isActive
                    ? isDark ? "bg-violet-600/20 text-violet-300 border border-violet-500/30" : "bg-violet-100 text-violet-800"
                    : cn(isDark ? "text-neutral-400 hover:bg-white/5" : "text-neutral-500 hover:bg-neutral-100")
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Theme Toggle */}
        <div className={cn("px-3 py-3 border-t shrink-0", isDark ? "border-neutral-800" : "border-neutral-200")}>
          <button
            onClick={toggle}
            className={cn("w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-md text-[11px] font-medium transition-all", isDark ? "text-neutral-400 hover:bg-white/5" : "text-neutral-500 hover:bg-neutral-100")}
          >
            {isDark ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className={cn(
          "h-14 flex items-center justify-between px-4 border-b shrink-0",
          isDark ? "bg-[#0a0e1a] border-neutral-800" : "bg-white border-neutral-200"
        )}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={cn("p-2 rounded-md md:hidden", isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-100")}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className={cn("text-[15px] font-semibold", isDark ? "text-white" : "text-neutral-900")}>
              Driver Onboarding
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-[10px] px-2 py-1 rounded-full flex items-center gap-1", isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600")}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scroll">
          <OnboardingDashboard theme={theme} />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
