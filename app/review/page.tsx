'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { getUser, addWeeklyReview, getWeeklyReview } from '@/lib/storage';
import { getWeekStart, getWeekEnd, formatDisplayDate } from '@/lib/date-utils';
import { getWeeklyStats } from '@/lib/card-generator';

export default function WeeklyReviewPage() {
  const router = useRouter();
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const [weekEnd, setWeekEnd] = useState(getWeekEnd());
  const [weeklyStats, setWeeklyStats] = useState({ totalStars: 0, minimumsMet: 0, totalMinimums: 0 });
  const [existingReview, setExistingReview] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [review, setReview] = useState({
    oneWin: '',
    oneMiss: '',
    nextPriorities: '',
  });

  useEffect(() => {
    const user = getUser();
    if (!user || !user.hasCompletedOnboarding) {
      router.push('/onboarding');
      return;
    }

    loadWeekData();
  }, [router]);

  function loadWeekData() {
    const stats = getWeeklyStats(weekStart);
    setWeeklyStats(stats);

    const existing = getWeeklyReview(weekStart);
    setExistingReview(existing);

    if (existing) {
      setReview({
        oneWin: existing.oneWin,
        oneMiss: existing.oneMiss,
        nextPriorities: existing.nextPriorities,
      });
    }

    setIsLoading(false);
  }

  function handleSubmit() {
    if (!review.oneWin.trim() || !review.oneMiss.trim() || !review.nextPriorities.trim()) {
      alert('Please fill in all fields');
      return;
    }

    addWeeklyReview({
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      oneWin: review.oneWin,
      oneMiss: review.oneMiss,
      nextPriorities: review.nextPriorities,
      starsEarned: weeklyStats.totalStars,
      minimumsMet: weeklyStats.minimumsMet,
      completedAt: new Date().toISOString(),
    });

    alert('Weekly review saved! 🎉');
    router.push('/today');
  }

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
          <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            Weekly Review
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            {formatDisplayDate(weekStart)} - {formatDisplayDate(weekEnd)}
          </p>
        </div>

        {/* Weekly Stats */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
            This Week&apos;s Performance
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {weeklyStats.totalStars}
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                Total Stars
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {weeklyStats.minimumsMet}/{weeklyStats.totalMinimums}
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                Goals Met
              </div>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-6">
            Reflect & Plan
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                🎉 One Win
              </label>
              <p className="text-xs text-stone-500 dark:text-stone-500 mb-2">
                What went well this week?
              </p>
              <textarea
                value={review.oneWin}
                onChange={(e) => setReview({ ...review, oneWin: e.target.value })}
                placeholder="e.g., Completed all my writing sessions and hit my weekly minimum"
                rows={3}
                className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                📉 One Miss
              </label>
              <p className="text-xs text-stone-500 dark:text-stone-500 mb-2">
                What didn&apos;t go as planned?
              </p>
              <textarea
                value={review.oneMiss}
                onChange={(e) => setReview({ ...review, oneMiss: e.target.value })}
                placeholder="e.g., Skipped my workouts because of travel"
                rows={3}
                className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                🎯 Next Week Priorities
              </label>
              <p className="text-xs text-stone-500 dark:text-stone-500 mb-2">
                What will you focus on next week?
              </p>
              <textarea
                value={review.nextPriorities}
                onChange={(e) => setReview({ ...review, nextPriorities: e.target.value })}
                placeholder="e.g., Get back on track with workouts, maintain writing streak"
                rows={3}
                className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="btn-primary w-full py-4 mt-6 text-lg"
          >
            {existingReview ? 'Update Review' : 'Complete Review'} →
          </button>
        </div>

        {existingReview && (
          <div className="text-center text-sm text-green-600 dark:text-green-400 mb-4">
            ✓ You&apos;ve already completed this week&apos;s review
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
