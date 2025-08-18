'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useGlobalLoading } from '@/hooks/useGlobalLoading2';

interface PageLoadingWrapperProps {
  children: React.ReactNode;
}

export default function PageLoadingWrapper({
  children,
}: PageLoadingWrapperProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { showFullscreenLoading, hideLoading } = useGlobalLoading();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(pathname);

  // Mensajes personalizados por página
  const getLoadingMessage = (path: string) => {
    const messages: Record<string, string> = {
      '/': 'Bienvenido a ULEAM Conecta...',
      '/auth/login': 'Preparando inicio de sesión...',
      '/auth/register': 'Configurando registro estudiantil...',
      '/auth/forgot-password': 'Cargando recuperación de contraseña...',
      '/auth/reset-password': 'Preparando restablecimiento...',
      '/dashboard': 'Cargando tu panel principal...',
      '/dashboard/settings': 'Cargando configuración...',
      '/dashboard/orders': 'Cargando tus pedidos...',
      '/dashboard/services': 'Cargando servicios disponibles...',
      '/dashboard/services/create': 'Preparando formulario de servicio...',
      '/dashboard/reviews': 'Cargando reseñas...',
      '/dashboard/notifications': 'Cargando notificaciones...',
      '/dashboard/messages': 'Cargando mensajes...',
      '/dashboard/chats': 'Cargando conversaciones...',
      '/dashboard/payments': 'Cargando información de pagos...',
      '/dashboard/metrics': 'Cargando métricas...',
      '/services': 'Explorando servicios estudiantiles...',
      '/about': 'Conoce más sobre ULEAM Conecta...',
      '/contact': 'Preparando formulario de contacto...',
    };

    // Para rutas dinámicas
    if (path.includes('/services/') && !path.includes('/dashboard')) {
      return 'Cargando detalles del servicio...';
    }
    if (path.includes('/dashboard/services/') && path.includes('/edit')) {
      return 'Cargando editor de servicio...';
    }
    if (
      path.includes('/dashboard/services/') &&
      !path.includes('/create') &&
      !path.includes('/edit')
    ) {
      return 'Cargando detalles del servicio...';
    }
    if (path.includes('/dashboard/orders/')) {
      return 'Cargando detalles del pedido...';
    }

    return messages[path] || 'Cargando contenido...';
  };

  useEffect(() => {
    // Solo mostrar loading si cambió la ruta o es carga inicial
    if (pathname !== currentPath || isPageLoading) {
      setCurrentPath(pathname);
      setIsPageLoading(true);

      // Mostrar loading independientemente de si hay usuario o no para la página de inicio
      const message = getLoadingMessage(pathname);
      showFullscreenLoading(message);

      // Simular tiempo de carga realista basado en la complejidad de la página
      let loadingTime = 1200; // Tiempo base

      if (pathname === '/') {
        loadingTime = 2000; // Página principal más tiempo para causar buena primera impresión
      } else if (pathname.startsWith('/auth')) {
        // Rutas de autenticación
        if (pathname === '/auth/login') {
          loadingTime = 1400; // Login
        } else if (pathname === '/auth/register') {
          loadingTime = 1600; // Registro más tiempo
        } else if (pathname.includes('/auth/forgot-password')) {
          loadingTime = 1300; // Recuperar contraseña
        } else if (pathname.includes('/auth/reset-password')) {
          loadingTime = 1350; // Restablecer contraseña
        } else {
          loadingTime = 1400; // Otras rutas de auth
        }
      } else if (pathname === '/services') {
        loadingTime = 1600; // Página de servicios públicos
      } else if (
        pathname.includes('/services/') &&
        !pathname.includes('/dashboard')
      ) {
        loadingTime = 1400; // Detalles de servicio público
      } else if (pathname === '/dashboard') {
        loadingTime = 1800; // Dashboard principal más tiempo
      } else if (pathname.includes('/dashboard/services')) {
        loadingTime = 1400; // Servicios del dashboard tiempo medio
      } else if (
        pathname.includes('/orders') ||
        pathname.includes('/payments')
      ) {
        loadingTime = 1500; // Pedidos y pagos tiempo medio-alto
      } else if (pathname.includes('/settings')) {
        loadingTime = 1300; // Settings tiempo medio
      }

      const timer = setTimeout(() => {
        setIsPageLoading(false);
        hideLoading();
      }, loadingTime);

      return () => clearTimeout(timer);
    }
  }, [
    pathname,
    showFullscreenLoading,
    hideLoading,
    currentPath,
    isPageLoading,
  ]);

  // Para páginas públicas (inicio, servicios, auth), mostrar loading independientemente del usuario
  if (
    (pathname === '/' ||
      pathname.startsWith('/services') ||
      pathname.startsWith('/auth')) &&
    isPageLoading
  ) {
    return null; // El loading se maneja a través del contexto global
  }

  // Para rutas del dashboard, verificar usuario
  if (pathname.startsWith('/dashboard') && (!user || isPageLoading)) {
    return null; // El loading se maneja a través del contexto global
  }

  return <>{children}</>;
}
