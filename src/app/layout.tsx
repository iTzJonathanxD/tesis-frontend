import type { Metadata } from 'next';
import { Poppins, Montserrat } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { QueryProvider } from '@/lib/query-provider';
import { Toaster } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import { LoadingProvider } from '@/hooks/useGlobalLoading2';
import GlobalLoadingWrapper from '@/components/ui/GlobalLoadingWrapper';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ULEAM Conecta - Marketplace Estudiantil',
  description:
    'Plataforma que conecta estudiantes de ULEAM para intercambiar servicios académicos y crear una comunidad de apoyo mutuo.',
  keywords:
    'ULEAM, estudiantes, servicios académicos, tutorías, marketplace, universidad',
  authors: [{ name: 'ULEAM Conecta Team' }],
  openGraph: {
    title: 'ULEAM Conecta - Marketplace Estudiantil',
    description:
      'Conecta con estudiantes de ULEAM y encuentra los servicios académicos que necesitas.',
    url: 'https://uleam-conecta.com',
    siteName: 'ULEAM Conecta',
    locale: 'es_EC',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <ErrorBoundary>
          <LoadingProvider>
            <QueryProvider>
              <AuthProvider>
                <ConditionalLayout>{children}</ConditionalLayout>
                <GlobalLoadingWrapper />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'white',
                      color: '#374151',
                      border: '1px solid #e5e7eb',
                    },
                  }}
                />
              </AuthProvider>
            </QueryProvider>
          </LoadingProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
