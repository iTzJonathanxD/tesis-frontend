'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Plus,
  Bell,
} from 'lucide-react';
import { cn, generateInitials } from '@/lib/utils';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigationItems = [
    { href: '/', label: 'Inicio' },
    { href: '/services', label: 'Servicios' },
  ];

  const userMenuItems = [
    { href: '/dashboard', label: 'Mi Dashboard', icon: User },
    { href: '/dashboard/orders', label: 'Mis Órdenes', icon: ShoppingBag },
    { href: '/dashboard/services', label: 'Mis Servicios', icon: Settings },
    { href: '/dashboard/messages', label: 'Mensajes', icon: MessageSquare },
    { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <>
      {/* Promotional Banner */}
      <div className="relative bg-primary-900 border-b border-primary-800 py-2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-primary-800/60 to-primary-900/80"></div>
        <div className="relative flex animate-marquee whitespace-nowrap">
          <span className="mx-6 text-xs font-medium flex items-center text-primary-100">
            ✨ Monetiza tu talento • Comparte tus habilidades profesionales •
            Conecta con estudiantes ULEAM
          </span>
          <span className="mx-6 text-xs font-medium flex items-center text-primary-200">
            🚀 Plataforma de servicios académicos • Ecosistema de colaboración
            universitaria • Genera ingresos
          </span>
          <span className="mx-6 text-xs font-medium flex items-center text-primary-200">
            💡 Marketplace estudiantil • Soluciones innovadoras • Networking
            profesional
          </span>
          <span className="mx-6 text-xs font-medium flex items-center text-primary-100">
            ⭐ Servicios freelance • Desarrollo de competencias • Economía
            digital estudiantil
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-primary-800 via-primary-700 to-primary-800 shadow-2xl border-b border-primary-600/50">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-900/10"></div>

        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/3 w-24 h-24 bg-primary-300/15 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-16 h-16 bg-primary-500/15 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 group relative z-10"
            >
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-primary-400/20 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-all duration-500"></div>
                <Image
                  src="/logo-sinfondo.png"
                  alt="ULEAM Conecta"
                  width={48}
                  height={48}
                  className="h-12 w-12 transition-all duration-500 group-hover:scale-110 filter brightness-0 invert logo-glow relative z-10"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-white tracking-tight drop-shadow-md group-hover:text-primary-300 transition-all duration-300">
                  ULEAM
                </span>
                <span className="font-display text-xs font-semibold text-gray-300 -mt-1 group-hover:text-primary-400 transition-colors duration-300">
                  Conecta
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 relative z-10">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-sm font-medium text-primary-100 transition-all duration-300 hover:text-white group px-4 py-2 rounded-lg hover:bg-primary-600/20 backdrop-blur-sm border border-transparent hover:border-primary-400/30 nav-link"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-300 to-primary-400 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-400/10 to-primary-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8 relative z-10">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-300 transition-all duration-300 group-focus-within:text-primary-200 group-focus-within:scale-110" />
                <input
                  type="text"
                  placeholder="Buscar servicios, freelancers..."
                  className="w-full rounded-xl border border-primary-600 bg-primary-800/60 backdrop-blur-md pl-12 pr-4 py-3 text-sm text-white placeholder-primary-300 transition-all duration-300 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:bg-primary-700/60 hover:bg-primary-700/40 focus:shadow-lg focus:shadow-primary-400/20"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-3 relative z-[100]">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <NotificationBell />

                  {/* Create Service Button */}
                  <Link href="/dashboard/services/create">
                    <Button
                      size="sm"
                      className="hidden sm:flex bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border border-blue-400/30 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6 py-2.5 rounded-xl hover:scale-105"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Publicar Servicio
                    </Button>
                  </Link>

                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => {
                        console.log('User menu button clicked!');
                        setIsUserMenuOpen(!isUserMenuOpen);
                      }}
                      className="flex items-center space-x-3 rounded-xl p-2 hover:bg-white/10 cursor-pointer bg-white/5 border border-white/20 transition-all duration-200 hover:scale-105"
                    >
                      {user?.profilePhoto ? (
                        <Image
                          src={user.profilePhoto}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-primary-600 shadow-sm">
                          {generateInitials(user?.name || 'U')}
                        </div>
                      )}
                      <div className="hidden sm:block text-left">
                        <div className="text-sm font-medium text-white">
                          {user?.name || 'Usuario'}
                        </div>
                        {user?.role && (
                          <div className="text-xs text-primary-200">
                            {user.role === 'admin'
                              ? 'Administrador'
                              : 'Estudiante'}
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Simplified Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div
                        className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden"
                        style={{ zIndex: 99999 }}
                      >
                        {/* User Info Header */}
                        <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            {user?.profilePhoto ? (
                              <Image
                                src={user.profilePhoto}
                                alt={user.name || 'Usuario'}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white text-sm font-semibold shadow-sm">
                                {generateInitials(user?.name || 'Usuario')}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {user?.name || 'Usuario'}
                              </p>
                              <p className="text-xs text-gray-600 truncate">
                                {user?.email || 'email@ejemplo.com'}
                              </p>
                              {user?.facultyId && (
                                <p className="text-xs text-primary-600 truncate">
                                  {user.facultyId.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          {userMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                                onClick={() => {
                                  console.log('Navigating to:', item.href);
                                  setIsUserMenuOpen(false);
                                }}
                              >
                                <Icon className="h-4 w-4 mr-3 text-gray-500" />
                                <span>{item.label}</span>
                              </Link>
                            );
                          })}

                          {/* Divider */}
                          <div className="border-t border-gray-100 my-2"></div>

                          {/* Logout Button */}
                          <button
                            onClick={() => {
                              console.log('Logging out');
                              handleLogout();
                            }}
                            className="flex w-full items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            <span>Cerrar Sesión</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-medium text-primary-100 hover:text-white hover:bg-primary-600/20 transition-all duration-300 px-6 py-2.5 rounded-lg border border-primary-600/40 hover:border-primary-400/60 backdrop-blur-sm"
                    >
                      Ingresar
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white border border-primary-400/30 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-6 py-2.5 rounded-lg hover:scale-105"
                    >
                      Inscribirse
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden hover:bg-primary-600/20 transition-all duration-300 text-primary-100 rounded-lg p-2 hover:scale-105 border border-transparent hover:border-primary-400/30"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-white transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="h-5 w-5 text-primary-100 hover:text-white transition-transform duration-300" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-primary-600/50 bg-gradient-to-b from-primary-800/95 to-primary-900/95 backdrop-blur-lg">
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Search */}
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-300 transition-all duration-300 group-focus-within:text-primary-200 group-focus-within:scale-110" />
                  <input
                    type="text"
                    placeholder="Buscar servicios..."
                    className="w-full rounded-xl border border-primary-600 bg-primary-800/60 backdrop-blur-md pl-12 pr-4 py-3 text-sm text-white placeholder-primary-300 transition-all duration-300 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:bg-primary-700/60 focus:shadow-lg focus:shadow-primary-400/20"
                  />
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block py-3 px-4 text-sm font-medium text-primary-100 hover:text-white hover:bg-primary-600/20 rounded-lg transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-primary-400/30"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile User Menu */}
                {isAuthenticated && (
                  <div className="border-t border-secondary-200 pt-3 space-y-2">
                    <Link
                      href="/services/create"
                      className="flex items-center py-2 text-sm font-medium text-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Plus className="h-4 w-4 mr-3" />
                      Crear Servicio
                    </Link>
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center py-2 text-sm text-secondary-700 cursor-pointer hover:bg-secondary-50 rounded-md px-2"
                          onClick={(e) => {
                            console.log(
                              'Mobile clicking on:',
                              item.href,
                              item.label
                            );
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <Icon className="h-4 w-4 mr-3" />
                          {item.label}
                        </Link>
                      );
                    })}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center py-2 text-sm text-error-600"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Click outside to close dropdowns */}
        {(isUserMenuOpen || isMobileMenuOpen) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsUserMenuOpen(false);
              setIsMobileMenuOpen(false);
            }}
          />
        )}
      </header>
    </>
  );
};

export default Header;
