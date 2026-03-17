'use client';

import { cn, getThemeClasses } from '@/lib/utils';
import { Driver, getDriverStatusColor, getDriverStatusLabel } from '@/lib/onboarding';

interface DriverCardProps {
  driver: Driver;
  theme: 'dark' | 'light';
  onClick?: () => void;
}

export default function DriverCard({ driver, theme, onClick }: DriverCardProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border p-3 transition-colors",
        classes.card,
        isDark ? "hover:bg-neutral-800" : "hover:bg-white"
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className={cn("text-sm font-medium", classes.heading)}>{driver.name}</span>
        <span className={cn(
          "text-[9px] px-1.5 py-0.5 rounded-full text-white",
          getDriverStatusColor(driver.status)
        )}>
          {getDriverStatusLabel(driver.status)}
        </span>
      </div>
      {driver.vehicle_type && (
        <div className={cn("text-xs", classes.muted)}>{driver.vehicle_type} {driver.license_plate && `· ${driver.license_plate}`}</div>
      )}
      {driver.phone && (
        <div className={cn("text-xs", classes.muted)}>{driver.phone}</div>
      )}
    </button>
  );
}
