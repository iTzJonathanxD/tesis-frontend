'use client';

import React from 'react';
import { useGlobalLoading } from '@/hooks/useGlobalLoading2';
import GlobalLoading from './GlobalLoading';
import LoadingToast from './LoadingToast';

export default function GlobalLoadingWrapper() {
  const { loading } = useGlobalLoading();

  return (
    <>
      {/* Loading de pantalla completa */}
      {loading.type === 'fullscreen' && (
        <GlobalLoading
          isLoading={loading.isLoading}
          message={loading.message}
        />
      )}

      {/* Loading tipo toast */}
      {loading.type === 'toast' && (
        <LoadingToast
          isLoading={loading.isLoading}
          message={loading.message}
          position="top-right"
        />
      )}
    </>
  );
}
