'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, createUser } from '@/lib/storage';
import GoldStar from '@/components/GoldStar';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showHero, setShowHero] = useState(false);

  useEffect(() => {
    // Show hero for a moment
    setShowHero(true);

    const timer = setTimeout(() => {
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

      setIsLoading(false);
    }, 1500); // Show for 1.5s before redirecting

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-200/20 dark:bg-orange-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Main hero content */}
        <div className={`transition-all duration-1000 ${showHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Star icon */}
          <div className="mb-8 flex justify-center">
            <GoldStar size={120} animate />
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-bold text-stone-900 dark:text-stone-50 mb-6 tracking-tight">
            Gold Star Man
          </h1>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-stone-600 dark:text-stone-400 mb-12 font-light leading-relaxed">
            Turn your yearly goals into daily wins
          </p>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="card p-6 slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2">
                Weekly Focus
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Set weekly minimums, not daily pressure
              </p>
            </div>

            <div className="card p-6 slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="mb-4">
                <GoldStar size={48} />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2">
                Earn Stars
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Track progress with gold stars
              </p>
            </div>

            <div className="card p-6 slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2">
                Stay Balanced
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Track 7 life buckets holistically
              </p>
            </div>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center justify-center gap-3 fade-in">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
