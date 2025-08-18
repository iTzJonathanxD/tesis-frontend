'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Package,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useServices, useMyServices } from '@/hooks/useServices';
import { useOrders } from '@/hooks/useOrders';
import api from '@/lib/api';

interface DashboardMetrics {
  totalSales: number;
  totalEarnings: number;
  activeServices: number;
  averageRating: number;
  thisMonthSales: number;
  thisMonthEarnings: number;
  pendingOrders: number;
  completedOrders: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { myServices: services, isLoading: servicesLoading } = useMyServices();
  const { orders, loading: ordersLoading } = useOrders({
    type: 'seller',
    limit: 5,
  });
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/seller-metrics/statistics');
        setMetrics(response.data.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Denegado
          </h2>
          <p className="text-gray-600 mb-6">
            Debes iniciar sesión para acceder al dashboard
          </p>
          <Link href="/auth/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard de Freelancer
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenido de vuelta, {user.name}
              </p>
            </div>
            <Link href="/dashboard/services/create">
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="h-4 w-4 mr-2" />
                Crear Servicio
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Ganancias Totales
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      $
                      {metricsLoading
                        ? '...'
                        : metrics?.totalEarnings.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">
                    $
                    {metricsLoading
                      ? '...'
                      : metrics?.thisMonthEarnings.toFixed(2) || '0.00'}
                  </span>
                  <span className="text-gray-600 ml-1">este mes</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Servicios Activos
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metricsLoading ? '...' : metrics?.activeServices || 0}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <Package className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-blue-600 font-medium">
                    {Array.isArray(services) ? services.length : 0}
                  </span>
                  <span className="text-gray-600 ml-1">total</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Ventas Totales
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metricsLoading ? '...' : metrics?.totalSales || 0}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-purple-600 font-medium">
                    {metricsLoading ? '...' : metrics?.thisMonthSales || 0}
                  </span>
                  <span className="text-gray-600 ml-1">este mes</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Calificación Promedio
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metricsLoading
                        ? '...'
                        : metrics?.averageRating.toFixed(1) || '0.0'}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-yellow-600 font-medium">
                    {metricsLoading ? '...' : metrics?.completedOrders || 0}
                  </span>
                  <span className="text-gray-600 ml-1">
                    órdenes completadas
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Services */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Mis Servicios
                </CardTitle>
                <Link href="/dashboard/services">
                  <Button variant="outline" size="sm">
                    Ver Todos
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {servicesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={`service-skeleton-${i}`}
                        className="animate-pulse"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Aún no has creado ningún servicio
                    </p>
                    <Link href="/dashboard/services/create">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Crear tu primer servicio
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.isArray(services) &&
                      services.slice(0, 3).map((service, index) => (
                        <div
                          key={service._id || `service-${index}`}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                            {service.images[0] ? (
                              <Image
                                src={service.images[0]}
                                alt={service.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {service.title}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm font-semibold text-primary-600">
                                ${service.price}
                              </span>
                              <Badge
                                className={getStatusColor(
                                  service.isActive ? 'active' : 'inactive'
                                )}
                                variant="secondary"
                              >
                                {getStatusIcon(
                                  service.isActive ? 'active' : 'inactive'
                                )}
                                <span className="ml-1 capitalize">
                                  {service.isActive ? 'active' : 'inactive'}
                                </span>
                              </Badge>
                            </div>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">
                                {(service.rating || 0).toFixed(1)} (
                                {service.totalReviews || 0})
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link href={`/dashboard/services/${service._id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link
                              href={`/dashboard/services/${service._id}/edit`}
                            >
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Órdenes Recientes
                </CardTitle>
                <Link href="/dashboard/orders">
                  <Button variant="outline" size="sm">
                    Ver Todas
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={`order-skeleton-${i}`}
                        className="animate-pulse"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No tienes órdenes recientes</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <div
                        key={order._id || `order-${index}`}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                          {order.buyer.profilePhoto ? (
                            <Image
                              src={order.buyer.profilePhoto}
                              alt={order.buyer.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {order.service.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            por {order.buyer.name}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm font-semibold text-primary-600">
                              ${order.totalAmount}
                            </span>
                            <Badge
                              className={getStatusColor(order.status)}
                              variant="secondary"
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">
                                {order.status}
                              </span>
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href={`/dashboard/orders/${order._id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
