'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface AnimatedSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const AnimatedSelect: React.FC<AnimatedSelectProps> = ({
  label,
  error,
  options,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    props.onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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

        {/* Select Container */}
        <motion.div whileFocus={{ scale: 1.02 }} className="relative">
          <select
            {...props}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={`
              w-full h-11 px-3 pr-10 appearance-none
              border-2 rounded-lg transition-all duration-300 text-sm
              ${
                isFocused
                  ? 'border-primary-500 shadow-md shadow-primary-500/15'
                  : error
                  ? 'border-red-500'
                  : 'border-gray-300 hover:border-gray-400'
              }
              bg-white text-gray-900
              focus:ring-0 focus:outline-none
              ${
                props.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }
              ${className}
            `}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown Arrow */}
          <motion.div
            animate={{ rotate: isFocused ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </motion.div>
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
