import { BucketDefinition } from '@/types';

export const DEFAULT_BUCKETS: BucketDefinition[] = [
  {
    name: 'work',
    displayName: 'Work or Career',
    icon: '💼',
    description: 'Professional goals and career development'
  },
  {
    name: 'health',
    displayName: 'Health',
    icon: '💪',
    description: 'Physical and mental wellbeing'
  },
  {
    name: 'relationships',
    displayName: 'Relationships',
    icon: '❤️',
    description: 'Connections with family, friends, and community'
  },
  {
    name: 'growth',
    displayName: 'Growth or Creativity',
    icon: '🌱',
    description: 'Learning, creative pursuits, and personal development'
  },
  {
    name: 'adventure',
    displayName: 'Adventure or Experiences',
    icon: '🌍',
    description: 'Travel, new experiences, and exploration'
  },
  {
    name: 'impact',
    displayName: 'Impact or Giving',
    icon: '🤝',
    description: 'Contributing to causes and helping others'
  },
  {
    name: 'living',
    displayName: 'Living or Environment',
    icon: '🏡',
    description: 'Home, environment, and living space'
  }
];

export function getBucketByName(name: string): BucketDefinition | undefined {
  return DEFAULT_BUCKETS.find(bucket => bucket.name === name);
}

export function getBucketDisplayName(name: string): string {
  const bucket = getBucketByName(name);
  return bucket?.displayName || name;
}

export function getBucketIcon(name: string): string {
  const bucket = getBucketByName(name);
  return bucket?.icon || '⭐';
}
