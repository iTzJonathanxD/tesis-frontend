'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, UserPlus, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export function AuthInfoBanner() {
  const { user } = useAuth();

  // Don't show banner if user is already authenticated
  if (user) return null;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-8">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="p-2 bg-blue-100 rounded-full">
              <Info className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¡Únete a nuestra comunidad!
            </h3>

            <p className="text-gray-700 mb-4">
              Puedes explorar todos los servicios disponibles, pero para
              contactar vendedores, realizar pedidos o escribir reseñas,
              necesitas crear una cuenta.
              <span className="font-medium"> Es completamente gratis</span> y
              solo toma unos minutos.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/register">
                <Button className="w-full sm:w-auto">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Cuenta Gratis
                </Button>
              </Link>

              <Link href="/auth/login">
                <Button variant="outline" className="w-full sm:w-auto">
                  <LogIn className="h-4 w-4 mr-2" />
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
