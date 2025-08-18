'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(formData);
      router.push('/dashboard');
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding with Background */}
      <div className="hidden lg:flex lg:w-1/3 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/fondo-2.jpg"
            alt="Background ULEAM"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/85 to-primary-700/80"></div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[
            { id: 1, x: 10, y: 20, delay: 0 },
            { id: 2, x: 80, y: 10, delay: 0.5 },
            { id: 3, x: 30, y: 70, delay: 1 },
            { id: 4, x: 60, y: 40, delay: 1.5 },
            { id: 5, x: 90, y: 80, delay: 0.3 },
            { id: 6, x: 20, y: 50, delay: 0.8 },
            { id: 7, x: 70, y: 25, delay: 1.2 },
            { id: 8, x: 45, y: 85, delay: 0.2 },
            { id: 9, x: 15, y: 90, delay: 1.8 },
            { id: 10, x: 85, y: 60, delay: 0.7 },
            { id: 11, x: 35, y: 15, delay: 1.4 },
            { id: 12, x: 75, y: 75, delay: 0.9 },
          ].map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            {/* Main Message */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight text-white">
                Bienvenido de vuelta
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                Accede a la plataforma estudiantil de ULEAM y conecta con tu
                comunidad universitaria
              </p>
            </div>

            {/* Features */}
            <div className="mt-8 space-y-3">
              {[
                'Servicios estudiantiles exclusivos',
                'Red de contactos universitarios',
                'Plataforma segura y confiable',
              ].map((feature, index) => (
                <div key={feature} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-300 rounded-full animate-pulse" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 lg:w-2/3 flex items-center justify-center p-6 bg-white relative">
        {/* Mobile Background for small screens */}
        <div className="lg:hidden fixed inset-0">
          <Image
            src="/fondo-2.jpg"
            alt="Background ULEAM"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 via-primary-800/90 to-primary-700/85"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full opacity-30 animate-pulse" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full opacity-20 animate-pulse" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6">
            <div className="text-center">
              <Image
                src="/logo-negro.png"
                alt="ULEAM Logo"
                width={60}
                height={60}
                className="mx-auto mb-2"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">ULEAM</h1>
                <p className="text-sm text-gray-600">CONECTA</p>
              </div>
            </div>
          </div>

          {/* Desktop Logo */}
          <div className="hidden lg:block mb-6">
            <div className="text-center">
              <Image
                src="/logo-negro.png"
                alt="ULEAM Logo"
                width={80}
                height={80}
                className="mx-auto mb-4"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">ULEAM</h1>
                <p className="text-lg text-gray-600">CONECTA</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md space-y-8">
            {/* Welcome Message for Desktop */}
            <div className="hidden lg:block text-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Bienvenido de vuelta
              </h2>
              <p className="text-gray-600 mt-1 text-sm">
                Inicia sesión en tu cuenta
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu.email@uleam.edu.ec"
                    className="pl-10"
                    autoComplete="email"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    className="pl-10 pr-10"
                    autoComplete="current-password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all duration-200"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200 select-none">
                    Recordarme
                  </span>
                </label>
                <div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline transition-all duration-300"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Iniciar Sesión
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">o</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <span className="inline-block">
                  <Link
                    href="/auth/register"
                    className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all duration-300"
                  >
                    Regístrate aquí
                  </Link>
                </span>
              </p>

              {/* Back to Home */}
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 transition-all duration-300 group"
                >
                  <span className="transform transition-transform group-hover:-translate-x-1">
                    ←
                  </span>
                  <span className="ml-1">Volver al inicio</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
