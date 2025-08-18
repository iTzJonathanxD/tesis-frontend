'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';

interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'relative overflow-hidden font-semibold transition-all duration-300';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl',
    secondary:
      'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300',
    outline:
      'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white',
  };

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-5 text-sm',
    lg: 'h-11 px-6 text-base',
  };

  return (
    <motion.div
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Button
        {...props}
        disabled={disabled || loading}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        {/* Ripple Effect */}
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 4, opacity: [0, 1, 0] }}
          transition={{ duration: 0.6 }}
        />

        {/* Loading Spinner */}
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
          </motion.div>
        )}

        {/* Content */}
        <motion.span
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 flex items-center justify-center gap-2"
        >
          {children}
        </motion.span>
      </Button>
    </motion.div>
  );
};
