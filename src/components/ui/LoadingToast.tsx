'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface LoadingToastProps {
  isLoading?: boolean;
  message?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export default function LoadingToast({
  isLoading = false,
  message = 'Procesando...',
  position = 'top-right',
}: LoadingToastProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{
            opacity: 0,
            y: position.includes('top') ? -50 : 50,
            x: position.includes('right') ? 50 : -50,
          }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{
            opacity: 0,
            y: position.includes('top') ? -50 : 50,
            x: position.includes('right') ? 50 : -50,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fixed ${positionClasses[position]} z-50`}
        >
          <div className="bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-3 flex items-center space-x-3 min-w-[200px]">
            {/* Spinner pequeño */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-5 h-5 border-2 border-transparent border-t-primary-600 border-r-primary-300 rounded-full"
            />

            {/* Mensaje */}
            <span className="text-sm font-medium text-gray-700 flex-1">
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
