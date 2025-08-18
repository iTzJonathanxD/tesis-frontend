'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from './input';

interface AnimatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      <div className="relative">
        {/* Floating Label */}
        <motion.label
          animate={{
            top: isFocused || hasValue || props.value ? '-0.7rem' : '50%',
            fontSize:
              isFocused || hasValue || props.value ? '0.75rem' : '0.9rem',
            color: isFocused ? '#2563eb' : error ? '#dc2626' : '#6b7280',
            transform:
              isFocused || hasValue || props.value
                ? 'translateY(0)'
                : 'translateY(-50%)',
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-3 pointer-events-none font-medium z-20 bg-white px-2 rounded shadow-sm"
        >
          {label}
        </motion.label>

        {/* Input Container */}
        <motion.div whileFocus={{ scale: 1.02 }} className="relative">
          {icon && (
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
              <div className="w-4 h-4">{icon}</div>
            </div>
          )}

          <Input
            {...props}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={`
              w-full h-11 px-3 ${icon ? 'pl-10' : ''} ${
              rightIcon ? 'pr-10' : ''
            }
              border-2 rounded-lg transition-all duration-300
              ${
                isFocused
                  ? 'border-primary-500 shadow-md shadow-primary-500/15'
                  : error
                  ? 'border-red-500'
                  : 'border-gray-300 hover:border-gray-400'
              }
              bg-white text-gray-900 placeholder-transparent text-sm
              focus:ring-0 focus:outline-none
              ${className}
            `}
            placeholder=" "
          />

          {rightIcon && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10">
              <div className="w-4 h-4">{rightIcon}</div>
            </div>
          )}
        </motion.div>

        {/* Animated Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-primary-600 origin-center"
        />
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-xs mt-1 ml-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};
