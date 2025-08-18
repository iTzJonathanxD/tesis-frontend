'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ClientOnly } from './client-only';

interface Particle {
  id: number;
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay: number;
  animateX: number[];
  animateY: number[];
}

interface ParticleBackgroundProps {
  particleCount?: number;
  className?: string;
}

const ParticleContent: React.FC<ParticleBackgroundProps> = ({
  particleCount = 50,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    const generatedParticles = Array.from(
      { length: particleCount },
      (_, i) => ({
        id: i,
        size: Math.random() * 4 + 1,
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        animateX: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
        animateY: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
      })
    );

    setParticles(generatedParticles);
  }, [particleCount]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/10"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
          }}
          animate={{
            x: particle.animateX,
            y: particle.animateY,
            opacity: [0, 0.6, 0.3, 0],
            scale: [0, 1, 0.5, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export const ParticleBackground: React.FC<ParticleBackgroundProps> = (
  props
) => {
  return (
    <ClientOnly
      fallback={
        <div
          className={`absolute inset-0 overflow-hidden pointer-events-none ${
            props.className || ''
          }`}
        />
      }
    >
      <ParticleContent {...props} />
    </ClientOnly>
  );
};
