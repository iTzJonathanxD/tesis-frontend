'use client';

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

interface LoadingContextType {
  isLoading: boolean;
  message: string;
  setLoading: (loading: boolean, message?: string) => void;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Cargando...');

  const setLoading = (loading: boolean, msg = 'Cargando...') => {
    setIsLoading(loading);
    setMessage(msg);
  };

  const showLoading = (msg = 'Cargando...') => {
    setIsLoading(true);
    setMessage(msg);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const value = {
    isLoading,
    message,
    setLoading,
    showLoading,
    hideLoading,
  };

  return React.createElement(LoadingContext.Provider, { value }, children);
};

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a LoadingProvider');
  }
  return context;
};

// Hook para componentes que necesiten mostrar loading
export const usePageLoading = () => {
  const { showLoading, hideLoading } = useGlobalLoading();

  const setPageLoading = (loading: boolean, message?: string) => {
    if (loading) {
      showLoading(message);
    } else {
      hideLoading();
    }
  };

  return {
    showLoading,
    hideLoading,
    setPageLoading,
  };
};
