'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SimpleBackgroundProps {
  className?: string;
}

export const SimpleBackground: React.FC<SimpleBackgroundProps> = ({
  className = '',
}) => {
  // Use predefined positions to avoid hydration mismatch
  const particles = [
    { id: 1, x: 10, y: 20, size: 2, duration: 15 },
    { id: 2, x: 80, y: 10, size: 3, duration: 20 },
    { id: 3, x: 30, y: 70, size: 1.5, duration: 18 },
    { id: 4, x: 60, y: 40, size: 2.5, duration: 12 },
    { id: 5, x: 90, y: 80, size: 2, duration: 16 },
    { id: 6, x: 20, y: 50, size: 1.8, duration: 14 },
    { id: 7, x: 70, y: 25, size: 2.2, duration: 19 },
    { id: 8, x: 45, y: 85, size: 1.6, duration: 13 },
    { id: 9, x: 15, y: 90, size: 2.8, duration: 17 },
    { id: 10, x: 85, y: 60, size: 2.1, duration: 21 },
  ];

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            opacity: [0.2, 0.6, 0.3, 0.2],
            scale: [0.8, 1.2, 0.9, 0.8],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.id * 0.5,
          }}
        />
      ))}
    </div>
  );
};
