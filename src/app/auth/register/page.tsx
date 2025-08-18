'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFaculties, useCareers } from '@/hooks/useAcademic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Faculty, Career } from '@/types';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { isUleamEmail, validatePassword } from '@/lib/utils';

const RegisterPage = () => {
  const router = useRouter();
  const { register, loading } = useAuth();
  const { faculties } = useFaculties();
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const { careers } = useCareers(selectedFaculty);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    facultyId: '',
    careerId: '',
    description: '',
    socialNetworks: {
      instagram: '',
      facebook: '',
      linkedin: '',
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    errors: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('socialNetworks.')) {
      const socialName = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        socialNetworks: {
          ...prev.socialNetworks,
          [socialName]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Real-time password validation
    if (name === 'password') {
      const validation = validatePassword(value);
      const minLength = value.length >= 8;
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const isValid = minLength && hasUpper && hasLower && hasNumber;

      setPasswordValidation({
        isValid,
        minLength,
        hasUpper,
        hasLower,
        hasNumber,
        errors: validation.errors,
      });
    }

    // Handle faculty change
    if (name === 'facultyId') {
      setSelectedFaculty(value);
      setFormData((prev) => ({
        ...prev,
        facultyId: value,
        careerId: '', // Reset career when faculty changes
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!isUleamEmail(formData.email)) {
      newErrors.email =
        'Debes usar tu correo institucional de ULEAM (@uleam.edu.ec o @live.uleam.edu.ec)';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!passwordValidation.isValid) {
      newErrors.password = 'La contraseña no cumple con los requisitos';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.facultyId) {
      newErrors.facultyId = 'Selecciona tu facultad';
    }

    if (!formData.careerId) {
      newErrors.careerId = 'Selecciona tu carrera';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        facultyId: formData.facultyId,
        careerId: formData.careerId,
        description: formData.description.trim() || undefined,
        socialNetworks: {
          instagram: formData.socialNetworks.instagram.trim() || undefined,
          facebook: formData.socialNetworks.facebook.trim() || undefined,
          linkedin: formData.socialNetworks.linkedin.trim() || undefined,
        },
      });
      router.push(
        '/auth/verify-email?email=' + encodeURIComponent(formData.email)
      );
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  // Prepare faculty options
  const facultyOptions = [
    { value: '', label: 'Selecciona tu facultad' },
    ...(faculties?.map((faculty: Faculty) => ({
      value: faculty._id,
      label: faculty.name,
    })) || []),
  ];

  // Prepare career options
  const careerOptions = [
    { value: '', label: 'Selecciona tu carrera' },
    ...(careers?.map((career: Career) => ({
      value: career._id,
      label: career.name,
    })) || []),
  ];

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
            { id: 1, x: 5, y: 15, delay: 0 },
            { id: 2, x: 85, y: 5, delay: 0.3 },
            { id: 3, x: 25, y: 75, delay: 0.6 },
            { id: 4, x: 65, y: 35, delay: 0.9 },
            { id: 5, x: 95, y: 85, delay: 1.2 },
            { id: 6, x: 15, y: 55, delay: 1.5 },
            { id: 7, x: 75, y: 20, delay: 1.8 },
            { id: 8, x: 40, y: 90, delay: 2.1 },
            { id: 9, x: 10, y: 95, delay: 2.4 },
            { id: 10, x: 90, y: 65, delay: 2.7 },
            { id: 11, x: 30, y: 10, delay: 0.4 },
            { id: 12, x: 70, y: 80, delay: 0.8 },
            { id: 13, x: 50, y: 45, delay: 1.1 },
            { id: 14, x: 20, y: 25, delay: 1.4 },
            { id: 15, x: 80, y: 70, delay: 1.7 },
          ].map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              animate={{
                x: [0, 50, -30, 0],
                y: [0, -40, 25, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 5,
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
            {/* Logo */}

            {/* Main Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-4xl font-bold leading-tight text-white">
                Únete a la comunidad estudiantil
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                Crea tu cuenta y comienza a formar parte del ecosistema
                estudiantil más grande de ULEAM
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-8 space-y-3"
            >
              {[
                'Acceso gratuito de por vida',
                'Solo estudiantes ULEAM verificados',
                'Monetiza tus habilidades',
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: index * 0.4,
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

      {/* Right Side - Register Form */}
      <div className="flex-1 lg:w-2/3 flex items-center justify-center p-6 bg-white relative overflow-y-auto">
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
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full opacity-40"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full opacity-30"
          />
        </div>

        <div className="relative z-10 w-full max-w-2xl my-4">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-4">
            <AnimatedLogo
              variant="mobile"
              logoSrc="/logo-sinfondo.png"
              title="ULEAM"
              subtitle="CONECTA"
            />
          </div>

          {/* Desktop Logo */}
          <div className="hidden lg:block mb-4">
            <AnimatedLogo
              variant="desktop"
              logoSrc="/logo-sinfondo.png"
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
              className="hidden lg:block text-center mb-6"
            >
              <h2 className="text-2xl font-bold text-gray-800">
                Únete a ULEAM Conecta
              </h2>
              <p className="text-gray-600 mt-2">Crea tu cuenta estudiantil</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <AnimatedInput
                type="text"
                name="name"
                label="Nombre completo"
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                icon={<User className="h-5 w-5" />}
                autoComplete="name"
              />

              {/* Email Input */}
              <AnimatedInput
                type="email"
                name="email"
                label="Correo institucional ULEAM"
                placeholder="tu.email@uleam.edu.ec"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<Mail className="h-5 w-5" />}
                autoComplete="email"
              />

              {/* Faculty and Career in Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatedSelect
                  name="facultyId"
                  label="Facultad"
                  value={formData.facultyId}
                  onChange={handleChange}
                  error={errors.facultyId}
                  options={facultyOptions}
                />

                <AnimatedSelect
                  name="careerId"
                  label="Carrera"
                  value={formData.careerId}
                  onChange={handleChange}
                  error={errors.careerId}
                  options={careerOptions}
                  disabled={!selectedFaculty}
                />
              </div>

              {/* Password Inputs in Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatedInput
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  label="Contraseña"
                  placeholder="Tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  icon={<Lock className="h-5 w-5" />}
                  rightIcon={
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </motion.button>
                  }
                  autoComplete="new-password"
                />

                <AnimatedInput
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  label="Confirmar contraseña"
                  placeholder="Confirma tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  icon={<Lock className="h-5 w-5" />}
                  rightIcon={
                    <motion.button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </motion.button>
                  }
                  autoComplete="new-password"
                />
              </div>

              {/* Password validation */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border"
                >
                  <p className="font-semibold text-gray-700 mb-2 text-xs">
                    Requisitos de la contraseña:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'minLength', label: '8+ caracteres' },
                      { key: 'hasUpper', label: 'Mayúscula' },
                      { key: 'hasLower', label: 'Minúscula' },
                      { key: 'hasNumber', label: 'Número' },
                    ].map((requirement) => (
                      <motion.div
                        key={requirement.key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-center gap-2 text-xs ${
                          passwordValidation[
                            requirement.key as keyof typeof passwordValidation
                          ]
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }`}
                      >
                        <motion.div
                          animate={{
                            scale: passwordValidation[
                              requirement.key as keyof typeof passwordValidation
                            ]
                              ? [1, 1.2, 1]
                              : 1,
                          }}
                          transition={{ duration: 0.3 }}
                          className={`w-2 h-2 rounded-full ${
                            passwordValidation[
                              requirement.key as keyof typeof passwordValidation
                            ]
                              ? 'bg-green-500'
                              : 'bg-gray-400'
                          }`}
                        />
                        <span>{requirement.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-2"
              >
                <label className="text-sm font-semibold text-gray-700">
                  Descripción{' '}
                  <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <motion.textarea
                  whileFocus={{ scale: 1.02 }}
                  name="description"
                  placeholder="Cuéntanos un poco sobre ti y tus habilidades..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-0 focus:border-primary-500 bg-white text-gray-900 placeholder-gray-500 resize-none transition-all duration-300 hover:border-gray-400 hover:shadow-md focus:shadow-lg text-sm"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
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
                      Creando tu cuenta...
                    </>
                  ) : (
                    <>
                      <GraduationCap className="mr-2 h-5 w-5" />
                      Crear cuenta
                    </>
                  )}
                </AnimatedButton>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="relative my-6"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">o</span>
              </div>
            </motion.div>

            {/* Sign In Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-center space-y-3"
            >
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-block"
                >
                  <Link
                    href="/auth/login"
                    className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-all duration-300"
                  >
                    Iniciar sesión
                  </Link>
                </motion.span>
              </p>

              {/* Back to Home */}
              <motion.div whileHover={{ x: -5 }}>
                <Link
                  href="/"
                  className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 font-medium transition-all duration-300"
                >
                  ← Volver al inicio
                </Link>
              </motion.div>
            </motion.div>
          </AnimatedFormContainer>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
