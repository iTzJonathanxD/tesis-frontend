'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { AnimatedInput } from '@/components/ui/animated-input';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedFormContainer } from '@/components/auth/animated-form-container';
import { AnimatedLogo } from '@/components/auth/animated-logo';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{
                x: [0, 30, -20, 0],
                y: [0, -25, 15, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: particle.delay,
                ease: 'easeInOut',
              }}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 flex flex-col justify-center px-12 text-white"
        >
          <div className="max-w-md">
            {/* Main Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-4xl font-bold leading-tight text-white">
                Bienvenido de vuelta
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                Accede a la plataforma estudiantil de ULEAM y conecta con tu
                comunidad universitaria
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 space-y-3"
            >
              {[
                'Servicios estudiantiles exclusivos',
                'Red de contactos universitarios',
                'Plataforma segura y confiable',
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                    className="w-2 h-2 bg-primary-300 rounded-full"
                  />
                  <span className="text-white/90">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
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
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full opacity-30"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full opacity-20"
          />
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6">
            <AnimatedLogo
              variant="mobile"
              logoSrc="/logo-negro.png"
              title="ULEAM"
              subtitle="CONECTA"
            />
          </div>

          {/* Desktop Logo */}
          <div className="hidden lg:block mb-6">
            <AnimatedLogo
              variant="desktop"
              logoSrc="/logo-negro.png"
              title="ULEAM"
              subtitle="CONECTA"
            />
          </div>

          <AnimatedFormContainer>
            {/* Welcome Message for Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="hidden lg:block text-center mb-4"
            >
              <h2 className="text-xl font-bold text-gray-800">
                Bienvenido de vuelta
              </h2>
              <p className="text-gray-600 mt-1 text-sm">
                Inicia sesión en tu cuenta
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <AnimatedInput
                type="email"
                name="email"
                label="Correo electrónico"
                placeholder="tu.email@uleam.edu.ec"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail className="h-5 w-5" />}
                autoComplete="email"
              />

              {/* Password Input */}
              <AnimatedInput
                type={showPassword ? 'text' : 'password'}
                name="password"
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                }
                autoComplete="current-password"
              />

              {/* Remember & Forgot Password */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all duration-200"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200 select-none">
                    Recordarme
                  </span>
                </label>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline transition-all duration-300"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </motion.div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <AnimatedButton
                  type="submit"
                  size="lg"
                  loading={loading}
                  disabled={loading}
                  className="w-full"
                >
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
                </AnimatedButton>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="relative my-6"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">o</span>
              </div>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center space-y-3"
            >
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-block"
                >
                  <Link
                    href="/auth/register"
                    className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all duration-300"
                  >
                    Regístrate aquí
                  </Link>
                </motion.span>
              </p>

              {/* Back to Home */}
              <motion.div whileHover={{ x: -5 }}>
                <Link
                  href="/"
                  className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 transition-all duration-300 group"
                >
                  <span className="transform transition-transform group-hover:-translate-x-1">
                    ←
                  </span>
                  <span className="ml-1">Volver al inicio</span>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatedFormContainer>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
