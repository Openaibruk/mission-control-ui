'use client';

import { useState, useEffect, useCallback } from 'react';
import { useThemeClasses } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Driver, fetchDrivers, addDriver, advanceStage, computeStats, OnboardingStats, ONBOARDING_STAGES, STAGE_LABELS } from '@/lib/onboarding';
import { DriverKanban } from './DriverKanban';
import { AddDriverModal } from './AddDriverModal';
import { Users, PlayCircle, CheckCircle2, BarChart2, Plus, RefreshCw } from 'lucide-react';

interface OnboardingDashboardProps {
  theme: 'dark' | 'light';
}

const statItems = [
  { key: 'total', label: 'Total', colorKey: 'total', icon: Users },
  { key: 'inProgress', label: 'In Progress', colorKey: 'active', icon: PlayCircle },
  { key: 'completed', label: 'Completed', colorKey: 'done', icon: CheckCircle2 },
  { key: 'completionRate', label: 'Completion Rate', colorKey: 'rate', icon: BarChart2, suffix: '%' },
];

function getStatColor(key: string): string {
  switch (key) {
    case 'total': return 'bg-emerald-500/10 text-emerald-500';
    case 'active': return 'bg-amber-500/10 text-amber-500';
    case 'done': return 'bg-violet-500/10 text-violet-500';
    case 'rate': return 'bg-blue-500/10 text-blue-500';
    default: return 'bg-neutral-500/10 text-neutral-500';
  }
}

function getStatBorderColor(key: string): string {
  switch (key) {
    case 'total': return 'border-emerald-500';
    case 'active': return 'border-amber-500';
    case 'done': return 'border-violet-500';
    case 'rate': return 'border-blue-500';
    default: return 'border-neutral-500';
  }
}

export function OnboardingDashboard({ theme }: OnboardingDashboardProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const stats = computeStats(drivers);

  const loadDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchDrivers();
    if (fetchError) {
      setError(fetchError.message || 'Failed to load drivers');
      setDrivers([]);
    } else {
      setDrivers(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDrivers();
  }, [loadDrivers]);

  const handleAddDriver = async (driver: { name: string; phone: string; email?: string }) => {
    const { data, error } = await addDriver(driver);
    if (!error && data) {
      setDrivers((prev) => [data, ...prev]);
      setIsAddModalOpen(false);
    } else if (error) {
      setError(error.message || 'Failed to add driver');
    }
  };

  const handleAdvance = async (driver: Driver) => {
    const { data, error } = await advanceStage(driver);
    if (!error && data) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === driver.id ? data : d))
      );
    } else if (error) {
      setError(error.message || 'Failed to advance stage');
    }
  };

  const getValue = (key: string): string => {
    if (key === 'completionRate') return `${stats.completionRate}%`;
    if (key === 'inProgress') return String(stats.inProgress);
    if (key === 'completed') return String(stats.completed);
    return String(stats.total);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col p-4 rounded-lg animate-pulse",
                classes.card
              )}
            >
              <div className={cn("h-3 w-16 rounded mb-3", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
              <div className={cn("h-8 w-20 rounded", isDark ? "bg-neutral-700" : "bg-neutral-200")} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          const color = getStatColor(item.colorKey);

          return (
            <div
              key={item.key}
              className={cn(
                "flex flex-col p-4 rounded-lg transition-all",
                classes.card,
                "border-l-4",
                getStatBorderColor(item.colorKey)
              )}
            >
              <div className={cn("text-[10px] uppercase font-semibold mb-2", color)}>
                {item.label}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-2xl md:text-3xl font-bold">
                  {getValue(item.key)}
                </div>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className={cn("p-4 rounded-lg text-[13px] flex items-center gap-2", isDark ? "bg-red-900/20 text-red-400" : "bg-red-100 text-red-600")}>
          <span>{error}</span>
          <button onClick={loadDrivers} className="ml-auto p-1 hover:opacity-70">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Table Status Message */}
      {drivers.length === 0 && !loading && !error && (
        <div className={cn("text-center py-12 text-[14px]", classes.subtle)}>
          <p className="mb-2">No drivers yet. Create the table first:</p>
          <code className={cn("text-[12px] px-3 py-2 rounded block text-left inline-block", isDark ? "bg-neutral-800" : "bg-neutral-200")}>
            supabase/migrations/001_driver_onboarding.sql
          </code>
        </div>
      )}

      {/* Kanban Board */}
      {drivers.length > 0 && (
        <DriverKanban
          drivers={drivers}
          onAdvance={handleAdvance}
          onAddClick={() => setIsAddModalOpen(true)}
          theme={theme}
        />
      )}

      {/* Add Driver Button (floating, for non-registration stages fallback) */}
      {drivers.length > 0 && (
        <div className="hidden md:block fixed bottom-6 right-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-lg transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Add Driver</span>
          </button>
        </div>
      )}

      {/* Add Driver Modal */}
      <AddDriverModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddDriver}
        theme={theme}
      />
    </div>
  );
}
