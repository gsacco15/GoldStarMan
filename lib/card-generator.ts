import { Goal, DailyCard } from '@/types';
import { getWeekStart, getWeekDates, getTodayString } from './date-utils';
import { getDailyCards, saveDailyCards, getActiveGoals } from './storage';

/**
 * Generates daily cards for the current week based on active goals
 * This is called when:
 * 1. User completes onboarding
 * 2. New week starts
 * 3. User adds a new goal
 */
export function generateWeeklyCards(weekStartDate?: string): void {
  const weekStart = weekStartDate || getWeekStart();
  const weekDates = getWeekDates(weekStart);
  const activeGoals = getActiveGoals();
  const existingCards = getDailyCards();

  const newCards: DailyCard[] = [];

  activeGoals.forEach(goal => {
    // Check how many cards already exist for this goal this week
    const existingGoalCards = existingCards.filter(
      card =>
        card.goalId === goal.id &&
        weekDates.includes(card.date)
    );

    const cardsNeeded = Math.max(0, goal.weeklyMinimum - existingGoalCards.length);

    // Generate cards for remaining days in the week
    // Distribute them across days that don't already have a card for this goal
    // Respect startDate and targetDate if set
    const availableDays = weekDates.filter(date => {
      // Skip if card already exists for this date
      if (existingGoalCards.some(card => card.date === date)) return false;

      // Skip if before start date
      if (goal.startDate && date < goal.startDate) return false;

      // Skip if after target date
      if (date > goal.targetDate) return false;

      return true;
    });

    for (let i = 0; i < Math.min(cardsNeeded, availableDays.length); i++) {
      const card: DailyCard = {
        id: generateCardId(),
        goalId: goal.id,
        date: availableDays[i],
        title: goal.title,
        status: 'pending',
        starsEarned: 0,
      };
      newCards.push(card);
    }
  });

  // Save all new cards
  if (newCards.length > 0) {
    const allCards = [...existingCards, ...newCards];
    saveDailyCards(allCards);
  }
}

/**
 * Generates cards for a specific goal for the current week
 * Used when a user adds a new goal mid-week
 */
export function generateCardsForGoal(goal: Goal, weekStartDate?: string): void {
  const weekStart = weekStartDate || getWeekStart();
  const weekDates = getWeekDates(weekStart);
  const existingCards = getDailyCards();

  // Check how many cards already exist for this goal this week
  const existingGoalCards = existingCards.filter(
    card =>
      card.goalId === goal.id &&
      weekDates.includes(card.date)
  );

  const cardsNeeded = Math.max(0, goal.weeklyMinimum - existingGoalCards.length);

  // Find days without cards for this goal
  // Respect startDate and targetDate if set
  const availableDays = weekDates.filter(date => {
    // Skip if card already exists for this date
    if (existingGoalCards.some(card => card.date === date)) return false;

    // Skip if before start date
    if (goal.startDate && date < goal.startDate) return false;

    // Skip if after target date
    if (date > goal.targetDate) return false;

    return true;
  });

  const newCards: DailyCard[] = [];

  for (let i = 0; i < Math.min(cardsNeeded, availableDays.length); i++) {
    const card: DailyCard = {
      id: generateCardId(),
      goalId: goal.id,
      date: availableDays[i],
      title: goal.title,
      status: 'pending',
      starsEarned: 0,
    };
    newCards.push(card);
  }

  // Save new cards
  if (newCards.length > 0) {
    const allCards = [...existingCards, ...newCards];
    saveDailyCards(allCards);
  }
}

/**
 * Gets cards for today, including bonus cards if weekly minimum is met
 */
export function getTodaysCards(): DailyCard[] {
  const today = getTodayString();
  const allCards = getDailyCards();
  const todaysCards = allCards.filter(card => card.date === today);

  return todaysCards;
}

/**
 * Checks if a goal has met its weekly minimum
 */
export function hasMetWeeklyMinimum(goalId: string, weekStartDate?: string): boolean {
  const weekStart = weekStartDate || getWeekStart();
  const weekDates = getWeekDates(weekStart);
  const cards = getDailyCards();

  const goalCards = cards.filter(
    card =>
      card.goalId === goalId &&
      weekDates.includes(card.date) &&
      (card.status === 'done' || card.status === 'partial')
  );

  const goal = getActiveGoals().find(g => g.id === goalId);
  if (!goal) return false;

  // Calculate stars earned (done = 1, partial = 0.5)
  const starsEarned = goalCards.reduce((sum, card) => {
    return sum + (card.status === 'done' ? 1 : 0.5);
  }, 0);

  return starsEarned >= goal.weeklyMinimum;
}

/**
 * Calculate weekly stats for the current week
 */
export function getWeeklyStats(weekStartDate?: string) {
  const weekStart = weekStartDate || getWeekStart();
  const weekDates = getWeekDates(weekStart);
  const cards = getDailyCards();
  const activeGoals = getActiveGoals();

  const weekCards = cards.filter(card => weekDates.includes(card.date));

  const totalStars = weekCards.reduce((sum, card) => sum + card.starsEarned, 0);

  let minimumsMet = 0;
  activeGoals.forEach(goal => {
    if (hasMetWeeklyMinimum(goal.id, weekStart)) {
      minimumsMet++;
    }
  });

  return {
    weekStartDate: weekStart,
    totalStars,
    minimumsMet,
    totalMinimums: activeGoals.length,
    completionPercentage: activeGoals.length > 0
      ? Math.round((minimumsMet / activeGoals.length) * 100)
      : 0,
  };
}

function generateCardId(): string {
  return `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
