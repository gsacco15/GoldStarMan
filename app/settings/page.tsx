'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { getUser, saveUser, getGoals, getDailyCards, getWeeklyReviews } from '@/lib/storage';
import { DEFAULT_BUCKETS } from '@/lib/buckets';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedBuckets, setSelectedBuckets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || !currentUser.hasCompletedOnboarding) {
      router.push('/onboarding');
      return;
    }

    setUser(currentUser);
    setSelectedBuckets(currentUser.selectedBuckets || []);
    setIsLoading(false);
  }, [router]);

  function toggleBucket(bucketName: string) {
    if (selectedBuckets.includes(bucketName)) {
      setSelectedBuckets(selectedBuckets.filter(b => b !== bucketName));
    } else {
      setSelectedBuckets([...selectedBuckets, bucketName]);
    }
  }

  function handleSave() {
    if (selectedBuckets.length === 0) {
      alert('Please select at least one bucket');
      return;
    }

    if (user) {
      saveUser({
        ...user,
        selectedBuckets,
      });

      alert('Settings saved!');
    }
  }

  function handleResetData() {
    if (confirm('Are you sure? This will delete ALL your data including goals, cards, and reviews. This cannot be undone.')) {
      if (confirm('Really sure? This is permanent!')) {
        localStorage.clear();
        router.push('/');
      }
    }
  }

  function getStats() {
    const goals = getGoals();
    const cards = getDailyCards();
    const reviews = getWeeklyReviews();

    return {
      totalGoals: goals.length,
      totalCards: cards.length,
      totalReviews: reviews.length,
      totalStars: cards.reduce((sum, card) => sum + card.starsEarned, 0),
    };
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-pulse">⭐</div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-stone-900 dark:via-stone-800 dark:to-amber-900/20 pb-24">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-900 dark:text-stone-100">
            Settings
          </h1>
        </div>

        {/* Stats */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Your Stats
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {stats.totalStars}
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                Total Stars
              </div>
            </div>

            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalGoals}
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                Total Goals
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.totalCards}
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                Cards Tracked
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {stats.totalReviews}
              </div>
              <div className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                Weekly Reviews
              </div>
            </div>
          </div>
        </div>

        {/* Bucket Preferences */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
            Active Buckets
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
            Select which life buckets you want to focus on
          </p>

          <div className="space-y-2">
            {DEFAULT_BUCKETS.map(bucket => (
              <button
                key={bucket.name}
                onClick={() => toggleBucket(bucket.name)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedBuckets.includes(bucket.name)
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                    : 'border-stone-200 dark:border-stone-700 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{bucket.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-stone-900 dark:text-stone-100">
                      {bucket.displayName}
                    </div>
                  </div>
                  {selectedBuckets.includes(bucket.name) && (
                    <div className="text-amber-500 text-xl">✓</div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="btn-primary w-full py-3 mt-4"
          >
            Save Changes
          </button>
        </div>

        {/* About */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
            About Gold Star Man
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Version 1.0.0 - MVP
          </p>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
            A simple goal setting and daily tracking app focused on yearly goals and weekly consistency.
          </p>
        </div>

        {/* Danger Zone */}
        <div className="card p-6 border-2 border-red-200 dark:border-red-900">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
            Danger Zone
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
            This action cannot be undone
          </p>

          <button
            onClick={handleResetData}
            className="btn bg-red-500 hover:bg-red-600 text-white w-full py-3"
          >
            Reset All Data
          </button>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
