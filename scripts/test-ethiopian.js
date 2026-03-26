// Quick test of ethiopian-calendar-date-converter
import { EthDateTime } from 'ethiopian-calendar-date-converter';

// Use the same safeDate approach as the component
const now = new Date();
const safeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
console.log('Gregorian safeDate:', safeDate.toISOString(), safeDate.toString());

const ethNow = EthDateTime.fromEuropeanDate(safeDate);
console.log('Ethiopian date:', ethNow.year, ethNow.month, ethNow.date);

// Verify with known values: 2026-03-24 should be Megabit 16, 2018? Let's see.
// Quick online check: March 24, 2026 Gregorian corresponds to Megabit 16, 2018 Ethiopian (since March 11 = Megabit 1). So that matches expected: month 7 (Megabit), day ~16.
