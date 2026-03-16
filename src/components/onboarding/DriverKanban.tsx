'use client';

import { Driver, ONBOARDING_STAGES, STAGE_LABELS, STAGE_COLORS, OnboardingStage } from '@/lib/onboarding';
import { DriverCard } from './DriverCard';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Plus } from 'lucide-react';

interface DriverKanbanProps {
  drivers: Driver[];
  onAdvance: (driver: Driver) => void;
  onAddClick: () => void;
  theme: 'dark' | 'light';
}

export function DriverKanban({ drivers, onAdvance, onAddClick, theme }: DriverKanbanProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);

  // Group drivers by stage
  const driversByStage = ONBOARDING_STAGES.reduce((acc, stage) => {
    acc[stage] = drivers.filter((d) => d.current_stage === stage);
    return acc;
  }, {} as Record<OnboardingStage, Driver[]>);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 custom-scroll">
      {ONBOARDING_STAGES.map((stage) => {
        const stageDrivers = driversByStage[stage];
        const colors = STAGE_COLORS[stage];
        const isActive = stage === 'active';

        return (
          <div
            key={stage}
            className={cn(
              "flex-shrink-0 w-[280px] md:w-[300px] flex flex-col rounded-lg",
              isDark ? "bg-[#111827]" : "bg-neutral-100"
            )}
          >
            {/* Column Header */}
            <div className={cn("p-3 border-b", isDark ? "border-neutral-800" : "border-neutral-200")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", colors.bg.replace('/10', '/80'), colors.text.replace('text-', 'bg-'))} />
                  <h3 className={cn("font-semibold text-[13px]", classes.heading)}>
                    {STAGE_LABELS[stage]}
                  </h3>
                  <span className={cn("text-[11px] px-1.5 py-0.5 rounded-full", colors.bg, colors.text)}>
                    {stageDrivers.length}
                  </span>
                </div>
                {stage === 'registration' && (
                  <button
                    onClick={onAddClick}
                    className={cn(
                      "p-1 rounded-md transition-colors",
                      isDark ? "hover:bg-neutral-700 text-neutral-400" : "hover:bg-neutral-200 text-neutral-600"
                    )}
                    title="Add Driver"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Column Content */}
            <div className="flex-1 p-2 space-y-2 overflow-y-auto custom-scroll max-h-[calc(100vh-280px)]">
              {stageDrivers.length === 0 ? (
                <div className={cn("text-center py-8 text-[12px]", classes.subtle)}>
                  No drivers in this stage
                </div>
              ) : (
                stageDrivers.map((driver) => (
                  <DriverCard
                    key={driver.id}
                    driver={driver}
                    onAdvance={onAdvance}
                    theme={theme}
                  />
                ))
              )}
            </div>

            {/* Add button at bottom for mobile */}
            {stage === 'registration' && (
              <div className="p-2 border-t md:hidden">
                <button
                  onClick={onAddClick}
                  className="w-full flex items-center justify-center gap-2 py-2 text-[12px] font-medium rounded-md bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Driver</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
