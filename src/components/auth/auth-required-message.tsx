'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

interface AuthRequiredMessageProps {
  action: string;
  className?: string;
}

export function AuthRequiredMessage({
  action,
  className = '',
}: AuthRequiredMessageProps) {
  return (
    <div
      className={`p-4 bg-blue-50 border border-blue-200 rounded-lg ${className}`}
    >
      <div className="text-center">
        <div className="mb-3">
          <LogIn className="h-8 w-8 text-blue-600 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-blue-900 mb-2">
          Inicia sesión requerido
        </h3>
        <p className="text-sm text-blue-700 mb-4">
          Necesitas iniciar sesión para {action}.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/auth/login">
            <Button size="sm" className="w-full sm:w-auto">
              <LogIn className="h-4 w-4 mr-2" />
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Registrarse
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
