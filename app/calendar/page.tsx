'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { getUser, getCardsByDateRange } from '@/lib/storage';
import {
  getWeekStart,
  getWeekDates,
  addDaysToDate,
  subDaysFromDate,
  formatShortDate,
  isTodayDate,
  formatDayOfWeek,
} from '@/lib/date-utils';
import { DailyCard } from '@/types';

export default function CalendarPage() {
  const router = useRouter();
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart());
  const [weekCards, setWeekCards] = useState<Map<string, DailyCard[]>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user || !user.hasCompletedOnboarding) {
      router.push('/onboarding');
      return;
    }

    loadWeekData();
  }, [currentWeekStart, router]);

  function loadWeekData() {
    const weekDates = getWeekDates(currentWeekStart);
    const weekStart = weekDates[0];
    const weekEnd = weekDates[6];

    const cards = getCardsByDateRange(weekStart, weekEnd);

    // Group cards by date
    const cardsByDate = new Map<string, DailyCard[]>();
    weekDates.forEach(date => {
      cardsByDate.set(date, cards.filter(c => c.date === date));
    });

    setWeekCards(cardsByDate);
    setIsLoading(false);
  }

  function goToPreviousWeek() {
    setCurrentWeekStart(subDaysFromDate(currentWeekStart, 7));
  }

  function goToNextWeek() {
    setCurrentWeekStart(addDaysToDate(currentWeekStart, 7));
  }

  function goToToday() {
    setCurrentWeekStart(getWeekStart());
  }

  function getStarsForDate(date: string): number {
    const cards = weekCards.get(date) || [];
    return cards.reduce((sum, card) => sum + card.starsEarned, 0);
  }

  function getCompletionStats(date: string) {
    const cards = weekCards.get(date) || [];
    const total = cards.length;
    const done = cards.filter(c => c.status === 'done').length;
    const partial = cards.filter(c => c.status === 'partial').length;
    const skip = cards.filter(c => c.status === 'skip').length;

    return { total, done, partial, skip, pending: total - done - partial - skip };
  }

  const weekDates = getWeekDates(currentWeekStart);
  const totalWeekStars = weekDates.reduce((sum, date) => sum + getStarsForDate(date), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-pulse">⭐</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-stone-900 dark:via-stone-800 dark:to-amber-900/20 pb-24">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
            Calendar
          </h1>

          {/* Week Navigation */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={goToPreviousWeek}
              className="btn-ghost p-3 text-xl"
            >
              ←
            </button>

            <div className="text-center flex-1">
              <div className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                {formatShortDate(weekDates[0])} - {formatShortDate(weekDates[6])}
              </div>
              <button
                onClick={goToToday}
                className="text-sm text-amber-600 dark:text-amber-400 hover:underline mt-1"
              >
                Go to Today
              </button>
            </div>

            <button
              onClick={goToNextWeek}
              className="btn-ghost p-3 text-xl"
            >
              →
            </button>
          </div>
        </div>

        {/* Week Summary */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              Week Total
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-3xl">⭐</span>
              <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {totalWeekStars}
              </span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-3">
          {weekDates.map(date => {
            const stars = getStarsForDate(date);
            const stats = getCompletionStats(date);
            const isToday = isTodayDate(date);

            return (
              <div
                key={date}
                className={`card p-6 ${
                  isToday
                    ? 'ring-2 ring-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className={`font-semibold ${
                      isToday
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-stone-900 dark:text-stone-100'
                    }`}>
                      {formatDayOfWeek(date).substring(0, 3)}
                    </div>
                    <div className="text-sm text-stone-600 dark:text-stone-400">
                      {formatShortDate(date)}
                    </div>
                    {isToday && (
                      <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
                        Today
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-3xl">⭐</span>
                    <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                      {stars}
                    </span>
                  </div>
                </div>

                {/* Cards breakdown */}
                {stats.total > 0 ? (
                  <div className="flex gap-2">
                    {stats.done > 0 && (
                      <div className="flex-1 text-center py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <div className="text-sm font-semibold text-green-700 dark:text-green-400">
                          {stats.done} Done
                        </div>
                      </div>
                    )}
                    {stats.partial > 0 && (
                      <div className="flex-1 text-center py-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        <div className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                          {stats.partial} Partial
                        </div>
                      </div>
                    )}
                    {stats.skip > 0 && (
                      <div className="flex-1 text-center py-2 bg-stone-100 dark:bg-stone-800 rounded-lg">
                        <div className="text-sm font-semibold text-stone-600 dark:text-stone-400">
                          {stats.skip} Skip
                        </div>
                      </div>
                    )}
                    {stats.pending > 0 && (
                      <div className="flex-1 text-center py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
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
      </div>

      <Navigation />
    </div>
  );
}
