'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { FloatingChatNotification } from '@/components/chat/FloatingChatNotification';
import PageLoadingWrapper from '@/components/ui/PageLoadingWrapper';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  // No mostrar header y footer en rutas de autenticación
  const isAuthRoute = pathname?.startsWith('/auth');
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  const isHomePage = pathname === '/';
  const isServicesRoute = pathname?.startsWith('/services');

  if (isAuthRoute) {
    return <PageLoadingWrapper>{children}</PageLoadingWrapper>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {isDashboardRoute || isHomePage || isServicesRoute ? (
          <PageLoadingWrapper>{children}</PageLoadingWrapper>
        ) : (
          children
        )}
      </main>
      <Footer />
      <FloatingChatNotification />
    </div>
  );
}
