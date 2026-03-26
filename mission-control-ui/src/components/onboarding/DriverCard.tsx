'use client';

import { Driver, daysInCurrentStage, isStalled, STAGE_COLORS, OnboardingStage } from '@/lib/onboarding';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Phone, Mail, Clock, ChevronRight, AlertTriangle } from 'lucide-react';

interface DriverCardProps {
  driver: Driver;
  onAdvance: (driver: Driver) => void;
  theme: 'dark' | 'light';
}

export function DriverCard({ driver, onAdvance, theme }: DriverCardProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const days = daysInCurrentStage(driver);
  const stalled = isStalled(driver);
  const colors = STAGE_COLORS[driver.current_stage];
  const canAdvance = driver.current_stage !== 'active';

  return (
    <div
      className={cn(
        "p-3 rounded-lg border transition-all hover:scale-[1.01]",
        classes.card,
        stalled && "border-amber-500/50 bg-amber-500/5",
        !stalled && colors.bg
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className={cn("font-semibold text-[13px] truncate", classes.heading)}>
            {driver.name}
          </h4>
          <div className={cn("flex items-center gap-1 text-[11px] mt-1", classes.muted)}>
            <Phone className="w-3 h-3" />
            <span className="truncate">{driver.phone}</span>
          </div>
          {driver.email && (
            <div className={cn("flex items-center gap-1 text-[11px] mt-0.5", classes.muted)}>
              <Mail className="w-3 h-3" />
              <span className="truncate">{driver.email}</span>
            </div>
          )}
        </div>
        {stalled && (
          <div className="shrink-0 text-amber-500" title="Stalled (>3 days)">
            <AlertTriangle className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className={cn("flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-medium", colors.bg, colors.text)}>
          <Clock className="w-3 h-3" />
          <span>{days}d in stage</span>
        </div>
        {canAdvance && (
          <button
            onClick={() => onAdvance(driver)}
            className="flex items-center gap-0.5 px-2 py-1 text-[10px] font-medium rounded bg-violet-600 hover:bg-violet-700 text-white transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
