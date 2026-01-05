'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import GoldStar from '@/components/GoldStar';
import DayDetailModal from '@/components/DayDetailModal';
import { getUser, getCardsByDateRange, getGoals } from '@/lib/storage';
import {
  getWeekStart,
  getWeekDates,
  getMonthStart,
  getMonthDates,
  addDaysToDate,
  subDaysFromDate,
  addMonthsToDate,
  subMonthsFromDate,
  formatShortDate,
  formatMonthYear,
  isTodayDate,
  formatDayOfWeek,
  isInMonth,
} from '@/lib/date-utils';
import { DailyCard, Goal } from '@/types';

type ViewMode = 'week' | 'month';

export default function CalendarPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart());
  const [currentMonthStart, setCurrentMonthStart] = useState(getMonthStart());
  const [dateCards, setDateCards] = useState<Map<string, DailyCard[]>>(new Map());
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser();
    if (!user || !user.hasCompletedOnboarding) {
      router.push('/onboarding');
      return;
    }

    loadData();
  }, [currentWeekStart, currentMonthStart, viewMode, router]);

  function loadData() {
    let dates: string[];

    if (viewMode === 'week') {
      dates = getWeekDates(currentWeekStart);
    } else {
      dates = getMonthDates(currentMonthStart);
    }

    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    const cards = getCardsByDateRange(startDate, endDate);
    const allGoals = getGoals();

    // Group cards by date
    const cardsByDate = new Map<string, DailyCard[]>();
    dates.forEach(date => {
      cardsByDate.set(date, cards.filter(c => c.date === date));
    });

    setDateCards(cardsByDate);
    setGoals(allGoals);
    setIsLoading(false);
  }

  function goToPreviousPeriod() {
    if (viewMode === 'week') {
      setCurrentWeekStart(subDaysFromDate(currentWeekStart, 7));
    } else {
      setCurrentMonthStart(subMonthsFromDate(currentMonthStart, 1));
    }
  }

  function goToNextPeriod() {
    if (viewMode === 'week') {
      setCurrentWeekStart(addDaysToDate(currentWeekStart, 7));
    } else {
      setCurrentMonthStart(addMonthsToDate(currentMonthStart, 1));
    }
  }

  function goToToday() {
    if (viewMode === 'week') {
      setCurrentWeekStart(getWeekStart());
    } else {
      setCurrentMonthStart(getMonthStart());
    }
  }

  function toggleViewMode() {
    const newMode = viewMode === 'week' ? 'month' : 'week';
    setViewMode(newMode);

    // Sync the current period
    if (newMode === 'month') {
      setCurrentMonthStart(getMonthStart(currentWeekStart));
    } else {
      setCurrentWeekStart(getWeekStart(currentMonthStart));
    }
  }

  function getStarsForDate(date: string): number {
    const cards = dateCards.get(date) || [];
    return cards.reduce((sum, card) => sum + card.starsEarned, 0);
  }

  function getCompletionStats(date: string) {
    const cards = dateCards.get(date) || [];
    const total = cards.length;
    const done = cards.filter(c => c.status === 'done').length;
    const partial = cards.filter(c => c.status === 'partial').length;
    const skip = cards.filter(c => c.status === 'skip').length;

    return { total, done, partial, skip, pending: total - done - partial - skip };
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800">
        <div className="fade-in">
          <GoldStar size={80} animate />
        </div>
      </div>
    );
  }

  const dates = viewMode === 'week' ? getWeekDates(currentWeekStart) : getMonthDates(currentMonthStart);
  const totalStars = dates.reduce((sum, date) => sum + getStarsForDate(date), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800 pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">
              Calendar
            </h1>

            {/* View Mode Toggle */}
            <div className="flex rounded-xl bg-stone-200/60 dark:bg-stone-800/60 p-1">
              <button
                onClick={() => viewMode !== 'week' && toggleViewMode()}
                className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === 'week'
                    ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 shadow-md'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => viewMode !== 'month' && toggleViewMode()}
                className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
                  viewMode === 'month'
                    ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 shadow-md'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Period Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={goToPreviousPeriod}
              className="btn-ghost p-3 text-xl"
            >
              ←
            </button>

            <div className="text-center flex-1">
              <div className="text-lg font-semibold text-stone-900 dark:text-stone-50">
                {viewMode === 'week'
                  ? `${formatShortDate(dates[0])} - ${formatShortDate(dates[6])}`
                  : formatMonthYear(currentMonthStart)
                }
              </div>
              <button
                onClick={goToToday}
                className="text-sm text-amber-600 dark:text-amber-400 hover:underline mt-1"
              >
                Go to Today
              </button>
            </div>

            <button
              onClick={goToNextPeriod}
              className="btn-ghost p-3 text-xl"
            >
              →
            </button>
          </div>
        </div>

        {/* Period Summary */}
        <div className="card p-6 mb-6 slide-up">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
              {viewMode === 'week' ? 'Week Total' : 'Month Total'}
            </h2>
            <div className="flex items-center gap-3">
              <GoldStar size={36} animate={totalStars > 0} />
              <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {totalStars}
              </span>
            </div>
          </div>
        </div>

        {/* Calendar Views */}
        {viewMode === 'week' ? (
          // Week View - List Layout
          <div className="space-y-3">
            {dates.map((date, index) => {
              const stars = getStarsForDate(date);
              const stats = getCompletionStats(date);
              const isToday = isTodayDate(date);

              return (
                <div
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`card p-6 slide-up cursor-pointer hover:shadow-xl transition-all ${
                    isToday
                      ? 'ring-2 ring-amber-500 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10'
                      : ''
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className={`font-semibold text-lg ${
                        isToday
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-stone-900 dark:text-stone-50'
                      }`}>
                        {formatDayOfWeek(date)}
                      </div>
                      <div className="text-sm text-stone-600 dark:text-stone-400">
                        {formatShortDate(date)}
                      </div>
                      {isToday && (
                        <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-lg">
                          Today
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <GoldStar size={32} />
                      <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                        {stars}
                      </span>
                    </div>
                  </div>

                  {/* Cards breakdown */}
                  {stats.total > 0 ? (
                    <div className="flex gap-2">
                      {stats.done > 0 && (
                        <div className="flex-1 text-center py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                          <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                            {stats.done} Done
                          </div>
                        </div>
                      )}
                      {stats.partial > 0 && (
                        <div className="flex-1 text-center py-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                          <div className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                            {stats.partial} Partial
                          </div>
                        </div>
                      )}
                      {stats.skip > 0 && (
                        <div className="flex-1 text-center py-2 bg-stone-100 dark:bg-stone-800 rounded-xl">
                          <div className="text-sm font-semibold text-stone-600 dark:text-stone-400">
                            {stats.skip} Skip
                          </div>
                        </div>
                      )}
                      {stats.pending > 0 && (
                        <div className="flex-1 text-center py-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                          <div className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                            {stats.pending} Pending
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-2 text-stone-400 dark:text-stone-600 text-sm">
                      No cards
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Month View - Grid Layout
          <div className="card p-6 slide-up">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-bold text-stone-600 dark:text-stone-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {dates.map(date => {
                const stars = getStarsForDate(date);
                const stats = getCompletionStats(date);
                const isToday = isTodayDate(date);
                const inCurrentMonth = isInMonth(date, currentMonthStart);
                const dayOfMonth = new Date(date).getDate();

                return (
                  <div
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square p-2 rounded-xl border-2 transition-all cursor-pointer hover:scale-105 ${
                      isToday
                        ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20'
                        : stats.total > 0
                        ? 'border-stone-200 dark:border-stone-700 bg-white/50 dark:bg-stone-900/50 hover:border-amber-300'
                        : 'border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30'
                    } ${!inCurrentMonth ? 'opacity-40' : ''}`}
                  >
                    <div className="flex flex-col h-full">
                      {/* Date number */}
                      <div className={`text-xs font-semibold mb-1 ${
                        isToday
                          ? 'text-amber-700 dark:text-amber-400'
                          : inCurrentMonth
                          ? 'text-stone-900 dark:text-stone-50'
                          : 'text-stone-500 dark:text-stone-600'
                      }`}>
                        {dayOfMonth}
                      </div>

                      {/* Stars */}
                      {stars > 0 && (
                        <div className="flex items-center justify-center gap-0.5 mb-1">
                          <GoldStar size={12} />
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                            {stars}
                          </span>
                        </div>
                      )}

                      {/* Status dots */}
                      {stats.total > 0 && (
                        <div className="flex gap-0.5 mt-auto flex-wrap">
                          {stats.done > 0 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" title={`${stats.done} done`} />
                          )}
                          {stats.partial > 0 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" title={`${stats.partial} partial`} />
                          )}
                          {stats.pending > 0 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" title={`${stats.pending} pending`} />
                          )}
                          {stats.skip > 0 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-stone-400" title={`${stats.skip} skip`} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-stone-200 dark:border-stone-700">
              <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Done</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Partial</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
                <div className="w-2 h-2 rounded-full bg-stone-400" />
                <span>Skip</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <DayDetailModal
        isOpen={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
        date={selectedDate || ''}
        cards={selectedDate ? (dateCards.get(selectedDate) || []) : []}
        goals={goals}
      />

      <Navigation />
    </div>
  );
}
