'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_BUCKETS } from '@/lib/buckets';
import { getUser, saveUser, addGoal } from '@/lib/storage';
import { generateWeeklyCards } from '@/lib/card-generator';
import GoldStar from '@/components/GoldStar';

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
    date.setMonth(11);
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

    goals.forEach(goal => {
      addGoal({
        ...goal,
        status: 'active',
      });
    });

    const user = getUser();
    if (user) {
      saveUser({
        ...user,
        hasCompletedOnboarding: true,
        selectedBuckets,
      });
    }

    generateWeeklyCards();
    router.push('/today');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <div className="mb-8 flex justify-center">
            <GoldStar size={80} animate />
          </div>
          <h1 className="text-5xl font-bold text-stone-900 dark:text-stone-50 mb-4 tracking-tight">
            Welcome to Gold Star Man
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 font-light">
            Turn your yearly goals into daily wins
          </p>
        </div>

        {/* Step 1: Select Buckets */}
        {step === 1 && (
          <div className="slide-up">
            <div className="card p-10 mb-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-50 mb-3">
                  Pick your life buckets
                </h2>
                <p className="text-lg text-stone-600 dark:text-stone-400 font-light">
                  Choose the areas of life you want to focus on this year
                </p>
              </div>

              <div className="space-y-4">
                {DEFAULT_BUCKETS.map((bucket, index) => (
                  <button
                    key={bucket.name}
                    onClick={() => toggleBucket(bucket.name)}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left slide-up ${
                      selectedBuckets.includes(bucket.name)
                        ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 shadow-lg shadow-amber-500/10'
                        : 'border-stone-200/60 dark:border-stone-700/60 hover:border-amber-300 hover:shadow-md bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm'
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 text-4xl">
                        {bucket.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-lg text-stone-900 dark:text-stone-50 mb-1">
                          {bucket.displayName}
                        </div>
                        <div className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                          {bucket.description}
                        </div>
                      </div>
                      {selectedBuckets.includes(bucket.name) && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleBucketsNext}
              className="btn-primary w-full py-5 text-lg font-semibold"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Add Goals */}
        {step === 2 && (
          <div className="slide-up">
            <div className="card p-10 mb-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-50 mb-3">
                  Add your goals
                </h2>
                <p className="text-lg text-stone-600 dark:text-stone-400 font-light">
                  Start with 1-3 goals. You can add more anytime.
                </p>
              </div>

              {/* Added goals */}
              {goals.length > 0 && (
                <div className="mb-8 space-y-3">
                  {goals.map((goal, index) => (
                    <div
                      key={index}
                      className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 slide-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                          ✓
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg text-stone-900 dark:text-stone-50 mb-1">
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
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
                    Bucket
                  </label>
                  <select
                    value={currentGoal.bucket}
                    onChange={(e) => setCurrentGoal({ ...currentGoal, bucket: e.target.value })}
                    className="w-full p-4 text-base"
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
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    value={currentGoal.title}
                    onChange={(e) => setCurrentGoal({ ...currentGoal, title: e.target.value })}
                    placeholder="e.g., Write 500 words daily"
                    className="w-full p-4 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
                    Description (optional)
                  </label>
                  <textarea
                    value={currentGoal.description}
                    onChange={(e) => setCurrentGoal({ ...currentGoal, description: e.target.value })}
                    placeholder="What does success look like?"
                    rows={3}
                    className="w-full p-4 text-base resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
                    Weekly Minimum
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                      <button
                        key={num}
                        onClick={() => setCurrentGoal({ ...currentGoal, weeklyMinimum: num })}
                        className={`py-4 rounded-2xl border-2 font-bold text-lg transition-all duration-300 ${
                          currentGoal.weeklyMinimum === num
                            ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 text-amber-700 dark:text-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                            : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-amber-300 hover:scale-102 bg-white/50 dark:bg-stone-900/50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-stone-500 dark:text-stone-500 mt-3 font-light">
                    How many times per week do you want to work on this?
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={currentGoal.targetDate}
                    onChange={(e) => setCurrentGoal({ ...currentGoal, targetDate: e.target.value })}
                    className="w-full p-4 text-base"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleAddGoal}
                  className="btn-secondary flex-1 py-5 text-base font-semibold"
                >
                  + Add Another Goal
                </button>
                <button
                  onClick={handleFinish}
                  disabled={goals.length === 0}
                  className="btn-primary flex-1 py-5 text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Start Tracking →
                </button>
              </div>

              {goals.length === 0 && (
                <button
                  onClick={handleAddGoal}
                  className="btn-primary w-full py-5 mt-4 text-base font-semibold"
                >
                  Add First Goal
                </button>
              )}
            </div>

            <button
              onClick={() => setStep(1)}
              className="btn-ghost w-full py-4 text-base"
            >
              ← Back to Buckets
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
