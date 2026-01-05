import { format, startOfWeek, endOfWeek, addDays, subDays, isToday, isPast, isFuture, differenceInDays, parseISO, startOfDay } from 'date-fns';

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
