'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import BucketIcon from '@/components/BucketIcon';
import Modal from '@/components/Modal';
import { getUser, saveUser, getGoals, getDailyCards, getWeeklyReviews } from '@/lib/storage';
import { DEFAULT_BUCKETS } from '@/lib/buckets';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedBuckets, setSelectedBuckets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [modal, setModal] = useState<{ isOpen: boolean; type: 'alert' | 'confirm' | 'success'; title: string; message: string; onConfirm?: () => void; confirmText?: string; cancelText?: string }>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: '',
  });

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || !currentUser.hasCompletedOnboarding) {
      router.push('/onboarding');
      return;
    }

    setUser(currentUser);
    setSelectedBuckets(currentUser.selectedBuckets || []);

    // Check for saved dark mode preference or system preference
    const savedDarkMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedDarkMode === 'true' || (savedDarkMode === null && prefersDark);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }

    setIsLoading(false);
  }, [router]);

  function toggleDarkMode() {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function toggleBucket(bucketName: string) {
    if (selectedBuckets.includes(bucketName)) {
      setSelectedBuckets(selectedBuckets.filter(b => b !== bucketName));
    } else {
      setSelectedBuckets([...selectedBuckets, bucketName]);
    }
  }

  function handleSave() {
    if (selectedBuckets.length === 0) {
      setModal({
        isOpen: true,
        type: 'alert',
        title: 'Selection Required',
        message: 'Please select at least one bucket to save your settings.',
      });
      return;
    }

    if (user) {
      saveUser({
        ...user,
        selectedBuckets,
      });

      setModal({
        isOpen: true,
        type: 'success',
        title: 'Settings Saved!',
        message: 'Your bucket preferences have been updated successfully.',
      });
    }
  }

  function handleResetData() {
    setModal({
      isOpen: true,
      type: 'confirm',
      title: 'Reset All Data',
      message: 'Are you sure you want to delete ALL your data including goals, cards, and reviews? This action is permanent and cannot be undone.',
      confirmText: 'Delete Everything',
      cancelText: 'Keep My Data',
      onConfirm: () => {
        localStorage.clear();
        router.push('/');
      },
    });
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
                  <BucketIcon
                    bucketName={bucket.name}
                    size={32}
                    className={selectedBuckets.includes(bucket.name) ? 'text-amber-600 dark:text-amber-500' : 'text-stone-600 dark:text-stone-400'}
                  />
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

        {/* Dark Mode */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Appearance
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
            Choose how Gold Star Man looks on your device
          </p>

          <div className="flex items-center justify-between p-4 rounded-xl bg-stone-100/50 dark:bg-stone-800/50">
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {darkMode ? '🌙' : '☀️'}
              </div>
              <div>
                <div className="font-semibold text-stone-900 dark:text-stone-100">
                  {darkMode ? 'Dark Mode' : 'Light Mode'}
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400">
                  {darkMode ? 'Easy on the eyes' : 'Bright and clear'}
                </div>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                darkMode ? 'bg-amber-600' : 'bg-stone-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
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

      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={(modal as any).confirmText}
        cancelText={(modal as any).cancelText}
      />

      <Navigation />
    </div>
  );
}
