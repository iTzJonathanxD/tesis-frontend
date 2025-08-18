'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalLoadingProps {
  isLoading?: boolean;
  message?: string;
}

export default function GlobalLoading({
  isLoading = true,
  message = 'Cargando...',
}: GlobalLoadingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background:
              'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 50%, #1E40AF 100%)',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-center px-8"
          >
            {/* Logo ULEAM Conecta Real */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
              className="mx-auto mb-8 relative"
            >
              {/* Logo principal */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative w-32 h-32 mx-auto"
              >
                <img
                  src="/logo-sinfondo.png"
                  alt="ULEAM Conecta Logo"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
                {/* Efecto de brillo */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 bg-white/20 rounded-full blur-xl"
                />
              </motion.div>

              {/* Círculos animados alrededor del logo */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 8 + i * 2,
                      repeat: Infinity,
                      ease: 'linear',
                    },
                    scale: {
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.3,
                    },
                  }}
                  className="absolute inset-0 border-2 border-white/30 rounded-full"
                  style={{
                    width: `${140 + i * 20}px`,
                    height: `${140 + i * 20}px`,
                    left: `${-10 - i * 10}px`,
                    top: `${-10 - i * 10}px`,
                  }}
                />
              ))}
            </motion.div>

            {/* Título ULEAM Conecta */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-6 text-center"
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                ULEAM Conecta
              </h1>
              <div className="flex items-center justify-center space-x-2 text-white/80">
                <motion.div
                  animate={{ width: [0, 40, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="h-0.5 bg-white/60 rounded"
                />
                <span className="text-sm font-medium">
                  Tu plataforma estudiantil
                </span>
                <motion.div
                  animate={{ width: [0, 40, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                  className="h-0.5 bg-white/60 rounded"
                />
              </div>
            </motion.div>

            {/* Mensaje de carga */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-xl font-semibold text-white mb-4"
            >
              {message}
            </motion.h2>

            {/* Barra de progreso animada */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto mb-4"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-white to-blue-100 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </motion.div>

            {/* Texto de progreso */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-white/80 text-sm font-medium"
            >
              Conectando con tu comunidad universitaria...
            </motion.p>

            {/* Puntos de carga animados */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex justify-center space-x-1 mt-4"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                  className="w-2 h-2 bg-white/60 rounded-full"
                />
              ))}
            </motion.div>

            {/* Barra de colores oficiales ULEAM */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-8 flex justify-center space-x-1"
            >
              {[
                { color: '#EF4444', name: 'Rojo' },
                { color: '#F59E0B', name: 'Amarillo' },
                { color: '#10B981', name: 'Verde' },
                { color: '#06B6D4', name: 'Celeste' },
                { color: '#3B82F6', name: 'Azul' },
              ].map((colorInfo, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut',
                  }}
                  className="w-3 h-12 rounded-full shadow-lg"
                  style={{ backgroundColor: colorInfo.color }}
                />
              ))}
            </motion.div>

            {/* Texto institucional */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="mt-4 text-center text-white/70 text-xs font-medium"
            >
              Universidad Laica Eloy Alfaro de Manabí
            </motion.div>
          </motion.div>

          {/* Efecto de partículas flotantes */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 10, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
              className="absolute w-2 h-2 bg-white/40 rounded-full"
              style={{
                left: `${10 + i * 8}%`,
                top: `${20 + Math.sin(i) * 15}%`,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
