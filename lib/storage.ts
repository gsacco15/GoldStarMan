import { Goal, DailyCard, WeeklyReview, BucketPreference, User } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  USER: 'goldstarman_user',
  GOALS: 'goldstarman_goals',
  DAILY_CARDS: 'goldstarman_daily_cards',
  WEEKLY_REVIEWS: 'goldstarman_weekly_reviews',
  BUCKET_PREFERENCES: 'goldstarman_bucket_preferences',
};

// Helper to safely access localStorage (handles SSR)
function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage;
}

// User operations
export function getUser(): User | null {
  const storage = getStorage();
  if (!storage) return null;

  const data = storage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
}

export function saveUser(user: User): void {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function createUser(): User {
  const user: User = {
    id: generateId(),
    hasCompletedOnboarding: false,
    createdAt: new Date().toISOString(),
    selectedBuckets: [],
  };
  saveUser(user);
  return user;
}

// Goal operations
export function getGoals(): Goal[] {
  const storage = getStorage();
  if (!storage) return [];

  const data = storage.getItem(STORAGE_KEYS.GOALS);
  return data ? JSON.parse(data) : [];
}

export function saveGoals(goals: Goal[]): void {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
}

export function addGoal(goal: Omit<Goal, 'id' | 'createdAt'>): Goal {
  const newGoal: Goal = {
    ...goal,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  const goals = getGoals();
  goals.push(newGoal);
  saveGoals(goals);

  return newGoal;
}

export function updateGoal(id: string, updates: Partial<Goal>): void {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index !== -1) {
    goals[index] = { ...goals[index], ...updates };
    saveGoals(goals);
  }
}

export function deleteGoal(id: string): void {
  const goals = getGoals();
  const filtered = goals.filter(g => g.id !== id);
  saveGoals(filtered);
}

export function getActiveGoals(): Goal[] {
  return getGoals().filter(g => g.status === 'active');
}

// Daily Card operations
export function getDailyCards(): DailyCard[] {
  const storage = getStorage();
  if (!storage) return [];

  const data = storage.getItem(STORAGE_KEYS.DAILY_CARDS);
  return data ? JSON.parse(data) : [];
}

export function saveDailyCards(cards: DailyCard[]): void {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(STORAGE_KEYS.DAILY_CARDS, JSON.stringify(cards));
}

export function getCardsByDate(date: string): DailyCard[] {
  return getDailyCards().filter(card => card.date === date);
}

export function getCardsByDateRange(startDate: string, endDate: string): DailyCard[] {
  const cards = getDailyCards();
  return cards.filter(card => card.date >= startDate && card.date <= endDate);
}

export function addDailyCard(card: Omit<DailyCard, 'id'>): DailyCard {
  const newCard: DailyCard = {
    ...card,
    id: generateId(),
  };

  const cards = getDailyCards();
  cards.push(newCard);
  saveDailyCards(cards);

  return newCard;
}

export function updateDailyCard(id: string, updates: Partial<DailyCard>): void {
  const cards = getDailyCards();
  const index = cards.findIndex(c => c.id === id);
  if (index !== -1) {
    cards[index] = { ...cards[index], ...updates };
    saveDailyCards(cards);
  }
}

export function deleteDailyCard(id: string): void {
  const cards = getDailyCards();
  const filtered = cards.filter(c => c.id !== id);
  saveDailyCards(filtered);
}

// Weekly Review operations
export function getWeeklyReviews(): WeeklyReview[] {
  const storage = getStorage();
  if (!storage) return [];

  const data = storage.getItem(STORAGE_KEYS.WEEKLY_REVIEWS);
  return data ? JSON.parse(data) : [];
}

export function saveWeeklyReviews(reviews: WeeklyReview[]): void {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(STORAGE_KEYS.WEEKLY_REVIEWS, JSON.stringify(reviews));
}

export function addWeeklyReview(review: Omit<WeeklyReview, 'id'>): WeeklyReview {
  const newReview: WeeklyReview = {
    ...review,
    id: generateId(),
  };

  const reviews = getWeeklyReviews();
  reviews.push(newReview);
  saveWeeklyReviews(reviews);

  return newReview;
}

export function getWeeklyReview(weekStartDate: string): WeeklyReview | undefined {
  const reviews = getWeeklyReviews();
  return reviews.find(r => r.weekStartDate === weekStartDate);
}

// Bucket Preference operations
export function getBucketPreferences(): BucketPreference[] {
  const storage = getStorage();
  if (!storage) return [];

  const data = storage.getItem(STORAGE_KEYS.BUCKET_PREFERENCES);
  return data ? JSON.parse(data) : [];
}

export function saveBucketPreferences(preferences: BucketPreference[]): void {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(STORAGE_KEYS.BUCKET_PREFERENCES, JSON.stringify(preferences));
}

export function updateBucketPreference(bucketName: string, updates: Partial<BucketPreference>): void {
  const preferences = getBucketPreferences();
  const index = preferences.findIndex(p => p.bucketName === bucketName);

  if (index !== -1) {
    preferences[index] = { ...preferences[index], ...updates };
  } else {
    // Create new preference
    const newPref: BucketPreference = {
      id: generateId(),
      bucketName,
      displayName: bucketName,
      hidden: false,
      order: preferences.length,
      isCustom: false,
      ...updates,
    };
    preferences.push(newPref);
  }

  saveBucketPreferences(preferences);
}

// Utility function to generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
