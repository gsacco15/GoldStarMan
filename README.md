# ⭐ Gold Star Man

A simple goal setting and daily tracking app focused on yearly goals and weekly consistency, not perfect daily streaks.

## What it is

Gold Star Man turns long-term goals into small daily cards you can tap through in seconds. The goal is to make progress visible, fun, and low friction.

## Core Philosophy

- **Plan your year once** - Set up goals with weekly minimums instead of daily rules
- **Show up, not perfect** - Earn gold stars for showing up, not for being perfect
- **Weekly consistency** - Progress measured by weeks, not streaks
- **No guilt** - Once you hit the weekly minimum, the pressure disappears

## Who it's for

People with big yearly goals who hate rigid habit apps. Builders, creatives, and busy professionals who want structure without guilt.

## Features

### 📝 Year Plan
- Create goals across multiple life buckets (Work, Health, Relationships, Growth, etc.)
- Set weekly minimums instead of daily requirements
- Add target dates for each goal
- Pause or resume goals anytime

### 📅 Daily Cards
- Simple, tap-through cards for each day
- Three states: **Done** (1 star), **Partial** (0.5 stars), **Skip** (0 stars)
- Cards automatically generated based on weekly minimums
- Bonus cards available after meeting weekly minimum

### 📊 Weekly Tracking
- Progress measured by weeks, not daily streaks
- Track stars earned and minimums met
- Calendar view to see your week at a glance

### 🎯 Weekly Review
- Reflect once per week with simple prompts:
  - One Win
  - One Miss
  - Next Week Priorities

### ⚙️ Settings
- Customize active buckets
- View total stats
- Manage your data

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Storage**: localStorage (MVP)
- **Date Utilities**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd GoldStarMan
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## How It Works

### Onboarding Flow

1. **Select Buckets** - Choose which life areas you want to focus on
2. **Add Goals** - Create 1-3 goals to start (you can add more later)
3. **Set Weekly Minimums** - Define how many times per week you want to work on each goal

### Daily Experience

1. **Check Today** - See your cards for the day
2. **Tap Through** - Mark each card as Done, Partial, or Skip
3. **Track Progress** - Watch your stars accumulate

### Weekly Routine

1. **Meet Minimums** - Aim to hit your weekly targets
2. **Bonus Stars** - Keep going after meeting minimums for extra motivation
3. **Weekly Review** - Reflect on wins, misses, and priorities

## File Structure

```
GoldStarMan/
├── app/                    # Next.js app directory
│   ├── calendar/          # Calendar view page
│   ├── goals/             # Goals management page
│   ├── onboarding/        # Onboarding flow
│   ├── review/            # Weekly review page
│   ├── settings/          # Settings page
│   ├── today/             # Main daily cards page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects)
├── components/            # React components
│   └── Navigation.tsx     # Bottom navigation bar
├── lib/                   # Utility functions
│   ├── buckets.ts         # Bucket definitions
│   ├── card-generator.ts  # Daily card generation logic
│   ├── date-utils.ts      # Date formatting and utilities
│   └── storage.ts         # localStorage operations
└── types/                 # TypeScript type definitions
    └── index.ts           # All app types
```

## Data Model

### Goal
- `bucket`: Life area (work, health, etc.)
- `title`: Goal name
- `weeklyMinimum`: Required cards per week
- `targetDate`: Completion deadline
- `status`: active | paused | completed

### DailyCard
- `goalId`: Reference to goal
- `date`: Which day this card is for
- `status`: pending | done | partial | skip
- `starsEarned`: 0, 0.5, or 1

### WeeklyReview
- `weekStartDate`: Monday of the week
- `oneWin`: What went well
- `oneMiss`: What didn't go as planned
- `nextPriorities`: Focus for next week

## Default Buckets

1. 💼 **Work or Career** - Professional goals
2. 💪 **Health** - Physical and mental wellbeing
3. ❤️ **Relationships** - Family, friends, community
4. 🌱 **Growth or Creativity** - Learning and creative pursuits
5. 🌍 **Adventure or Experiences** - Travel and exploration
6. 🤝 **Impact or Giving** - Contributing to causes
7. 🏡 **Living or Environment** - Home and living space

## Future Enhancements

- Avatars and leveling system
- Badges and milestones
- Visual progress charts
- Photo logs for goals
- Goal templates and presets
- Cloud sync and mobile apps
- Weekly review reminders
- Data export functionality

## Design Principles

1. **Friction-free** - Should take seconds, not minutes
2. **Forgiving** - No punishment for missed days
3. **Realistic** - Built for busy weeks, travel, and real life
4. **Motivating** - Visual progress and gold stars make it fun
5. **Simple** - No complex features that get in the way

## Why Gold Star Man?

Traditional habit trackers fail because they:
- Force daily perfection
- Break streaks when you miss a day
- Don't account for real life
- Add guilt instead of motivation

Gold Star Man is different:
- Weekly consistency over daily perfection
- No broken streaks - just weekly targets
- Designed for busy, unpredictable lives
- Rewards showing up, even imperfectly

## License

MIT

## Contributing

This is an MVP. Contributions, ideas, and feedback are welcome!

---

Built with ❤️ for people who want progress without perfection.
