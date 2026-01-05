'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { getUser, getGoals, addGoal, updateGoal, deleteGoal } from '@/lib/storage';
import { getDaysRemaining, formatDisplayDate } from '@/lib/date-utils';
import { generateCardsForGoal, hasMetWeeklyMinimum } from '@/lib/card-generator';
import { Goal } from '@/types';
import { DEFAULT_BUCKETS, getBucketIcon, getBucketDisplayName } from '@/lib/buckets';

export default function GoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newGoal, setNewGoal] = useState({
    bucket: 'work',
    title: '',
    description: '',
    weeklyMinimum: 3,
    targetDate: getDefaultTargetDate(),
  });

  function getDefaultTargetDate(): string {
    const date = new Date();
    date.setMonth(11);
    date.setDate(31);
    return date.toISOString().split('T')[0];
  }

  useEffect(() => {
    const user = getUser();
    if (!user || !user.hasCompletedOnboarding) {
      router.push('/onboarding');
      return;
    }

    loadGoals();
  }, [router]);

  function loadGoals() {
    const allGoals = getGoals();
    setGoals(allGoals);
    setIsLoading(false);
  }

  function handleAddGoal() {
    if (!newGoal.title.trim()) {
      alert('Please enter a goal title');
      return;
    }

    const goal = addGoal({
      ...newGoal,
      status: 'active',
    });

    // Generate cards for this new goal
    generateCardsForGoal(goal);

    // Reset form
    setNewGoal({
      bucket: 'work',
      title: '',
      description: '',
      weeklyMinimum: 3,
      targetDate: getDefaultTargetDate(),
    });

    setIsAddingGoal(false);
    loadGoals();
  }

  function handleToggleStatus(goalId: string, currentStatus: Goal['status']) {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    updateGoal(goalId, { status: newStatus });
    loadGoals();
  }

  function handleDeleteGoal(goalId: string) {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(goalId);
      loadGoals();
    }
  }

  const activeGoals = goals.filter(g => g.status === 'active');
  const pausedGoals = goals.filter(g => g.status === 'paused');
  const completedGoals = goals.filter(g => g.status === 'completed');

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
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-100">
            Goals
          </h1>
          <button
            onClick={() => setIsAddingGoal(true)}
            className="btn-primary px-6"
          >
            + Add Goal
          </button>
        </div>

        {/* Add Goal Form */}
        {isAddingGoal && (
          <div className="card p-6 mb-6 slide-up">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              New Goal
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Bucket
                </label>
                <select
                  value={newGoal.bucket}
                  onChange={(e) => setNewGoal({ ...newGoal, bucket: e.target.value })}
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  {DEFAULT_BUCKETS.map(bucket => (
                    <option key={bucket.name} value={bucket.name}>
                      {bucket.icon} {bucket.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="e.g., Write 500 words daily"
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="What does success look like?"
                  rows={2}
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Weekly Minimum
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <button
                      key={num}
                      onClick={() => setNewGoal({ ...newGoal, weeklyMinimum: num })}
                      className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${
                        newGoal.weeklyMinimum === num
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                          : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-amber-300'
                      }`}
                    >
                      {num}x
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsAddingGoal(false)}
                  className="btn-ghost flex-1 py-3"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGoal}
                  className="btn-primary flex-1 py-3"
                >
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Active Goals ({activeGoals.length})
            </h2>

            <div className="space-y-3">
              {activeGoals.map(goal => {
                const daysRemaining = getDaysRemaining(goal.targetDate);
                const isMetThisWeek = hasMetWeeklyMinimum(goal.id);

                return (
                  <div key={goal.id} className="card p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <span className="text-3xl">{getBucketIcon(goal.bucket)}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-stone-900 dark:text-stone-100">
                          {goal.title}
                        </h3>
                        {goal.description && (
                          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                            {goal.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs rounded-lg font-medium">
                            {getBucketDisplayName(goal.bucket)}
                          </span>
                          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs rounded-lg font-medium">
                            {goal.weeklyMinimum}x per week
                          </span>
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-lg font-medium">
                            {daysRemaining} days left
                          </span>
                          {isMetThisWeek && (
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-lg font-medium">
                              ✓ Week target met
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-500 dark:text-stone-500 mt-2">
                          Target: {formatDisplayDate(goal.targetDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleStatus(goal.id, goal.status)}
                        className="btn-secondary flex-1 py-2 text-sm"
                      >
                        Pause
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="btn-ghost py-2 px-4 text-sm text-red-600 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Paused Goals */}
        {pausedGoals.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Paused Goals ({pausedGoals.length})
            </h2>

            <div className="space-y-3">
              {pausedGoals.map(goal => (
                <div key={goal.id} className="card p-6 opacity-60">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-3xl">{getBucketIcon(goal.bucket)}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-stone-900 dark:text-stone-100">
                        {goal.title}
                      </h3>
                      {goal.description && (
                        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                          {goal.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(goal.id, goal.status)}
                      className="btn-primary flex-1 py-2 text-sm"
                    >
                      Resume
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="btn-ghost py-2 px-4 text-sm text-red-600 dark:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {goals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              No goals yet
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mb-6">
              Add your first goal to get started
            </p>
            <button
              onClick={() => setIsAddingGoal(true)}
              className="btn-primary px-8 py-3"
            >
              + Add Your First Goal
            </button>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}
