import Image from 'next/image';

interface GoldStarProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export default function GoldStar({ size = 32, className = '', animate = false }: GoldStarProps) {
  return (
    <div className={`inline-flex items-center justify-center ${animate ? 'star-pop' : ''} ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#fcd34d', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path
          d="M100 10L122.451 64.0983L180.902 72.0645L140.451 110.902L150.902 168.935L100 144.098L49.0983 168.935L59.5491 110.902L19.0983 72.0645L77.5491 64.0983L100 10Z"
          fill="url(#goldGradient)"
          filter="url(#glow)"
        />
        <path
          d="M100 10L122.451 64.0983L180.902 72.0645L140.451 110.902L150.902 168.935L100 144.098L49.0983 168.935L59.5491 110.902L19.0983 72.0645L77.5491 64.0983L100 10Z"
          fill="url(#goldGradient)"
          opacity="0.3"
          transform="translate(0, 2)"
        />
      </svg>
    </div>
  );
}
