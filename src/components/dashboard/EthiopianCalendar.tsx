'use client';

import { cn } from '@/lib/utils';
import { useTheme, useThemeClasses } from '@/hooks/useTheme';
import { Calendar, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EthDateTime } from 'ethiopian-calendar-date-converter';

const ETHIOPIAN_MONTHS = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
  'Megabit', 'Miyazya', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
];

const ETHIOPIAN_HOLIDAYS: Record<string, string> = {
  '1-1': '🎆 Ethiopian New Year (Enkutatash)',
  '1-17': '✝️ Finding of True Cross (Meskel)',
  '4-21': '🕌 Eid al-Fitr',
  '4-27': '⚔️ Patriots Day',
  '5-1': '👷 International Workers Day',
  '7-15': '🎉 Fasika (Easter)',
  '10-1': '👶 Birthday of Prophet Muhammad',
  '12-29': '🎄 Christmas (Genna)',
  '13-1': '⛪ Timkat (Epiphany)',
  '13-5': '🎊 New Year Eve (Pagume)',
};

function getDaysInEthiopianMonth(year: number, month: number): number {
  if (month === 13) return year % 4 === 3 ? 6 : 5;
  return 30;
}

export function EthiopianCalendar() {
  const { isDark } = useTheme();
  const classes = useThemeClasses(isDark);
  const [now, setNow] = useState(new Date());
  const [viewMonth, setViewMonth] = useState<{ year: number; month: number } | null>(null);

  useEffect(() => {
    // Force a re-render to get current time properly on client side
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Use noon to avoid timezone shift issues across midnight
  const safeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
  const ethNow = EthDateTime.fromEuropeanDate(safeDate);
  const currentMonth = viewMonth || { year: ethNow.year, month: ethNow.month };
  const daysInMonth = getDaysInEthiopianMonth(currentMonth.year, currentMonth.month);

  // Get Gregorian date for the FIRST day of the Ethiopian month to find the weekday
  const firstEthDay = new EthDateTime(currentMonth.year, currentMonth.month, 1);
  const firstGreg = firstEthDay.toEuropeanDate();

  // Get day of week for first day (0=Mon, aligned with our header labels)
  // JS getDay(): 0=Sun, 1=Mon, ..., 6=Sat
  // Our grid: 0=Mon, 1=Tue, ..., 6=Sun
  const startDow = (firstGreg.getDay() + 6) % 7;

  // Build calendar grid
  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];
  
  // Pad the first week
  for (let i = 0; i < startDow; i++) {
    currentWeek.push(null);
  }
  
  // Fill in the days
  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  // Pad the last week
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push(null);
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const prevMonth = () => {
    const m = currentMonth.month - 1;
    if (m < 1) setViewMonth({ year: currentMonth.year - 1, month: 13 });
    else setViewMonth({ year: currentMonth.year, month: m });
  };
  
  const nextMonth = () => {
    const m = currentMonth.month + 1;
    if (m > 13) setViewMonth({ year: currentMonth.year + 1, month: 1 });
    else setViewMonth({ year: currentMonth.year, month: m });
  };
  
  const goToday = () => setViewMonth(null);

  const holidayKey = `${ethNow.month}-${ethNow.date}`;
  const todayHoliday = ETHIOPIAN_HOLIDAYS[holidayKey];

  return (
    <div className={cn("p-4", classes.card)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Ethiopian Calendar</span>
        </div>
        <button onClick={goToday} className={cn("text-[9px] px-2 py-1 rounded transition-colors", isDark ? "text-neutral-500 hover:text-neutral-300 bg-neutral-800" : "text-neutral-600 hover:text-neutral-900 bg-neutral-200")}>
          Today
        </button>
      </div>

      {/* Current date info */}
      <div className="text-center mb-3">
        <div className={cn("text-[18px] font-bold", classes.heading)}>
          {ETHIOPIAN_MONTHS[ethNow.month - 1]} {ethNow.date}, {ethNow.year}
        </div>
        <div className={cn("text-[10px] mt-0.5", classes.muted)}>
          {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        {todayHoliday && (
          <div className="mt-2 text-[11px] text-amber-500 bg-amber-500/10 rounded-md px-3 py-1.5 inline-block">
            {todayHoliday}
          </div>
        )}
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className={cn("p-1 rounded transition-colors cursor-pointer", isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-200")}>
          <ChevronLeft className={cn("w-4 h-4", classes.muted)} />
        </button>
        <span className={cn("text-[12px] font-semibold", isDark ? "text-neutral-300" : "text-neutral-700")}>
          {ETHIOPIAN_MONTHS[currentMonth.month - 1]} {currentMonth.year}
        </span>
        <button onClick={nextMonth} className={cn("p-1 rounded transition-colors cursor-pointer", isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-200")}>
          <ChevronRight className={cn("w-4 h-4", classes.muted)} />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px text-center">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className={cn("text-[9px] font-semibold py-1", classes.subtle)}>{d}</div>
        ))}
        {weeks.flat().map((day, i) => {
          const isToday = day === ethNow.date && currentMonth.month === ethNow.month && currentMonth.year === ethNow.year;
          const hk = `${currentMonth.month}-${day}`;
          const hasHoliday = day && ETHIOPIAN_HOLIDAYS[hk];
          
          return (
            <div key={i} className={cn(
              'text-[11px] py-1 rounded relative cursor-default transition-colors',
              day ? (isDark ? 'text-neutral-300 hover:bg-neutral-800/50' : 'text-neutral-700 hover:bg-neutral-200/50') : 'text-transparent',
              isToday && 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/30',
              hasHoliday && !isToday && 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
            )}>
              {day || '·'}
              {hasHoliday && <span className="absolute -top-0.5 -right-0.5 text-[6px]">🎉</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
