'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_BUCKETS } from '@/lib/buckets';
import { getUser, saveUser, addGoal } from '@/lib/storage';
import { generateWeeklyCards } from '@/lib/card-generator';

interface GoalForm {
  bucket: string;
  title: string;
  description: string;
  weeklyMinimum: number;
  targetDate: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedBuckets, setSelectedBuckets] = useState<string[]>([]);
  const [goals, setGoals] = useState<GoalForm[]>([]);
  const [currentGoal, setCurrentGoal] = useState<GoalForm>({
    bucket: '',
    title: '',
    description: '',
    weeklyMinimum: 3,
    targetDate: getDefaultTargetDate(),
  });

  function getDefaultTargetDate(): string {
    const date = new Date();
    date.setMonth(11); // December
    date.setDate(31);
    return date.toISOString().split('T')[0];
  }

  function toggleBucket(bucketName: string) {
    if (selectedBuckets.includes(bucketName)) {
      setSelectedBuckets(selectedBuckets.filter(b => b !== bucketName));
    } else {
      setSelectedBuckets([...selectedBuckets, bucketName]);
    }
  }

  function handleBucketsNext() {
    if (selectedBuckets.length === 0) {
      alert('Please select at least one life bucket');
      return;
    }
    setCurrentGoal({ ...currentGoal, bucket: selectedBuckets[0] });
    setStep(2);
  }

  function handleAddGoal() {
    if (!currentGoal.title.trim()) {
      alert('Please enter a goal title');
      return;
    }

    setGoals([...goals, currentGoal]);

    // Reset form for next goal
    const nextBucket = selectedBuckets.find(b => !goals.map(g => g.bucket).includes(b)) || selectedBuckets[0];
    setCurrentGoal({
      bucket: nextBucket,
      title: '',
      description: '',
      weeklyMinimum: 3,
      targetDate: getDefaultTargetDate(),
    });
  }

  function handleFinish() {
    if (goals.length === 0) {
      alert('Please add at least one goal to get started');
      return;
    }

    // Save goals to storage
    goals.forEach(goal => {
      addGoal({
        ...goal,
        status: 'active',
      });
    });

    // Update user
    const user = getUser();
    if (user) {
      saveUser({
        ...user,
        hasCompletedOnboarding: true,
        selectedBuckets,
      });
    }

    // Generate initial weekly cards
    generateWeeklyCards();

    // Redirect to Today page
    router.push('/today');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-stone-900 dark:via-stone-800 dark:to-amber-900/20">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">⭐</div>
          <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            Welcome to Gold Star Man
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Turn your yearly goals into daily wins
          </p>
        </div>

        {/* Step 1: Select Buckets */}
        {step === 1 && (
          <div className="slide-up">
            <div className="card p-8 mb-6">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                Pick your life buckets
              </h2>
              <p className="text-stone-600 dark:text-stone-400 mb-6">
                Choose the areas of life you want to focus on this year
              </p>

              <div className="grid grid-cols-1 gap-3">
                {DEFAULT_BUCKETS.map(bucket => (
                  <button
                    key={bucket.name}
                    onClick={() => toggleBucket(bucket.name)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedBuckets.includes(bucket.name)
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-stone-200 dark:border-stone-700 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{bucket.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-stone-900 dark:text-stone-100">
                          {bucket.displayName}
                        </div>
                        <div className="text-sm text-stone-600 dark:text-stone-400">
                          {bucket.description}
                        </div>
                      </div>
                      {selectedBuckets.includes(bucket.name) && (
                        <div className="text-amber-500 text-xl">✓</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleBucketsNext}
              className="btn-primary w-full py-4 text-lg"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Add Goals */}
        {step === 2 && (
          <div className="slide-up">
            <div className="card p-8 mb-6">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
                Add your goals
              </h2>
              <p className="text-stone-600 dark:text-stone-400 mb-6">
                Start with 1-3 goals. You can add more anytime.
              </p>

              {/* Added goals */}
              {goals.length > 0 && (
                <div className="mb-6 space-y-2">
                  {goals.map((goal, index) => (
                    <div key={index} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">✓</span>
                        <div className="flex-1">
                          <div className="font-semibold text-stone-900 dark:text-stone-100">
                            {goal.title}
                          </div>
                          <div className="text-sm text-stone-600 dark:text-stone-400">
                            {goal.weeklyMinimum}x per week • {DEFAULT_BUCKETS.find(b => b.name === goal.bucket)?.displayName}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Goal form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Bucket
                  </label>
                  <select
                    value={currentGoal.bucket}
                    onChange={(e) => setCurrentGoal({ ...currentGoal, bucket: e.target.value })}
                    className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    {selectedBuckets.map(bucketName => {
                      const bucket = DEFAULT_BUCKETS.find(b => b.name === bucketName);
                      return (
                        <option key={bucketName} value={bucketName}>
                          {bucket?.icon} {bucket?.displayName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={currentGoal.title}
                    onChange={(e) => setCurrentGoal({ ...currentGoal, title: e.target.value })}
                    placeholder="e.g., Write 500 words daily"
                    className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={currentGoal.description}
                    onChange={(e) => setCurrentGoal({ ...currentGoal, description: e.target.value })}
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
                        onClick={() => setCurrentGoal({ ...currentGoal, weeklyMinimum: num })}
                        className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${
                          currentGoal.weeklyMinimum === num
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                            : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-amber-300'
                        }`}
                      >
                        {num}x
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-stone-500 dark:text-stone-500 mt-2">
                    How many times per week do you want to work on this?
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={currentGoal.targetDate}
                    onChange={(e) => setCurrentGoal({ ...currentGoal, targetDate: e.target.value })}
                    className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddGoal}
                  className="btn-secondary flex-1 py-4"
                >
                  + Add Another Goal
                </button>
                <button
                  onClick={handleFinish}
                  disabled={goals.length === 0}
                  className="btn-primary flex-1 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Tracking →
                </button>
              </div>

              {goals.length === 0 && (
                <button
                  onClick={handleAddGoal}
                  className="btn-primary w-full py-4 mt-3"
                >
                  Add First Goal
                </button>
              )}
            </div>

            <button
              onClick={() => setStep(1)}
              className="btn-ghost w-full py-3"
            >
              ← Back to Buckets
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
