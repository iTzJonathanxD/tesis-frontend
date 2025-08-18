'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedFormContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedFormContainer: React.FC<AnimatedFormContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`relative ${className}`}
    >
      {/* Animated Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/90 to-white/95 backdrop-blur-sm rounded-xl shadow-xl"
      />

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 1, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full opacity-20"
      />

      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [0, -1, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-primary-300 to-primary-500 rounded-full opacity-15"
      />

      {/* Content */}
      <div className="relative z-10 p-6">{children}</div>
    </motion.div>
  );
};
