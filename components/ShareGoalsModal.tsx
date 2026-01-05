'use client';

import { useState } from 'react';
import Modal from './Modal';

interface ShareGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Array<{
    bucket: string;
    title: string;
    description: string;
    weeklyMinimum: number;
    targetDate: string;
    startDate?: string;
  }>;
  userName: string;
}

export default function ShareGoalsModal({
  isOpen,
  onClose,
  goals,
  userName,
}: ShareGoalsModalProps) {
  const [toName, setToName] = useState('');
  const [toEmail, setToEmail] = useState('');
  const [note, setNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSend() {
    setError('');

    if (!toEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(toEmail.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/share-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: toEmail.trim(),
          toName: toName.trim() || undefined,
          fromName: userName,
          note: note.trim() || undefined,
          goals: goals,
          year: new Date().getFullYear(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  }

  function handleClose() {
    setToName('');
    setToEmail('');
    setNote('');
    setError('');
    setSuccess(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="card max-w-lg w-full p-8 slide-up">
        {success ? (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-2">
              Goals Shared!
            </h2>
            <p className="text-stone-600 dark:text-stone-400">
              Your goals have been sent to {toEmail}
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-2">
              Share Your {new Date().getFullYear()} Goals
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mb-6">
              Send your goals to someone for accountability and support
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  Their Name (optional)
                </label>
                <input
                  type="text"
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  placeholder="e.g., John"
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
                  disabled={isSending}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  Their Email *
                </label>
                <input
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="e.g., john@example.com"
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400"
                  disabled={isSending}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  Personal Note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a personal message..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 resize-none"
                  disabled={isSending}
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⭐</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-1">
                    Sharing {goals.length} goal{goals.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Your goals will be sent as a beautiful email summary
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="btn-ghost flex-1 py-3"
                disabled={isSending}
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="btn-primary flex-1 py-3"
                disabled={isSending || !toEmail.trim()}
              >
                {isSending ? 'Sending...' : 'Send Goals'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
