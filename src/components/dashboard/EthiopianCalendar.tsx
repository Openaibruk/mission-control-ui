'use client';

import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { Calendar, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const ETHIOPIAN_MONTHS = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
  'Miyazya', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
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

// Gregorian to Ethiopian conversion
function gregorianToEthiopian(date: Date): { year: number; month: number; day: number } {
  let julianday = Math.floor((date.getTime() - Date.UTC(1970, 0, 1)) / 86400000) + 2440588;
  const r = (julianday % 1461) < 366 ? ((julianday - 437) % 1460 % 365) : ((julianday - 438) % 1460 % 365) + 366;
  const ethYear = Math.floor((julianday - 1936837) / 365.25) + 5500;
  const ethMonth = Math.floor(r / 30) + 1;
  const ethDay = (r % 30) + 1;
  return { year: ethYear, month: ethMonth, day: ethDay };
}

// Ethiopian to Gregorian
function ethiopianToGregorian(year: number, month: number, day: number): Date {
  const julianday = ((year - 5500) * 365) + ((year - 5500) / 4) + ((month - 1) * 30) + day + 1936834;
  return new Date((julianday - 2440588) * 86400000);
}

function getDaysInEthiopianMonth(year: number, month: number): number {
  if (month === 13) return year % 4 === 3 ? 6 : 5;
  return 30;
}

export function EthiopianCalendar() {
  const [now, setNow] = useState(new Date());
  const [viewMonth, setViewMonth] = useState<{ year: number; month: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const eth = gregorianToEthiopian(now);
  const currentMonth = viewMonth || { year: eth.year, month: eth.month };
  const daysInMonth = getDaysInEthiopianMonth(currentMonth.year, currentMonth.month);

  // Get Gregorian dates for this Ethiopian month
  const firstGreg = ethiopianToGregorian(currentMonth.year, currentMonth.month, 1);
  const lastGreg = ethiopianToGregorian(currentMonth.year, currentMonth.month, daysInMonth);

  // Get day of week for first day (0=Sun)
  const startDow = firstGreg.getDay();

  // Build calendar grid
  const weeks: (number | null)[][] = [];
  let currentWeek: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) currentWeek.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  while (currentWeek.length > 0 && currentWeek.length < 7) currentWeek.push(null);
  if (currentWeek.length > 0) weeks.push(currentWeek);

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

  const holidayKey = `${eth.month}-${eth.day}`;
  const todayHoliday = ETHIOPIAN_HOLIDAYS[holidayKey];

  return (
    <div className="rounded-lg border border-neutral-800/50 bg-neutral-900/50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Ethiopian Calendar</span>
        </div>
        <button onClick={goToday} className="text-[9px] text-neutral-500 hover:text-neutral-300 px-2 py-1 rounded bg-neutral-800">
          Today
        </button>
      </div>

      {/* Current date */}
      <div className="text-center mb-3">
        <div className="text-[18px] font-bold text-white">
          {ETHIOPIAN_MONTHS[eth.month - 1]} {eth.day}, {eth.year}
        </div>
        <div className="text-[10px] text-neutral-500 mt-0.5">
          {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        {todayHoliday && (
          <div className="mt-2 text-[11px] text-amber-400 bg-amber-500/10 rounded-md px-3 py-1.5">
            {todayHoliday}
          </div>
        )}
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="p-1 hover:bg-neutral-800 rounded">
          <ChevronLeft className="w-4 h-4 text-neutral-400" />
        </button>
        <span className="text-[12px] font-semibold text-neutral-300">
          {ETHIOPIAN_MONTHS[currentMonth.month - 1]} {currentMonth.year}
        </span>
        <button onClick={nextMonth} className="p-1 hover:bg-neutral-800 rounded">
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px text-center">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className="text-[9px] text-neutral-600 font-semibold py-1">{d}</div>
        ))}
        {weeks.flat().map((day, i) => {
          const isToday = day === eth.day && currentMonth.month === eth.month && currentMonth.year === eth.year;
          const hk = `${currentMonth.month}-${day}`;
          const hasHoliday = day && ETHIOPIAN_HOLIDAYS[hk];
          return (
            <div key={i} className={cn(
              'text-[11px] py-1 rounded relative',
              day ? 'text-neutral-300' : 'text-transparent',
              isToday && 'bg-emerald-500/20 text-emerald-400 font-bold',
              hasHoliday && 'bg-amber-500/10 text-amber-400'
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
