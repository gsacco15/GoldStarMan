// Core data types for Gold Star Man MVP

export interface Goal {
  id: string;
  bucket: string;
  title: string;
  description: string;
  weeklyMinimum: number; // How many cards to complete per week
  targetDate: string; // ISO date string
  status: 'active' | 'completed' | 'paused';
  createdAt: string; // ISO date string
}

export interface DailyCard {
  id: string;
  goalId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  title: string; // Derived from goal title or custom action
  status: 'pending' | 'done' | 'partial' | 'skip';
  starsEarned: number; // 0, 0.5, or 1
  completedAt?: string; // ISO timestamp when marked as done/partial/skip
}

export interface WeeklyReview {
  id: string;
  weekStartDate: string; // ISO date string (YYYY-MM-DD) - Monday
  weekEndDate: string; // ISO date string (YYYY-MM-DD) - Sunday
  oneWin: string;
  oneMiss: string;
  nextPriorities: string;
  starsEarned: number; // Total for the week
  minimumsMet: number; // How many goals hit their weekly minimum
  completedAt: string; // ISO timestamp
}

export interface BucketPreference {
  id: string;
  bucketName: string; // Original bucket name (e.g., "work")
  displayName: string; // Custom name if renamed
  hidden: boolean; // If true, don't show in UI
  order: number; // For sorting
  isCustom: boolean; // If true, this is a custom bucket
}

export interface User {
  id: string;
  hasCompletedOnboarding: boolean;
  createdAt: string; // ISO date string
  selectedBuckets: string[]; // Array of bucket names
}

// Bucket definitions
export interface BucketDefinition {
  name: string;
  displayName: string;
  icon: string;
  description: string;
}

// Weekly stats for tracking progress
export interface WeeklyStats {
  weekStartDate: string;
  weekEndDate: string;
  totalStars: number;
  minimumsMet: number;
  totalMinimums: number;
  completionPercentage: number;
}

// Daily summary for calendar view
export interface DailySummary {
  date: string;
  starsEarned: number;
  cardsCompleted: number;
  cardsPartial: number;
  cardsSkipped: number;
  totalCards: number;
}
