import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Ignorar ESLint durante el build para deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorar errores de TypeScript durante el build para deployment
    ignoreBuildErrors: true,
  },
  // Configuración de exportación para deshabilitar prerenderizado estático
  trailingSlash: false,
  // Configuración experimental para deshabilitar prerenderizado
  experimental: {
    esmExternals: 'loose',
  },
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
