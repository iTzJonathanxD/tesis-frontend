'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Search,
  Filter,
  Eye,
  MessageCircle,
  Package,
  User,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useOrders } from '@/hooks/useOrders';

const Orders = () => {
  const { user } = useAuth();
  const [orderType, setOrderType] = useState<'seller' | 'buyer'>('seller');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { orders, loading } = useOrders({
    type: orderType,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    limit: 50,
  });

  const filteredOrders = orders.filter((order) => {
    const searchableText =
      `${order.service.title} ${order.buyer.name} ${order.seller.name}`.toLowerCase();
    return searchableText.includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'paid':
        return <DollarSign className="h-4 w-4" />;
      case 'in_progress':
        return <Package className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'paid':
        return 'Pagado';
      case 'in_progress':
        return 'En Progreso';
      case 'completed':
        return 'Completado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
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
            Debes iniciar sesión para ver tus órdenes
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
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Mis Órdenes
                </h1>
                <p className="text-gray-600 mt-1">
                  Gestiona todas tus órdenes de compra y venta
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Order Type Toggle */}
                <div
                  className="flex bg-gray-100 rounded-lg p-1"
                  role="group"
                  aria-label="Tipo de órdenes"
                >
                  <button
                    onClick={() => setOrderType('seller')}
                    type="button"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      orderType === 'seller'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Como Vendedor
                  </button>
                  <button
                    onClick={() => setOrderType('buyer')}
                    type="button"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      orderType === 'buyer'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Como Comprador
                  </button>
                </div>

                {/* Search */}
                <div className="flex-1 relative">
                  <label htmlFor="search-orders" className="sr-only">
                    Buscar órdenes
                  </label>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    id="search-orders"
                    name="search-orders"
                    type="text"
                    placeholder="Buscar órdenes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Buscar órdenes por servicio o usuario"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <label htmlFor="status-filter" className="sr-only">
                    Filtrar por estado
                  </label>
                  <select
                    id="status-filter"
                    name="status-filter"
                    title="Filtrar órdenes por estado"
                    aria-label="Filtrar órdenes por estado"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendientes</option>
                    <option value="paid">Pagados</option>
                    <option value="in_progress">En Progreso</option>
                    <option value="completed">Completados</option>
                    <option value="cancelled">Cancelados</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders List */}
        <div id="orders-content" role="main" aria-live="polite">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all'
                  ? 'No se encontraron órdenes'
                  : `No tienes órdenes como ${
                      orderType === 'seller' ? 'vendedor' : 'comprador'
                    }`}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all'
                  ? 'Intenta ajustar tus filtros de búsqueda'
                  : orderType === 'seller'
                  ? 'Cuando alguien compre tus servicios, aparecerán aquí'
                  : 'Cuando compres servicios de otros usuarios, aparecerán aquí'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link
                  href={
                    orderType === 'seller'
                      ? '/dashboard/services/create'
                      : '/services'
                  }
                >
                  <Button className="bg-primary-600 hover:bg-primary-700">
                    {orderType === 'seller'
                      ? 'Crear un servicio'
                      : 'Explorar servicios'}
                  </Button>
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order._id || `order-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Service Image */}
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {order.service.images[0] ? (
                            <Image
                              src={order.service.images[0]}
                              alt={order.service.title}
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

                        {/* Order Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {order.service.title}
                          </h3>

                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="h-4 w-4 mr-1" />
                              {orderType === 'seller' ? (
                                <span>Comprador: {order.buyer.name}</span>
                              ) : (
                                <span>Vendedor: {order.seller.name}</span>
                              )}
                            </div>

                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-primary-600" />
                              <span className="font-bold text-primary-600">
                                {order.totalAmount}
                              </span>
                            </div>

                            <Badge
                              className={`${getStatusColor(
                                order.status
                              )} border`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1">
                                {getStatusText(order.status)}
                              </span>
                            </Badge>
                          </div>

                          {order.message && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              Mensaje: {order.message}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Link href={`/dashboard/orders/${order._id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              aria-label={`Ver detalles de la orden ${order.service.title}`}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Detalles
                            </Button>
                          </Link>

                          <Button
                            variant="outline"
                            size="sm"
                            aria-label={`Abrir chat para la orden ${order.service.title}`}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          {!loading && filteredOrders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {orders.length}
                      </p>
                      <p className="text-sm text-gray-600">Total órdenes</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">
                        {orders.filter((o) => o.status === 'pending').length}
                      </p>
                      <p className="text-sm text-gray-600">Pendientes</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">
                        {
                          orders.filter((o) => o.status === 'in_progress')
                            .length
                        }
                      </p>
                      <p className="text-sm text-gray-600">En progreso</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {orders.filter((o) => o.status === 'completed').length}
                      </p>
                      <p className="text-sm text-gray-600">Completadas</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary-600">
                        $
                        {orders
                          .reduce((acc, o) => acc + o.totalAmount, 0)
                          .toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">Valor total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
