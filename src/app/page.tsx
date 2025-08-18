'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Star,
  Shield,
  BookOpen,
  Code,
  ArrowRight,
  CheckCircle,
  Zap,
  Heart,
  Target,
  Briefcase,
  DollarSign,
  Clock,
  MessageCircle,
  PenTool,
  Camera,
  Music,
  FileText,
} from 'lucide-react';
import { AuthInfoBanner } from '@/components/auth/auth-info-banner';

export default function Home() {
  const features = [
    {
      icon: Users,
      title: 'Comunidad Estudiantil',
      description:
        'Conecta con miles de estudiantes de ULEAM y crea una red de apoyo académico.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Shield,
      title: 'Seguro y Confiable',
      description:
        'Solo estudiantes verificados con email institucional pueden acceder a la plataforma.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Star,
      title: 'Sistema de Calificaciones',
      description:
        'Revisa calificaciones y comentarios antes de contratar cualquier servicio.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Zap,
      title: 'Pagos Instantáneos',
      description:
        'Recibe tus pagos de forma rápida y segura a través de múltiples métodos.',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const freelanceCategories = [
    {
      icon: Code,
      name: 'Programación & Tech',
      count: '120+ servicios',
      description: 'Desarrollo web, apps, bases de datos',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      icon: PenTool,
      name: 'Diseño Gráfico',
      count: '85+ servicios',
      description: 'Logos, branding, ilustraciones',
      color: 'from-pink-500 to-rose-600',
    },
    {
      icon: FileText,
      name: 'Redacción & Contenido',
      count: '95+ servicios',
      description: 'Artículos, copywriting, traducciones',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Camera,
      name: 'Fotografía & Video',
      count: '60+ servicios',
      description: 'Edición, producción, animación',
      color: 'from-purple-500 to-violet-600',
    },
    {
      icon: BookOpen,
      name: 'Tutorías Académicas',
      count: '150+ servicios',
      description: 'Matemáticas, ciencias, idiomas',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Music,
      name: 'Audio & Música',
      count: '40+ servicios',
      description: 'Producción, mezcla, composición',
      color: 'from-cyan-500 to-blue-500',
    },
  ];

  const stats = [
    { value: '500+', label: 'Estudiantes ULEAM', icon: Users },
    { value: '150+', label: 'Servicios Activos', icon: CheckCircle },
    { value: '$25K+', label: 'Pagado a Estudiantes', icon: DollarSign },
    { value: '4.8/5', label: 'Calificación Promedio', icon: Star },
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Estudiante de Diseño Gráfico',
      icon: PenTool,
      content:
        'He ganado más de $800 este semestre creando logos y diseños para mis compañeros. ULEAM Conecta cambió mi vida estudiantil.',
      rating: 5,
      earnings: '$800+',
      color: 'from-pink-500 to-rose-600',
    },
    {
      name: 'Carlos Mendoza',
      role: 'Estudiante de Ingeniería en Sistemas',
      icon: Code,
      content:
        'Desarrollo páginas web para pequeños negocios locales. La plataforma me ha permitido construir un portafolio increíble.',
      rating: 5,
      earnings: '$1,200+',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      name: 'Ana Rodríguez',
      role: 'Estudiante de Comunicación',
      icon: FileText,
      content:
        'Ofrezco servicios de redacción y manejo de redes sociales. Es increíble poder monetizar mis habilidades mientras estudio.',
      rating: 5,
      earnings: '$600+',
      color: 'from-green-500 to-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Scripts de diagnóstico */}
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/nuevo2.png"
            alt="Estudiantes colaborando"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Modern Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/30"></div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[
            { id: 1, x: 8, y: 12, delay: 0 },
            { id: 2, x: 88, y: 8, delay: 0.4 },
            { id: 3, x: 28, y: 78, delay: 0.8 },
            { id: 4, x: 68, y: 38, delay: 1.2 },
            { id: 5, x: 92, y: 88, delay: 1.6 },
            { id: 6, x: 18, y: 58, delay: 0.2 },
            { id: 7, x: 78, y: 22, delay: 0.6 },
            { id: 8, x: 42, y: 92, delay: 1.0 },
            { id: 9, x: 12, y: 92, delay: 1.4 },
            { id: 10, x: 88, y: 62, delay: 1.8 },
            { id: 11, x: 32, y: 18, delay: 0.3 },
            { id: 12, x: 72, y: 82, delay: 0.7 },
            { id: 13, x: 52, y: 48, delay: 1.1 },
            { id: 14, x: 22, y: 28, delay: 1.5 },
            { id: 15, x: 82, y: 72, delay: 1.9 },
          ].map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{
                x: [0, 40, -25, 0],
                y: [0, -35, 20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 6,
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

        <div className="relative container mx-auto px-4 py-16 lg:py-24 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-white font-black">
                  Servicios Estudiantiles
                </span>
                <span className="block text-white font-black">ULEAM</span>
              </h1>
              <p
                className="text-xl md:text-2xl mb-8 text-white leading-relaxed font-medium"
                style={{
                  textShadow:
                    '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)',
                }}
              >
                Plataforma oficial para conectar estudiantes de la{' '}
                <strong className="text-white font-bold">
                  Universidad Laica Eloy Alfaro de Manabí
                </strong>{' '}
                que ofrecen servicios especializados con quienes los necesitan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/services">
                  <Button
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 text-lg shadow-lg"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Explorar Servicios
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-4 text-lg shadow-lg font-semibold bg-transparent backdrop-blur-sm"
                  >
                    Únete Gratis
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-300 mr-2 drop-shadow-sm" />
                  <span
                    className="text-white font-medium"
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                  >
                    Solo estudiantes ULEAM
                  </span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-blue-300 mr-2 drop-shadow-sm" />
                  <span
                    className="text-white font-medium"
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                  >
                    Pagos seguros
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>{' '}
      {/* S
tats Section */}
      <section className="py-16 bg-gradient-to-br from-white via-gray-50 to-primary-50/30 relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Números que hablan por sí solos
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Miles de estudiantes ya están generando ingresos con sus
              habilidades
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 group-hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-display font-bold bg-gradient-to-br from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Auth Info Banner Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <AuthInfoBanner />
        </div>
      </section>
      {/* Categories Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm mb-6">
              <Briefcase className="w-4 h-4 mr-2" />
              Categorías de Servicios
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Encuentra tu nicho perfecto
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desde programación hasta diseño, desde tutorías hasta marketing
              digital. Hay un lugar para cada talento en nuestra plataforma.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {freelanceCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/services?category=${category.name}`}>
                    <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden relative h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-primary-50/30 group-hover:to-primary-100/20 transition-all duration-500"></div>

                      <CardContent className="p-8 relative">
                        <div
                          className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                        >
                          <Icon className="h-8 w-8 text-white" />
                        </div>

                        <h3 className="font-display font-bold text-xl text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                          {category.name}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                          {category.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-primary-600 bg-primary-100 rounded-full px-3 py-1">
                            {category.count}
                          </span>
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link href="/services">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
              >
                Ver Todas las Categorías
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-primary-50/30 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm mb-6">
              <Star className="w-4 h-4 mr-2" />
              ¿Por qué ULEAM Conecta?
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              La plataforma que necesitas
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Diseñada específicamente para estudiantes universitarios que
              quieren monetizar sus habilidades de forma segura y profesional.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 bg-white/80 backdrop-blur-sm h-full">
                    <CardHeader className="pb-4">
                      <div
                        className={`mx-auto w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}
                      >
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                      <CardTitle className="text-xl font-display font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm mb-6">
              <MessageCircle className="w-4 h-4 mr-2" />
              Historias de Éxito
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Lo que dicen nuestros freelancers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Estudiantes reales compartiendo sus experiencias y logros en la
              plataforma
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50/50 h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div
                        className={`w-15 h-15 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center mr-4`}
                      >
                        <testimonial.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-primary-400 fill-current"
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6 italic">
                      "{testimonial.content}"
                    </p>

                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-3 text-center">
                      <span className="text-green-700 font-bold text-lg">
                        {testimonial.earnings}
                      </span>
                      <p className="text-green-600 text-xs font-medium">
                        Ganado este semestre
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>{' '}
      {/*
 How it Works Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-gray-50 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm mb-6">
              <Target className="w-4 h-4 mr-2" />
              Cómo Funciona
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Empieza a ganar en 3 pasos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un proceso simple y directo para que comiences a monetizar tus
              habilidades hoy mismo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-primary-300 to-primary-400 transform -translate-y-1/2"></div>
            <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-primary-300 to-primary-400 transform -translate-y-1/2"></div>

            {[
              {
                step: '01',
                title: 'Crea tu Perfil',
                description:
                  'Regístrate con tu email institucional y crea un perfil profesional que destaque tus habilidades.',
                icon: Users,
                color: 'from-blue-500 to-blue-600',
              },
              {
                step: '02',
                title: 'Publica tus Servicios',
                description:
                  'Define tus servicios, establece tus precios y comienza a recibir solicitudes de otros estudiantes.',
                icon: Briefcase,
                color: 'from-green-500 to-green-600',
              },
              {
                step: '03',
                title: 'Recibe Pagos',
                description:
                  'Completa los proyectos, recibe calificaciones positivas y cobra tus ganancias de forma segura.',
                icon: DollarSign,
                color: 'from-primary-500 to-primary-600',
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <Card className="group text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 bg-white relative z-10">
                    <CardContent className="p-8">
                      <div className="relative mb-6">
                        <div
                          className={`mx-auto w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}
                        >
                          <Icon className="h-10 w-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {step.step}
                        </div>
                      </div>

                      <h3 className="text-xl font-display font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                        {step.title}
                      </h3>

                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
              >
                <Zap className="mr-2 h-5 w-5" />
                Comenzar Ahora
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>

        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[
            { id: 1, x: 5, y: 10, delay: 0 },
            { id: 2, x: 90, y: 5, delay: 0.3 },
            { id: 3, x: 25, y: 80, delay: 0.6 },
            { id: 4, x: 70, y: 30, delay: 0.9 },
            { id: 5, x: 95, y: 90, delay: 1.2 },
            { id: 6, x: 15, y: 60, delay: 1.5 },
            { id: 7, x: 80, y: 15, delay: 1.8 },
            { id: 8, x: 35, y: 95, delay: 2.1 },
            { id: 9, x: 10, y: 85, delay: 2.4 },
            { id: 10, x: 85, y: 55, delay: 2.7 },
            { id: 11, x: 40, y: 20, delay: 0.4 },
            { id: 12, x: 75, y: 75, delay: 0.8 },
            { id: 13, x: 55, y: 40, delay: 1.1 },
            { id: 14, x: 20, y: 70, delay: 1.4 },
            { id: 15, x: 65, y: 25, delay: 1.7 },
            { id: 16, x: 30, y: 50, delay: 2.0 },
            { id: 17, x: 85, y: 35, delay: 2.3 },
            { id: 18, x: 45, y: 85, delay: 2.6 },
            { id: 19, x: 60, y: 10, delay: 0.5 },
            { id: 20, x: 25, y: 65, delay: 1.3 },
          ].map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              animate={{
                x: [0, 60, -40, 0],
                y: [0, -50, 30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 7,
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

        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold text-white/90 mb-8">
              <Heart className="w-4 h-4 mr-2 text-red-400" />
              Únete a más de 1,200 estudiantes freelancers
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8 leading-tight">
              Tu futuro profesional
              <span className="bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
                {' '}
                comienza hoy
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-primary-100 mb-12 leading-relaxed max-w-3xl mx-auto">
              No esperes a graduarte para empezar a construir tu carrera.
              Comienza ahora, gana experiencia real y genera ingresos mientras
              estudias.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border-0"
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Crear Cuenta Gratuita
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 font-bold px-8 py-4 rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/50"
                >
                  Explorar Oportunidades
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <Shield className="h-8 w-8 text-blue-300 mx-auto mb-3" />
                <h4 className="font-bold text-lg mb-2">100% Verificado</h4>
                <p className="text-primary-100 text-sm">
                  Solo estudiantes ULEAM con email institucional
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <DollarSign className="h-8 w-8 text-green-300 mx-auto mb-3" />
                <h4 className="font-bold text-lg mb-2">Sin Comisiones</h4>
                <p className="text-primary-100 text-sm">
                  Quédate con el 100% de tus ganancias
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <Clock className="h-8 w-8 text-primary-300 mx-auto mb-3" />
                <h4 className="font-bold text-lg mb-2">Soporte 24/7</h4>
                <p className="text-primary-100 text-sm">
                  Estamos aquí para ayudarte cuando lo necesites
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
