'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type LoadingType = 'fullscreen' | 'toast' | 'inline';

interface LoadingState {
  isLoading: boolean;
  message: string;
  type: LoadingType;
}

interface LoadingContextType {
  loading: LoadingState;
  setLoading: (loading: boolean, message?: string, type?: LoadingType) => void;
  showLoading: (message?: string, type?: LoadingType) => void;
  hideLoading: () => void;
  // Métodos específicos para mayor comodidad
  showFullscreenLoading: (message?: string) => void;
  showToastLoading: (message?: string) => void;
  showInlineLoading: (message?: string) => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [loading, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    message: 'Cargando...',
    type: 'fullscreen',
  });

  const setLoading = useCallback(
    (
      isLoading: boolean,
      message = 'Cargando...',
      type: LoadingType = 'fullscreen'
    ) => {
      setLoadingState({
        isLoading,
        message,
        type,
      });
    },
    []
  );

  const showLoading = useCallback(
    (message = 'Cargando...', type: LoadingType = 'fullscreen') => {
      setLoadingState({
        isLoading: true,
        message,
        type,
      });
    },
    []
  );

  const hideLoading = useCallback(() => {
    setLoadingState((prev) => ({
      ...prev,
      isLoading: false,
    }));
  }, []);

  // Métodos específicos
  const showFullscreenLoading = useCallback(
    (message = 'Cargando...') => {
      showLoading(message, 'fullscreen');
    },
    [showLoading]
  );

  const showToastLoading = useCallback(
    (message = 'Procesando...') => {
      showLoading(message, 'toast');
    },
    [showLoading]
  );

  const showInlineLoading = useCallback(
    (message = 'Cargando...') => {
      showLoading(message, 'inline');
    },
    [showLoading]
  );

  const contextValue: LoadingContextType = {
    loading,
    setLoading,
    showLoading,
    hideLoading,
    showFullscreenLoading,
    showToastLoading,
    showInlineLoading,
  };

  return React.createElement(
    LoadingContext.Provider,
    { value: contextValue },
    children
  );
};

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a LoadingProvider');
  }
  return context;
};

export const usePageLoading = () => {
  const { showToastLoading, hideLoading, showFullscreenLoading } =
    useGlobalLoading();

  const setPageLoading = useCallback(
    (loading: boolean, message?: string, type: LoadingType = 'toast') => {
      if (loading) {
        if (type === 'toast') {
          showToastLoading(message);
        } else {
          showFullscreenLoading(message);
        }
      } else {
        hideLoading();
      }
    },
    [showToastLoading, hideLoading, showFullscreenLoading]
  );

  return {
    showLoading: showToastLoading,
    hideLoading,
    setPageLoading,
    showFullscreenLoading,
    showToastLoading,
  };
};
