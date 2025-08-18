'use client';

import { useUsers } from '@/hooks/useUsers';
import { useServices } from '@/hooks/useServices';
import { useOrders } from '@/hooks/useOrders';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  ShoppingBag,
  Package,
  TrendingUp,
  UserCheck,
  AlertCircle,
  BookOpen,
  Star,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';

export default function AdminDashboard() {
  noStore(); // Prevenir caching y forzar renderizado dinámico

  const { users, isLoading: usersLoading } = useUsers();
  const { getServices } = useServices();
  const { orders, total: ordersTotal } = useOrders();
  const ordersLoading = false; // useOrders doesn't have loading state

  const services = getServices.data || [];
  const totalServices = services.length;

  const stats = [
    {
      name: 'Estudiantes Registrados',
      value: users?.length || 0,
      icon: Users,
      color: 'bg-blue-500',
      description: 'Total de usuarios en la plataforma',
      loading: usersLoading,
    },
    {
      name: 'Servicios Publicados',
      value: totalServices,
      icon: Package,
      color: 'bg-green-500',
      description: 'Servicios disponibles en la plataforma',
      loading: getServices.isLoading,
    },
    {
      name: 'Órdenes Realizadas',
      value: ordersTotal || 0,
      icon: ShoppingBag,
      color: 'bg-purple-500',
      description: 'Total de transacciones procesadas',
      loading: ordersLoading,
    },
    {
      name: 'Servicios Activos',
      value: services.filter((s) => s.status === 'active').length,
      icon: TrendingUp,
      color: 'bg-orange-500',
      description: 'Servicios actualmente disponibles',
      loading: getServices.isLoading,
    },
  ];

  const quickStats = [
    {
      name: 'Estudiantes Verificados',
      value: users?.filter((u) => u.isVerified).length || 0,
      total: users?.length || 0,
      icon: UserCheck,
      color: 'text-green-600',
      percentage: users?.length
        ? Math.round(
            (users.filter((u) => u.isVerified).length / users.length) * 100
          )
        : 0,
    },
    {
      name: 'Servicios Suspendidos',
      value: services.filter((s) => s.status === 'suspended').length,
      total: services.length,
      icon: AlertCircle,
      color: 'text-orange-600',
      percentage: services.length
        ? Math.round(
            (services.filter((s) => s.status === 'suspended').length /
              services.length) *
              100
          )
        : 0,
    },
    {
      name: 'Promedio de Calificación',
      value: services.length
        ? (
            services.reduce((acc, s) => acc + s.rating, 0) / services.length
          ).toFixed(1)
        : '0.0',
      icon: Star,
      color: 'text-yellow-600',
      suffix: '⭐',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">
          Panel de Administración - ULEAM Servicios
        </h1>
        <p className="text-blue-100 text-lg">
          Gestiona la plataforma de servicios estudiantiles de la Universidad
          Laica Eloy Alfaro de Manabí
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.name}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    {stat.loading ? (
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value.toLocaleString()}
                      </div>
                    )}
                  </dd>
                  <dd className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {quickStats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {typeof stat.value === 'string'
                      ? stat.value
                      : stat.value.toLocaleString()}
                    {stat.suffix && <span className="ml-1">{stat.suffix}</span>}
                    {stat.total && (
                      <span className="text-sm text-gray-500 ml-2">
                        / {stat.total.toLocaleString()}
                      </span>
                    )}
                  </p>
                  {stat.percentage !== undefined && (
                    <p className="text-sm text-gray-500">
                      {stat.percentage}% del total
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Estudiantes Recientes
            </h3>
            <Link
              href="/admin/users"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm leading-5 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Todos
            </Link>
          </div>
          <div className="space-y-4">
            {usersLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 animate-pulse"
                  >
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              : users?.slice(0, 5).map((user) => (
                  <div key={user._id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-700">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isVerified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {user.isVerified ? 'Verificado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                ))}
          </div>
        </Card>

        {/* Popular Services */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Servicios Populares
            </h3>
            <Link
              href="/services"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm leading-5 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Ver Todos
            </Link>
          </div>
          <div className="space-y-4">
            {getServices.isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 animate-pulse"
                  >
                    <div className="h-10 w-10 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              : services.slice(0, 5).map((service) => (
                  <div
                    key={service._id}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded bg-green-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {service.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${service.price} • {service.rating.toFixed(1)}⭐ (
                        {service.totalReviews} reseñas)
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : service.status === 'suspended'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {service.status === 'active'
                          ? 'Activo'
                          : service.status === 'suspended'
                          ? 'Suspendido'
                          : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/users"
            className="w-full flex items-center justify-start px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Users className="h-4 w-4 mr-2" />
            Gestionar Usuarios
          </Link>
          <Link
            href="/admin/uploads"
            className="w-full flex items-center justify-start px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Package className="h-4 w-4 mr-2" />
            Revisar Servicios
          </Link>
          <Link
            href="/admin/metrics"
            className="w-full flex items-center justify-start px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Ver Métricas
          </Link>
          <Link
            href="/services"
            className="w-full flex items-center justify-start px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Plataforma
          </Link>
        </div>
      </Card>
    </div>
  );
}

// Forzar la renderización dinámica para evitar prerenderizado
export const dynamic = 'force-dynamic';
