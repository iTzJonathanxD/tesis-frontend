'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  ExternalLink,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/services', label: 'Servicios' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/faq', label: 'Preguntas Frecuentes' },
    { href: '/contact', label: 'Contacto' },
    { href: '/help', label: 'Centro de Ayuda' },
  ];

  const legalLinks = [
    { href: '/terms', label: 'Términos de Servicio' },
    { href: '/privacy', label: 'Política de Privacidad' },
    { href: '/cookies', label: 'Política de Cookies' },
    { href: '/guidelines', label: 'Normas de la Comunidad' },
  ];

  const socialLinks = [
    {
      href: 'https://facebook.com/uleam.oficial',
      label: 'Facebook',
      icon: Facebook,
    },
    {
      href: 'https://instagram.com/uleam_oficial',
      label: 'Instagram',
      icon: Instagram,
    },
    {
      href: 'https://linkedin.com/company/uleam',
      label: 'LinkedIn',
      icon: Linkedin,
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-secondary-900 via-primary-900 to-secondary-800 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-transparent to-accent-500/10"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-400/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-4 mb-6 group">
              <div className="relative">
                <Image
                  src="/logo-sinfondo.png"
                  alt="ULEAM Conecta"
                  width={48}
                  height={48}
                  className="h-12 w-12 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 filter brightness-0 invert drop-shadow-lg"
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-primary-400/20 to-accent-300/20 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold text-white tracking-tight">
                  ULEAM
                </span>
                <span className="font-display text-sm font-semibold text-primary-200 -mt-1">
                  Conecta
                </span>
              </div>
            </Link>
            <p className="text-secondary-200 text-sm mb-6 leading-relaxed backdrop-blur-sm">
              Plataforma innovadora que potencia el ecosistema estudiantil ULEAM
              mediante soluciones tecnológicas para el intercambio de servicios
              académicos y networking profesional.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-gradient-to-r hover:from-primary-500 hover:to-accent-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/25"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="font-display text-lg font-bold text-white mb-6 bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-secondary-200 hover:text-white transition-all duration-300 text-sm font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mr-3 group-hover:bg-accent-400 transition-colors duration-300"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="font-display text-lg font-bold text-white mb-6 bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
              Marco Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-secondary-200 hover:text-white transition-all duration-300 text-sm font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mr-3 group-hover:bg-accent-400 transition-colors duration-300"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="font-display text-lg font-bold text-white mb-6 bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
              Contacto Institucional
            </h3>
            <div className="space-y-4">
              <div className="group flex items-start space-x-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-300">
                <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div className="text-sm text-secondary-200 group-hover:text-white transition-colors duration-300">
                  <p className="font-semibold text-white">
                    Universidad Laica Eloy Alfaro de Manabí
                  </p>
                  <p>Ciudadela Universitaria</p>
                  <p>Manta, Manabí, Ecuador</p>
                </div>
              </div>

              <div className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-300">
                <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <a
                  href="tel:+59352623740"
                  className="text-sm text-secondary-200 hover:text-white transition-colors font-medium"
                >
                  +593 5 262-3740
                </a>
              </div>

              <div className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-300">
                <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <a
                  href="mailto:contacto@uleam.edu.ec"
                  className="text-sm text-secondary-200 hover:text-white transition-colors font-medium"
                >
                  contacto@uleam.edu.ec
                </a>
              </div>

              <div className="pt-2">
                <a
                  href="https://www.uleam.edu.ec"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-400/30 text-sm text-primary-300 hover:text-white hover:from-primary-500 hover:to-accent-500 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <span className="font-medium">Sitio Web Oficial</span>
                  <ExternalLink className="h-3 w-3 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative mt-16">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
              <div className="text-center lg:text-left">
                <p className="text-sm font-medium text-white/90 mb-2">
                  © {currentYear} ULEAM Conecta. Todos los derechos reservados.
                </p>
                <p className="text-sm text-secondary-200 flex items-center justify-center lg:justify-start">
                  Desarrollado con
                  <span className="mx-2 text-red-400 animate-pulse">❤️</span>
                  para la comunidad estudiantil de ULEAM
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm">
                <div className="flex items-center space-x-4 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                  <span className="text-primary-300 font-semibold">
                    Versión 1.0.0
                  </span>
                  <span className="text-white/50">•</span>
                  <Link
                    href="/status"
                    className="text-secondary-200 hover:text-white transition-colors font-medium flex items-center"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                    Estado del Sistema
                  </Link>
                </div>

                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-400/30">
                  <span className="text-xs text-primary-300 font-medium">
                    🚀 Beta
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
