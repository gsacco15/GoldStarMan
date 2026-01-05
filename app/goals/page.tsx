'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import BucketIcon from '@/components/BucketIcon';
import Modal from '@/components/Modal';
import { getUser, getGoals, addGoal, updateGoal, deleteGoal } from '@/lib/storage';
import { getDaysRemaining, formatDisplayDate, getQuarterEnd, getNextQuarterEnd, getYearEnd } from '@/lib/date-utils';
import { generateCardsForGoal, hasMetWeeklyMinimum } from '@/lib/card-generator';
import { Goal } from '@/types';
import { DEFAULT_BUCKETS, getBucketDisplayName } from '@/lib/buckets';

export default function GoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [modal, setModal] = useState<{ isOpen: boolean; type: 'alert' | 'confirm' | 'success'; title: string; message: string; onConfirm?: () => void }>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: '',
  });

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
      setModal({
        isOpen: true,
        type: 'alert',
        title: 'Missing Information',
        message: 'Please enter a goal title to continue.',
      });
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
    setShowAdvanced(false);
    loadGoals();

    // Show success message
    setModal({
      isOpen: true,
      type: 'success',
      title: 'Goal Created!',
      message: `Your goal "${goal.title}" has been added successfully.`,
    });
  }

  function handleDurationChange(durationType: string) {
    let newTargetDate = '';
    switch (durationType) {
      case 'this-quarter':
        newTargetDate = getQuarterEnd();
        break;
      case 'next-quarter':
        newTargetDate = getNextQuarterEnd();
        break;
      case 'this-year':
        newTargetDate = getYearEnd();
        break;
      case 'ongoing':
        // Set to 10 years in the future
        const future = new Date();
        future.setFullYear(future.getFullYear() + 10);
        newTargetDate = future.toISOString().split('T')[0];
        break;
      default:
        newTargetDate = newGoal.targetDate;
    }
    setNewGoal({ ...newGoal, targetDate: newTargetDate });
  }

  function handleToggleStatus(goalId: string, currentStatus: Goal['status']) {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    updateGoal(goalId, { status: newStatus });
    loadGoals();
  }

  function handleDeleteGoal(goalId: string) {
    setModal({
      isOpen: true,
      type: 'confirm',
      title: 'Delete Goal',
      message: 'Are you sure you want to delete this goal? This action cannot be undone.',
      onConfirm: () => {
        deleteGoal(goalId);
        loadGoals();
      },
    });
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
                <div className="relative">
                  <select
                    value={newGoal.bucket}
                    onChange={(e) => setNewGoal({ ...newGoal, bucket: e.target.value })}
                    className="w-full p-3 pl-12 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    {DEFAULT_BUCKETS.map(bucket => (
                      <option key={bucket.name} value={bucket.name}>
                        {bucket.displayName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <BucketIcon bucketName={newGoal.bucket} size={24} className="text-amber-600 dark:text-amber-500" />
                  </div>
                </div>
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                    Target Date
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                  >
                    {showAdvanced ? 'Hide' : 'Advanced'} ▾
                  </button>
                </div>

                {showAdvanced && (
                  <div className="mb-4 p-4 bg-stone-50/50 dark:bg-stone-900/50 rounded-xl border border-stone-200/50 dark:border-stone-800/50 slide-up">
                    <p className="text-xs font-semibold text-stone-600 dark:text-stone-400 mb-3">
                      GOAL DURATION
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleDurationChange('this-quarter')}
                        className="px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-left"
                      >
                        This quarter
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDurationChange('next-quarter')}
                        className="px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-left"
                      >
                        Next quarter
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDurationChange('this-year')}
                        className="px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-left"
                      >
                        This year
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDurationChange('ongoing')}
                        className="px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-left"
                      >
                        Ongoing
                      </button>
                    </div>
                  </div>
                )}

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

                // Calculate progress percentage
                const goalStart = new Date(goal.id.split('-')[0]); // Rough estimate from ID timestamp
                const goalEnd = new Date(goal.targetDate);
                const today = new Date();
                const totalDays = Math.max(1, Math.ceil((goalEnd.getTime() - goalStart.getTime()) / (1000 * 60 * 60 * 24)));
                const daysElapsed = Math.max(0, Math.ceil((today.getTime() - goalStart.getTime()) / (1000 * 60 * 60 * 24)));
                const progressPercentage = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));

                return (
                  <div key={goal.id} className="card p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <BucketIcon bucketName={goal.bucket} size={40} className="text-amber-600 dark:text-amber-500 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-stone-900 dark:text-stone-100">
                          {goal.title}
                        </h3>
                        {goal.description && (
                          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                            {goal.description}
                          </p>
                        )}

                        {/* Progress bar */}
                        <div className="mt-4 mb-3">
                          <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 mb-2">
                            <span>Progress to target date</span>
                            <span className="font-semibold">{Math.round(progressPercentage)}%</span>
                          </div>
                          <div className="h-2 bg-stone-200/60 dark:bg-stone-800/60 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>

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
                    <BucketIcon bucketName={goal.bucket} size={40} className="text-stone-600 dark:text-stone-400 mt-1" />
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

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      <Navigation />
    </div>
  );
}
