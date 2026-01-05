'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import GoldStar from '@/components/GoldStar';
import BucketIcon from '@/components/BucketIcon';
import Confetti from '@/components/Confetti';
import { getUser, getCardsByDate, updateDailyCard, getGoals } from '@/lib/storage';
import { getTodayString, formatDisplayDate, formatDayOfWeek } from '@/lib/date-utils';
import { getWeeklyStats, hasMetWeeklyMinimum } from '@/lib/card-generator';
import { DailyCard, Goal } from '@/types';

export default function TodayPage() {
  const router = useRouter();
  const [cards, setCards] = useState<DailyCard[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({ totalStars: 0, minimumsMet: 0, totalMinimums: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
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
    const starsEarned = status === 'done' ? 1 : status === 'partial' ? 0.5 : 0;

    updateDailyCard(cardId, {
      status,
      starsEarned,
      completedAt: new Date().toISOString(),
    });

    // Trigger confetti for done or partial completion
    if (status === 'done' || status === 'partial') {
      setShowConfetti(true);
    }

    loadData();
  }

  function getGoalForCard(card: DailyCard): Goal | undefined {
    return goals.find(g => g.id === card.goalId);
  }

  const pendingCards = cards.filter(c => c.status === 'pending');
  const completedCards = cards.filter(c => c.status === 'done' || c.status === 'partial');

  const todayStars = cards.reduce((sum, card) => sum + card.starsEarned, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800">
        <div className="fade-in">
          <GoldStar size={80} animate />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800 pb-24">
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 fade-in">
          <h1 className="text-5xl font-bold text-stone-900 dark:text-stone-50 mb-2 tracking-tight">
            {formatDayOfWeek(getTodayString())}
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 font-light">
            {formatDisplayDate(getTodayString())}
          </p>
        </div>

        {/* Weekly Stats */}
        <div className="card p-8 mb-8 slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-50">
              This Week
            </h2>
            <span className="text-3xl opacity-50">📊</span>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="stat-card-amber">
              <GoldStar size={40} className="mb-3 mx-auto" />
              <div className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                {weeklyStats.totalStars}
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-400 font-medium">
                Total Stars
              </div>
            </div>

            <div className="stat-card-emerald">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {weeklyStats.minimumsMet}/{weeklyStats.totalMinimums}
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-400 font-medium">
                Goals Met
              </div>
            </div>
          </div>
        </div>

        {/* Today's Stars */}
        <div className="card p-8 mb-8 slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-50">
              Today
            </h2>
            <div className="flex items-center gap-3">
              <GoldStar size={48} animate={todayStars > 0} />
              <span className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                {todayStars}
              </span>
            </div>
          </div>
        </div>

        {/* Pending Cards */}
        {pendingCards.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-6 flex items-center gap-3">
              <span>Up Next</span>
              <span className="text-lg font-normal text-stone-500 dark:text-stone-500">
                {pendingCards.length} {pendingCards.length === 1 ? 'card' : 'cards'}
              </span>
            </h2>

            <div className="space-y-5">
              {pendingCards.map((card, index) => {
                const goal = getGoalForCard(card);
                const isBonus = goal && hasMetWeeklyMinimum(goal.id);

                return (
                  <div
                    key={card.id}
                    className="card p-8 slide-up card-hover"
                    style={{ animationDelay: `${0.15 + index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="mt-1">
                        {goal ? (
                          <BucketIcon bucketName={goal.bucket} size={48} className="text-amber-600 dark:text-amber-500" />
                        ) : (
                          <GoldStar size={48} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl text-stone-900 dark:text-stone-50 mb-2">
                          {card.title}
                        </h3>
                        {goal?.description && (
                          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                            {goal.description}
                          </p>
                        )}
                        {isBonus && (
                          <div className="inline-flex items-center gap-2 mt-3 badge-primary">
                            <GoldStar size={14} />
                            <span>Bonus - Weekly minimum met!</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleCardAction(card.id, 'done')}
                        className="btn-done"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span className="text-lg">✓</span>
                          <span>Done</span>
                        </span>
                      </button>
                      <button
                        onClick={() => handleCardAction(card.id, 'partial')}
                        className="btn-partial"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span className="text-lg">~</span>
                          <span>Partial</span>
                        </span>
                      </button>
                      <button
                        onClick={() => handleCardAction(card.id, 'skip')}
                        className="btn-skip"
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
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-6 flex items-center gap-3">
              <span>Completed</span>
              <span className="text-emerald-500 text-2xl">✓</span>
            </h2>

            <div className="space-y-3">
              {completedCards.map((card, index) => {
                const goal = getGoalForCard(card);
                return (
                  <div
                    key={card.id}
                    className="card p-6 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-900/10 dark:to-emerald-800/5 border-emerald-200/50 dark:border-emerald-800/30 slide-up"
                    style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="opacity-75">
                        {goal ? (
                          <BucketIcon bucketName={goal.bucket} size={40} className="text-stone-600 dark:text-stone-400" />
                        ) : (
                          <GoldStar size={40} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-stone-900 dark:text-stone-50 mb-1">
                          {card.title}
                        </div>
                        <div className="text-sm text-stone-600 dark:text-stone-400 flex items-center gap-2">
                          <GoldStar size={14} />
                          <span>{card.status === 'done' ? '1 star' : '0.5 stars'} earned</span>
                        </div>
                      </div>
                      <div>
                        {card.status === 'done' ? (
                          <GoldStar size={32} />
                        ) : (
                          <div className="opacity-50">
                            <GoldStar size={24} />
                          </div>
                        )}
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
          <div className="text-center py-20">
            <div className="mb-6">
              <GoldStar size={100} animate />
            </div>
            <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-50 mb-3">
              All done for today!
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-400">
              No cards scheduled. Check back tomorrow.
            </p>
          </div>
        )}

        {/* All done message */}
        {cards.length > 0 && pendingCards.length === 0 && (
          <div className="text-center py-20 fade-in">
            <div className="mb-6">
              <GoldStar size={120} animate />
            </div>
            <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-50 mb-3">
              You&apos;re all caught up!
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-400 mb-2">
              Great work today.
            </p>
            <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400">
              {todayStars} {todayStars === 1 ? 'star' : 'stars'} earned
            </p>
          </div>
        )}
      </div>

      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      <Navigation />
    </div>
  );
}
