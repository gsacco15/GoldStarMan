'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, createUser } from '@/lib/storage';

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-pulse">⭐</div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          Gold Star Man
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mt-2">
          Loading...
        </p>
      </div>
    </div>
  );
}
