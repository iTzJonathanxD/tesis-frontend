'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface AnimatedLogoProps {
  variant?: 'mobile' | 'desktop';
  logoSrc: string;
  title: string;
  subtitle: string;
  className?: string;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  variant = 'desktop',
  logoSrc,
  title,
  subtitle,
  className = '',
}) => {
  const isMobile = variant === 'mobile';

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`text-center ${className}`}
    >
      <div className="flex flex-col items-center space-y-3">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.2,
          }}
          whileHover={{
            scale: 1.05,
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.5 },
          }}
          className="relative"
        >
          {/* Glow Effect */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-primary-400 rounded-full blur-xl"
          />

          <Image
            src={logoSrc}
            alt="ULEAM Conecta"
            width={isMobile ? 40 : 60}
            height={isMobile ? 40 : 60}
            className={`relative z-10 ${isMobile ? 'h-10 w-10' : 'h-15 w-15'}`}
          />
        </motion.div>

        {/* Animated Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className={isMobile ? 'text-white' : 'text-gray-800'}
        >
          <motion.h1
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'}`}
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent max-w-20"
        />
      </div>
    </motion.div>
  );
};
