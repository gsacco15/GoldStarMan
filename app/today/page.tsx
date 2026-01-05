'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { getUser, getCardsByDate, updateDailyCard, getGoals } from '@/lib/storage';
import { getTodayString, formatDisplayDate, formatDayOfWeek } from '@/lib/date-utils';
import { getWeeklyStats, hasMetWeeklyMinimum } from '@/lib/card-generator';
import { DailyCard, Goal } from '@/types';
import { getBucketIcon } from '@/lib/buckets';

export default function TodayPage() {
  const router = useRouter();
  const [cards, setCards] = useState<DailyCard[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({ totalStars: 0, minimumsMet: 0, totalMinimums: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    const user = getUser();
    if (!user || !user.hasCompletedOnboarding) {
      router.push('/onboarding');
      return;
    }

    loadData();
  }, [router]);

  function loadData() {
    const today = getTodayString();
    const todaysCards = getCardsByDate(today);
    const allGoals = getGoals();
    const stats = getWeeklyStats();

    setCards(todaysCards);
    setGoals(allGoals);
    setWeeklyStats(stats);
    setIsLoading(false);
  }

  function handleCardAction(cardId: string, status: 'done' | 'partial' | 'skip') {
    // Calculate stars based on status
    const starsEarned = status === 'done' ? 1 : status === 'partial' ? 0.5 : 0;

    // Update card
    updateDailyCard(cardId, {
      status,
      starsEarned,
      completedAt: new Date().toISOString(),
    });

    // Reload data
    loadData();
  }

  function getGoalForCard(card: DailyCard): Goal | undefined {
    return goals.find(g => g.id === card.goalId);
  }

  const pendingCards = cards.filter(c => c.status === 'pending');
  const completedCards = cards.filter(c => c.status === 'done' || c.status === 'partial');
  const skippedCards = cards.filter(c => c.status === 'skip');

  const todayStars = cards.reduce((sum, card) => sum + card.starsEarned, 0);

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
          <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-100 mb-1">
            {formatDayOfWeek(getTodayString())}
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            {formatDisplayDate(getTodayString())}
          </p>
        </div>

        {/* Weekly Stats */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              This Week
            </h2>
            <div className="text-2xl">📊</div>
          </div>

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

        {/* Today's Stars */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              Today
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-3xl">⭐</span>
              <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {todayStars}
              </span>
            </div>
          </div>
        </div>

        {/* Pending Cards */}
        {pendingCards.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Up Next
            </h2>

            <div className="space-y-3">
              {pendingCards.map(card => {
                const goal = getGoalForCard(card);
                const isBonus = goal && hasMetWeeklyMinimum(goal.id);

                return (
                  <div key={card.id} className="card p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-3xl">
                        {goal ? getBucketIcon(goal.bucket) : '⭐'}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-stone-900 dark:text-stone-100">
                          {card.title}
                        </h3>
                        {goal?.description && (
                          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                            {goal.description}
                          </p>
                        )}
                        {isBonus && (
                          <div className="inline-block mt-2 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-lg">
                            ⭐ Bonus - Weekly minimum met!
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCardAction(card.id, 'done')}
                        className="flex-1 py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition-all active:scale-95"
                      >
                        ✓ Done
                      </button>
                      <button
                        onClick={() => handleCardAction(card.id, 'partial')}
                        className="flex-1 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all active:scale-95"
                      >
                        ~ Partial
                      </button>
                      <button
                        onClick={() => handleCardAction(card.id, 'skip')}
                        className="flex-1 py-4 rounded-xl bg-stone-300 hover:bg-stone-400 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-300 font-semibold transition-all active:scale-95"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Cards */}
        {completedCards.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
              <span>Completed</span>
              <span className="text-green-500">✓</span>
            </h2>

            <div className="space-y-2">
              {completedCards.map(card => {
                const goal = getGoalForCard(card);
                return (
                  <div
                    key={card.id}
                    className="card p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {goal ? getBucketIcon(goal.bucket) : '⭐'}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-stone-900 dark:text-stone-100">
                          {card.title}
                        </div>
                        <div className="text-sm text-stone-600 dark:text-stone-400">
                          {card.status === 'done' ? '1 star' : '0.5 stars'} earned
                        </div>
                      </div>
                      <div className="text-2xl">
                        {card.status === 'done' ? '⭐' : '✨'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No cards message */}
        {cards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              All done for today!
            </h2>
            <p className="text-stone-600 dark:text-stone-400">
              No cards scheduled. Check back tomorrow.
            </p>
          </div>
        )}

        {/* All done message */}
        {cards.length > 0 && pendingCards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 star-pop">⭐</div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              You&apos;re all caught up!
            </h2>
            <p className="text-stone-600 dark:text-stone-400">
              Great work today. You earned {todayStars} star{todayStars !== 1 ? 's' : ''}!
            </p>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
