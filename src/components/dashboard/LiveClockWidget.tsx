'use client';

import { useState, useEffect, useMemo } from 'react';

const QUOTES = [
  '"The secret of getting ahead is getting started." — Mark Twain',
  '"Alone we can do so little; together we can do so much." — Helen Keller',
  '"It always seems impossible until it\'s done." — Nelson Mandela',
  '"Quality is not an act, it is a habit." — Aristotle',
  '"The best way to predict the future is to create it." — Peter Drucker',
  '"Coming together is a beginning, keeping together is progress, working together is success." — Henry Ford',
  '"Growth is never by mere chance; it is the result of forces working together." — James Cash Penney',
  '"Productivity is never an accident. It is always the result of commitment to excellence." — Paul J. Meyer',
  '"Talent wins games, but teamwork and intelligence win championships." — Michael Jordan',
  '"The only way to do great work is to love what you do." — Steve Jobs',
  '"In the middle of difficulty lies opportunity." — Albert Einstein',
  '"Great things in business are never done by one person. They\'re done by a team of people." — Steve Jobs',
  '"Focus on being productive instead of busy." — Tim Ferriss',
  '"The way to get started is to quit talking and begin doing." — Walt Disney',
  '"Strive for continuous improvement, instead of perfection." — Kim Collins',
  '"Individually, we are one drop. Together, we are an ocean." — Ryunosuke Satoro',
  '"Success is the sum of small efforts, repeated day in and day out." — Robert Collier',
  '"Don\'t watch the clock; do what it does. Keep going." — Sam Levenson',
  '"Every great dream begins with a dreamer. Always remember, you have within you the strength." — Harriet Tubman',
  '"The best time to plant a tree was 20 years ago. The second best time is now." — Chinese Proverb',
  '"Unity is strength... when there is teamwork and collaboration, wonderful things can be achieved." — Mattie Stepanek',
  '"Your most unhappy customers are your greatest source of learning." — Bill Gates',
  '"The function of leadership is to produce more leaders, not more followers." — Ralph Nader',
  '"Efficiency is doing things right; effectiveness is doing the right things." — Peter Drucker',
];

interface LiveClockWidgetProps {
  theme: 'dark' | 'light';
}

export function LiveClockWidget({ theme }: LiveClockWidgetProps) {
  const isDark = theme === 'dark';
  const [now, setNow] = useState<Date>(() => new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Clock: update every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Quote: rotate every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % QUOTES.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Formatted time & date in Addis Ababa (UTC+3)
  const timeStr = useMemo(
    () => now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Africa/Addis_Ababa' }),
    [now]
  );
  const dateStr = useMemo(
    () => now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Africa/Addis_Ababa' }),
    [now]
  );

  return (
    <div
      className={`rounded-xl p-4 border transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-[#111113] to-[#1c1c20] border-neutral-800'
          : 'bg-gradient-to-br from-white to-indigo-50 border-indigo-200'
      }`}
    >
      {/* Time */}
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-[10px] uppercase tracking-widest font-semibold ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
          🇪🇹 Addis Ababa
        </span>
        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
          LIVE
        </span>
      </div>
      <div className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
        {timeStr}
      </div>
      <div className={`text-[11px] mt-0.5 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
        {dateStr}
      </div>

      {/* Divider */}
      <div className={`border-t my-3 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`} />

      {/* Quote */}
      <div className="min-h-[56px] flex items-center">
        <p className={`text-[11px] leading-relaxed italic transition-opacity duration-500 ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
          {QUOTES[quoteIndex]}
        </p>
      </div>
    </div>
  );
}
