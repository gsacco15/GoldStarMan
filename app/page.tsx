'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, createUser } from '@/lib/storage';
import GoldStar from '@/components/GoldStar';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user exists and has completed onboarding
    let user = getUser();

    if (!user) {
      // Create new user
      user = createUser();
    }

    if (user.hasCompletedOnboarding) {
      // Redirect to Today page
      router.push('/today');
    } else {
      // Redirect to Onboarding
      router.push('/onboarding');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800">
      <div className="text-center">
        <div className="mb-6 fade-in">
          <GoldStar size={100} animate />
        </div>
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-3">
          Gold Star Man
        </h1>
        <p className="text-stone-600 dark:text-stone-400">
          Loading your progress...
        </p>
      </div>
    </div>
  );
}
