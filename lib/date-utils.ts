import { format, startOfWeek, endOfWeek, addDays, subDays, isToday, isPast, isFuture, differenceInDays, parseISO, startOfDay, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
}

export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMMM d, yyyy');
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d');
}

export function formatDayOfWeek(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'EEEE');
}

export function getTodayString(): string {
  return formatDate(new Date());
}

export function getWeekStart(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDate(startOfWeek(d, { weekStartsOn: 1 })); // Monday
}

export function getWeekEnd(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDate(endOfWeek(d, { weekStartsOn: 1 })); // Sunday
}

export function getWeekDates(weekStart: Date | string): string[] {
  const start = typeof weekStart === 'string' ? parseISO(weekStart) : weekStart;
  const dates: string[] = [];

  for (let i = 0; i < 7; i++) {
    dates.push(formatDate(addDays(start, i)));
  }

  return dates;
}

export function addDaysToDate(date: string, days: number): string {
  return formatDate(addDays(parseISO(date), days));
}

export function subDaysFromDate(date: string, days: number): string {
  return formatDate(subDays(parseISO(date), days));
}

export function isTodayDate(date: string): boolean {
  return isToday(parseISO(date));
}

export function isPastDate(date: string): boolean {
  const d = startOfDay(parseISO(date));
  const today = startOfDay(new Date());
  return isPast(d) && d.getTime() !== today.getTime();
}

export function isFutureDate(date: string): boolean {
  const d = startOfDay(parseISO(date));
  const today = startOfDay(new Date());
  return isFuture(d) && d.getTime() !== today.getTime();
}

export function getDaysRemaining(targetDate: string): number {
  const target = parseISO(targetDate);
  const today = new Date();
  return Math.max(0, differenceInDays(target, today));
}

export function getDaysUntil(targetDate: string): number {
  return differenceInDays(parseISO(targetDate), new Date());
}

// Month utilities
export function getMonthStart(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDate(startOfMonth(d));
}

export function getMonthEnd(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDate(endOfMonth(d));
}

export function getMonthDates(monthStart: Date | string): string[] {
  const start = typeof monthStart === 'string' ? parseISO(monthStart) : monthStart;
  const monthStartDate = startOfMonth(start);
  const monthEndDate = endOfMonth(start);

  // Get the first day of the calendar grid (may be from previous month)
  const calendarStart = startOfWeek(monthStartDate, { weekStartsOn: 0 }); // Sunday

  // Get the last day of the calendar grid (may be from next month)
  const calendarEnd = endOfWeek(monthEndDate, { weekStartsOn: 0 }); // Saturday

  const dates: string[] = [];
  let currentDate = calendarStart;

  while (currentDate <= calendarEnd) {
    dates.push(formatDate(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return dates;
}

export function addMonthsToDate(date: string, months: number): string {
  return formatDate(addMonths(parseISO(date), months));
}

export function subMonthsFromDate(date: string, months: number): string {
  return formatDate(subMonths(parseISO(date), months));
}

export function formatMonthYear(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMMM yyyy');
}

export function isInMonth(date: string, monthStart: string): boolean {
  const d = parseISO(date);
  const monthStartDate = parseISO(monthStart);
  const monthEndDate = endOfMonth(monthStartDate);
  return d >= startOfMonth(monthStartDate) && d <= monthEndDate;
}

// Quarter utilities
export function getQuarter(date: Date | string = new Date()): number {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const month = d.getMonth(); // 0-11
  return Math.floor(month / 3) + 1; // 1-4
}

export function getQuarterEnd(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const quarter = getQuarter(d);
  const year = d.getFullYear();

  // Q1: March 31, Q2: June 30, Q3: September 30, Q4: December 31
  const lastMonth = quarter * 3 - 1; // 2, 5, 8, 11 (March, June, Sept, Dec)
  const quarterEndDate = new Date(year, lastMonth + 1, 0); // Last day of the month

  return formatDate(quarterEndDate);
}

export function getNextQuarterEnd(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const quarter = getQuarter(d);
  const year = d.getFullYear();

  // Next quarter
  const nextQuarter = quarter === 4 ? 1 : quarter + 1;
  const nextYear = quarter === 4 ? year + 1 : year;

  const lastMonth = nextQuarter * 3 - 1;
  const quarterEndDate = new Date(nextYear, lastMonth + 1, 0);

  return formatDate(quarterEndDate);
}

export function getYearEnd(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const year = d.getFullYear();
  return formatDate(new Date(year, 11, 31)); // December 31
}
