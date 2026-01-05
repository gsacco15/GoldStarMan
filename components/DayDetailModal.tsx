'use client';

import { useEffect } from 'react';
import GoldStar from './GoldStar';
import BucketIcon from './BucketIcon';
import { DailyCard, Goal } from '@/types';
import { formatDisplayDate, formatDayOfWeek } from '@/lib/date-utils';

interface DayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  cards: DailyCard[];
  goals: Goal[];
}

export default function DayDetailModal({ isOpen, onClose, date, cards, goals }: DayDetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getGoalForCard = (card: DailyCard): Goal | undefined => {
    return goals.find(g => g.id === card.goalId);
  };

  const totalStars = cards.reduce((sum, card) => sum + card.starsEarned, 0);
  const doneCards = cards.filter(c => c.status === 'done');
  const partialCards = cards.filter(c => c.status === 'partial');
  const pendingCards = cards.filter(c => c.status === 'pending');
  const skippedCards = cards.filter(c => c.status === 'skip');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border-b border-amber-200/50 dark:border-amber-800/50 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-50 mb-1">
                {formatDayOfWeek(date)}
              </h2>
              <p className="text-stone-600 dark:text-stone-400">
                {formatDisplayDate(date)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6 text-stone-600 dark:text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stars earned */}
          <div className="flex items-center justify-center gap-3 p-4 bg-white/50 dark:bg-stone-900/50 rounded-2xl">
            <GoldStar size={40} animate={totalStars > 0} />
            <div>
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {totalStars}
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-400">
                {totalStars === 1 ? 'star' : 'stars'} earned
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          {cards.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4 opacity-50">📭</div>
              <p className="text-stone-600 dark:text-stone-400">
                No cards for this day
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Done Cards */}
              {doneCards.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    DONE ({doneCards.length})
                  </h3>
                  <div className="space-y-2">
                    {doneCards.map(card => {
                      const goal = getGoalForCard(card);
                      return (
                        <div key={card.id} className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200/30 dark:border-emerald-800/30">
                          {goal && <BucketIcon bucketName={goal.bucket} size={24} className="text-emerald-600 dark:text-emerald-400" />}
                          <div className="flex-1">
                            <div className="text-sm font-medium text-stone-900 dark:text-stone-50">
                              {card.title}
                            </div>
                          </div>
                          <GoldStar size={20} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Partial Cards */}
              {partialCards.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                    <span className="text-lg">~</span>
                    PARTIAL ({partialCards.length})
                  </h3>
                  <div className="space-y-2">
                    {partialCards.map(card => {
                      const goal = getGoalForCard(card);
                      return (
                        <div key={card.id} className="flex items-center gap-3 p-3 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl border border-amber-200/30 dark:border-amber-800/30">
                          {goal && <BucketIcon bucketName={goal.bucket} size={24} className="text-amber-600 dark:text-amber-400" />}
                          <div className="flex-1">
                            <div className="text-sm font-medium text-stone-900 dark:text-stone-50">
                              {card.title}
                            </div>
                          </div>
                          <div className="opacity-70">
                            <GoldStar size={16} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pending Cards */}
              {pendingCards.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                    <span className="text-lg">○</span>
                    PENDING ({pendingCards.length})
                  </h3>
                  <div className="space-y-2">
                    {pendingCards.map(card => {
                      const goal = getGoalForCard(card);
                      return (
                        <div key={card.id} className="flex items-center gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
                          {goal && <BucketIcon bucketName={goal.bucket} size={24} className="text-blue-600 dark:text-blue-400" />}
                          <div className="flex-1">
                            <div className="text-sm font-medium text-stone-900 dark:text-stone-50">
                              {card.title}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Skipped Cards */}
              {skippedCards.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-stone-500 dark:text-stone-500 mb-3 flex items-center gap-2">
                    <span className="text-lg">–</span>
                    SKIPPED ({skippedCards.length})
                  </h3>
                  <div className="space-y-2">
                    {skippedCards.map(card => {
                      const goal = getGoalForCard(card);
                      return (
                        <div key={card.id} className="flex items-center gap-3 p-3 bg-stone-50/50 dark:bg-stone-800/50 rounded-xl border border-stone-200/30 dark:border-stone-700/30 opacity-60">
                          {goal && <BucketIcon bucketName={goal.bucket} size={24} className="text-stone-600 dark:text-stone-400" />}
                          <div className="flex-1">
                            <div className="text-sm font-medium text-stone-900 dark:text-stone-50">
                              {card.title}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
