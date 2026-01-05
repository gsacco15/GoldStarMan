'use client';

import { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

export default function Confetti({ active, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number; duration: number }>>([]);

  useEffect(() => {
    if (active) {
      // Generate confetti particles
      const colors = ['#fbbf24', '#f59e0b', '#d97706', '#fcd34d', '#fde047', '#fb923c'];
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.2,
        duration: 1.5 + Math.random() * 0.5,
      }));

      setParticles(newParticles);

      // Clear particles after animation
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
