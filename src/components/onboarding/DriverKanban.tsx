'use client';

import { cn, getThemeClasses } from '@/lib/utils';
import { Driver, DriverStatus, DRIVER_STATUSES } from '@/lib/onboarding';
import DriverCard from './DriverCard';

interface DriverKanbanProps {
  drivers: Driver[];
  theme: 'dark' | 'light';
  onDriverClick?: (driver: Driver) => void;
}

export default function DriverKanban({ drivers, theme, onDriverClick }: DriverKanbanProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);

  const getColumnDrivers = (status: DriverStatus) => drivers.filter(d => d.status === status);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[50vh]">
      {DRIVER_STATUSES.filter(s => s.id !== 'rejected').map((col) => {
        const colDrivers = getColumnDrivers(col.id);
        return (
          <div key={col.id} className="min-w-[240px] w-[240px] shrink-0">
            <div className={cn(
              "flex items-center justify-between px-3 py-2 rounded-t-lg border-b",
              isDark ? "bg-neutral-900 border-neutral-800" : "bg-neutral-50 border-neutral-200"
            )}>
              <div className="flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", col.color)} />
                <span className={cn("text-xs font-semibold uppercase tracking-wide", classes.heading)}>{col.label}</span>
              </div>
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded", classes.badge)}>{colDrivers.length}</span>
            </div>
            <div className={cn(
              "space-y-2 p-2 rounded-b-lg",
              isDark ? "bg-neutral-900/50" : "bg-neutral-50/50"
            )}>
              {colDrivers.length === 0 ? (
                <p className={cn("text-xs text-center py-4", classes.muted)}>No drivers</p>
              ) : (
                colDrivers.map((driver) => (
                  <DriverCard
                    key={driver.id}
                    driver={driver}
                    theme={theme}
                    onClick={() => onDriverClick?.(driver)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
