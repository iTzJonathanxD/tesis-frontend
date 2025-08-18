'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Oops! Algo salió mal
          </h1>
          <p className="text-gray-600 mb-8">
            Ha ocurrido un error inesperado. Por favor, intenta de nuevo o
            contacta al soporte si el problema persiste.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={reset}
            className="w-full bg-primary-600 hover:bg-primary-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar de Nuevo
          </Button>

          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Ir al Inicio
            </Button>
          </Link>
        </div>

        {error.digest && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              ID del Error: {error.digest}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
