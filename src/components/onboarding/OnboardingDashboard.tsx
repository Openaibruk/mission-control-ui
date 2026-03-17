'use client';

import { useState } from 'react';
import { cn, getThemeClasses } from '@/lib/utils';
import { Driver } from '@/lib/onboarding';
import { Plus } from 'lucide-react';
import DriverKanban from './DriverKanban';
import AddDriverModal from './AddDriverModal';

interface OnboardingDashboardProps {
  theme: 'dark' | 'light';
}

export default function OnboardingDashboard({ theme }: OnboardingDashboardProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  const handleAddDriver = (driverData: Omit<Driver, 'id' | 'created_at' | 'updated_at'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setDrivers(prev => [...prev, newDriver]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className={cn("text-lg font-semibold", classes.heading)}>Driver Onboarding</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Driver
        </button>
      </div>

      {drivers.length === 0 ? (
        <div className={cn("rounded-xl border p-8 text-center", classes.card)}>
          <p className={cn("text-sm", classes.muted)}>No drivers in the pipeline. Add your first driver to get started.</p>
        </div>
      ) : (
        <DriverKanban drivers={drivers} theme={theme} />
      )}

      <AddDriverModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAddDriver}
        theme={theme}
      />
    </div>
  );
}
