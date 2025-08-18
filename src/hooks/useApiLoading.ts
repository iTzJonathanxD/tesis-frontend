'use client';

import { useEffect, useState } from 'react';
import { usePageLoading } from '@/hooks/useGlobalLoading2';

// Contador global de peticiones activas
let activeRequests = 0;

export const useApiLoading = () => {
  const { showLoading, hideLoading } = usePageLoading();
  const [requestCount, setRequestCount] = useState(0);

  // Función para incrementar el contador
  const incrementRequests = (message = 'Cargando datos...') => {
    activeRequests++;
    setRequestCount(activeRequests);
    if (activeRequests === 1) {
      showLoading(message);
    }
  };

  // Función para decrementar el contador
  const decrementRequests = () => {
    activeRequests = Math.max(0, activeRequests - 1);
    setRequestCount(activeRequests);
    if (activeRequests === 0) {
      hideLoading();
    }
  };

  // Función para resetear el contador (útil para errores)
  const resetRequests = () => {
    activeRequests = 0;
    setRequestCount(0);
    hideLoading();
  };

  return {
    incrementRequests,
    decrementRequests,
    resetRequests,
    activeRequests: requestCount,
  };
};

// Hook específico para mostrar loading durante operaciones
export const useLoadingOperation = () => {
  const { showLoading, hideLoading } = usePageLoading();

  const executeWithLoading = async <T>(
    operation: () => Promise<T>,
    message = 'Procesando...'
  ): Promise<T> => {
    try {
      showLoading(message);
      const result = await operation();
      return result;
    } finally {
      hideLoading();
    }
  };

  return {
    executeWithLoading,
    showLoading,
    hideLoading,
  };
};
